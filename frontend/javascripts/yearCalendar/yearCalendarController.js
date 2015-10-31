var app = require('../app');

app.controller('yearCalendarController', yearCalendarController);

yearCalendarController.$inject = ['calendarService'];

function yearCalendarController(calendarService) {
    var vm = this;

    //init with current year
    var currentDate = new Date();
    vm.currentYear = currentDate.getFullYear();
    vm.calendar = calendarService.getYearObj(vm.currentYear);
    
    calendarService.getEventsObj(vm.currentYear).then(function(dataObj) {
        vm.events = dataObj;
    }, function(error) {
        console.log(error);
    });

    vm.yearDecrement = function() {
        if (vm.currentYear > 1970) {
            vm.currentYear--;
            vm.calendar = calendarService.getYearObj(vm.currentYear);
            calendarService.getEventsObj(vm.currentYear).then(function(dataObj) {
                vm.events = dataObj;
            }, function(error) {
                console.log(error);
            });
        }
    };

    vm.yearIncrement = function() {
        vm.currentYear++;
        vm.calendar = calendarService.getYearObj(vm.currentYear);
        vm.events = calendarService.getEventsObj(vm.currentYear);
        calendarService.getEventsObj(vm.currentYear).then(function(dataObj) {
            vm.events = dataObj;
        }, function(error) {
            console.log(error);
        });
    };

}