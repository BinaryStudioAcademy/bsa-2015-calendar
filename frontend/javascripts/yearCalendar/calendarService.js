var app = require('../app');

app.factory('calendarService', calendarService);

function calendarService(helpEventService) {

    var redDays = [{day:1, month:1}, {day:7, month:1}, {day:8, month:3}, {day:1, month:5}, {day:9, month:5}, {day:28, month:6}, {day:24, month:8}, {day:14, month:10}];

    function setRedDay(date) {
        //convert date
        redDays.push(date);
    }

    function deleteRedDay(date) {
        //convert date
        var day;
        var month;
        for (var i=0; i<redDays.length; i++) {
            if (redDays[i].day == day && redDays[i].month == month) {
                redDays.splice(i,1);
                break;
            }
        }
    }


    function getYearObj(year) {
        var yearObj = {};
        yearObj.year = year;
        var nowDate = new Date();
        nowDate.setHours(0,0,0,0);
        var monthsYear = []; 
        for (var i = 0; i <12; i++) {
            var monthArr = [];
            var dateMonth = new Date(year, i, 1); //Start month date
            var dayObj = {};
            while (dateMonth.getMonth() == i) {
                dayObj.dayDate = dateMonth.getDate(); //add date
                dayObj.weekDay = dateMonth.getDay(); //add number of week day
                dayObj.dayId = dateMonth.getDate()+'_'+(i+1)+'_'+year; //id as D-M-YYYY,
                //dayObj.events = [];
                if (dateMonth.getDay() === 6 || dateMonth.getDay() === 0) {  //Check for dayoff and add it
                    dayObj.dayOff = true;
                } else {
                    dayObj.dayOff = false;
                }

                if (dateMonth <= nowDate && dateMonth >= nowDate) {
                    dayObj.timePeriod = 1;      //now
                } else if (dateMonth > nowDate) {
                    dayObj.timePeriod = 2;      //future
                } else if (dateMonth < nowDate) {
                    dayObj.timePeriod = 0;      //past
                }

                monthArr.push(dayObj);
                dateMonth.setDate(dateMonth.getDate() + 1); //Day date increment
                dayObj = {}; //clear day object
            } 
        monthsYear.push(monthArr);    
        }
        //add holidays
        for (var y=0; y<redDays.length; y++) {
            monthsYear[redDays[y].month-1][redDays[y].day-1].dayOff = true;
        }

        yearObj.months = monthsYear; 
        return yearObj;  
    }

    function getEventsObj(year) {
        var dateStart = new Date(year, 0, 1);
        var startMs = +dateStart;
        var dateEnd = new Date(year, 11, 32);
        var eventObj = {};
        
        while (dateStart < dateEnd) {
            var day = dateStart.getDate()+'_'+(dateStart.getMonth()+1)+'_'+year;
            eventObj[day] = [];
            dateStart.setDate(dateStart.getDate() + 1);
        }

        //get promise with events of year
        var evtPromise = helpEventService.getEvents(startMs, dateEnd).then(function (events) {
            for (var i = 0; i < events.length; i++) {
                var eventStartDate = new Date(events[i].start);
                var evDate = eventStartDate.getDate()+'_'+(eventStartDate.getMonth()+1)+'_'+eventStartDate.getFullYear();
                eventObj[evDate].push(events[i]);
            }
            return eventObj;

        }, function(reason) {
            console.log(reason);    
        });       
        return evtPromise;
    }

    return {
        getYearObj: getYearObj,
        getEventsObj: getEventsObj
    };
}