<?php
/**
 * @file
 * Take the user when they return from Twitter. Get access tokens.
 * Verify credentials and redirect to based on response from Twitter.
 */

/* Start session and load lib */
$par = array_merge($_GET,$_POST);
session_name("openid");
session_start();
$_SESSION["openid"] = true;
$_SESSION["openid_identifier"] = $par["openid_identifier"];
$_SESSION["openidusuario"] = basename($_SESSION["openid_identifier"]);
$_SESSION["openidservico"] = "facebook";
$_SESSION["openidimagem"] = "http://graph.facebook.com/".$_SESSION["openidusuario"]."/picture";
$_SESSION["openidnome"] = $par["openidnome"];
header('Location: '.$_SESSION["urlVolta"]);
?>
