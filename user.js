
module.exports = {
	signup: function(name,email,password,ozonClientId,ozonApiKey,wbUserName,wbPassword){
		let promise = new Promise(async(resolve,  reject)=> {
			const connection = await require('./connector').connect();
			await connection.db.collection('user').updateOne(
				{email: email},
				{$set:
					{
						name: name,
						email: email,
						password: password,
						ozonClientId: ozonClientId,
						ozonApiKey: ozonApiKey,
						wbUserName: wbUserName,
						wbPassword: wbPassword
					}
				}
				,{upsert: true}
			);
			resolve();
			connection.client.close();
		});
		return promise;
	},
	validateSignIn: function(username, password){
		console.log(username);
		console.log(password);
		let promise = new Promise(
			async(resolve,  reject)=>{
				try {
					const connection = await require('./connector').connect();
					connection.db.collection('user').findOne({email: username, password: password})
						.then((docs)=>
						{
							if (docs) {
								resolve(true);
							} else {
								resolve(false);
							}
							connection.client.close();
						}
					);
				}
				catch (e) {
					reject(e.message);
				}
			}
		);
		return promise;
	},
	getAll: async function(connection){
		connection = await require('./connector').connect();
        let result = await connection.db.collection('user').find({}).sort({email:1}).toArray();
		connection.client.close();
        return result;
	},
	getUser: async function(connection, email){
		connection = await require('./connector').connect();
		let result = await connection.db.collection('user').find({email:email}).sort({email:1}).toArray();
		connection.client.close();
		return result;
	}
};