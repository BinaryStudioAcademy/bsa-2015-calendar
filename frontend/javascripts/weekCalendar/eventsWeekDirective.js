var app = require('../app');

app.directive('eventsWeekDirective', eventsWeekDirective);

function eventsWeekDirective($compile) {
    return {
        restrict: 'A',

        link: function ($scope, element, attr) {
            var daysNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

            $scope.$on('eventsUpdated', function() {
                for (var i=0; i < $scope.wCtrl.eventObj.length; i++) {
                    var currEvt = $scope.wCtrl.eventObj[i];
                    var evtStart = new Date(currEvt.start);
                    var evtHour = evtStart.getHours();
                    var evtDay = evtStart.getDay();
                    if (evtDay === 0) {evtDay = 7;}
                    //get hour cell with event start
                    var evtCell = angular.element(element[0].querySelectorAll('[ng-class="'+ evtHour +'"].'+ daysNames[evtDay-1]));

                    var eventDiv = angular.element('<div class="event-cell-week" ng-click=wCtrl.showEvent('+ i +')></div>'); //ng-click=wCtrl.showEvent("events")
                    eventDiv.text(currEvt.title);

                    
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
            });
    
        }
    };
}