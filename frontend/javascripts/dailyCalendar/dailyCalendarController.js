var app = require('../app');

app.controller('DayViewController', DayViewController);

DayViewController.$inject = ['Notification', 'AuthService', '$scope', 'crudEvEventService', '$timeout', '$q', '$uibModal', 'socketService', 'helpEventService'];

function DayViewController(Notification, AuthService, $scope, crudEvEventService, $timeout, $q, $uibModal, socketService, helpEventService) {

	var vm = this;

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
 		getAllEvents(vm.selectedDate, reBuildDailyView);
    });
 
    $scope.$on('editedEventDayView', function(event, selectedDate, oldEventBody, newEventBody){
    	console.log('event edited recieved');
 		getAllEvents(vm.selectedDate, reBuildDailyView);
    });
	
    document.addEventListener('contextmenu', function(e){
		e.preventDefault();
	});

	vm.timeStamps = helpEventService.getTimeStampsDaily();

	vm.computedEvents = [];
	vm.selectedDate = vm.selectedDate || new Date();

	vm.showDay = function(step) {
		var date = new Date(vm.selectedDate);
		date.setDate(
			step === 1 ?
				date.getDate() + 1
					:
				date.getDate() - 1
		);
		vm.selectedDate = date;
		reBuildDailyView(vm.selectedDate, null);
		getAllEvents();
	};

	vm.createEvent = function(timeSt) {
		console.log(timeSt);
		vm.selectedDate.setHours(timeSt);
		console.log(vm.selectedDate);
		crudEvEventService.creatingBroadcast(moment(vm.selectedDate), 'DayView');
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
	}

	function clearEvents(){
		vm.computedEvents = [];
		var children = $('.day-event-blocks');
		for(i = 0; i < children.length; i++){
			var id = children[i].id;
			document.getElementById(id).parentNode.removeChild(document.getElementById(id));
		}
	}

	function computingEvents() {
		//computing top and height values for all geted events
		for (var i = 0; i < vm.todayEvents.length; i++) {
			// temp - object to save top and height values for further event displaying
			var temp = {};
			var eventEnd = new Date(vm.todayEvents[i].end);
			var eventStart = new Date(vm.todayEvents[i].start);
			temp.eventAsItIs = vm.todayEvents[i];
			// calculate height value(888 is the height of the table; 86400000 amount of milliseconds in the 24 hours)
			temp.heightVal = 888 * (eventEnd.getTime() - eventStart.getTime()) / 86400000;

			var now = vm.selectedDate;
			now.setHours(0,0,0,0);
			// calculate top value as difference between event start and beginning of the day
			temp.topVal = 888 * (eventStart.getTime() - now.getTime()) / 86400000;
			// save computed values to the array
			vm.computedEvents.push(temp);
		}
	}

	// gets all the events that corre spond to the todays date
	function mapEvents(){
		$('#calendar').css('margin-bottom', 0);
		clearEvents();
		computingEvents();
		//creating and appending blocks which display events for today
		for(var c = 0; c < vm.computedEvents.length; c++) {

			// block is the div which represents the whole event
			// resizeBlock is a little block in the bottom of event block which is created for resizeing event
			// paragraph - small block which appears on event hover and contain title of the event
			var block = document.createElement('div');
			var resizeBottom = document.createElement('div');
			var resizeTop = document.createElement('div');
			var paragraph = document.createElement('div');
			var icon = document.createElement('div');

			// setting content, class as styles for paragraph
			paragraph.innerHTML = vm.computedEvents[c].eventAsItIs.description;
			paragraph.className = 'event-info';
			paragraph.style.width = '80%';
			paragraph.style.float = 'left';	
			paragraph.style.opacity = '1';
			paragraph.style.color = 'black';
			paragraph.style.display = 'none';

			// setting computed top and height values for event block, and id so in the future we could use it for updating dates
			block.className = 'day-event-blocks';
			block.innerHTML = vm.computedEvents[c].eventAsItIs.title;
			block.style['font-weight'] = 900;
			block.style['text-align'] = 'center';
			block.style['font-color'] = 'black';
			block.style.height = vm.computedEvents[c].heightVal.toPrecision(3) + 'px';
			block.style.top = vm.computedEvents[c].topVal.toPrecision(4) + 'px';
			block.id = vm.computedEvents[c].eventAsItIs._id;
			if(vm.computedEvents[c].eventAsItIs.type.color){
				block.style.background = vm.computedEvents[c].eventAsItIs.type.color;
			} else {
				block.style.background = 'grey';
			}

			// if(!vm.computedEvents[c].eventAsItIs.type.icon.css){
			// 	icon.className = vm.computedEvents[c].eventAsItIs.type.icon.css;
			// 	icon.style.width = '10%';
			// 	icon.style.float = 'left';
			// 	paragraph.appendChild(icon);
			// }			
			// setting styles for resize block
			resizeBottom.style.width = '100%';
			resizeBottom.style.bottom = '-5px';
			resizeBottom.style.height = '10px';
			resizeBottom.style.cursor = 's-resize';
			resizeBottom.style.zIndex = '11';
			resizeBottom.style.position = 'absolute';
			resizeBottom.className = 'resize-block';

			resizeTop.style.width = '100%';
			resizeTop.style.top = '-5px';
			resizeTop.style.height = '10px';
			resizeTop.style.cursor = 's-resize';
			resizeTop.style.zIndex = '11';
			resizeTop.style.position = 'absolute';
			resizeTop.className = 'resize-block-top';

			// appending paragraph and resize block inside event block and appending it to the table of hours
			block.appendChild(paragraph);
			block.appendChild(resizeBottom);
			block.appendChild(resizeTop);
			document.getElementById('day-events-place').appendChild(block);
		}

		// take all the events displayed
		var blocks = document.getElementsByClassName('day-event-blocks');
		// and in the loop put for all of the event listeners for 'mousedown' event
		for(var k = 0; k < blocks.length; k++) {
			blocks[k].addEventListener('mousedown', function(e) {
				var self = this;
				// get Y value of the mouse 
				self.mouseY = e.offsetY === undefined ? e.layerY : e.offsetY;
				// set block z-index to 10 so it is upper than others and you can't touch them whil dragging
				self.style.zIndex = '10';
				// set resize block display to none so it can't do any problens for us while drugging
				

				if (e.button == 2){
					crudEvEventService.editingBroadcast(new Date(), findById(vm.todayEvents, self.id), 'DayView');
					//e.stopPropagation();
					//e.preventDefault();
					return false;
				} else {
					// add event listeners while dragging for tracking mouse and updating dates if mouse leave block or mouse is up
					self.addEventListener.apply(self, ['mousemove', trackMouse]);
					self.addEventListener.apply(self, ['mouseup', mouseAway]);
					self.addEventListener.apply(self, ['mouseleave', mouseAway]);
				}

			});
			// add event listener which move block with the title of the event on the block when you hover the event block
			blocks[k].addEventListener('mouseover', function(){
				this.getElementsByClassName('event-info')[0].style.marginTop = '-' + this.getElementsByClassName('event-info')[0].offsetHeight + 'px';
			});
		}

		// get an array of all the resize blocks
		var resizeBlocks = document.getElementsByClassName('resize-block');
		// in the loop put an event listener for each on mousedown event and handle event on capture event
		for(var n = 0; n < resizeBlocks.length; n++) {
			resizeBlocks[n].addEventListener('mousedown', function(e) {
				// stop continueing event handling
				// if comment next line the block can bu drugged while resizing
				e.stopPropagation();

				var self = this;
				// remember parent of the resize block(the event block) so we can update dates after resizing
				var parent = self.parentNode;
				// y coordinate of the mouse
				var mouseY = e.offsetY === undefined ? e.layerY : e.offsetY;

				// method that handles when you leave resize block or make mouseup
				function resizeMouseAway() {
					// remove event listeners for tracking mousemove, mouseleave and mouseup so it would not track the mouse after we drop the block
					self.removeEventListener('mouseup', resizeMouseAway);
					self.removeEventListener('mouseleave', resizeTrackMouseWhenLeave);
					document.removeEventListener('mousemove', resizeTrackMouseDoc);
					document.removeEventListener('mouseleave', resizeMouseAway);
					document.removeEventListener('mouseup', resizeMouseAway);

					var thisEvent = findById(vm.todayEvents, parent.id);
					var oldStart = new Date(thisEvent.start);
					var oldEnd = new Date(thisEvent.end);
					// calculating the newStart date
					var zeroDate = new Date();
					zeroDate.setHours(0, 0, 0, 0);
					var todaysMilSec = 86400000 * (Number(parent.style.top.split('px')[0])) / 888;
					var newStart = new Date(zeroDate.getTime() + todaysMilSec);
					newStart.setSeconds(0);
					newStart.setMilliseconds(0);

					// calculating new height for the block after resizing
					var newHeight = 86400000 * Number(parent.style.height.split('px')[0]) / 888;
					// if now the duration of the event(height of the block) can't be divided by 5 minutes, make it dividible
					if(newHeight % 300000 !== 0) newHeight -= newHeight % 300000;
					// if duration is 10 minutes make it 15 minutes, cause 10 is too short
					if(newHeight === 600000) newHeight += 300000;
					// set the height of the corrsponding event block to the new duration
					parent.style.height = 888 * newHeight / 86400000 + 'px';
					// calculate new event end on the base of start and duration
					var newEnd = new Date(newStart.getTime() + newHeight);
					// remove seconds and mls
					newEnd.setSeconds(0);
					newEnd.setMilliseconds(0);
					newStart.setFullYear(oldStart.getFullYear(), oldStart.getMonth(), oldStart.getDate());
					newEnd.setFullYear(oldEnd.getFullYear(), oldEnd.getMonth(), oldEnd.getDate());
					Notification.success({message: 'newStart: ' + newStart + ';\nnewEnd: ' + newEnd });
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
				        }
				    });
				}

				function resizeTrackMouseDoc(e) {
					// new mouse y coordinate
					var changedMouseY = e.offsetY === undefined ? e.layerY : e.offsetY;

					// if we move down
					if(changedMouseY > mouseY)
						// and it is still possible to increase the height of the event block
						if(Number(parent.style.height.split('px')[0]) + Number(parent.style.top.split('px')[0]) < (parent.parentNode.getBoundingClientRect().height + 1))
							// we increase it
							parent.style.height = e.clientY - parent.getBoundingClientRect().top + 'px';
					// if we move up
					if(changedMouseY < mouseY){
						// and height is still bigger than one quarter of the hour(15 minutes)
						if(Number(parent.style.height.split('px')[0]) > (parent.parentNode.getBoundingClientRect().height + 1) / 4 / 24){
							// we set new height to the event block
							parent.style.height = e.clientY - parent.getBoundingClientRect().top + 'px';
						}
					}

					if(Number(parent.style.height.split('px')[0]) < (parent.parentNode.getBoundingClientRect().height + 1) / 4 / 24)
						parent.style.height = (parent.parentNode.getBoundingClientRect().height + 1) * 900000 / 86400000 + 'px';

					if(Number(parent.style.height.split('px')[0]) > (parent.parentNode.getBoundingClientRect().height + 1) - Number(parent.style.top.split('px')[0]).toPrecision(3))
						parent.style.height = (parent.parentNode.getBoundingClientRect().height + 1) - Number(parent.style.top.split('px')[0]).toPrecision(3) + 'px';
				}

				// function which tracks mouse position and changes dynamically the height of the event block
				function resizeTrackMouseWhenLeave(e) {
					document.addEventListener('mousemove', resizeTrackMouseDoc);
					document.addEventListener('mouseleave', resizeMouseAway);
					document.addEventListener('mouseup', resizeMouseAway);
				}

				// add event listeners to the resize blocks whicl resizing
				self.addEventListener('mouseup', resizeMouseAway);
				self.addEventListener('mouseleave', resizeTrackMouseWhenLeave);
			}, true);
		}

		var resizeTops = document.getElementsByClassName('resize-block-top');

		for(var o = 0; o < resizeTops.length; o++){
			resizeTops[o].addEventListener('mousedown', function(e) {
				// stop continueing event handling
				// if comment next line the block can bu drugged while resizing
				e.stopPropagation();

				var self = this;
				// remember parent of the resize block(the event block) so we can update dates after resizing
				var parent = self.parentNode;
				// y coordinate of the mouse
				var mouseY = e.offsetY === undefined ? e.layerY : e.offsetY;

				// method that handles when you leave resize block or make mouseup
				function resizeMouseAway() {
					// remove event listeners for tracking mousemove, mouseleave and mouseup so it would not track the mouse after we drop the block
					self.removeEventListener('mouseup', resizeMouseAway);
					self.removeEventListener('mouseleave', resizeTrackMouseWhenLeave);
					document.removeEventListener('mousemove', resizeTrackMouseDoc);
					document.removeEventListener('mouseleave', resizeMouseAway);
					document.removeEventListener('mouseup', resizeMouseAway);

					var thisEvent = findById(vm.todayEvents, parent.id);
					var oldStart = new Date(thisEvent.start);
					var oldEnd = new Date(thisEvent.end);
					// calculating the newStart date
					var zeroDate = new Date();
					zeroDate.setHours(0, 0, 0, 0);
					var todaysMilSecStart = 86400000 * (Number(parent.style.top.split('px')[0])) / 888;
					// if the amount of millisecond can't be divided by five minutes we cut eat so it can be
					if(todaysMilSecStart % 300000 !== 0)
						todaysMilSecStart -= todaysMilSecStart % 300000;

					// set top property of the event block to the new values which can be divided by 5 minutes
					
					var newStart = new Date(zeroDate.getTime() + todaysMilSecStart);
					newStart.setSeconds(0);
					newStart.setMilliseconds(0);

					// calculating new height for the block after resizing
					var newHeight = 86400000 * Number(parent.style.height.split('px')[0]) / 888;
					// if now the duration of the event(height of the block) can't be divided by 5 minutes, make it dividible
					if(newHeight % 300000 !== 0) newHeight += (300000 - newHeight % 300000);
					// if duration is 10 minutes make it 15 minutes, cause 10 is too short
					if(newHeight === 600000) newHeight += 300000;
					// set the height of the corrsponding event block to the new duration
					parent.style.height = 888 * newHeight / 86400000 + 'px';
					parent.style.top =  888 * todaysMilSecStart / 86400000 + 'px';
					// calculate new event end on the base of start and duration
					var newEnd = new Date(newStart.getTime() + newHeight);
					// remove seconds and mls
					newEnd.setSeconds(0);
					newEnd.setMilliseconds(0);
					newStart.setFullYear(oldStart.getFullYear(), oldStart.getMonth(), oldStart.getDate());
					newEnd.setFullYear(oldEnd.getFullYear(), oldEnd.getMonth(), oldEnd.getDate());
					Notification.success({message: 'newStart: ' + newStart + ';\nnewEnd: ' + newEnd });
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
				        }
				    });
				}

				function resizeTrackMouseDoc(e) {
					var clientY = e.clientY;
					var eventTop = parent.getBoundingClientRect().top;
					var eventHeight = parent.getBoundingClientRect().height;
					var minHeight = parent.parentNode.getBoundingClientRect().height / 24 / 4;

					if(clientY > eventTop) {
						if((clientY - eventTop) > (eventHeight - minHeight)){
							parent.style.height = minHeight + 'px';
							parent.style.top = Number(parent.style.top.split('px')[0]) + eventHeight - minHeight + 'px';
						} else {
							if(eventHeight > minHeight) {
								parent.style.height = eventHeight - (clientY - eventTop) + 'px';
								parent.style.top = Number(parent.style.top.split('px')[0]) + (clientY - eventTop) + 'px';
							}
						}
					}

					if(clientY < eventTop){
						if((eventTop - clientY) > Number(parent.style.top.split('px')[0])){
							parent.style.height = eventHeight + Number(parent.style.top.split('px')[0]) + 'px';
							parent.style.top = '0px';
						} else {
							parent.style.height = eventHeight + eventTop - clientY + 'px';
							parent.style.top = Number(parent.style.top.split('px')[0]) - eventTop + clientY + 'px';
						}
					}
				}

				// function which tracks mouse position and changes dynamically the height of the event block
				function resizeTrackMouseWhenLeave(e) {
					document.addEventListener('mousemove', resizeTrackMouseDoc);
					document.addEventListener('mouseleave', resizeMouseAway);
					document.addEventListener('mouseup', resizeMouseAway);
				}

				// add event listeners to the resize blocks whicl resizing
				self.addEventListener('mouseup', resizeMouseAway);
				self.addEventListener('mouseleave', resizeTrackMouseWhenLeave);
			}, true);
		}
		console.log('after builidng', document.getElementsByClassName('day-event-blocks'));
	}

	// function which is called when mouse leave the event block on dragging, or simply drops it
	function mouseAway(){
		self = this;
		self.getElementsByClassName('resize-block')[0].style.display = 'none';
		// remove event listeners for tracking mousemove, mouseleave and mouseup so it would not track the mouse after we drop the block
		self.removeEventListener('mousemove', trackMouse);
		self.removeEventListener('mouseup', mouseAway);
		self.removeEventListener('mouseleave', mouseAway);
		// return resize block to normal view
		self.getElementsByClassName('resize-block')[0].style.display = 'block';
		// put event block to the same levels as others
		self.style.zIndex = '0';

		// create date that is equal to the beginnig of the day
		var zeroDate = new Date();
		zeroDate.setHours(0, 0, 0, 0);
		// calculate amount of milliseconds that is between the beginning of the day and new event start
		var todaysMilSec = 86400000 * (Number(self.style.top.split('px')[0])) / 888;

		// if the amount of millisecond can't be divided by five minutes we cut eat so it can be
		if(todaysMilSec % 300000 !== 0)
			todaysMilSec -= todaysMilSec % 300000;

		// set top property of the event block to the new values which can bi divided by 5 minutes
		self.style.top =  888 * todaysMilSec / 86400000 + 'px';
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
		Notification.success({message: 'newStart: ' + newStart + ';\nnewEnd: ' + newEnd });
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
	        }
	    });
	}
	// function to track mouse y coordinate changes
	function trackMouse(e){
		self = this;
		// y coordinate of the moue after moving
		var changedMouseY = e.offsetY === undefined ? e.layerY : e.offsetY;
		// current top value of the event blocks converted to number
		var topValue = self.style.top.split('px');
		topValue = Number(topValue[0]);

		// if mouse moved down
		if ((topValue + ((topValue + changedMouseY) - (topValue + self.mouseY))) > Number(self.style.top.split('px')[0]))
			// if event didn't reach the bottom of the table and we can asign it new top value which is bigger than previous
			// de facto, we move can move block down
			if (Number(self.style.top.split('px')[0]) < ((888 - Number(self.style.height.split('px')[0])).toPrecision(3))){
				// and we do it
				self.style.top = topValue + ((topValue + changedMouseY) - (topValue + self.mouseY))  + 'px';
			}

		// if mouse moved up
		if ((topValue + ((topValue + changedMouseY) - (topValue + self.mouseY))) < Number(self.style.top.split('px')[0]))
			// if event didn't reach the top of the table and we can asign top value smaller than previous
			// de facte, we can move block up
			if (Number(self.style.top.split('px')[0]) > 0)
				// and we do it
				self.style.top = topValue + ((topValue + changedMouseY) - (topValue + self.mouseY))  + 'px';

		// if block is moved upper than upper boundary we move it to possible top value
		// other words if someone moved mouse very fast and it it's top value became -10px
		if (Number(self.style.top.split('px')[0]) < 0)
			// we set it to 0
			self.style.top = '0px';

		// if block is moved lower than lower boundary we move it to possible top value
		// other words if someone moved mouse very fast and it it's top value became 900px
		if (Number(self.style.top.split('px')[0]) > ((888 - Number(self.style.height.split('px')[0])).toPrecision(3)))
			// we set it to the (height of the table - height of the event) possible top value
			self.style.top = 888 - Number(self.style.height.split('px')[0]).toPrecision(3) + 'px';
	}

	function getAllEvents(selectedDate, cb) {
		date = selectedDate || new Date();
		start = new Date();
		start.setDate(date.getDate() -2);
		end = new Date();
		end.setDate(date.getDate() +2);
		console.log('start end', start, end);
		helpEventService.getUserEvents(start, end).then(function(response) {
	        if (response){
	            vm.allEvents = response;
	            if (cb){
	            	cb();
	            } 
	        }
	        else {
	        	console.log('failure');
	        }
	    });
	}

	function filterEventsByTodayDate() {
		console.log('events in filter', vm.allEvents);
		vm.todayEvents = vm.allEvents.filter(function(event) {
			if(event.start) {
				var date = new Date(event.start);
				return date.getDate() === vm.selectedDate.getDate();
			}
		});
		console.log('events after filter', vm.allEvents);
	}
	function showWorkHours() {
		
	}

	function reBuildDailyView() {
		filterEventsByTodayDate();
		mapEvents();
	}

	init();

	function init() {
		//showWorkHours();	
		getAllEvents(new Date(), reBuildDailyView);
	}
}