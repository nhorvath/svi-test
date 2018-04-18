$(window).ready(function() {
	angular.module('myApp', ['services', 'directives'])
		.controller('main', function($scope){
		});

	angular.bootstrap($('#client-components'), ['myApp']);

});