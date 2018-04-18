<?php

switch ($_GET['service']) {
	case 'blockchain-24hrprice':
		$url = 'https://blockchain.info/q/24hrprice';
		break;
	case 'blockchain-historicalPrice':
		if (!$_GET['timestamp']) {
			trigger_error('timestamp is required');
		}
		if (!$_GET['value']) {
			trigger_error('value is required');
		}
		$url = 'https://blockchain.info/frombtc?value='.urlencode($_GET['value']).'&currency=USD&textual=false&nosavecurrency=true&time=' . urlencode($_GET['timestamp']);
		break;
	case 'blockchain-address':
		if (!$_GET['address']) {
			trigger_error('address is required');
		}
		$url = 'https://blockchain.info/rawaddr/' . urlencode($_GET['address']) . '?filter=2&limit=20';
		break;
	default:
		trigger_error('Unsupported Service: '.htmlspecialchars($_GET['service']));
}

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HEADER, 0);

curl_exec($ch);

curl_close($ch);

?>