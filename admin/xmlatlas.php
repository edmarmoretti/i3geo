<?php
/*DEPRECIADO*/
error_reporting(0);
if(!isset($locaplic) || !isset($editores))
{
	$locaplic = "";
	if(file_exists("../../../ms_configura.php"))
	{include("../../../ms_configura.php");}
	else
	{
		if(file_exists("../../ms_configura.php"))
		{include("../../ms_configura.php");}
		else
		{
			if(file_exists("../ms_configura.php"))
			{include("../ms_configura.php");}
			else
			include("ms_configura.php");
		}	
	}
}
include_once($locaplic."/classesphp/pega_variaveis.php");
include_once($locaplic."/admin/php/xml.php");
echo header("Content-type: application/xml");
echo geraXmlAtlas($locaplic,$editores);
?>
