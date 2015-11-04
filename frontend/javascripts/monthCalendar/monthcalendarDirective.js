var app = require('../app'),
    moment = require('moment');

app.directive("calendar", function ($http,$rootScope) {
    return {
        restrict: "E",
        templateUrl: "templates/monthCalendar/monthCalendarDirectiveTemplate.html",
        scope: {
            selected: "="
        },
        link: function (scope) {
            scope.selected = _removeTime(scope.selected || moment());
            scope.month = scope.selected.clone();
            var start = scope.selected.clone();
            start.date(1);
            _removeTime(start.day(0));
            _buildMonth(scope, start, scope.month);
            scope.select = function (day) {
                scope.selected = day.date;
            };
            scope.next = function () {
                var next = scope.month.clone();
                _removeTime(next.month(next.month() + 1).date(1));
                scope.month.month(scope.month.month() + 1);
                _buildMonth(scope, next, scope.month);
            };
            scope.previous = function () {
                var previous = scope.month.clone();
                _removeTime(previous.month(previous.month() - 1).date(1));
                scope.month.month(scope.month.month() - 1);
                _buildMonth(scope, previous, scope.month);
            };
        },
        controller: function ($scope){
            $scope.$on('eventAdded', function(event, eventfromsend){
                var newEventDate = new moment(eventfromsend.start);
                evDate = newEventDate.format("D_M_YYYY");

                //console.log($scope.start);
                //console.log($scope.end);

                var daysDiff = newEventDate.diff($scope.start,'days');
                //console.log(daysDiff);
                var weekindex = Math.floor(daysDiff / 7);
                var dayindex = daysDiff % 7;

                $scope.weeks[weekindex].days[dayindex].events.push({name:eventfromsend.title, date: moment(eventfromsend.start)});

            });
        }
    };
    function _removeTime(date) {
        return date.day(1).hour(0).minute(0).second(0).millisecond(0);
    }

    function _buildMonth(scope, start, month) {
        
        scope.weeks = [];
        scope.events = [];
        var end = start.clone().add(1, 'month').endOf('month');
        // console.log(start);
        // console.log(end);
        // console.log(month);
        scope.start = start;
        scope.end = end;

        var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
        var evtPromise =  getEventsObj(start.format("DD MMM YYYY HH:mm:ss"),end.format("DD MMM YYYY HH:mm:ss"));
            evtPromise.then(function(dataObj) {
                scope.events = dataObj;
                //console.log(scope.events);
                while (!done) {
                    scope.weeks.push({days: _buildWeek(scope, date.clone(), month)});
                    date.add(1, "w");
                    done = count++ > 2 && monthIndex !== date.month();
                    monthIndex = date.month();
                }
            }, function(error) {
                console.log(error);
            });
    }

    function getDateEvents(eventsObj, dateString) {
        var events = [];

        eventsObj[dateString].forEach( function(event){
                console.log(event.title, event.start);
                events.push({name:event.title, date: moment(event.start)});
            });

        return events;
    }

    function getEventsObj(gteDate,lteDate) {
        var eventObj = {};

        //GET WEEK EVENTS
        console.log(gteDate,lteDate);
        var evtPromise = $http.get('/api/eventByInterval/' + gteDate + '/' + lteDate)       
        .then(function (response) {
            var events = response.data;
            //console.log(events);
            for (var i = 0; i < events.length; i++) {
                var eventStartDate = new Date(events[i].start);
                var evDate = eventStartDate.getDate()+'_'+(eventStartDate.getMonth()+1)+'_'+eventStartDate.getFullYear();
                //console.log(evDate);
                eventObj[evDate] = eventObj[evDate] || [] ;
                eventObj[evDate].push(events[i]);
            }
            //console.log(eventObj);
            return eventObj;

        }, function(reason) {
            console.log(reason);    
        });       
        return evtPromise;
    }

    function _buildWeek(scope, date, month) {
        var days = [];
        var evDate;
        for (var i = 0; i < 7; i++) {
            days.push({
                //name: date.format("dd").substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(new Date(), "day"),
                date: date,
                events: []
            });

            if (scope.events !== undefined){
                evDate = days[i].date.format("D_M_YYYY");
                if(scope.events[evDate]){
                    scope.events[evDate].forEach( function(event){
                        days[i].events.push({name:event.title, date: moment(event.start)});
                        //console.log(days[i]);
                    });
                }
            }
            date = date.clone();
            date.add(1, "d");
        }
        return days;
    }
});
