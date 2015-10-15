var app = require('../app');

app.factory('calendarService', calendarService);

function calendarService() {

    function getYearArr(year) {
        var yearArr = [];
        for (var i = 0; i <12; i++) {
            var monthArr = [];
            var dateMonth = new Date(year, i, 1); //Start month date
            while (dateMonth.getMonth() == i) {
                if (dateMonth.getDay() === 6 || dateMonth.getDay() === 0) {  //Check for saturday or sunday dayoff
                    monthArr.push({dayDate: dateMonth.getDate(), dayOff: true, events: 0, weekDay: dateMonth.getDay()});
                } else {
                    monthArr.push({dayDate: dateMonth.getDate(), dayOff: false, events: 0, weekDay: dateMonth.getDay()});
                }
                dateMonth.setDate(dateMonth.getDate() + 1); //Day date increment
            }
            yearArr.push(monthArr);      
        }
        return yearArr;  
    }

    return {
        getYearArr: getYearArr
    };
}