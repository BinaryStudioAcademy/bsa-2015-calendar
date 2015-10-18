var mongoose = require('mongoose');
var Room = require('./roomSchema');
var Device = require('./deviceSchema');

var Schema = mongoose.Schema;

var planSchema = new Schema({
    title : String,
    description : String,
    type : String, // 'basic', 'general', 'activity',
    price : Number,
    dateStart: Date, 
    dateEnd: Date,
    timeStart: Date, 
    timeEnd: Date,
    intervals: [Number],
    isPrivate: Boolean, /* for public events */
    isExludeUsers : Boolean, /* method forming a userlist */
    users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    rooms: [{type: Schema.Types.ObjectId, ref: 'Room'}], /* arr[intervalsCount] */
    devices: [{type: Schema.Types.ObjectId, ref: 'Device'}],
});


module.exports = mongoose.model('Plan', planSchema);

