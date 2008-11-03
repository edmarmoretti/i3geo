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
include_once($locaplic."/admin/php/admin.php");
if(!isset($tema))
{echo "Nenhum tema definido.";exit;}
$editor = verificaEditores($editores);
$dbh = "";
include($locaplic."/admin/php/conexao.php");
$r = pegaDados("select * from i3geoadmin_temas where codigo_tema = '$tema'");
$link = $r[0]["link_tema"];
if($link == "")
{echo "Link não encontrado";}
else
{echo "<meta http-equiv='refresh' content='0;url=$link'>";}
?>