var connection = require('../db/dbconnect');
var Repository = require('./generalRepository');
var User = require('../schemas/userSchema');

function UserRepository() {
	Repository.prototype.constructor.call(this);
	this.model = User;
}

UserRepository.prototype = new Repository();

UserRepository.prototype.removeEvent = function(userId, eventId, callback) {
	var model = this.model;
	var query = model.findByIdAndUpdate({_id:userId}, { $pull: { events:  eventId } } );
	query.exec(callback);
};

UserRepository.prototype.addEvent = function(userId, eventId, callback) {
	var model = this.model;
	var query = model.findByIdAndUpdate({_id:userId}, { $push: { events:  eventId } } );
	query.exec(callback);
};

UserRepository.prototype.getByUsername = function(username, callback) {
	var model = this.model;
	var query = model.findOne({username:username});
	query.exec(callback);
};

module.exports = new UserRepository();