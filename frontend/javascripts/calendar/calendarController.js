var app = require('../app');

app.controller('CalendarController', CalendarController);

CalendarController.$inject = ['socketService', 'Notification', 'filterService', 'scheduleService', '$document', '$modal', '$resource', '$scope', '$rootScope', '$state', 'LoginService', 'AuthService', 'GoogleAuthService', 'helpEventService', '$uibModal', '$location'];

function CalendarController(socketService, Notification, filterService, scheduleService, $document, $modal, $resource, $scope, $rootScope, $state, LoginService, AuthService, GoogleAuthService, helpEventService, $uibModal, $location) {

  	var vm = this;

	vm.checkEventTypesDD = [];
	vm.checkEventTypesIDs = [];
	var todayDate = Date.now();
	vm.selectedDate = todayDate;
	var userInfo = AuthService.getUser();
	

	$.ajax({
		  method: "GET",
		  url: "api/eventTypeClipped/",
		  async: false
		})
		  .done(function( msg ) {
		  	vm.allEventTypes = msg;
		    console.log( "Data Saved: ", msg );
		  });
	for(var i = 0; i < vm.allEventTypes.length; i++){
		vm.checkEventTypesDD.push({id:vm.allEventTypes[i]._id});
	}
	filterService.setActualEventTypes(vm.checkEventTypesDD);
	console.log(filterService.getActualEventTypes());
	console.log('all eventtypes', vm.allEventTypes);
	console.log('checked IDs',vm.checkEventTypesIDs);
	console.log(vm.allEventTypes);

	pullData();



	setInterval(function(){
		helpEventService.checkEventNotification()
		.then(function(result){
			console.log('notify', result.data);
			// if(result.data) {
			//   console.log('emitting');
			//   socketService.emit('notify', result.data);
			// }

			for(var i = 0; i < result.data.length; i++){
				var lapse = new Date(result.data[i].start) - new Date();
				lapse = lapse / ( 1000 * 60 ) + 1;
				lapse = Math.floor(lapse);
				Notification.success({message: "Event '" + result.data[i].title + "' starts in " + lapse + " minute(s).", delay: 300000});
				//alertify.delay(300000).closeLogOnClick(true).log("Event '" + result.data[i].title + "' starts in " + lapse + " minutes.");
			}
		});
  	}, 15000);

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
	  	case 'weekView' : return 6;
	  	case 'monthView' : return 7;
	  	case 'yearView' : return 8;
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
		vm.allEventTypes.push(eventTypeBody);
  	});

  	$scope.$on('eventTypeDeleted', function () {
		helpEventService.getEventTypesPublicByOwner().then(function (data) {
	  	vm.allEventTypes = data;
		});
  	});

  	vm.sheduleChanged = function(scheduleItemType, scheduleItem){
		scheduleService.sheduleChanged(scheduleItemType, scheduleItem._id);
		if (scheduleItemType == 'room'){
			vm.currentRoom = scheduleItem;
			vm.currnetDevice = null;	
		} else if(scheduleItemType== 'event') {
			vm.currentRoom = null;
			vm.currnetDevice = null;			
		} else {
			vm.currentDevice = scheduleItem;
			vm.currentRoom = null;
		}
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
		  	helpEventService.getEventTypesPublicByOwner().then(function(data) {
				console.log('types public and by owner calling in calendar controoler from service = ', data);
				if (data !== null){
			  		//vm.allEventTypes = data;
			  		//console.log( vm.allEventTypes);
			  		
				}
		  	});
		});
  	}

  	vm.selectConfigFilters = {
		buttonDefaultText: 'Select filters',
		enableSearch: true,
		scrollableHeight: '200px', 
		scrollable: true,
		displayProp: 'title',
		idProp: '_id',
		showCheckAll: false,
		showUncheckAll: false
		//externalIdProp: '',
  	};

  	vm.fillIds = function(){
		vm.checkEventTypesIDs = [];
		//console.log('checkdd',vm.checkEventTypesDD);
		//console.log('from fservice', filterService.setActualEventTypes());
		for(var i = 0; i < vm.checkEventTypesDD.length; i++){
	  		vm.checkEventTypesIDs.push(vm.checkEventTypesDD[i].id);
		}
  	};

  	vm.onItemSelect = function(item){
		//console.log('onitem select', vm.checkEventTypesDD);
		vm.fillIds();
		//console.log('IDs', vm.checkEventTypesIDs);
		filterService.setActualEventTypes(vm.checkEventTypesDD);
		$rootScope.$broadcast('filterTypesChanged', vm.checkEventTypesDD);
  	};

  	vm.onItemDeselect = function(item){
		console.log('onitem deselect', vm.checkEventTypesDD);
		vm.fillIds();
		console.log('IDs', vm.checkEventTypesDD);filterService.setActualEventTypes(vm.checkEventTypesDD);
		$rootScope.$broadcast('filterTypesChanged', vm.checkEventTypesDD);
  	};

  	vm.onSelectAll = function(){
		vm.fillIds();
		console.log('IDs', vm.checkEventTypesDD);filterService.setActualEventTypes(vm.checkEventTypesDD);
		$rootScope.$broadcast('filterTypesChanged', vm.checkEventTypesDD);
  	};

  	vm.onUnselecttAll = function(){
		console.log('onitem deselect all', vm.checkEventTypesDD);
		vm.fillIds();
		console.log('IDs', vm.checkEventTypesDD);filterService.setActualEventTypes(vm.checkEventTypesDD);
		$rootScope.$broadcast('filterTypesChanged', vm.checkEventTypesDD);
  	};

  	vm.dropDownEvents = {
		onSelectAll: vm.onSelectAll,
		onUnselectAll: vm.onUnselecttAll,
		onItemSelect: vm.onItemSelect,
		onItemDeselect: vm.onItemDeselect
  	};

  	console.log(vm.allEventTypes);
}
