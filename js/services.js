
angular.module('services', [])
	.service('blockchain', ['$http', '$q', function($http, $q){
		var VALUE_CONV = 100000000;
		var TIMESTAMP_CONV = 1000;
		var self = this;
		/**
		 * Takes a wallet address and retrieves transactions from
		 * https://blockchain.info/rawaddr/[address]
		 */
		self.getTransactions = function(address) {
			var defer = $q.defer();

			var url = 'proxy.php?service=blockchain-address&address=' + address;
			$http.get(url).then(function (data) {
				if (data.status == 200 && data.hasOwnProperty('data')) {
					var transactions = [];
					var promises = [];
					if (data.data.n_tx > 0) {
						var txn = null, j=0, l2=0, temp = null;
						for (var i=0,l=data.data.txs.length; i<l; i++) {
							txn = data.data.txs[i];
							for (j=0, l2=txn.out.length; j<l2; j++) {
								// we only care about outgoing transactions to this address
								if (txn.out[j].addr == address) {
									temp = {
										'timestamp': txn.time,
										'qty': txn.out[j].value / VALUE_CONV
									};
									promises.push(self.getMarketPrice(temp.timestamp * TIMESTAMP_CONV, temp.qty * VALUE_CONV).then(function (value) {
										temp.cost = value;
									}));
									transactions.push(temp);
								}
							}
						}
					}

					if (promises > 0) {
						$q.all(promises).then(function() {
							defer.resolve(transactions);
						});
					} else {
						defer.resolve(transactions);
					}
				} else {
					defer.reject('Service returned error: '+data.status);
				}
			});

			return defer.promise;
		};

		self.getMarketPrice = function(timestamp, value) {
			var defer = $q.defer();
			var url;

			if (angular.isUndefined(timestamp) || !timestamp) {
				// get current price
				url = 'proxy.php?service=blockchain-24hrprice';
				$http.get(url).then(function (data) {
					if (data.status == 200 && data.hasOwnProperty('data')) {
						defer.resolve(data.data);
					} else {
						defer.reject('Service returned error: '+data.status);
					}
				});
			} else {
				if (!value) {
					value = VALUE_CONV; // 1 BTC
				}
				// date format is YYYY-MM-DD
				url = 'proxy.php?service=blockchain-historicalPrice&timestamp=' + timestamp + '&value=' + value;
				$http.get(url).then(function (data) {
					if (data.status == 200 && data.hasOwnProperty('data')) {
						defer.resolve(data.data);
					} else {
						defer.reject('Invalid response.');
					}
				});
			}

			return defer.promise;
		};
	}]);