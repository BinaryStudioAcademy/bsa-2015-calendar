var app = require('../app');

app.controller('CalendarController', CalendarController);

CalendarController.$inject = ['$document', '$modal', '$resource', '$scope', '$rootScope'];

function CalendarController($document, $modal, $resource, $scope, $rootScope) {
	var vm = this;
	
	var todayDate = Date.now();
	vm.selectedDate = todayDate;

	$document.bind("keypress", function(event) {
		console.log(event.keyCode);
		if ((event.keyCode == 112) || (event.keyCode == 104)) {
			$("#myModal").modal("show");
		}
		if (event.keyCode == 27) {
			$("#myModal").modal("hide");
		}
	});





	var dbEventTypes = $resource('http://localhost:3080/api/eventType/', {});
	vm.eventTypes = dbEventTypes.query();  // oll event type from db
  vm.flag = [];

  vm.checkFlag = function(_id){         // push check Flags tu vm.flag
    var index = vm.flag.indexOf(_id);
    if (index !== -1) {
      vm.flag.splice(index, 1);
    } else {
      vm.flag.push(_id);
    }
    console.log('flags from CalendarController $rootScope.$broadcast', vm.flag);

    $rootScope.$broadcast('flagFromCalendar', {   //push vm.flag to point $rootScope.$on
      messege: vm.flag
    });
  };



  vm.selectAllEventType = function(){
    vm.flag.length = 0;
    for (var i = 0; i < vm.eventTypes.length; i++) {   
      vm.flag.push(vm.eventTypes[i]._id);
      vm.eventTypes[i].flag = true;
      console.log('flags from CalendarController selectAllEventType', vm.flag);

      $rootScope.$broadcast('flagFromCalendar', {   //push vm.flag to point $rootScope.$on
        messege: vm.flag
      });
    }
  };

  vm.clearAllEventType = function(){
    vm.flag.length = 0;
    for (var i = 0; i < vm.eventTypes.length; i++) {   
      vm.eventTypes[i].flag = false;

      $rootScope.$broadcast('flagFromCalendar', {   //push vm.flag to point $rootScope.$on
        messege: vm.flag
      });
    }

  };








  // var checklist = [];
  // document.addEventListener('change', function (evt) {
  //     var el = evt.target;
  //     var val = el.value;         
  //     if (el.checked) {
  //       checklist.push(val); 
  //     } else {
  //       var idx = checklist.indexOf(val);
  //         if( idx > -1 ){
  //           checklist.splice(idx, 1);
  //         }
  //       }
  //     log.innerHTML = checklist;
  //     return checklist;
  //     console.log(checklist);
  // });

}