var app = require('../app');

app.controller('WeekViewController', WeekViewController);

WeekViewController.$inject = ['WeekCalendarService','weekEventService', '$scope', '$uibModal', '$element'];

function WeekViewController(WeekCalendarService, weekEventService, $scope, $uibModal, $element) {
	
    var vm = this;

	vm.timeStamps = WeekCalendarService.getTimeStamps();
	vm.days = WeekCalendarService.getDays();


    vm.toggleEventInfo = function() {
        vm.eventSelected = !vm.eventSelected;
    };

	vm.newEvent = function(day, hour) {
		console.log(day);
		console.log(hour);
		var createEventModal = $uibModal.open({
			templateUrl: 'templates/weekCalendar/createEventModal.html',
			size: 'lg'
			});
	};

    vm.clearCells = function(){
        var daysNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        for(var i = 0; i<7; i++){
            var evtCells = angular.element($('.'+ daysNames[i]));
            for (var j = 0; j <24; j++){
                evtCells[j].textContent = ''; 
            }
        }
    };

    vm.prevWeek = function(){
        vm.clearCells();

        $scope.weekStartMoment.add(-7,'d');
        $scope.weekEndMoment.add(-7,'d');

        vm.Start = new Date($scope.weekStartMoment.format("DD MMM YYYY HH:mm:ss"));    
        vm.End = new Date($scope.weekEndMoment.format("DD MMM YYYY HH:mm:ss"));

        $scope.selectedDate = new Date($scope.weekStartMoment.format("DD MMM YYYY HH:mm:ss"));       
        
        //console.log($scope.weekStartMoment.format("DD MMM YYYY HH:mm:ss"));
        //console.log($scope.weekEndMoment.format("DD MMM YYYY HH:mm:ss"));
        
        WeekCalendarService.getEvents(vm.Start, vm.End).then(function(data) {
            vm.eventObj = data;
            $scope.$broadcast('eventsUpdated');
        });
    };

    vm.nextWeek = function(){
        vm.clearCells();

        $scope.weekStartMoment.add(7,'d');
        $scope.weekEndMoment.add(7,'d');

        vm.Start = new Date($scope.weekStartMoment.format("DD MMM YYYY HH:mm:ss"));    
        vm.End = new Date($scope.weekEndMoment.format("DD MMM YYYY HH:mm:ss"));

        $scope.selectedDate = new Date( $scope.weekStartMoment.format("DD MMM YYYY HH:mm:ss"));     
       
        //console.log($scope.weekStartMoment.format("DD MMM YYYY HH:mm:ss"));
        //console.log($scope.weekEndMoment.format("DD MMM YYYY HH:mm:ss"));

        WeekCalendarService.getEvents(vm.Start, vm.End).then(function(data) {
            vm.eventObj = data;
            $scope.$broadcast('eventsUpdated');
        });
    };

    $scope.showEventDetails = function (event) {
        console.log(event.name);
        console.log(event.date.format('DD/MM/YYYY'));
    };

    $scope.showAllDayEvents = function (day) {
        console.log(day.events);
    };

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

        //console.log('old selected data', $scope.selectedDate);
        //console.log($scope.weekStartMoment.format("DD MMM YYYY HH:mm:ss"));

        var tmpDate = $scope.weekStartMoment.clone();
        tmpDate.add(day, 'd');
        //console.log($scope.weekStartMoment.format("DD MMM YYYY HH:mm:ss"));
        $scope.selectedDate = new Date(tmpDate.format("DD MMM YYYY HH:mm:ss"));

        //console.log('new selected data', $scope.selectedDate);
        //console.log(day);
        //console.log(index);
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

    init();

    function init() {

        var nowMoment = moment();
        $scope.weekEndMoment = moment({hour: 23, minute: 59});
        $scope.weekEndMoment.add(7-nowMoment.isoWeekday(), 'd');
        $scope.weekStartMoment = moment({hour: 0, minute: 0});
        $scope.weekStartMoment.add(-nowMoment.isoWeekday() +1, 'd');
        //console.log(weekEndMoment, weekStartMoment, nowMoment);
        vm.Start = new Date($scope.weekStartMoment.format("DD MMM YYYY HH:mm:ss"));    
        vm.End = new Date($scope.weekEndMoment.format("DD MMM YYYY HH:mm:ss"));

        $scope.selectedDate = new Date($scope.weekStartMoment.format("DD MMM YYYY HH:mm:ss"));     
        //console.log($scope.weekStartMoment.format("DD MMM YYYY HH:mm:ss"));
        WeekCalendarService.getEvents(vm.Start, vm.End).then(function(data) {
            vm.eventObj = data;
            $scope.$broadcast('eventsUpdated');
        });


        // $scope.timeStamps = weekEventService.getTimeStamps();
        // var todayDate = new Date();

        // $scope.selectedDate = $scope.selectedDate || todayDate;
        // $scope.eventSelected = false;
        // $scope.modalShown = false;
        // $scope.sidebarStyle = true;

        // //will be pulled from server 
        // getRooms();
        // getInventory();
        // getUsers();
        // getAllEvents();
        // getEventTypes();
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
