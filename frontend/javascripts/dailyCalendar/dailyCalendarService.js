var app = require('../app');

app.factory('DailyCalendarService', DailyCalendarService);

DailyCalendarService.$inject = ['$resource', '$filter'];

function DailyCalendarService($resource, $filter) {

	var timeSatmps = '12am|1am|2am|3am|4am|5am|6am|7am|8am|9am|10am|11am|12pm|1pm|2pm|3pm|4pm|5pm|6pm|7pm|8pm|9pm|10pm|11pm'.split('|');

	function getTimeStamps(){
		return timeSatmps;
	}

	function getTodaysEvents(date){
		var reqDate = $filter('date')(date);
		return $resource('/api/eventByDateStart/:date').query({start: reqDate});
	}

	return {
		getTimeStamps: getTimeStamps,
		getTodaysEvents: getTodaysEvents
	};
	
}