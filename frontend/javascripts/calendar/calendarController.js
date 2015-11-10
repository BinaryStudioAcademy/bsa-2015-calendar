var app = require('../app');

app.controller('CalendarController', CalendarController);

CalendarController.$inject = ['socketService', 'Notification', 'filterService', 'scheduleService', '$document', '$modal', '$resource', '$scope', '$rootScope', '$state', 'LoginService', 'AuthService', 'GoogleAuthService', 'helpEventService', '$uibModal', '$location'];

function CalendarController(socketService, Notification, filterService, scheduleService, $document, $modal, $resource, $scope, $rootScope, $state, LoginService, AuthService, GoogleAuthService, helpEventService, $uibModal, $location) {

  var vm = this;
  vm.eventTypes = [];
  
  pullData();
  console.log(vm.eventTypes);
  var todayDate = Date.now();
  vm.selectedDate = todayDate;
  var userInfo = AuthService.getUser();

  setInterval(function(){
    helpEventService.checkEventNotification()
    .then(function(result){
      console.log(result.data);
      if(result.data) {
        console.log('emitting');
        socketService.emit('notify', result.data);
      }

      //for(var i = 0; i < result.data.length; i++){
        // var lapse = new Date(result.data[i].start) - new Date();
        // lapse = lapse / ( 1000 * 60 ) + 1;
        // lapse = Math.floor(lapse);
        // Notification.success({message: "Event '" + result.data[i].title + "' starts in " + lapse + " minute(s).", delay: 300000});
        //alertify.delay(300000).closeLogOnClick(true).log("Event '" + result.data[i].title + "' starts in " + lapse + " minutes.");
      //}
      
    });
  }, 50000);

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

  $scope.$on('newEventTypeAdded', function (event, eventTypeBody) {
    vm.eventTypes.push(eventTypeBody);
  });

  $scope.$on('eventTypeDeleted', function () {
    helpEventService.getEventTypesPublicByOwner().then(function (data) {
      vm.eventTypes = data;
    });
  });

  vm.sheduleChanged = function(scheduleItemType, scheduleItemId){
    scheduleService.sheduleChanged(scheduleItemType, scheduleItemId);
  };

  function pullData(){
    helpEventService.getRooms(true).then(function(data) {
        if (data !== null){
            vm.rooms = data;
        }
    }).then(function() {
      helpEventService.getDevices(true).then(function(data) {
          if (data !== null){
            vm.devices = data;
          }
        });
    }).then(function() {
      //helpEventService.getEventTypesPublicByOwner()
      //helpEventService.getEventTypes(true)
      helpEventService.getEventTypesPublicByOwner().then(function(data) {
        console.log('types public and by owner calling in calendar controoler from service = ', data);
        if (data !== null){
          vm.eventTypes = data;
        }
      });
    });
  }

  vm.allEventTypes = filterService.getAllEventTypes();    // all event type from db


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
    for (var i = 0; i < vm.allEventTypes.length; i++) {   
      vm.checkEventTypes.push(vm.allEventTypes[i]._id);
      vm.allEventTypes[i].flag = true;
    }

    // console.log('flags from CalendarController selectAllEventType', vm.checkEventTypes);   
    $rootScope.$broadcast('checkEventTypes', {   //push vm.checkEventTypes to point $rootScope.$on
      messege: vm.checkEventTypes
    });

  };

  vm.clearAllEventType = function(){
    vm.checkEventTypes.length = 0;
    for (var i = 0; i < vm.allEventTypes.length; i++) {   
      vm.allEventTypes[i].flag = false;
    }
    // console.log('flags from CalendarController clearAllEventType', vm.checkEventTypes);  
    $rootScope.$broadcast('checkEventTypes', {   //push vm.checkEventTypes to point $rootScope.$on
      messege: vm.checkEventTypes
    });    
  };

  console.log(vm.allEventTypes);
  console.log(vm.eventTypes);
}
