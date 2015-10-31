var connection = require('../db/dbconnect');
var Repository = require('./generalRepository');
var Holiday = require('../schemas/holidaySchema');

function HolidayRepository() {
	Repository.prototype.constructor.call(this);
	this.model = Holiday;
}

HolidayRepository.prototype = new Repository();

HolidayRepository.prototype.getByDateStart = function(date, callback){
	var model = this.model;
	var query = model.find({"start":date});
	query.exec(callback);
};

HolidayRepository.prototype.getByDateEnd = function(date, callback){
	var model = this.model;
	var query = model.find({"end":date});
	query.exec(callback);
};

module.exports = new HolidayRepository();