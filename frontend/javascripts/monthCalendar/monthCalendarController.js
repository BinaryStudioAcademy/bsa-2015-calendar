
var app = require('../app'),
    moment = require('moment');


app.controller('MonthController', MonthController);


MonthController.$inject = ['$scope', 'helpEventService', '$timeout', '$q', '$uibModal'];

function MonthController($scope, helpEventService,  $timeout, $q, $uibModal) {

// app.controller("MonthController", function ($scope) {
    //$scope.day = moment();

    vm = this;

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


    vm.pullData = function() {

        // helpEventService.getEvents($scope.Start, $scope.End).then(function(data) {
        //     if (data !== null){
        //         $scope.eventObj = data;
        //         console.log(data);
        //         $scope.$broadcast('eventsUpdated');
        //     }
        // });

        helpEventService.getRooms().then(function(data) {
            if (data !== null){
                $scope.availableRooms = data;
            }
        });

        helpEventService.getDevices().then(function(data) {
            if (data !== null){
                $scope.availableInventory = data;
            }
        });

        helpEventService.getUsers().then(function(data) {
            if (data !== null){
                $scope.users  = data;
            }
        });

        helpEventService.getEventTypes().then(function(data) {
            if (data !== null){
                $scope.eventTypes = data;
            }
        });

        // helpEventService.getAllEvents().then(function(data) {
        //     if (data !== null){
        //         vm.allEvents  = data;
        //     }
        // });
    };

    init();

    function init() {

        vm.timeStamps = helpEventService.getTimeStamps();

        var todayDate = new Date();

        vm.selectedDate = vm.selectedDate || todayDate;
        vm.eventSelected = false;
        vm.modalShown = false;
        vm.sidebarStyle = true;

        //will be pulled from server 

        vm.pullData();
    }
}
