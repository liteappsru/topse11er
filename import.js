let request = require('request');
let MongoClient = require('mongodb').MongoClient;
let appConfig = require('./config');
let aggregator = require('./aggregator');

var ozonOptions = {
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

const wbAuthBody = {
    'UserName':appConfig.wb.wbUserName,
    'Password':appConfig.wb.wbPassword
};

const wbAuthOptions = {
    url: appConfig.wb.uriAuth,
    method: appConfig.wb.method,
    body: wbAuthBody,
    json: true,
    headers: appConfig.wb.headerAuth,
    followRedirect: true
};

function ozonAuthCallback(error, response, body) {
    // console.log('error:', error);
    // console.log('statusCode:', response && response.statusCode);
    // console.log('body:', body);

    for (var i = 0; i<body.result.order_ids.length; i++) {
        var orderid = body.result.order_ids[i];
        ozonOptions.method = "GET",
        ozonOptions.uri = appConfig.ozon.uriOrder + orderid;
        ozonOptions.body = "";
        request(ozonOptions, ozonOrderCallback);
    }
};

function ozonOrderCallback(error, response, body) {
    // console.log('error:', error);
    for (var i = 0; i<body.result.items.length; i++) {
        var item = body.result.items[i];
        var order_time = new Date(body.result.order_time);
        order_time.setHours(0);
        order_time.setMinutes(0);
        order_time.setSeconds(0);
        order_time.setMilliseconds(0);
        var price = Number.parseInt(item.price);
        MongoClient.connect(url, function(err, client) {
            var db = client.db('topse11er');
            db.collection('sales').updateOne(
                {"item_id": item.item_id},
                {$set:{
                    "shop": "ozon",
                    "date": order_time,
                    "item_id": item.item_id,
                    "product_id": item.product_id,
                    "quantity": item.quantity,
                    "price": Number.parseFloat(item.price)}
                },
                {"upsert": true}
            );
            client.close();
        });
        //console.log('Обновление документа ' + item.item_id);
    }
};

function wbAuthCallback(error, response, body) {
    wbOrderRequest(response.headers['set-cookie']);
};

function wbOrderRequest(wbCookies){
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
        request(wbOrdersOptions, wbOrderCallback);
    }
}

function wbOrderCallback(error, response, body) {
    let orderid = response.request.headers.orderid;
    console.log('Получение данных.' + "reportId:" + orderid);
    if (response==undefined){
        console.log('response=undefined')
        return;
    }
    if (response.statusCode>200){
        console.log('response.statusCode>200')
        return;
    }
    if (response.statusCode==200) {
        MongoClient.connect(appConfig.url, function (err, client) {
            var db = client.db(appConfig.dbName);
            console.log('Всего строк:' + body.data.length);
            for (var i = 0; i < body.data.length; i++) {
                var item = body.data[i];
                var order_time = new Date(item.SaleDate);
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
        });
    }
};

function aggregate(){
    const options = [
        {'$group': {_id: {'date': '$date', 'shop':'$shop'},
                    //shop:'$shop',
                    'sales': {'$sum': '$sales'},
                    'costs': {'$sum': '$cost'},
                    'delivery': {'$sum': '$delivery'}
        }}
    ];
    const parameters = {
        collectionName:'sales',
        options:options,
        putinto:'salesByDay'
    };
    aggregator.aggregate(parameters);
}

function collect(){
    //request(ozonOptions, ozonAuthCallback);
    //request(wbAuthOptions, wbAuthCallback);
    //aggregate();
}

collect()