module.exports = {
	dbname: 'calendar-app',
	uri: 'mongodb://localhost/calendar-app',
	mocked_db: false,
	opts: {
		server: { 
			auto_reconnect: true,
			poolSize: 40
		},
		user: 'root'
	}
};