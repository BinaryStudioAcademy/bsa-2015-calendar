var app = require('../app');

app.controller('createNewDeviceController', createNewDeviceController);

function createNewDeviceController() {
	$scope.master= {};

	$scope.update = function(user) {
		$scope.master= angular.copy(user);
	};

	$scope.reset = function() {
		$scope.user = angular.copy($scope.master);
	};

	$scope.reset();
}
