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

	app.post('/api/event/', function(req, res, next) {
		eventRepository.add(req.body, function(err, data) {
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);
};