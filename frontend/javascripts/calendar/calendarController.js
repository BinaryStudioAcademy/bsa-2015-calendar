var app = require('../app');

app.controller('CalendarController', CalendarController);

function CalendarController($document, $modal) {
	var vm = this;
	
	var todayDate = Date.now();
	vm.selectedDate = todayDate;

	$document.bind("keypress", function(event) {
		console.log(event.keyCode);
		if (event.keyCode == 112) {
			$("#myModal").modal("show");
		}
		if (event.keyCode == 27) {
			$("#myModal").modal("hide");
		}
	});

}