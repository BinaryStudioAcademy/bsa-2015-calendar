var app = require('../app');

app.factory('helpEventService', helpEventService);

helpEventService.$inject = ['Globals', '$resource', '$q', '$timeout', '$http', 'AuthService'];

function helpEventService(Globals, $resource, $timeout, $q, $http, AuthService) {

/*
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
						          */
    var timeStampsDailyAmPm = '12am|1am|2am|3am|4am|5am|6am|7am|8am|9am|10am|11am|12pm|1pm|2pm|3pm|4pm|5pm|6pm|7pm|8pm|9pm|10pm|11pm'.split('|');
    var timeStampsDaily = '00|01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23'.split('|');
	var timeStamps = [	{ time: '12am'}, 
	 				           	{ time: '1am'}, 
	 				           	{ time: '2am'},
	 							{ time: '3am'}, 
	 				            { time: '4am'}, 
	 				            { time: '5am'},
	 				            { time: '6am'},
	 				            { time: '7am'},
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
	 				            { time: '9pm'},
	 				            { time: '10pm'},
	 				            { time: '11pm'},
	 					        ]; 					       

	var days = [
		{ name: 'Mon'}, 
       	{ name: 'Tue'}, 
       	{ name: 'Wed'},
		{ name: 'Thu'}, 
        { name: 'Fri'}, 
        { name: 'Sat'},
        { name: 'Sun'},
	];

	var baseUrl = Globals.baseUrl;

	var daysNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

	function getDaysNames(){
		return daysNames;
	}

	function getTimeStamps(){
		return timeStamps;
	}

	function getTimeStampsDaily() {

		var timeStampsObj = [];

		var workingHours = [9, 18];

		for(var i=0; i<timeStampsDaily.length; i+=1) {
			var timeObj = {};
			timeObj.value = timeStampsDaily[i];
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


	function getDays(){
		return days;
	}


	function saveEvent(event) {
		var saveEventPromise = $http.post(baseUrl + '/api/event/', event)       
		.then(function (response) {
			console.log('adding event status: ', response.status);
			return response;
		}, function(reason) {
			return reason; 		
		});
		return saveEventPromise;
	}


	function updateEvent(eventId, eventBody) {
		var updateEventPromise = $http.put(baseUrl + '/api/event/' + eventId, eventBody)       
		.then(function (response) {
			console.log('updating event status: ', response.status);
			return response;
		}, function(reason) {
			return reason; 		
		});
		return updateEventPromise;
	}

	function updateEventStartEnd(eventId, body) {
		var updateStartEndEventPromise = $http.put(baseUrl + '/api/event/newdate/' + eventId, body)
		.then(function (response) {
			console.log('updating event start end status: ', response.status);
			return response;
		}, function(reason) {
			return reason; 		
		});
		return updateStartEndEventPromise;  
	}

	function deleteEvent(eventId) {
		var deleteEventPromise = $http.delete(baseUrl + '/api/event/' + eventId)       
		.then(function (response) {
			console.log('deleting event status: ', response.status);
			return response;
		}, function(reason) {
			return reason; 		
		});
		return deleteEventPromise;
	}

	function savePlan(plan) {
		var savePlanPromise = $http.post(baseUrl + '/api/plan/', plan)       
		.then(function (response) {
			console.log('adding plan status: ', response.status);
			return response;
		}, function(reason) {
			return reason; 		
		});
		return savePlanPromise;
	}

	function configureEventData(date, event) {

		var selDay = date.getDate();

		event.start.setDate(selDay);
		event.end.setDate(selDay);
	}

	
	function getAllEvents() {
		var allEventsPromise = $http.get(baseUrl + '/api/event/')       
		.then(function (response) {
			console.log('success Number of all events: ', response.data.length);
			return response.data;
		}, function(reason) {
			if (reason.status == 404){
				console.log('not found events');
				return null;
			}
			else{
				return reason; 
			}			
		});
		return allEventsPromise;
	}



	// так делать не надо, есть же пример ниже!!
	function getAllUserEvents(){
		return $http.get(baseUrl + '/api/eventPublicAndByOwner');
	}


	function getEvents(start, stop) {
		var eventsPromise = $http.get(baseUrl + '/api/eventByInterval/'+ (+start)+ '/'+ (+stop))       
		.then(function (response) {
			console.log('success Number of finded events: ', response.data.length);
			return response.data;
		}, function(reason) {
			if (reason.status == 404){
				console.log('not found events');
				return null;
			}
			else{
				return reason; 
			}			
		});
		return eventsPromise;
	}

	function getUserEvents(start, stop) {
		var loggedUserId = AuthService.getUser().id;
		var eventsPromise = $http.get(baseUrl + '/api/user/eventsByInterval/'+ loggedUserId+ '/' + (+start)+ '/'+ (+stop))       
		.then(function (response) {
			var eventsArr = response.data.events;
			console.log('success Number of finded events: ', eventsArr.length);
			return eventsArr;
		}, function(reason) {
			if (reason.status == 404){
				console.log('not found events');
				return null;
			}
			else{
				return reason; 
			}			
		});
		return eventsPromise;
	}

	function getRoomEvents(roomId, start, stop) {
		console.log('id', roomId);
		console.log('start', start);
		console.log('stop',stop);
		var roomEventsPromise = $http.get(baseUrl + '/api/room/events/'+ roomId+ '/' + (+start)+ '/'+ (+stop))       
		.then(function (response) {
			var eventsArr = response.data.events;
			console.log('success! Searching events for room ID:'+ roomId + ' Number of finded events: ', eventsArr.length);
			return eventsArr;
		}, function(reason) {
			if (reason.status == 404){
				console.log('not found events');
				return null;
			}
			else{
				return reason; 
			}			
		});
		return roomEventsPromise;
	}

	function getDeviceEvents(deviceId, start, stop) {
				console.log('id', deviceId);
		console.log('start', start);
		console.log('stop',stop);
		var deviceEventsPromise = $http.get(baseUrl + '/api/device/events/'+ deviceId+ '/' + (+start)+ '/'+ (+stop))       
		.then(function (response) {
			var eventsArr = response.data.events;
			console.log('success! Searching events for device ID:'+ deviceId + ' Number of finded events: ', eventsArr.length);
			return eventsArr;
		}, function(reason) {
			if (reason.status == 404){
				console.log('not found events');
				return null;
			}
			else{
				return reason; 
			}			
		});
		return deviceEventsPromise;
	}




	function getRooms(clipped) {
		var addStr = '/';
		if(!clipped){
			addStr = 'clipped/';
		} else {
			addStr = '/';
		}
		var roomsPromise = $http.get(baseUrl + '/api/room'+ addStr)       
		.then(function (response) {
			 console.log('success Total rooms: items: ', response.data.length);
			return response.data;
		}, function(reason) {
			if (reason.status == 404){
				console.log('not found rooms');
				return null;
			}
			else{
				return reason; 
			}			
		});
		return roomsPromise;
	}

	function getDevices(clipped) {
		var addStr = '/';
		if(!clipped){
			addStr = 'clipped/';
		} else {
			addStr = '/';
		}
		var devicesPromise = $http.get(baseUrl + '/api/device' + addStr)       
		.then(function (response) {
			console.log('success Total devices: ', response.data.length);
			return response.data;
		}, function(reason) {
			if (reason.status == 404){
				console.log('not found devices');
				return null;
			}
			else{
				return reason; 
			}			
		});
		return devicesPromise;
	}

	function getUsers(clipped) {
		var addStr = '/';
		if(!clipped){
			addStr = 'clipped/';
		} else {
			addStr = '/';
		}
		var usersPromise = $http.get(baseUrl + '/api/user'+ addStr)       
		.then(function (response) {
			console.log('success Number of Users: ', response.data.length);
			return response.data;
		}, function(reason) {
			if (reason.status == 404){
				console.log('not found users');
				return null;
			}
			else{
				return reason; 
			}			
		});
		return usersPromise;
	}

	function getEventTypes(clipped) {
		var addStr = '/';
		if(!clipped){
			addStr = 'clipped/';
		} else {
			addStr = '/';
		}
		var typesPromise = $http.get(baseUrl + '/api/eventType'+ addStr)         
		.then(function (response) {
			console.log('success Current number of types: ', response.data.length);
			return response.data;
		}, function(reason) {
			if (reason.status == 404){
				console.log('not found types');
				return null;
			}
			else{
				return reason; 
			}			
		});
		return typesPromise;
	}


	function getEventTypesPublicByOwner() {
		var eventTypesPublicByOwnerPromise = $http.get(baseUrl + '/api/eventTypePublicAndByOwner/')
		.then(function (response) {
			console.log('success Current number of types (public by owner): ', response.data.length);
			return response.data;
		}, function (reason) {
			if (reason.status == 404) {
				console.log('not found types public and by owner');
				return null;
			}
			else {
				return reason;
			}
		});
		return eventTypesPublicByOwnerPromise;
	}

	function checkEventNotification(){
		return $http.get(baseUrl + '/api/checkEventNotification');
	}

	return {
		getTimeStampsDaily: getTimeStampsDaily,
		getTimeStamps: getTimeStamps,
		getDaysNames: getDaysNames,
		getDays: getDays,
		configureEventData: configureEventData,
		saveEvent: saveEvent,
		updateEvent: updateEvent,
		updateEventStartEnd : updateEventStartEnd,
		deleteEvent: deleteEvent,
		savePlan: savePlan,
		getRooms: getRooms,
		getDevices: getDevices,
		getUsers: getUsers,
		getEvents: getEvents,
		getRoomEvents: getRoomEvents,
		getDeviceEvents: getDeviceEvents,
		getAllEvents: getAllEvents,
		getEventTypes: getEventTypes,
		getUserEvents: getUserEvents,
		getEventTypesPublicByOwner: getEventTypesPublicByOwner,
		getAllUserEvents: getAllUserEvents,
		checkEventNotification: checkEventNotification 
	};
}