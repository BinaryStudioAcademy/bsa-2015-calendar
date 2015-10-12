var mongoose = require('mongoose');
<<<<<<< HEAD
=======
var Event = require('./eventSchema');

>>>>>>> feuture/repositories
var Schema = mongoose.Schema;

var groupSchema = new Schema({
    title : String,
    events: [{type: Schema.Types.ObjectId, ref: 'Event'}],
<<<<<<< HEAD
    users: [{type: Schema.Types.ObjectId, ref: 'User'}]
=======
    /* users: [{type: Schema.Types.ObjectId, ref: 'User'}] */
>>>>>>> feuture/repositories
});

module.exports = mongoose.model('Group', groupSchema);