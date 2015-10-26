var app = require('../../app');

app.factory('createNewDeviceService', createNewDeviceService);
createNewDeviceService.$inject = ['$resource'];


function createNewDeviceService ($resource) {

	var dbdevices = $resource('http://localhost:3080/api/device/', {});
	var devices = dbdevices.query();
	
	function getDevices(){
		return dbdevices.query();
	}
	// function getDevices(callback){
	// var dbdevices = $resource('http://localhost:3080/api/device/', {});
	// 	dbdevices.query(
	// 		function(data) {
	// 			console.log(data);
	// 			callback(data);
	// 		},
	// 		function(error, status) {
	// 			console.log(error, status);
	// 		}
	// 	);
	// }


	function saveDevice(newdevice) {
		return dbdevices.save(newdevice);
	}

	return  {
		getDevices: getDevices,
		saveDevice: saveDevice
	};
}
