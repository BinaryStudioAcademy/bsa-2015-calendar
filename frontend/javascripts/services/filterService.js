var app = require('../app');

app.factory('filterService', filterService);

filterService.$inject = ['helpEventService'];

function filterService(helpEventService) {
  var vm = this;
  vm.actualEventTypes = [];

	function setActualEventTypes(actualEventTypes){
		vm.actualEventTypes = actualEventTypes;
	}

	function pullEventTypesSync(callback) {
		$.ajax({
			  method: "GET",
			  url: "api/eventTypeClipped/",
			  async: false
		}).done(function( eventTypes ) {
			  	callback(eventTypes);
		});
	}

	function getActualEventTypes(){
		// console.log('test');
		return vm.actualEventTypes.length ? vm.actualEventTypes : pullEventTypes();
		// return vm.actualEventTypes;
	}


	return  {
		getActualEventTypes: getActualEventTypes,
		setActualEventTypes: setActualEventTypes,
		pullEventTypesSync: pullEventTypesSync
	};
}