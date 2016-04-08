var app = require('../app');

app.directive('eventCalendarDirective', eventCalendarDirective);


function eventCalendarDirective($rootScope, filterService) {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {


            $scope.correctFlagsEventTypes = filterService.getActualEventTypes(); 
            $scope.dataObjOll = [];

            console.log('actual in year', $scope.correctFlagsEventTypes);


            $rootScope.$on('filterTypesChanged', function (event, actualEventTypes) {           
                $scope.correctFlagsEventTypes = actualEventTypes;
                // console.log('year $rootScope.$on checkEventTypes', vm.correctFlagsEventTypes);
                // console.log('year vm.dataObjOll from $rootScope.$on checkEventTypes', vm.dataObjOll);                
                $scope.dataObj = $scope.dataObjOll;
                //console.log('EventTypes', $scope.dataObj);
                $scope.maximumLength = 0;
                for (var day in $scope.dataObj) {
                    if ($scope.dataObj[day].length > $scope.maximumLength) { //maximum events number in day
                        $scope.maximumLength = $scope.dataObj[day].length;
                    }
                } 
                // console.log('from $scope.$on eventsUpdated', $scope.dataObj);
                for (var item in $scope.dataObj) {
                    delEvents(item);
                    addEvents(item);
                }
            });            
 




            $scope.$on('eventsUpdated', function(event, dataObj) {
                $scope.dataObj = dataObj;
                $scope.dataObjOll = $scope.dataObj;

                $scope.maximumLength = 0;
                for (var day in $scope.dataObj) {
                    if ($scope.dataObj[day].length > $scope.maximumLength) { //maximum events number in day
                        $scope.maximumLength = $scope.dataObj[day].length;
                    }
                } 
                // console.log('from $scope.$on eventsUpdated', $scope.dataObj);
                for (var item in $scope.dataObj) {
                    delEvents(item);
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
                console.log('broadcast added');
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

            $scope.$on('editedEventYearView', function(event, selectedDate, oldEventBody, newEventBody){
        
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
                // console.log('privet iz function addEvents1', vm.correctFlagsEventTypes);  
                // console.log('privet iz function addEvents2', $scope.dataObj[day]);    
                if ($scope.dataObj[day].length > 0) {
                    for (var j = 0; j < $scope.correctFlagsEventTypes.length; j++) {
                        // console.log('from year !!!!!!!!!!!!!!!', $scope.dataObj[day]);         
                        for (var k = 0; k <  $scope.dataObj[day].length; k++) {  
                            // console.log('from year 2 !!!!!!!!!!!!!!!', $scope.dataObj[day]); 

                            if ( $scope.dataObj[day][k].type._id == $scope.correctFlagsEventTypes[j].id) {


                                // var evtCell = angular.element($('[ng-class="'+ evtHour +'"].'+ vm.daysNames[evtDay]));
                                // var eventDiv = angular.element('<div class="event-cell-week"></div>'); 
                                // eventDiv.text(currEvt.title);
                                // var tmpl = '<div>'+currEvt.description+'</div><div>Start at: '+moment(currEvt.start).format('hh:mm')+'</div><div>End at: '+moment(currEvt.end).format('hh:mm')+'</div>';
                                // $templateCache.put('evtTmpl'+i+'.html', tmpl);
                                // eventDiv.attr('uib-popover-template', '"evtTmpl'+i+'.html"');
                                // eventDiv.attr('popover-title', currEvt.title);
                                // eventDiv.attr('popover-append-to-body', "true");
                                // eventDiv.attr('trigger', 'focus');
                                // eventDiv.attr('index', i);
                                // eventDiv.attr('date', evtStart);
                                // eventDiv.on( 'dblclick', function(event){
                                //     var date = new Date($(event.currentTarget).attr('date'));
                                //     vm.editEvent(date, vm.eventObj[$(event.currentTarget).attr('index')]); 
                                //     event.stopPropagation();
                                // });
                                // $compile(eventDiv)($scope);
                                // evtCell.append(eventDiv);


                                var dayCell = $('#'+day);
                                // //create popover template with events titles
                                // var tmpl = '<ul class="list-group">';
                                // //var tmpl = document.createElement('ul');
                                // for (var i=0; i<$scope.dataObj[day].length; i++) {
                                //     // console.log('from function addEvents  for', $scope.dataObj[day][i]);     
                                //     // var icon = document.createElement('div');
                                //     // if($scope.dataObj[day][i].type.icon){
                                //     //     icon.className = $scope.dataObj[day][i].type.icon.css;
                                //     //     icon.style.width = '10%';
                                //     //     icon.style.float = 'left';
                                //     //     dayCell.append(icon);
                                //     // }                        
                                //     tmpl += '<li ' + ' style="background-color:' + $scope.dataObj[day][i].type.color +'" class="list-group-item">'+$scope.dataObj[day][i].title + '</li>';
                                // }
                                // //console.log(tmpl);
                                // tmpl +='</ul>';

                                // //update template if popover exists
                                // if(dayCell.data('bs.popover')) {
                                //     dayCell.data('bs.popover').options.content = tmpl;
                                // } else {
                                // //add popover
                                //     dayCell.popover({
                                //         trigger: 'hover',
                                //         delay: 500,
                                //         container: 'body',
                                //         placement: 'top',
                                //         title: 'Events:',
                                //         html: true,
                                //         content: tmpl
                                //     });
                                // }



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
                }
           }

            function delEvents(day) {
                var dayCell = $('#'+day);
                if(dayCell.data('bs.popover')) {
                   $('#'+day + ' .popover').remove();
                    dayCell.css('background-color', '');
                }
            }
        }
    };
}
