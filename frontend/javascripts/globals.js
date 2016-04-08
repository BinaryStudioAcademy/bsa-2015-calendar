var app = require('./app');

app.service('Globals', function() {
	var vm = this;

	vm.baseUrl = 'http://localhost:3080';

	vm.tutorialTexts = [{
		text: 'Use double click to create event and right click to change event',
		img: '/img/1.png'
	}, {
		text: 'Event should have title, type and lasts more than 15 min. You can create public and recurring events',
		img: '/img/2.png'
	}, {
		text: 'Every event has specific type. You can create custom event types. Default types is basic, general, google and holiday',
		img: '/img/3.png'
	}, {
		text: 'To create recurring events you should choose start and end date, and set desired days of week',
		img: '/img/4.png'
	}, {
		text: 'Right click on the event to change event data',
		img: '/img/5.png'
	}, {
		text: 'To change duration and start/end time you can drag and resize event block with left click',
		img: '/img/6.png'
	}, {
		text: 'Use double click to create event and right click to change event',
		img: '/img/7.png'
	}, {
		text: 'Use double click to create event and right click to change event',
		img: '/img/8.png'
	}, {
		text: 'Use double click to create event and right click to change event. To move to specific month view click on the month name',
		img: '/img/9.png'
	}];
	
});

