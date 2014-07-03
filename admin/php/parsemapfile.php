<?php
/*
Title: parsemapfile.php

Converte um mapfile em um arquivo XML

O padr&atilde;o XML utilizado &eacute; compat&iacute;vel com a estrutura de um projeto do softwrae GVSIG ate a vers&atilde;o 1.1
Esse XML &eacute; utilizado pelo plugin do i3Geo para GVSIG, que permite visualizar a &aacute;rvore de temas do i3Geo dentro do GVSIG.

No caso de layers que fazem acesso a banco de dados, a string de conexao e bloqueada por default

Para desbloquear e necessario editar a variavel de configuracao existente nesse mesmo arquivo

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c�pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/admin/php/parsemapfile.php
*/
include(dirname(__FILE__)."/../../ms_configura.php");
include_once(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");
include_once(dirname(__FILE__)."/../../classesphp/carrega_ext.php");
include_once(dirname(__FILE__)."/../../classesphp/pega_variaveis.php");
//
//essa variavel indica se a senha do banco e bloqueada ou nao caso
//o tema seja do tipo postgis
//por default e feito o bloqueio
//
$bloqueiaStringConexao = true;
//
error_reporting(0);
if(!isset($forcawms)){$forcawms = "nao";}
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

$codigoLayer = $id;
$mapfile = $locaplic."/temas/".$codigoLayer.".map";
//remove temas restritos pelo sistema de controle de usuarios
$indevidos = validaAcessoTemas($mapfile,false);
if($indevidos == true){
	echo "Encontrados layers restritos";
	exit;
}
//
$mapa = ms_newMapObj($mapfile);
if(!isset($tipoparse) || $tipoparse=="")
{mapfile();exit;}

if($tipoparse == "legenda")
{
	$tipoLegenda = tipoLegenda($layername);
	if($tipoLegenda == "simples")
	{legendaSimples($layername);}
	if($tipoLegenda == "valorunico")
	legendaValorUnico($layername);
}
//
//verifica o tipo de legenda
//pode retornar:
//simples - o layer n&atilde;o ter&aacute; classes
//valorunico - as classes s&atilde;o definidas por um item
//intervalo - as classes s&atilde;o definidas por um intervalo do mesmo item
//
function tipoLegenda($layername)
{
	global $mapa;
	$tipolegenda = "";
	$layer = $mapa->getlayerbyname($layername);
	$nclasses = $layer->numclasses;
	if($nclasses == 1)
	{
		$classe = $layer->getclass(0);
		$expressao = $classe->getExpressionString();
		if($expressao == "")
		{return "simples";exit;}
		$expressao = str_replace("'eq'","=");
		$expressao = str_replace("'eq '","=");
		$expressao = str_replace("' eq'","=");
		$expressao = str_replace("' eq '","=");
		if(count(explode("=",$expressao)) != 2)
		{return "simples";exit;}
	}
	$verItem = array();
	for($i=0;$i<$nclasses;++$i)
	{
		$classe = $layer->getclass($i);
		$expressao = $classe->getExpressionString();
		if(count(explode("[",$expressao)) > 2)
		{
			return "intervalo";
			exit;
		}
		//
		//verifica se os itens s&atilde;o &uacute;nicos nas express&otilde;es
		//
		$item = preg_replace('/.*\[|\].*/i','\1', $expressao);
		$verItem[$item] = 0;
	}
	if(count($verItem) == 1)
	return "valorunico";
	else
	return "simples";
}
function legendaValorUnico($layername)
{
	global $mapa;
	$tipolegenda = "";
	$layer = $mapa->getlayerbyname($layername);
	$nclasses = $layer->numclasses;
	$outlinecolor = array();
	$color = array();
	$nomes = array();
	$valor = array();
	//
	$classe = $layer->getclass(0);
	$expressao = $classe->getExpressionString();
	$item = preg_replace('/.*\[|\].*/i','\1', $expressao);
	for($i=0;$i<$nclasses;++$i)
	{
		$classe = $layer->getclass($i);
		$estilo = $classe->getstyle(0);
		$nomes[] = $classe->name;
		$cor = $estilo->outlinecolor;
		$outlinecolor[] = "'".$cor->red.",".$cor->green.",".$cor->blue.",255'";
		$cor = $estilo->color;
		$color[] = "'".$cor->red.",".$cor->green.",".$cor->blue.",255'";
		$expressao = $classe->getExpressionString();
		$expressao = str_replace("'eq","=",$expressao);
		$expressao = str_replace("'eq ","=",$expressao);
		$expressao = str_replace("' eq","=",$expressao);
		$expressao = str_replace("' eq ","=",$expressao);
		$temp = explode("=",$expressao);
		$temp = trim($temp[1]);
		$temp = trim(str_replace("'","",$temp));
		$temp = trim(str_replace(")","",$temp));
		$valor[] = trim(str_replace("'","",$temp));
	}
	//
	//monta o xml
	//
	$xml = "<"."\x3F"."xml version='1.0' encoding='ISO-8859-1' "."\x3F".">";
	$xml .= "<xml-tag xmlns='http://www.gvsig.gva.es'>\n";
	$xml .= "<property key='className' value='com.iver.cit.gvsig.fmap.rendering.VectorialUniqueValueLegend'/>\n";
	$xml .= "<property key='fieldName' value='$item'/>\n";
	$xml .= "<property key='labelfield'/><property key='labelFieldHeight'/><property key='labelFieldRotation'/><property key='useDefaultSymbol' value='true'/><property key='sorter' value='true'/>\n";
	$xml .= "<property key='numKeys' value='".(count($valor) + 1)."'/>\n";
	$xml .= "<property key='tipoValueKeys' value='com.hardcode.gdbms.engine.values.StringValue'/>\n";
	$xml .= "<property key='keys' value='Default ,".implode(" ,",$nomes)."'/>\n";
	$xml .= "<property key='values' value='Default ,".implode(" ,",$valor)."'/>\n";
	$temp = array();
	$temp[] = "1111";
	foreach($valor as $v)
	{$temp[] = "-1";}
	$temp = implode(" ,",$temp);
	//$temp = "1111 ,-1 ,-1 ,-1 ,-1 ,-1 ,-1";
	$xml .= "<property key='typeKeys' value='$temp'/>\n";
		$xml .= "<property key='typeValues' value='$temp'/>\n";
	$xml .= "<property key='followHeaderEncoding' value='true'/>\n";
	$xml .= "<xml-tag><property key='className' value='com.iver.cit.gvsig.fmap.core.v02.FSymbol'/><property key='m_symbolType' value='4'/><property key='m_Style' value='1'/><property key='m_useOutline' value='true'/><property key='m_Color' value='150,150,150,255'/><property key='m_outlineColor' value='255,255,255,255'/><property key='m_bUseFontSize' value='true'/><property key='m_bDrawShape' value='true'/><property key='m_Size' value='2'/><property key='m_Rotation' value='0'/><property key='m_LinePattern' value='0'/><property key='m_stroke' value='1.0'/><property key='m_bUseSize' value='false'/><property key='m_AlingVert' value='0'/><property key='m_AlingHoriz' value='0'/><property key='m_Descrip' value='Default'/><property key='rgb' value='-14902251'/></xml-tag>";
	$xml .= "<xml-tag><property key='className' value='com.iver.cit.gvsig.fmap.core.v02.FSymbol'/><property key='m_symbolType' value='4'/><property key='m_Style' value='1'/><property key='m_useOutline' value='true'/><property key='m_Color' value='150,150,150,255'/><property key='m_outlineColor' value='255,255,255,255'/><property key='m_bUseFontSize' value='true'/><property key='m_bDrawShape' value='true'/><property key='m_Size' value='2'/><property key='m_Rotation' value='0'/><property key='m_LinePattern' value='0'/><property key='m_stroke' value='1.0'/><property key='m_bUseSize' value='false'/><property key='m_AlingVert' value='0'/><property key='m_AlingHoriz' value='0'/><property key='m_Descrip' value='Default'/><property key='rgb' value='-14902251'/></xml-tag>\n";
	$c = count($valor);
	for($i=0;$i<$c;++$i)
	{
		$xml .= "<xml-tag>\n";
		$xml .= "<property key='className' value='com.iver.cit.gvsig.fmap.core.v02.FSymbol'/>\n";
		$xml .= "<property key='m_symbolType' value='4'/>\n";
		$xml .= "<property key='m_Style' value='1'/>\n";
		$temp = "true";
		if($outlinecolor[$i] == "'-1,-1,-1,255'"){$temp = "false";}
		$xml .= "<property key='m_useOutline' value='$temp'/>\n";
		if($color[$i] != "'-1,-1,-1,255'")
		$xml .= "<property key='m_Color' value=$color[$i]/>\n";
		if($temp != "false")
		$xml .= "<property key='m_outlineColor' value=$outlinecolor[$i]/>\n";
		$xml .= "<property key='m_bUseFontSize' value='true'/>\n";
		$xml .= "<property key='m_bDrawShape' value='true'/>\n";
		$xml .= "<property key='m_Size' value='2'/>\n";
		$xml .= "<property key='m_Rotation' value='0'/>\n";
		$xml .= "<property key='m_LinePattern' value='0'/>\n";
		$xml .= "<property key='m_stroke' value='1.0'/>\n";
		$xml .= "<property key='m_bUseSize' value='false'/>\n";
		$xml .= "<property key='m_AlingVert' value='0'/>\n";
		$xml .= "<property key='m_AlingHoriz' value='0'/>\n";
		$xml .= "<property key='m_Descrip' value='$nomes[$i]'/>\n";
		$xml .= "<property key='rgb' value='-16145084'/>\n";
		$xml .= "</xml-tag>\n";
	}
	$xml .= "</xml-tag>\n";
	echo header("Content-type: application/xml");
	echo $xml;
	exit;
}
function legendaSimples($layername)
{
	global $mapa;
	$tipolegenda = "";
	$layer = $mapa->getlayerbyname($layername);
	$classe = $layer->getclass(0);
	$estilo = $classe->getstyle(0);
	$cor = $estilo->color;
	$outcor = $estilo->outlinecolor;
	$xml = "<"."\x3F"."xml version='1.0' encoding='ISO-8859-1' "."\x3F".">";
	$xml .= "<xml-tag xmlns='http://www.gvsig.gva.es'>\n";
	$xml .= "<property key='className' value='com.iver.cit.gvsig.fmap.rendering.SingleSymbolLegend'/>\n";
	$xml .= "<property key='labelFieldName'/>\n";
	$xml .= "<property key='labelHeightFieldName'/>\n";
	$xml .= "<property key='labelRotationFieldName'/>\n";
	$xml .= "<property key='followHeaderEncoding' value='true'/>\n";
	$xml .= "<xml-tag>\n";
	$xml .= "<property key='className' value='com.iver.cit.gvsig.fmap.core.v02.FSymbol'/>\n";
	$xml .= "<property key='m_symbolType' value='4'/>\n";
	$xml .= "<property key='m_Style' value='1'/>\n";
	$xml .= "<property key='m_useOutline' value='true'/>\n";
	if($cor->red != -1)
	$xml .= "<property key='m_Color' value='".$cor->red.",".$cor->green.",".$cor->blue.",255'/>\n";
	if($outcor->red != -1)
	$xml .= "<property key='m_outlineColor' value='".$outcor->red.",".$outcor->green.",".$outcor->blue.",255'/>\n";
	else
	$xml .= "<property key='m_outlineColor' value='0,0,0,255'/>\n";
	$xml .= "<property key='m_bUseFontSize' value='true'/>\n";
	$xml .= "<property key='m_bDrawShape' value='true'/>\n";
	$xml .= "<property key='m_Size' value='2'/>\n";
	$xml .= "<property key='m_Rotation' value='0'/>\n";
	$xml .= "<property key='m_LinePattern' value='0'/>\n";
	$xml .= "<property key='m_stroke' value='1.0'/>\n";
	$xml .= "<property key='m_bUseSize' value='false'/>\n";
	$xml .= "<property key='m_AlingVert' value='0'/>\n";
	$xml .= "<property key='m_AlingHoriz' value='0'/>\n";
	$xml .= "<property key='m_Descrip'/>\n";
	$xml .= "<property key='rgb' value='-14902251'/>\n";
	$xml .= "</xml-tag>\n";
	$xml .= "</xml-tag>\n";
	echo header("Content-type: application/xml");
	echo $xml;
	exit;
}
//
//gera xml com par&acirc;metros do mapfile
//
function mapfile()
{
	global $codigoLayer,$mapfile,$mapa,$objcontype,$objlayertypes,$forcawms,$postgis_mapa,$bloqueiaStringConexao;
	$layers = $mapa->getalllayernames();
	$dados = array();
	$xml = "<"."\x3F"."xml version='1.0' encoding='ISO-8859-1' "."\x3F".">";
	$xml .= "\n<parsemapfile>\n";
	$xml .= "<tiposconexao>".implode(",",$objcontype)."</tiposconexao>\n";
	$xml .= "<tiposlayer>".implode(",",$objlayertypes)."</tiposlayer>\n";
	//verifica se tem grupos
	$nlayers = array();
	foreach ($layers as $layer)
	{
		$layer = $mapa->getlayerbyname($layer);
		if($objcontype[$layer->connectiontype] != MS_WMS )
		{
			if($layer->group == "")
			{$nlayers[] = $layer->name;}
			else
			{
				if($layer->group == $layer->name)
				{$nlayers[] = $layer->name;}
			}
			$layers = $nlayers;
		}
	}
	foreach ($layers as $layer)
	{
		$xml .= "\n<layer>\n";
		$layer = $mapa->getlayerbyname($layer);
		$xml .= "<titulo>".$layer->getmetadata('tema')."</titulo>\n";
		$d = $layer->data;
		if (@$layer->open() == MS_SUCCESS)
		{$colunas = implode(",",$layer->getItems());}
		else
		{$colunas = "*";}
		$ct = $objcontype[$layer->connectiontype];
		$tagLegenda = "parsemapfile.php?id=".$codigoLayer."&layername=".$layer->name."&tipoparse=legenda";
		$nomeLayer = $layer->name;
		if ($forcawms == "sim" || $ct == "MS_SHAPEFILE" || $ct == "" || $ct == "MS_RASTER" && $ct != "MS_WMS")
		{
			$ct = "MS_WMS";
			$d =  "http://".$_SERVER['HTTP_HOST'].str_replace("/admin/php/parsemapfile.php","",$_SERVER['PHP_SELF'])."/ogc.php?tema=".$codigoLayer;
			$xml .= "<version>1.1.1</version>";
			$xml .= "<srs>EPSG:4618</srs>";
			$xml .= "<format>image/png</format>";
			$xml .= "<style>default</style>";
			$tagLegenda = "";
		}
		else if($ct == "MS_WMS")
		{
			$d = $layer->connection;
			$v = $layer->getmetadata("wms_server_version");
			$e = $layer->getmetadata("wms_srs");
			$i = $layer->getmetadata("wms_format");
			$s = $layer->getmetadata("wms_style");
			$nomeLayer = $layer->getmetadata("wms_name");
			if($nomeLayer == "")
			$nomeLayer = $layer->getmetadata("ows_name");
			if($v == "")
			$v = $layer->getmetadata("ows_server_version");
			if($e == "")
			$e = $layer->getmetadata("ows_srs");
			if($i == "")
			$i = $layer->getmetadata("ows_format");
			if($s == "")
			$s = $layer->getmetadata("ows_style");
			if($s == "")
			{$s = "default";}
			$xml .= "<version>$v</version>";
			$xml .= "<srs>$e</srs>";
			$xml .= "<format>image/png</format>";
			$xml .= "<style>$s</style>";
			$tagLegenda = "";
		}
		$xml .= "<geraxmllegenda>$tagLegenda</geraxmllegenda>";
		$xml .= "<connectiontype>".$ct."</connectiontype>\n";
		$xml .= "<data>$d</data>\n";
		$xml .= "<name>$nomeLayer</name>\n";
		if($ct != "MS_WMS")
		{
			$xml .= "<connection>\n";
			$con = $layer->connection;
			if (($con == " ") || ($con == "") || (in_array($con,array_keys($postgis_mapa))))
			{
				if(($con == " ") || ($con == ""))
				{$con = $postgis_mapa;}
				else
				{$con = $postgis_mapa[$con];}
			}
			if($bloqueiaStringConexao == true){
				$xml .= "<user>bloqueado (veja i3geo/admin/php/parsemapfile)</user>\n";
				$xml .= "<password></password>\n";
				$xml .= "<dbname></dbname>\n";
				$xml .= "<host></host>\n";
				$xml .= "<port></port>\n";
			}
			else{
				$xml .= "<user>".preg_replace('/.*user\s*=\s*([a-zA-Z0-9_.]+).*/i', '\1', $con)."</user>\n";
				$xml .= "<password>".preg_replace('/.*password\s*=\s*([a-zA-Z0-9_.]+).*/i', '\1', $con)."</password>\n";
				$xml .= "<dbname>".preg_replace('/.*dbname\s*=\s*([a-zA-Z0-9_.]+).*/i', '\1', $con)."</dbname>\n";
				$xml .= "<host>".preg_replace('/.*host\s*=\s*([a-zA-Z0-9_.]+).*/i', '\1', $con)."</host>\n";
				$xml .= "<port>".preg_replace('/.*port\s*=\s*([a-zA-Z0-9_.]+).*/i', '\1', $con)."</port>\n";
			}
			$xml .= "</connection>\n";
			$d = explode("(",$d);
			$d = explode(")",$d[1]);
			$dstring = $d[0];
			$dstring = str_replace("the_geom","",$dstring);
			$dstring = str_replace("*",$colunas,$dstring);
			$xml .= "<colunas>$colunas</colunas>";
			$xml .= "<select>$dstring</select>\n";
			$string = preg_replace('/.*from\s*(.+).*/i', '\1', $d[0]);
			$s = explode("WHERE",$string);
			if(count($s) == 1)
			$s = explode("where",$string);
			$esquemaTabela = explode(".",$s[0]);
			$xml .= "<esquema>".$esquemaTabela[0]."</esquema>";
			$xml .= "<tabela>".$esquemaTabela[1]."</tabela>";
			$xml .= "<where>".$s[1]."</where>";
			$xml .= "<type>".$objlayertypes[$layer->type]."</type>\n";
			$xml .= "<filter>".$layer->getfilterstring()."</filter>\n";
			$xml .= "<filteritem>$layer->filteritem</filteritem>\n";
			//$xml .= "<labelangleitem>".$layer->labelangleitem."</labelangleitem>\n";
			$xml .= "<labelitem>$layer->labelitem</labelitem>\n";
			$xml .= "<labelmaxscale>$layer->labelmaxscaledenom</labelmaxscale>\n";
			$xml .= "<labelminscale>$layer->labelminscaledenom</labelminscale>\n";
			$xml .= "<labelsizeitem></labelsizeitem>\n";
		}
		$xml .= "<group>$layer->group</group>\n";
		$xml .= "<maxscale>$layer->maxscaledenom</maxscale>\n";
		$xml .= "<minscale>$layer->minscaledenom</minscale>\n";
		$xml .= "<offsite>".$layer->offsite->red.",".$layer->offsite->green.",".$layer->offsite->blue."</offsite>\n";
		$xml .= "<opacity>$layer->opacity</opacity>\n";
		if($ct != "MS_WMS")
		{
			$xml .= "<symbolscale>$layer->symbolscaledenom</symbolscale>\n";
			$xml .= "<tileindex>$layer->tileindex</tileindex>\n";
			$xml .= "<tileitem>$layer->tileitem</tileitem>\n";
			$xml .= "<tolerance>$layer->tolerance</tolerance>\n";
			$xml .= "<toleranceunits>$layer->toleranceunits</toleranceunits>\n";
			$xml .= "<sizeunits>$layer->sizeunits</sizeunits>\n";
			$xml .= "<projection>".$layer->getProjection()."</projection>\n";
			$xml .= "<classes>\n";
			$xml = pegaClasses($xml);
			$xml .= "</classes>\n";
		}
		$xml .= "</layer>";
	}
	$xml .= "</parsemapfile>\n";
	echo header("Content-type: application/xml");
	echo $xml;
}
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
		$xml .= "<expression>".$classe->getExpressionString()."</expression>\n";
		$xml .= "<keyimage>$classe->keyimage</keyimage>\n";
		$xml .= "<size>$classe->size</size>\n";
		$xml .= "<symbolname>$classe->symbolname</symbolname>\n";
		$xml .= "<type>$classe->type</type>\n";
		$xml .= "<estilos>\n";
		$xml = pegaEstilos($xml,$classe);
		$xml .= "</estilos>\n";
		$xml .= "</classe>\n";
	}
	return $xml;
}
function pegaEstilos($xml,$classe)
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
	return $xml;
}
?>