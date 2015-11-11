var connection = require('../db/dbconnect');
var Repository = require('./generalRepository');
var Device = require('../schemas/deviceSchema');
var Event = require('../schemas/eventSchema');

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

DeviceRepository.prototype.getAllClipped = function(callback){
	var model = this.model;
	var query = model.find({}, { title: 1, description: 1, _id: 1 });
	query.exec(callback);
};


DeviceRepository.prototype.removeEvent = function(deviceId, eventId, callback) {
	var model = this.model;
	var query = model.findByIdAndUpdate({_id:deviceId}, { $pull: { events:  eventId } } );
	query.exec(callback);
};

DeviceRepository.prototype.getDeviceEventsByInterval = function(deviceId, gteDate, lteDate, callback){
	var model = this.model;
	var query = model.findOne({_id:deviceId}, {events: 1}).populate('events', null, {"start": {"$gte": gteDate, "$lte": lteDate}});
	query.populate('type');
	query.exec(function(err, doc){
            Event.populate(doc.events, {path:'type', select: '_id title color isPrivate icon'},
                   function(err, data){
                        callback(null, doc);
                   }
             );     
          });           
}; //{path:'type', select: '_id title color isPrivate icon'}

module.exports = new DeviceRepository();