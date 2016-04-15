var async = require('async');
var userRepository = require('../repositories/userRepository');

var userService = function(){};

// при удалении девайса, удаляем его идентификатор из все ивентов, которые его содержат
userService.prototype.checkIfExists = function(user){
	// return new Promise(resolve, reject) {
	// 	userRepository.getById(user.id)
	// }
};

module.exports = new deviceService();