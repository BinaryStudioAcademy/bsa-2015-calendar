var app = require('../app');

app.factory('WeekCalendarService', WeekCalendarService);

WeekCalendarService.$inject = ['$resource'];

function WeekCalendarService($resource) {

	var timeSatmps = '12am|1am|2am|3am|4am|5am|6am|7am|8am|9am|10am|11am|12pm|1pm|2pm|3pm|4pm|5pm|6pm|7pm|8pm|9pm|10pm|11pm'.split('|');

	var days = [	{ name: 'Monday'}, 
		           	{ name: 'Tuesday'}, 
		           	{ name: 'Wednesday'},
								{ name: 'Thursday'}, 
		            { name: 'Friday'}, 
		            { name: 'Saturday'},
		            { name: 'Sunday'},
		          ];

	function getTimeStamps(){
		return timeSatmps;
	}


	function getDays(){
		return days;
	}

	return {
		getTimeStamps: getTimeStamps,
		getDays: getDays
	};	
}


