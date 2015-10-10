(function(){
  
  angular.module('dayViewDemo', []);
  
  angular
    .module('dayViewDemo')
    .controller('DayViewController', DayViewController);
  
  function DayViewController() {
    var vm = this;
    
    vm.timeStamps = '12am|1am|2am|3am|4am|5am|6am|7am|8am|9am|10am|11am|12pm|1pm|2pm|3pm|4pm|5pm|6pm|7pm|8pm|9pm|10pm|11pm'.split('|');
    var todayDate = Date.now();
    var date1 = new Date(2015, 9, 9, 8);
    var date2 = new Date(2015, 9, 9, 13);
    
    vm.selectedDate = todayDate;
    vm.eventSelected = false;
    vm.event = getEvents(date1, date2);
    
    vm.toggleEventInfo = function() {
      vm.eventSelected = !vm.eventSelected;
    };
    
    function getEvents(date1, date2) {
      var event = {
        name: 'Angular Deep Dive',
        description: 'Nice course about angular directives, casestudies and many practical problems',
        author: 'Alex C',
        room: 3,
        participants: 10,
        startTime: date1,
        endTime: date2,
      };
      
      return event;
    }
  }
  
})();