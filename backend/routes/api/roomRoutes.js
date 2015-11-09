var apiResponse = require('express-api-response');
var roomRepository = require('../../repositories/roomRepository');
var eventRepository = require('../../repositories/eventRepository');
var roomService = require('../../services/roomService');

module.exports = function(app) {

	app.get('/api/room/:id', function(req, res, next){
		roomRepository.getById(req.params.id, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);


	app.get('/api/room/', function(req, res, next){
		roomRepository.getAll(function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.get('/api/roomclipped/', function(req, res, next){
		roomRepository.getAllClipped(function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.get('/api/roomByTitle/:title', function(req, res, next){
		roomRepository.searchByTitle(req.params.title, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.get('/api/room/:id/:gteDate/:lteDate', function(req, res, next){
		roomRepository.getRoomEventsByInterval(req.params.id, req.params.gteDate, req.params.lteDate, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.post('/api/room/', function(req, res, next){
		roomRepository.add(req.body, function(err, data){
			console.log('rout', req.body);
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.put('/api/room/:id', function(req, res, next){
		roomRepository.update(req.params.id, req.body, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.delete('/api/room/:id', function(req, res, next){
		roomService.delete(req.params.id, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);	

	app.get('/api/room/:id/:dateStart/:dateEnd', function(req, res, next){
		eventRepository.checkRoomAvailability(req.params.id, req.params.dateStart, req.params.dateEnd, function(err, data){
			if (data.length){
				res.data = data;
			}
			else {
				res.data = {success: true};
			}
			res.err = err;
			next();
		});
	}, apiResponse);	

};