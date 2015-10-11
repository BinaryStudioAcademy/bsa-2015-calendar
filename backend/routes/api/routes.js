var eventRoutes = require('./eventRoutes');
var roomRoutes = require('./roomRoutes');
var deviceRoutes = require('./deviceRoutes');
var eventRoutes = require('./eventRoutes');
var planRoutes = require('./planRoutes');
var groupRoutes = require('./groupRoutes');

module.exports = function(app) {
	return {
		eventRoutes: eventRoutes(app),
		roomRoutes: roomRoutes(app),
		deviceRoutes: deviceRoutes(app),
		eventRoutes: eventRoutes(app),
		groupRoutes: groupRoutes(app),
		planRoutes: planRoutes(app)
	};
};