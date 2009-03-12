<?php
error_reporting(0);
require_once("../../classesphp/pega_variaveis.php");
require_once("../../pacotes/cpaint/cpaint2.inc.php");
require_once("../../ms_configura.php");
require_once("../../pacotes/phpflickr/phpFlickr.php");
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
	global $ret, $cp,$ai,$af;
	$ret = explode(" ",$ret);
	$resultado = "";
	//echo "http://www.panoramio.com/map/get_panoramas.php?order=upload_date&set=public&from=".$ai."&to=".$af."&minx=".$ret[0]."&miny=".$ret[1]."&maxx=".$ret[2]."&maxy=".$ret[3]."&size=thumbnail";
	//return;
	$recent = file_get_contents("http://www.panoramio.com/map/get_panoramas.php?order=upload_date&set=public&from=".$ai."&to=".$af."&minx=".$ret[0]."&miny=".$ret[1]."&maxx=".$ret[2]."&maxy=".$ret[3]."&size=thumbnail");
	$recent = str_replace("\n","",$recent);
	$recent = str_replace("'","",$recent);
	$recent = str_replace('"',"'",$recent);
	$cp->set_data($recent);
}
function listafotoslocr()
{
	global $ret,$cp,$ai,$af;
	$ret = explode(" ",$ret);
	$resultado = "";
	$u = "http://www.locr.com/api/get_photos_json.php?latitudemin=".$ret[1]."&longitudemin=".$ret[0]."&latitudemax=".$ret[3]."" ."&longitudemax=".$ret[2]."&size=thumbnail&category=popularity&locr=true&start=".$ai."&count=".($af-$ai);
	$recent = file_get_contents($u);
	$recent = str_replace("\n","",$recent);
	$recent = str_replace("\t","",$recent);
	$recent = str_replace("'","",$recent);
	$recent = str_replace('"',"'",$recent);
	$cp->set_data($recent);
}
?>