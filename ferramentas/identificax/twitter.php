<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="../../css/i3geo45.css.php">
<style>
p {
	color: #2F4632;
	font-family: Verdana, Arial, Helvetica, sans-serif;
	font-size: 12px;
	text-align: left;
}
</style>
</head>
<body style="background-color: white; margin: 10px">
	<?php
	include_once (dirname(__FILE__)."/../../classesphp/sani_request.php");
	if(empty($_GET["km"]))
	{
		$km = 5;
	}
	else
	{$km = $_GET["km"];
	}
	$par = $_GET["x"].",".$_GET["y"];
	echo "<p class=paragrafo >Raio de <input type=text size=4 value='$km' id=km onchange='recarrega($par,this.value)'> km</p>";
	include(dirname(__FILE__)."/../../classesphp/carrega_ext.php");
	include(dirname(__FILE__)."/../../ms_configura.php");
	include(dirname(__FILE__)."/../blacklist.php");
	verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
	$s = PHP_SHLIB_SUFFIX;
	if(!function_exists('curl_init'))
	{
		@dl( 'php_curl'.'.'.$s );
	}
	if(!function_exists('curl_init'))
	{
		echo "curl n&atilde;o instalado";return;
	}

	$ch = curl_init();
	curl_setopt($ch,CURLOPT_URL, 'https://api.twitter.com/oauth2/token');
	curl_setopt($ch,CURLOPT_POST, true);
	$data = array();
	$data['grant_type'] = "client_credentials";
	curl_setopt($ch,CURLOPT_POSTFIELDS, $data);
	$consumerKey = $twitteroauth["consumerkey"]; //add your app key
	$consumerSecret = $twitteroauth["consumersecret"]; //add your app secret
	curl_setopt($ch,CURLOPT_USERPWD, $consumerKey . ':' . $consumerSecret);
	curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
	$result = curl_exec($ch);
	curl_close($ch);

	$bearer_token = json_decode($result);
	$bearer = $bearer_token->{'access_token'}; // this is your app token

	$curl = curl_init();
	curl_setopt($curl,CURLOPT_URL, "https://api.twitter.com/1.1/search/tweets.json?geocode=".$_GET["y"].",".$_GET["x"].",".$km."km");
	curl_setopt($curl,CURLOPT_HTTPHEADER,array('Authorization: Bearer ' . $bearer));
	curl_setopt($curl,CURLOPT_RETURNTRANSFER, true);

	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	$result = curl_exec($curl);
	curl_close ($curl);
	$result = fixEncoding($result);
	$result = json_decode( $result, true );

	$html = "<table class='lista4'>";
	foreach($result["statuses"] as $r)
	{
		$usuario = $r["user"];
		$html .= "<tr><td><img src='".$usuario["profile_image_url"]."' /></td>";
		$html .= "<td><a href='http://twitter.com/".$usuario["screen_name"]."' target=_blank '>".$usuario["screen_name"]."</a><br>";
		$html .= "<span style=color:gray >".$r["created_at"]."</span><br>";
		$html .= $r["text"]."<br></td></tr>";
	}
	echo $html."</table>";
	function fixEncoding($in_str)
	{
		$cur_encoding = mb_detect_encoding($in_str) ;
		if($cur_encoding == "UTF-8" && mb_check_encoding($in_str,"UTF-8"))
		{
			return $in_str;
		}
		else
		{return utf8_encode($in_str);
		}
	}
	?>
</body>
<script>
function recarrega(x,y,km){
	var url = window.location.href.split("?");
	var url = url[0]+"?x="+x+"&y="+y+"&km="+km;
	window.location.href = url;
}

</script>