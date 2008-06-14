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
echo "\n<RAIZ>\n";
if (!isset($perfil)){$perfil = "";}

$q = "select * from i3geoadmin_atlas ";
$qatlas = $dbh->query($q);
foreach($qatlas as $row)
{
	echo "<ATLAS>\n";
	echo " <ID>".$row["id_atlas"]."</ID>\n";
	echo " <TITULO>".xmlmenu_prepara($row["titulo_atlas"])."</TITULO>\n";
	echo " <DESCRICAO>".xmlmenu_prepara($row["desc_atlas"])."</DESCRICAO>\n";
	echo " <ICONE>".$row["icone_atlas"]."</ICONE>\n";
	echo " <LINKMAISINFO>".xmlmenu_prepara($row["link_atlas"])."</LINKMAISINFO>\n";
	echo " <TEMPLATEHTML>".xmlmenu_prepara($row["template_atlas"])."</TEMPLATEHTML>\n";
	echo " <WABERTURA>".$row["w_atlas"]."</WABERTURA>\n";
	echo " <HABERTURA>".$row["h_atlas"]."</HABERTURA>\n";
	echo " <PRANCHADEFAULT>".$row["pranchadefault_atlas"]."</PRANCHADEFAULT>\n";
	echo " <TIPOGUIAS>".$row["tipoguias_atlas"]."</TIPOGUIAS>\n";
	echo " <BASEMAPFILE>".$row["basemapfile_atlas"]."</BASEMAPFILE>\n";
	echo " <PRANCHAS>\n";
	xmlmenu_pegapranchas($row["id_atlas"]);
	echo " </PRANCHAS>\n";
	echo " </ATLAS>\n";
}
echo "</RAIZ>\n";
$dbh = null;
function xmlmenu_pegapranchas($id_atlas)
{
	global $dbh;
	$q = "select * from i3geoadmin_atlasp as p where p.id_atlas = $id_atlas ";
	$qpranchas = $dbh->query($q);
	foreach($qpranchas as $row)
	{
		echo "  <PRANCHA>\n";
		echo "   <ID>".$row["id_prancha"]."</ID>\n";
		echo "   <TITULO>".xmlmenu_prepara($row["titulo_prancha"])."</TITULO>\n";
		echo "   <DESCRICAO>".xmlmenu_prepara($row["desc_prancha"])."</DESCRICAO>\n";
		echo "   <ICONE>".$row["icone_prancha"]."</ICONE>\n";
		echo "   <LINKMAISINFO>".xmlmenu_prepara($row["link_prancha"])."</LINKMAISINFO>\n";
		echo "   <WABERTURA>".$row["w_prancha"]."</WABERTURA>\n";
		echo "   <HABERTURA>".$row["h_prancha"]."</HABERTURA>\n";
		echo "   <MAPEXT>".$row["mapext_prancha"]."</MAPEXT>\n";
		echo "   <TEMAS>\n";
		xmlmenu_pegatemas($row["id_prancha"]);
		echo "   </TEMAS>\n";
		echo "  </PRANCHA>\n";
	}
}
function xmlmenu_pegatemas($id_prancha)
{
	global $dbh;
	$q = "select tema.codigo_tema,t.ligado_tema from i3geoadmin_atlast as t,i3geoadmin_temas as tema where tema.id_tema = t.id_tema and t.id_prancha = $id_prancha ";
	//echo $q;
	$qtemas = $dbh->query($q);
	foreach($qtemas as $row)
	{
		echo "<TEMA>\n";
		echo "<CODIGO>".$row["codigo_tema"]."</CODIGO>\n";
		echo "<LIGADO>".$row["ligado_tema"]."</LIGADO>\n";
		echo "</TEMA>\n";
	}
}
function xmlmenu_prepara($texto)
{
	return str_replace("&","&amp;",$texto);	
}
?>
