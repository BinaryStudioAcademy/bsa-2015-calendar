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

EventTypeRepository.prototype.addBasicType = function(title) {
    var model = this.model;
    model.findOne({'title': title}, function (err, type) {
        if(err) {
            console.log(err);
            return;
        }
        
        if(!type) {
            var newitem = new model({'title' : title, 'isPrivate': false, 'events': []});
            newitem.save();
        }
    });
};

EventTypeRepository.prototype.init = function (types) {
    for(var i = 0; i < types.length; i++){
        this.addBasicType(types[i]);
    }
};

module.exports = new EventTypeRepository();