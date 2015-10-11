var apiResponse = require('express-api-response');
var groupRepository = require('../../repositories/groupRepository');

module.exports = function(app) {
	app.get('/api/group/:id', function(req, res, next) {
		groupRepository.getById(req.params.id, function(err, data) {
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.get('/api/group/', function(req, res, next){
		groupRepository.getAll(function(err, data){
			res.data = data;
			res.err = err;
			next()
		});
	}, apiResponse);


	app.get('/api/groupByTitle/:title', function(req, res, next){
		groupRepository.searchByTitle(req.params.title, function(err, data){
			res.data = data;
			res.err = err;
			next()
		});
	}, apiResponse);

	app.post('/api/group/', function(req, res, next) {
		groupRepository.add(req.body, function(err, data) {
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.put('/api/group/:id', function(req, res, next){
		groupRepository.update(req.params.id, req.body, function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.delete('/api/group/:id', function(req, res, next){
		groupRepository.delete(req.params.id, function(err, data){
			res.data = data;
			res.err = err;
			next()
		});
	}, apiResponse);
};