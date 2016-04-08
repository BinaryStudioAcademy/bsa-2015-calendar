var app = require('../app');

app.controller('DayViewController', DayViewController);

DayViewController.$inject = ['$stateParams', 'Notification', 'scheduleService', 'filterService', 'AuthService',
 '$rootScope', '$scope', 'crudEvEventService', '$timeout', '$q', '$uibModal', 'socketService', 'helpEventService', 'dailyCalendarHelper'];

function DayViewController($stateParams, Notification, scheduleService, filterService, AuthService, $rootScope, $scope, crudEvEventService,
 $timeout, $q, $uibModal, socketService, helpEventService, dailyCalendarHelper) {

	var vm = this;


	

	$scope.$on('scheduleTypeChanged', function(){
        console.log('scheduleTypeChanged');
		getAllEvents(vm.selectedDate, reBuildDailyView);
    });

    $scope.$on('filterTypesChanged', function (event, actualEventTypes) {      
    	console.log('message recieve "filterschanged" in daily');     
        vm.actualEventTypes = actualEventTypes;
        reBuildDailyView();
    });       

    $scope.$on('addedEventDayView', function(event, selectedDate, eventBody){
    	//$( ".day-event-blocks" ).remove();
    	console.log('EVENT ADDED', eventBody);
    	if(!vm.allEvents){
    		vm.allEvents = [];
    	} 
   		vm.allEvents.push(eventBody);
   		reBuildDailyView();
    });
 
    $scope.$on('addedPlanDayView', function(event, selectedDate, events){
 		console.log('PLAN ADDED', events);
     	if(!vm.allEvents){
     		vm.allEvents = [];	
     	}		
 		for(var i = 0; i < events.length; i++){
 			vm.allEvents.push(events[i]);
 		}
 		reBuildDailyView();
    });
 
    $scope.$on('deletedEventDayView', function(event, selectedDate, eventBody){
    	console.log('event deleted recieved');
 		document.getElementById(eventBody._id).parentNode.removeChild(document.getElementById(eventBody._id));
    });
 
    $scope.$on('editedEventDayView', function(event, selectedDate, oldEventBody, newEventBody){
    	console.log('event edited recieved');
    	console.log(document.getElementById(oldEventBody._id));
 		getAllEvents(vm.selectedDate, reBuildDailyView);
    });
	
    document.addEventListener('contextmenu', function(e){
		e.preventDefault();
	});

	vm.openDP = function(dp){
		vm.isDPopened = !vm.isDPopened;
	};




	vm.showDay = function(step) {
		var date = new Date(vm.selectedDate);
		console.log(date);
		date.setDate(
			step === 1 ?
				date.getDate() + 1
					:
				date.getDate() - 1
		);
		vm.selectedDate = date;
		reBuildDailyView();
		getAllEvents(vm.selectedDate, null);
	};

	vm.createEvent = function(timeSt) {
		vm.selectedDate.setHours(timeSt);
		crudEvEventService.creatingBroadcast(moment(vm.selectedDate), 'DayView');
	};

	vm.dateChanged = function(){
		console.log('date changed', vm.selectedDate);
		getAllEvents(vm.selectedDate, reBuildDailyView);
	};

	// function gets array of event objects and return the one with _id == criteria
	function findById(array, criteria) {
		for(var i = 0; i < array.length; i++)
			if(array[i]._id == criteria)
				return array[i];
		return {};
	}

	function replaceEvent(array, newElement) {
		for(var i = 0; i < array.length; i++) {
			if(array[i]._id == newElement._id)
				array[i] = newElement;
		}
		mapEvents();
	}

	function clearEvents(){
		vm.computedEvents = [];
		var children = $('.day-event-blocks');
		for(i = 0; i < children.length; i++){
			var id = children[i].id;
			document.getElementById(id).parentNode.removeChild(document.getElementById(id));
		}
	}

	//finds simultaneous events and groups it
	function computeEvents() {

		vm.computedEvents = dailyCalendarHelper.findEventsInConflict(vm.todayEvents, vm.selectedDate);
		vm.groups = dailyCalendarHelper.sortEventsToGroups(vm.computedEvents);

	}

	// gets all the events that corre spond to the todays date
	function mapEvents(){
// $('#calendar').css('margin-bottom', 0);
// 	$('#calendar').css('height', '100%');
		clearEvents();
		computeEvents();
		var currentGroup;
		var currentGroupCounter = []; 

		var eventsBlocks = dailyCalendarHelper.generateEventsBlocks(vm.computedEvents);

		for(var i = 0; i < eventsBlocks.length; i++){
			document.getElementById('day-events-place').appendChild(eventsBlocks[i]);
		}

		// take all the events displayed
		var blocks = document.getElementsByClassName('day-event-blocks');

		addDragNDropListeners(blocks);

		addResizeBlockListeners();
	}



	//--------------------RESIZING functions

	var resizeTrackMouseWhenLeaveListener,resizeTopTrackMouseWhenLeaveListener, resizeMouseAwayListener;

	function addResizeBlockListeners() {
		// get an array of all the resize blocks
		var resizeBlocks = document.getElementsByClassName('resize-block');
		//addMouseDownListeners(resizeBlocks, 'bot');

		// in the loop put an event listener for each on mousedown event and handle event on capture event
		for(var n = 0; n < resizeBlocks.length; n++) {
			resizeBlocks[n].addEventListener('mousedown', resizeBlockMouseDownHandler, true);
		}

		var resizeTops = document.getElementsByClassName('resize-block-top');

		//addMouseDownListeners(resizeTops, 'top');


		for(var o = 0; o < resizeTops.length; o++){
			resizeTops[o].addEventListener('mousedown', resizeTopMouseDownHandler, true);
		}
	}

	function resizeBlockMouseDownHandler(e) {
		// stop continueing event handling
		// if comment next line the block can bu drugged while resizing
		e.stopPropagation();

		var self = this;
		// remember parent of the resize block(the event block) so we can update dates after resizing
		var parent = self.parentNode;
		// y coordinate of the mouse
		var mouseY = e.offsetY === undefined ? e.layerY : e.offsetY;

		if(!resizeMouseAwayListener) resizeMouseAwayListener = resizeMouseAway.bind(self);
		if(!resizeTrackMouseWhenLeaveListener) resizeTrackMouseWhenLeaveListener = resizeTrackMouseWhenLeave.bind(self, mouseY);		

		// add event listeners to the resize blocks whicl resizing
		self.addEventListener('mouseup', resizeMouseAway.bind(self));
		self.addEventListener('mouseleave', resizeTrackMouseWhenLeave.bind(self, mouseY));
	}

	function resizeTrackMouseDoc(mouseY, e) {
		var self = this;
		var parent = self.parentNode;
		var parentParent = parent.parentNode;


		var parentHeight = Number(parent.style.height.split('px')[0]);
		var parentTop = Number(parent.style.top.split('px')[0]);
		var parentClientRectHeight = parent.parentNode.getBoundingClientRect().height;

		// new mouse y coordinate
		var changedMouseY = e.offsetY === undefined ? e.layerY : e.offsetY;

		// if we move down
		if(changedMouseY > mouseY)
			// and it is still possible to increase the height of the event block
			if(parentHeight + parentTop < (parentClientRectHeight + 1))
				// we increase it
				parent.style.height = e.clientY - parent.getBoundingClientRect().top + 'px';
		// if we move up
		if(changedMouseY < mouseY){
			// and height is still bigger than one quarter of the hour(15 minutes)
			if(parentHeight > (parentClientRectHeight + 1) / 4 / 24){
				// we set new height to the event block
				parent.style.height = e.clientY - parent.getBoundingClientRect().top + 'px';
			}
		}

		if(parentHeight < (parentClientRectHeight + 1) / 4 / 24)
			parent.style.height = (parentClientRectHeight + 1) * 900000 / viewProps.msInDay + 'px';

		if(parentHeight > (parentClientRectHeight + 1) - parentTop.toPrecision(3))
			parent.style.height = (parentClientRectHeight + 1) - parentTop.toPrecision(3) + 'px';
	}

	var resizeTrackMouseDocListener;

	// function which tracks mouse position and changes dynamically the height of the event block
	function resizeTrackMouseWhenLeave(mouseY, e) {
		if(!resizeTrackMouseDocListener) resizeTrackMouseDocListener = resizeTrackMouseDoc.bind(this, mouseY);

		document.addEventListener('mousemove', resizeTrackMouseDocListener);
		document.addEventListener('mouseleave', resizeMouseAwayListener);
		document.addEventListener('mouseup', resizeMouseAwayListener);
	}

	function resizeTopMouseDownHandler(e) {
		
		// stop continueing event handling
		// if comment next line the block can bu drugged while resizing
		e.stopPropagation();

		var self = this;
		// remember parent of the resize block(the event block) so we can update dates after resizing
		var parent = self.parentNode;
		// y coordinate of the mouse
		var mouseY = e.offsetY === undefined ? e.layerY : e.offsetY;

		if(!resizeMouseAwayListener) resizeMouseAwayListener = resizeMouseAway.bind(self);
		if(!resizeTopTrackMouseWhenLeaveListener) resizeTopTrackMouseWhenLeaveListener = resizeTopTrackMouseWhenLeave.bind(self);

		// add event listeners to the resize blocks whicl resizing
		self.addEventListener('mouseup', resizeMouseAway.bind(self));
		self.addEventListener('mouseleave', resizeTopTrackMouseWhenLeave.bind(self));
	}

	function resizeTopTrackMouseDoc(e) {
		var self = this;
		var parent = self.parentNode;
		var clientY = e.clientY;
		var eventTop = parent.getBoundingClientRect().top;
		var eventHeight = parent.getBoundingClientRect().height;
		var parentParent = parent.parentNode;
		var minHeight = parent.parentNode.getBoundingClientRect().height / 24 / 4;
		var parentTop = Number(parent.style.top.split('px')[0]);

		if(clientY > eventTop) {
			if((clientY - eventTop) > (eventHeight - minHeight)){
				parent.style.height = minHeight + 'px';
				parent.style.top = parentTop + eventHeight - minHeight + 'px';
			} else {
				if(eventHeight > minHeight) {
					parent.style.height = eventHeight - (clientY - eventTop) + 'px';
					parent.style.top = parentTop + (clientY - eventTop) + 'px';
				}
			}
		}

		if(clientY < eventTop){
			if((eventTop - clientY) > parentTop){
				parent.style.height = eventHeight + parentTop + 'px';
				parent.style.top = '0px';
			} else {
				parent.style.height = eventHeight + eventTop - clientY + 'px';
				parent.style.top = parentTop - eventTop + clientY + 'px';
			}
		}
	}

	// function which tracks mouse position and changes dynamically the height of the event block

	var resizeTopTrackMouseDocListener;

	function resizeTopTrackMouseWhenLeave(e) {
		if(!resizeTopTrackMouseDocListener) resizeTopTrackMouseDocListener = resizeTopTrackMouseDoc.bind(this);

		document.addEventListener('mousemove', resizeTopTrackMouseDocListener);
		document.addEventListener('mouseleave', resizeMouseAwayListener);
		document.addEventListener('mouseup', resizeMouseAwayListener);
	}

	var viewProps = {
		calendarHeight: 888,
		msInDay: 86400000,
		msIn5Min: 300000,
		msIn10Min: 600000

		//viewProps.msIn10Min
	};


	function resizeMouseAway() {
		// remove event listeners for tracking mousemove, mouseleave and mouseup so it would not track the mouse after we drop the block
		var self = this;
		var parent = self.parentNode;
		self.removeEventListener('mouseup', resizeMouseAwayListener);
		self.removeEventListener('mouseleave', resizeTopTrackMouseWhenLeaveListener);
		self.removeEventListener('mouseleave', resizeTrackMouseWhenLeaveListener);
		document.removeEventListener('mousemove', resizeTopTrackMouseDocListener);
		document.removeEventListener('mousemove', resizeTrackMouseDocListener);
		document.removeEventListener('mouseleave', resizeMouseAwayListener);
		document.removeEventListener('mouseup', resizeMouseAwayListener);

		resizeMouseAwayListener = null;
		resizeTopTrackMouseWhenLeaveListener = null;
		resizeTrackMouseDocListener = null;
		resizeTopTrackMouseDocListener = null;
		resizeTrackMouseWhenLeaveListener = null;

		var thisEvent = findById(vm.todayEvents, parent.id);
		var oldStart = new Date(thisEvent.start);
		var oldEnd = new Date(thisEvent.end);
		// calculating the newStart date
		var zeroDate = new Date();
		zeroDate.setHours(0, 0, 0, 0);
		var todaysMilSec = viewProps.msInDay * (Number(parent.style.top.split('px')[0])) / viewProps.calendarHeight;
		// if the amount of millisecond can't be divided by five minutes we cut it so it can be
		if(todaysMilSec % viewProps.msIn5Min !== 0)
			todaysMilSec -= todaysMilSec % viewProps.msIn5Min;

		// set top property of the event block to the new values which can be divided by 5 minutes
		
		var newStart = new Date(zeroDate.getTime() + todaysMilSec);
		newStart.setSeconds(0);
		newStart.setMilliseconds(0);

		// calculating new height for the block after resizing
		var newHeight = viewProps.msInDay * Number(parent.style.height.split('px')[0]) / viewProps.calendarHeight;
		// if now the duration of the event(height of the block) can't be divided by 5 minutes, make it dividible
		if(newHeight % viewProps.msIn5Min !== 0) newHeight -= newHeight % viewProps.msIn5Min;
		// if duration is 10 minutes make it 15 minutes, cause 10 is too short
		if(newHeight === viewProps.msIn10Min) newHeight += viewProps.msIn5Min;
		// set the height of the corrsponding event block to the new duration
		parent.style.height = viewProps.calendarHeight * newHeight / viewProps.msInDay + 'px';
		parent.style.top =  viewProps.calendarHeight * todaysMilSec / viewProps.msInDay + 'px';
		// calculate new event end on the base of start and duration
		var newEnd = new Date(newStart.getTime() + newHeight);
		// remove seconds and mls
		newEnd.setSeconds(0);
		newEnd.setMilliseconds(0);
		newStart.setFullYear(oldStart.getFullYear(), oldStart.getMonth(), oldStart.getDate());
		newEnd.setFullYear(oldEnd.getFullYear(), oldEnd.getMonth(), oldEnd.getDate());

		// create object to send to the server with new dates
		var newElement = {
			start: newStart,
			end: newEnd
		};
		// update dates for event
		helpEventService.updateEventStartEnd(parent.id,newElement).then(function(response) {
	        if (response.status == 200){
	            thisEvent.start = newStart;
				thisEvent.end = newEnd;
				replaceEvent(vm.todayEvents, thisEvent);
				Notification.success({message: 'newStart: ' + newStart + ';\nnewEnd: ' + newEnd });
	        } else {
	        	mapEvents();
	        	Notification.warning({message: response.data });
	        }
	    });
	}

	//-------------------


	//-----------------------DRAG'n'DROP functions

	function addDragNDropListeners(eventBlocks) {
		for(var i = 0; i < eventBlocks.length; i++) {
			eventBlocks[i].addEventListener('mousedown', DragNDropEventHandler);
		}
	}

	function DragNDropEventHandler(e) {
		var self = this;

		// get Y value of the mouse 
		self.mouseY = e.offsetY === undefined ? e.layerY : e.offsetY;

		// set block z-index to 10 so it is upper than others and you can't touch them while dragging
		self.style.zIndex = '10';

		//if secondary button pressed - editing
		if (e.button == 2){
			crudEvEventService.editingBroadcast(new Date(), findById(vm.todayEvents, self.id), 'DayView');
			return false;
		} else {
			//add event listeners while dragging for tracking mouse and updating dates if mouse leave block or mouse is up
			self.addEventListener.apply(self, ['mousemove', trackMouse]);
			self.addEventListener.apply(self, ['mouseup', mouseAway]);
			self.addEventListener.apply(self, ['mouseleave', mouseAway]);
		}
	}


	// function which is called when mouse leaves the event block on dragging, or simply drops it
	function mouseAway(){
		var resizeBlocks = self.getElementsByClassName('resize-block')[0];

		self = this;
		resizeBlocks.style.display = 'none';

		// remove event listeners for tracking mousemove, mouseleave and mouseup so it would not track the mouse after we drop the block
		self.removeEventListener('mousemove', trackMouse);
		self.removeEventListener('mouseup', mouseAway);
		self.removeEventListener('mouseleave', mouseAway);

		// return resize block to normal view
		resizeBlocks.style.display = 'block';
		// put event block to the same levels as others
		self.style.zIndex = '0';

		// create date that is equal to the beginnig of the day
		var zeroDate = new Date();
		zeroDate.setHours(0, 0, 0, 0);
		// calculate amount of milliseconds that is between the beginning of the day and new event start
		var todaysMilSec = viewProps.msInDay * (Number(self.style.top.split('px')[0])) / viewProps.calendarHeight;

		// if the amount of millisecond can't be divided by five minutes we cut eat so it can be
		if(todaysMilSec % viewProps.msIn5Min !== 0)
			todaysMilSec -= todaysMilSec % viewProps.msIn5Min;

		// set top property of the event block to the new values which can be divided by 5 minutes
		self.style.top =  viewProps.calendarHeight * todaysMilSec / viewProps.msInDay + 'px';
		// create newStart date which will be sent to the server after event drop
		var newStart = new Date(zeroDate.getTime() + todaysMilSec);
		// set seconds and milliseconds of the event to 0
		newStart.setSeconds(0);
		newStart.setMilliseconds(0);
		// get event from the array to calculate its true duration
		var thisEvent = findById(vm.todayEvents, self.id);
		var oldStart = new Date(thisEvent.start);
		var oldEnd = new Date(thisEvent.end);
		// calculating events end by the sum of start and calculated duration
		var newEnd = new Date(newStart.getTime() + (oldEnd.getTime() - oldStart.getTime()));
		newStart.setFullYear(oldStart.getFullYear(), oldStart.getMonth(), oldStart.getDate());
		newEnd.setFullYear(oldEnd.getFullYear(), oldEnd.getMonth(), oldEnd.getDate());
		
		//object to send to the server for update
		var newElement = {
			start: newStart,
			end: newEnd
		};
		// send new dates to the server for uodating
		helpEventService.updateEventStartEnd(self.id,newElement).then(function(response) {
	        if (response.status == 200){
	            thisEvent.start = newStart;
				thisEvent.end = newEnd;
				replaceEvent(vm.todayEvents, thisEvent);
				Notification.success({message: 'newStart: ' + newStart + ';\nnewEnd: ' + newEnd });
			} else {
	        	mapEvents();
	        	Notification.warning({message: response.data });
	        }
	    });
	}
	//function to track mouse y coordinate changes
	function trackMouse(e){
		self = this;
		// y coordinate of the moue after moving
		var changedMouseY = e.offsetY === undefined ? e.layerY : e.offsetY;
		// current top value of the event blocks converted to number
		var topValue = self.style.top.split('px');
		topValue = Number(topValue[0]);

		var heightValue = Number(self.style.height.split('px')[0]);

		// if mouse moved down
		if (topValue + ((topValue + changedMouseY) - (topValue + self.mouseY)) > topValue)
			// if event didn't reach the bottom of the table and we can asign it new top value which is bigger than previous
			// de facto, we move can move block down
			if (topValue < ((viewProps.calendarHeight - heightValue).toPrecision(3))){
				// and we do it
				self.style.top = topValue + ((topValue + changedMouseY) - (topValue + self.mouseY))  + 'px';
			}

		// if mouse moved up
		if ((topValue + ((topValue + changedMouseY) - (topValue + self.mouseY))) < topValue)
			// if event didn't reach the top of the table and we can asign top value smaller than previous
			// de facte, we can move block up
			if (topValue > 0)
				// and we do it
				self.style.top = topValue + ((topValue + changedMouseY) - (topValue + self.mouseY))  + 'px';

		// if block is moved upper than upper boundary we move it to possible top value
		// other words if someone moved mouse very fast and it it's top value became -10px
		if (topValue < 0)
			// we set it to 0
			self.style.top = '0px';

		// if block is moved lower than lower boundary we move it to possible top value
		// other words if someone moved mouse very fast and it it's top value became 900px
		if (topValue > ((viewProps.calendarHeight - heightValue).toPrecision(3)))
			// we set it to the (height of the table - height of the event) possible top value
			self.style.top = viewProps.calendarHeight - heightValue.toPrecision(3) + 'px';
	}

	//-----------------------------

	function getAllEvents(selectedDate, cb) {
		date = selectedDate || new Date();
		start = new Date(date);
		start.setDate(start.getDate() - 2);

		end = new Date(date);
		end.setDate(end.getDate() +2);

		console.log('getAllEvents: Start', start);
		console.log('getAllEvents: End', end);

		console.log('pulling data, scheduleType: ', scheduleService.getType());
        console.log('pulling data, scheduleType: ', scheduleService.getItemId());
        switch (scheduleService.getType()){
            case 'event':{
                helpEventService.getUserEvents(start, end).then(function(data) {
                    if (data !== null){ 
                        vm.allEvents = data;

			            if (cb){
			            	cb();
			            } 
                    }
                });
                console.log('user events shedule');
                break;
            }
            case 'room':{
                helpEventService.getRoomEvents(scheduleService.getItemId(), start, end).then(function(data) {
                    if (data !== null){ 
                        vm.allEvents = data;
			            if (cb){
			            	cb();
			            } 
                    }
                });
                console.log('room events shedule');
                break;
            }
            case 'device':{
                helpEventService.getDeviceEvents(scheduleService.getItemId(), start, end).then(function(data) {
                   if (data !== null){ 
                        vm.allEvents = data;
			            if (cb){
			            	cb();
			            } 
                    }
                });
                console.log('device events shedule');
                break;
            }
            
        }

	}

	function filterEventsByTodayDate() {
		vm.todayEvents = vm.allEvents.filter(function(event) {
			//if(event.start) {
			var date = new Date(event.start);
			if(date.getDate() != vm.selectedDate.getDate()){
				return false;
			} else{
				for (j = 0; j < vm.actualEventTypes.length; j++){
					if (event.type._id === vm.actualEventTypes[j].id){
						return true;
					}
				}
				return false;		
			}
			//}
		});
	}

	function reBuildDailyView() {
		filterEventsByTodayDate();
		mapEvents();
	}

	init();

	function init() {
		//showWorkHours();

		vm.actualEventTypes = filterService.getActualEventTypes();

		vm.timeStamps = helpEventService.getTimeStampsDaily();
		vm.dpFormat = "dd MMMM yyyy";
		vm.computedEvents = [];
		vm.selectedDate = vm.selectedDate || new Date();		

		console.log($stateParams);
		vm.selectedDate = new Date();

		if(Object.keys($stateParams).length !== 0) {
			console.log('setting from state params');
			vm.selectedDate.setYear($stateParams.year);
			vm.selectedDate.setDate($stateParams.day);
			vm.selectedDate.setMonth($stateParams.month - 1);		

			if($stateParams.day === '31') {
				vm.selectedDate.setDate(31);
			}	
		}



		getAllEvents(vm.selectedDate, reBuildDailyView);
	}
}