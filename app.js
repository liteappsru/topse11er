var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var user = require('./user');
var session = require('express-session');
var imports = require('./import');
var reports = require('./reports');

var app = express();
var sessions;

app.use(express.static(path.join(__dirname,"/html")));
app.use(session({secret: 'my-secret'}));
app.use(bodyParser.json());

app.post('/signin', function (req, res) {
  sessions=req.session;
  var user_name=req.body.email;
  var password=req.body.password;
  user.validateSignIn(user_name,password,function(result){
    if(result){      
      sessions.username = user_name;
      res.send('Success')
    }
    else{
      res.send('Не верный логин или пароль')
    }
  });
})

app.post('/signup', function (req, res) {
  sessions=req.session;
  var name=req.body.name;
  var email=req.body.email;
  var password=req.body.password;

  if(name && email && password){
  	user.signup(name, email, password);
    sessions.username = email;
    res.send('Success');
  }
  else{
  	res.send('Что-то пошло не так');
  }
})

app.post('/report', function (req, res) {
  sessions=req.session;
  reports.reportByDay(function(result){
    if(result){
      res.send(result)
    }
    else{
      res.send({});
    }
  });
})

app.get('/home', function (req, res) {
  if(sessions && sessions.username){
    res.sendFile(__dirname + '/html/reports.html');
  }
  else{
    res.send('Ошибка авторизации');
  }  
})

app.get('/import', function (req, res) {
  res.send(importjs.doImport());
})

app.listen(7777,function(){
    console.log("Started listening on port", 7777);
})