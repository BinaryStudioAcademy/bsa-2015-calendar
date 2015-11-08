var checkToken = require('../middleware/checkToken.js');
var routes = require('./api/routes');
var checkToken = require('../middleware/checkToken');
var tokenUserRoutes = require('./api/tokenUserRoutes');

module.exports = function(app){
	
/*	app.get('/',  function(req, res){
		res.render('index');*/
	routes(app);
	app.use(checkToken);
	tokenUserRoutes(app);

};