var app = require('../../app');

app.controller('createNewRoomController', createNewRoomController);
createNewRoomController.$inject = ['$scope', 'createNewRoomService'];

function createNewRoomController($scope, createNewRoomService){
  $scope.showRoomsList = true;

  createNewRoomService.getRooms(function(data){
    $scope.rooms = data;
  });

  $scope.addRoom = function (){
      $scope.rooms.push({title: $scope.room.title, events: $scope.room.description });
      $scope.room.title = '';
      $scope.room.description = '';
  };
  $scope.reset = function (){
      $scope.room.title = '';
      $scope.room.description = '';
  };
  $scope.toggleViewRoom = function(){
      $scope.showRoomsList = !$scope.showRoomsList;
  };
}
