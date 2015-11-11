var app = require('../app');

app.service('crudEvEventService', crudEvEventService);

crudEvEventService.$inject = ['$rootScope', '$uibModal', 'helpEventService'];

function crudEvEventService($rootScope, $uibModal, helpEventService) {

	vm = this;

	// отправка события после добавления нового ивента
	vm.addedEventBroadcast = function(selectedDate, eventBody, viewType) {
    	console.log('addedEvent broadcast', viewType);
    	$rootScope.$broadcast('addedEvent' + viewType, selectedDate, eventBody);
	};

	//  отправка события после добавления нового плана
	vm.addedPlanBroadcast = function(selectedDate, events, viewType) {
    	console.log('addedPlan broadcast');
    	$rootScope.$broadcast('addedPlan' + viewType, selectedDate, events);
	};

	// отправка события при активации операций создания ивента/плана
    vm.creatingBroadcast = function(selectedDate, viewType) {
    	console.log('creatingEvent broadcast');
    	$rootScope.$broadcast('creatingEvent', selectedDate, viewType);
	};

	// отправка события при активации редактирования/удаления ивента
	vm.editingBroadcast = function(selectedDate, eventBody, viewType) {
    	console.log('editingEvent broadcast');
    	$rootScope.$broadcast('editingEvent', selectedDate, eventBody, viewType);
	};

	// отправка события после удаления ивента
    vm.deletedEventBroadcast = function(selectedDate, eventBody, viewType) {
    	console.log('deletedEvent broadcast');
    	$rootScope.$broadcast('deletedEvent' + viewType, selectedDate, eventBody);
	};

	// отправка события после редактирования ивента
	vm.editedEventBroadcast = function(selectedDate, oldEventBody, newEventBody, viewType) {
    	console.log('editedEvent broadcast');
    	$rootScope.$broadcast('editedEvent' + viewType, selectedDate, oldEventBody, newEventBody);
	};

	// подписываемся на событие при вызове создания ивента
    vm.creatingListen = function() {
    	$rootScope.$on('creatingEvent', function(event, selectedDate, viewType){
    		vm.selectedDate = selectedDate;
    		vm.viewType = viewType;
	        console.log('creatingEvent received');
	        pullData(initCreateModal);    
	    });
    };

    // подписываемся на событие при вызове редактирования ивента
    vm.editingListen = function() {
    	$rootScope.$on('editingEvent', function(event, selectedDate, eventBody, viewType){
    		vm.selectedDate = selectedDate;
    		vm.eventBody = eventBody;
    		vm.viewType = viewType;
	        
	        console.log('editingEvent received');
	        pullData(initEditModal);
	    });
    };

    pullData = function(cb){
		console.log('pullData');
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
		    helpEventService.getEventTypes(true).then(function(data) {
		        if (data !== null){
		            vm.eventTypes = data;
		        }
		    });
		}).then(function() {
		    helpEventService.getUsers(true).then(function(data) {
		        if (data !== null){
		            vm.users = data;
		        }
		        console.log('pullDataCb finish');
		        cb();
		    });
		});
	};

	initCreateModal = function(selectedDate, viewType) {
        console.log('initialazing Create model');

	    var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/crudEvent/createEvent.html',
            controller: 'createEventController',
            controllerAs: 'createEvCtrl',
            bindToController: true,
            resolve: {
                selectedDate: function () {
                    return vm.selectedDate;
                },
               	viewType: function () {
                    return vm.viewType;
                },
                rooms: function (){ 
                	return vm.rooms;
                },
                devices: function (){
                	return vm.devices;
                },
                users: function (){
                	return vm.users;
                },
                eventTypes: function (){
                	return vm.eventTypes;
                },
            }
        });
	};

	initEditModal = function(selectedDate, eventBody, viewType) {
        console.log('initialazing Edit model');
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/crudEvent/editEvent.html',
            controller: 'editEventController',
            controllerAs: 'editEvCtrl',
            bindToController: true,
            resolve: {
                selectedDate: function () {
                    return vm.selectedDate;
                },
                eventBody: function () {
                    return vm.eventBody;
                },
               	viewType: function () {
                    return vm.viewType;
                },
                rooms: function (){
                	return vm.rooms;
                },
                devices: function (){
                	return vm.devices;
                },
                users: function (){
                	return vm.users;
                },
                eventTypes: function (){
                	return vm.eventTypes;
                },
            }
        });
	};
}
