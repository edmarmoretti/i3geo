<?php
//error_reporting(0);
include_once (dirname(__FILE__)."/../../classesphp/sani_request.php");
$_GET = array_merge($_GET,$_POST);
require_once(dirname(__FILE__)."/../../pacotes/cpaint/cpaint2.inc.php");
require_once(dirname(__FILE__)."/../../ms_configura.php");
include("../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
error_reporting(0);
require_once(dirname(__FILE__)."/../../pacotes/phpflickr/phpFlickr.php");

$funcao = $_GET["funcao"];
$key = $_GET["key"];
$texto = $_GET["texto"];
$page = $_GET["page"];
$ret = $_GET["ret"];
$ai = $_GET["ai"];
$af = $_GET["af"];

$cp = new cpaint();
if($funcao == "listafotosflickr")
{$cp->register('listafotosflickr');}
if($funcao == "listafotospanoramio")
{$cp->register('listafotospanoramio');}
if($funcao == "listafotoslocr")
{$cp->register('listafotoslocr');}
$cp->start();
$cp->return_data();
//$i3geo_proxy_server = "proxy.saude.gov";
function listafotosflickr()
{
	global $ret, $cp, $key, $texto,$ai,$af,$page;
	$ret = explode(" ",$ret);
	$ret = implode(",",$ret);
	$resultado = "";
	if ($ai != "")
	$ai = strtotime("1 Jan ".$ai);// echo strtotime("10 September 2000")
	if($af != "")
	$af = strtotime("31 Dec ".$af);
	$f = new phpFlickr($key);
	$recent = @$f->photos_search(array("page"=>$page,"extras"=>"geo","accuracy"=>"11","min_upload_date"=>$ai,"max_upload_date"=>$af,"text"=>$texto,"bbox"=>$ret,"privacy_filter"=>"1"));
	if(!$recent){$recent = "";}
	$cp->set_data($recent);
}
function listafotospanoramio()
{
	global $ret, $cp,$ai,$af,$i3geo_proxy_server,$googleApiKey;
	$ret = explode(" ",$ret);

	$lat = $ret[3] - (($ret[3] - $ret[1]) / 2);
	$long = $ret[2] - (($ret[2] - $ret[0]) / 2);
	$resultado = "";
	$curl = curl_init();
    $u = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=$lat,$long&radius=50000&key=".$googleApiKey;
    $recent = file_get_contents($u);
    /*
	curl_setopt ($curl, CURLOPT_URL, "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=$lat,$long&radius=50000&key=".$googleApiKey);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_TIMEOUT, 120);
	if(isset($i3geo_proxy_server) && $i3geo_proxy_server != ""){
		curl_setopt($curl, CURLOPT_PROXY, $i3geo_proxy_server);
	}
	$recent = curl_exec($curl);
	curl_close ($curl);
    */
	$recent = str_replace("\n","",$recent);
	$recent = str_replace("\t","",$recent);
	$recent = str_replace("'","",$recent);
	$recent = str_replace('"',"'",$recent);
	$cp->set_data($recent);
}
function listafotoslocr()
{
	global $ret,$cp,$ai,$af,$i3geo_proxy_server;
	$ret = explode(" ",$ret);
	$resultado = "";
	$u = "http://www.locr.com/api/get_photos_json.php?latitudemin=".$ret[1]."&longitudemin=".$ret[0]."&latitudemax=".$ret[3]."" ."&longitudemax=".$ret[2]."&size=thumbnail&category=popularity&locr=true&start=".$ai."&count=".($af-$ai);
	$curl = curl_init();
	curl_setopt ($curl, CURLOPT_URL, $u);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	if(isset($i3geo_proxy_server) && $i3geo_proxy_server != ""){
		curl_setopt($curl, CURLOPT_PROXY, $i3geo_proxy_server);
	}
	$recent = curl_exec($curl);
	curl_close ($curl);
	//$recent = file_get_contents($u);
	$recent = str_replace("\n","",$recent);
	$recent = str_replace("\t","",$recent);
	$recent = str_replace("'","",$recent);
	$recent = str_replace('"',"'",$recent);
	$cp->set_data($recent);
}
?>