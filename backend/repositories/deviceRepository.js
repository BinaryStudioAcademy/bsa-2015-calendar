var connection = require('../db/dbconnect');
var Repository = require('./generalRepository');
var Device = require('../schemas/deviceSchema');

function DeviceRepository() {
	Repository.prototype.constructor.call(this);
	this.model = Device;
}

DeviceRepository.prototype = new Repository();

DeviceRepository.prototype.addEvent = function(deviceId, eventId, callback) {
	var model = this.model;
	var query = model.findByIdAndUpdate({_id:deviceId}, { $push: { events:  eventId } } );
	query.exec(callback);
};

DeviceRepository.prototype.removeEvent = function(deviceId, eventId, callback) {
	var model = this.model;
	var query = model.findByIdAndUpdate({_id:deviceId}, { $pull: { events:  eventId } } );
	query.exec(callback);
};

DeviceRepository.prototype.getRoomEventsByInterval = function(deviceId, gteDate, lteDate, callback){
	var model = this.model;
	var query = model.findOne({_id:deviceId}, {events: 1}).populate('events', null, {"start": {"$gte": gteDate, "$lte": lteDate}});
	query.exec(callback);
};

module.exports = new DeviceRepository();