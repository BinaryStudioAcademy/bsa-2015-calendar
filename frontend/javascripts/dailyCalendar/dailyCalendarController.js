var app = require('../app');

app.controller('DayViewController', DayViewController);

DayViewController.$inject = ['DailyCalendarService'];

function DayViewController(DailyCalendarService) {
	var vm = this;
	
	vm.timeStamps = DailyCalendarService.getTimeStamps();
	var todayDate = new Date();
	
	vm.selectedDate = todayDate;
	vm.eventSelected = false;
	var events = DailyCalendarService.getTodaysEvents(todayDate);
	vm.computedEvents = [];
	//computing height and top values for each event block
	for(var i = 0; i < events.length; i++){
		var temp = {};
		temp.eventAsItIs = events[i];
		temp.heightVal = 888 * (events[i].end.getTime() - events[i].start.getTime()) / 86400000;// 888 is the height of the table; 86400000 amount of milliseconds in the 24 hours
		var now = new Date();
		now.setHours(0,0,0,0);
		temp.topVal = 888 * (events[i].start.getTime() - now.getTime()) / 86400000;
		computedEvents.push(temp);
	}

	
	vm.toggleEventInfo = function() {
		vm.eventSelected = !vm.eventSelected;
	};
}