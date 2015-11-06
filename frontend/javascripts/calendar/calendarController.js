var app = require('../app');

app.controller('CalendarController', CalendarController);

CalendarController.$inject = ['$document', '$modal', '$resource', '$scope', '$rootScope'];

function CalendarController($document, $modal, $resource, $scope, $rootScope, $state, LoginService, AuthService, GoogleAuthService) {
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

  // $document.bind("keypress", function(event) {
  //   console.log(event.keyCode);
  //   if ((event.keyCode == 112) || (event.keyCode == 104)) {
  //     $("#myModal").modal("show");
  //   }
  //   if (event.keyCode == 27) {
  //     $("#myModal").modal("hide");
  //   }
  // });



  var dbEventTypes = $resource('http://localhost:3080/api/eventTypePublicAndByOwner/', {});
  vm.eventTypes = dbEventTypes.query();  // oll event type from db
  vm.flag = [];

  vm.checkFlag = function(_id){         // push check Flags tu vm.flag
    var index = vm.flag.indexOf(_id);
    if (index !== -1) {
      vm.flag.splice(index, 1);
    } else {
      vm.flag.push(_id);
    }
    // console.log('flags from CalendarController $rootScope.$broadcast', vm.flag);
    $rootScope.$broadcast('flagFromCalendar', {   //push vm.flag to point $rootScope.$on
      messege: vm.flag
    });
  };



  vm.selectAllEventType = function(){
    vm.flag.length = 0;
    for (var i = 0; i < vm.eventTypes.length; i++) {   
      vm.flag.push(vm.eventTypes[i]._id);
      vm.eventTypes[i].flag = true;
    }
    // console.log('flags from CalendarController selectAllEventType', vm.flag);   
    $rootScope.$broadcast('flagFromCalendar', {   //push vm.flag to point $rootScope.$on
      messege: vm.flag
    });

  };

  vm.clearAllEventType = function(){
    vm.flag.length = 0;
    for (var i = 0; i < vm.eventTypes.length; i++) {   
      vm.eventTypes[i].flag = false;
    }
    // console.log('flags from CalendarController clearAllEventType', vm.flag);  
    $rootScope.$broadcast('flagFromCalendar', {   //push vm.flag to point $rootScope.$on
      messege: vm.flag
    });    
  };
}