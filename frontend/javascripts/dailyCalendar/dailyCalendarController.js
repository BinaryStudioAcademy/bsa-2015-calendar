var app = require('../app');

app.controller('DayViewController', DayViewController);

DayViewController.$inject = ['DailyCalendarService'];
function DayViewController(DailyCalendarService) {
	var vm = this;
	
	vm.timeStamps = DailyCalendarService.getTimeStamps();
	var todayDate = Date.now();
	var date1 = new Date(2015, 9, 9, 8);
	var date2 = new Date(2015, 9, 9, 13);

	
	vm.selectedDate = todayDate;
	vm.eventSelected = false;
	vm.event = getEvents(date1, date2);
	
	vm.toggleEventInfo = function() {
		vm.eventSelected = !vm.eventSelected;
	};
	
	function getEvents(date1, date2) {
		var event = {
			name: 'Angular Deep Dive',
			description: 'Nice course about angular directives, casestudies and many practical problems',
			author: 'Alex C',
			room: 3,
			participants: 10,
			startTime: date1,
			endTime: date2,
		};
		
		return event;
	}
}