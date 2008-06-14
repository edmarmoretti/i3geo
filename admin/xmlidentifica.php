<?php
//
//$id_menu = id do menu que será montado
//$perfil = perfis
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
include_once($locaplic."/admin/php/admin.php");
include_once($locaplic."/admin/php/conexao.php");
echo "<"."\x3F"."xml version='1.0' encoding='UTF-8' "."\x3F".">";
//echo "<"."\x3F"."xml-stylesheet type='text/xsl' href='../menutemas/menutemas.xsl'"."\x3F".">";
echo "\n<SISTEMAS>\n";
if (!isset($perfil)){$perfil = "";}

$q = "select * from i3geoadmin_identifica ";
$qi = $dbh->query($q);
foreach($qi as $row)
{
	echo " <FUNCAO>\n";
	echo "  <NOMESIS>".xmlmenu_prepara($row["nome_i"])."</NOMESIS>\n";
	echo "  <ABRIR>".xmlmenu_prepara($row["abrir_i"])."</ABRIR>\n";
	$target = $row["target_i"];
	if($target == ""){$target = "_self";}
	echo "  <TARGET>".$target."</TARGET>\n";
	echo " </FUNCAO>\n";
}
echo "</SISTEMAS>\n";
$dbh = null;
function xmlmenu_prepara($texto)
{
	return str_replace("&","&amp;",$texto);	
}
?>
