var app = require('../../app');

app.factory('NavDirectiveService', NavDirectiveService);
NavDirectiveService.$inject = ['$resource'];

function NavDirectiveService($resource) {

  var days = [	{ name: 'Day',
								link: '.dayView'}, 
             	{ name: 'Week',
								link: '.weekView'}, 
             	{ name: 'Month',
								link: 'calendar.monthView'},
							{ name: 'Year',
								link: 'calendar.yearView'}, 
            ];

	function getDays(){
		return days;
	}

	return {
		getDays: getDays
	};

}