var app = require('../app');

app.directive('popUpWindow', function () {
	return {
		restrict: 'E',
		scope: {
			show: '='
		},
		replace: true,
		transclude: true,
		link: function(scope, element, attrs) {

			scope.dialogStyle = {};

			if (attrs.width) {
				scope.dialogStyle.width = attrs.width;
			}
			if (attrs.height) {
				scope.dialogStyle.height = attrs.height;
			}
			scope.hideModal = function() {
				scope.show = false;
			};
		},

		templateUrl: 'templates/createEvent/popupDirectiveTemplate.html'
	};
});