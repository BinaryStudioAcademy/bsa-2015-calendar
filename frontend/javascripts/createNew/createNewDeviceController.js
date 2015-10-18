var app = require('../app');

app.controller('createNewDeviceController', function($scope){
  $scope.showDevicesList = true;
  $scope.devices = [{ title: 'Мяч', price: 'круглый и футбольный'}, 
                      { title: 'Флаг', price: 'оригинал'}, 
                      { title: 'Бутсы', price: 'пригодяться'}];


  $scope.addDevice = function (){
      $scope.devices.push({title: $scope.device.title, price: $scope.device.description });
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



});


