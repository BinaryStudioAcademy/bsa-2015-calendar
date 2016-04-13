var app = require('../app');

app.directive('ngDropdownMultiselectDisabled', function() {
  return {
    restrict: 'A',
    controller: function($scope, $element, $attrs) {
      var $btn;
      $btn = $element.find('button');
      return $scope.$watch($attrs.ngDropdownMultiselectDisabled, function(newVal) {
        return $btn.attr('disabled', newVal);
      });
    }
  };
});