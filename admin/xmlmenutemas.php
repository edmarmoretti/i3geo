<?php
error_reporting(0);
if(!isset($locaplic))
{
	$locaplic = "";
	if(file_exists("../../../ms_configura.php"))
	{include_once("../../../ms_configura.php");}
	else
	{
		if(file_exists("../../ms_configura.php"))
		{include_once("../../ms_configura.php");}
		else
		{
			if(file_exists("../ms_configura.php"))
			{include_once("../ms_configura.php");}
			else
			include_once("ms_configura.php");
		}	
	}
}
include_once($locaplic."/classesphp/pega_variaveis.php");
include_once($locaplic."/admin/php/xml.php");
if(!isset($perfil)){$perfil = "";}
if(!isset($id_menu)){$id_menu = "";}
if(!isset($tipo)){$tipo = "";}
if(!isset($tipoRetorno)){$tipoRetorno = "xml";}

$dados = geraXmlMenutemas($perfil,$id_menu,$tipo,$locaplic);
if($tipoRetorno == "JSON")
{return $dados;}
else
{
	echo header("Content-type: application/xml");
	echo $dados;
}
?>
