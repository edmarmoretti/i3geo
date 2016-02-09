<?php
exit;
/**
 * @file
 * User has successfully authenticated with Twitter. Access tokens saved to session and DB.
 */

/* Load required lib files. */
session_name("openid");
session_start();
require_once('twitteroauth/twitteroauth.php');
require_once('config.php');

/* If access tokens are not available redirect to connect page. */
if (empty($_SESSION['access_token']) || empty($_SESSION['access_token']['oauth_token']) || empty($_SESSION['access_token']['oauth_token_secret'])) {
    $_SESSION["openid"] = false;
	session_destroy();
	header('Location: ../openid/login.php?login&erro=ok');
}
/* Get user access tokens out of the session. */
$access_token = $_SESSION['access_token'];

/* Create a TwitterOauth object with consumer/user tokens. */
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);

/* If method is set change API call made. Test is called by default. */
$content = $connection->get('account/verify_credentials');

$_SESSION["openid"] = true;
$_SESSION["openid_identifier"] = "http://twitter.com/".$content->screen_name;
$_SESSION["openidusuario"] = $content->screen_name;
$_SESSION["openidservico"] = "twitter";
$_SESSION["openidimagem"] = $content->profile_image_url;
$_SESSION["openidnome"] = $content->name;
header('Location: ../openid/login.php');
?>
