<?php

/**
 * @file
 * A single location to store configuration.
 */
include(dirname(__FILE__)."/../../ms_configura.php");
define('CONSUMER_KEY', $twitteroauth["consumerkey"]);
define('CONSUMER_SECRET', $twitteroauth["consumersecret"]);
$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
$urlaplic = strtolower($protocolo[0])."://".$_SERVER['HTTP_HOST']."/".basename($locaplic);
define('OAUTH_CALLBACK', $urlaplic."/pacotes/twitteroauth/callback.php");
?>