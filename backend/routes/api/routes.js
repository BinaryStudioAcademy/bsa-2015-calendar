var eventRoutes = require('./eventRoutes');
var roomRoutes = require('./roomRoutes');
var deviceRoutes = require('./deviceRoutes');
var eventRoutes = require('./eventRoutes');
var planRoutes = require('./planRoutes');
var groupRoutes = require('./groupRoutes');
var authRoutes = require('./authRoutes');


module.exports = function(app) {
	return {
		authRoutes: authRoutes(app),
		eventRoutes: eventRoutes(app),
		roomRoutes: roomRoutes(app),
		deviceRoutes: deviceRoutes(app),
		groupRoutes: groupRoutes(app),
		planRoutes: planRoutes(app)
	};
};