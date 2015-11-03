var app = require('../app');

app.directive('eventCalendarDirective', eventCalendarDirective);

function eventCalendarDirective() {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {
            
            $scope.$on('eventsUpdated', function(event, dataObj) {
                $scope.dataObj = dataObj;
                $scope.maximumLength = 0;
                for (var day in $scope.dataObj) {
                    if ($scope.dataObj[day].length > $scope.maximumLength) { //maximum events number in day
                        $scope.maximumLength = $scope.dataObj[day].length;
                    }
                } 

                for (var item in $scope.dataObj) {
                    addEvents(item);
                }     
            });    

            $scope.$on('planAdded', function(event, data) {
                var eventStartDate = new Date(data.start);
                var evDate = eventStartDate.getDate()+'_'+(eventStartDate.getMonth()+1)+'_'+eventStartDate.getFullYear();
                $scope.dataObj[evDate].push(data);
                addEvents(evDate);
            });

            $scope.$on('eventAdded', function(event, data) {
                var eventStartDate = new Date(data.start);
                var evDate = eventStartDate.getDate()+'_'+(eventStartDate.getMonth()+1)+'_'+eventStartDate.getFullYear();
                $scope.dataObj[evDate].push(data);
                addEvents(evDate);
            });

            function addEvents(day) {
                if ($scope.dataObj[day].length > 0) {
                    var dayCell = $('#'+day);
                    //create popover template with events titles
                    var tmpl = '<ul class="list-group">';
                    for (var i=0; i<$scope.dataObj[day].length; i++) {
                        tmpl += '<li class="list-group-item">'+$scope.dataObj[day][i].title + '</li>';
                    }
                    tmpl +='</ul>';

                    //update template if popover exists
                    if(dayCell.data('bs.popover')) {
                        dayCell.data('bs.popover').options.content = tmpl;
                    } else {
                    //add popover
                        dayCell.popover({
                            trigger: 'hover',
                            delay: 500,
                            container: 'body',
                            placement: 'top',
                            title: 'Events:',
                            html: true,
                            content: tmpl
                        });
                    }

                    //add color background for events
                    var evtNum = $scope.dataObj[day].length;
                    var colorGray;
                    if ($scope.maximumLength !== 0) {
                        var colorStep = Math.round(64/$scope.maximumLength);
                        var addWhite = 160+(64 -$scope.dataObj[day].length*colorStep); //basic gray + (grey range - length*step)
                        colorGray = 'rgb('+addWhite+', '+addWhite+', '+addWhite+')';
                    }
                    dayCell.css('background-color', colorGray);

                    /*variant 3 step color
                    switch(true) {
                        case (evtNum < 3):
                            dayCell.css('background-color', 'rgb(224, 224, 224)');
                            break;
                        case (evtNum > 2 && evtNum < 5):
                            dayCell.css('background-color', 'rgb(192, 192, 192)');
                            break;
                        case (evtNum > 4):
                            dayCell.css('background-color', 'rgb(160, 160, 160)');
                            break;
                    }
                    */
                }
            }

        }
    };
}