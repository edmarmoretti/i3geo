<?php
/*
Title: mapa_openlayers.php

Faz o processamento de um mapfile segundo as necessidades do i3geo, como por exemplo, fazendo a substituição
das variáveis de conexão com banco e outras operações específicas do i3Geo.

É utilizado especificamente nas interfaces que utilizam a biblioteca OpenLayers em LAYERS do tipo WMS.


Licenca:

GPL2

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

Arquivo:

i3geo/classesphp/mapa_openlayers.php

*/
error_reporting(E_ALL);
if (!function_exists('ms_GetVersion'))
{
	$s = PHP_SHLIB_SUFFIX;
	@dl( 'php_mapscript.'.$s );
	$ler_extensoes[] = 'php_mapscript';	
}
include_once("../ms_configura.php");

if(isset($_GET["BBOX"]))
{
	$_GET["mapext"] = str_replace(","," ",$_GET["BBOX"]);
	$_GET["map_size"] = $_GET["WIDTH"]." ".$_GET["HEIGHT"];
}

if (($postgis_mapa != "") || ($postgis_mapa != " "))
{substituiCon($_GET["map"],$postgis_mapa);}
$mapa = ms_newMapObj($_GET["map"]);
$qyfile = str_replace(".map",".qy",$_GET["map"]);
$qy = file_exists($qyfile);
if($qy)
{$mapa->loadquery($qyfile);}
$layersNames = $mapa->getalllayernames();
foreach ($layersNames as $layerName)
{
	$l = $mapa->getLayerByname($layerName);
	if ($l->getmetadata("classesnome") != "")
	{
		include_once("funcoes_gerais.php");
		autoClasses(&$l,$mapa);
	}
	if($layerName != $_GET["layer"])
	{$l->set("status",MS_OFF);}
	if($layerName == $_GET["layer"] || $l->group == $_GET["layer"] && $l->group != "")
	{$l->set("status",MS_DEFAULT);}
	$l->set("template","none.htm");
}
$map_size = explode(" ",$_GET["map_size"]);
$mapa->setsize($map_size[0],$map_size[1]);
$mapext = explode(" ",$_GET["mapext"]);
$mapa->setExtent($mapext[0],$mapext[1],$mapext[2],$mapext[3]);
$o = $mapa->outputformat;
$o->set("imagemode",MS_IMAGEMODE_RGBA);
if(!$qy)
{$img = $mapa->draw();}
else
{$img = $mapa->drawQuery();}
if (($postgis_mapa != "") || ($postgis_mapa != " "))
{restauraCon($_GET["map"],$postgis_mapa);}
echo header("Content-type: " . $o->mimetype  . "\n\n");
$img->saveImage("");
function nomeRandomico($n=10)
{
	$nomes = "";
	$a = 'azertyuiopqsdfghjklmwxcvbnABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$max = 51;
	for($i=0; $i < $n; ++$i)
	{$nomes .= $a{mt_rand(0, $max)};}
	return $nomes;
}

function substituiCon($map_file,$postgis_mapa)
{
	if ((isset($postgis_mapa)) && (file_exists($map_file)))
	{
		if (($postgis_mapa != "") || ($postgis_mapa != " "))
		{
			if(!@ms_newMapObj($map_file)){return false;}
			$objMap = ms_newMapObj($map_file);
			$numlayers = $objMap->numlayers;
			for ($i=0;$i < $numlayers;++$i)
			{
				$layer = $objMap->getlayer($i);
				if ($layer->connectiontype == MS_POSTGIS)
				{
					$lcon = $layer->connection;
					if(isset($postgis_mapa) && $postgis_mapa != "")
					{
						if (($lcon == " ") || ($lcon == "") || (in_array($lcon,array_keys($postgis_mapa))))
						{
							//
							//o metadata CONEXAOORIGINAL guarda o valor original para posterior substituição
							//			
							if(($lcon == " ") || ($lcon == ""))
							{
								$layer->set("connection",$postgis_mapa);
								$layer->setmetadata("CONEXAOORIGINAL",$lcon);
							}
							else
							{
								$layer->set("connection",$postgis_mapa[$lcon]);
								$layer->setmetadata("CONEXAOORIGINAL",$lcon);
							}					
						}
					}
				}
			}
			$objMap->save($map_file);
		}
	}
	return true;
}

function restauraCon($map_file,$postgis_mapa)
{
	if(!@ms_newMapObj($map_file)){return;}
	if(isset($postgis_mapa) && $postgis_mapa != "")
	{
		$objMap = ms_newMapObj($map_file);
		$numlayers = $objMap->numlayers;
		for ($i=0;$i < $numlayers;++$i)
		{
			$layer = $objMap->getlayer($i);
			if ($layer->connectiontype == MS_POSTGIS)
			{
				if (!is_array($postgis_mapa) && $layer->connection == $postgis_mapa)
				{$layer->set("connection"," ");}
				if($layer->getmetadata("conexaooriginal") != "")
				{$layer->set("connection",$layer->getmetadata("conexaooriginal"));}
			}
		}
		$objMap->save($map_file);
	}
}

?>