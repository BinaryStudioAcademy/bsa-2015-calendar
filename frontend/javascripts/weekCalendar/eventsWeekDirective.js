var app = require('../app');
moment = require('moment');
app.directive('eventsWeekDirective', eventsWeekDirective);

function eventsWeekDirective($compile, $templateCache) {
    return {
        restrict: 'A',

        link: function ($scope, element, attr) {
            var daysNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

            $scope.$on('eventsUpdated', function() {
                //console.log($scope.wCtrl.eventObj);
                // if (data){
                //     console.log(data);
                //     $scope.wCtrl.eventObj.push(data);
                // }
                //console.log($scope.wCtrl.eventObj.length);
                //console.log($scope.wCtrl.eventObj);
                for (var i=0; i < $scope.wCtrl.eventObj.length; i++) { 
                    var currEvt = $scope.wCtrl.eventObj[i];
                    var evtStart = new Date(currEvt.start);
                    var evtHour = evtStart.getHours();
                    var evtDay = (evtStart.getDay() || 7) - 1;
                    //console.log(evtHour,evtDay, evtStart);
                    //get hour cell with event start
                    var evtCell = angular.element(element[0].querySelectorAll('[ng-class="'+ evtHour +'"].'+ daysNames[evtDay]));
                    var eventDiv = angular.element('<div class="event-cell-week"></div>'); 
                    eventDiv.text(currEvt.title);
                    var tmpl = '<div>'+currEvt.description+'</div><div>Start at: '+moment(currEvt.start).format('hh:mm')+'</div><div>End at: '+moment(currEvt.end).format('hh:mm')+'</div>';
                    $templateCache.put('evtTmpl'+i+'.html', tmpl);
                    
                    eventDiv.attr('uib-popover-template', '"evtTmpl'+i+'.html"');
                    eventDiv.attr('popover-title', currEvt.title);
                    eventDiv.attr('popover-append-to-body', "true");
                    eventDiv.attr('trigger', 'focus');

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

            
            $scope.$on('eventAdd', function(event, data) {
                //console.log($scope.wCtrl.eventObj);
                var index = $scope.wCtrl.eventObj.length-1;
                $scope.wCtrl.eventObj.push(data);
                var currEvt = data;
                var evtStart = new Date(currEvt.start);
                var evtHour = evtStart.getHours();
                //console.log(evtStart.getDay());
                var evtDay = (evtStart.getDay() || 7) - 1;
                //get hour cell with event start
                var evtCell = angular.element(element[0].querySelectorAll('[ng-class="'+ evtHour +'"].'+ daysNames[evtDay]));
                var eventDiv = angular.element('<div class="event-cell-week"></div>'); 
                eventDiv.text(currEvt.title);
                var tmpl = '<div>'+currEvt.description+'</div><div>Start at: '+moment(currEvt.start).format('hh:mm')+'</div><div>End at: '+moment(currEvt.end).format('hh:mm')+'</div>';
                $templateCache.put('evtTmpl'+index+'.html', tmpl);
                
                eventDiv.attr('uib-popover-template', '"evtTmpl'+index+'.html"');
                eventDiv.attr('popover-title', currEvt.title);
                eventDiv.attr('popover-append-to-body', "true");
                eventDiv.attr('trigger', 'focus');

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
            });
    
        }
    };
}