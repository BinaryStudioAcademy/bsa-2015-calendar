var mongoose = require('mongoose');
var Event = require('./eventSchema');
var Schema = mongoose.Schema;

var eventTypeSchema= new Schema({
    title : String,
    events: [{type: Schema.Types.ObjectId, ref: 'Event'}]
});

module.exports = mongoose.model('EventType', eventTypeSchema);