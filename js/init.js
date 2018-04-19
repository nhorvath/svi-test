$(window).ready(function() {
	angular.module('myApp', ['services', 'directives', 'filters'])
		.controller('main', function($scope){
		});

	angular.bootstrap($('#client-components'), ['myApp']);

});