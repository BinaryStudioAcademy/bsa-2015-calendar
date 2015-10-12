var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
	name: String,
	birthday : Date,
    events: [{type: Schema.Types.ObjectId, ref: 'Event'}]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);