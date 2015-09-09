<?php
error_reporting(0);
require_once(dirname(__FILE__)."/../../classesphp/pega_variaveis.php");
require_once(dirname(__FILE__)."/../../pacotes/cpaint/cpaint2.inc.php");
require_once(dirname(__FILE__)."/../../ms_configura.php");
require_once(dirname(__FILE__)."/../../pacotes/phpflickr/phpFlickr.php");
error_reporting(0);
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
	$af = strtotime("30 Dec ".$af);
	$f = new phpFlickr($key);
	$recent = @$f->photos_search(array("page"=>$page,"extras"=>"geo","accuracy"=>"11","min_upload_date"=>$ai,"max_upload_date"=>$af,"text"=>$texto,"bbox"=>$ret,"privacy_filter"=>"1"));
	if(!$recent){$recent = "";}
	$cp->set_data($recent);
}
function listafotospanoramio()
{
	global $ret, $cp,$ai,$af,$i3geo_proxy_server;
	$ret = explode(" ",$ret);
	$resultado = "";
	$curl = curl_init();
	curl_setopt ($curl, CURLOPT_URL, "http://www.panoramio.com/map/get_panoramas.php?order=upload_date&set=public&from=".$ai."&to=".$af."&minx=".$ret[0]."&miny=".$ret[1]."&maxx=".$ret[2]."&maxy=".$ret[3]."&size=thumbnail");
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	if(isset($i3geo_proxy_server) && $i3geo_proxy_server != ""){
		curl_setopt($curl, CURLOPT_PROXY, $i3geo_proxy_server);
	}
	$recent = curl_exec($curl);
	curl_close ($curl);

	//$recent = file_get_contents("http://www.panoramio.com/map/get_panoramas.php?order=upload_date&set=public&from=".$ai."&to=".$af."&minx=".$ret[0]."&miny=".$ret[1]."&maxx=".$ret[2]."&maxy=".$ret[3]."&size=thumbnail");
	$recent = str_replace("\n","",$recent);
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