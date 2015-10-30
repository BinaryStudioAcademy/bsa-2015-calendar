
var app = require('../app'),
    moment = require('moment');


app.controller('MonthController', MonthController);

MonthController.$inject = ['$scope','DailyCalendarService', '$timeout', '$q', '$uibModal'];

function MonthController($scope ,DailyCalendarService,  $timeout, $q, $uibModal) {

// app.controller("MonthController", function ($scope) {
    //$scope.day = moment();

    $scope.doubleClick = function() {
      alert('Double Click');
      console.log('click');
    };

    $scope.maxEventNameLength = 18;
    $scope.maxDisplayEventsNumber = 3;

    $scope.showEventDetails = function (event) {
        console.log(event.name);
        console.log(event.date.format('DD/MM/YYYY'));
    };

    $scope.showAllDayEvents = function (day) {
        console.log(day.events);
    };

    $scope.allDayEventsTemplateUrl = 'templates/monthCalendar/monthCalendarAllDaysEventTemplate.html';

    $scope.showDay = function(step) {
        var date = new Date($scope.selectedDate);

        date.setDate(
            step === 1 ?
                date.getDate() + 1
                    :
                date.getDate() - 1
        );

        $scope.selectedDate = date;
    };

    $scope.showDate = function() {
        console.log($scope.selectedDate);
    };

    $scope.toggleModal = function() {
        $scope.modalShown = !$scope.modalShown;
    };

    $scope.showCloseModal = function() {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/monthCalendar/editEventMonthTemplate.html',
            controller: 'editEventMonthController',
            controllerAs: 'evMonthCtrl',
            bindToController: true,
            resolve: {
                rooms: function () {
                    return $scope.availableRooms;
                },
                devices: function () {
                    return $scope.availableInventory;
                },
                users: function () {
                    return $scope.users;
                },
                selectedDate: function () {
                    return $scope.selectedDate;
                },
                eventTypes: function () {
                    return $scope.eventTypes;
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

        $scope.timeStamps = DailyCalendarService.getTimeStamps();
        var todayDate = new Date();

        $scope.selectedDate = $scope.selectedDate || todayDate;
        $scope.eventSelected = false;
        $scope.modalShown = false;
        $scope.sidebarStyle = true;

        //will be pulled from server 
        getRooms();
        getInventory();
        getUsers();
        getAllEvents();
        getEventTypes();
    }
    
    function getRooms() {
        DailyCalendarService.getAllRooms()
            .$promise.then(
                function(response) {
                    console.log('success Total rooms: ', response.length);
                    $scope.availableRooms = response;
                },
                function(response) {
                    console.log('failure', response);
                }
            );
    }

    function getInventory() {
        DailyCalendarService.getAllDevices()
            .$promise.then(
                function(response) {
                    console.log('success Inventory items: ', response.length);
                    $scope.availableInventory = response;
                },
                function(response) {
                    console.log('failure', response);
                }
            );
    }

    function getUsers() {
        DailyCalendarService.getAllUsers()
            .$promise.then(
                function(response) {
                    console.log('success Number of Users: ', response.length);
                    $scope.users = response;
                },
                function(response) {
                    console.log('failure', response);
                }
            );
    }

    function getEventTypes() {
        DailyCalendarService.getAllEventTypes()
            .$promise.then(
                function(response) {
                    console.log('success Current number of types: ', response.length);
                    $scope.eventTypes = response;
                },
                function(response) {
                    console.log('failure', response);
                }
            );
    }

    function getAllEvents() {
        DailyCalendarService.getAllEvents()
            .$promise.then(
                function(response) {
                    console.log('success Number of Events: ', response.length);
                    $scope.allEvents = response;
                },
                function(response) {
                    console.log('failure', response);
                }
            );
    }
}
