var app = require('../app');

app.factory('WeekCalendarService', WeekCalendarService);

WeekCalendarService.$inject = ['$resource'];

function WeekCalendarService($resource) {

	var timeSatmps = [	{ time: '12am-7am'},
					            { time: '8am'},
					            { time: '9am'},
					            { time: '10am'},
					            { time: '11am'},
					            { time: '12pm'},
					            { time: '1pm'},
					            { time: '2pm'},
					            { time: '3pm'},
 					            { time: '4pm'},
 					            { time: '5pm'},
					            { time: '6pm'},
					            { time: '7pm'},
					            { time: '8pm'},
					            { time: '9pm-11pm'},
						          ];

	// var timeSatmps = [	{ time: '12am'}, 
	// 				           	{ time: '1am'}, 
	// 				           	{ time: '2am'},
	// 										{ time: '3am'}, 
	// 				            { time: '4am'}, 
	// 				            { time: '5am'},
	// 				            { time: '6am'},
	// 				            { time: '7am'},
	// 				            { time: '8am'},
	// 				            { time: '9am'},
	// 				            { time: '10am'},
	// 				            { time: '11am'},
	// 				            { time: '12pm'},
	// 				            { time: '1pm'},
	// 				            { time: '2pm'},
	// 				            { time: '3pm'},
 // 					            { time: '4pm'},
 // 					            { time: '5pm'},
	// 				            { time: '6pm'},
	// 				            { time: '7pm'},
	// 				            { time: '8pm'},
	// 				            { time: '9pm'},
	// 				            { time: '10pm'},
	// 				            { time: '11pm'},
	// 					          ];

	var days = [	{ name: 'Mon'}, 
		           	{ name: 'Tue'}, 
		           	{ name: 'Wed'},
								{ name: 'Thu'}, 
		            { name: 'Fri'}, 
		            { name: 'Sat'},
		            { name: 'Sun'},
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