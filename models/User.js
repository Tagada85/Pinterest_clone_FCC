const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
	displayName: String,
	username: String,
	images: [{
		url: String,
		name: String
	}]
});

let User = mongoose.model('User', UserSchema);

module.exports = User;