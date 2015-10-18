var connection = require('../db/dbconnect');
var Repository = require('./generalRepository');
var Event = require('../schemas/eventSchema');

function EventRepository() {
	Repository.prototype.constructor.call(this);
	this.model = Event;
}

EventRepository.prototype = new Repository();

EventRepository.prototype.getByDateStart = function(date, callback){
	var model = this.model;
	var query = model.find({start:date});
	query.exec(callback);
};

EventRepository.prototype.getByDateEnd = function(date, callback){
	var model = this.model;
	var query = model.find({end:date});
	query.exec(callback);
};

EventRepository.prototype.getByInterval = function(gteDate,lteDate, callback){
	var model = this.model;
	var query = model.find( {"start": {"$gte": gteDate, "$lte": lteDate}});
	query.exec(callback);
};

EventRepository.prototype.getByPlanId = function(planId, callback){
	var model = this.model;
	var query = model.find({plan:planId});
	query.exec(callback);
};


module.exports = new EventRepository();