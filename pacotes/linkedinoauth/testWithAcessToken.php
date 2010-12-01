<?php
require_once 'linkedin.php';

# Use this to used already retrieved access token credentials for testing.

$consumer_key = "";
$consumer_secret = "";
$access_token = "";
$access_token_secret = "";

# First step is to initialize with your consumer key and secret. We'll use an out-of-band oauth_callback
$linkedin = new LinkedIn($consumer_key, $consumer_secret, "oob");
$linkedin->debug = true;

$linkedin->access_token = new OAuthConsumer($access_token, $access_token_secret, 1);

# Let's do a search!
$search_response = $linkedin->search("?company=Google&count=10");

echo $search_response;

?>
