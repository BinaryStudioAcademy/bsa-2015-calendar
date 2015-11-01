var app = require('../app');

app.directive('eventCalendarDirective', eventCalendarDirective);

function eventCalendarDirective() {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {
            
            $scope.$on('eventsUpdated', function(event, dataObj) { 
                var monthEvt = dataObj[+attr.monthNum];
                for (var day in dataObj) {
                    if (dataObj[day].length > 0) {
                        var dayCell = $('#'+day);

                        //create popover template with events titles
                        var tmpl = '<ol>';
                        for (var i=0; i<dataObj[day].length; i++) {
                            tmpl += '<li>'+dataObj[day][i].title + '</li>';
                        }
                        tmpl +='</ol>';

                        //add popover
                        dayCell.popover({
                            trigger: 'hover',
                            delay: 300,
                            container: 'body',
                            placement: 'top',
                            title: 'Events:',
                            html: true,
                            content: tmpl
                        });

                        //add eventbar
                        var eventBar = angular.element('<div></div>');
                        var evtNum = dataObj[day].length;
                        switch(true) {
                            case (evtNum < 3):
                                eventBar.addClass('event-low');
                                break;
                            case (evtNum > 2 && evtNum < 5):
                                eventBar.addClass('event-medium');
                                break;
                            case (evtNum > 4):
                                eventBar.addClass('event-high');
                                break;
                        }
                        dayCell.append(eventBar);
                    }
                }      
            });

        }
    };
}