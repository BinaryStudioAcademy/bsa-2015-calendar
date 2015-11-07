var app = require('../../app');

app.controller('createNewEventTypeController', createNewEventTypeController);
createNewEventTypeController.$inject = ['$scope', 'createNewEventTypeService', 'AuthService'];

function createNewEventTypeController($scope, createNewEventTypeService, AuthService) {
    var vm = this;
    vm.eventTypes = [];

    vm.inputStyles = [];

    vm.inputStyle = {};

    vm.changeStyle = function(type){
        if(!type){
            vm.inputStyle = {
                background: vm.eventType.color
            };            
        } else {
            vm.inputStyles[type._id] = {
                background: type.color
            };
        }

    };

    createNewEventTypeService.getEventTypesPublicByOwner()
    .then(function(response){
        vm.eventTypes = response.data;

        for(var i = 0; i < vm.eventTypes.length; i++){
            vm.inputStyles[vm.eventTypes[i]._id] = vm.eventTypes[i].color;
            vm.changeStyle(vm.eventTypes[i]);
        }

    });

    vm.reset = function () {
        vm.eventType.title = '';
        vm.eventType.isPrivate = false;
        // vm.eventType.events = '';
    };

    vm.getCurrentUser = function(){
        return AuthService.getUser();
    };

    vm.addEventType = function () {
        //console.log(AuthService.getUser());
        var newEventType = {
            title: vm.eventType.title,
            color: vm.eventType.color,
            isPrivate: vm.eventType.isPrivate,
            ownerId: AuthService.getUser().id
        };
        console.log(newEventType);
        createNewEventTypeService.saveEventType(newEventType)
            .$promise.then(
            function (response) {
                vm.eventTypes.push(response);
                vm.changeStyle(response);
                console.log('success function addEventType', response);
            },
            function (response) {
                console.log('failure function addEventType', response);
            }
        );
        vm.reset();
    };

    vm.updateEventType = function (eventType) {
        console.log('element', eventType);
        createNewEventTypeService.updateEventType(eventType)
            .$promise.then(
            function (response) {
                console.log('success function updateEventType', response);
            },
            function (response) {
                console.log('failure function updateEventType', response);
            }
        );
    };

    vm.deleteEventType = function (eventType, $index) {
        createNewEventTypeService.deleteEventType(eventType)
            .$promise.then(
            function (response) {
                console.log('success function deleteEventType', response);
                vm.eventTypes.splice($index, 1);
            },
            function (response) {
                console.log('failure function deleteEventType', response);
            }
        );
    };
}