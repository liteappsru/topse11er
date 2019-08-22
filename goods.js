
module.exports = {
	byUser: function(tsUser){
		let promise = new Promise(async (resolve, reject) => {
			const connection = await require('./connector').connect();
			let result = await connection.db.collection('goods').find({tsUser:tsUser}).sort({email:1}).toArray();
			connection.client.close();
			resolve(result);
		});
		return promise;
	}
};