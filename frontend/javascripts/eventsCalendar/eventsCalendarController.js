var app = require('../app');

app.controller('EventsViewController', EventsViewController);

function EventsViewController() {
	var vm = this;
	vm.events = [
	{
		date: 'April 9, 1999',
		duration: 'Whole day',
		description: "Someone's b-day."
	},
	{
		date: 'May 13, 2014',
		duration: '9.00-12.00',
		description: 'Meeting with foreign customers.'
	},
	{
		date: 'February 27, 2001',
		duration: '14.00-17.00',
		description: 'Long daily meeting'
	}];
	
}