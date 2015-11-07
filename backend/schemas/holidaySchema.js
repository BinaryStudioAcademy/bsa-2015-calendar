var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var holidaySchema = new Schema({
    title : String,
    start: Date, 
    end: Date
});

module.exports = mongoose.model('Holiday', holidaySchema);
