var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var googleEventSchema = new Schema({
    ownerId : {type: Schema.Types.ObjectId, ref: 'User'},
    title : {type: 'string'},
    start: {type: 'date'}, 
    end: {type: 'date'}
});

module.exports = mongoose.model('GoogleEvent', googleEventSchema);
