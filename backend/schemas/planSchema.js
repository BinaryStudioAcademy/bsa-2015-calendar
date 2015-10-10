var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var planSchema = new Schema({
    title : String,
    description : String,
    dateStart: Date, 
    dateEnd: Date,
    timeStart: Date, 
    timeEnd: Date,
    intervals: [Number],
    isPrivate: Boolean, /* for public events */
    isExludeUsers : Boolean, /* method forming a userlist */
    users: [{type Schema.Types.ObjectId, ref: 'User'}]
    rooms: [{type Schema.Types.ObjectId, ref: 'Room'}], /* arr[intervalsCount] */
    devices: [{type Schema.Types.ObjectId, ref: 'Device'}],
});

module.exports = mongoose.model('Plan', planSchema);