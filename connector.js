let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');
let appConfig = require('./config');

module.exports = {connect:
    function connect(callback, parameters) {
        MongoClient.connect(appConfig.url, function (err, client) {
            if (err) {
                console.log(err);
            } else {
                callback(client, parameters);
            }
        })
    }
};