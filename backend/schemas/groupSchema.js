var mongoose = require('mongoose');
var Event = require('./eventSchema');
var Schema = mongoose.Schema;

var groupSchema = new Schema({
    title : String,
    events: [{type: Schema.Types.ObjectId, ref: 'Event'}],
    users: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

// groupSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
//   return this.collection.findAndModify(query, sort, doc, options, callback);
// };

module.exports = mongoose.model('Group', groupSchema);