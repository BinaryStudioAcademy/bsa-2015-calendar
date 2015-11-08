var app = require('../app');

app.controller('CalendarController', CalendarController);
CalendarController.$inject = ['filterService', '$document', '$modal', '$resource', '$scope', '$rootScope', '$state', 'LoginService', 'AuthService', 'GoogleAuthService', 'helpEventService'];


function CalendarController('filterService', $document, $modal, $resource, $scope, $rootScope, $state, LoginService, AuthService, GoogleAuthService, helpEventService) {

  var vm = this;
  
  var todayDate = Date.now();
  vm.selectedDate = todayDate;

  vm.logOut = function(){
    LoginService.logOut()
    .then(function(response){
      console.log('response data', response.data);
      if(response.data.unauthenticated){
        AuthService.unSetUser();
        console.log('signed out');
        // $state.go('signIn');
      }
    })
    .then(function(response){
            if(response){
                console.log(response);
                alertify.error('Error');
            }   
    });
  };


  $document.bind("keydown", function(event) {
    // console.log(event.keyCode);
    if (event.keyCode == 113) {
      $("#myModal").modal("show");
    }
    if (event.keyCode == 27) {
      $("#myModal").modal("hide");
    }
  });


  vm.eventTypes = [];
  helpEventService.getEventTypesPublicByOwner().then(function (data) {
    vm.eventTypes = data;
  });

  $scope.$on('newEventTypeAdded', function (event, eventTypeBody) {
    vm.eventTypes.push(eventTypeBody);
  });

  $scope.$on('eventTypeDeleted', function () {
    helpEventService.getEventTypesPublicByOwner().then(function (data) {
      vm.eventTypes = data;
    });
  });


  vm.ollEventTypes = filterService.getOllEventTypes();    // oll event type from db
  // console.log('vm.ollEventTypes', vm.ollEventTypes);  

  vm.checkEventTypes = [];
  vm.checkFlag = function(_id){         // push check Flags tu vm.checkEventTypes
    var index = vm.checkEventTypes.indexOf(_id);
    if (index !== -1) {
      vm.checkEventTypes.splice(index, 1);
    } else {
      vm.checkEventTypes.push(_id);
    }
    $rootScope.$broadcast('checkEventTypes', {   //push vm.checkEventTypes to point $rootScope.$on
      messege: vm.checkEventTypes
    });
  };



  vm.selectAllEventType = function(){
    vm.checkEventTypes.length = 0;
    for (var i = 0; i < vm.ollEventTypes.length; i++) {   
      vm.checkEventTypes.push(vm.ollEventTypes[i]._id);
      vm.ollEventTypes[i].flag = true;
    }
    // console.log('flags from CalendarController selectAllEventType', vm.checkEventTypes);   
    $rootScope.$broadcast('checkEventTypes', {   //push vm.checkEventTypes to point $rootScope.$on
      messege: vm.checkEventTypes
    });

  };

  vm.clearAllEventType = function(){
    vm.checkEventTypes.length = 0;
    for (var i = 0; i < vm.ollEventTypes.length; i++) {   
      vm.ollEventTypes[i].flag = false;
    }
    // console.log('flags from CalendarController clearAllEventType', vm.checkEventTypes);  
    $rootScope.$broadcast('checkEventTypes', {   //push vm.checkEventTypes to point $rootScope.$on
      messege: vm.checkEventTypes
    });    
  };
}
