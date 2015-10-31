var app = require('../../app');

app.controller('createNewRoomController', createNewRoomController);
createNewRoomController.$inject = ['$scope', 'createNewRoomService', 'socketService'];

function createNewRoomController($scope, createNewRoomService, socketService){
  var vm = this;
  vm.showRoomsList = false;
  vm.rooms = createNewRoomService.getRooms();
  // alternativa str 9
  // createNewRoomService.getRooms(function(data){
  //   vmrooms = data;
  // });

  vm.toggleViewRoom = function(){
      vm.showRoomsList = !vm.showRoomsList;
      vm.rooms = createNewRoomService.getRooms();
  };

  vm.reset = function (){
      vm.room.title = '';
      vm.room.description = '';
  };

  vm.addRoom = function (){
      var newroom = {title: vm.room.title, description: vm.room.description };
      console.log(newroom);
      createNewRoomService.saveRoom(newroom)
        .$promise.then(
          function(response) {
            vm.rooms.push(response);            
            console.log('success function addRoom', response);
            socketService.emit('add room', { room : newroom });
          },
          function(response) {
            console.log('failure function addRoom', response);
          } 
        );
      vm.room.title = '';
      vm.room.description = '';
  };

  vm.updateRoom = function(room){
    console.log(room); 
    createNewRoomService.updateRoom(room);
    socketService.emit('update room', { room : room });
  };

  vm.deleteRoom = function(room, $index){
    createNewRoomService.deleteRoom(room)
      .$promise.then(
        function(response) {
          console.log('success function deleteRoom', response);
          socketService.emit('delete room', { room : room });
          vm.rooms.splice($index, 1);
        },
        function(response) {
          console.log('failure function deleteRom', response);
        } 
      );
  };
}