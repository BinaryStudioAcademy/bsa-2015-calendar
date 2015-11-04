
var app = require('../app'),
    moment = require('moment');

app.controller('MonthController', MonthController);

MonthController.$inject = ['$scope', 'helpEventService', '$timeout', '$q', '$uibModal'];

function MonthController($scope, helpEventService,  $timeout, $q, $uibModal) {

    vm = this;

    $scope.$on('eventAdded', function(event, eventfromsend){
        var newEventDate = new moment(eventfromsend.start);
        var daysDiff = newEventDate.diff(vm.mViewStartMoment,'days');
        var weekIndex = Math.floor(daysDiff / 7);
        var dayIndex = newEventDate.isoWeekday() - 1;
        eventfromsend.momentStartDate = moment(eventfromsend.start);
        vm.weeks[weekIndex].days[dayIndex].events.push(eventfromsend);
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
        console.log(vm.events);
    };

    vm.buildMonth  = function(){

        var date = vm.mViewStartMoment.clone();
        vm.weeks = [];
       
            // формируем недели в таком же стиле как объект с ивентами
            for (var weekIndex = 0; weekIndex < 5; weekIndex++){
                var days = [];
                var evDate;
                var startDate = date.clone();
                for (var j = 0; j < 7; j++) {
                    days.push({
                        number: date.date(),
                        isCurrentMonth: date.month() === startDate.month(),
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
        
    };


    vm.removeTime = function(date) {
        return date.day(1).hour(0).minute(0).second(0).millisecond(0);
    };

    vm.showCloseModal = function(dayDate) {
        vm.selectedDate = new Date(dayDate.format("DD MMM YYYY HH:mm:ss"));
        vm.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/monthCalendar/editEventMonthTemplate.html',
            controller: 'editEventMonthController',
            controllerAs: 'evMonthCtrl',
            bindToController: true,
            resolve: {
                selectedDate: function () {
                    return vm.selectedDate;
                },
            }
        });
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
        
        //vm.startCurrentMonth = vm.startCurrentMonth || moment().startOf('month');
        
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
