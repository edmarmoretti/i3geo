<?php
require_once("../../classesphp/pega_variaveis.php");
error_reporting(E_ALL);
session_name("i3GeoPHP");

if (isset($g_sid))
{session_id($g_sid);}
session_start();

foreach(array_keys($_SESSION) as $k)
{
	eval("\$".$k."='".$_SESSION[$k]."';");
}
if (!function_exists("ms_GetVersion"))
{
	$exts = get_loaded_extensions();
	if (array_search( "MapScript", $exts) != TRUE)
	{
		if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
		{
			if(!@dl('php_mapscript_48.dll'))
			dl('php_mapscript.dll');
		}
		else
		{dl('php_mapscript.so');}
	}
}
?>
<html>
<head>
<link rel="stylesheet" type="text/css" href="../../css/geral.css" />
<title></title>
</head>
<body bgcolor="white" style="background-color:white">
<p>
<?php
if (isset($_FILES['filedbf']['name']))
{
	//$ndir = dirname($filen);
	require_once ("../../ms_configura.php");
	$mapa = ms_newMapObj($map_file);
	echo "<p>Carregando o arquivo...</p>";
	$dirmap = dirname($map_file);
	//verifica nomes
	$statusNome = 1;
	if( (ereg('[^a-zA-Z0-9_\.]',$_FILES['filedbf']['name'])) || (!ereg('\.dbf$',$_FILES['filedbf']['name'])) )
	{$statusNome = 0;}
	if($statusNome != 1)
	{echo "Arquivos inválidos";exit;}
	//sobe arquivo
	$Arquivo = $_FILES['filedbf']['tmp_name'];
	$status =  move_uploaded_file($Arquivo,$dirmap."/".$_FILES['filedbf']['name']);
	if($status != 1)
	{echo "Ocorreu um erro no envio do arquivo";exit;}
	$nome = str_replace(".dbf","",$dirmap."/".$_FILES['filedbf']['name']);
	$nomex = strtoupper($nomex);
	$nomey = strtoupper($nomey);
	if($status == 1)
	{
		echo "<p>Arquivo enviado. Criando shape file...</p>";
		require_once("../../pacotes/phpxbase/api_conversion.php");
		$dbf = xbase_open($dirmap."/".$_FILES['filedbf']['name']);
		$records = xbase_numrecords($dbf);
		$record = array();
		$novoshpf = ms_newShapefileObj($nome, MS_SHP_POINT);
		$novoshpf->free();
		$shapefileObj = ms_newShapefileObj($nome,-2);
		for($x = 1; $x <= $records; $x++)
		{
    		$record = xbase_get_record_with_names($dbf, $x);
     		$poPoint = ms_newpointobj();
    		$poPoint->setXY($record[$nomex],$record[$nomey]);
    		$shapefileObj->addpoint($poPoint);
		}
		$shapefileObj->free();	
		$mapt = ms_newMapObj($temasaplic."/novotema.map");
		$novolayer = $mapt->getLayerByName("novotema");
		$novolayer->set("data",$nome.".shp");
		$novolayer->set("name",basename($nome));
		$novolayer->setmetadata("TEMA",basename($nome));
		$novolayer->setmetadata("DOWNLOAD","SIM");
		$novolayer->set("type",MS_LAYER_POINT);
		$novolayer->setfilter("");
		$classe = $novolayer->getclass(0);
		$estilo = $classe->getstyle(0);
		$estilo->set("symbolname","ponto");
		$estilo->set("size",6);
		// le os itens
		$novolayer->set("status",MS_DEFAULT);
		$abriu = $novolayer->open();
		$items = $novolayer->getItems();
		$fechou = $novolayer->close();
		if ($items != "")
		{
			$its = implode(",",$items);
			$novolayer->setmetadata("ITENS",$its);
			$novolayer->setmetadata("ITENSDESC",$its);
			$novolayer->set("template","none.htm");
		}
		//echo $epsg;
		
		if($epsg != "")
		{$novolayer->setProjection("init=epsg:".$epsg);}
		$adiciona = ms_newLayerObj($mapa, $novolayer);
		$salvo = $mapa->save($map_file);
		//grava os templates de cada tema
		echo "Tema criado!!!";
		echo "<script>window.parent.remapaf()</script>";
	}
	else
	{
		echo "<p>Erro ao enviar o arquivo.</p>";
		exit;
	}
}
?>
</body>
</html>