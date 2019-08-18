let imports = require('../import');
let users = require('../user');
let session = require('../session');
let MongoClient = require('mongodb').MongoClient;
let appConfig = require('../config');

exports.allByUser = function (req, res) {
    let sessions=req.session;
    if(sessions && sessions.username){
        console.log(sessions.username + ' import');
        res.send(importjs.collect(sessions.username));
    }
    else{
        res.send('Не верный логин или пароль')
    }
};

exports.all = function (req, res) {

    res.send('import All');
};

exports.today = function (req, res) {
    res.send('import today');
};

exports.last = function (req, res) {
    MongoClient.connect(appConfig.url, function(err, client){
        const db = client.db('topse11er');
        let cursor = db.collection('user').find({});
        let docs = f1(cursor);
        console.log(docs);
        client.close();
        return docs;
    });
    //users.getAll(function(){
    //     imports.collect(session.tsUser);
    //     res.send('import last');
    //});
};

function f1(cursor) {
    const result = async () =>{
        return cursor.toArray(await function(err, docs){
            return docs;
        });
    };
    let docs = result();
    return docs;
}