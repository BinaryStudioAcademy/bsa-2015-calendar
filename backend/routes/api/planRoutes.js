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

	app.get('api/plan/', function(req, res, next){
		planRepository.getAll(function(err, data){
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

	app.delete('api/plan/', function(req, res, next){
		planRepository.delete(req.params.id, function(err, data){
			res.data = data;
			res.err = err;
			next()
		});
	}, apiResponse);
};