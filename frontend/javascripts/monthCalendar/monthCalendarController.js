
var app = require('../app'),
    moment = require('moment');

app.controller('MonthController', MonthController);

MonthController.$inject = ['$scope', 'helpEventService', '$timeout', '$q', '$uibModal'];

function MonthController($scope, helpEventService,  $timeout, $q, $uibModal) {


    vm = this;

    $scope.maxEventNameLength = 24;
    $scope.maxDisplayEventsNumber = 3;

    $scope.selected = _removeTime($scope.selected || moment());
    $scope.month = $scope.selected.clone();
    var start = $scope.selected.clone();
    start.date(1);
    _removeTime(start.day(0));


    var nowMoment = moment();

    vm.monthStartMoment = moment({hour: 0, minute: 0});
    vm.monthStartMoment.add(-nowMoment.isoWeekday() +1, 'd');
   
    vm.monthEndMoment = vm.monthStartMoment.clone();
    vm.monthEndMoment.add(5, 'w');
    vm.monthEndMoment.set({'hour': 23, 'minute': 59});

    vm.Start = new Date(vm.monthStartMoment.format("DD MMM YYYY HH:mm:ss"));    
    vm.End = new Date(vm.monthEndMoment.format("DD MMM YYYY HH:mm:ss"));

    _buildMonth(vm.monthStartMoment, vm.monthEndMoment);


    function _removeTime(date) {
        return date.day(1).hour(0).minute(0).second(0).millisecond(0);
    }

    function _buildMonth(start, end) {
        $scope.weeks = [];
        $scope.events = {};

        var date = start.clone();

        console.log(start,end);      


        helpEventService.getEvents(new Date(start.format("DD MMM YYYY HH:mm:ss")),new Date(end.format("DD MMM YYYY HH:mm:ss"))).then(function(data) {
            if (data !== null){
                var events = data;
                for (var i = 0; i < events.length; i++) {
                    var eventStartDate = new Date(events[i].start);
                    var evDate = eventStartDate.getDate()+'_'+(eventStartDate.getMonth()+1)+'_'+eventStartDate.getFullYear();
                    $scope.events[evDate] = $scope.events[evDate] || [] ;
                    $scope.events[evDate].push(events[i]);
                }
                for (var weekIndex = 0; weekIndex < 5; weekIndex++){
                    $scope.weeks.push({days: _buildWeek(date.clone())});
                    date.add(1, "w");
                }
            }  
            console.log($scope.weeks); 
        });

        
    }

    function getDateEvents(eventsObj, dateString) {
        var events = [];

        eventsObj[dateString].forEach( function(event){
                console.log(event.title, event.start);
                events.push({name:event.title, date: moment(event.start)});
            });

        return events;
    }

    function _buildWeek(date) {
        var days = [];
        var evDate;
        var startDate = date.clone();
        for (var i = 0; i < 7; i++) {
            days.push({
                number: date.date(),
                isCurrentMonth: date.month() === startDate.month(),
                isToday: date.isSame(new Date(), "day"),
                date: date,
                events: []
            });
            if ($scope.events !== undefined){
                evDate = days[i].date.format("D_M_YYYY");
                if($scope.events[evDate]){
                    $scope.events[evDate].forEach( function(event){
                        days[i].events.push({eventbody: event, date: moment(event.start)});
                    });
                }
            }
            date = date.clone();
            date.add(1, "d");
        }
        return days;
    }


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
            templateUrl: 'templates/monthCalendar/  .html',
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
