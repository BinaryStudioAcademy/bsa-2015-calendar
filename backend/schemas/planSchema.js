var mongoose = require('mongoose');
<<<<<<< HEAD
=======
var Room = require('./roomSchema');
var Device = require('./deviceSchema');

>>>>>>> feuture/repositories
var Schema = mongoose.Schema;

var planSchema = new Schema({
    title : String,
    description : String,
<<<<<<< HEAD
    type : String, // 'basic', 'general', 'activity',
    price : Number,
=======
>>>>>>> feuture/repositories
    dateStart: Date, 
    dateEnd: Date,
    timeStart: Date, 
    timeEnd: Date,
    intervals: [Number],
    isPrivate: Boolean, /* for public events */
    isExludeUsers : Boolean, /* method forming a userlist */
<<<<<<< HEAD
    users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    usersFunrasing: [String],
=======
    /*users: [{type Schema.Types.ObjectId, ref: 'User'}] */
>>>>>>> feuture/repositories
    rooms: [{type: Schema.Types.ObjectId, ref: 'Room'}], /* arr[intervalsCount] */
    devices: [{type: Schema.Types.ObjectId, ref: 'Device'}],
});

<<<<<<< HEAD
module.exports = mongoose.model('Plan', planSchema);
=======
module.exports = mongoose.model('Plan', planSchema);
>>>>>>> feuture/repositories
