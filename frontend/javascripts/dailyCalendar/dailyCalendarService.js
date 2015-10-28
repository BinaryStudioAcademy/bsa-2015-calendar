var app = require('../app');

app.factory('DailyCalendarService', DailyCalendarService);

DailyCalendarService.$inject = ['$resource', '$q', '$timeout'];

function DailyCalendarService($resource, $timeout, $q) {

	var timeStamps = '12am|1am|2am|3am|4am|5am|6am|7am|8am|9am|10am|11am|12pm|1pm|2pm|3pm|4pm|5pm|6pm|7pm|8pm|9pm|10pm|11pm'.split('|');
	var resAllEvents;
	var resourceEvent = $resource('/api/event/');
	var resourceRooms= $resource('/api/room/');
	var resourceDevices = $resource('/api/device/');
	var resourceUsers = $resource('/api/user/');
	var resourceEventTypes = $resource('/api/eventType');



	function getTimeStamps() {
		return timeStamps;
	}

	function configureEventData(date, event) {

		var selDay = date.getDate();

		event.start.setDate(selDay);
		event.end.setDate(selDay);
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

	return {
		getTimeStamps: getTimeStamps,
		saveEvent: saveEvent,
		configureEventData: configureEventData,
		getAllRooms: getAllRooms,
		getAllDevices: getAllDevices,
		getAllUsers: getAllUsers,
		getAllEvents: getAllEvents,
		getAllEventTypes: getAllEventTypes,
	};
}