<?php
require_once 'linkedin.php';
include(dirname(__FILE__)."/../../ms_configura.php");
$consumer_key = $linkedinoauth["consumerkey"];
$consumer_secret = $linkedinoauth["consumersecret"];
echo "<pre>";
# First step is to initialize with your consumer key and secret. We'll use an out-of-band oauth_callback
$linkedin = new LinkedIn($consumer_key, $consumer_secret, "oob");
$linkedin->debug = true;

# Now we retrieve a request token. It will be set as $linkedin->request_token
$linkedin->getRequestToken();

# With a request token in hand, we can generate an authorization URL, which we'll direct the user to
echo "Authorization URL: " . $linkedin->generateAuthorizeUrl() . "\n\n";

# After logging in, the user will be presented with an OAuth Verifier, which you would then ask the member to enter in a UI you present. Once you have the OAuth verifier, set it here:

echo "Enter OAuth Verifier:\n";
$handle = fopen("php://stdin", "r");
$oauth_verifier = trim(fgets($handle));

$linkedin->getAccessToken($oauth_verifier);

# You now have a $linkedin->access_token and can make calls on behalf of the current member
$xml_response = $linkedin->getProfile("~:(id,first-name,last-name,headline,picture-url)");

echo $xml_response;

# Let's set our status

$xml_response2 = $linkedin->setStatus("setting my status using the LinkedIn API.");
echo $xml_response2;

# Let's do a search!
$search_response = $linkedin->search("?company=Google&count=10");
echo $search_response;

?>
