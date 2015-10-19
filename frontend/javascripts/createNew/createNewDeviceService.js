var app = require('../app');

app.factory('createNewDeviceService', createNewDeviceService);
createNewDeviceService.$inject = ['$resource'];


function createNewDeviceService ($resource) {

// српазу загружаем весь массив данных в фабрику
	// var dbdevices = $resource('http://localhost:3080/api/device/', {});
	// var devices = dbdevices.query();
	
	// function getDevices(){
	// 	return devices;
	// }

// грузим только при вызове getDevices
	function getDevices(callback){
	var dbdevices = $resource('http://localhost:3080/api/device/', {});

	dbdevices.query(function(data){
		console.log(data);
		callback(data);
	}, function(error, status){
		console.log(error, status);
	});
	}

	// function putDevices(callback){
	// var dbdevices = $resource('http://localhost:3080/api/device/', {});

	// dbdevices.put(function(data){
	// 	console.log(data);
	// 	callback(data);
	// }, function(error, status){
	// 	console.log(error, status);
	// });
	// }


	return  {
		getDevices: getDevices
	};
}



