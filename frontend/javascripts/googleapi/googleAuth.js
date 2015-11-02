
var OAUTHURL    =   'https://accounts.google.com/o/oauth2/auth?';
var SCOPE       =   'https://www.googleapis.com/auth/calendar.readonly';
var CLIENTID    =   '1013963100544-qijt8dlanmurpfk3n50hf0pjqo3qkt4n.apps.googleusercontent.com';
var REDIRECT    =   'http://localhost:3080/googleAuth';
var TYPE        =   'code';
var ACCESS_TYPE =   'offline';
var URL         =   OAUTHURL + "access_type" + ACCESS_TYPE + '&scope=' + SCOPE +  '&response_type=' + TYPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT;

function login() {
	var win = window.open(URL, "Google Authorization", 'width=800, height=600'); 

	var pollTimer = window.setInterval(function() { 
		try {
			console.log(win.document.URL);
			if (win.document.URL.indexOf(REDIRECT) != -1) {
				window.clearInterval(pollTimer);
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
	if( results === null )
		return "";
	else
		return results[1];
}


function sendUrl(code) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", 'http://localhost:3080/api/gAuth', false);
	xmlhttp.setRequestHeader('Content-Type', 'application/json');
	xmlhttp.send(JSON.stringify({ code : code}));
}