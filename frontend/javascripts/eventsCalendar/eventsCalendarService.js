var app = require('../app');

app.factory('EventsCalendarService',  ['$resource', EventsCalendarService]);

function EventsCalendarService($resource) {
	function getEvents(){
		return $resource('/api/event/').query();
	}

	return {
		getEvents: getEvents
	};
}