var app = require('../app');

app.controller('yearCalendarController', yearCalendarController);

yearCalendarController.$inject = ['calendarService', 'yearEventService', '$scope', '$uibModal', '$timeout'];

function yearCalendarController(calendarService, yearEventService, $scope, $uibModal, $timeout) {
    var vm = this;

    //init with current year
    var currentDate = new Date();
    vm.currentYear = currentDate.getFullYear();
    vm.calendar = calendarService.getYearObj(vm.currentYear);
    vm.events = [];
    getEvents(vm.currentYear);

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
            //vm.events = dataObj;
            if (dataObj) {
                $scope.$broadcast('eventsUpdated', dataObj);
            }
        }, function(error) {
            console.log(error);
        });
    }


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

    $scope.showCloseModal = function(month, dayDate) {
        $scope.selectedDate = new Date(vm.currentYear, +month, dayDate);
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/yearCalendar/editEventYearTemplate.html',
            controller: 'editEventYearController',
            controllerAs: 'evYearCtrl',
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

    init();

    function init() {
        $scope.selectedDate = $scope.selectedDate || currentDate;
        $scope.eventSelected = false;
        $scope.modalShown = false;
        $scope.sidebarStyle = true;

      
        getRooms();
        getInventory();
        getUsers();
        getAllEvents();
        getEventTypes();
    }

    function getRooms() {
        yearEventService.getAllRooms()
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
        yearEventService.getAllDevices()
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
        yearEventService.getAllUsers()
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
        yearEventService.getAllEventTypes()
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
        yearEventService.getAllEvents()
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