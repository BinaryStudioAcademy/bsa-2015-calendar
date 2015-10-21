var connection = require('../db/dbconnect');
var Repository = require('./generalRepository');
var Plan = require('../schemas/planSchema');

function PlanRepository() {
	Repository.prototype.constructor.call(this);
	this.model = Plan;
}

PlanRepository.prototype = new Repository();

module.exports = new PlanRepository();