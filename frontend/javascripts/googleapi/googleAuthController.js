var app = require('../app');

app.controller('GoogleAuthController', GoogleAuthController);

GoogleAuthController.$inject = ['GoogleAuthService', 'AuthService', '$resource'];

function GoogleAuthController (GoogleAuthService, AuthService, $resource) {
	var vm = this;
	
	function sendUserData(data) {
		var resourceGoogleAuth = $resource('/api/gAuth/');
		resourceGoogleAuth.save(data);
	}

	vm.login = function() {
		var loginCode;
		var userInfo = AuthService.getUser();

		GoogleAuthService.login().then(function (code) {
			loginCode = code;
			var accountData = {
				loginCode : loginCode,
				userInfo : userInfo
			};

			console.log(accountData);
			sendUserData(JSON.stringify(accountData));
		});
		
		
	};
}
	