var connection = require('../db/dbconnect');
var Repository = require('./generalRepository');
var Device = require('../schemas/deviceSchema');

function DeviceRepository() {
	Repository.prototype.constructor.call(this);
	this.model = Device;
}

DeviceRepository.prototype = new Repository();

module.exports = new DeviceRepository();