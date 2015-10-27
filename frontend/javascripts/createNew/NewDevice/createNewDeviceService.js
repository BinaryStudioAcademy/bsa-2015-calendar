var app = require('../../app');

app.factory('createNewDeviceService', createNewDeviceService);
createNewDeviceService.$inject = ['$resource'];

function createNewDeviceService ($resource) {
	var dbdevices = $resource('http://localhost:3080/api/device/', {});
	var devices = dbdevices.query();
	
	function getDevices(){
		return dbdevices.query();
	}
  // alternativa str 10-12
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

	function updateDevice(device){	
		var dbdeviceById = $resource('http://localhost:3080/api/device/:id', {id: device._id}, {'update': { method:'PUT'}});
		delete device._id;
		var one_device = dbdeviceById.update(device);
	}

	function deleteDevice(device) {
		var dbdevicedel = $resource('http://localhost:3080/api/device/:id', {id: device._id});
		console.log(device);
		return dbdevicedel.delete(device);
	}

	return  {
		getDevices: getDevices,
		saveDevice: saveDevice,
		updateDevice: updateDevice,
		deleteDevice: deleteDevice
	};
}