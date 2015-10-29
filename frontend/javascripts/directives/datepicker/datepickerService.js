
angular
    .module('calendar-app')
    .factory('datepickerService', datepickerService);

function datepickerService () {

    var monthNames = [ "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December" ];

    return {
        incrementCalendarMonth: function(calendar) {
            if (calendar.month === 11) {
                calendar.month = 0;
                calendar.year++;
            } else {
                calendar.month++;
            }
        },
        decrementCalendarMonth: function(calendar) {
            if (calendar.month === 0) {
                calendar.month = 11;
                calendar.year--;
            } else {
                calendar.month--;
            }
        },
        getCalendarDays: function (year, month) {
            var monthStartDate = new Date(year, month, 1);
            var days = [];
            for (var idx = 0; idx < monthStartDate.getDay(); idx++) {
                days.push('');
            }
            for (var idy = 1; idy <= new Date(year, month + 1, 0).getDate(); idy++) {
                days.push(idy);
            }
            return days;
        },

        getMonthName: function(monthNumber) {
            return monthNames[monthNumber];
        }
    };
}