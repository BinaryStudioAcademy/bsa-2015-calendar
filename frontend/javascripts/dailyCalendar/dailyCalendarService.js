var app = require('../app');

app.factory('DailyCalendarService', DailyCalendarService);

DailyCalendarService.$inject = ['$resource', '$timeout', '$q', '$http'];

function DailyCalendarService($resource, $timeout, $q, $http) {

	var timeStamps = '12am|1am|2am|3am|4am|5am|6am|7am|8am|9am|10am|11am|12pm|1pm|2pm|3pm|4pm|5pm|6pm|7pm|8pm|9pm|10pm|11pm'.split('|');

	var resourceEvent = $resource('/api/event/');
	var resourceRooms= $resource('/api/room/');
	var resourceDevices = $resource('/api/device/');
	var resourceUsers = $resource('/api/user/');
	var resourceEventTypes = $resource('/api/eventType');



	function getTimeStamps() {

		var timeStampsObj = [];

		var workingHours = [9, 18];

		for(var i=0; i<timeStamps.length; i+=1) {
			var timeObj = {};
			timeObj.value = timeStamps[i];
			if(i >= 9 && i <= 18) {
				timeObj.isWorkingHour = true;
			} else {
				timeObj.isWorkingHour = false;
			}
			timeObj.index = i;
			timeStampsObj.push(timeObj);
		}

		return timeStampsObj;
	}

	function configureEventData(date, event) {

		var selDay = date.getDate();

		event.start.setDate(selDay);
		event.end.setDate(selDay);
	}

	function getTodaysEvents() {
		var today = new Date();
		today.setHours(0,0,0,0);
		var tommorow = new Date(today.getTime() + 86400000);
		return $resource('/api/eventByInterval/:gteDate/:lteDate').query({gteDate: today, lteDate: tommorow}).$promise.then(function(data){ 
				return data; 
			},
			function(err){
				return $q.reject(err);
			});
	}

	function saveEvent(event) {
		return resourceEvent.save(event);
	}

	function getAllEvents() {
		return resourceEvent.query();
	}

	function getAllRooms() {
		return resourceRooms.query();
	}

	function getAllDevices() {
		return resourceDevices.query();
	}

	function getAllUsers() {
		return resourceUsers.query();
	}

	function getAllEventTypes() {
		return resourceEventTypes.query();
	}

	function updateEvent(id, body) {
		$http({
			method: 'PUT',
			url: '/api/event/newdate/' + id,
			data: body
		}).then(function success(resp){
			console.log('success');
		},
		function error(err){
			console.log(err);
		});
	}

	return {
		getTimeStamps: getTimeStamps,
		saveEvent: saveEvent,
		configureEventData: configureEventData,
		getAllRooms: getAllRooms,
		getAllDevices: getAllDevices,
		getAllUsers: getAllUsers,
		getAllEvents: getAllEvents,
		getAllEventTypes: getAllEventTypes,
		getTodaysEvents: getTodaysEvents,
		updateEvent: updateEvent,
	};
}