
angular.module('directives', [])
	.directive('sviBtcGainLoss', ['blockchain', function(blockchain){
	return {
		restrict: 'EA',
		templateUrl: 'templates/sviBtcGainLoss.tpl.html',
		scope: {
			'wallet': '@'
		},
		controller: function ($scope, $attrs, $element) {
			$scope.wallet = $attrs.wallet || '1DziZ1ZQwUb9RD17tfx4zEECTforjzimu2';

			$scope.data = [];
			$scope.totals = {
				qty: 0,
				cost: 0,
				marketValue: 0,
				gainLoss: 0
			};
			$scope.marketPrice = 0;

			var calculatePrices = function () {
				for (var i=0,l=$scope.data.length; i<l; i++) {
					if ($scope.marketPrice) {
						$scope.data[i].marketValue = $scope.data[i].qty * $scope.marketPrice;
						$scope.data[i].gainLoss = $scope.data[i].marketValue - $scope.data[i].cost;
					} else {
						$scope.data[i].marketValue = '-';
						$scope.data[i].gainLoss = '-';
					}
				}
			};

			$scope.$watch('wallet', function() {
				blockchain.getTransactions($scope.wallet).then(function (data) {
					$scope.data = data;
					calculatePrices();
				});
			});

			blockchain.getMarketPrice().then(function (value) {
				$scope.marketPrice = value;
			});

			$scope.$watch('marketPrice', calculatePrices);
		}
	};
}]);