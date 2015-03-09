<?php
$curl = curl_init();

curl_setopt($curl, CURLOPT_URL, 'http://zakelijk.vid.nl/VI/_rss');  
curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
$return = curl_exec($curl);
$xml=simplexml_load_string($return) or die("Error: Cannot create object");
$title = explode(' meldingen',$xml->channel->item->title);
$title = explode('Er zijn ',$title[0]);
die($title[1]);
?>