var app = require('../../app');

app.factory('createNewEventTypeService', createNewEventTypeService);
createNewEventTypeService.$inject = ['$resource'];

function createNewEventTypeService ($resource) {
	var dbEventTypes = $resource('http://localhost:3080/api/eventType/', {});
	var eventTypes = dbEventTypes.query();
	
	function getEventTypes(){
		return eventTypes;
	}

	// function getEventTypeByTitle(eventType){
	// 	var dbEventTypeByTitle = $resource('http://localhost:3080/api/eventTypeByTitle/:title', {title: eventType.title});
	// 	var newType = dbEventTypeByTitle.get(eventType);
	// 	console.log(newType);
	// 	return newType;
	// }


	function saveEventType(newEventType) {
		return dbEventTypes.save(newEventType);
	}

	function updateEventType(eventType){	
		var dbEventTypeById = $resource('http://localhost:3080/api/eventType/:id', {id: eventType._id}, {'update': { method:'PUT'}});
		delete eventType._id;
		return dbEventTypeById.update(eventType);
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