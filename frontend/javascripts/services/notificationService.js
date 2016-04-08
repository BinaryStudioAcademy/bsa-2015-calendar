var app = require('../app');

app.service('NotificationService', NotificationService);

NotificationService.$inject = [];

function NotificationService() {

	var vm = this;

	var activeNotifications = [];

	vm.add = function(event) {
		activeNotifications.push(event._id);
	};

	vm.contains = function(event) {
		for(var i = 0; i < activeNotifications.length; i++) {
			if(event._id === activeNotifications[i]) {
				return true;
			}
		}

		return false;
	};

	vm.remove = function(event) {
		for(var i = 0; i < activeNotifications.length; i++) {
			if(activeNotifications[i] === event._id) {
				activeNotifications.splice(i,1);
			}

	        return false;
	    }
	};

}