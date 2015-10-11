var mongoose = require('mongoose');
var Plan = require('./planSchema');
var Room = require('./roomSchema');
var Device = require('./deviceSchema');

var Schema = mongoose.Schema;

var eventSchema = new Schema({
    /* ownerId : {type Schema.Types.ObjectId, ref: 'User'}, */
    title : String,
    description : String,
    plan : {type:  Schema.Types.ObjectId, ref: 'Plan'},
    isPrivate : Boolean,
    dateStart: Date, 
    dateEnd: Date, 
    /* users: [{type Schema.Types.ObjectId, ref: 'User'}] */
    room: {type: Schema.Types.ObjectId, ref: 'Room'},
    devices: [{type: Schema.Types.ObjectId, ref: 'Device'}],
});

module.exports = mongoose.model('Event', eventSchema);