var app = require('../app');

app.directive('timeWeekDirective', timeWeekDirective);

function timeWeekDirective($interval, $timeout) {
    return {
        restrict: 'A',

        link: function ($scope, element, attr) {

            function redLineDraw() {
                //remove old time line if exists TODO - remove only if it leave current cell
                var oldLine = angular.element('.time-line-week');
                if (oldLine.length > 0) {
                    oldLine.remove();
                }

                var currTime = new Date();
                var dayNumber = currTime.getDay();
                if (dayNumber === 0) {
                    dayNumber = 7;
                }
                var daysNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
                var currHour = currTime.getHours();
                var currMin = currTime.getMinutes();
                //minutes as margin from top of hour cell
                //console.log(currHour + ':' + currMin);
                var topMargin = Math.round((100/60)*currMin);
                //get <td> element on hour:ng-class row and day:daysNames column
                var currentCell = angular.element(document.querySelectorAll('[ng-class="'+ currHour +'"].'+ daysNames[dayNumber-1]));
                if (currentCell.length === 1) {
                    redLine.css('top', topMargin+'%');
                    currentCell.append(redLine);
                } else {
                    //cell must be unique
                    console.error('Incorrect number of cells found: ' + currentCell.length);
                }
            }


            var currentTime = Date.now();
            if ($scope.wCtrl.Start <= currentTime && $scope.wCtrl.End >= currentTime) {
                var redLine = angular.element('<div class="time-line-week"></div>');

                //first run after DOM rendering
                $timeout(function() {
                    redLineDraw();
                }, 0);
                
                //run with interval
                $interval(function() {
                    redLineDraw();
                }, 500000);

            }        
        }
    };
}