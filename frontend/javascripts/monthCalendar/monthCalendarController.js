
var app = require('../app'),
    moment = require('moment');

app.controller('MonthController', MonthController);


MonthController.$inject = ['$rootScope', '$scope', 'helpEventService', 'crudEvEventService', '$timeout', '$q', '$uibModal'];

function MonthController($rootScope, $scope, helpEventService, crudEvEventService, $timeout, $q, $uibModal) {

    vm = this;

    $scope.$on('addedEventMonthView', function(event, selectedDate, eventBody){
        var newEventDate = new moment(eventBody.start);
        var daysDiff = newEventDate.diff(vm.mViewStartMoment,'days');
        var weekIndex = Math.floor(daysDiff / 7);
        var dayIndex = newEventDate.isoWeekday() - 1;
        eventBody.momentStartDate = moment(eventBody.start);
        vm.weeks[weekIndex].days[dayIndex].events.push(eventBody);
    });

    $scope.$on('addedPlanMonthView', function(event, selectedDate, events){
        for (var i = 0; i < events.length; i++){
            var newEventDate = new moment(events[i].start);
            if (newEventDate.month() == vm.monthStartMoment.month()){
                var daysDiff = newEventDate.diff(vm.mViewStartMoment,'days'),
                    weekIndex = Math.floor(daysDiff / 7),
                    dayIndex = newEventDate.isoWeekday() - 1;
                events[i].momentStartDate = moment(events[i].start);
                vm.weeks[weekIndex].days[dayIndex].events.push(events[i]);
            }
            else break;
        }   
    });

    $scope.$on('deletedEventMonthView', function(event, selectedDate, eventBody){
        var newEventDate = new moment(eventBody.start),
            daysDiff = newEventDate.diff(vm.mViewStartMoment,'days'),
            weekIndex = Math.floor(daysDiff / 7),
            dayIndex = newEventDate.isoWeekday() - 1,
            indexInEvents;

        for (var i = 0; i < vm.weeks[weekIndex].days[dayIndex].events.length; i++){
            // проверить выполнение равенства
            if (vm.weeks[weekIndex].days[dayIndex].events[i] == eventBody){
                indexInEvents = i;
                break;
            }  
        }
        vm.weeks[weekIndex].days[dayIndex].events.splice(indexInEvents, 1);
    });

    $scope.$on('editedEventMonthView', function(event, selectedDate, oldEventBody, newEventBody){
        
        var newEventDate = new moment(oldEventBody.start),
            daysDiff = newEventDate.diff(vm.mViewStartMoment,'days'),
            weekIndex = Math.floor(daysDiff / 7),
            dayIndex = newEventDate.isoWeekday() - 1,
            indexInEvents;

        for (var i = 0; i < vm.weeks[weekIndex].days[dayIndex].events.length; i++){
            // проверить выполнение равенства
            if (vm.weeks[weekIndex].days[dayIndex].events[i] == eventBody){
                indexInEvents = i;
                break;
            }  
        }
        vm.weeks[weekIndex].days[dayIndex].events.splice(indexInEvents, 1);

        newEventBody.momentStartDate = moment(newEventBody.start);
        vm.weeks[weekIndex].days[dayIndex].events.push(newEventBody);
    });

    vm.next = function () {
        vm.monthStartMoment.add(1,'M');
        vm.monthStartMoment.startOf('month');
        vm.monthEndMoment = vm.monthStartMoment.clone().endOf('month');

        vm.mViewStartMoment = vm.monthStartMoment.clone();
        vm.mViewStartMoment.add(-vm.monthStartMoment.isoWeekday() +1, 'd');
        vm.mViewEndMoment = vm.mViewStartMoment.clone();    
        vm.mViewEndMoment.add(5, 'w');
        vm.mViewEndMoment.set({'hour': 23, 'minute': 59});

        vm.pullData();
    };

    vm.previous = function () {
        vm.monthStartMoment.add(-1,'M');
        vm.monthStartMoment.startOf('month');
        vm.monthEndMoment = vm.monthStartMoment.clone().endOf('month');

        vm.mViewStartMoment = vm.monthStartMoment.clone();
        vm.mViewStartMoment.add(-vm.monthStartMoment.isoWeekday() +1, 'd');
        vm.mViewEndMoment = vm.mViewStartMoment.clone();    
        vm.mViewEndMoment.add(5, 'w');
        vm.mViewEndMoment.set({'hour': 23, 'minute': 59});

        vm.pullData();
    };

    vm.buildEventsObj = function(data){
        vm.events = {};
        // формируем объект имена полей которого соответствуют датам ивента в формате "DD_MMM_YYYY"
        for (var i = 0; i < data.length; i++) {
            var eventStartDate = new Date(data[i].start);
            var eventDate = eventStartDate.getDate()+'_'+(eventStartDate.getMonth()+1)+'_'+eventStartDate.getFullYear();
            vm.events[eventDate] = vm.events[eventDate] || [] ;
            vm.events[eventDate].push(data[i]);
        }
        // console.log(vm.events);
    };


    var flagsInDaily = [];
    $rootScope.$on('flagFromCalendar', function (event, agrs) {           
        var flagsFromCalendar = agrs.messege;
        flagsInDaily.length = 0;                                           
            for (var i = 0; i < flagsFromCalendar.length; i++) {        
                flagsInDaily.push(flagsFromCalendar[i]);
            }
    });

    vm.selectTypeEvent = function(event){                                  
        // console.log('event in day.events', event);                    
        for (var i = 0; i < flagsInDaily.length; i++) {     
            if (event.type == flagsInDaily[i]) return true;
        }
    };


    vm.buildMonth  = function(){

        var date = vm.mViewStartMoment.clone();
        vm.weeks = [];
       
        // формируем недели в таком же стиле как объект с ивентами
        for (var weekIndex = 0; weekIndex < 5; weekIndex++){
            var days = [];
            var evDate;
            
            for (var j = 0; j < 7; j++) {
                days.push({
                    number: date.date(),
                    isCurrentMonth: date.month() === vm.monthStartMoment.month(),
                    isToday: date.isSame(new Date(), "day"),
                    date: date.clone(),
                    events: []
                });
                if (vm.events !== undefined){
                    evDate = days[j].date.format("D_M_YYYY");
                    if(vm.events[evDate]){
                        vm.events[evDate].forEach( function(event){
                            event.momentStartDate = moment(event.start);
                            days[j].events.push(event);
                        });
                    }
                }
                date.add(1, "d");
            }
            vm.weeks.push({days: days});
        }  
        console.log(vm.weeks);
    };


    vm.removeTime = function(date) {
        return date.day(1).hour(0).minute(0).second(0).millisecond(0);
    };

    vm.createEvent = function(selectedDate){
        console.log('eventService creatingBroadcast call');
        crudEvEventService.creatingBroadcast(selectedDate, 'MonthView');
    };

    vm.editEvent = function(selectedDate, eventBody) {
        if (eventBody){
            console.log('eventService editingdBroadcast call');
            //$rootScope.$broadcast('editEvent', selectedDate, eventBody);
            crudEvEventService.editingBroadcast(selectedDate, eventBody, 'MonthView');
        }
    };
    
    vm.pullData = function() {
        var startDate = new Date(vm.monthStartMoment.format("DD MMM YYYY HH:mm:ss")),
            endDate = new Date(vm.monthEndMoment.format("DD MMM YYYY HH:mm:ss"));

        helpEventService.getEvents(startDate, endDate).then(function(data) {
            if (data !== null){ 
                vm.buildEventsObj(data);
            }
            vm.buildMonth();
        });
    };

    init();

    function init() {
        vm.weeks = [];
        vm.events = {};
        vm.maxEventNameLength = 24;
        vm.maxDisplayEventsNumber = 3;
        vm.allDayEventsTemplateUrl = 'templates/monthCalendar/monthCalendarAllDaysEventTemplate.html';

        vm.selected = vm.removeTime(vm.selected || moment());        
        var nowMoment = moment();

        vm.mViewStartMoment = moment({hour: 0, minute: 0});
        vm.mViewStartMoment.add(-nowMoment.isoWeekday() +1, 'd');
        vm.mViewEndMoment = vm.mViewStartMoment.clone();
        vm.mViewEndMoment.add(5, 'w');
        vm.mViewEndMoment.set({'hour': 23, 'minute': 59});

        vm.monthStartMoment = moment().startOf('month');
        vm.monthEndMoment = moment().endOf('month');

        //will be pulled from server 
        vm.pullData();
    }
}
