
module.exports = {
	signup: async function(name,email,password,ozonClientId,ozonApiKey,wbUserName,wbPassword){
		const connector = await require('./connector').connect();
		connector.db.collection('user').updateOne(
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
			connector.client.close();
		});
	},
	validateSignIn: function(username, password){
		console.log(username);
		console.log(password);
		let promise = new Promise(async(resolve,  reject)=>{
			try {
				const connector = await require('./connector').connect();
				connector.db.collection('user').findOne({email:username,password: password})
					.then((docs)=>{
					if (docs){
						resolve(true);
					}
					else {
						resolve(false);
					}
					connector.client.close();
				});
			}
			catch (e) {
				reject(e.message);
			}
		});
		return promise;
	},
	getAll: async function(connection){
		connection = await require('./connector').connect();
        let result = await connection.db.collection('user').find({}).sort({email:1}).toArray();
		connection.client.close();
        return result;
	}
};