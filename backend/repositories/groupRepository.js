var connection = require('../db/dbconnect');
var Repository = require('./generalRepository');
var Group = require('../schemas/groupSchema');

function GroupRepository() {
	Repository.prototype.constructor.call(this);
	this.model = Group;
}

GroupRepository.prototype = new Repository();

module.exports = new GroupRepository();