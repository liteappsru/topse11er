const request = require('request-promise');
const MongoClient = require('mongodb').MongoClient;
const appConfig = require('./config');
let aggregator = require('./aggregator');
const connector = require('./connector');
const users = require('./user');
let tsUser;
let userData;
let allUsers;
let userIterator;
const dateFormat = require('dateformat');
let callback;
let connection;

const importTypes = {all: 'all',
                    user: 'user',
                    last: 'last',
                    today: 'today'};

module.exports = {collect:
        function (_connection, _userData, i, wb, oz, type, _callback) {
            collect(_connection, _userData, i, wb, oz, type, _callback);
        },
        importTypes: importTypes,
        collectLast:function (req,res){
            collectLast(req,res);
        },
        collectAll:function (req,res){
            collectAll(req,res);
        },
        aggregate:function (req,res){
            aggregate().then(()=>{res.send('done')});
    }
    };

function getOzOptions(method, uri, type = undefined){
    let ozonOptions = appConfig.ozOptions;
    let to = '2020-08-18T00:00:00.032Z';

    ozonOptions.method = method;
    ozonOptions.uri = uri;
    let since = '';
    if(type) {
        if (type == importTypes.last){
            since = dateFormat(Date.now(),"yyyy-mm-dd") + "T00:00:00.032Z";
        }
        else {
            since = '2019-07-01T00:00:00.032Z';
        }
    }
    if (since){
        ozonOptions.body.since = since;
        ozonOptions.body.to = to;
    }
    ozonOptions.headers = appConfig.ozon.headers;
    ozonOptions.headers["Api-Key"] = userData.ozonApiKey;
    ozonOptions.headers["Client-Id"] = userData.ozonClientId;
    return ozonOptions;
}

function ozonCollect(type){
    let promise = new Promise((resolve, reject) =>{
        let searchString = '';
        // if (type == importTypes.all){
        //    searchString = {};
        // }
        // else {
        searchString = {email:tsUser};
        // }

        let ozonOptions = getOzOptions('POST', appConfig.ozon.uri, type);
        //db.collection('user').find(searchString, function(err, result){

        request(ozonOptions, function(error, response, body){
            ozonAuthCallback(error, response, body).then(()=>{
                console.log('test4 ozonCollect');
            });
        });
    });
    return promise;
}

async function ozonAuthCallback(error, response, body) {
    if (body.error){
        console.log(body.error);
        return;
    }
    // console.log('error:', error);
    // console.log('statusCode:', response && response.statusCode);
    // console.log('body:', body);

    if (response.statusCode>200){
        console.log('Ozon. response.statusCode>200 на этапе авторизации')
        return;
    }

    let order_ids = body.result.order_ids;
    if (order_ids==undefined){
        console.log('Ozon. получен неправильный список заказов')
        return;
    }
    if (order_ids.length == 0){
        return;
    }
    downloadOrderData(order_ids, 0)
        .then(()=>{
            console.log('test3 ozonAuthCallback');
        });
}

async function downloadOrderData(order_ids, i){
    let promise = await new Promise((resolve, reject) => {
        let order_id = order_ids[i];
        if (order_id) {
            let ozonOptions = getOzOptions('GET', appConfig.ozon.uriOrder + order_id);
            request(ozonOptions, function (error, result, body) {
                console.log('Загузка заказа ' + i);
                console.log(order_id);
                return ozonOrderCallback(error, result, body);
            })
            .then(() => {
                return downloadOrderData(order_ids, i + 1);
            });
        } else {
            aggregate().then(() => {
                resolve();
            });
        }
    });
    return promise;
}

async function ozonOrderCallback(error, response, body) {
    if (body.error){
        console.log('OZ order callback ' + body.error);
        return;
    }
    if (response.statusCode>200){
        console.log('Ozon. response.statusCode>200 на этапе получения заказов')
        return;
    }
    updateOzOrder(body);
}

