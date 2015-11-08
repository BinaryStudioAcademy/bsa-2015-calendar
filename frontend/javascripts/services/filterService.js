var app = require('../app');

app.factory('filterService', filterService);
filterService.$inject = ['$resource'];


function filterService($resource) {

  var resourceEventTypes = $resource('http://localhost:3080/api/eventTypePublicAndByOwner/', {});
  // vm.ollEventTypes = resourceEventTypes.query();  // oll event type from db

	function getOllEventTypes(){
		return resourceEventTypes.query();
	}

	return  {
		getOllEventTypes: getOllEventTypes
	};


}