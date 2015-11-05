var app = require('../app');

app.directive('calendarDirective', calendarDirective);

function calendarDirective($animate) {
    return {
        restrict: 'A',
        templateUrl: 'templates/yearCalendar/monthTemplate.html',
        scope: {
            calendar: '=',
            monthNum: '@',
            modal: '&'
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

                $animate.enter(element.children('.year-month-table'), element); 
            }, true);   
        },
        controller: function($scope) {
            $scope.openModal = function($event) {
                var clickElem = $event.target.attributes.id.value;
                $scope.modal({clickElem: clickElem});
            };
        }
 
    };
}
