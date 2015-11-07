var checkToken = require('../middleware/checkToken.js');
var routes = require('./api/routes');
var binaryAuthRoutes = require('./api/binaryAuthRoutes.js');
module.exports = function(app){
	app.use(checkToken);
	routes(app);

	
	binaryAuthRoutes(app);
};