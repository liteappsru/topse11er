let express = require("express");
let path = require("path");
let bodyParser = require("body-parser");
let user = require('./user');
let session = require('express-session');
let importjs = require('./import');
let reports = require('./reports');

let app = express();
let sessions;

app.use(express.static(path.join(__dirname,"/html")));
app.use(session({secret: 'my-secret'}));
app.use(bodyParser.json());

app.post('/signin', function (req, res) {
  sessions=req.session;
  let user_name=req.body.email;
  let password=req.body.password;

  user.validateSignIn(user_name,password,function(result){
    if(result){      
      sessions.username = user_name;
      res.send('Success')
    }
    else{
      res.send('Не верный логин или пароль')
    }
  });
});

app.post('/signup', function (req, res) {
  sessions=req.session;
  let name=req.body.name;
  let email=req.body.email;
  let password=req.body.password;
  let ozonClientId=req.body.ozonClientId;
  let ozonApiKey=req.body.ozonApiKey;
  let wbUserName=req.body.wbUserName;
  let wbPassword=req.body.wbPassword;
  console.log(name);
  if(name && email && password){
  	user.signup(name, email, password,ozonClientId,ozonApiKey,wbUserName,wbPassword);
    sessions.username = email;
    res.send('Success');
  }
  else{
  	res.send('Что-то пошло не так');
  }
});

app.post('/salesByDay', function (req, res) {
  if(sessions && sessions.username){
    console.log(sessions.username + ' salesByDay');
    reports.salesByDay(sessions.username, function (result) {
      if (result) {
        res.send(result)
      } else {
        res.send({});
      }
    });
  }
});

app.post('/profitByDay', function (req, res) {
  if(sessions && sessions.username) {
    console.log(sessions.username + ' profitByDay');
    reports.profitByDay(sessions.username, function (result) {
      if (result) {
        res.send(result)
      } else {
        res.send({});
      }
    });
  }
});

app.post('/marginByDay', function (req, res) {
  if(sessions && sessions.username) {
    console.log(sessions.username + ' marginByDay');
    reports.marginByDay(sessions.username, function (result) {
      if (result) {
        res.send(result)
      } else {
        res.send({});
      }
    });
  }
});

app.post('/marginByGoods', function (req, res) {
  if(sessions && sessions.username) {
    console.log(sessions.username + ' marginByGoods');
    reports.marginByGoods(sessions.username, function (result) {
      if (result) {
        res.send(result)
      } else {
        res.send({});
      }
    });
  }
});

app.post('/orders', function (req, res) {
  if(sessions && sessions.username) {
    console.log(sessions.username + ' orders');
    reports.orders(sessions.username, function (result) {
      if (result) {
        res.send(result)
      } else {
        res.send({});
      }
    });
  }
});

app.get('/home', function (req, res) {
  if(sessions && sessions.username){
    console.log(sessions.username + ' Авторизация пройдена');
    res.sendFile(__dirname + '/html/reports.html');
  }
  else{
    res.send('Ошибка авторизации');
  }  
});

app.get('/import', function (req, res) {
  if(sessions && sessions.username){
    console.log(sessions.username + ' import');
    res.send(importjs.collect(sessions.username));
  }
  else{
    res.send('Не верный логин или пароль')
  }
});

app.listen(7777,function(){
    console.log("Started listening on port", 7777);
});