<?php
header('Access-Control-Allow-Origin: *');
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, "http://www.vid.nl/VI/overzicht");  
curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
$return = curl_exec($curl);
$return = explode('<dl>',$return,2);
$return = explode('<div id="file-legenda">','<dl>'.$return[1]);
die($return[0]);
?>