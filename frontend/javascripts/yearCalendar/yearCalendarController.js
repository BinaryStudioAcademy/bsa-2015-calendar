var app = require('../app');

app.controller('yearCalendarController', yearCalendarController);

yearCalendarController.$inject = ['calendarService', '$scope'];

function yearCalendarController(calendarService, $scope) {
    var vm = this;

    //init with current year by default
    init();

    vm.yearDecrement = function() {
        if (vm.currentYear > 1970) {
            vm.currentYear--;
            vm.calendar = calendarService.getYearObj(vm.currentYear);
            getEvents(vm.currentYear);
        }
    };

    vm.yearIncrement = function() {
        vm.currentYear++;
        vm.calendar = calendarService.getYearObj(vm.currentYear);
        vm.events = calendarService.getEventsObj(vm.currentYear);
        getEvents(vm.currentYear);
    };

    function getEvents(year) {
        calendarService.getEventsObj(year).then(function(dataObj) {
            if (dataObj) {
                $scope.$broadcast('eventsUpdated', dataObj);
            }
        }, function(error) {
            console.log(error);
        });
    }

    function init(year) {
        var currentDate = new Date();
        vm.currentYear = year || currentDate.getFullYear();
        vm.calendar = calendarService.getYearObj(vm.currentYear);
        getEvents(vm.currentYear);
    }


}