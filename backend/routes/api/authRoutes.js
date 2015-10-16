var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../schemas/userSchema');
var userRepository = require('../../repositories/userRepository');

module.exports = function(app) {

	app.post('/api/register', function(req, res, next) {
		console.log('registering new user: ' + req.body.username + ' | ' + req.body.password);

		User.register(new User({ username: req.body.username }), req.body.password, function(err){
			if(err){
				console.log('error while user register', err);
				return next(err);
			}

			console.log('user registered!');
			res.send({success : 'true'});
		});		
	});

	app.post('/api/login', passport.authenticate('local'), function(req, res){
		res.send({authenticated: 'true'});
	});

	app.get('/api/authTest', passport.authenticate('local'), function(req, res){
		res.send('If you see this, you are authorized');
	});

	app.post('/api/logout', function(req, res){
		req.logout();
		res.send({ unauthenticated: 'true' });
	});

};