async function updateOzOrder(body){
    for (let i = 0; i<body.result.items.length; i++) {
        let item = body.result.items[i];
        let order_time = new Date(body.result.order_time);
        order_time.setHours(0);
        order_time.setMinutes(0);
        order_time.setSeconds(0);
        order_time.setMilliseconds(0);
        let price = Number.parseInt(item.price);
        await connection.db.collection('sales').updateOne(
            {"item_id": item.item_id},
            {$set:{
                    tsUser:tsUser,
                    shop: 'ozon',
                    date: order_time,
                    item_id: item.item_id,
                    product_id: item.product_id,
                    product_name:'',
                    quantity: item.quantity,
                    sales: Number.parseFloat(price),
                    cost: Number.parseFloat(0),
                    delivery: Number.parseFloat(0)}
            },
            {'upsert': true}
        );
    }
}

function wbCollect(type) {
    MongoClient.connect(appConfig.url, function (err, client) {
        if (err) {
            console.log(err);
        }
        const db = client.db('topse11er');
        db.collection('user').findOne({email:tsUser}, function(err, result){
            if(result==null){
                console.log('Не найдены параметры авторизации');
                return;
            }
            else{
                const wbAuthBody = {
                    'UserName':result.wbUserName,
                    'Password':result.wbPassword
                };

                const wbAuthOptions = {
                    url: appConfig.wb.uriAuth,
                    method: appConfig.wb.method,
                    body: wbAuthBody,
                    json: true,
                    headers: appConfig.wb.headerAuth,
                    followRedirect: true
                };
                request(wbAuthOptions, function(error, response){
                    wbOrderRequest(response);
                });
                client.close();
            }
        });
    })
}

function wbOrderRequest(response){
    let wbCookies = response.headers['set-cookie'];
    for (let i=0; i < appConfig.wb.wbReportIds.length; i++){
        let wbOrderBody = {
            "length": -1,
            "reportId":appConfig.wb.wbReportIds[i],
            "draw":2,
            "start":0,
            "order":
                {
                    "column":0,
                    "dir":"desc"},
            "search":{
                "value":"",
                "regexp":false}
        }

        let wbOrdersOptions = {
            'url': appConfig.wb.uriReport,
            'method': appConfig.wb.method,
            'body': wbOrderBody,
            'json': true,
            'headers': {cookie:wbCookies[0]+','+wbCookies[1]+','+wbCookies[2],
                orderid:appConfig.wb.wbReportIds[i]}
        };
        console.log('Получение заказов wb.' + "reportId:" + appConfig.wb.wbReportIds[i])
        request(wbOrdersOptions, function(error, response, body){
            wbOrderCallback(error, response, body);
        });
    }
}

function wbOrderCallback(error, response, body) {
    if (response==undefined){
        console.log('response=undefined')
        return;
    }
    let orderid = response.request.headers.orderid;
    console.log('Получение данных.' + "reportId:" + orderid);
    if (response.statusCode>200){
        console.log('WB. response.statusCode>200')
        return;
    }
    if (response.statusCode==200) {
        MongoClient.connect(appConfig.url, function (err, client) {
            let db = client.db(appConfig.dbName);
            console.log('Всего строк:' + body.data.length);
            for (let i = 0; i < body.data.length; i++) {
                let item = body.data[i];
                let order_time = new Date(item.SaleDate);
                order_time.setHours(0);
                order_time.setMinutes(0);
                order_time.setSeconds(0);
                order_time.setMilliseconds(0);

                let item_id = orderid + '.' + item.ShkId + '.' + i;
                try{
                    db.collection('sales').updateOne(
                        {"item_id": item_id},
                        {
                            $set: {
                                tsUser: tsUser,
                                shop: "wb",
                                date: order_time,
                                item_id: item_id,
                                product_id: item.SupplierArticle,
                                product_name: item.SubjectName + '/' + item.BrandName + '(' + item.SupplierArticle + ')',
                                quantity: item.Quantity,
                                sales: Number.parseFloat(item.RetailAmount),
                                cost: Number.parseFloat(item.CostAmount),
                                delivery: Number.parseFloat(item.DeliveryRub)
                            }
                        }
                        , {upsert: true}
                    )
                }
                catch (e) {
                    console.log(e);
                }
            }
            client.close();
            aggregate();
        });
    }
}

