var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'SECRET' }));

staticPath = path.normalize(__dirname + '/../bower_components');

app.use('/bower_components', express.static(staticPath));
app.use('/', express.static(__dirname + '/../public'));
// app.use(express.bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//passport
app.use(passport.initialize());
app.use(passport.session());

var User = require('./schemas/userSchema');
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'jade');
app.set('views', __dirname + '/../frontend/views');

var routes = require('./routes/api/routes')(app);

http.globalAgent.maxSockets = Infinity;

var server = app.listen(3080);
console.log('server start on port 3080');

var generateFakes = require('./faker/generate');
generateFakes({
	device: 10,
	room: 5,
	user: 20,
	group: 3
});

module.exports = app;