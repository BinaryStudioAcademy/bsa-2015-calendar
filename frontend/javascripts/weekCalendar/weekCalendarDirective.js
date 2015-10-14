var app = require('../app');


app.directive("testDiv", function () {
    return {
        restrict: 'E',  
        replace: true,
        // template: '    <ul.list-inline.text-center>\
        //                   <li>\
        //                     <span> {{wCtrl.Start | date: \'d MMM yyyy\'}} ----- {{wCtrl.End | date: \'d MMM yyyy\'}}',

		templateUrl: "templates/weekCalendar/directiveTest.html"





		// link: function (scope, element, attrs) {
		// 	console.log('dhdfb');
		// }

				// restrict: 'E',
				// restrict: 'AE',
				// replace: false,

    };
});



