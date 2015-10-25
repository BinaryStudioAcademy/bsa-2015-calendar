var app = require('../../app');

app.controller('createNewEventTypeController', createNewEventTypeController);
createNewEventTypeController.$inject = ['$scope', 'createNewEventTypeService'];

function createNewEventTypeController($scope, createNewEventTypeService){
  var vm = this;
  vm.showDevicesList = false;
  vm.devices = createNewEventTypeService.getDevices();

  vm.toggleViewDevice = function(){
      vm.showDevicesList = !vm.showDevicesList;
  };

  vm.reset = function (){
      vm.device.title = '';
      vm.device.events = '';
  };

  vm.addDevice = function(){
      var newdevice = {title: vm.device.title, events: vm.device.events};
      console.log(newdevice); 
      createNewDeviceService.saveDevice(newdevice)
        .$promise.then(
          function(response) {
            console.log('success function addDevice', response);
          },
          function(response) {
            console.log('failure function addDevice', response);
          } 
        );
      vm.devices.push(newdevice);
      vm.device.title = '';
  };

  vm.updateDevice = function(device){
    console.log(device); 
    createNewEventTypeService.updateDevice(device);
  };

  vm.deleteDevice = function(device, $index){
    createNewEventTypeService.deleteDevice(device)
      .$promise.then(
        function(response) {
          console.log('success function deleteDevice', response);
          vm.devices.splice($index, 1);
        },
        function(response) {
          console.log('failure function deleteDevice', response);
        } 
      );
  };
}