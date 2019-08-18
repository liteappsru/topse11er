let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');
let dateFormat = require('dateformat');
let appConfig = require('./config');
let connector = require('./connector');
let connection;

module.exports = {aggregate:
    function aggregate(_connection, parameters) {
        connection = _connection;
        onConnect(connection.db, parameters)
    }
};

async function onConnect(db, parameters){
    let docs = await db.collection(parameters.collectionName).aggregate(parameters.options).toArray();
    if (parameters.putinto == 'goodsByDay'){
        saveGoodsByDay(docs, parameters);
    }
    else {
        saveDataByDay(docs, parameters);
    }
    if (parameters.callback){
        parameters.callback(docs);
    }
}

async function saveDataByDay(docs, parameters){

    console.log('Данные по дням');
    if (!docs){
        console.log('Нет данных для сохранения');
        return;
    }

    for (let i = 0; i < docs.length; i++) {
        try {
            let item = docs[i];
            let ts_hms = Date.parse(item._id.date);
            let date = dateFormat(ts_hms, "yyyy-mm-dd");
            let sales = Number.parseFloat(item.sales);
            let costs = Number.parseFloat(item.costs);
            let profit = (sales-costs).toPrecision(6);
            let margin = 0;
            if (costs==0){
                margin = 0
            }
            else {
                margin = ((sales-costs)/costs*100).toPrecision(6);
            }
            await connection.db.collection(parameters.putinto).updateOne(
                {dim: date},
                {
                    $set: {
                        tsUser: item._id.tsUser,
                        dim: date,
                        shop:item._id.shop,
                        sales: sales,
                        profit: profit,
                        margin: margin,
                        costs: costs,
                    }
                }
                , {upsert: true}
            )
        } catch (e) {
            console.log(e);
        }
    }
}

async function saveGoodsByDay(docs, parameters){
    console.log('Продажи по дням');
    if (!docs){
        console.log('Нет данных для сохранения');
        return;
    }

    for (let i = 0; i < docs.length; i++) {
        try {
            let item = docs[i];
            let sales = Number.parseFloat(item.sales);
            let costs = Number.parseFloat(item.costs);
            let profit = (sales-costs).toPrecision(6);
            let margin = 0;
            if (costs==0){
                margin = 0
            }
            else {
                margin = ((sales-costs)/costs*100).toPrecision(6);
            }
            await connection.db.collection(parameters.putinto).updateOne(
                {dim: item._id.product_id},
                {
                    $set: {
                        tsUser: item._id.tsUser,
                        dim: item._id.product_id,
                        shop:item._id.shop,
                        sales: sales,
                        profit: profit,
                        margin: margin,
                        costs: costs,
                    }
                }
                , {upsert: true}
            )
        } catch (e) {
            console.log(e);
        }
    }
}