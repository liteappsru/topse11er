var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/topse11er';
var assert = require('assert');

function report(callback){
    MongoClient.connect(url, function(err, client) {
        const db = client.db('topse11er');
        let res = db.collection('salesByDay').find({}, function(err,cursor){
            cursor.toArray(function(err, docs){
                assert.equal(null, err);
                callback(docs);
                console.log('Получение даных отчета за день');
                client.close();
            });
        });
    });
}

module.exports = {
    reportByDay: function(callback){
        report(callback);
    }
}