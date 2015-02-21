<?php
$curl = curl_init();

curl_setopt($curl, CURLOPT_URL, $_GET['url']);  
curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
$return = curl_exec($curl);
$xml=simplexml_load_string($return) or die("Error: Cannot create object");
$return = '{}';
if(isset($xml->Video)){
	$attr = (array) $xml->Video->attributes();
	$return = json_encode($attr['@attributes']);
}
die($return);
?>