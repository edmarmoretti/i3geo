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
echo '<?xml version="1.0" encoding="UTF-8"?>';
echo "<kml xmlns='http://earth.google.com/kml/2.2'>\n";
//
//pega os endereços para compor a url de chamada do gerador de web services
//ogc.php
//
$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
$protocolo = $protocolo[0];
$protocolo1 = strtolower($protocolo . '://'.$_SERVER['SERVER_NAME']);
$protocolo = $protocolo . '://'.$_SERVER['SERVER_NAME'] .":". $_SERVER['SERVER_PORT'];
$urli3geo = str_replace("/kml.php","",$protocolo.$_SERVER["PHP_SELF"]);
//
//pega a lista de menus que será processada
//se a variável definida em ms_configura for = "", a busca é feita
//pelo método Menutemas
//
if(!isset($perfil)){$perfil = "";}
if ($menutemas == "")
{
	$m = new Menutemas("",$perfil,$locsistemas,$locaplic,"",$urli3geo);
	foreach($m->pegaListaDeMenus() as $menu)
	{
		$menus[] = $menu["url"];
	}
}
else
{
	foreach($menutemas as $m)
	{
		$menus[] = $m["arquivo"];
	}
}
if(!isset($menus))
$menus = array("/opt/www/html/i3geo/menutemas/menutemas.xml");
//
//monta o xml
//
echo "<Document><name>Menu i3geo</name><open>0</open><description></description><visibility>0</visibility>\n";
foreach ($menus as $menu)
{
	$xml = simplexml_load_file($menu);
	foreach($xml->GRUPO as $grupo)
	{
		$nome = mb_convert_encoding($grupo->GTIPO,"auto","auto");
		$desc = mb_convert_encoding($grupo->DTIPO,"auto","auto");
		echo "<Folder>\n";
		echo "<name>".str_replace("&","&amp;",$nome)."</name>\n";
		echo "<description>".str_replace("&","&amp;",$desc)."</description>\n";
		echo "<open>0</open><visibility>0</visibility>\n";
		foreach($grupo->SGRUPO as $sgrupo)
		{
			echo "<Folder>\n";
			$nome = mb_convert_encoding($sgrupo->SDTIPO,"auto","auto");
			echo "<name>".str_replace("&","&amp;",$nome)."</name>\n";
			echo "<description></description>\n";
			echo "<open>0</open><visibility>0</visibility>\n";
			foreach($sgrupo->TEMA as $tema)
			{
				$nome = mb_convert_encoding($tema->TNOME,"auto","auto");
				$desc = mb_convert_encoding($tema->TDESC,"auto","auto");
				$id = mb_convert_encoding($tema->TID,"auto","auto");
				$fonte = mb_convert_encoding($tema->TLINK,"auto","auto");
				$tipoa = "";
				if($tema->TIPOA)
				$tipoa = mb_convert_encoding($tema->TIPOA,"auto","auto");
				$ogc = sim;
				if($tema->TID)
				{
					$kml = mb_convert_encoding($tema->KML,"auto","auto");
				}
				if(strtolower($kml) != "nao" && strtolower($tipoa) != "wms")
				{
					echo "<GroundOverlay>\n";
    				echo "<name>".str_replace("&","&amp;",$nome)."</name>\n";
    				$fonte = "<a href='$fonte' >Fonte </a>";
    				$legenda = "<a href='$urli3geo/ogc.php?tema=$id&layer=$id&request=getlegendgraphic&service=wms&format=image/jpeg' >Legenda </a>";
					echo "<description><![CDATA[".$fonte.$legenda.$desc."]]></description>\n";
					echo "<visibility>0</visibility>\n";      
					echo "<Icon>\n";
					$l = $protocolo."/i3geo/ogc.php?tema=$id&amp;width=800&amp;height=800&amp;VERSION=1.1.1&amp;REQUEST=GetMap&amp;SRS=EPSG:4326&amp;STYLES=&amp;BGCOLOR=0xFFFFFF&amp;FORMAT=image/png&amp;TRANSPARENT=TRUE&amp;layers=$id";
					echo "<viewRefreshMode>onStop</viewRefreshMode>\n";
					echo "<href>$l</href>\n";
					echo "</Icon>\n";
					echo "<LatLonBox><north>9.49014618085</north><south>-39.3925604735</south><east>-29.5851853</east><west>-76.5125927</west></LatLonBox>\n";
					echo "</GroundOverlay>\n";
				}
			}		
			echo "</Folder>\n";	
		}
		echo "</Folder>\n";
	}
}
echo "</Document></kml>\n";
?>