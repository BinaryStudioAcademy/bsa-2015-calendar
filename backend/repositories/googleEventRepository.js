var connection = require('../db/dbconnect');
var Repository = require('./generalRepository');
var GoogleEvent = require('../schemas/googleEventSchema');


function GoogleEventRepository() {
	Repository.prototype.constructor.call(this);
	this.model = GoogleEvent;
}

GoogleEventRepository.prototype = new Repository();

GoogleEventRepository.prototype.getByDateStart = function(date, callback){
	var model = this.model;
	var query = model.find({"start":date});
	query.exec(callback);
};

GoogleEventRepository.prototype.getByDateEnd = function(date, callback){
	var model = this.model;
	var query = model.find({"end":date});
	query.exec(callback);
};

GoogleEventRepository.prototype.getByInterval = function(gteDate,lteDate, callback){
	var model = this.model;
	var query = model.find( {"start": {"$gte": gteDate, "$lte": lteDate}}).sort({"start": 1});
	query.exec(callback);
};

module.exports = new GoogleEventRepository();