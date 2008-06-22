<?php
include_once("../../ms_configura.php");
include_once("../../classesphp/funcoes_gerais.php");

$objcontype[0] = "MS_INLINE";
$objcontype[1] = "MS_SHAPEFILE";
$objcontype[2] = "MS_TILED_SHAPEFILE";
$objcontype[3] = "MS_SDE";
$objcontype[4] = "MS_OGR";
$objcontype[5] = "MS_TILED_OGR";
$objcontype[6] = "MS_POSTGIS";
$objcontype[7] = "MS_WMS";
$objcontype[8] = "MS_ORACLESPATIAL";
$objcontype[9] = "MS_WFS";
$objcontype[10] = "MS_GRATICULE";
$objcontype[11] = "MS_MYGIS";
$objcontype[12] = "MS_RASTER";
$objcontype[13] = "MS_PLUGIN";

$objlayertypes[0] = "MS_LAYER_POINT";
$objlayertypes[1] = "MS_LAYER_LINE";
$objlayertypes[2] = "MS_LAYER_POLYGON";
$objlayertypes[3] = "MS_LAYER_RASTER";
$objlayertypes[4] = "MS_LAYER_ANNOTATION";
$objlayertypes[5] = "MS_LAYER_QUERY";
$objlayertypes[6] = "MS_LAYER_CIRCLE";
$objlayertypes[7] = "MS_LAYER_TILEINDEX";
$objlayertypes[8] = "MS_LAYER_CHART";

$dados = array();
$codigoLayer = $id;
$mapfile = "../../temas/".$codigoLayer.".map";
$mapa = ms_newMapObj($mapfile);
$layers = $mapa->getalllayernames();
$xml = "<"."\x3F"."xml version='1.0' encoding='ISO-8859-1' "."\x3F".">";
$xml .= "\n<parsemapfile>\n";
$xml .= "<tiposconexao>".implode(",",$objcontype)."</tiposconexao>\n";
$xml .= "<tiposlayer>".implode(",",$objlayertypes)."</tiposlayer>\n";
foreach ($layers as $layer)
{
	$xml .= "\n<layer>\n";
	$layer = $mapa->getlayerbyname($layer);
	$xml .= "<titulo>".$layer->getmetadata('tema')."</titulo>\n";
	$xml .= "<connection>\n";
	$con = $layer->connection;
	$xml .= "<user>".preg_replace('/.*user\s*=\s*([a-zA-Z0-9_.]+).*/i', '\1', $con)."</user>\n";
	$xml .= "<password>".preg_replace('/.*password\s*=\s*([a-zA-Z0-9_.]+).*/i', '\1', $con)."</password>\n";
	$xml .= "<dbname>".preg_replace('/.*dbname\s*=\s*([a-zA-Z0-9_.]+).*/i', '\1', $con)."</dbname>\n";
	$xml .= "<host>".preg_replace('/.*host\s*=\s*([a-zA-Z0-9_.]+).*/i', '\1', $con)."</host>\n";
	$xml .= "<port>".preg_replace('/.*port\s*=\s*([a-zA-Z0-9_.]+).*/i', '\1', $con)."</port>\n";
	$xml .= "</connection>\n";
	$xml .= "<connectiontype>".$objcontype[$layer->connectiontype]."</connectiontype>\n";
	$d = $layer->data;
	$xml .= "<data>$d</data>\n";
	$d = explode("(",$d);
	$d = explode(")",$d[1]);
	$xml .= "<select>$d[0]</select>\n";
	$xml .= "<type>".$objlayertypes[$layer->type]."</type>\n";
	$xml .= "<filter>".$layer->getfilter()."</filter>\n";
	$xml .= "<filteritem>$layer->filteritem</filteritem>\n";
	$xml .= "<group>$layer->group</group>\n";
	$xml .= "<labelangleitem>$layer->labelangleitem</labelangleitem>\n";
	$xml .= "<labelitem>$layer->labelitem</labelitem>\n";
	$xml .= "<labelmaxscale>$layer->labelmaxscale</labelmaxscale>\n";
	$xml .= "<labelminscale>$layer->labelminscale</labelminscale>\n";
	$xml .= "<labelsizeitem>$layer->labelsizeitem</labelsizeitem>\n";
	$xml .= "<maxscale>$layer->maxscale</maxscale>\n";
	$xml .= "<minscale>$layer->minscale</minscale>\n";
	$xml .= "<offsite>".$layer->offsite->red.",".$layer->offsite->green.",".$layer->offsite->blue."</offsite>\n";
	$xml .= "<opacity>$layer->opacity</opacity>\n";
	$xml .= "<symbolscale>$layer->symbolscale</symbolscale>\n";
	$xml .= "<tileindex>$layer->tileindex</tileindex>\n";
	$xml .= "<tileitem>$layer->tileitem</tileitem>\n";
	$xml .= "<tolerance>$layer->tolerance</tolerance>\n";
	$xml .= "<toleranceunits>$layer->toleranceunits</toleranceunits>\n";
	$xml .= "<sizeunits>$layer->sizeunits</sizeunits>\n";
	$xml .= "<projection>$layer->getProjection</projection>\n";
	$xml .= "<name>$layer->name</name>\n";
	$xml .= "<classes>\n";
	$xml .= pegaClasses(&$xml);
	$xml .= "</classes>\n";
	$xml .= "</layer>";
}
$xml .= "</parsemapfile>\n";
echo $xml;
function pegaClasses($xml)
{
	global $layer;
	$dados = array();
	$nclasses = $layer->numclasses;
	for($i=0;$i<$nclasses;++$i)
	{
		$xml .= "<classe>\n";
		$classe = $layer->getclass($i);
		$xml .= "<name>".mb_convert_encoding(($classe->name),"UTF-8","ISO-8859-1")."</name>\n";
		$xml .= "<expression>".$classe->getExpression()."</expression>\n";
		$xml .= "<keyimage>$classe->keyimage</keyimage>\n";
		$xml .= "<size>$classe->size</size>\n";
		$xml .= "<symbolname>$classe->symbolname</symbolname>\n";
		$xml .= "<type>$classe->type</type>\n";
		$xml .= "<estilos>\n";
		pegaEstilos($xml,$classe);
		$xml .= "</estilos>\n";
		$xml .= "</classe>\n";
	}
}
function pegaEstilos(&$xml,$classe)
{
	$numestilos = $classe->numstyles;
	$estilos = array();
	for($j=0;$j<$numestilos;++$j)
	{
		$xml .= "<estilo>\n";
		$estilo = $classe->getstyle($j);
		$xml .= "<symbolname>$estilo->symbolname</symbolname>\n";
		$xml .= "<color>".$estilo->color->red.",".$estilo->color->green.",".$estilo->color->blue."</color>\n";
		$xml .= "<size>$estilo->size</size>\n";
		$xml .= "<backgroundcolor>".$estilo->backgroundcolor->red.",".$estilo->backgroundcolor->green.",".$estilo->backgroundcolor->blue."</backgroundcolor>\n";
		$xml .= "<outlinecolor>".$estilo->outlinecolor->red.",".$estilo->outlinecolor->green.",".$estilo->outlinecolor->blue."</outlinecolor>\n";
		$xml .= "</estilo>\n";
	}
}

?>