let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');
let appConfig = require('./config');

async function getMongoClient () {
    let client;
    let db;
    try {
        client = await MongoClient.connect(appConfig.url);
        db = client.db(appConfig.dbName);
        return {client:client,
            db:db}
    }
    catch (e) {
        console.log(e.message);
    }
}

module.exports = {
    connect: function () {
        return getMongoClient();
    }
};