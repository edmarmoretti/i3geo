<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="../../css/i3geo45.css.php">
<style>
p {
color:#2F4632;
font-family:Verdana,Arial,Helvetica,sans-serif;
font-size:12px;
text-align:left;
}
</style>
</head>
<body style="background-color:white;margin:10px">
<?php
include("../../classesphp/carrega_ext.php");
$s = PHP_SHLIB_SUFFIX;
if(!function_exists('curl_init'))
{@dl( 'php_curl'.'.'.$s );}
if(!function_exists('curl_init'))
{echo "curl n&atilde;o instalado";}
$curl = curl_init();
//lista de places
curl_setopt ($curl, CURLOPT_URL, "http://api.twitter.com/1/geo/nearby_places.json?lat=".$_GET["y"]."&long=".$_GET["x"]."&accuracy=0&granularity=neighborhood");
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
$result = curl_exec($curl);
curl_close ($curl);
$result = fixEncoding($result);
$result = json_decode( $result, true );
/*
echo "<pre>";
var_dump($result);
exit;
*/
if(isset($result["error"]) || count($result["result"]["places"]) == 0)
{
	echo "Nada encontrado";
}
else
{
	$html = "<table class='lista4'>";
	$places = $result["result"]["places"];
	foreach($places as $p)
	{ 
		
		$html .= "<tr>";
		$html .= "<td><a href='http://search.twitter.com/search?q=place:".$p["id"]."' target=_self '>".$p["full_name"]."</a><br>";
		$html .= "<span style=color:gray >".$p["place_type"]."</span>";
		$html .= "</td></tr>";
	}
	echo $html."</table>";
}
function fixEncoding($in_str)
{
	$cur_encoding = mb_detect_encoding($in_str) ;
	if($cur_encoding == "UTF-8" && mb_check_encoding($in_str,"UTF-8"))
	{return $in_str;}
	else
	{return utf8_encode($in_str);}
} 
?>
</body>