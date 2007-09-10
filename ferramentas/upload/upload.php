<html>
<head>
<link rel="stylesheet" type="text/css" href="../../css/geral.css" />
<title></title>
</head>
<body bgcolor="white" style="background-color:white">
<p>
<?php
require_once("../../classesphp/pega_variaveis.php");
error_reporting(0);
session_name("i3GeoPHP");
if (isset($g_sid))
{session_id($g_sid);}
session_start();
foreach(array_keys($_SESSION) as $k)
{
	eval("\$".$k."='".$_SESSION[$k]."';");
}
if (!function_exists(ms_GetVersion))
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
if (isset($_FILES['fileshp']['name']))
{
	$ndir = dirname($filen);
	require_once ("../../ms_configura.php");
	$mapa = ms_newMapObj($map_file);
	echo "<p>Carregando o arquivo...</p>";
	$dirmap = dirname($map_file);
	//verifica nomes
	$statusNome = 1;
	if( (ereg('[^a-zA-Z0-9\.]',$nome)) || (!ereg('\.shp$',$_FILES['fileshp']['name'])) )
	{$statusNome = 0;}
	if( (ereg('[^a-zA-Z0-9\.]',$nome)) || (!ereg('\.shx$',$_FILES['fileshx']['name'])) )
	{$statusNome = 0;}
	if( (ereg('[^a-zA-Z0-9\.]',$nome)) || (!ereg('\.dbf$',$_FILES['filedbf']['name'])) )
	{$statusNome = 0;}
	if($statusNome != 1)
	{echo "Arquivos inválidos";exit;}
	//sobe arquivo
	$Arquivo = $_FILES['fileshp']['tmp_name'];
	$status =  move_uploaded_file($Arquivo,$dirmap."/".$_FILES['fileshp']['name']);
	$Arquivo = $_FILES['fileshx']['tmp_name'];
	$status =  move_uploaded_file($Arquivo,$dirmap."/".$_FILES['fileshx']['name']);
	$Arquivo = $_FILES['filedbf']['tmp_name'];
	$status =  move_uploaded_file($Arquivo,$dirmap."/".$_FILES['filedbf']['name']);
	if($status != 1)
	{echo "Ocorreu um erro no envio do arquivo shp";exit;}
	if($status == 1)
	{
		echo "<p>Arquivo enviado. Adicionando tema...</p>";
		$mapt = ms_newMapObj($temasaplic."/novotema.map");
		$novolayer = $mapt->getLayerByName("novotema");
		$novolayer->set("data",$dirmap."/".$_FILES['fileshp']['name']);
		$novolayer->set("name",$_FILES['fileshp']['name']);
		$novolayer->setmetadata("TEMA",$_FILES['fileshp']['name']);
		$novolayer->setmetadata("DOWNLOAD","SIM");
		$sfileObj = ms_newShapefileObj($dirmap."/".$_FILES['fileshp']['name'], -1);
		$tipo = $sfileObj->type;
		if ($tipo == 1){$novolayer->set("type",MS_LAYER_POINT);} // ponto
		if ($tipo == 3){$novolayer->set("type",MS_LAYER_LINE);}
		if ($tipo == 5){$novolayer->set("type",MS_LAYER_POLYGON);}
		//if (($tipo != 3) and ($tipo != 8 )){$novolayer->set("type",0);}
		$novolayer->setfilter("");
		$classe = $novolayer->getclass(0);
		$estilo = $classe->getstyle(0);
		if ($tipo == 1)
		{
			$estilo->set("symbolname","ponto");
			$estilo->set("size",6);
		}
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