var connection = require('../db/dbconnect');
var Repository = require('./generalRepository');
var Room = require('../schemas/roomSchema');

function RoomRepository() {
	Repository.prototype.constructor.call(this);
	this.model = Room;
}

RoomRepository.prototype = new Repository();

module.exports = new RoomRepository();