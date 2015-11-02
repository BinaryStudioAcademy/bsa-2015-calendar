var OAUTHURL = 'https://accounts.google.com/o/oauth2/auth?',
	SCOPE = 'https://www.googleapis.com/auth/calendar.readonly',
	CLIENTID = '1013963100544-qijt8dlanmurpfk3n50hf0pjqo3qkt4n.apps.googleusercontent.com',
	REDIRECT = 'http://localhost:3080/',
	TYPE = 'code',
	ACCESS_TYPE = 'offline',
	URL = OAUTHURL + "access_type" + ACCESS_TYPE + '&scope=' + SCOPE +  '&response_type=' + TYPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT;

module.exports= {
	OAUTHURL: OAUTHURL,
	SCOPE: SCOPE,
	CLIENTID: CLIENTID,
	REDIRECT: REDIRECT,
	TYPE: TYPE,
	ACCESS_TYPE: ACCESS_TYPE,
	URL: URL
};

