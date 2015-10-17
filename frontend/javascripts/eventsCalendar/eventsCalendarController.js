var app = require('../app');

app.controller('EventsViewController', ['EventsCalendarService', EventsViewController]);

function EventsViewController(EventsCalendarService) {
	var vm = this;
	vm.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	vm.events = EventsCalendarService.getEvents();
	
}