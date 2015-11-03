var app = require('../app');
var googleConfig = require('./googleConfig');

app.factory('GoogleAuthService', GoogleAuthService);

GoogleAuthService.$inject = ['$interval', '$q', '$resource'];



function GoogleAuthService ($interval, $q, $resource) {

	function getLoginCode() {
		var deferred = $q.defer();
		/*var auth = gapi.auth.authorize({
			client_id : googleConfig.CLIENTID,
			scope : googleConfig.SCOPE,
			response_type : googleConfig.TYPE
		}, function (res) {
			loginCode = res.code;
			console.log(loginCode);
			deferred.resolve(loginCode);
		});
		*/
		
		var win = window.open(googleConfig.URL, "Google Authorization", 'width=800, height=600'); 
		var pollTimer = $interval(function() {
			try {
				
				if (win.document.URL.indexOf(googleConfig.REDIRECT) != -1) {

					$interval.cancel(pollTimer);

					var url = win.document.URL;
					win.close();
					loginCode = getCode(url);
					console.log(loginCode);
					deferred.resolve(loginCode);
				}
			} catch(e) {}
		}, 100);
		
		return deferred.promise;
	}

	function getCode(url) {
		var regexS = "[\\#&\?]" + 'code' + "=([^&#]*)";
		var regex = new RegExp( regexS );
		var results = regex.exec( url );
		return results ? results[1] : "";
	}

	function sendUserData(data) {
		var resourceGoogleAuth = $resource('/api/gAuth/');
		resourceGoogleAuth.save(data)
		.$promise.then(function(res) {
			console.log('Loggined with Google');
		});
	}

	function login (userName, code) {
		var loginCode;
		var username;
		if(!userName){
			username = AuthService.getUser().username;
		} else {
			username = userName;
		}

		if(!code) {
			getLoginCode().then(function (code) {
				loginCode = code;
				var accountData = {
					loginCode : loginCode,
					username : username
				};

				
				sendUserData(JSON.stringify(accountData));
			});
		} else {
			var accountData = {
				loginCode : code,
				username : username
			};
			sendUserData(JSON.stringify(accountData));
		}
		
	}

	return {
		getLoginCode : getLoginCode,
		sendUserData : sendUserData,
		login : login
	};

}