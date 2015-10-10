var apiResponse = require('express-api-response');
var eventRepository = require('../../repositories/eventRepository');

module.exports = function(app) {
	app.get('/api/event/:id', function(req, res, next) {
		eventRepository.getById(req.params.id, function(err, data) {
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.get('api/event/', function(req, res, next){
		eventRepository.getAll(function(err, data){
			res.data = data;
			res.err = err;
			next()
		});
	}, apiResponse);

	app.get('api/event/:name', function(req, res, next){
		eventRepository.searchByName(req.params.name, function(err, data){
			res.data = data;
			res.err = err;
			next()
		});
	}, apiResponse);

	app.get('api/event/:date', function(req, res, next){
		eventRepository.getByDate(req.params.date, function(err, data){
			res.data = data;
			res.err = err;
			next()
		});
	}, apiResponse);

	app.get('api/event/:startDate/:endDate', function(req, res, next){
		eventRepository.getByInterval(req.params.startDate, req.params.endDate, function(err, data){
			res.data = data;
			res.err = err;
			next()
		});
	}, apiResponse);	

	app.post('/api/event/', function(req, res, next) {
		eventRepository.add(req.body, function(err, data) {
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.delete('api/event/', function(req, res, next){
		eventRepository.delete(req.params.id, function(err, data){
			res.data = data;
			res.err = err;
			next()
		});
	}, apiResponse);
};