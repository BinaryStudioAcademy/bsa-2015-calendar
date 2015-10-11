var mongoose = require('mongoose');
var Event = require('./eventSchema');

var Schema = mongoose.Schema;

var roomSchema= new Schema({
    title : String,
    events: [{type: Schema.Types.ObjectId, ref: 'Event'}]
});

module.exports = mongoose.model('Room', roomSchema);