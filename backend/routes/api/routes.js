var eventRoutes = require('./eventRoutes');
var roomRoutes = require('./roomRoutes');
var deviceRoutes = require('./deviceRoutes');
var eventRoutes = require('./eventRoutes');
var planRoutes = require('./planRoutes');

module.exports = function(app) {
	return {
		eventRoutes: eventRoutes(app),
		roomRoutes: roomRoutes(app),
		deviceRoutes: deviceRoutes(app),
		eventRoutes: eventRoutes(app),
		planRoutes: planRoutes(app)
	};
};