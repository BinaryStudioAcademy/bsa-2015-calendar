var app = require('../app');

app.controller('WeekViewController', WeekViewController);

WeekViewController.$inject = ['DailyCalendarService'];


function WeekViewController(DailyCalendarService) {
	var vm = this;

	vm.timeStamps = DailyCalendarService.getTimeStamps();

	vm.toggleEventInfo = function() {
		vm.eventSelected = !vm.eventSelected;
	};


	var now = new Date();
	var startDay = 1;
	var d = now.getDay();
	var weekStart = new Date(now.valueOf() - (d<=0 ? 7-startDay:d-startDay)*86400000);
	var weekEnd = new Date(weekStart.valueOf() + 6*86400000);

	vm.Start = weekStart;
	vm.End = weekEnd;
}
