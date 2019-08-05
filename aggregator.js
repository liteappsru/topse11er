let request = require('request');
let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');
let dateFormat = require('dateformat');
let appConfig = require('./config');

module.exports = {aggregate:
    function aggregate(parameters) {
        connectDb(parameters);
    }
}

function connectDb(parameters){
    MongoClient.connect(appConfig.url, function (err, client){
        if (err){
            console.log(err);
        }
        else {
            const db = client.db(appConfig.dbName);
            onConnect(client, db, parameters);
        }
    })
}

function onConnect(client, db, parameters){
    var cursor = db.collection(parameters.collectionName).aggregate(parameters.options);
    cursor.toArray(function (err, docs) {
        assert.equal(null, err);
        console.log(docs);
        if (parameters.putinto == 'goodsByDay'){
            saveGoodsByDay(client, docs, parameters);
        }
        else {
            saveDataByDay(client, docs, parameters);
        }
    });
}
function saveDataByDay(client, docs, parameters){
    if (!docs){
        console.log('Нет данных для сохранения');
        return;
    }

    const db = client.db(appConfig.dbName);
    for (var i = 0; i < docs.length; i++) {
        try {
            let item = docs[i];
            let ts_hms = Date.parse(item._id.date);
            let date = dateFormat(ts_hms, "yyyy-mm-dd");
            let sales = Number.parseFloat(item.sales);
            let costs = Number.parseFloat(item.costs);
            db.collection(parameters.putinto).updateOne(
                {dim: date},
                {
                    $set: {
                        dim: date,
                        shop:item._id.shop,
                        sales: sales,
                        profit: (sales-costs).toPrecision(6),
                        margin: ((sales-costs)/costs*100).toPrecision(6),
                        costs: costs,
                    }
                }
                , {upsert: true}
            )
        } catch (e) {
            console.log(e);
        }
    }
    client.close();
}

function saveGoodsByDay(client, docs, parameters){
    if (!docs){
        console.log('Нет данных для сохранения');
        return;
    }

    const db = client.db(appConfig.dbName);
    for (var i = 0; i < docs.length; i++) {
        try {
            let item = docs[i];
            let sales = Number.parseFloat(item.sales);
            let costs = Number.parseFloat(item.costs);
            db.collection(parameters.putinto).updateOne(
                {dim: item._id.product_id},
                {
                    $set: {
                        dim: item._id.product_id,
                        shop:item._id.shop,
                        sales: sales,
                        profit: (sales-costs).toPrecision(6),
                        margin: ((sales-costs)/costs*100).toPrecision(6),
                        costs: costs,
                    }
                }
                , {upsert: true}
            )
        } catch (e) {
            console.log(e);
        }
    }
    client.close();
}