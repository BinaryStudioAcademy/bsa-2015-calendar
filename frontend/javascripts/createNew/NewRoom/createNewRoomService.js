var app = require('../../app');

app.factory('createNewRoomService', createNewRoomService);
createNewRoomService.$inject = ['$resource'];


function createNewRoomService ($resource) {

	function getRooms(callback){
	var dbrooms = $resource('http://localhost:3080/api/room/', {});

	dbrooms.query(function(data){
		console.log(data);
		callback(data);
	}, function(error, status){
			console.log(error, status);
	});
	}



	return  {
		getRooms: getRooms
	};
}



