var apiResponse = require('express-api-response');
var holidayRepository = require('../../repositories/holidayRepository');

module.exports = function(app) {
	app.get('/api/holiday/:id', function(req, res, next) {
		holidayRepository.getById(req.params.id, function(err, data) {
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.get('/api/holiday/', function(req, res, next){
		holidayRepository.getAll(function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);	

	app.get('/api/holidayByTitle/:title', function(req, res, next){
		holidayRepository.searchByTitle(req.params.title, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.get('/api/holidayByDateStart/:date', function(req, res, next){
		holidayRepository.getByDateStart(req.params.date, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.get('/api/holidayByDateEnd/:date', function(req, res, next){
		holidayRepository.getByDateEnd(req.params.date, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.post('/api/holiday/', function(req, res, next) {
		holidayRepository.add(req.body, function(err, data) {
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.put('/api/holiday/:id', function(req, res, next){
		holidayRepository.update(req.params.id, req.body, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.delete('/api/holiday/:id', function(req, res, next){
		holidayRepository.delete(req.params.id, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);
};