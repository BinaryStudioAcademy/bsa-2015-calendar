/*
 * Created by tomatoua on 26.10.2015.
 */
var app = require('../app');

app.factory('monthCalendarService', monthCalendarService);

monthCalendarService.$inject = ['$http'];

function monthCalendarService($http) {

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
            for (var i = 0; i < events.length; i++) {
                var eventStartDate = new Date(events[i].start);
                var evDate = eventStartDate.getDate()+'_'+(eventStartDate.getMonth()+1)+'_'+eventStartDate.getFullYear();
                console.log(evDate);
                eventObj[evDate].push(events[i]);
            }
            console.log(eventObj);
            return eventObj;

        }, function(reason) {
            console.log(reason);    
        });       
        return evtPromise;
    }

	

    return {
        getEventsObj: getEventsObj
    };

}