function aggregate(){
    let promise = new Promise(async (resolve, reject) =>{
        if (!connection) {
            connection = await connector.connect();
        }
        let options = [
            {'$group': {_id: {'date': '$date', 'shop':'$shop', 'tsUser':'$tsUser'},
                    //shop:'$shop',
                    'sales': {'$sum': '$sales'},
                    'costs': {'$sum': '$cost'},
                    'delivery': {'$sum': '$delivery'}
                }}
        ];
        let parameters = {
            putinto:'salesByDay',
            collectionName:'sales',
            options:options,
            callback:afterAggregate
        };
        await aggregator.aggregate(connection, parameters)

        options = [
            {'$group': {_id: {'product_id': '$product_id', 'shop':'$shop', 'tsUser':'$tsUser'},
                    'sales': {'$sum': '$sales'},
                    'costs': {'$sum': '$cost'},
                    'delivery': {'$sum': '$delivery'}
                }}
        ];
        parameters = {
            putinto:'goodsByDay',
            collectionName:'sales',
            options:options,
            callback:afterAggregate
        };
        await aggregator.aggregate(connection, parameters);

        options = [
            {'$group': {_id: {'product_id': '$product_id', 'shop':'$shop', 'tsUser':'$tsUser'},
                    'sales': {'$sum': '$sales'},
                    'costs': {'$sum': '$cost'},
                    'delivery': {'$sum': '$delivery'}
                }}
        ];
        parameters = {
            putinto:'totals',
            collectionName:'sales',
            options:options,
            callback:afterAggregate
        };
        await aggregator.aggregate(connection, parameters);

        options = [
            {'$group': {_id: {'product_id': '$product_id', 'shop':'$shop', 'tsUser':'$tsUser', 'product_name':'$product_name'}}}
        ];
        parameters = {
            putinto:'goods',
            collectionName:'sales',
            options:options,
            callback:afterAggregate
        };
        await aggregator.aggregate(connection, parameters);

        afterAggregate();

    });
    return promise;
}

function  afterAggregate(){
    //console.log('Вычисления завершены');
    if (callback){
        callback(allUsers, userIterator+1);
    }
    console.log('Загрузка завершилась');
}

function collect(_connection, _allUsers, _userIterator, wb, oz, type, _callback){
    allUsers = _allUsers;
    userIterator = _userIterator;
    userData = _allUsers[_userIterator];
    if (userData){
        tsUser   = userData.email;
        callback = _callback;
        connection = _connection;
        console.log('Загрузка началась');
        console.log('Пользователь: ' + tsUser);
        console.log('OZ: ' + oz);
        console.log('WB: ' + wb);
        console.log('TYPE: ' + type);
        if (tsUser){
            console.log(tsUser);
            if (oz){
                //ozonCollect(type);
                ozonCollect(importTypes.all);
            }
            if (wb) {
                wbCollect(type);
            }
        }
    }
}

async function collectLast(req, res) {

    connection = await connector.connect();
    let allUsers = await users.getAll(connection);

    collectNext(allUsers,0, importTypes.last);

};

async function collectAll(req, res) {

    connection = await connector.connect();
    let allUsers = await users.getAll(connection);

    collectNext(allUsers,0, importTypes.last);

};

function collectNext(allUsers, i, importType){
    if (i==allUsers.length){
        closeConnection();
        return;
    }
    collect(connection, allUsers, i, false, true, importType, collectNext);
}

function closeConnection(){
    connection.client.close();
}