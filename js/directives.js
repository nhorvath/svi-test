
angular.module('directives', [])
	.directive('sviBtcGainLoss', ['blockchain', function(blockchain){
	return {
		restrict: 'EA',
		templateUrl: 'templates/sviBtcGainLoss.tpl.html',
		scope: {
			'wallet': '@'
		},
		controller: function ($scope, $attrs, $element) {
			$scope.data = [];
			$scope.totals = null;
			$scope.marketPrice = 0;

			var calculatePrices = function () {
				$scope.totals = {
					qty: 0,
					cost: 0,
					marketValue: 0,
					gainLoss: 0
				};

				for (var i=0,l=$scope.data.length; i<l; i++) {
					$scope.totals.qty += $scope.data[i].qty;
					$scope.totals.cost += $scope.data[i].cost;
					if ($scope.marketPrice) {
						$scope.totals.marketValue += $scope.data[i].marketValue = $scope.data[i].qty * $scope.marketPrice;
						$scope.totals.gainLoss += $scope.data[i].gainLoss = $scope.data[i].marketValue - $scope.data[i].cost;
					} else {
						$scope.data[i].marketValue = '-';
						$scope.data[i].gainLoss = '-';
					}
				}
			};

			blockchain.getTransactions('1AJbsFZ64EpEfS5UAjAfcUG8pH8Jn3rn1F').then(function (data) {
				$scope.data = data;
				calculatePrices();
			});

			blockchain.getMarketPrice('2018-03-12').then(function (value) {
				$scope.marketPrice = value;
			});

			$scope.$watch('marketPrice', calculatePrices);
		}
	};
}]);