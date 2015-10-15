var app = require('../app');

app.directive('calendarDirective', calendarDirective);

function calendarDirective() {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {
            attr.$observe('calendarObj', function(value) { //add binding to calendar object
                var calendarArr = angular.fromJson(value);
                var monthArr = calendarArr[+attr.monthNum];
                //Add table header
                var tableMonth = '<table class="year-month-table">'+
                                '<tr><td>Mon</td><td>Tue</td><td>Wed</td><td>Thu</td><td>Fri</td>' +
                                '<td class="dayoff">Sat</td><td class="dayoff">Sun</td></tr>';

                var firstDay = monthArr[0].weekDay;
                if (firstDay === 0) { //convert Sunday code to 7 for start day
                    firstDay = 7;
                }
                tableMonth +='<tr>';
                for (var i=0; i < firstDay-1; i++) { //add empty cells at month start
                    tableMonth +='<td></td>';
                }
                var weekNum = 1;
                var monthLenght = monthArr.length;
                for (var y=0; y < monthLenght; y++) { //add day to table with day off checking
                    if (!monthArr[y].dayOff) { 
                        tableMonth +='<td>'+monthArr[y].dayDate+'</td>';
                    } else {
                        tableMonth +='<td class="dayoff">'+monthArr[y].dayDate+'</td>';
                    }
                    if (monthArr[y].weekDay === 0 && y == monthLenght-1) {
                        //pass on last sunday in month; 
                    } else if (monthArr[y].weekDay === 0) { //new line in table after sunday
                        tableMonth +='</tr><tr>';
                        weekNum++;                       
                    }
                }
                //Make month tables equal height
                switch(weekNum) {
                    case 6:
                        tableMonth +='</tr></table>';
                        break;
                    case 5:
                        tableMonth +='</tr><tr><td height="20"></td></tr></table>';
                        break;
                    case 4:
                       tableMonth +='</tr><tr><td height="20"></td></tr></tr><tr><td height="20"></td></tr></table>';
                       break; 
                }
                element.html(tableMonth);
            });
        }
    };
}