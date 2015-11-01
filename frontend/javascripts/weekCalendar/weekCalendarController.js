var app = require('../app');

app.controller('WeekViewController', WeekViewController);

WeekViewController.$inject = ['WeekCalendarService','weekEventService', '$scope', '$uibModal'];

function WeekViewController(WeekCalendarService, weekEventService, $scope, $uibModal) {
	var vm = this;

	vm.timeStamps = WeekCalendarService.getTimeStamps();
	vm.days = WeekCalendarService.getDays();


	vm.toggleEventInfo = function() {
		vm.eventSelected = !vm.eventSelected;
	};


	var now = new Date();
	var now2 = new moment();
	console.log(now2);

	var startDay = 1;
	var d = now.getDay();
	var weekStart = new Date(now.valueOf() - (d<=0 ? 7-startDay:d-startDay)*86400000);
	$scope.selectedDate = weekStart;
	// var weektue = new Date(weekStart.valueOf() + 1*86400000);	
	var weekEnd = new Date(weekStart.valueOf() + 6*86400000);

	vm.Start = weekStart;
	// vm.Tue = weektue;
	vm.End = weekEnd;

	WeekCalendarService.getEvents(weekStart, weekEnd).then(function(data) {
		vm.eventObj = data;
		$scope.$broadcast('eventsUpdated');
	});

	vm.newEvent = function(day, hour) {
		console.log(day);
		console.log(hour);
		var createEventModal = $uibModal.open({
			templateUrl: 'templates/weekCalendar/createEventModal.html',
			size: 'md'
			});
	};

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

    $scope.showCloseModal = function(day, index) {
        //$scope.selectedDate = new Date(dayDate.format("DD MMM YYYY HH:mm:ss"));
        console.log('old selected data', $scope.selectedDate);

        $scope.selectedDate.setDate($scope.selectedDate.getDate() + day);

        console.log('new selected data', $scope.selectedDate);
        console.log(day);
        console.log(index);
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/weekCalendar/editEventWeekTemplate.html',
            controller: 'editEventWeekController',
            controllerAs: 'evWeekCtrl',
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

        $scope.timeStamps = weekEventService.getTimeStamps();
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
        weekEventService.getAllRooms()
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
        weekEventService.getAllDevices()
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
        weekEventService.getAllUsers()
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
        weekEventService.getAllEventTypes()
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
        weekEventService.getAllEvents()
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
