var app = require('../../app');

app.factory('createNewRoomService', createNewRoomService);
createNewRoomService.$inject = ['$resource', 'Globals'];

function createNewRoomService ($resource, Globals) {

	var dbroomsUrl = Globals.baseUrl + '/api/room/:id';
	var dbrooms = $resource(dbroomsUrl, null, {

		'update': { 'method': 'put'},
		'delete': { 'method': 'delete'}
	});

	function getRooms(){
		return dbrooms.query();		
	}

	function saveRoom(newroom) {
		return dbrooms.save(newroom);
	}

	function updateRoom(room){	
		return dbrooms.update({id: room._id}, room);
	}

	function deleteRoom(room) {
		return dbrooms.delete({id: room._id});
	}

	return  {
		getRooms: getRooms,
		saveRoom: saveRoom,
		updateRoom: updateRoom,
		deleteRoom: deleteRoom
	};
}