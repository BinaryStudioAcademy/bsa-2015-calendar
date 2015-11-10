var app = require('../app');
var moment = require('moment');

app.directive('calendarDirective', calendarDirective);



function calendarDirective($animate) {
    return {
        restrict: 'A',
        templateUrl: 'templates/yearCalendar/monthTemplate.html',
        scope: {
            calendar: '=',
            monthNum: '@',
            evntService: '@'
        },

        link: function ($scope, element, attr) {
            //console.log($scope.calendar.year);

            $scope.$watch('calendar', function(calendar) {
                var monthObj = calendar.months[$scope.monthNum];
                $scope.weeks = [];
                
                //leading empty cells for first week
                var week = [];
                var firstDay = monthObj[0].weekDay;
                if (firstDay === 0) {firstDay = 7;}
                for (var i=1; i<(firstDay); i++) {
                        week.push(' ');
                }

                var monthLenght = monthObj.length;
                for (var y=0; y < monthLenght; y++) { 
                    week.push(monthObj[y]);
                    if (monthObj[y].weekDay === 0) {
                        $scope.weeks.push(week);
                        week = [];
                    }
                }
                $scope.weeks.push(week); //add last week
                // console.log('from $scope.weeks.push(week)', week);
                $animate.enter(element.children('.year-month-table'), element); 
            }, true);   
        },
        controller: function($scope, $injector) {
            var crudEvEventService = $injector.get($scope.evntService);

            $scope.createEvent = function($event) {
                var clickElem = $event.target.attributes.id.value;
                var elemDate = clickElem.split('_');
                var tmpDate = new Date(+elemDate[2], (+elemDate[1])-1, +elemDate[0]);
                var mDate = moment(tmpDate);
                crudEvEventService.creatingBroadcast(mDate, 'YearView');
            };

            $scope.editEvent = function(selectedDate, eventBody) {
                var tmpDate = moment(selectedDate);
                crudEvEventService.editingBroadcast(tmpDate, eventBody, 'YearView');
            };


        }
 
    };
}
