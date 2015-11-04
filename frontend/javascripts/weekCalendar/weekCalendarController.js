var app = require('../app');
    moment = require('moment');

app.controller('WeekViewController', WeekViewController);

WeekViewController.$inject = ['helpEventService', '$scope', '$uibModal','$compile', '$templateCache'];

function WeekViewController(helpEventService, $scope, $uibModal, $compile, $templateCache) {
	var vm = this;

    vm.timeStamps = helpEventService.getTimeStamps();
    vm.days = helpEventService.getDays();
    vm.daysNames = helpEventService.getDaysNames();

    $scope.$on('eventsUpdated', function() {
        vm.buildEventCells(0);
    });

    $scope.$on('eventAdded', function(event, data) {
        if(data){
            var index = vm.eventObj.length-1;
            vm.eventObj.push(data);
            vm.buildEventCells(index);
        }    
    });

    vm.toggleEventInfo = function() {
        vm.eventSelected = !vm.eventSelected;
    };

	vm.newEvent = function(day, hour) {
		console.log(day);
		console.log(hour);
		var createEventModal = $uibModal.open({
			templateUrl: 'templates/weekCalendar/createEventModal.html',
			size: 'md'
			});
	};

    vm.buildEventCells = function(index){
        for (var i = index; i < vm.eventObj.length; i++) { 
            var currEvt = vm.eventObj[i];
            var evtStart = new Date(currEvt.start);
            var evtHour = evtStart.getHours();
            var evtDay = (evtStart.getDay() || 7) - 1;
            var evtCell = angular.element($('[ng-class="'+ evtHour +'"].'+ vm.daysNames[evtDay]));
            var eventDiv = angular.element('<div class="event-cell-week"></div>'); 
            eventDiv.text(currEvt.title);
            var tmpl = '<div>'+currEvt.description+'</div><div>Start at: '+moment(currEvt.start).format('hh:mm')+'</div><div>End at: '+moment(currEvt.end).format('hh:mm')+'</div>';
            $templateCache.put('evtTmpl'+i+'.html', tmpl);
            eventDiv.attr('uib-popover-template', '"evtTmpl'+i+'.html"');
            eventDiv.attr('popover-title', currEvt.title);
            eventDiv.attr('popover-append-to-body', "true");
            eventDiv.attr('trigger', 'focus');

            //background color for different types of events
            switch(currEvt.type) {
                case('basic'):
                    eventDiv.css('background-color', 'rgba(255, 228, 196, 0.7)');
                    break;
                case('general'):
                    eventDiv.css('background-color', 'rgba(135, 206, 250, 0.7)');
                    break;
                case('activity'):
                    eventDiv.css('background-color', 'rgba(60, 179, 113, 0.7)');
                    break;
                default:
                    eventDiv.css('background-color', 'rgba(205, 205, 193, 0.7)');
            }

            $compile(eventDiv)($scope);
            evtCell.append(eventDiv);
        }
    };

    vm.clearCells = function(){
        for(var i = 0; i<7; i++){
            var evtCells = angular.element($('.'+ vm.daysNames[i]));
            for (var j = 0; j <24; j++){
                evtCells[j].textContent = ''; 
            }
        }
    };

    vm.prevWeek = function(){
        vm.clearCells();

        vm.weekStartMoment.add(-7,'d');
        vm.weekEndMoment.add(-7,'d');

        vm.Start = new Date(vm.weekStartMoment.format("DD MMM YYYY HH:mm:ss"));    
        vm.End = new Date(vm.weekEndMoment.format("DD MMM YYYY HH:mm:ss"));

        vm.selectedDate = new Date(vm.weekStartMoment.format("DD MMM YYYY HH:mm:ss"));       
   
        helpEventService.getEvents(vm.Start, vm.End).then(function(data) {
            if (data !== null){
                vm.eventObj = data;
                console.log(data);
                $scope.$broadcast('eventsUpdated');
            }
        });
    };

    vm.nextWeek = function(){
        vm.clearCells();

        vm.weekStartMoment.add(7,'d');
        vm.weekEndMoment.add(7,'d');

        vm.Start = new Date(vm.weekStartMoment.format("DD MMM YYYY HH:mm:ss"));    
        vm.End = new Date(vm.weekEndMoment.format("DD MMM YYYY HH:mm:ss"));

        vm.selectedDate = new Date( vm.weekStartMoment.format("DD MMM YYYY HH:mm:ss"));     

        helpEventService.getEvents(vm.Start, vm.End).then(function(data) {
            if (data !== null){
                vm.eventObj = data;
                console.log(data);
                $scope.$broadcast('eventsUpdated');
            }
        });
    };

    vm.showEventDetails = function (event) {
        console.log(event.name);
        console.log(event.date.format('DD/MM/YYYY'));
    };

    vm.showAllDayEvents = function (day) {
        console.log(day.events);
    };

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

    vm.showCloseModal = function(day, index) {

        var tmpDate = vm.weekStartMoment.clone();
        tmpDate.add(day, 'd');
        vm.selectedDate = new Date(tmpDate.format("DD MMM YYYY HH:mm:ss"));
        vm.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/weekCalendar/editEventWeekTemplate.html',
            controller: 'editEventWeekController',
            controllerAs: 'evWeekCtrl',
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

        var nowMoment = moment();
        vm.weekEndMoment = moment({hour: 23, minute: 59});
        vm.weekEndMoment.add(7-nowMoment.isoWeekday(), 'd');
        vm.weekStartMoment = moment({hour: 0, minute: 0});
        vm.weekStartMoment.add(-nowMoment.isoWeekday() +1, 'd');
        vm.Start = new Date(vm.weekStartMoment.format("DD MMM YYYY HH:mm:ss"));    
        vm.End = new Date(vm.weekEndMoment.format("DD MMM YYYY HH:mm:ss"));

        vm.selectedDate = new Date(vm.weekStartMoment.format("DD MMM YYYY HH:mm:ss"));     

        // //will be pulled from server 
        vm.pullData();
    }
}
