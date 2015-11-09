var app = require('../app');

app.factory('filterService', filterService);
filterService.$inject = ['$resource', '$rootScope'];


function filterService($resource, $rootScope) {
  var vm = this;
  var resourceEventTypes = $resource('http://localhost:3080/api/eventTypePublicAndByOwner/', {});
  vm.correctFlagsEventTypes = [];

	function getOllEventTypes(){
		return resourceEventTypes.query();
	}

	function correctFlags(){
		return vm.correctFlagsEventTypes;
	}

  $rootScope.$on('checkEventTypes', function (event, agrs) {           
      var flagsFromCalendar = agrs.messege;
      vm.correctFlagsEventTypes.length = 0;                                           
          for (var i = 0; i < flagsFromCalendar.length; i++) {        
              vm.correctFlagsEventTypes.push(flagsFromCalendar[i]);
          }
  });

	return  {
		getOllEventTypes: getOllEventTypes,
		correctFlags: correctFlags
	};
}