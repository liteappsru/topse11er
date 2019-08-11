let request = require('request');
let MongoClient = require('mongodb').MongoClient;
let appConfig = require('./config');
let aggregator = require('./aggregator');
let connector = require('./connector');
let tsUser;

module.exports = {collect:
        function (parameters) {
            collect(parameters);
        }
};

let ozonOptions = {
    uri: appConfig.ozon.uri,
    method: appConfig.ozon.method,
    body: {
        since:appConfig.ozon.since,
        to:appConfig.ozon.to,
        delivery_schema:'fbo',
        page:1,
        page_size:1000
    },
    json: true,
    headers: appConfig.ozon.headers
};

function ozonCollect(){
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
                ozonOptions.headers["Api-Key"] = result.ozonApiKey;
                ozonOptions.headers["Client-Id"] = result.ozonClientId;

                request(ozonOptions, function(error, response, body){
                    ozonAuthCallback(error, response, body);
                });
                client.close();
            }
        });
    })
}

function ozonAuthCallback(error, response, body) {
    if (body.error){
        console.log(body.error);
        return;
    }
    // console.log('error:', error);
    // console.log('statusCode:', response && response.statusCode);
    // console.log('body:', body);

    let order_ids = body.result.order_ids;
    let orderid = order_ids[0];
    ozonOptions.method = "GET";
    ozonOptions.uri = appConfig.ozon.uriOrder + orderid;
    ozonOptions.body = "";
    request(ozonOptions, function(error, result, body) {
        ozonOrderCallback(error, response, body, order_ids, 0);
    });
}

function ozonOrderCallback(error, response, body, order_ids, order_i) {
    if (body.error){
        console.log(body.error);
        return;
    }
    console.log(order_i);
    order_i += 1;
    let orderid = order_ids[order_i];
    if (orderid) {
        ozonOptions.method = "GET";
        ozonOptions.uri = appConfig.ozon.uriOrder + orderid;
        ozonOptions.body = "";
        request(ozonOptions, function(error, result, body) {
            ozonOrderCallback(error, response, body, order_ids, order_i);
        });
    }
    else{
        aggregate();
    }
    for (let i = 0; i<body.result.items.length; i++) {
        let item = body.result.items[i];
        let order_time = new Date(body.result.order_time);
        order_time.setHours(0);
        order_time.setMinutes(0);
        order_time.setSeconds(0);
        order_time.setMilliseconds(0);
        let price = Number.parseInt(item.price);
        MongoClient.connect(appConfig.url, function(err, client) {
            let db = client.db('topse11er');
            db.collection('sales').updateOne(
                {"item_id": item.item_id},
                {$set:{
                    tsUser:tsUser,
                    shop: 'ozon',
                    date: order_time,
                    item_id: item.item_id,
                    product_id: item.product_id,
                    product_name:'',
                    quantity: item.quantity,
                    sales: Number.parseFloat(item.price),
                    cost: Number.parseFloat(0),
                    delivery: Number.parseFloat(0)}
                },
                {'upsert': true}
            );
            client.close();
        });
    }
}

function wbCollect() {
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
        console.log('response.statusCode>200')
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
    let options = [
        {'$group': {_id: {'date': '$date', 'shop':'$shop', 'tsUser':'$tsUser'},
                    //shop:'$shop',
                    'sales': {'$sum': '$sales'},
                    'costs': {'$sum': '$cost'},
                    'delivery': {'$sum': '$delivery'}
        }}
    ];
    let parameters = {
        collectionName:'sales',
        options:options,
        putinto:'salesByDay',
        callback:afterAggregate
    };
    aggregator.aggregate(parameters);

    options = [
        {'$group': {_id: {'product_id': '$product_id', 'shop':'$shop', 'tsUser':'$tsUser'},
                'sales': {'$sum': '$sales'},
                'costs': {'$sum': '$cost'},
                'delivery': {'$sum': '$delivery'}
            }}
    ];
    parameters = {
        collectionName:'sales',
        options:options,
        putinto:'goodsByDay',
        callback:afterAggregate
    };
    aggregator.aggregate(parameters);

    options = [
        {'$group': {_id: {'product_id': '$product_id', 'shop':'$shop', 'tsUser':'$tsUser'},
                'sales': {'$sum': '$sales'},
                'costs': {'$sum': '$cost'},
                'delivery': {'$sum': '$delivery'}
            }}
    ];
    parameters = {
        collectionName:'sales',
        options:options,
        putinto:'totals',
        callback:afterAggregate
    };
    aggregator.aggregate(parameters);
}

function  afterAggregate(docs){
    console.log(docs);
}

function collect(_tsUser){
    if (_tsUser){
        console.log(_tsUser);
        tsUser =_tsUser;
        ozonCollect();
        wbCollect();
    }
}

aggregate()

//collect();