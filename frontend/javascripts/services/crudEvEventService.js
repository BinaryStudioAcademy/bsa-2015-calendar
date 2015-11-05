var app = require('../app');

app.service('crudEvEventService', crudEvEventService);

crudEvEventService.$inject = ['$rootScope', '$uibModal'];

function crudEvEventService($rootScope, $uibModal) {

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
	        console.log('creatingEvent received');
	        var modalInstance = $uibModal.open({
	            animation: true,
	            templateUrl: 'templates/crudEvent/createEvent.html',
	            controller: 'createEventController',
	            controllerAs: 'createEvCtrl',
	            bindToController: true,
	            resolve: {
	                selectedDate: function () {
	                    return selectedDate;
	                },
	               	viewType: function () {
	                    return viewType;
	                },
	            }
	        });
	    });
    };

    // подписываемся на событие при вызове редактирования ивента
    vm.editingListen = function() {
    	$rootScope.$on('editingEvent', function(event, selectedDate, eventBody, viewType){
	        console.log('editingEvent received');
	        var modalInstance = $uibModal.open({
	            animation: true,
	            templateUrl: 'templates/crudEvent/editEvent.html',
	            controller: 'editEventController',
	            controllerAs: 'editEvCtrl',
	            bindToController: true,
	            resolve: {
	                selectedDate: function () {
	                    return selectedDate;
	                },
	                eventBody: function () {
	                    return eventBody;
	                },
	               	viewType: function () {
	                    return viewType;
	                },
	            }
	        });
	    });
    };
}
