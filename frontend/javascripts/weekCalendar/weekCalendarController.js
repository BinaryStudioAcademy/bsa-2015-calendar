var app = require('../app');
    moment = require('moment');
require('moment-range');

app.controller('WeekViewController', WeekViewController);

WeekViewController.$inject = ['crudEvEventService','helpEventService', 'scheduleService', '$scope', '$uibModal','$compile', '$rootScope', 'filterService'];

function WeekViewController(crudEvEventService, helpEventService, scheduleService, $scope, $uibModal, $compile, $rootScope, filterService) {
	var vm = this;
    vm.correctFlagsEventTypes = filterService.correctFlags(); 

    $rootScope.$on('checkEventTypes', function (event, agrs) {           
        vm.correctFlagsEventTypes = agrs.messege;
        vm.pullData();
    });       

    $scope.$on('eventsUpdated', function() {
        vm.pullData();
    });

    $scope.$on('addedEventWeekView', function(event, selectedDate, eventBody){
        //console.log('addedEventWeekView', selectedDate, eventBody);
        if(eventBody){
            for (var evt = 0; evt < vm.eventTypes.length; evt++){
                if (vm.eventTypes[evt]['_id'] == eventBody.type) {
                    eventBody.type = vm.eventTypes[evt];
                }
                break;
            }
            var index = vm.eventObj.length;
            vm.eventObj.push(eventBody);
            vm.buildEventCells(index);
        }    
    });

    $scope.$on('addedPlanWeekView', function(event, selectedDate, events){
        var index = vm.eventObj.length-1;
        //console.log('addedPlanWeekView recieved');
        //console.log(selectedDate,events);
        var range = moment().range(vm.weekStartMoment, vm.weekEndMoment);
        //console.log(range);
        for (var i = 0; i < events.length; i++){
            console.log(range.contains(events[i].start));
            if (range.contains(events[i].start)){
                //console.log('УРРА!');
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
        vm.clearCells();
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
        vm.clearCells();
        vm.buildEventCells(0);
    });

    $scope.$on('scheduleTypeChanged', function(){
        vm.pullData();
    });

    vm.clearCells = function(){
        $('.event-cell-week').remove();
    };

    vm.buildEventCells = function(index){            
        for (var i = index; i < vm.eventObj.length; i++) {  
            console.log('1', vm.eventObj[i]);         
            for (var j = 0; j < vm.correctFlagsEventTypes.length; j++) {
                if (vm.eventObj[i].type['_id'] == vm.correctFlagsEventTypes[j]) {
                    console.log('2',vm.eventObj[i]);
                    var currEvt = vm.eventObj[i];
                    var evtStart = new Date(currEvt.start);
                    var evtHour = evtStart.getHours();
                    var evtDay = (evtStart.getDay() || 7) - 1;
                    var evtCell = angular.element($('[ng-class="'+ evtHour +'"].'+ vm.daysNames[evtDay]));
                    var eventDiv = angular.element('<div class="event-cell-week" index='+index+'></div>'); 
                    eventDiv.text(currEvt.title);
                    eventDiv.css('background-color', currEvt.type['color']);
                    var tmpl = '<div>';
                    if (currEvt.description) {
                        tmpl += currEvt.description;
                    }
                    tmpl +='</div><div>Start at: '+moment(currEvt.start).format('hh:mm')+'</div><div>End at: '+moment(currEvt.end).format('hh:mm')+'</div>';
                    eventDiv.popover({
                        trigger: 'hover',
                        delay: 500,
                        container: 'body',
                        placement: 'top',
                        title: currEvt.title,
                        html: true,
                        content: tmpl
                    });
                    eventDiv.on( 'dblclick', function(event){
                        var date = new Date($(event.currentTarget).attr('date'));
                        //console.log('EVT', date, vm.eventObj[$(event.currentTarget).attr('index')]);
                        vm.editEvent(date, vm.eventObj[$(event.currentTarget).attr('index')]); 
                        event.stopPropagation();
                    });
            
                    $compile(eventDiv)($scope);
                    evtCell.append(eventDiv);
                }
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
   
        helpEventService.getUserEvents(vm.Start, vm.End).then(function(data) {
            if (data !== null){
                vm.eventObj = data;                                           
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

        helpEventService.getUserEvents(vm.Start, vm.End).then(function(data) {
            if (data !== null){
                vm.eventObj = data;                                            
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
        //console.log(tmpDate);
        crudEvEventService.editingBroadcast(tmpDate, eventBody, 'WeekView');
    };



    vm.pullData = function() {
        var startDate = new Date(vm.weekStartMoment.format("DD MMM YYYY HH:mm:ss")),
            endDate = new Date(vm.weekEndMoment.format("DD MMM YYYY HH:mm:ss"));
        //console.log('pulling data, scheduleType: ', scheduleService.getType());
        //console.log('pulling data, scheduleType: ', scheduleService.getItemId());
        switch (scheduleService.getType()){
            case 'event':{
                helpEventService.getUserEvents(startDate, endDate).then(function(data) {
                    if (data !== null){
                        vm.eventObj = data;
                        console.log('EVNT', vm.eventObj);
                        vm.clearCells();
                        vm.buildEventCells(0);
                    } 
                });
                //console.log('user events shedule');
                break;
            }
            case 'room':{
                helpEventService.getRoomEvents(scheduleService.getItemId(), startDate, endDate).then(function(data) {
                    if (data !== null){ 
                        vm.eventObj = data;
                        //console.log('ROOM', vm.eventObj);
                        vm.clearCells();
                        vm.buildEventCells(0);
                    }
                });
                //console.log('room events shedule');
                break;
            }
            case 'device':{
                helpEventService.getDeviceEvents(scheduleService.getItemId(), startDate, endDate).then(function(data) {
                    if (data !== null){ 
                        vm.eventObj = data;
                        //console.log('DEV', vm.eventObj);
                        vm.clearCells();
                        vm.buildEventCells(0);
                    }
                });
                //console.log('device events shedule');
                break;
            }
        }
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
        //helpEventService.getEventTypes.then(function(data) {
        //    vm.eventTypes = data;
        //});
    }
}
