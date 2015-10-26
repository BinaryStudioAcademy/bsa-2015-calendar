
var OAUTHURL    =   'https://accounts.google.com/o/oauth2/auth?';
var VALIDURL    =   'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
var SCOPE       =   'https://www.googleapis.com/auth/calendar.readonly';
var CLIENTID    =   '1013963100544-qijt8dlanmurpfk3n50hf0pjqo3qkt4n.apps.googleusercontent.com';
var REDIRECT    =   'http://localhost:3080/googleAuth';
var TYPE        =   'token';
var URL        =   OAUTHURL + 'scope=' + SCOPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT + '&response_type=' + TYPE;

function login() {
	var win = window.open(URL, "Google Authorization", 'width=800, height=600'); 

	var pollTimer = window.setInterval(function() { 
		try {
			console.log(win.document.URL);
			if (win.document.URL.indexOf(REDIRECT) != -1) {
				window.clearInterval(pollTimer);
				var url = win.document.URL;
				win.close();
				
				var token = getAccessToken(url);
				sendUrl(token);
			}
		} catch(e) {}
	}, 100);
}

function getAccessToken(url) {
	var regexS = "[\\#&]"+ 'access_token' +"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( url );

	if( results === null )
		return "";
	else
		return results[1];
}


function sendUrl(token) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", 'http://localhost:3080/api/googleAuth', false);
	xmlhttp.send(token);
}