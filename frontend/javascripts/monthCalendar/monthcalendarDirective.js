/**
 * Created by Vitalii Kalchuk on 16.10.2015.
 */
var app = require('../app'),
    moment = require('moment');

app.directive("calendar", function() {
    return {
        restrict: "E",
        templateUrl: "templates/monthCalendar/monthCalendarDirectiveTemplate.html",
        scope: {
            selected: "="
        },
        link: function(scope) {
            scope.selected = _removeTime(scope.selected || moment());
            scope.month = scope.selected.clone();
            var start = scope.selected.clone();
            start.date(1);
            _removeTime(start.day(0));
            _buildMonth(scope, start, scope.month);
            scope.select = function(day) {
                scope.selected = day.date;
            };
            scope.next = function() {
                var next = scope.month.clone();
                _removeTime(next.month(next.month()+1).date(1));
                scope.month.month(scope.month.month()+1);
                _buildMonth(scope, next, scope.month);
            };
            scope.previous = function() {
                var previous = scope.month.clone();
                _removeTime(previous.month(previous.month()-1).date(1));
                scope.month.month(scope.month.month()-1);
                _buildMonth(scope, previous, scope.month);
            };
        }
    };
    function _removeTime(date) {
        return date.day(0).hour(0).minute(0).second(0).millisecond(0);
    }
    function _buildMonth(scope, start, month) {
        scope.weeks = [];
        var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
        while (!done) {
            scope.weeks.push({ days: _buildWeek(date.clone(), month) });
            date.add(1, "w");
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
        }
    }
    function _buildWeek(date, month) {
        var days = [];
        for (var i = 0; i < 7; i++) {
            days.push({
                name: date.format("dd").substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(new Date(), "day"),
                date: date
            });
            if (days[i].isToday) {
                days[i].events = [{name: 'BirthdayBirthdayBirthdayBirthdayBirthdayBirthday', date: days[i].date},
                    {name: 'Meeting', date: days[i].date},
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