var app = require('../app');

app.directive('eventCalendarDirective', eventCalendarDirective);

function eventCalendarDirective($compile, $templateCache) {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {
            
            $scope.$watch('YCtrl.events', function(value) {
                var eventObj = value;
                for (var day in eventObj) {
                    if (eventObj[day].length > 0) {
                        var dayCell = angular.element(document.getElementById(day));
                        dayCell.addClass('event');

                        //create popover template with events titles
                        var tmpl = '<ul>';
                        for (var i=0; i<eventObj[day].length; i++) {
                            tmpl += '<li>'+eventObj[day][i].title + '</li>';
                        }
                        tmpl +='</ul>';
                        $templateCache.put(day+'.html', tmpl);

                        //add popover
                        dayCell.attr('popover-template', '"'+day+'.html"');
                        dayCell.attr('popover-title', "Events");
                        dayCell.attr('popover-append-to-body', "true");
                        dayCell.attr('trigger', 'click');

                        $compile(dayCell)($scope);

                    }
                }
            }, true);
            
        }
    };
}

