$(window).ready(function() {
	appConfig = {
		accounList: ['12345678']
	};
	angular.module('myApp', ['services', 'directives'])
		.controller('main', function($scope){
			$scope.todo = [
				{name: 'Create a custom directive', completed: true},
				{name: 'Learn about restrict', completed: true},
				{name: 'Master scopes', completed: false}
			];
		});

	angular.bootstrap($('#client-components'), ['myApp']);

});