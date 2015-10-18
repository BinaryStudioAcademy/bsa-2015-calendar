var connection = require('../db/dbconnect');
var Repository = require('./generalRepository');
var Plan = require('../schemas/planSchema');

function PlanRepository() {
	Repository.prototype.constructor.call(this);
	this.model = Plan;
}

PlanRepository.prototype = new Repository();

PlanRepository.prototype.add = function(data, callback){
	var model = this.model;
	var newitem = new model(data);
	newitem.save(callback);
};

module.exports = new PlanRepository();