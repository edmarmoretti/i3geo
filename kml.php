<?php
/*
Title: kml.php

Gerador de menu em kml para uso no Google Earth

Lê o(s) menu(s) de temas e acrescenta os links necessários ao acesso aos dados no Google Earth. Veja mais detalhes em ajuda/googleearth.htm

About: Licença

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;
tanto a versão 2 da Licença.
Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

File: i3geo/kml.php

Parameter:

perfil - perfis separados por espaços que indicam que menus serão utilizados
*/
error_reporting(0);
include_once ("classesphp/carrega_ext.php");
include_once ("classesphp/classe_menutemas.php");
include_once ("ms_configura.php");
echo header("Content-type: application/xml");
echo '<?xml version="1.0" encoding="UTF-8"?>';
echo "<kml xmlns='http://earth.google.com/kml/2.2'>\n";
//
//pega os endereços para compor a url de chamada do gerador de web services
//ogc.php
//
$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
$protocolo = strtolower($protocolo[0]);
$protocolo1 = strtolower($protocolo . '://'.$_SERVER['SERVER_NAME']);
$protocolo = $protocolo . '://'.$_SERVER['SERVER_NAME'] .":". $_SERVER['SERVER_PORT'];
$urli3geo = str_replace("/kml.php","",$protocolo.$_SERVER["PHP_SELF"]);
//error_reporting(E_ALL);
if(!isset($perfil)){$perfil = "";}
//
//monta o xml
//
echo "<Document><name>Menu i3geo</name><open>0</open><description></description><visibility>0</visibility>\n";
//
//no caso do arquivo com o menu vir de um arquivo XML
//
if ($menutemas != "" || is_array($menutemas))
{
	//
	//para manter a compatibilidade entre as versões do i3geo
	//é necessário verificar se a variável $menutemas é um array ou não
	//
	if(is_array($menutemas))
	{
		foreach($menutemas as $m)
		{$menus[] = $m["arquivo"];}
	}
	else
	$menu[] = $menutemas;
	foreach ($menus as $menu)
	{
		$xml = simplexml_load_file($menu);
		foreach($xml->GRUPO as $grupo)
		{
			$nome = mb_convert_encoding($grupo->GTIPO,"auto","auto");
			$desc = mb_convert_encoding($grupo->DTIPO,"auto","auto");
			kml_cabecalho($nome,$desc);
			foreach($grupo->TEMA as $tema)
			{kml_tema($tema);}
			foreach($grupo->SGRUPO as $sgrupo)
			{
				$nome = mb_convert_encoding($sgrupo->SDTIPO,"auto","auto");
				kml_folder($nome);
				foreach($sgrupo->TEMA as $tema)
				{kml_tema($tema);}		
				echo "</Folder>\n";	
			}
			echo "</Folder>\n";
		}
	}
}
//
//no caso do menu vir do sistema de administração
//
if($menutemas == "")
{
	include("admin/php/admin.php");
	$menus = pegaDados("SELECT * from i3geoadmin_menus where publicado_menu != 'NAO' or publicado_menu isnull order by nome_menu ");
	echo $sql;
	foreach($menus as $menu)
	{
		echo $menu["nome_menu"];
		kml_cabecalho($menu["nome_menu"],$menu["desc_menu"]);
		$id_menu = $menu["id_menu"];
		$grupos = pegaDados("SELECT nome_grupo,n1.id_grupo,gr.desc_grupo from i3geoadmin_n1 as n1,i3geoadmin_grupos as gr where n1.id_menu = '$id_menu' and n1.id_grupo = gr.id_grupo order by gr.nome_grupo");
		foreach($grupos as $grupo)
		{
			kml_cabecalho($grupo["nome_grupo"],$grupo["desc_grupo"]);
			$id_grupo = $grupo["id_grupo"];
			$sql = "select s.nome_subgrupo,n2.id_n2 from i3geoadmin_n2 as n2,i3geoadmin_n1 as n1, i3geoadmin_subgrupos as s ";
			$sql .= "where n1.id_grupo = '$id_grupo' and n2.id_subgrupo = s.id_subgrupo ";
			$sql .= "and n2.id_n1 = n1.id_n1 ";
			$sql .= "and n1.n1_perfil = '' and n2.n2_perfil = '' ";
			$sql .= "order by s.nome_subgrupo";
			$subgrupos = pegaDados($sql);	
			foreach ($subgrupos as $subgrupo)
			{
				kml_folder($subgrupo["nome_subgrupo"]);
				$id_n2 = $subgrupo["id_n2"];
				$sql = "select t.codigo_tema,t.nome_tema,t.link_tema, t.desc_tema from i3geoadmin_n3 as n3,i3geoadmin_temas as t where ";
				$sql .= "n3.id_n2='$id_n2' ";
				$sql .= "and n3.id_tema = t.id_tema ";
				$sql .= "and n3_perfil = '' ";
				$sql .= "and t.kml_tema != 'nao' ";
				$sql .= "and t.tipoa_tema = ''";
				$temas = pegadados($sql);
				foreach ($temas as $tema)
				{
					$fonte = $tema["link_tema"];
					$nome = $tema["nome_tema"];
					$id = $tema["codigo_tema"];
					$desc = $tema["desc_tema"];
					$fonte = "<a href='$fonte' >Fonte </a>";
    				$legenda = "<a href='$urli3geo/ogc.php?tema=$id&layer=$id&request=getlegendgraphic&service=wms&format=image/jpeg' >Legenda </a>";
					$href = "$urli3geo/ogc.php?tema=$id&amp;width=800&amp;height=800&amp;VERSION=1.1.1&amp;REQUEST=GetMap&amp;SRS=EPSG:4326&amp;STYLES=&amp;BGCOLOR=0xFFFFFF&amp;FORMAT=image/png&amp;TRANSPARENT=TRUE&amp;layers=$id";
					kml_servico($nome,$fonte,$legenda,$desc,$href);
				}
				echo "</Folder>\n";
			}
			echo "</Folder>\n";
		}
		echo "</Folder>\n";
	}
}
echo "</Document></kml>\n";
function kml_cabecalho($nome,$desc)
{
	echo "<Folder>\n";
	echo " <name>".str_replace("&","&amp;",$nome)."</name>\n";
	echo " <description>".str_replace("&","&amp;",$desc)."</description>\n";
	echo " <open>0</open><visibility>0</visibility>\n";	
}
function kml_folder($nome)
{
	echo " <Folder>\n";
	echo "  <name>".str_replace("&","&amp;",$nome)."</name>\n";
	echo "  <description></description>\n";
	echo "  <open>0</open><visibility>0</visibility>\n";
}
function kml_tema($tema)
{
	global $urli3geo;
	$nome = mb_convert_encoding($tema->TNOME,"auto","auto");
	$desc = mb_convert_encoding($tema->TDESC,"auto","auto");
	$id = mb_convert_encoding($tema->TID,"auto","auto");
	$fonte = mb_convert_encoding($tema->TLINK,"auto","auto");
	$tipoa = "";
	if($tema->TIPOA)
	$tipoa = mb_convert_encoding($tema->TIPOA,"auto","auto");
	$ogc = sim;
	if($tema->TID)
	{$kml = mb_convert_encoding($tema->KML,"auto","auto");}
	if(strtolower($kml) != "nao" && strtolower($tipoa) != "wms")
	{
		$fonte = "<a href='$fonte' >Fonte </a>";
		$legenda = "<a href='$urli3geo/ogc.php?tema=$id&layer=$id&request=getlegendgraphic&service=wms&format=image/jpeg' >Legenda </a>";
		$href = "$urli3geo/ogc.php?tema=$id&amp;width=800&amp;height=800&amp;VERSION=1.1.1&amp;REQUEST=GetMap&amp;SRS=EPSG:4326&amp;STYLES=&amp;BGCOLOR=0xFFFFFF&amp;FORMAT=image/png&amp;TRANSPARENT=TRUE&amp;layers=$id";
		kml_servico($nome,$fonte,$legenda,$desc,$href);
	}
}
function kml_servico($nome,$fonte,$legenda,$desc,$href)
{
	echo "   <GroundOverlay>\n";
	echo "    <name>".str_replace("&","&amp;",$nome)."</name>\n";
	echo "    <description><![CDATA[".$fonte.$legenda.$desc."]]></description>\n";
	echo "    <visibility>0</visibility>\n";      
	echo "    <Icon>\n";
	echo "    <viewRefreshMode>onStop</viewRefreshMode>\n";
	echo "    <href>$href</href>\n";
	echo "    </Icon>\n";
	echo "    <LatLonBox><north>9.49014618085</north><south>-39.3925604735</south><east>-29.5851853</east><west>-76.5125927</west></LatLonBox>\n";
	echo "   </GroundOverlay>\n";
}
?>