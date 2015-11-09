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

            $scope.$on('addedPlanYearView', function(event, selectedDate, eventBody) {
                for (var item=0; item <eventBody.length; item++) {
                    var eventStartDate = new Date(eventBody[item].start);
                    var evDate = eventStartDate.getDate()+'_'+(eventStartDate.getMonth()+1)+'_'+eventStartDate.getFullYear();
                    $scope.dataObj[evDate].push(eventBody[item]);
                    addEvents(evDate);
                } 
            });

            $scope.$on('addedEventYearView', function(event, selectedDate, eventBody) {
                var eventStartDate = new Date(eventBody.start);
                var evDate = eventStartDate.getDate()+'_'+(eventStartDate.getMonth()+1)+'_'+eventStartDate.getFullYear();
                $scope.dataObj[evDate].push(eventBody);
                addEvents(evDate);
            });

            $scope.$on('deletedEventYearView', function(event, selectedDate, eventBody) {
                var eventStartDate = new Date(eventBody.start);
                var evDate = eventStartDate.getDate()+'_'+(eventStartDate.getMonth()+1)+'_'+eventStartDate.getFullYear();
                var indexOfEvent;
                for (var i = 0; i < $scope.dataObj[evDate].length; i++){
                    if ($scope.dataObj[evDate][i] == eventBody) {
                        indexOfEvent = i;
                        break;
                    }
                }
                $scope.dataObj[evDate].splice(indexOfEvent,1);
                addEvents(evDate);
            });

            $scope.$on('editedEventWeekView', function(event, selectedDate, oldEventBody, newEventBody){
        
                var eventStartDate = new Date(oldEventBody.start);
                var evDate = eventStartDate.getDate()+'_'+(eventStartDate.getMonth()+1)+'_'+eventStartDate.getFullYear();
                var indexOfEvent;
                for (var i = 0; i < $scope.dataObj[evDate].length; i++){
                    if ($scope.dataObj[evDate][i]._id == oldEventBody._id) {
                        indexOfEvent = i;
                        break;
                    }
                }

                $scope.dataObj[evDate].splice(indexOfEvent,1);
                
                eventStartDate = new Date(newEventBody.start);
                var newEvDate = eventStartDate.getDate()+'_'+(eventStartDate.getMonth()+1)+'_'+eventStartDate.getFullYear();
                $scope.dataObj[newEvDate].push(newEventBody);
                addEvents(newEvDate);
                
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
                        var addWhite = 160+(64 -$scope.dataObj[day].length*colorStep); //basic gray + (64 shades of gray - events length* shades step length)
                        colorGray = 'rgb('+addWhite+', '+addWhite+', '+addWhite+')';
                        dayCell.css('background-color', colorGray);
                    } else {
                     //if fails use old variant
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
                    }
                }
            }

        }
    };
}