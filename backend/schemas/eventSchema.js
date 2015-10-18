var mongoose = require('mongoose');
var Plan = require('./planSchema');
var Room = require('./roomSchema');
var Device = require('./deviceSchema');

var Schema = mongoose.Schema;

var eventSchema = new Schema({
    ownerId : {type: Schema.Types.ObjectId, ref: 'User'},
    title : String,
    description : String,
    type : String, // 'basic', 'general', 'activity',
    price : Number,
    plan : {type: Schema.Types.ObjectId, ref: 'Plan'}, /* plan id */
    isPrivate : Boolean,
    start: Date, 
    end: Date, 
    users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    usersFundrasing: [String], //accepter, declined, later, paid
    room: {type: Schema.Types.ObjectId, ref: 'Room'},
    devices: [{type: Schema.Types.ObjectId, ref: 'Device'}]
});

module.exports = mongoose.model('Event', eventSchema);
