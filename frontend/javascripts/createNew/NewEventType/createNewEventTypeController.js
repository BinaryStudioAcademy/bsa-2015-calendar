var app = require('../../app');

app.controller('createNewEventTypeController', createNewEventTypeController);
createNewEventTypeController.$inject = ['$scope', 'createNewEventTypeService', 'AuthService', '$rootScope'];

function createNewEventTypeController($scope, createNewEventTypeService, AuthService, $rootScope) {
    var vm = this;





    vm.setIcon = function(eventType, icon){
        // console.log('new icon: ', icon);
        console.log(eventType);
        if(eventType === null){
            vm.eventType.icon = icon;
        } else{
            eventType.icon = icon;
        }
    };



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

    function init() {
        vm.icons = createNewEventTypeService.getIcons();
        vm.eventType = {};
        vm.eventType.icon = vm.icons[0];
        vm.eventTypes = [];

        vm.inputStyles = [];

        vm.inputStyle = {};

        createNewEventTypeService.getEventTypesPublicByOwner().$promise.then(function(types) {
            vm.eventTypes = types;

             for(var i = 0; i < vm.eventTypes.length; i++){
                vm.inputStyles[vm.eventTypes[i]._id] = vm.eventTypes[i].color;
                vm.changeStyle(vm.eventTypes[i]);
            }           
        });
    }


    init();

    vm.reset = function () {
        vm.eventType.title = '';
        vm.eventType.isPrivate = false;
        vm.eventType.color = '';
        vm.changeStyle();
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
            icon: vm.eventType.icon,
            ownerId: AuthService.getUser().id
        };
        console.log(newEventType);
        createNewEventTypeService.saveEventType(newEventType)
            .$promise.then(
            function (response) {
                vm.eventTypes.push(response);
                vm.changeStyle(response);
                console.log('success function addEventType', response);

                $rootScope.$broadcast('newEventTypeAdded', response);
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

                $rootScope.$broadcast('eventTypeDeleted', response);
            },
            function (response) {
                console.log('failure function deleteEventType', response);
            }
        );
    };
}