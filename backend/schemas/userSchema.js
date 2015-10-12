var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	
	username: {
	type: String,
	unique: true,
	required: true
	},

	password: {
	type: String,
	required: true
	},

    events: [{type Schema.Types.ObjectId, ref: 'Event'}]
});

module.exports = mongoose.model('User', userSchema);