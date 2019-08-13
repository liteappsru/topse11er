var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
let dateFormat = require('dateformat');
let appConfig = require('./config');
let tsUser;

function getData(callback,params){
    MongoClient.connect(appConfig.url, function(err, client) {
        const db = client.db(appConfig.dbName);
        db.collection(params.collection).find({tsUser:tsUser}, function(err,cursor){
            cursor.sort({"dim":1}).limit(10).toArray(function(err, docs){
                assert.equal(null, err);
                for(let i = 0; i<docs.length;i++){
                    let el = docs[i];
                    el.x = el[params.maping.x];
                    el.y = el[params.maping.y].toString();
                }
                callback(docs);
                client.close();
            })
        });
    });
}

function getOrders(callback, params){
    MongoClient.connect(appConfig.url, function(err, client) {
        const db = client.db(appConfig.dbName);
        let options = [
            {$match:{'tsUser':tsUser}},
            {'$group': {_id: {'date': '$date', 'shop':'$shop','product_id':'$product_id','product_name':'$product_name'},
                'sales': {'$sum': '$sales'},
                'cost': {'$sum': '$cost'},
                'delivery': {'$sum': '$delivery'},
                'quantity': {'$sum': '$quantity'}
            }},
            {'$sort':{'date': -1}}
        ];
        db.collection(params.collection)
        .aggregate(options, function(err,cursor){
            cursor.toArray(function(err, docs){
                assert.equal(null, err);
                for(let i = 0; i<docs.length;i++){
                    let item = docs[i];
                    let ts_hms = Date.parse(item._id.date);
                    item.date = dateFormat(ts_hms, "yyyy-mm-dd");
                    item.shop = item._id.shop;
                    item.product_id   = item._id.product_id;
                    item.product_name = item._id.product_name;
                }
                //console.log(docs);
                callback(docs);
                client.close();
            })
        });
    });
}

function getCommmonData(callback, params){
    MongoClient.connect(appConfig.url, function(err, client) {
        const db = client.db(appConfig.dbName);
        let options = [
            {$match:{'tsUser':tsUser}},
            {'$group': {_id: {'date': '$date'},
                'sales': {'$sum': '$sales'},
                'profit': {'$sum': '$profit'}
            }}
        ];
        db.collection(params.collection)
        .aggregate(options, function(err,cursor){
            cursor.sort({"_id.date":-1}).toArray(function(err, docs){
                assert.equal(null, err);
                let result = {};
                for(let i = 0; i<docs.length;i++){
                    let item = docs[i];
                    result.commonSales = item.sales;
                    result.commonProfit = item.profit;
                    break;
                }
                callback(result);
                client.close();
            })
        });
    });
}

module.exports = {
    salesByDay: function(_tsUser, callback){
        tsUser = _tsUser;
        params = {
            collection:'salesByDay',
            maping:{
                x:'dim',
                y:'sales'
            }
        }
        getData(callback,params);
    },
    profitByDay: function(_tsUser, callback){
        tsUser = _tsUser;
        params = {
            collection:'salesByDay',
            maping:{
                x:'dim',
                y:'profit'
            }
        }
        getData(callback,params);
    },
    marginByDay: function(_tsUser, callback){
        tsUser = _tsUser;
        params = {
            collection:'salesByDay',
            maping:{
                x:'dim',
                y:'margin'
            }
        }
        getData(callback,params);
    },
    marginByGoods: function(_tsUser, callback){
        tsUser = _tsUser;
        params = {
            collection:'goodsByDay',
            maping:{
                x:'dim',
                y:'margin'
            }
        };
        getData(callback,params);
    },
    orders: function(_tsUser, callback){
        tsUser = _tsUser;
        params = {
            collection:'sales',
            maping:{
                x:'dim',
                y:'margin'
            }
        };
        getOrders(callback,params);
    },
    commonData: function(_tsUser, callback){
        tsUser = _tsUser;
        params = {
            collection:'sales',
            maping:{
                x:'dim',
                y:'margin'
            }
        };
        getCommmonData(callback,params);
    }

}