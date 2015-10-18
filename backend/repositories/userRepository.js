var connection = require('../db/dbconnect');
var Repository = require('./generalRepository');
var User = require('../schemas/userSchema');

function UserRepository() {
	Repository.prototype.constructor.call(this);
	this.model = User;
}



UserRepository.prototype = new Repository();

UserRepository.prototype.addEvent = function(deviceId, eventId, callback) {
	var model = this.model;
	var query = model.findByIdAndUpdate({_id:deviceId}, { $push: { events:  eventId } } );
	query.exec(callback);
};

UserRepository.prototype.removeEvent = function(deviceId, eventId, callback) {
	var model = this.model;
	var query = model.findByIdAndUpdate({_id:deviceId}, { $pull: { events:  eventId } } );
	query.exec(callback);
};

module.exports = new UserRepository();