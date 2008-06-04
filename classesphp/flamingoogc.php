<?php
/*
Title: Gerador automático de web services OGC para a interface flamingo do i3geo

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

File: i3geo/flamingoogc.php

19/6/2007

Include:
<ms_configura.php> <classesphp/pega_variaveis.php>

Parameters:

lista - se for igual a "temas", mostra uma lista dos temas disponíveis

ajuda - se for definida na URL, mostra uma ajuda ao usuário

tema - nome do tema do serviço. Se for definido, o web service conterá apenas o tema.

intervalo - valor inicial e final com o número de temas que serão mostrados no serviço

legenda - mostra a legenda no corpo do mapa sim|nao

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
require_once("carrega_ext.php");
include("../ms_configura.php");
include("pega_variaveis.php");
//
//cria o web service
//
include("funcoes_gerais.php");
$req = ms_newowsrequestobj();
$tipo = "";
foreach ($_GET as $k=>$v)
{
	$req->setParameter($k, $v);
}
$req->setParameter("VeRsIoN","1.1.0");
$oMap = ms_newMapobj("../aplicmap/ogcws.map");
$proto = "http" . ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? "s" : "") . "://";
$server = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : $_SERVER['SERVER_NAME'];
$or = $proto.$server.$_SERVER['PHP_SELF'];
$oMap->setmetadata("ows_onlineresource",$or."?g_sid=".$g_sid);
$oMap->setmetadata("ows_title",$tituloInstituicao." - i3geo");
session_name("i3GeoPHP");
if (isset($g_sid) && $g_sid != "")
{session_id($g_sid);}
session_start();
foreach(array_keys($_SESSION) as $k)
{
	eval("\$".$k."='".$_SESSION[$k]."';");
}
$nmap = ms_newMapobj($map_file);
$ts = $nmap->getalllayernames();
foreach ($ts as $t)
{
	$l = $nmap->getlayerbyname($t);
	if($l->connectiontype != MS_WMS)
	{
		$l->setmetadata("ows_title",pegaNome($l));
		//$l->setmetadata("ows_name",$t);
		$l->setmetadata("ows_srs","EPSG:4291 EPSG:4326");
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
	}
	ms_newLayerObj($oMap, $l);
}
//$req->setParameter("LAYERS","i3geoogc");
ms_ioinstallstdouttobuffer();
$oMap->owsdispatch($req);
$contenttype = ms_iostripstdoutbuffercontenttype();
header("Content-type: $contenttype");
ms_iogetStdoutBufferBytes();
ms_ioresethandlers();
?>