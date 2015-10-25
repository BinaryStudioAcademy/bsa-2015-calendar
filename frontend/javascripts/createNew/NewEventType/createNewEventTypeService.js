var app = require('../../app');

app.factory('createNewEventTypeService', createNewEventTypeService);
createNewEventTypeService.$inject = ['$resource'];

function createNewEventTypeService ($resource) {
	var dbdevices = $resource('http://localhost:3080/api/group/', {});
	var devices = dbdevices.query();
	
	function getDevices(){
		return devices;
	}

	function saveDevice(newdevice) {
		return dbdevices.save(newdevice);
	}

	function updateDevice(device){	
		var dbdeviceById = $resource('http://localhost:3080/api/event/:id', {id: device._id}, {'update': { method:'PUT'}});
		delete device._id;
		var one_device = dbdeviceById.update(device);
	}

	function deleteDevice(device) {
		var dbdevicedel = $resource('http://localhost:3080/api/event/:id', {id: device._id});
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