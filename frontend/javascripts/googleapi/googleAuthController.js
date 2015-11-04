var app = require('../app');

app.controller('GoogleAuthController', GoogleAuthController);

GoogleAuthController.$inject = ['GoogleAuthService', 'AuthService', '$resource'];

function GoogleAuthController (GoogleAuthService, AuthService, $resource) {
	var vm = this;
	
	vm.login = function() {
		console.log('gaCtrl');
		var userInfo = AuthService.getUser();
		GoogleAuthService.login(userInfo.username);
	};
}
	