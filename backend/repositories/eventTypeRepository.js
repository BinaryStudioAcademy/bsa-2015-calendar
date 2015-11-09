var connection = require('../db/dbconnect');
var Repository = require('./generalRepository');
var EventType = require('../schemas/eventTypeSchema');

function EventTypeRepository() {
    Repository.prototype.constructor.call(this);
    this.model = EventType;
}

EventTypeRepository.prototype = new Repository();

EventTypeRepository.prototype.getAllClipped = function(callback){
    var model = this.model;
    var query = model.find({}, {ownerId: 1, title: 1, color: 1, icon: 1, isPrivate: 1});
    query.exec(callback);
};

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

EventTypeRepository.prototype.addBasicType = function(basicType) {
    var model = this.model;
    model.findOne({'title': basicType.title}, function (err, type) {
        if(err) {
            console.log(err);
            return;
        }
        
        if(!type) {
            var newitem = new model({'title' : basicType.title, 'isPrivate': false, 'events': [], 'color': basicType.color || '#ccc'});
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