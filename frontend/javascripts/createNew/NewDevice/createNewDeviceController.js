var app = require('../../app');

app.controller('createNewDeviceController', createNewDeviceController);
createNewDeviceController.$inject = ['$scope', 'createNewDeviceService'];

function createNewDeviceController($scope, createNewDeviceService){
  var vm = this;
  vm.showDevicesList = false;
  vm.devices = createNewDeviceService.getDevices();
  // alternativa str 9
  // createNewDeviceService.getDevices(function(data){
  //   vm.devices = data;
  // });

  vm.toggleViewDevice = function(){
      vm.showDevicesList = !vm.showDevicesList;
  };

  vm.reset = function (){
      vm.device.title = '';
      vm.device.description = '';
  };

  vm.addDevice = function(){
      var newdevice = {title: vm.device.title, description: vm.device.description};
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
      vm.device.description = '';
  };

  vm.updateDevice = function(device){
    console.log(device); 
    createNewDeviceService.updateDevice(device);
  };

  vm.deleteDevice = function(device, $index){
    createNewDeviceService.deleteDevice(device)
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