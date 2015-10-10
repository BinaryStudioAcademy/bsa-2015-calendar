var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
    ownerId : {type Schema.Types.ObjectId, ref: 'User'},
    title : String,
    description : String,
    plan : {type Schema.Types.ObjectId, ref: 'Plan'}, /* plan id */
    isPrivate : Boolean,
    start: Date, 
    end: Date, 
    users: [{type Schema.Types.ObjectId, ref: 'User'}]
    room: {type Schema.Types.ObjectId, ref: 'Room'},
    devices: [{type Schema.Types.ObjectId, ref: 'Device'}],
});

module.exports = mongoose.model('Event', eventSchema);