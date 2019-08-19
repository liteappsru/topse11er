
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
	validateSignIn: async function(username, password, callback){
        const connector = await require('./connector').connect();
        connector.db.collection('user').findOne( { email : username ,password: password
            },function(err, result){
                if(result==null){
                    callback(false)
                }
                else{
                    callback(true)
                }
                connector.client.close();
            });
	},
	getAll: async function(connection){
		if (!connection){
			connection = await require('./connector').connect();
		}
        let result = await
			connection.db.collection('user').find({}).sort({email:1}).toArray();
        return result;
	}
};