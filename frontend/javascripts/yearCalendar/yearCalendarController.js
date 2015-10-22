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
            //vm.slides.pop();
            //vm.slides.unshift(vm.currentYear-1);
        }
    };

    vm.yearIncrement = function() {
        vm.currentYear++;
        vm.calendar = calendarService.getYearObj(vm.currentYear);
        vm.events = calendarService.getEventsObj(vm.currentYear);
        //vm.slides.shift();
        //vm.slides.push(vm.currentYear+1);
    };

    //vm.slides = [vm.currentYear-1, vm.currentYear, vm.currentYear+1];

}