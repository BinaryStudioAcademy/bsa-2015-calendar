var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../schemas/userSchema');
var userRepository = require('../../repositories/userRepository');
var eventRepository = require('../../repositories/eventRepository');
var userGoogleEvents = require('./../../googleapi/Events/userGoogleEvents');
var jsonwebtoken = require('jsonwebtoken');
var Cookies = require('cookies');

module.exports = function(app) {

	app.post('/api/register', function(req, res, next) {
		console.log('registering new user: ' + req.body.username + ' | ' + req.body.password);
		User.register(new User({ username: req.body.username, name: req.body.username, email: req.body.email }), req.body.password, function(err){

			if(err){
				console.log('error while user register', err);
				return next(err);
			}

			userGoogleEvents.save(req.body.googleCode, req.body.username);

	
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
					groups : req.user.groups,
					completedTutorial: req.user.completedTutorial
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

		// var cookies = new Cookies(req, res);
		// var token = cookies.get('x-access-token');

		// if(token) {
		// 	jsonwebtoken.verify(token, 'superpupersecret', function(err, decoded) {
		// 		if(err) {
		// 			// res.status(403).send({
		// 			// 	success: false, message: 'Failed to authenticate user'
		// 			// });
		// 		} else {
		// 			//req.decoded = decoded;
		// 			console.log(decoded);
		// 		}
		// 	});
		// } else {
		// 	console.log('!token');
		// }

		// console.log('req.user', JSON.stringify(req.user));

		// User.register(new User({ username: req.body.username, name: req.body.username, email: req.body.email }), req.body.password, function(err){

		// 	if(err){
		// 		console.log('error while user register', err);
		// 		return next(err);
		// 	}

		// 	userGoogleEvents.save(req.body.googleCode, req.body.username);

	
		// 	console.log('user registered!');
		// 	res.send({success : 'true'});
		// });		
		
		res.send({ user : req.user });
	});

	app.get('/api/logout', function(req, res){
		req.logout();
		res.send({ unauthenticated: 'true' });
	});

};