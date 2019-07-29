var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/topse11er';

module.exports = {
	signup: function(name, email, password){
		MongoClient.connect(url, function(err, client) {              
		  	const db = client.db('topse11er');
            db.collection('user').insertOne( {
				"name": name,
				"email": email,
				"password": password
			},function(err, result){
				assert.equal(err, null);
		    	console.log("Сохранение данных регистрации пользователя");
			});
		});
	},
	validateSignIn: function(username, password,callback){
		MongoClient.connect(url, function(err, client){
			console.log(username,password);
            const db = client.db('topse11er');
			db.collection('user').findOne( { email : username ,password: password 
			},function(err, result){
				if(result==null){
					console.log('Возврат false')
					callback(false)
				}
				else{
					console.log('Возврат true')
					callback(true)
				}
			});
		});
	}
}


