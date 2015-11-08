var app = require('../app');
    moment = require('moment');
require('moment-range');

app.controller('WeekViewController', WeekViewController);

WeekViewController.$inject = ['crudEvEventService','helpEventService', '$scope', '$uibModal','$compile', '$templateCache', '$rootScope', 'filterService'];

function WeekViewController(crudEvEventService,helpEventService, $scope, $uibModal, $compile, $templateCache, $rootScope, filterService) {
	var vm = this;
    vm.correctFlagsEventTypes = filterService.correctFlags(); 
    // vm.correctFlagsEventTypes = filterService.correctFlags(); 
    // console.log('from WeekViewController', vm.correctFlagsEventTypes);
 

     $rootScope.$on('checkEventTypes', function (event, agrs) {           
        // var flagsFromFilterService = agrs.messege;
        vm.correctFlagsEventTypes = agrs.messege;
        console.log('flagFromWeek', vm.correctFlagsEventTypes);
        // var newCorrectFlags = vm.correctFlagsEventTypes;
        // return newCorrectFlags;                           
            // for (var i = 0; i < flagsFromFilterService.length; i++) {        
            //     vm.correctFlagsEventTypes.push(flagsFromFilterService[i]);
            // }
        // console.log('flagFromWeek', vm.correctFlagsEventTypes);
        vm.clearCells();
        vm.pullData();
    });       


    $scope.$on('eventsUpdated', function() {
        // console.log('from  $scope.$on eventsUpdated', vm.eventObjOll);
        vm.buildEventCells(0);
    });

    $scope.$on('addedEventWeekView', function(event, selectedDate, eventBody){
        console.log('addedEventWeekView', selectedDate, eventBody);
        if(eventBody){
            var index = vm.eventObj.length;

            vm.eventObj.push(eventBody);
            vm.buildEventCells(index);
        }    
    });

    $scope.$on('addedPlanWeekView', function(event, selectedDate, events){
        var index = vm.eventObj.length-1;
        console.log('addedPlanWeekView recieved');
        console.log(selectedDate,events);
        var range = moment().range(vm.weekStartMoment, vm.weekEndMoment);
        console.log(range);
        for (var i = 0; i < events.length; i++){
            console.log(range.contains(events[i].start));
            if (range.contains(events[i].start)){
                console.log('УРРА!');
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


// vm.correctFlagsEventTypes


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
                if(evtCells[j]){
                    evtCells[j].textContent = ''; 
                }
            }
        }
    };


    // console.log('flagFromWeek', vm.correctFlagsEventTypes);

                                                                  //medai


    vm.previous = function(){
        vm.clearCells();

        vm.weekStartMoment.add(-7,'d');
        vm.weekEndMoment.add(-7,'d');

        vm.Start = new Date(vm.weekStartMoment.format("DD MMM YYYY HH:mm:ss"));    
        vm.End = new Date(vm.weekEndMoment.format("DD MMM YYYY HH:mm:ss"));

        vm.selectedDate = new Date(vm.weekStartMoment.format("DD MMM YYYY HH:mm:ss"));       
   
        helpEventService.getEvents(vm.Start, vm.End).then(function(data) {
            if (data !== null){
                vm.eventObjOll = data;                                          //medai
                vm.eventObj = [];
                // console.log('from vm.pullData', vm.eventObj);
                for (var i = 0; i < vm.eventObjOll.length; i++){
                    for (var j = 0; j < vm.correctFlagsEventTypes.length; j++) {     
                        if (vm.eventObjOll[i].type == vm.correctFlagsEventTypes[j]) vm.eventObj.push(vm.eventObjOll[i]);
                    }                    
                }
                console.log('from vm.previous after for-for', vm.eventObj);               
                $scope.$broadcast('eventsUpdated');                             //medai
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
                vm.eventObjOll = data;                                              //medai
                vm.eventObj = [];
                // console.log('from vm.pullData', vm.eventObj);
                for (var i = 0; i < vm.eventObjOll.length; i++){
                    for (var j = 0; j < vm.correctFlagsEventTypes.length; j++) {     
                        if (vm.eventObjOll[i].type == vm.correctFlagsEventTypes[j]) vm.eventObj.push(vm.eventObjOll[i]);
                    }                    
                }
                console.log('from vm.next after for-for', vm.eventObj);               
                $scope.$broadcast('eventsUpdated');                                    //medai
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
        helpEventService.getUserEvents(vm.Start, vm.End).then(function(data) {
            if (data !== null){
                vm.eventObjOll = data;                                              //medai
                vm.eventObj = [];              
                console.log('from vm.pullData', vm.eventObjOll);
                for (var i = 0; i < vm.eventObjOll.length; i++){
                    for (var j = 0; j < vm.correctFlagsEventTypes.length; j++) {     
                        if (vm.eventObjOll[i].type == vm.correctFlagsEventTypes[j]) vm.eventObj.push(vm.eventObjOll[i]);
                    }                    
                }
                console.log('from vm.pullData after for-for', vm.eventObj);               
                $scope.$broadcast('eventsUpdated');                                 //medai
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


        // vm.correctFlagsEventTypes = filterService.correctFlags();    


    }
}
