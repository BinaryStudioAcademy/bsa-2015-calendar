var app = require('../../app');

app.factory('createNewEventTypeService', createNewEventTypeService);
createNewEventTypeService.$inject = ['$resource'];

function createNewEventTypeService ($resource) {
	var dbEventTypes = $resource('http://localhost:3080/api/eventType/', {});
	var eventTypes = dbEventTypes.query();
	
	function getEventTypes(){
		return eventTypes;
	}

	function saveEventType(newEventType) {
		return dbEventTypes.save(newEventType);
	}

	function updateEventType(eventType){	
		var dbEventTypeById = $resource('http://localhost:3080/api/eventType/:id', {id: eventType._id}, {'update': { method:'PUT'}});
		delete eventType._id;
		var one_eventType = dbEventTypeById.update(eventType);
	}

	function deleteEventType(eventType) {
		var dbEventTypedel = $resource('http://localhost:3080/api/eventType/:id', {id: eventType._id});
		console.log(eventType);
		return dbEventTypedel.delete(eventType);
	}

	return  {
		getEventTypes: getEventTypes,
		saveEventType: saveEventType,
		updateEventType: updateEventType,
		deleteEventType: deleteEventType
	};
}