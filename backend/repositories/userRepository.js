var connection = require('../db/dbconnect');
var Repository = require('./generalRepository');
var User = require('../schemas/userSchema');
var Event = require('../schemas/eventSchema');

function UserRepository() {
	Repository.prototype.constructor.call(this);
	this.model = User;
}

UserRepository.prototype = new Repository();

UserRepository.prototype.getAllClipped = function(callback){
	var model = this.model;
	var query = model.find({}, { name: 1, email: 1, _id: 1 });
	query.exec(callback);
};

UserRepository.prototype.removeEvent = function(userId, eventId, callback) {
	var model = this.model;
	var query = model.findByIdAndUpdate({_id:userId}, { $pull: { events:  eventId } } );
	query.exec(callback);
};

UserRepository.prototype.addEvent = function(userId, eventId, callback) {
	var model = this.model;
	var query = model.findByIdAndUpdate({_id:userId}, { $addToSet: { events:  eventId } } );
	query.exec(callback);
};

UserRepository.prototype.addEventToAll = function(eventId, callback) {
	var model = this.model;
	var query = model.update({}, { $addToSet: { events:  eventId } }, { multi: true } );
	query.exec(callback);
};

UserRepository.prototype.addEventByUserName = function(username, eventId, callback) {
	var model = this.model;
	var query = model.update({username:username}, { $addToSet: { events:  eventId } } );
	query.exec(callback);
};

UserRepository.prototype.getByUsername = function(username, callback) {
	var model = this.model;
	var query = model.findOne({username:username});
	query.exec(callback);
};

UserRepository.prototype.getUserEvents = function(userId, callback){
	var model = this.model;
	var query = model.findOne({_id:userId}, {events: 1}).populate('events');
	query.exec(callback);
};

UserRepository.prototype.getUserEventsByInterval = function(userId, gteDate, lteDate, callback){
	var model = this.model;
	var query = model.findOne({_id:userId}, {events: 1})
	.populate('events', null, {"start": {"$gte": gteDate, "$lte": lteDate}}, {sort: 'start'});
	query.populate('type');
	query.exec(function(err, doc){
            Event.populate(doc.events, {path:'type', select: '_id title color isPrivate icon'},
                   function(err, data){
                        callback(null, doc);
                   }
             );     //{ sort: [['damages', 'asc']] }
          });           
};

UserRepository.prototype.updateHolidays = function(holidaysIds, callback){
	var model = this.model;
	var query = model.update({}, { $set: { holidays:  holidaysIds } }, { multi: true } );
	query.exec(callback);
};

UserRepository.prototype.setTutorialCompleted = function(userId, tutorialCompleted, callback){
	var model = this.model;
	var query = model.update({_id: userId}, { $set: { completedTutorial:  tutorialCompleted } } );
	console.log(tutorialCompleted);
	query.exec(callback);
};

module.exports = new UserRepository();