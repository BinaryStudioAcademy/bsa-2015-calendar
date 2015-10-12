var app = require('../app');

app.controller('yearCalendarController', yearCalendarController);

yearCalendarController.$inject = [];

function yearCalendarController() {
	var vm = this;

    //mock objects
    vm.years = [2014, 2015, 2016, 2017];
    vm.calendar = [[1, 2, 3, 4, 5, 6, 7], [8, 9, 10, 11, 12, 13, 14], [15, 16, 17, 18, 19, 20, 21], [22, 23, 24, 25, 26, 27, 28], [29, 30, 31]];
	

}