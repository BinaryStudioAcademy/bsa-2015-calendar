var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deviceSchema = new Schema({
    title : String,
    events: [{type Schema.Types.ObjectId, ref: 'Event'}]
});

module.exports = mongoose.model('Device', deviceSchema);