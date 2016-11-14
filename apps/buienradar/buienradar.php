<?php
header('Access-Control-Allow-Origin: *');
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, "http://gadgets.buienradar.nl/data/raintext?lat=".$_GET['lat']."&lon=".$_GET['lon']);  
curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
$return = curl_exec($curl);
die(json_encode(explode("\r\n",$return)));
?>