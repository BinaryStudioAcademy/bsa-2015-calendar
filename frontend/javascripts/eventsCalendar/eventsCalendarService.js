var app = require('../app');

app.factory('EventsCalendarService', EventsCalendarService);

EventsCalendarService.$inject = ['$resource'];

function EventsCalendarService($resource) {
	function getEvents(){
		var Events = $resource('api/events');
		return Events.get();
	}

	return {
		getEvents: getEvents
	};
	
}