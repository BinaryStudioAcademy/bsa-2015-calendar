var apiResponse = require('express-api-response');
var eventRepository = require('../../repositories/eventRepository');
var eventService = require('../../services/eventService');

module.exports = function(app) {
	app.get('/api/checkEventNotification', function(req, res, next){
		eventService.checkNotification(req.user._id, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.get('/api/event/:id', function(req, res, next) {
		eventRepository.getById(req.params.id, function(err, data) {
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.get('/api/eventpop/:id', function(req, res, next) {
		eventRepository.getByIdPop(req.params.id, function(err, data) {
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.get('/api/event/plan/:id', function(req, res, next) {
		eventRepository.getByPlanId(req.params.id, function(err, data) {
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.get('/api/event/room/:id', function(req, res, next) {
		eventRepository.getByRoomId(req.params.id, function(err, data) {
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

	app.get('/api/eventpop', function(req, res, next){
		eventRepository.getAllPop(function(err, data){
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

	app.get('/api/eventPublicAndByOwner', function(req, res, next){
		eventRepository.getPublicAndByOwner(req.user._id, function(err, data){
			console.log('in public and by owner events route');
			console.log('found data: ', data);
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

	app.get('/api/eventByIntervalpop/:gteDate/:lteDate', function(req, res, next){
		eventRepository.getByIntervalPop(req.params.gteDate, req.params.lteDate, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);	

	app.post('/api/event/', function(req, res, next) {
		console.log(req.body);
		eventService.add(req.body, function(err, data) {
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.put('/api/event/:id', function(req, res, next){
		eventService.update(req.params.id, req.body, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.put('/api/event/newdate/:id', function(req, res, next){
		eventService.updateStartEnd(req.params.id, req.body, function(err, data){
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

	app.delete('api/event/removeUser/:userId/:eventId', function(req, res, next){
		eventRepository.removeUser(req.params.eventId, req.params.userId, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);
};