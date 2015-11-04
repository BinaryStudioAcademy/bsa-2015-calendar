var apiResponse = require('express-api-response');
var planRepository = require('../../repositories/planRepository');
var planService = require('../../services/planService');

module.exports = function(app) {
	app.get('/api/plan/:id', function(req, res, next) {
		planRepository.getById(req.params.id, function(err, data) {
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.get('/api/plan/', function(req, res, next){
		planRepository.getAll(function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.get('/api/planByTitle/:title', function(req, res, next){
		planRepository.searchByTitle(req.params.title, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.get('/api/plan/:user', function(req, res, next){
		planRepository.getAll(req.params.user, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.get('/api/planByOwner/:user', function(req, res, next){
		planRepository.getAllByOwner(req.params.user, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);	

	app.post('/api/plan/', function(req, res, next) {
		console.log('in plan post route');
		planService.add(req.body, function(err, data) {
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.put('/api/plan/:id', function(req, res, next){
		planRepository.update(req.params.id, req.body, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);	

	app.post('/api/plan/availability/', function(req, res, next){
		planService.availability(req.body, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);	

	app.delete('/api/plan/:id', function(req, res, next){
		planService.delete(req.params.id, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);
};