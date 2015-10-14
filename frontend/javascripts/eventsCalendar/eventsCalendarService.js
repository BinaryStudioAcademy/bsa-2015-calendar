var app = require('../app');

app.factory('EventsCalendarService', EventsCalendarService);

EventsCalendarService.$inject = ['$resource'];

function EventsCalendarService($resource) {
	function getEvents(){
		var events = $resource('api/events');
		return events.get();
	}

	return {
		getEvents: getEvents
	};
	
}