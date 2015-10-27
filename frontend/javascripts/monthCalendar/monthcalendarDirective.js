/**
 * Created by Vitalii Kalchuk on 16.10.2015.
 */
var app = require('../app'),
    moment = require('moment');
    //monthCalendarService = require('./monthCalendarService');

app.directive("calendar", function ($http) {
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
        }
    };
    function _removeTime(date) {
        return date.day(0).hour(0).minute(0).second(0).millisecond(0);
    }

    function _buildMonth(scope, start, month) {
        console.log(start);
        scope.weeks = [];
        var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
        while (!done) {
            scope.weeks.push({days: _buildWeek(date.clone(), month)});
            date.add(1, "w");
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
        }
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
        // var dateStart = new Date(year, 0, 1);
        // var dateEnd = new Date(year, 11, 32);
        var eventObj = {};
        // while (dateStart < dateEnd) {
        //     var day = dateStart.getDate()+'_'+(dateStart.getMonth()+1)+'_'+year;
        //     eventObj[day] = [];
        //     dateStart.setDate(dateStart.getDate() + 1);
        // }

        //GET WEEK EVENTS
        var evtPromise = $http.get('/api/eventByInterval/' + gteDate + '/' + lteDate)       
        .then(function (response) {
            var events = response.data;
            console.log(events);
            for (var i = 0; i < events.length; i++) {
                var eventStartDate = new Date(events[i].start);
                var evDate = eventStartDate.getDate()+'_'+(eventStartDate.getMonth()+1)+'_'+eventStartDate.getFullYear();
                console.log(evDate);
                eventObj[evDate] = eventObj[evDate] || [] ;
                eventObj[evDate].push(events[i]);
            }
            console.log(eventObj);
            return eventObj;

        }, function(reason) {
            console.log(reason);    
        });       
        return evtPromise;
    }

    function _buildWeek(date, month) {
        var days = [];
        var events = [];
        var evtPromise =  getEventsObj(date.format("DD MMM YYYY HH:mm:ss"),moment(date).add(7, 'days').format("DD MMM YYYY HH:mm:ss"));
            evtPromise.then(function(dataObj) {
                events = dataObj;
            }, function(error) {
                console.log(error);
            });

        console.log(events);
        //console.log(date);
        //console.log(date.format("DD MMM YYYY HH:mm:ss"));

        //console.log(date.format("DD_MM_YYYY"));

        //console.log(date.format("DD MMM YYYY"));
        //console.log(moment(date).add(7, 'days').format("DD MMM YYYY HH:mm:ss"));
        //getEventsObj(date.format("DD MMM YYYY HH:mm:ss"),moment(date).add(7, 'days').format("DD MMM YYYY HH:mm:ss"));

        for (var i = 0; i < 7; i++) {
            days.push({
                name: date.format("dd").substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(new Date(), "day"),
                date: date,
                events: []
            });

            

            //console.log(days[i].date.format("DD_MM_YYYY"));

            // eventObj[days[i].date.format("DD_MM_YYYY")].forEach( function(event){
            //     console.log(event.title, event.start);
            //     days[i].events.push({name:event.title, date: moment(event.start)});
            // });

            //days[i].events = getDateEvents(eventsObj,days[i].date.format("DD_MM_YYYY"));

            if (days[i].isToday) {
                var currentDate = date.clone(),
                    birthdayHours = currentDate.hours(9);

                days[i].events = [{name: 'BirthdayBirthdayBirthday BirthdayBirthday Birthday', date: birthdayHours},
                    {name: 'Meeting', date: days[i].date.clone().hours(10)},
                    {name: 'Call', date: days[i].date},
                    {name: 'Meeting2', date: days[i].date}];

                days[i - 1].events = [{name: 'Breakfast', date: days[i - 1].date},
                    {name: 'Lunch', date: days[i - 1].date},
                    {name: 'Dinner', date: days[i - 1].date},
                    {name: 'Sleep', date: days[i - 1].date},
                    {name: 'Dreams', date: days[i - 1].date}];
            }
            date = date.clone();
            date.add(1, "d");
        }
        return days;
    }
});