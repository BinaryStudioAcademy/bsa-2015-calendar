var app = require('../../app');

app.controller('createNewEventTypeController', createNewEventTypeController);
createNewEventTypeController.$inject = ['$scope', 'createNewEventTypeService', 'AuthService'];

function createNewEventTypeController($scope, createNewEventTypeService, AuthService) {
    var vm = this;

    vm.icons = [
        { css: null, name: 'None' },
        { css: 'fa fa-users', name: 'Meeting' },
        { css: 'fa fa-microphone', name: 'Speech' },        
        { css: 'fa fa-line-chart', name: 'Line chart' },
        { css: 'fa fa-plane', name: 'Plane' },
        { css: 'fa fa-birthday-cake', name: 'Birthay Cake' },
        { css: 'fa fa-code', name: 'Code' },
        { css: 'fa fa-cogs', name: 'Cogs' },
        { css: 'fa fa-film', name: 'Film' },
        { css: 'fa fa-television', name: 'Television' },
        { css: 'fa fa-pie-chart', name: 'Pie chart' },
        { css: 'fa fa-music', name: 'Music' },
        { css: 'fa fa-graduation-cap', name: 'Education' },
        { css: 'fa fa-futbol-o', name: 'Football' },
        { css: 'fa fa-coffee', name: 'Coffee' },
        { css: 'fa fa-bicycle', name: 'Bicycle' },
        { css: 'fa fa-heart', name: 'Heart' },
        { css: 'fa fa-beer', name: 'Beer' }
    ];

    vm.eventType = {};
    vm.eventType.icon = vm.icons[0];

    vm.setIcon = function(eventType, icon){
        // console.log('new icon: ', icon);
        console.log(eventType);
        if(eventType === null){
            vm.eventType.icon = icon;
        } else{
            eventType.icon = icon;
        }
        
    };

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