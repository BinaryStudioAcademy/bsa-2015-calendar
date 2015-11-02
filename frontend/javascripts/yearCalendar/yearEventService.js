var app = require('../app');

app.factory('yearEventService', yearEventService);

yearEventService.$inject = ['$resource', '$q', '$timeout'];

function yearEventService($resource, $timeout, $q) {


	var resourceEvent = $resource('/api/event/');
	var resourceRooms= $resource('/api/room/');
	var resourceDevices = $resource('/api/device/');
	var resourceUsers = $resource('/api/user/');
	var resourceEventTypes = $resource('/api/eventType');
	var resourcePlan = $resource('/api/plan/');



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

	function savePlan(plan){
		return resourcePlan.save(plan);
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
		savePlan: savePlan,
	};
}