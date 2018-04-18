
angular.module('services', [])
	.service('blockchain', ['$http', '$q', function($http, $q){
		var VALUE_CONV = 100000000;
		var TIMESTAMP_CONV = 1000;
		var self = this;

		/**
		 * Takes a wallet address and retrieves transactions from
		 * https://blockchain.info/rawaddr/[address]
		 * @param {string} address wallet address
		 * @returns promise object
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

						// loop over all transaction groups
						for (var i=0,l=data.data.txs.length; i<l; i++) {
							txn = data.data.txs[i];

							// loop over outgoing component
							for (j=0, l2=txn.out.length; j<l2; j++) {
								// we only care about outgoing transactions to this address
								if (txn.out[j].addr == address) {
									temp = {
										'timestamp': txn.time,
										'qty': txn.out[j].value
									};

									// pull market price
									promises.push((function (record) {
										return self.getMarketPrice(record.timestamp, record.qty).then(function (value) {
											record.cost = value;
											record.qty = record.qty / VALUE_CONV;
										});
									})(temp));

									transactions.push(temp);
								}
							}
						}
					}

					// TODO: only resolve when all promises are resolved
					defer.resolve(transactions);
				} else {
					defer.reject('Service returned error: '+data.status);
				}
			});

			return defer.promise;
		};

		/**
		 * Returns the market value for a specified number of BTC at a certain point in time
		 * @param {number} timestamp (default: today) javascript unix timestamp
		 * @param {number} value (default: 1 BTC) number of BTC in Satoshi (1 BTC = 100000000)
		 * @returns promise object
		 */
		self.getMarketPrice = function(timestamp, value) {
			var defer = $q.defer();
			var url;

			if (angular.isUndefined(timestamp) || !timestamp) {
				// get current price
				url = 'proxy.php?service=blockchain-24hrprice';
				$http.get(url).then(function (data) {
					if (data.status == 200 && data.hasOwnProperty('data')) {
						defer.resolve(parseFloat(data.data));
					} else {
						defer.reject('Service returned error: '+data.status);
					}
				});
			} else {
				if (!value) {
					value = VALUE_CONV; // 1 BTC
				}

				// timestamp is javascript unix epoch
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