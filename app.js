let express = require("express");
let path = require("path");
let bodyParser = require("body-parser");
let user = require('./user');
let exprSession = require('express-session');
let importjs = require('./import');
let reports = require('./reports');
let session = require('./session');

const app = express();
const import_route = require('./routes/import.route');
const reports_route = require('./routes/report.route');
// let sessions;

app.use(express.static(path.join(__dirname,"/html")));
app.use(exprSession({secret: 'topse11er'}));
app.use(bodyParser.json());
app.use('/import', import_route);
app.use('/report', reports_route);

app.post('/signin', function (req, res) {
  session.session = req.session;
  let user_name=req.body.email;
  let password=req.body.password;

  user.validateSignIn(user_name,password,function(result){
    if(result){
      session.username = user_name;
      session.validated = true;
      console.log(Date.now() + ' авторизация: ' + user_name);
      res.send('Success')
    }
    else{
      res.send('Не верный логин или пароль')
    }
  });
  if (session.validate){
  }
  else {
   //res.send(session.e)
  }
});

app.post('/signup', function (req, res) {
  session.session=req.session;
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
    console.log(Date.now() + ' регистрация: ' + email);
    res.send('Success');
  }
  else{
  	res.send('Что-то пошло не так');
  }
});

app.get('/home', function (req, res) {
  if(session.validated){
    res.sendFile(__dirname + '/html/reports.html');
  }
  else{
    res.send('Ошибка авторизации');
  }  
});

app.get('/import', function (req, res) {
  if(session.validated){
    console.log(session.tsUser + ' import');
    res.send(importjs.collect(session.tsUser));
  }
  else{
    res.send('Не верный логин или пароль')
  }
});

app.listen(7777,function(){
    console.log("Started listening on port", 7777);
});