var app = require('../../app');

app.factory('createNewDeviceService', createNewDeviceService);
createNewDeviceService.$inject = ['$resource', 'Globals'];

function createNewDeviceService ($resource, Globals) {
	var baseUrl = Globals.baseUrl;
	var resourceURL = baseUrl + '/api/device/:id';

	var dbdevices = $resource(resourceURL, null, {
		'update': { method: 'PUT'},
		'delete': { method: 'DELETE'}
	});
	var devices = dbdevices.query();
	
	function getDevices(){
		return dbdevices.query();
	}


	function saveDevice(newdevice) {
		return dbdevices.save(newdevice);
	}

	function updateDevice(device){	
		console.log(device);
		var one_device = dbdevices.update({id: device._id}, device);

	}

	function deleteDevice(device) {
		console.log(device);
		return dbdevices.delete({ id: device._id });
	}

	return  {
		getDevices: getDevices,
		saveDevice: saveDevice,
		updateDevice: updateDevice,
		deleteDevice: deleteDevice
	};
}