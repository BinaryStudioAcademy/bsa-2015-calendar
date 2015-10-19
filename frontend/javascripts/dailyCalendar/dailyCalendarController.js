var app = require('../app');

app.controller('DayViewController', DayViewController);

DayViewController.$inject = ['DailyCalendarService'];

function DayViewController(DailyCalendarService) {
	var vm = this;
	
	vm.timeStamps = DailyCalendarService.getTimeStamps();
	var todayDate = new Date('October 17, 2015');
	
	vm.selectedDate = todayDate;
	vm.eventSelected = false;
	vm.event = DailyCalendarService.getTodaysEvents(todayDate);
	
	vm.toggleEventInfo = function() {
		vm.eventSelected = !vm.eventSelected;
	};
}