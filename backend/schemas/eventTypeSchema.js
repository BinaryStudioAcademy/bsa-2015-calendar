var mongoose = require('mongoose');
var Event = require('./eventSchema');
var Schema = mongoose.Schema;

var eventTypeSchema = new Schema({
    ownerId: {type: Schema.Types.ObjectId, ref: 'User'},
    title: String,
    color: String,
    icon: String,
    events: [{type: Schema.Types.ObjectId, ref: 'Event'}],
    isPrivate: Boolean,
    icon: {
    	css: String,
    	name: String
    }
});

module.exports = mongoose.model('EventType', eventTypeSchema);