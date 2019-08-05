var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
let dateFormat = require('dateformat');
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
                client.close();
            });
        });
    });
}

function getOrders(callback, params){
    MongoClient.connect(appConfig.url, function(err, client) {
        const db = client.db(appConfig.dbName);
        db.collection(params.collection).find({}, function(err,cursor){
            cursor.toArray(function(err, docs){
                assert.equal(null, err);
                for(let i = 0; i<docs.length;i++){
                    let item = docs[i];
                    let ts_hms = Date.parse(item.date);
                    item.date = dateFormat(ts_hms, "yyyy-mm-dd");
                    //console.log(item.date);
                }
                callback(docs);
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
            collection:'goodsByDay',
            maping:{
                x:'dim',
                y:'margin'
            }
        };
        getData(callback,params);
    },
    orders: function(callback){
        params = {
            collection:'sales',
            maping:{
                x:'dim',
                y:'margin'
            }
        };
        getOrders(callback,params);
    }

}