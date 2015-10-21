var apiResponse = require('express-api-response');
var userRepository = require('../../repositories/userRepository');

module.exports = function(app) {
	app.get('/api/user/', function(req, res, next){
		userRepository.getAll(function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.post('/api/user/', function(req, res, next) {
		userRepository.add(req.body, function(err, data) {
			console.log('user', req.body);
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);
};