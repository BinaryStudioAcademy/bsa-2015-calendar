var app = require('../app');

app.controller('GoogleAuthController', GoogleAuthController);

GoogleAuthController.$inject = ['GoogleAuthService', 'AuthService', '$resource'];

function GoogleAuthController (GoogleAuthService, AuthService, $resource) {
	var vm = this;
	
	vm.logined = false;

	function sendUserData(data) {
		var resourceGoogleAuth = $resource('/api/gAuth/');
		resourceGoogleAuth.save(data)
		.$promise.then(function(res) {
		    vm.logined = res.success;
		});
	}

	vm.login = function() {
		var loginCode;
		var userInfo = AuthService.getUser();

		GoogleAuthService.getLoginCode().then(function (code) {
			loginCode = code;
			var accountData = {
				loginCode : loginCode,
				userInfo : userInfo
			};

			
			sendUserData(JSON.stringify(accountData));
		});
		
		
	};
}
	