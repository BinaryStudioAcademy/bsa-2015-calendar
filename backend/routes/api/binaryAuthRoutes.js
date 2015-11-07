var passport = require('passport');
var User = require('../../schemas/userSchema');
var userRepository = require('../../repositories/userRepository');
var eventRepository = require('../../repositories/eventRepository');
var userGoogleEvents = require('./../../googleapi/Events/userGoogleEvents');

module.exports = function(app) {


	app.get('/api/binary' , function(req,res){

		User.findOne({
			email: req.decoded.email
		}).exec(function(err, user){
			if(err){
				return next(err);
			}
			if(!user){
				res.send(req.decoded);
			} else {
				res.send(user);
			}

				
		});
	

	});
};