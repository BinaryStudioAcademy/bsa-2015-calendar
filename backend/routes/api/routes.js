var eventRoutes = require('./eventRoutes');
var roomRoutes = require('./roomRoutes');
var deviceRoutes = require('./deviceRoutes');
var eventRoutes = require('./eventRoutes');
var planRoutes = require('./planRoutes');
var groupRoutes = require('./groupRoutes');
var authRoutes = require('./authRoutes');
var userRoutes = require('./userRoutes');
var holidayRoutes = require('./holidayRoutes');
var googleEventRoutes = require('./googleEventRoutes');
var eventTypeRoutes = require('./eventTypeRoutes');
var checkToken = require('../../middleware/checkToken');
var tokenUserRoutes = require('./tokenUserRoutes');


module.exports = function(app) {
	app.use(checkToken);
	return {
		authRoutes: authRoutes(app),
		googleEventRoutes: googleEventRoutes(app),
		holidayRoutes: holidayRoutes(app),
		eventRoutes: eventRoutes(app),
		roomRoutes: roomRoutes(app),
		deviceRoutes: deviceRoutes(app),
		groupRoutes: groupRoutes(app),
		planRoutes: planRoutes(app),
		userRoutes: userRoutes(app),
		eventTypeRoutes: eventTypeRoutes(app),
		tokenUserRoutes: tokenUserRoutes(app)

	};
};