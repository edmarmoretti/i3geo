<?php
// PHP CSW Proxy for CSW services.
// Responds to both HTTP GET and POST requests
//
// Author: Rob van Swol, NLR
// October 15th, 2008
//
include (dirname ( __FILE__ ) . "/../../ms_configura.php");
$logging = false;
$url = "http://www.metadados.inde.gov.br/geonetwork/srv/br/csw";
	$session = curl_init ( $url );

	// If it's a POST, put the POST data in the body
	if ($_POST ['csw_request']) {

		// if (substr($_POST['csw_request'],0,5) == "<?xml") {
		if (substr ( $_POST ['csw_request'], 0, 1 ) == "<") {
			// Is magic quotes on?
			if (get_magic_quotes_gpc ())
				$xmlpost = stripslashes ( $_POST ['csw_request'] );
			else
				$xmlpost = $_POST ['csw_request'];

			curl_setopt ( $session, CURLOPT_POST, true );
			curl_setopt ( $session, CURLOPT_POSTFIELDS, $xmlpost );
			if (isset ( $i3geo_proxy_server ) && $i3geo_proxy_server != "") {
				curl_setopt ( $session, CURLOPT_PROXY, $i3geo_proxy_server );
			}
			curl_setopt ( $session, CURLOPT_HTTPHEADER, Array (
					"Content-Type: application/xml"
			) );
			// curl_setopt ($session, CURLOPT_SSL_VERIFYPEER, 0);
			if ($logging)
				fwrite ( $fh, $timestamp . ": POST> " . $xmlpost . "\n" );
		} else {
			$postvars = '';
			while ( $element = current ( $_POST ) ) {
				if (key ( $_POST ) != "csw_request")
					$postvars .= key ( $_POST ) . '=' . $element . '&';
				else
					$postvars .= $element . '&';
				next ( $_POST );
			}
			curl_setopt ( $session, CURLOPT_POST, true );
			curl_setopt ( $session, CURLOPT_POSTFIELDS, $_POST ['csw_request'] );
			if (isset ( $i3geo_proxy_server ) && $i3geo_proxy_server != "") {
				curl_setopt ( $session, CURLOPT_PROXY, $i3geo_proxy_server );
			}
			curl_setopt ( $session, CURLOPT_HTTPHEADER, Array (
					"Content-Type: application/x-www-form-urlencoded"
			) );
			if ($logging)
				fwrite ( $fh, $timestamp . ": POST> " . $_POST ['csw_request'] . "\n" );
		}
	} else if ($_GET ['csw_request']) {
		curl_setopt ( $session, CURLOPT_POST, true );
		curl_setopt ( $session, CURLOPT_POSTFIELDS, $_GET ['csw_request'] );
		if (isset ( $i3geo_proxy_server ) && $i3geo_proxy_server != "") {
			curl_setopt ( $session, CURLOPT_PROXY, $i3geo_proxy_server );
		}
		curl_setopt ( $session, CURLOPT_HTTPHEADER, Array (
				"Content-Type: application/x-www-form-urlencoded"
		) );
		if ($logging)
			fwrite ( $fh, $timestamp . ": GET> " . $_GET ['csw_request'] . "\n" );
	}

	// Don't return HTTP headers. Do return the contents of the call
	curl_setopt ( $session, CURLOPT_HEADER, false );
	curl_setopt ( $session, CURLOPT_RETURNTRANSFER, true );

	// Make the call
	$xml = curl_exec ( $session );
	// The web service returns XML. Set the Content-Type appropriately
	/*
	 * if(file_exists("c:/temp/csw.xml")){
	 * $fp = fopen("c:/temp/csw.xml","r");
	 * $xml = fread($fp,filesize("c:/temp/csw.xml"));
	 * fclose($fp);
	 * }
	 * else
	 * {$xml = curl_exec($session);}
	 */
	header ( "Content-Type: text/xml" );

	if ($logging) {
		fwrite ( $fh, $timestamp . ": RESPONSE> " . $xml . "\n" );
		fclose ( $fh );
	}

	echo $xml;
	curl_close ( $session );
//}
?>
