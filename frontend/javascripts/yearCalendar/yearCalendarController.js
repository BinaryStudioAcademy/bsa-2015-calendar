var app = require('../app');

app.controller('yearCalendarController', yearCalendarController);

yearCalendarController.$inject = ['calendarService'];

function yearCalendarController(calendarService) {
    var vm = this;

    //init with current year
    var currentDate = new Date();
    vm.currentYear = currentDate.getFullYear();
    vm.calendar = calendarService.getYearObj(vm.currentYear);
    
    vm.events = calendarService.getEventsObj(vm.currentYear);

    vm.yearDecrement = function() {
        if (vm.currentYear > 1970) {
            vm.currentYear--;
            vm.calendar = calendarService.getYearObj(vm.currentYear);
            vm.events = calendarService.getEventsObj(vm.currentYear);
        }
    };

    vm.yearIncrement = function() {
        vm.currentYear++;
        vm.calendar = calendarService.getYearObj(vm.currentYear);
        vm.events = calendarService.getEventsObj(vm.currentYear);
    };

}