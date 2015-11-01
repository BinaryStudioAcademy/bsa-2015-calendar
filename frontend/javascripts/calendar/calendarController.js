var app = require('../app');

app.controller('CalendarController', CalendarController);

function CalendarController($document, $uibModal) {
	var vm = this;
	
	var todayDate = Date.now();
	vm.selectedDate = todayDate;

	$document.bind("keypress", function(event) {
		if (event.keyCode == 104) {
			$("#myModal").modal("show");
		}
		if (event.keyCode == 27) {
			$("#myModal").uibModal("hide");
		}
	});

}