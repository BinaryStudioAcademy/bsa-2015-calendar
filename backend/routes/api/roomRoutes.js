var apiResponse = require('express-api-response');
var roomRepository = require('../../repositories/roomRepository');

module.exports = function(app) {
	app.get('api/room/:id', function(req, res, next){
		roomRepository.getById(req.params.id, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.get('api/room/', function(req, res, next){
		roomRepository.getAll(function(err, data){
			res.data = data;
			res.err = err;
			next()
		});
	}, apiResponse);

	app.post('api/room/', function(req, res, next){
		roomRepository.add(req.body, function(err, data){
			res.data = data;
			res.err = err;
			next()
		});
	}, apiResponse);

	app.delete('api/room/', function(req, res, next){
		roomRepository.delete(req.params.id, function(err, data){
			res.data = data;
			res.err = err;
			next()
		});
	}, apiResponse);	

};