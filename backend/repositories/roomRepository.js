var connection = require('../db/dbconnect');
var Repository = require('./generalRepository');
var Room = require('../schemas/roomSchema');

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

RoomRepository.prototype.removeEvent = function(roomId, eventId, callback) {
	var model = this.model;
	var query = model.findByIdAndUpdate({_id:roomId}, { $pull: { events:  eventId } } );
	query.exec(callback);
};

RoomRepository.prototype.getRoomEventsByInterval = function(roomId, gteDate, lteDate, callback){
	var model = this.model;
	var query = model.findOne({_id:roomId}, {events: 1}).populate('events', null, {"start": {"$gte": gteDate, "$lte": lteDate}});
	query.exec(callback);
};

module.exports = new RoomRepository();