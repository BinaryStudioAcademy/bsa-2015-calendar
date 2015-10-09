var path = require('path');
var express = require('express');
var http = require('http');
var app = express();
staticPath = path.normalize(__dirname + '/../bower_components');

app.use('/bower_components', express.static(staticPath));
app.use('/', express.static(__dirname + '/../public'));

app.set('view engine', 'jade');
app.set('views', __dirname + '/../frontend/views');

var routes = require('./routes/api/routes')(app);

http.globalAgent.maxSockets = Infinity;

var server = app.listen(3080);
console.log('server start on port 3080');

module.exports = app;