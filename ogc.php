<?php
/*
Title: Gerador automático de web services OGC

Gera web services nos padrões OGC baseado no menutemas.xml

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

File: i3geo/ogc.php

19/6/2007

Include:
<ms_configura.php> <classesphp/pega_variaveis.php>

Parameters:

lista - se for igual a "temas", mostra uma lista dos temas disponíveis

ajuda - se for definida na URL, mostra uma ajuda ao usuário

tema - nome do tema do serviço. Se for definido, o web service conterá apenas o tema.

intervalo - valor inicial e final com o número de temas que serão mostrados no serviço

About: Exemplos

ogc.php?lista=temas

ogc.php?tema=bioma

ogc.php?intervalo=0,50
*/
error_reporting(0);
if (!function_exists('ms_GetVersion'))
{
	if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
	{
		if(!@dl('php_mapscript_48.dll'))
		dl('php_mapscript.dll');
	}
	else
	{dl('php_mapscript.so');}
}
include("ms_configura.php");
include("classesphp/pega_variaveis.php");
//pega a lista de grupos
if ($lista == "temas")
{
	$xml = simplexml_load_file("menutemas/menutemas.xml");
	echo "<b>Lista de temas por grupos e subgrupos (os códigos dos temas estão em vermelho)</b><br><br>";
	foreach($xml->GRUPO as $grupo)
	{
		echo "<br><b>".mb_convert_encoding($grupo->GTIPO,"HTML-ENTITIES","auto")."</b><br>";
		foreach($grupo->SGRUPO as $sgrupo)
		{
			echo "&nbsp;&nbsp;&nbsp;".mb_convert_encoding($sgrupo->SDTIPO,"HTML-ENTITIES","auto")."<br>";
			foreach($sgrupo->TEMA as $tema)
			{
				if (mb_convert_encoding($tema->OGC,"HTML-ENTITIES","auto") == "")
				{
					echo "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
					echo "<span style=color:red >".mb_convert_encoding($tema->TID,"HTML-ENTITIES","auto")."</span>";
					echo "&nbsp;-&nbsp;".mb_convert_encoding($tema->TNOME,"HTML-ENTITIES","auto")." - ";
					if (mb_convert_encoding($tema->TLINK,"HTML-ENTITIES","auto") != "")
					{echo "<a href='".mb_convert_encoding($tema->TLINK,"HTML-ENTITIES","auto")."' >fonte</a>";}
					echo "<br>";
				}
			}
		}
	}
	return;
}
if (isset($ajuda))
{
	echo "<pre><b>Construtor de web services do I3Geo.</b><br><br>";
	echo "Esse utilitário usa o arquivo menutemas.xml para gerar web services no padrão OGC.";
	echo "Para escolher um tema, utilize:<br>";
	echo "ogc.php?lista=temas - para listar os temas disponíveis<br>";
	echo "Para usar esse web service, além dos parâmetros normais, vc deverá incluir o parâmetro &tema=,<br>";
	echo "ou seja,http://[host]/i3geo/ogc.php?tema=[código do tema obtido do menutemas.xml]<br><br>";
	echo "Se não for desejado que um tema apareça na lista, é necessário incluir a tag <OGC>nao</OGC> no registro do tema no arquivo menutemas.xml.<br>";
	echo "Utilize o parametro &intervalo=0,20 para definir o número de temas.";
	return;
}
//
//cria o web service
//
include("classesphp/funcoes_gerais.php");
$req = ms_newowsrequestobj();
$tipo = "";
foreach ($_GET as $k=>$v)
{
	$req->setParameter($k, $v);
	if(strtolower($v) == "getcapabilities")
	{$tipo = "metadados";}
	if(strtolower($k) == "layers")
	{$tema = $v;}
}
if(isset($tema))
{$tipo = "";}
$req->setParameter("VeRsIoN","1.1.0");
$oMap = ms_newMapobj("aplicmap/ogcws.map");
$proto = "http" . ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? "s" : "") . "://";
$server = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : $_SERVER['SERVER_NAME'];
$or = $proto.$server.$_SERVER['PHP_SELF'];
if((isset($tema)) && ($tema != "") && ($tipo=="metadados"))
{$or = $or."tema=".$tema."&";}
$oMap->setmetadata("ows_onlineresource",$or);
$oMap->setmetadata("ows_title",$tituloInstituicao." - i3geo");
if (!isset($intervalo))
{$intervalo = "0,50";}
if ($tipo == "")
{
	$tema = explode(" ",$tema);
	foreach ($tema as $t)
	{
		$nmap = ms_newMapobj("temas/".$t.".map");
		$ts = $nmap->getalllayernames();
		foreach ($ts as $t)
		{
			$l = $nmap->getlayerbyname($t);
			$l->setmetadata("ows_title",pegaNome($l));
			$l->setmetadata("ows_srs","EPSG:4291 EPSG:4326");
			$l->set("status",MS_OFF);
			$l->setmetadata("gml_include_items","all");
			$l->set("dump",MS_TRUE);
			$l->setmetadata("WMS_INCLUDE_ITEMS","all");
			$l->setmetadata("WFS_INCLUDE_ITEMS","all");
			$c = $l->getclass(0);
			if ($c->name == "")
			{$c->name = " ";}
			if (isset($postgis_mapa))
			{
				if ($postgis_mapa != "")
				{
					if ($l->connectiontype == MS_POSTGIS)
					{
						if ($l->connection == " ")
						{
							$l->set("connection",$postgis_mapa);
						}
					}
				}
			}
			ms_newLayerObj($oMap, $l);
		}
	}
}
else
{
	$conta = 0;
	$int = explode(",",$intervalo);
	$xml = simplexml_load_file("menutemas/menutemas.xml");
	foreach($xml->GRUPO as $grupo)
	{
		foreach($grupo->SGRUPO as $sgrupo)
		{
			foreach($sgrupo->TEMA as $tm)
			{
				if (mb_convert_encoding($tm->OGC,"HTML-ENTITIES","auto") == "")
				{
					if (@ms_newMapobj("temas/".(mb_convert_encoding($tm->TID,"HTML-ENTITIES","auto")).".map"))
					{
						$nmap = ms_newMapobj("temas/".(mb_convert_encoding($tm->TID,"HTML-ENTITIES","auto")).".map");
						$ts = $nmap->getalllayernames();
						if (count($ts) == 1)
						{ 
							foreach ($ts as $t)
							{
								$conta++;
								if (($conta >= $int[0]) && ($conta <= $int[1]))
								{
									$l = $nmap->getlayerbyname($t);
									$l->setmetadata("ows_title",mb_convert_encoding(pegaNome($l),"HTML-ENTITIES","auto"));
									$l->setmetadata("ows_srs","EPSG:4291 EPSG:4326");
									$l->set("status",MS_OFF);
									$l->setmetadata("gml_include_items","all");
									$l->set("dump",MS_TRUE);
									$l->setmetadata("WMS_INCLUDE_ITEMS","all");
									$l->setmetadata("WFS_INCLUDE_ITEMS","all");
									$l->setmetadata("ows_metadataurl_href",mb_convert_encoding($tm->TLINK,"HTML-ENTITIES","auto"));
									$l->setmetadata("ows_metadataurl_type","TC211");
									$l->setmetadata("ows_metadataurl_format","text/html");
									ms_newLayerObj($oMap, $l);
								}
							}
						}
					}
				}
			}
		}		
	}
}
ms_ioinstallstdouttobuffer();
$oMap->owsdispatch($req);
$contenttype = ms_iostripstdoutbuffercontenttype();
header("Content-type: $contenttype");
ms_iogetStdoutBufferBytes();
ms_ioresethandlers();
?>