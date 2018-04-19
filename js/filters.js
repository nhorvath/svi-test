// stub for filters
angular.module('filters', [])
	.filter('myFilter', function() {
		return function(input) {
			return input;
		}
	});