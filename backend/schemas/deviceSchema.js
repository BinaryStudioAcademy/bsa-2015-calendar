var mongoose = require('mongoose');
<<<<<<< HEAD
=======
var Event = require('./eventSchema');

>>>>>>> feuture/repositories
var Schema = mongoose.Schema;

var deviceSchema = new Schema({
    title : String,
    events: [{type: Schema.Types.ObjectId, ref: 'Event'}]
});

module.exports = mongoose.model('Device', deviceSchema);