var app = require('../../app');

app.controller('createNewRoomController', createNewRoomController);
createNewRoomController.$inject = ['$scope', 'createNewRoomService'];

function createNewRoomController($scope, createNewRoomService){

  $scope.showRoomsList = true;

  $scope.rooms = createNewRoomService.getRooms();
  // createNewRoomService.getRooms(function(data){
  //   $scope.rooms = data;
  // });


  $scope.addRoom = function (){
      var newroom = {title: $scope.room.title, events: $scope.room.events };
      console.log(newroom);
      createNewRoomService.saveRoom(newroom)
        .$promise.then(
          function(response) {
            console.log('success', response);
          },
          function(response) {
            console.log('failure', response);
          } 
      );
      $scope.rooms.push(newroom);
      $scope.room.title = '';
      $scope.room.events = '';
  };
  $scope.reset = function (){
      $scope.room.title = '';
      $scope.room.events = '';
  };
  $scope.toggleViewRoom = function(){
      $scope.showRoomsList = !$scope.showRoomsList;
  };
}
