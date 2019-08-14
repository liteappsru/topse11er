let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');
let importjs = require('./import');
let appConfig = require('./config');

module.exports = {
	signup: function(name,email,password,ozonClientId,ozonApiKey,wbUserName,wbPassword){
		MongoClient.connect(appConfig.url, function(err, client) {
		  	const db = client.db('topse11er');
            db.collection('user').updateOne(
				{email: email},
            	{name: name,
				email: email,
				password: password,
				ozonClientId: ozonClientId,
				ozonApiKey: ozonApiKey,
				wbUserName: wbUserName,
				wbPassword: wbPassword},
				{upsert: true},
			function(err, result){
		    	console.log("Сохранение данных регистрации пользователя");
				importjs.collect(email);
			});
		});
	},
	validateSignIn: function(username, password, callback){
		MongoClient.connect(appConfig.url, function(err, client){
			//console.log(username,password);
            const db = client.db('topse11er');
			db.collection('user').findOne( { email : username ,password: password
			},function(err, result){
				if(result==null){
					//console.log('Возврат false')
					callback(false)
				}
				else{
					//console.log('Возврат true')
					importjs.collect(username,  false, true, 'last');
					callback(true)
				}
				client.close();
			});
		});
	}
};