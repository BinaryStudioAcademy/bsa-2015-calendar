var app = require('../../app');


app.controller('createNewDeviceController', createNewDeviceController);
createNewDeviceController.$inject = ['$scope', 'createNewDeviceService'];

function createNewDeviceController($scope, createNewDeviceService){


  $scope.showDevicesList = true;
  $scope.devices = createNewDeviceService.getDevices();
  // createNewDeviceService.getDevices(function(data){
  //   $scope.devices = data;
  // });



// для получения по Id
//   $scope.devicesId = createNewDeviceService.dbdeviceById();
//   console.log(devicesId);

  $scope.edit = function (device){
    createNewDeviceService.update(device);
  }

























  $scope.addDevice = function (){
      var newdevice = {title: $scope.device.title, events: $scope.device.events};
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

      $scope.devices.push(newdevice);
      $scope.device.title = '';
      $scope.device.events = '';
  };
  $scope.reset = function (){
      $scope.device.title = '';
      $scope.device.events = '';
  };
  // $scope.removeProduct = function (index){
  //     $scope.products.splice(index,1);
  // };

  $scope.toggleViewDevice = function(){
      $scope.showDevicesList = !$scope.showDevicesList;
  };







  $scope.changeDeviceId = function (){
    return true;
  };
  $scope.deleteDeviceId = function (){
    return true;
  };



}


// app.directive("demoId", function(){
//     return function(scope, element, attrs){
//             scope.id = attrs.demoId;
//     }
// })
