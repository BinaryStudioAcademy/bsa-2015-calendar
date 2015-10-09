var eventRoutes = require('./eventRoutes');

module.exports = function(app) {
	return {
		eventRoutes: eventRoutes(app),
	};
};