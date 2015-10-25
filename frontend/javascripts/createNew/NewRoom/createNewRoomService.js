var app = require('../../app');

app.factory('createNewRoomService', createNewRoomService);
createNewRoomService.$inject = ['$resource'];

function createNewRoomService ($resource) {
	// var dbrooms = $resource('http://localhost:3080/api/room/', {});
	// var rooms = dbrooms.query();

	function getRooms(){
		var rooms = $resource('http://localhost:3080/api/room/', {});
		return rooms.query();		
	}
  // alternativa str 10-13
	// function getRooms(callback){
	// var dbrooms = $resource('http://localhost:3080/api/room/', {});
	// dbrooms.query(function(data){
	// 	console.log(data);
	// 	callback(data);
	// }, function(error, status){
	// 		console.log(error, status);
	// });
	// }

	function saveRoom(newroom) {
		var dbrooms = $resource('http://localhost:3080/api/room/', {});
		return dbrooms.save(newroom);
	}

	function updateRoom(room){	
		var dbroomById = $resource('http://localhost:3080/api/room/:id', {id: room._id}, {'update': { method:'PUT'}});
		delete room._id;
		return dbroomById.update(room);
	}

	function deleteRoom(room) {
		var dbroomdel = $resource('http://localhost:3080/api/room/:id', {id: room._id});
		console.log(room);
		return dbroomdel.delete(room);
	}

	return  {
		getRooms: getRooms,
		saveRoom: saveRoom,
		updateRoom: updateRoom,
		deleteRoom: deleteRoom
	};
}