var app = require('../app');

app.directive('calendarDirective', calendarDirective);

function calendarDirective($compile) {
    return {
        restrict: 'A',

        link: function ($scope, element, attr) {

            $scope.$watch('YCtrl.calendar', function(value) { //add binding to calendar object
                var calendarObj = value;
                var monthArr = calendarObj.months[+attr.monthNum];
                //Add table header
                var tableMonth = angular.element('<table class="year-month-table">'+
                                '<tr><td>Mon</td><td>Tue</td><td>Wed</td><td>Thu</td><td>Fri</td>' +
                                '<td class="dayoff">Sat</td><td class="dayoff">Sun</td></tr></table>');

                var firstDay = monthArr[0].weekDay;
                if (firstDay === 0) { //convert Sunday code to 7 for start day
                    firstDay = 7;
                }

                var tableRow = angular.element('<tr></tr>');
                for (var i=0; i < firstDay-1; i++) { //add empty cells at month start
                    tableRow.append(angular.element('<td></td>'));
                }

                var monthLenght = monthArr.length;
                for (var y=0; y < monthLenght; y++) { //add day to table with day off checking
                    var dayId = monthArr[y].dayDate+'_'+(+attr.monthNum +1)+'_'+calendarObj.year; //id as DD-MM-YYYY, but without leading 0
                    var dayCell = angular.element('<td></td>');
                    dayCell.html(monthArr[y].dayDate);
                    dayCell.attr('id', dayId);
                    dayCell.attr('event-calendar-directive', 'dayId');
                    //$compile(dayCell)($scope);

                    //add class for day off
                    if (monthArr[y].dayOff) { 
                        dayCell.addClass('dayoff');
                    }
                    //add class for past, present and future days
                    switch(monthArr[y].timePeriod) {
                        case 1:
                            dayCell.addClass('day-now');
                            break;
                        case 0:
                            dayCell.addClass('day-past');
                            break;
                        case 2:
                            dayCell.addClass('day-future');
                            break;
                    }

                    tableRow.append(dayCell);
                    dayCell = null;

                    //append row to table on sunday
                    if (monthArr[y].weekDay === 0) {
                        tableMonth.append(tableRow);
                        tableRow = angular.element('<tr></tr>');  
                    }

                }
                //add last row if it not complete
                if (tableRow.find('td').length !== 0) {
                    tableMonth.append(tableRow);
                }

                //Make month tables equal height
                var weekNum = tableMonth.find('tr').length - 1;
                var emptyRow = angular.element('<tr><td height="20"></td></tr>');
                var doubleRow = angular.element('<tr><td height="20"></td></tr><tr><td height="20"></td></tr>');
                switch(weekNum) {
                    case 4:
                        tableMonth.append(doubleRow);
                        break;
                    case 5:
                        tableMonth.append(emptyRow);
                        break;
                    case 6:
                       break; 
                }
                //insert element in directive container

                element.empty();
                element.append(tableMonth);
            }, true);
        }
    };
}