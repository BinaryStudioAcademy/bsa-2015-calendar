var apiResponse = require('express-api-response');
var deviceRepository = require('../../repositories/deviceRepository');

module.exports = function(app) {

	app.get('/api/device/:id', function(req, res, next){
		deviceRepository.getById(req.params.id, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.get('/api/device/', function(req, res, next){
		deviceRepository.getAll(function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);


	app.get('/api/deviceByTitle/:title', function(req, res, next){
		deviceRepository.searchByTitle(req.params.title, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.post('/api/device/', function(req, res, next){
		console.log(req.body);
		deviceRepository.add(req.body, function(err, data){

			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.put('/api/device/:id', function(req, res, next){
		deviceRepository.update(req.params.id, req.body, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);


	app.delete('/api/device/:id', function(req, res, next){
		deviceRepository.delete(req.params.id, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

};