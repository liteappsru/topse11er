let imports = require('../import');
let session = require('../session');
let appConfig = require('../config');

exports.allByUser = function (req, res) {
    let sessions=req.session;
    if(sessions && sessions.username){
        console.log(sessions.username + ' import');
        res.send(imports.collect(sessions.username));
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

exports.last = async function (req, res) {
    await imports.doCollect(req,res);
};