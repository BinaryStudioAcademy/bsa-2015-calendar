var app = require('../app');

app.controller('GoogleAuthController', GoogleAuthController);

GoogleAuthController.$inject = ['GoogleAuthService'];

function GoogleAuthController (GoogleAuthService) {
	var vm = this;
	
	vm.login = function() {
		GoogleAuthService.login();
	};
}
	