var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var user = require('./user');
var session = require('express-session');
var importjs = require('./import');
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

  console.log('signin' + user_name);
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

  console.log('signuo' + name);

  if(name && email && password){
  	user.signup(name, email, password);
    sessions.username = email;
    res.send('Success');
  }
  else{
  	res.send('Что-то пошло не так');
  }
})

app.post('/salesByDay', function (req, res) {
  sessions=req.session;
  reports.salesByDay(function(result){
    if(result){
      res.send(result)
    }
    else{
      res.send({});
    }
  });
})

app.post('/profitByDay', function (req, res) {
  sessions=req.session;
  reports.profitByDay(function(result){
    if(result){
      res.send(result)
    }
    else{
      res.send({});
    }
  });
})

app.post('/marginByDay', function (req, res) {
  sessions=req.session;
  reports.marginByDay(function(result){
    if(result){
      res.send(result)
    }
    else{
      res.send({});
    }
  });
})

app.post('/marginByGoods', function (req, res) {
  sessions=req.session;
  reports.salesByDay(function(result){
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
  res.send(importjs.collect());
})

app.listen(7777,function(){
    console.log("Started listening on port", 7777);
})