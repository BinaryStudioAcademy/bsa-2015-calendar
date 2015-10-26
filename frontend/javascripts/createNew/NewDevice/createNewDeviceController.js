var app = require('../../app');


app.controller('createNewDeviceController', createNewDeviceController);
createNewDeviceController.$inject = ['$scope', 'createNewDeviceService', 'socketService'];

function createNewDeviceController($scope, createNewDeviceService, socketService){

  $scope.showDevicesList = true;

  $scope.devices = createNewDeviceService.getDevices();
  // createNewDeviceService.getDevices(function(data){
  //   $scope.devices = data;
  // });

  $scope.addDevice = function (){
      var newdevice = {title: $scope.device.title/*, events: $scope.device.events*/};
      console.log(newdevice); 
      createNewDeviceService.saveDevice(newdevice)
        .$promise.then(
          function(response) {
            console.log('success', response);
            $scope.devices = createNewDeviceService.getDevices();

            socketService.emit('add device', { device: newdevice });
          },
          function(response) {
            console.log('failure', response);
          } 
      );

      //$scope.devices.push(newdevice);
      $scope.device.title = '';
      //$scope.device.events = '';
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
}


