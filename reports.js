var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/topse11er';
var assert = require('assert');
let appConfig = require('./config');

function getData(callback,params){
    MongoClient.connect(appConfig.url, function(err, client) {
        const db = client.db(appConfig.dbName);
        db.collection(params.collection).find({}, function(err,cursor){
            cursor.toArray(function(err, docs){
                assert.equal(null, err);
                for(let i = 0; i<docs.length;i++){
                    let el = docs[i];
                    el.x = el[params.maping.x];
                    el.y = el[params.maping.y];
                }
                callback(docs);
                console.log('Получение даных отчета за день');
                client.close();
            });
        });
    });
}

module.exports = {
    salesByDay: function(callback){
        params = {
            collection:'salesByDay',
            maping:{
                x:'dim',
                y:'sales'
            }
        }
        getData(callback,params);
    },
    profitByDay: function(callback){
        params = {
            collection:'salesByDay',
            maping:{
                x:'dim',
                y:'profit'
            }
        }
        getData(callback,params);
    },
    marginByDay: function(callback){
        params = {
            collection:'salesByDay',
            maping:{
                x:'dim',
                y:'margin'
            }
        }
        getData(callback,params);
    },
    marginByGoods: function(callback){
        params = {
            collection:'marginByGoods',
            maping:{
                x:'dim',
                y:'margin'
            }
        }
        getData(callback,params);
    }
    // profitByDay: function(callback){
    //     reportsalesByDay(callback);
    // },
    // marginByDay: function(callback){
    //     reportsalesByDay(callback);
    // },
    // marginByGoods: function(callback){
    //     reportsalesByDay(callback);
    // }
}