<?php
header('Access-Control-Allow-Origin: *');

$json = json_encode($_POST);
$json = str_replace('"playerid":"1"','"playerid":1',$json);
$curl = curl_init();

curl_setopt($curl, CURLOPT_URL, $_GET['host']."/jsonrpc?request=".$json);  
curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
$return = curl_exec($curl);
if(empty($return)) $return='{}';
die($return);
?>