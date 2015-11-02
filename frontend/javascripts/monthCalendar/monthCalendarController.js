
var app = require('../app'),
    moment = require('moment');


app.controller('MonthController', MonthController);

MonthController.$inject = ['$scope', 'helpEventService', '$timeout', '$q', '$uibModal'];

function MonthController($scope, helpEventService,  $timeout, $q, $uibModal) {

// app.controller("MonthController", function ($scope) {
    //$scope.day = moment();

    vm = this;

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

    $scope.showCloseModal = function(dayDate) {
        $scope.selectedDate = new Date(dayDate.format("DD MMM YYYY HH:mm:ss"));
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


    vm.pullData = function() {

        helpEventService.getEvents(vm.Start, vm.End).then(function(data) {
            if (data !== null){
                vm.eventObj = data;
                console.log(data);
                $scope.$broadcast('eventsUpdated');
            }
        });

        helpEventService.getRooms().then(function(data) {
            if (data !== null){
                vm.availableRooms = data;
            }
        });

        helpEventService.getDevices().then(function(data) {
            if (data !== null){
                vm.availableInventory = data;
            }
        });

        helpEventService.getUsers().then(function(data) {
            if (data !== null){
                vm.users  = data;
            }
        });

        helpEventService.getEventTypes().then(function(data) {
            if (data !== null){
                vm.eventTypes = data;
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

        $scope.timeStamps = helpEventService.getTimeStamps();
        var todayDate = new Date();

        $scope.selectedDate = $scope.selectedDate || todayDate;
        $scope.eventSelected = false;
        $scope.modalShown = false;
        $scope.sidebarStyle = true;

        //will be pulled from server 
        vm.pullData();
    }
}
