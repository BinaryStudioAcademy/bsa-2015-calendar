var app = require('../../app');

app.directive("navMenu", function () {
    return {
        restrict: 'E',  
        replace: true,
				templateUrl: "templates/directives/navigationSidebar/navDirectiveTemplate.html",
				controller: 'NavDirectiveController',
				controllerAs: 'navCtrl',				
    };
});
