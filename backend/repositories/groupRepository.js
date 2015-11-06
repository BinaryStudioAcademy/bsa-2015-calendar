var connection = require('../db/dbconnect');
var Repository = require('./generalRepository');
var Group = require('../schemas/groupSchema');

function GroupRepository() {
	Repository.prototype.constructor.call(this);
	this.model = Group;
}

GroupRepository.prototype = new Repository();

GroupRepository.prototype.removeUser = function(groupId, userId, callback) {
	var model = this.model;
	var query = model.findByIdAndUpdate({_id:groupId}, { $pull: { users:  userId } } );
	query.exec(callback);
};

GroupRepository.prototype.removeEvent = function(eventId, callback) {
	var model = this.model;
	var query = model.update({events:eventId}, {$pull: { events:  eventId }}, {multi:true});
	query.exec(callback);
};


module.exports = new GroupRepository();