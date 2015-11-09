var app = require('../app');

app.controller('CalendarController', CalendarController);

CalendarController.$inject = ['$document', '$modal', '$resource', '$scope', '$rootScope', '$state', 'LoginService', 'AuthService', 'GoogleAuthService', '$uibModal', '$location'];

function CalendarController($document, $modal, $resource, $scope, $rootScope, $state, LoginService, AuthService, GoogleAuthService, $uibModal, $location) {
  var vm = this;
  
  var todayDate = Date.now();
  vm.selectedDate = todayDate;
  var userInfo = AuthService.getUser();

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

  vm.determineOpenedView = function () {
    var path = $location.path();
    var openedView = path.split('/')[2];
    switch(openedView) {
      case 'dayView' : return 0;
      case 'weekView' : return 1;
      case 'monthView' : return 2;
      case 'yearView' : return 3;
      default : return 0;
    }
  };

  vm.showTutorial = function () {
    vm.determineOpenedView();
    var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/tutorial/tutorial.html',
        controller: 'tutorialController',
        controllerAs: 'tutorialCtrl',
        bindToController: true,
        resolve: {
          openedViewIndex: vm.determineOpenedView()
        }
    });
  };

  if(!userInfo.completedTutorial){
    vm.showTutorial();
  }


  $document.bind("keydown", function(event) {
    // console.log(event.keyCode);
    if (event.keyCode == 113) {
      $("#myModal").modal("show");
    }
    if (event.keyCode == 27) {
      $("#myModal").modal("hide");
    }
  });

  


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