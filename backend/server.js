var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var connection = require('./db/dbconnect');

 //var faker = require('./faker/generate.js');

 //faker({
//   device: 1,
//   user: 1,
//   room: 1,
//   group: 1,
//   eventType: 1
    //event: 10
 //});




app.use(cookieParser());
app.use(bodyParser());

var context = require('./io/context');
context.mongoStore = new MongoStore({
	mongoose_connection : connection.connection
});

app.use(session({ secret: 'SECRET', store: context.mongoStore }));

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

var socketio = require('./io/socketServer.js')(server);


console.log('server start on port 3080');

module.exports = app;