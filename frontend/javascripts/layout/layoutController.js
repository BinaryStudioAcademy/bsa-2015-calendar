var app = require('../app');

app.controller('LayoutController', LayoutController);

LayoutController.$inject = ['socketService','$rootScope'];

function LayoutController(socketService, $rootScope) {
	
	console.log('layoutctrl');
	$rootScope.$on('editEvent', function(event, selectedDate, eventBody){
		console.log('edit receive');
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
                selectedEvent: function () {
                    return eventBody;
                },
            }
        });
    });

	$rootScope.$on('createEvent', function(event, selectedDate){
		console.log('create receive');
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
            }
        });
    });


	var vm = this;
	
	vm.init = function(){

	};

	vm.init();
}