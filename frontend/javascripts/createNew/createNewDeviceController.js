var app = require('../app');


app.controller('createNewDeviceController', createNewDeviceController);
createNewDeviceController.$inject = ['$scope', 'createNewDeviceService'];

function createNewDeviceController($scope, createNewDeviceService){

  $scope.showDevicesList = true;

// пример с лета
  // $scope.devices = [{ title: 'Мяч', price: 'круглый и футбольный'}, 
  //                     { title: 'Флаг', price: 'оригинал'}, 
  //                     { title: 'Бутсы', price: 'пригодяться'}];

// грузим дааные с бд сразу все
  // $scope.devices = createNewDeviceService.getDevices();


// грузим данные с бд только при вызове getDevices
  createNewDeviceService.getDevices(function(data){
    $scope.devices = data;
  });




  $scope.addDevice = function (){
      $scope.devices.push({title: $scope.device.title, events: $scope.device.description });
      $scope.device.title = '';
      $scope.device.description = '';
  };
  $scope.reset = function (){
      $scope.device.title = '';
      $scope.device.description = '';
  };
  // $scope.removeProduct = function (index){
  //     $scope.products.splice(index,1);
  // };

  $scope.toggleViewDevice = function(){
      $scope.showDevicesList = !$scope.showDevicesList;
  };




  // $scope.master= {};
  // $scope.update = function(user) {
  //   $scope.master= angular.copy(user);
  // };
  // $scope.reset = function() {
  //   $scope.user = angular.copy($scope.master);
  // };
  // $scope.reset();



}


