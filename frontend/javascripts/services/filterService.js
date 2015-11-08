var app = require('../app');

app.factory('filterService', filterService);
filterService.$inject = ['$resource', '$rootScope'];


function filterService($resource, $rootScope) {
  var vm = this;


  var resourceEventTypes = $resource('http://localhost:3080/api/eventTypePublicAndByOwner/', {});
  // vm.ollEventTypes = resourceEventTypes.query();  // oll event type from db

	function getOllEventTypes(){
		return resourceEventTypes.query();
	}


  vm.correctFlagsEventTypes = [];

  $rootScope.$on('checkEventTypes', function (event, agrs) {           
      var flagsFromCalendar = agrs.messege;
      vm.correctFlagsEventTypes.length = 0;                                           
          for (var i = 0; i < flagsFromCalendar.length; i++) {        
              vm.correctFlagsEventTypes.push(flagsFromCalendar[i]);
          }


  });

	function correctFlags(){
		return vm.correctFlagsEventTypes;
	}


	// $rootScope.broadcast = function() {
	//     $rootScope.$parent.$broadcast('correctFlagsFromFilter', vm.correctFlagsEventTypes); // вниз!
	// };




	return  {
		getOllEventTypes: getOllEventTypes,
		correctFlags: correctFlags
	};


}