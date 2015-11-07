var jsonwebtoken = require('jsonwebtoken');
var config = require('../config/tokenAuth.js');
var Cookies = require('cookies');

module.exports = function(req, res, next){
	var cookies = new Cookies(req, res);
	var token = cookies.get('x-access-token');
	if (token) {
		jsonwebtoken.verify(token, config.secretKey, function(err, decoded) {
			if (err) {
				res.status(403).send({ success: false, message: "Failed to authenticate user"});
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		res.redirect(config.auth_host);
	}
};