var connection = require('../db/dbconnect');
var Repository = require('./generalRepository');
var Event = require('../schemas/eventSchema');

function EventRepository() {
	Repository.prototype.constructor.call(this);
	this.model = Event;
}

EventRepository.prototype = new Repository();

Repository.prototype.getAllPop = function(callback){
	var model = this.model;
	var query = model.find().populate('room devices users');
	query.exec(callback);
};

Repository.prototype.getByIdPop = function(id, callback){
	var model = this.model;
	var query = model.findOne({_id:id}).populate('room devices users');
	query.exec(callback);
};

EventRepository.prototype.getByIntervalPop = function(gteDate,lteDate, callback){
	var model = this.model;
	var query = model.find( {"start": {"$gte": gteDate, "$lte": lteDate}}).sort({"start": 1}).populate('room devices users');
	query.exec(callback);
};


EventRepository.prototype.getByDateStart = function(date, callback){
	var model = this.model;
	var query = model.find({"start":date});
	query.exec(callback);
};

EventRepository.prototype.getByDateEnd = function(date, callback){
	var model = this.model;
	var query = model.find({"end":date});
	query.exec(callback);
};

EventRepository.prototype.getByType = function(type, callback){
	var model = this.model;
	var query = model.find({"type":type});
	query.exec(callback);
};

EventRepository.prototype.getByInterval = function(gteDate,lteDate, callback){
	var model = this.model;
	var query = model.find( {"start": {"$gte": gteDate, "$lte": lteDate}}).sort({"start": 1});
	query.exec(callback);
};

EventRepository.prototype.getByPlanId = function(planId, callback){
	var model = this.model;
	var query = model.find({"plan":planId});
	query.exec(callback);
};

EventRepository.prototype.getByPlanIdPop = function(planId, callback){
	var model = this.model;
	var query = model.find({"plan":planId}).sort({"start": 1}).populate('room devices users');
	query.exec(callback);
};


EventRepository.prototype.getByRoomId = function(roomId, callback){
	var model = this.model;
	var query = model.find({"room":roomId});
	query.exec(callback);
};

EventRepository.prototype.getByDeviceId = function(deviceId, callback){
	var model = this.model;
	var query = model.find({"devices":deviceId});
	query.exec(callback);
};

EventRepository.prototype.checkRoomAvailability = function(roomId, dateStart, dateEnd, callback){
	var model = this.model;
	var query = model.find({"room":roomId, "$or": [ {"start": {"$gte": new Date(dateStart), "$lte": new Date(dateEnd)}}, {"end": {"$gte": new Date(dateStart), "$lte": new Date(dateEnd)}}]});
	query.exec(callback);
};

EventRepository.prototype.checkDeviceAvailability = function(deviceId, dateStart, dateEnd, callback){
	var model = this.model;
	var query = model.find({"devices":deviceId, "$or": [ {"start": {"$gte": new Date(dateStart), "$lte": new Date(dateEnd)}}, {"end": {"$gte": new Date(dateStart), "$lte": new Date(dateEnd)}}]});
	query.exec(callback);
};

EventRepository.prototype.removeDevice = function(eventId, deviceId, callback) {
	var model = this.model;
	var query = model.findByIdAndUpdate({_id:eventId}, { $pull: { devices:  deviceId } } );
	query.exec(callback);
};

EventRepository.prototype.removeRoom = function(eventId, roomId, callback) {
	var model = this.model;
	var query = model.findByIdAndUpdate({_id:eventId}, { $pull: { room:  roomId } } );
	query.exec(callback);
};

EventRepository.prototype.removeUser = function(eventId, userId, callback) {
	var model = this.model;
	var query = model.findByIdAndUpdate({_id:eventId}, { $pull: { users:  userId } } );
	query.exec(callback);
};

module.exports = new EventRepository();