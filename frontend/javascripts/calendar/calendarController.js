var app = require('../app');

app.controller('CalendarController', CalendarController);

function CalendarController() {
	var vm = this;
	
	var todayDate = Date.now();
	vm.selectedDate = todayDate;
}