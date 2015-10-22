var app = require('../../app');


app.controller('createNewDeviceController', createNewDeviceController);
createNewDeviceController.$inject = ['$scope', 'createNewDeviceService'];

function createNewDeviceController($scope, createNewDeviceService){

  var vm = this;

  vm.showDevicesList = true;
  vm.devices = createNewDeviceService.getDevices();
  // createNewDeviceService.getDevices(function(data){
  //   vm.devices = data;
  // });



// для получения по Id
//   vm.devicesId = createNewDeviceService.dbdeviceById();
//   console.log(devicesId);

  vm.updateDevice = function(device){
    createNewDeviceService.updateDevice(device);
  };

  vm.addDevice = function(){
      var newdevice = {title: vm.device.title, events: vm.device.events};
      console.log(newdevice); 
      createNewDeviceService.saveDevice(newdevice)
        .$promise.then(
          function(response) {
            console.log('success', response);
          },
          function(response) {
            console.log('failure', response);
          } 
      );

      vm.devices.push(newdevice);
      vm.device.title = '';
      vm.device.events = '';
  };
  vm.reset = function (){
      vm.device.title = '';
      vm.device.events = '';
  };
  // vm.removeProduct = function (index){
  //     vm.products.splice(index,1);
  // };

  vm.toggleViewDevice = function(){
      vm.showDevicesList = !vm.showDevicesList;
  };







  vm.changeDeviceId = function (){
    return true;
  };
  vm.deleteDeviceId = function (){
    return true;
  };



}


// app.directive("demoId", function(){
//     return function(scope, element, attrs){
//             scope.id = attrs.demoId;
//     }
// })
