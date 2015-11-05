var app = require('../app');
    moment = require('moment');
require('moment-range');

app.controller('WeekViewController', WeekViewController);

WeekViewController.$inject = ['crudEvEventService','helpEventService', '$scope', '$uibModal','$compile', '$templateCache'];

function WeekViewController(crudEvEventService,helpEventService, $scope, $uibModal, $compile, $templateCache) {
	var vm = this;

    $scope.$on('eventsUpdated', function() {
        vm.buildEventCells(0);
    });

    $scope.$on('addedEventWeekView', function(event, selectedDate, eventBody){
        console.log('addedEventWeekView', selectedDate, eventBody);
        if(eventBody){

            var index = vm.eventObj.length-1;
            vm.eventObj.push(eventBody);
            vm.buildEventCells(index);
        }    
    });

    $scope.$on('addedPlanWeekView', function(event, selectedDate, events){
        var index = vm.eventObj.length-1;
        console.log(selectedDate,events);
        var range = moment().range(vm.weekStartMoment, vm.weekEndMoment);
        for (var i = 0; i < events.length; i++){
            if (range.contains(events[i].start)){
                vm.eventObj.push(events[i]);
            }
            else break;
        }
        vm.buildEventCells(index);
    });

    $scope.$on('deletedEventWeekView', function(event, selectedDate, eventBody){
        var index = vm.eventObj.length-1,
            indexOfEvent;
        // проверить выполнение равенства
        for (var i = 0; i < vm.eventObj.length; i++){
            if (vm.eventObj[i] == eventBody) {
                indexOfEvent = i;
                break;
            }
        }
        vm.eventObj.splice(indexOfEvent,1);

        // подумать над способом перерисовки без очистки всех ячеек
        clearCells();
        vm.buildEventCells(0);
    });

    $scope.$on('editedEventWeekView', function(event, selectedDate, oldEventBody, newEventBody){
        
        var index = vm.eventObj.length-1,
            indexOfEvent;
        var range = moment().range(vm.weekStartMoment, vm.weekEndMoment);

        // проверить выполнение равенства
        for (var i = 0; i < vm.eventObj.length; i++){
            if (vm.eventObj[i] == oldEventBody) {
                indexOfEvent = i;
                break;
            }
        }
        vm.eventObj.splice(indexOfEvent,1);

        if (range.contains(newEventBody.start)){
            vm.eventObj.push(newEventBody);
        }

        // подумать над способом перерисовки без очистки всех ячеек
        clearCells();
        vm.buildEventCells(0);
    });


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
            eventDiv.attr('index', i);
            eventDiv.attr('date', evtStart);
            eventDiv.on( 'dblclick', function(event){
                var date = new Date($(event.currentTarget).attr('date'));
                vm.editEvent(date, vm.eventObj[$(event.currentTarget).attr('index')]); 
                event.stopPropagation();
            });
            
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

    vm.previous = function(){
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

    vm.next = function(){
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

    vm.createEvent = function(day, hours) {
        var tmpDate = vm.weekStartMoment.clone();
        tmpDate.add(day, 'd');
        tmpDate.set({'hour': hours, 'minute': 0});

        console.log('eventService creatingBroadcast call');
        crudEvEventService.creatingBroadcast(tmpDate, 'WeekView');
    };

    vm.editEvent = function(selectedDate, eventBody){
        console.log('eventService editindBroadcast call');
        var tmpDate = moment(selectedDate);
        console.log(tmpDate);
        crudEvEventService.editingBroadcast(tmpDate, eventBody, 'WeekView');
    };

    vm.pullData = function() {
        helpEventService.getEvents(vm.Start, vm.End).then(function(data) {
            if (data !== null){
                vm.eventObj = data;
                console.log(data);
                $scope.$broadcast('eventsUpdated');
            }
        });
    };

    init();

    function init() {
        vm.timeStamps = helpEventService.getTimeStamps();
        vm.days = helpEventService.getDays();
        vm.daysNames = helpEventService.getDaysNames();
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
