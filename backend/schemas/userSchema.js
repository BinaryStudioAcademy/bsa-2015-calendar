var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Event = require('./eventSchema');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
    email: {
        type: 'string',
        required: true
    },
    name: {
        type: 'string',
        required: true
    },
    surname: {
        type: 'string',
        required: false
    },
    country: {
        type: 'string',
        required: false
    },
    city: {
        type: 'string',
        required: false
    },
    gender: {
        type: 'string',
        required: false,
        enum: ['male', 'female']
    },
    birthday: {
        type: 'date',
        required: false
    },
    avatar: {
        type: 'string'
    },
    workDate: {
        type: 'date',
        required: false
    },
    userCV: {
        model : 'Cvs',
        type: 'string',
        unique: false
    },
    userPDP: {
        model : 'Pdps',
        type: 'string',
        unique: false
    },
    currentProject: {
        type: 'string'
    },
    isDeleted: {
        type: 'boolean',
        defaultsTo: false
    },
    changeAccept: {
        type: 'boolean',
        defaultsTo: true
    },
    preModeration: {
        type: 'string'
    },
    events: [{type: Schema.Types.ObjectId, ref: 'Event'}]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);