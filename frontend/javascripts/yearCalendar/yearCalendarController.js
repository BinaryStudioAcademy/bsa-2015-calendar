var app = require('../app');

app.controller('yearCalendarController', yearCalendarController);

yearCalendarController.$inject = ['calendarService', '$scope', '$uibModal', 'helpEventService'];

function yearCalendarController(calendarService, $scope, $uibModal, helpEventService) {
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
        vm.availableRooms = getRooms();
        vm.availableInventory = getInventory();
        vm.users = getUsers();
        vm.eventTypes = getEventTypes();

    }

    vm.showCloseModal = function(elemId) {
        var elemDate = elemId.split('_');
        vm.selectedDate = new Date(+elemDate[2], (+elemDate[1])-1, +elemDate[0]);
        console.log(vm.selectedDate);
        console.log(elemDate);
        vm.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/yearCalendar/editEventYearTemplate.html',
            controller: 'editEventYearController',
            controllerAs: 'evYearCtrl',
            bindToController: true,
            resolve: {
                rooms: function () {
                    return vm.availableRooms;
                },
                devices: function () {
                    return vm.availableInventory;
                },
                users: function () {
                    return vm.users;
                },
                selectedDate: function () {
                    return vm.selectedDate;
                },
                eventTypes: function () {
                    return vm.eventTypes;
                },
            }
        });
    };

    function getRooms() {
        helpEventService.getRooms()
            .then(
                function(response) {
                    console.log('success Total rooms: ', response.length);
                    vm.availableRooms = response;
                },
                function(response) {
                    console.log('failure', response);
                }
            );
    }

    function getInventory() {
        helpEventService.getDevices()
            .then(
                function(response) {
                    console.log('success Inventory items: ', response.length);
                    vm.availableInventory = response;
                },
                function(response) {
                    console.log('failure', response);
                }
            );
    }

    function getUsers() {
        helpEventService.getUsers()
            .then(
                function(response) {
                    console.log('success Number of Users: ', response.length);
                    vm.users = response;
                },
                function(response) {
                    console.log('failure', response);
                }
            );
    }

    function getEventTypes() {
        helpEventService.getEventTypes()
            .then(
                function(response) {
                    console.log('success Current number of types: ', response.length);
                    vm.eventTypes = response;
                },
                function(response) {
                    console.log('failure', response);
                }
            );
    }

}