var app = require('../app');


app.directive("navMain", function () {
    return {
        restrict: 'E',  
        replace: true,
				templateUrl: "templates/directive/navigation/navDirective.html"
    };
});