var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
	name: String
});

module.exports = mongoose.model('Event', eventSchema);