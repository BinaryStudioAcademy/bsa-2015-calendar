
var app = require('../app'),
    moment = require('moment');


app.controller('MonthController', MonthController);

MonthController.$inject = ['monthEventService', '$timeout', '$q', '$uibModal'];

function MonthController(monthEventService,  $timeout, $q, $uibModal) {
    var vm = this;
// app.controller("MonthController", function (vm) {
    //vm.day = moment();

    vm.doubleClick = function() {
      alert('Double Click');
      console.log('click');
    };

    vm.maxEventNameLength = 18;
    vm.maxDisplayEventsNumber = 3;

    vm.showEventDetails = function (event) {
        console.log(event.name);
        console.log(event.date.format('DD/MM/YYYY'));
    };

    vm.showAllDayEvents = function (day) {
        console.log(day.events);
    };

    vm.allDayEventsTemplateUrl = 'templates/monthCalendar/monthCalendarAllDaysEventTemplate.html';

    vm.showDay = function(step) {
        var date = new Date(vm.selectedDate);

        date.setDate(
            step === 1 ?
                date.getDate() + 1
                    :
                date.getDate() - 1
        );

        vm.selectedDate = date;
    };

    vm.showDate = function() {
        console.log(vm.selectedDate);
    };

    vm.toggleModal = function() {
        vm.modalShown = !vm.modalShown;
    };

    vm.showCloseModal = function(dayDate) {
        vm.selectedDate = new Date(dayDate.format("DD MMM YYYY HH:mm:ss"));
        vm.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/monthCalendar/editEventMonthTemplate.html',
            controller: 'editEventMonthController',
            controllerAs: 'evMonthCtrl',
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

    // vm.getRowHeight = function () {
    //  var tableRow = $('#calendar tr');
    //  vm.rowHeight = tableRow.outerHeight();
    //  alert(vm.rowHeight);
    // };

    init();

    function init() {

        vm.timeStamps = monthEventService.getTimeStamps();
        var todayDate = new Date();

        vm.selectedDate = vm.selectedDate || todayDate;
        vm.eventSelected = false;
        vm.modalShown = false;
        vm.sidebarStyle = true;

        //will be pulled from server 
        getRooms();
        getInventory();
        getUsers();
        getAllEvents();
        getEventTypes();
    }
    
    function getRooms() {
        monthEventService.getAllRooms()
            .$promise.then(
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
        monthEventService.getAllDevices()
            .$promise.then(
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
        monthEventService.getAllUsers()
            .$promise.then(
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
        monthEventService.getAllEventTypes()
            .$promise.then(
                function(response) {
                    console.log('success Current number of types: ', response.length);
                    vm.eventTypes = response;
                },
                function(response) {
                    console.log('failure', response);
                }
            );
    }

    function getAllEvents() {
        monthEventService.getAllEvents()
            .$promise.then(
                function(response) {
                    console.log('success Number of Events: ', response.length);
                    vm.allEvents = response;
                },
                function(response) {
                    console.log('failure', response);
                }
            );
    }
}
