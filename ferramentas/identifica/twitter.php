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
if(empty($_GET["km"]))
{$km = 5;}
else
{$km = $_GET["km"];}
$par = $_GET["x"].",".$_GET["y"];
echo "<p class=paragrafo >Raio de <input type=text size=4 value='$km' id=km onchange='recarrega($par,this.value)'> km</p>";
include("../../classesphp/carrega_ext.php");
$s = PHP_SHLIB_SUFFIX;
if(!function_exists('curl_init'))
{@dl( 'php_curl'.'.'.$s );}
if(!function_exists('curl_init'))
{echo "curl não instalado";}
$curl = curl_init();
curl_setopt ($curl, CURLOPT_URL, "http://search.twitter.com/search.json?geocode=".$_GET["y"].",".$_GET["x"].",".$km."km");
//teste
//curl_setopt ($curl, CURLOPT_URL, "http://search.twitter.com/search.json?geocode=37.781157,-122.398720,2km");
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
$result = curl_exec($curl);
curl_close ($curl);
$result = fixEncoding($result);
$result = json_decode( $result, true );

//echo "<pre>";
//var_dump($result);

if(isset($result["error"]) || count($result["results"]) == 0)
{
	echo "Nada encontrado";
}
else
{
	$html = "<table class='lista4'>";
	foreach($result["results"] as $r)
	{ 
		
		$html .= "<tr><td><img src='".$r["profile_image_url"]."' /></td>";
		$html .= "<td><a href='http://twitter.com/".$r["from_user"]."' target=_blank '>".$r["from_user"]."</a><br>";
		$html .= "<span style=color:gray >".$r["created_at"]."</span><br>";
		$html .= $r["text"]."<br></td></tr>";
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
<script>
function recarrega(x,y,km){
	var url = window.location.href.split("?");
	var url = url[0]+"?x="+x+"&y="+y+"&km="+km;
	window.location.href = url;
}

</script>