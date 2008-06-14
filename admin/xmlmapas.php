<?php
//
//$perfil = perfis
//
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
if (!isset($perfil)){$perfil = "";}
$perfil = str_replace(","," ",$perfil);
$perfil = explode(" ",$perfil);

echo "<"."\x3F"."xml version='1.0' encoding='UTF-8' "."\x3F".">";
//echo "<"."\x3F"."xml-stylesheet type='text/xsl' href='../menutemas/menutemas.xsl'"."\x3F".">";
echo "\n<MAPAS>\n";
$q = "select * from i3geoadmin_mapas";
$q = $dbh->query($q);
foreach($q as $row)
{
	if($row["perfil_mapa"] == "")
	$mostraMapa = true;
	else
	{
		$perfilMapa = explode(" ",str_replace(","," ",$row["perfil_mapa"]));
		$mostraMapa = array_in_array($perfil,$perfilMapa);
	}
	if($mostraMapa)
	{	
		echo "<MAPA>\n";
		echo " <PERFIL>".$row["perfil_mapa"]."</PERFIL>\n";
		echo " <NOME>".xmlmenu_prepara($row["nome_mapa"])."</NOME>\n";
		echo " <DESCRICAO>".xmlmenu_prepara($row["desc_mapa"])."</DESCRICAO>\n";
		echo " <IMAGEM>".xmlmenu_prepara($row["imagem_mapa"])."</IMAGEM>\n";
		echo " <TEMAS>".$row["temas_mapa"]."</TEMAS>\n";
		echo " <LIGADOS>".$row["ligados_mapa"]."</LIGADOS>\n";
		echo " <EXTENSAO>".$row["ext_mapa"]."</EXTENSAO>\n";
		echo " <OUTROS>".xmlmenu_prepara($row["outros_mapa"])."</OUTROS>\n";
		echo " <LINKDIRETO>".xmlmenu_prepara($row["linkdireto_mapa"])."</LINKDIRETO>\n";
		echo " </MAPA>\n";
	}
}
echo "</MAPAS>\n";
$dbh = null;
function xmlmenu_prepara($texto)
{
	return str_replace("&","&amp;",$texto);	
}
?>
