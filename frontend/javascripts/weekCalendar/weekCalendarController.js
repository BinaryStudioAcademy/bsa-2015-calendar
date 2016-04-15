var app = require('../app');
    moment = require('moment');
require('moment-range');

app.controller('WeekViewController', WeekViewController);


WeekViewController.$inject = ['$state', 'Globals', 'crudEvEventService','helpEventService', 'scheduleService', '$scope', '$uibModal', '$templateCache', '$compile', '$rootScope', 'filterService'];

function WeekViewController($state, Globals, crudEvEventService, helpEventService, scheduleService, $scope, $uibModal, $templateCache, $compile, $rootScope, filterService) {

	var vm = this;
    vm.actualEventTypes = filterService.getActualEventTypes();

    $rootScope.$on('filterTypesChanged', function (event, actualEventTypes) {  
        console.log('filterTypesChanged');         
        vm.actualEventTypes = actualEventTypes;
        vm.clearCells();
        vm.buildEventCells(0);
    });       

    $scope.$on('scheduleTypeChanged', function(){
        console.log('scheduleTypeChanged');
        vm.pullData();
    });


    $scope.$on('addedEventWeekView', function(event, selectedDate, eventBody){
        if(eventBody){
            console.log('evbody',eventBody);
            var index = vm.eventObj.length;
            vm.eventObj.push(eventBody);
            vm.buildEventCells(index);
        }    
    });

    $scope.$on('addedPlanWeekView', function(event, selectedDate, events){
        var index = vm.eventObj.length;
        var range = moment().range(vm.weekStartMoment, vm.weekEndMoment);
        for (var i = 0; i < events.length; i++){
            if (range.contains(moment(events[i].start))){
                vm.eventObj.push(events[i]);
            }
            else break;
        }
        vm.buildEventCells(index);
    });

    $scope.$on('deletedEventWeekView', function(event, selectedDate, eventBody){
        var index = vm.eventObj.length-1,
            indexOfEvent;
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
        for (var i = 0; i < vm.eventObj.length; i++){
            if (vm.eventObj[i] == oldEventBody) {
                indexOfEvent = i;
                break;
            }
        }
        vm.eventObj.splice(indexOfEvent,1);

        if (range.contains(moment(newEventBody.start))){
            vm.eventObj.push(newEventBody);
        }

        // подумать над способом перерисовки без очистки всех ячеек
        vm.clearCells();
        vm.buildEventCells(0);
    });

    vm.clearCells = function(){
        $('.event-cell-week').remove();
    };

    vm.buildEventCells = function(index){        
        console.log('buildcells', vm.eventObj.length); 
        for (var i = index; i < vm.eventObj.length; i++) {           
            for (var j = 0; j < vm.actualEventTypes.length; j++) {
                if (vm.eventObj[i].type._id == vm.actualEventTypes[j].id) {
                    var currEvt = vm.eventObj[i];
                    var evtStart = new Date(currEvt.start);
                    var evtHour = evtStart.getHours();
                    var evtDay = (evtStart.getDay() || 7) - 1;
                    var evtCell = angular.element($('[ng-class="'+ evtHour +'"].'+ vm.daysNames[evtDay]));
                    var eventDiv = angular.element('<div class="event-cell-week"></div>'); 
                    eventDiv.text(currEvt.title);
                    eventDiv.css('background-color', currEvt.type['color']);


                    var icon = document.createElement('div');
                    if(vm.eventObj[i].type.icon){
                        icon.className = vm.eventObj[i].type.icon.css;
                        icon.style.width = '10%';
                        icon.style.float = 'left';
                        eventDiv.append(icon);
                    }   

                    // var tmpl = '<div>'+currEvt.description+'</div><div>Start at: '+moment(currEvt.start).format('hh:mm')+'</div><div>End at: '+moment(currEvt.end).format('hh:mm')+'</div>';
                    // $templateCache.put('evtTmpl'+i+'.html', tmpl);
                    // eventDiv.attr('uib-popover-template', '"evtTmpl'+i+'.html"');
                    // eventDiv.attr('popover-title', currEvt.title);
                    // eventDiv.attr('popover-append-to-body', "true");
                    // eventDiv.attr('trigger', 'focus');
                    var tmpl = '<div>';
                    if (currEvt.description) {
                        tmpl += currEvt.description;
                    }
                    tmpl +='</div><div>Start at: '+moment(currEvt.start).format('hh:mm')+'</div><div>End at: '+moment(currEvt.end).format('hh:mm')+'</div>';
                    

                    if(!Globals.isMobileDevice())
                        eventDiv.popover({
                            trigger: 'hover',
                            delay: 500,
                            container: 'body',
                            placement: 'top',
                            title: currEvt.title,
                            html: true,
                            content: tmpl
                        });

                    var clickEv = Globals.isMobileDevice() ? 'click' : 'dblclick';

                    eventDiv.on( clickEv, function(event){
                        var date = new Date($(event.currentTarget).attr('date'));
                        vm.editEvent(date, vm.eventObj[$(event.currentTarget).attr('index')]); 
                        event.stopPropagation();
                    });    

                    eventDiv.attr('index', i);
                    eventDiv.attr('date', evtStart);

            
                    $compile(eventDiv)($scope);
                    evtCell.append(eventDiv);
                }
            }
        }
    };

    vm.previous = function(){
        vm.weekStartMoment.add(-7,'d');
        vm.weekEndMoment.add(-7,'d');

        vm.Start = new Date(vm.weekStartMoment.format("DD MMM YYYY HH:mm:ss"));    
        vm.End = new Date(vm.weekEndMoment.format("DD MMM YYYY HH:mm:ss"));

        vm.selectedDate = new Date(vm.weekStartMoment.format("DD MMM YYYY HH:mm:ss"));       
   
        vm.pullData();
    };

    vm.next = function(){
        vm.weekStartMoment.add(7,'d');
        vm.weekEndMoment.add(7,'d');

        vm.Start = new Date(vm.weekStartMoment.format("DD MMM YYYY HH:mm:ss"));    
        vm.End = new Date(vm.weekEndMoment.format("DD MMM YYYY HH:mm:ss"));

        vm.selectedDate = new Date(vm.weekStartMoment.format("DD MMM YYYY HH:mm:ss"));     

        vm.pullData();
    };

    vm.createEvent = function(day, hours) {
        console.log('eventService creatingBroadcast call');
        var tmpDate = vm.weekStartMoment.clone();
        tmpDate.add(day, 'd');
        tmpDate.set({'hour': hours, 'minute': 0});
        crudEvEventService.creatingBroadcast(tmpDate, 'WeekView');
    };

    vm.goToDayViewIfMobile = function(day) {
        var tmpDate = vm.weekStartMoment.clone();
        tmpDate.add(day, 'd');
        $state.transitionTo('calendar.dayViewFromYear', { year: tmpDate.year(), month: tmpDate.month() + 1, day: tmpDate.date() });
    };

    vm.editEvent = function(selectedDate, eventBody){
        console.log('eventService editindBroadcast call');
        var tmpDate = moment(selectedDate);

        if(Globals.isMobileDevice())  crudEvEventService.editingBroadcast(tmpDate, eventBody, 'WeekView');
    };



    vm.pullData = function() {
        console.log('pulling data, scheduleType: ', scheduleService.getType());
        console.log('pulling data, scheduleType: ', scheduleService.getItemId());
        switch (scheduleService.getType()){
            case 'event':{
                helpEventService.getUserEvents(vm.Start, vm.End).then(function(data) {
                    if (data !== null){
                        vm.eventObj = data;
                        vm.clearCells();
                        vm.buildEventCells(0);
                    } 
                });
                console.log('user events shedule');
                break;
            }
            case 'room':{
                helpEventService.getRoomEvents(scheduleService.getItemId(), vm.Start, vm.End).then(function(data) {
                    if (data !== null){ 
                        vm.eventObj = data;
                        vm.clearCells();
                        vm.buildEventCells(0);
                    }
                });
                console.log('room events shedule');
                break;
            }
            case 'device':{
                helpEventService.getDeviceEvents(scheduleService.getItemId(), vm.Start, vm.End).then(function(data) {
                    if (data !== null){ 
                        vm.eventObj = data;
                        vm.clearCells();
                        vm.buildEventCells(0);
                    }
                });
                console.log('device events shedule');
                break;
            }
        }
    };


    init();

    function init() {
        vm.timeStamps = helpEventService.getTimeStampsDaily();
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
        vm.pullData();
    }
}
