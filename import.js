var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/topse11er';
var assert = require('assert');
var dateFormat = require('dateformat');

const config = {
    ozon:{
        since:'2019-07-01T00:00:00.032Z',
        to:'2019-08-01T00:00:00.033Z',
        method: "POST",
        uri: "https://api-seller.ozon.ru/v1/order/list",
        uriOrder:"https://api-seller.ozon.ru/v1/order/",
        headers: {
            'Content-Type': 'application/json',
            //'Content-Length': ozonBody.length,
            'Client-Id':'698',
            'Api-Key': '7a562dfd-61cf-4fd3-a629-735924f53e5f'
        }
    },
    wb:{
        wbUserName:'sup-26735-20092',
        wbPassword:'vj5I69U6',
        wbReportIds:['794566',
            '784485',
            '781702',
            '770060'],
        method: "POST",
        uriSite:"https://suppliers.wildberries.ru",
        uriAuth: "https://suppliers.wildberries.ru/Account/Login",
        uriReport: "https://suppliers.wildberries.ru/realization/getreportdetails/",
        headerAuth: {
            'Content-Type': 'application/json'
        }
    }
}

var ozonOptions = {
    uri: config.ozon.uri,
    method: config.ozon.method,
    body: {
        since:config.ozon.since,
        to:config.ozon.to,
        delivery_schema:'fbo',
        page:1,
        page_size:1000
    },
    json: true,
    headers: config.ozon.headers
};

const wbAuthBody = {
    'UserName':config.wb.wbUserName,
    'Password':config.wb.wbPassword
};

const wbAuthOptions = {
    url: config.wb.uriAuth,
    method: config.wb.method,
    body: wbAuthBody,
    json: true,
    headers: config.wb.headerAuth,
    followRedirect: true
};

function ozonAuthCallback(error, response, body) {
    // console.log('error:', error);
    // console.log('statusCode:', response && response.statusCode);
    // console.log('body:', body);

    for (var i = 0; i<body.result.order_ids.length; i++) {
        var orderid = body.result.order_ids[i];
        ozonOptions.method = "GET",
        ozonOptions.uri = config.ozon.uriOrder + orderid;
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

    const wbCookies = response.headers['set-cookie'];

    for (let i=0; i<config.wb.wbReportIds.length;i++){
        let wbOrderBody = {
            "length": -1,
            "reportId":config.wb.wbReportIds[i],
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
            'url': config.wb.uriReport,
            'method': config.wb.method,
            'body': wbOrderBody,
            'json': true,
            'headers': {cookie:wbCookies[0]+','+wbCookies[1]+','+wbCookies[2],orderid:config.wb.wbReportIds[i]}
        };
        console.log('Получение заказов wb.' + "reportId:" + config.wb.wbReportIds[i])
        request(wbOrdersOptions, wbOrderCallback);
    }
};

function wbOrderCallback(error, response, body) {
    //console.log('body:', body);
    if (!(response==undefined) && response.statusCode==200) {
        let orderid = response.request.headers.orderid;
        MongoClient.connect(url, function (err, client) {
            var db = client.db('topse11er');
            console.log('Получены данные.' + "reportId:" + config.wb.wbReportIds[i])
            console.log('Всего строк:' + body.data.length);
            for (var i = 0; i < body.data.length; i++) {
                var item = body.data[i];

                if (!(item.Quantity==0)) {
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
                                    "shop": "wb",
                                    "date": order_time,
                                    "item_id": item_id,
                                    "product_id": item.SupplierArticle,
                                    "quantity": item.Quantity,
                                    "price": Number.parseFloat(item.RetailAmount)
                                }
                            }
                            , {upsert: true}
                        )
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            }
            client.close();
        });
    }
};

function aggregate(){
    aggregateSalesByDay()
}

function aggregateSalesByDay(){
    MongoClient.connect(url, function(err, client) {
        const db = client.db('topse11er');

        var options = [
            {'$group': {_id: '$date', 'total': {'$sum': '$price'}}}
            ];

        var cursor = db.collection('sales').aggregate(options);
        cursor.toArray(function(err, docs){
            assert.equal(null, err);
            saveSalesByDay(docs);
            client.close();
        });
    })
};

function saveSalesByDay(docs){

    if (!docs){
        console.log('Нет данных для сохранения');
        return;
    }

    MongoClient.connect(url, function (err, client) {
        const db = client.db('topse11er');
        for (var i = 0; i < docs.length; i++) {
            try {
                let item = docs[i];
                let ts_hms = Date.parse(item._id);
                let date = dateFormat(ts_hms, "yyyy-mm-dd");
                db.collection('salesByDay').updateOne(
                    {"date": date},
                    {
                        $set: {
                            date: date,
                            total: Number.parseFloat(item.total)
                        }
                    }
                    , {upsert: true}
                )
            } catch (e) {
                console.log(e);
            }
        }
        client.close();
    });
}

function collect(){
    //request(ozonOptions, ozonAuthCallback);
    //request(wbAuthOptions, wbAuthCallback);
    aggregate();
}

//collect();