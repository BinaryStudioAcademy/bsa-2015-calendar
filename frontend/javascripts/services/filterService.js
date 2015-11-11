var app = require('../app');

app.factory('filterService', filterService);

function filterService() {
  var vm = this;
  vm.actualEventTypes = [];

	function setActualEventTypes(actualEventTypes){
		vm.actualEventTypes = actualEventTypes;
	}

	function getActualEventTypes(){
		return vm.actualEventTypes;
	}

	return  {
		getActualEventTypes: getActualEventTypes,
		setActualEventTypes: setActualEventTypes
	};
}