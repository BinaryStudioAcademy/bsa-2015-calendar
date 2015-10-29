var app = require('../app');

app.directive('eventCalendarDirective', eventCalendarDirective);

function eventCalendarDirective($compile, $templateCache) {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {

            $scope.$watch('YCtrl.events', function(eventObj) {
                for (var day in eventObj) {
                    if (eventObj[day].length > 0) {
                        var dayCell = angular.element(document.getElementById(day));

                        //create popover template with events titles
                        var tmpl = '<ul>';
                        for (var i=0; i<eventObj[day].length; i++) {
                            tmpl += '<li>'+eventObj[day][i].title + '</li>';
                        }
                        tmpl +='</ul>';
                        //var tmp = '<ul><li ng-repeat="evt in eventObj[day]">{{evt.title}}</li></ul>';

                        $templateCache.put(day+'.html', tmpl);

                        //add popover
                        dayCell.attr('uib-popover-template', '"'+day+'.html"');
                        dayCell.attr('popover-title', "Events");
                        dayCell.attr('popover-append-to-body', "true");
                        dayCell.attr('trigger', 'click');

                        //add eventbar
                        var eventBar = angular.element('<div></div>');
                        var evtNum = eventObj[day].length;
                        switch(true) {
                            case (evtNum < 2):
                                eventBar.addClass('event-low');
                                break;
                            case (evtNum > 1 && evtNum < 3):
                                eventBar.addClass('event-medium');
                                break;
                            case (evtNum > 2):
                                eventBar.addClass('event-high');
                                break;
                        }
                        dayCell.append(eventBar);

                        $compile(dayCell)($scope);

                    }
                }
                
            }, true);
            
        }
    };
}

