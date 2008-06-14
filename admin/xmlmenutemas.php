<?php
//
//$id_menu = id do menu que será montado
//$perfil = perfis separados por espaços
//$tipo = gruposeraiz|subgrupos|temas
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
include_once($locaplic."/admin/php/admin.php");
include_once($locaplic."/admin/php/conexao.php");
if (!isset($perfil)){$perfil = "";}
$perfil = str_replace(","," ",$perfil);
$perfil = explode(" ",$perfil);

echo "<"."\x3F"."xml version='1.0' encoding='UTF-8' "."\x3F".">";
//echo "<"."\x3F"."xml-stylesheet type='text/xsl' href='../menutemas/menutemas.xsl'"."\x3F".">";
echo "\n<TEMASGEO>\n";
if(!isset($id_menu))
echo "<CABECALHO>Utilize ?id_menu=1 por exemplo</CABECALHO>\n";
else
echo "<CABECALHO></CABECALHO>\n";

//
//pega os temas na raiz
//
$q = "select nome_tema,codigo_tema,desc_tema,link_tema,tipoa_tema,tags_tema,kml_tema,ogc_tema,download_tema,r.perfil as perfil from i3geoadmin_raiz as r,i3geoadmin_temas as temas where r.id_nivel = 0 and r.id_tema = temas.id_tema and r.id_menu = $id_menu ";
$qtemasraiz = $dbh->query($q);
xmlmenu_notema($qtemasraiz);

$q = "select nome_grupo,desc_grupo,n1.id_grupo,n1.id_n1,n1.n1_perfil as perfil from i3geoadmin_n1 as n1,i3geoadmin_grupos as grupos where n1.id_menu = $id_menu and n1.id_grupo = grupos.id_grupo ";
$qgrupos = $dbh->query($q);

foreach($qgrupos as $row)
{
	if($row["perfil"] == "")
	$mostra = true;
	else
	{
		$perfilatual = explode(" ",str_replace(","," ",$row["perfil"]));
		$mostra = array_in_array($perfil,$perfilatual);
	}
	if($mostra)
	{
		echo "<GRUPO>\n";
		echo " <GTIPO>".xmlmenu_prepara($row["nome_grupo"])."</GTIPO>\n";
		//
		//pega temas na raiz
		//
		$q = "select nome_tema,codigo_tema,desc_tema,link_tema,tipoa_tema,tags_tema,kml_tema,ogc_tema,download_tema,r.perfil as perfil from i3geoadmin_raiz as r,i3geoadmin_temas as temas where r.nivel = 1 and r.id_nivel = ".$row["id_n1"]." and r.id_tema = temas.id_tema and r.id_menu = $id_menu ";
		$qtemasraiz = $dbh->query($q);
		xmlmenu_notema($qtemasraiz);
		if(isset($tipo) && ($tipo == "subgrupos") || ($tipo == ""))
		xmlmenu_pegasubgrupos($row["id_n1"]);
		echo " <DTIPO>".xmlmenu_prepara($row["desc_grupo"])."</DTIPO>\n";
		echo " <PERFIL>".$row["perfil"]."</PERFIL>\n";
		echo "</GRUPO>\n";
	}
}
echo "</TEMASGEO>\n";
$dbh = null;
function xmlmenu_pegasubgrupos($id_n1)
{
	global $dbh,$tipo,$perfil;
	$q = "select subgrupos.id_subgrupo,nome_subgrupo,id_n2,n2.n2_perfil as perfil from i3geoadmin_n2 as n2,i3geoadmin_subgrupos as subgrupos where n2.id_n2 = $id_n1 and n2.id_subgrupo = subgrupos.id_subgrupo ";
	$qsgrupos = $dbh->query($q);
	foreach($qsgrupos as $row)
	{
		if($row["perfil"] == "")
		$mostra = true;
		else
		{
			$perfilatual = explode(" ",str_replace(","," ",$row["perfil"]));
			$mostra = array_in_array($perfil,$perfilatual);
		}
		if($mostra)
		{
			echo "<SGRUPO>\n";
			echo "<SDTIPO>".xmlmenu_prepara($row["nome_subgrupo"])."</SDTIPO>\n";
			echo "<PERFIL>".xmlmenu_prepara($row["perfil"])."</PERFIL>\n";
			if(isset($tipo) && ($tipo == "temas") || ($tipo == ""))
			xmlmenu_pegatemas($row["id_n2"]);
			echo "</SGRUPO>\n";
		}
	}
}
function xmlmenu_pegatemas($id_n2)
{
	global $dbh,$perfil;
	$q = "select nome_tema,codigo_tema,desc_tema,link_tema,tipoa_tema,tags_tema,kml_tema,ogc_tema,download_tema,n3.n3_perfil as perfil from i3geoadmin_n3 as n3,i3geoadmin_temas as temas where n3.id_n2 = $id_n2 and n3.id_tema = temas.id_tema ";
	$qtemas = $dbh->query($q);
	xmlmenu_notema($qtemas);
}
function xmlmenu_notema($qtemas)
{
	global $perfil;
	foreach($qtemas as $row)
	{
		if($row["perfil"] == "")
		$mostra = true;
		else
		{
			$perfilatual = explode(" ",str_replace(","," ",$row["perfil"]));
			$mostra = array_in_array($perfil,$perfilatual);
		}
		if($mostra)
		{
			echo "<TEMA>\n";
			echo "<TID>".$row["codigo_tema"]."</TID>\n";
			echo "<PERFIL>".$row["perfil"]."</PERFIL>\n";
			echo "<TNOME>".xmlmenu_prepara($row["nome_tema"])."</TNOME>\n";
			echo "<TDESC>".xmlmenu_prepara($row["desc_tema"])."</TDESC>\n";
			echo "<TLINK>".xmlmenu_prepara($row["link_tema"])."</TLINK>\n";
			echo "<TIPOA>".$row["tipoa_tema"]."</TIPOA>\n";
			echo "<TAGS>".xmlmenu_prepara($row["tags_tema"])."</TAGS>\n";
			echo "<KML>".$row["kml_tema"]."</KML>\n";
			if($row["tipoa_tema"] == "WMS")
			echo "<OGC>nao</OGC>\n";
			else
			echo "<OGC>".$row["ogc_tema"]."</OGC>\n";
			echo "<DOWNLOAD>".$row["download_tema"]."</DOWNLOAD>\n";
			echo "</TEMA>\n";
		}
	}
}	
function xmlmenu_prepara($texto)
{
	return str_replace("&","&amp;",$texto);	
}
?>
