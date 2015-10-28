var app = require('../../app');

app.controller('createNewEventTypeController', createNewEventTypeController);
createNewEventTypeController.$inject = ['$scope', 'createNewEventTypeService'];

function createNewEventTypeController($scope, createNewEventTypeService){
  var vm = this;
  vm.showEventTypesList = false;
  vm.eventTypes = createNewEventTypeService.getEventTypes();

  vm.toggleViewEventType = function(){
      vm.showEventTypesList = !vm.showEventTypesList;
      vm.eventTypes = createNewEventTypeService.getEventTypes();
  };

  vm.reset = function (){
      vm.eventType.title = '';
      // vm.eventType.events = '';
  };

  vm.addEventType = function(){
      var newEventType = {title: vm.eventType.title};
      console.log(newEventType); 
      createNewEventTypeService.saveEventType(newEventType)
        .$promise.then(
          function(response) {
            vm.eventTypes.push(response);         
            console.log('success function addEventType', response);
          },
          function(response) {
            console.log('failure function addEventType', response);
          } 
        );  
      vm.eventType.title = '';
  };


  vm.updateEventType = function(eventType){  
    console.log('element', eventType); 
    createNewEventTypeService.updateEventType(eventType)   
      .$promise.then(
        function(response) {   
          console.log('success function updateEventType', response);
        },
        function(response) {
          console.log('failure function updateEventType', response);
        } 
      ); 
  };

  vm.deleteEventType = function(eventType, $index){
    createNewEventTypeService.deleteEventType(eventType)
      .$promise.then(
        function(response) {
          console.log('success function deleteEventType', response);
          vm.eventTypes.splice($index, 1);
        },
        function(response) {
          console.log('failure function deleteEventType', response);
        } 
      );
  };
}