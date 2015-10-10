var apiResponse = require('express-api-response');
var planRepository = require('../../repositories/planRepository');

module.exports = function(app) {
	app.get('/api/plan/:id', function(req, res, next) {
		planRepository.getById(req.params.id, function(err, data) {
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.get('api/plan/:user', function(req, res, next){
		planRepository.getAll(req.params.user, function(err, data){
			res.data = data;
			res.err = err;
			next()
		});
	}, apiResponse);

	app.get('api/planByOwner/:user', function(req, res, next){
		planRepository.getAllByOwner(req.params.user, function(err, data){
			res.data = data;
			res.err = err;
			next()
		});
	}, apiResponse);	

	app.post('/api/plan/', function(req, res, next) {
		planRepository.add(req.body, function(err, data) {
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.update('api/plan/:id', function(req, res, next){
		planRepository.update(req.params.id, req.body, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);	

	app.delete('api/plan/', function(req, res, next){
		planRepository.delete(req.params.id, function(err, data){
			res.data = data;
			res.err = err;
			next()
		});
	}, apiResponse);
};