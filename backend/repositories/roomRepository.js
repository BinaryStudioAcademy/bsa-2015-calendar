var connection = require('../db/dbconnect');
var Repository = require('./generalRepository');
var Room = require('../schemas/roomSchema');
var Event = require('../schemas/eventSchema');

function RoomRepository() {
	Repository.prototype.constructor.call(this);
	this.model = Room;
}

RoomRepository.prototype = new Repository();

RoomRepository.prototype.addEvent = function(roomId, eventId, callback) {
	var model = this.model;
	var query = model.findByIdAndUpdate({_id:roomId}, { $push: { events:  eventId } } );
	query.exec(callback);
};

RoomRepository.prototype.getAllClipped = function(callback){
	var model = this.model;
	var query = model.find({}, { title: 1, description: 1, _id: 1 });
	query.exec(callback);
};

RoomRepository.prototype.removeEvent = function(roomId, eventId, callback) {
	var model = this.model;
	var query = model.findByIdAndUpdate({_id:roomId}, { $pull: { events:  eventId } } );
	query.exec(callback);
};

RoomRepository.prototype.getRoomEventsByInterval = function(roomId, gteDate, lteDate, callback){
	var model = this.model;
	var query = model.findOne({_id:roomId}, {events: 1}).populate('events', null, {"start": {"$gte": gteDate, "$lte": lteDate}}, {sort: {"start": 1}});
	query.populate('type');
	query.exec(function(err, doc){
            Event.populate(doc.events, {path:'type', populate: 'type._id type.title type.color type.isPrivate type.icon'},
                   function(err, data){
                        callback(null, doc);
                   }
            );     
    });
};

module.exports = new RoomRepository();