var app = require('../../app');

app.controller('createNewDeviceController', createNewDeviceController);
createNewDeviceController.$inject = ['$scope', 'createNewDeviceService', 'socketService', 'alertify'];

function createNewDeviceController($scope, createNewDeviceService, socketService, alertify) {
    var vm = this;
    vm.devices = createNewDeviceService.getDevices();
    // alternativa str 9
    // createNewDeviceService.getDevices(function(data){
    //   vm.devices = data;
    // });

    vm.reset = function () {
        vm.device.title = '';
        vm.device.description = '';
    };

    vm.addDevice = function () {
        var newdevice = {title: vm.device.title, description: vm.device.description};
        console.log(newdevice);
        createNewDeviceService.saveDevice(newdevice)
            .$promise.then(
            function (response) {
                vm.devices.push(response);
                // vm.devices = createNewDeviceService.getDevices();
                socketService.emit('add device', {device: newdevice});
                console.log('success function addDevice', response);
            },
            function (response) {
                console.log('failure function addDevice', response);
            }
        );
        vm.device.title = '';
        vm.device.description = '';
    };

    vm.updateDevice = function (device) {
        console.log(device);
        createNewDeviceService.updateDevice(device);
        socketService.emit('update device', {device: device});
    };

    vm.deleteDevice = function (device, $index) {
        createNewDeviceService.deleteDevice(device)
            .$promise.then(
            function (response) {
                console.log('success function deleteDevice', response);
                socketService.emit('delete device', {device: device});
                vm.devices.splice($index, 1);
            },
            function (response) {
                console.log('failure function deleteDevice', response);
            }
        );
    };
}