var app = require('../app');

app.controller('EventsViewController', ['EventsCalendarService', EventsViewController]);

function EventsViewController(EventsCalendarService) {
	var vm = this;
	vm.events = EventsCalendarService.getEvents();
}