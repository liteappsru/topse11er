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

exports.byUser = async function (req, res) {
    if (req.query.user){
        await res.send(imports.collectByUser(req.query.user));
        res.send('import by User ' + req.query.user);
    }
    //let sessions=req.session;
    // if(sessions && sessions.username){
    //     console.log(sessions.username + ' import');
    //     ;
    // }
    // else{
    //     res.send('Не верный логин или пароль')
    // }
};

exports.all = async function (req, res) {
    await imports.collectAll(req,res);
    res.send('import All');
};

exports.today = function (req, res) {
    res.send('import today');
};

exports.last = async function (req, res) {
    await imports.collectLast(req,res);
    res.send('import last');
};