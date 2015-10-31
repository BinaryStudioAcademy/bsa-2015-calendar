var app = require('../app');
var googleConfig = require('./googleConfig');

app.factory('GoogleAuthService', GoogleAuthService);

GoogleAuthService.$inject = ['$resource', '$interval'];



function GoogleAuthService ($resource, $interval) {

	function login() {
		var win = window.open(googleConfig.URL, "Google Authorization", 'width=800, height=600'); 

		var pollTimer = $interval(function() {
			try {
				
				if (win.document.URL.indexOf(googleConfig.REDIRECT) != -1) {

					$interval.cancel(pollTimer);
					
					var url = win.document.URL;
					win.close();
					
					var code = getCode(url);

					console.log(code);
					sendUrl(code);
				}
			} catch(e) {}
		}, 100);
	}

	function getCode(url) {
		var regexS = "[\\#&\?]" + 'code' + "=([^&#]*)";
		var regex = new RegExp( regexS );
		var results = regex.exec( url );
		return results ? results[1] : "";
	}


	function sendUrl(code) {
			var resourceGoogleAuth = $resource('/api/gAuth/');
			resourceGoogleAuth.save({ code : code});
	}

	return {
		login : login
	};

}