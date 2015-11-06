var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../schemas/userSchema');
var userRepository = require('../../repositories/userRepository');
var eventRepository = require('../../repositories/eventRepository');
var userGoogleEvents = require('./../../googleapi/Events/userGoogleEvents');

module.exports = function(app) {

	app.post('/api/register', function(req, res, next) {
		console.log('registering new user: ' + req.body.username + ' | ' + req.body.password);
		User.register(new User({ username: req.body.username, name: req.body.username, email: req.body.email }), req.body.password, function(err){

			if(err){
				console.log('error while user register', err);
				return next(err);
			}

			userGoogleEvents.save(req.body.googleCode, req.body.username);

			eventRepository.getByPrivate(false, function(err, events) {
			if (err) return console.error(err);
			events.forEach(function(evnt) {
				userRepository.addEventByUserName(req.body.username, evnt.id);
				});
			});			
			console.log('user registered!');
			res.send({success : 'true'});
		});
	});

	app.post('/api/login', function(req, res, next){
		console.log('in login');

		passport.authenticate('local', function(err, user, info){
			console.log('user', user);
			if(err) { return next(err); }
			if(!user) { return res.send({ user : null }); }
			req.logIn(user, function(err){
				if(err) { return next(err); }
				var userInfo = {
					id : req.user._id,
					username : req.user.username,
					name : req.user.name,
					events : req.user.events,
					groups : req.user.groups
				};

				return res.send({ user : userInfo });
			});
		})(req, res, next);

	});

	// app.post('/api/login', passport.authenticate('local', function(err, user, info){

	// }), function(req, res){
	// 	var userInfo = {
	// 		username : req.user.username,
	// 		name : req.user.name,
	// 		events : req.user.events,
	// 		groups : req.user.groups
	// 	};

	// 	res.send({ user : userInfo });
	// });

	app.get('/api/authTest', passport.authenticate('local'), function(req, res){
		res.send('If you see this, you are authorized');
	});

	app.post('/api/isAuth', function(req, res){
		var response = req.isAuthenticated();

		res.send({ user : req.user });
	});

	app.get('/api/logout', function(req, res){
		req.logout();
		res.send({ unauthenticated: 'true' });
	});

};