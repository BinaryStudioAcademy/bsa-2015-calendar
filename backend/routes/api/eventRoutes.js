var apiResponse = require('express-api-response');
var eventRepository = require('../../repositories/eventRepository');
var eventService = require('../../services/eventService');

module.exports = function(app) {
	app.get('/api/event/:id', function(req, res, next) {
		eventRepository.getById(req.params.id, function(err, data) {
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.get('/api/event/planid/:id', function(req, res, next) {
		eventRepository.getByPlanId(req.params.id, function(err, data) {
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.get('/api/event/', function(req, res, next){
		eventRepository.getAll(function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.get('/api/eventByOwner/:user', function(req, res, next){
		eventRepository.getByOwner(req.params.user, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);	

	app.get('/api/eventByTitle/:title', function(req, res, next){
		eventRepository.searchByTitle(req.params.title, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.get('/api/eventByDateStart/:date', function(req, res, next){
		eventRepository.getByDateStart(req.params.date, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.get('/api/eventByDateEnd/:date', function(req, res, next){
		eventRepository.getByDateEnd(req.params.date, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.get('/api/eventByInterval/:gteDate/:lteDate', function(req, res, next){
		eventRepository.getByInterval(req.params.gteDate, req.params.lteDate, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);	

	app.post('/api/event/', function(req, res, next) {
		eventService.add(req.body, function(err, data) {
			console.log('rout', req.body['title']);
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.put('/api/event/:id', function(req, res, next){
		eventRepository.update(req.params.id, req.body, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.delete('/api/event/:id', function(req, res, next){
		eventService.delete(req.params.id, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);
};