var app = require('../app');

app.controller('CalendarController', CalendarController);

function CalendarController($document, $uibModal) {
	var vm = this;
	
	var todayDate = Date.now();
	vm.selectedDate = todayDate;

	$document.bind("keypress", function(event) {
		//console.log(event.keyCode);
		if (event.keyCode == 112) {
			$("#myModal").uibModal("show");
		}
		if (event.keyCode == 27) {
			$("#myModal").uibModal("hide");
		}
	});

}