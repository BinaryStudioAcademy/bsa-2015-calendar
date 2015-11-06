var connection = require('../db/dbconnect');
var Repository = require('./generalRepository');
var EventType = require('../schemas/eventTypeSchema');

function EventTypeRepository() {
    Repository.prototype.constructor.call(this);
    this.model = EventType;
}

EventTypeRepository.prototype = new Repository();

EventTypeRepository.prototype.addEvent = function (eventTypeId, eventId, callback) {
    var model = this.model;
    var query = model.findByIdAndUpdate({_id: eventTypeId}, {$push: {events: eventId}});
    query.exec(callback);
};

EventTypeRepository.prototype.removeEvent = function (eventTypeId, eventId, callback) {
    var model = this.model;
    var query = model.findByIdAndUpdate({_id: eventTypeId}, {$pull: {events: eventId}});
    query.exec(callback);
};

EventTypeRepository.prototype.getPublic = function (callback) {
    var model = this.model;
    var query = model.find({isPrivate: false});
    query.exec(callback);
};

EventTypeRepository.prototype.getPublicAndByOwner = function (id, callback) {
    var model = this.model;
    var query = model.find({$or: [{'isPrivate': false}, {'ownerId': id}]});
    query.exec(callback);
};

module.exports = new EventTypeRepository();