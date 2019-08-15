let importjs = require('../import');
let session = require('../session');

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
    importjs.collect(session.tsUser);
    res.send('import last');
};