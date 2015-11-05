var apiResponse = require('express-api-response');
var eventTypeRepository = require('../../repositories/eventTypeRepository');

module.exports = function (app) {

    app.get('/api/eventType/:id', function (req, res, next) {
        eventTypeRepository.getById(req.params.id, function (err, data) {
            res.data = data;
            res.err = err;
            next();
        });
    }, apiResponse);

    app.get('/api/eventType/', function (req, res, next) {
        eventTypeRepository.getAll(function (err, data) {
            res.data = data;
            res.err = err;
            next();
        });
    }, apiResponse);

    app.get('/api/eventTypePublic/', function (req, res, next) {
        eventTypeRepository.getPublic(function (err, data) {
            res.data = data;
            res.err = err;
            next();
        });
    }, apiResponse);

    app.get('/api/eventTypePublicAndByOwner/', function (req, res, next) {
        console.log('req.user.id: ' + req.user._id);
        eventTypeRepository.getPublicAndByOwner(req.user._id, function (err, data) {
            res.data = data;
            res.err = err;
            next();
        });
    }, apiResponse);


    app.get('/api/eventTypeByTitle/:title', function (req, res, next) {
        eventTypeRepository.searchByTitle(req.params.title, function (err, data) {
            res.data = data;
            res.err = err;
            next();
        });
    }, apiResponse);

    app.post('/api/eventType/', function (req, res, next) {
        console.log(req.body);
        eventTypeRepository.add(req.body, function (err, data) {

            res.data = data;
            res.err = err;
            next();
        });
    }, apiResponse);

    app.put('/api/eventType/:id', function (req, res, next) {
        eventTypeRepository.update(req.params.id, req.body, function (err, data) {
            res.data = data;
            res.err = err;
            next();
        });
    }, apiResponse);


    app.delete('/api/eventType/:id', function (req, res, next) {
        eventTypeRepository.delete(req.params.id, function (err, data) {
            res.data = data;
            res.err = err;
            next();
        });
    }, apiResponse);

};