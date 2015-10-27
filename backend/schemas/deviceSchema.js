var mongoose = require('mongoose');
var Event = require('./eventSchema');
var Schema = mongoose.Schema;

var deviceSchema = new Schema({
    title : String,
    description : String,
    events: [{type: Schema.Types.ObjectId, ref: 'Event'}]
});

module.exports = mongoose.model('Device', deviceSchema);