let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');
let appConfig = require('./config');

async function getMongoClient () {
    let client;
    let db;
    client = await MongoClient.connect(appConfig.url);
    db = client.db(appConfig.dbName);
    return {client:client,
        db:db}
}

module.exports = {
    connect: function () {
        return getMongoClient();
    }
};