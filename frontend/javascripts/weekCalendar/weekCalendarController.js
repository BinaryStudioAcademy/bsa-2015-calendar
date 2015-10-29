var app = require('../app');

app.controller('WeekViewController', WeekViewController);

WeekViewController.$inject = ['WeekCalendarService', '$scope'];

function WeekViewController(WeekCalendarService, $scope) {
	var vm = this;

	vm.timeStamps = WeekCalendarService.getTimeStamps();
	vm.days = WeekCalendarService.getDays();


	vm.toggleEventInfo = function() {
		vm.eventSelected = !vm.eventSelected;
	};


	var now = new Date();
	var startDay = 1;
	var d = now.getDay();
	var weekStart = new Date(now.valueOf() - (d<=0 ? 7-startDay:d-startDay)*86400000);
	// var weektue = new Date(weekStart.valueOf() + 1*86400000);	
	var weekEnd = new Date(weekStart.valueOf() + 6*86400000);

	vm.Start = weekStart;
	// vm.Tue = weektue;
	vm.End = weekEnd;

	WeekCalendarService.getEvents(weekStart, weekEnd).then(function(data) {
		vm.eventObj = data;
		$scope.$broadcast('eventsUpdated');
	});

}

