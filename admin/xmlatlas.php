<?php
/*DEPRECIADO*/
error_reporting(0);
if(!isset($locaplic)){
	include(dirname(__FILE__)."/../ms_configura.php");
}
include_once($locaplic."/classesphp/pega_variaveis.php");
include_once($locaplic."/admin/php/xml.php");
echo header("Content-type: application/xml");
echo geraXmlAtlas($locaplic,$editores);
?>
