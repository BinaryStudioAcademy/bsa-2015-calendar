module.exports = function(app) {


	app.get('/api/binary' , function(req,res){
		res.send(req.decoded);
	});
};