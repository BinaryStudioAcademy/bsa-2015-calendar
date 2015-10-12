var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name : String,
    events: [{type Schema.Types.ObjectId, ref: 'Event'}]
});

module.exports = mongoose.model('User', userSchema);