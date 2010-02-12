<?php
require_once("../../classesphp/pega_variaveis.php");
require_once("../../classesphp/funcoes_gerais.php");
include_once ("../../classesphp/carrega_ext.php");
error_reporting(E_ALL);
session_name("i3GeoPHP");
if (isset($g_sid))
{session_id($g_sid);}
session_start();
foreach(array_keys($_SESSION) as $k)
{eval("\$".$k."='".$_SESSION[$k]."';");}
$postgis_mapa = $_SESSION["postgis_mapa"];
?>
<html>
<head>
<link rel="stylesheet" type="text/css" href="../../css/geral.css" />
<title></title>
</head>
<body name="ancora" bgcolor="white" style="background-color:white;text-align:left;">
<p>
<?php
if (isset($_FILES['i3GEOuploadshp']['name']))
{
	//$ndir = dirname($filen);
	require_once ("../../ms_configura.php");
	$mapa = ms_newMapObj($map_file);
	echo "<p class='paragrafo' >Carregando o arquivo...</p>";
	$dirmap = dirname($map_file);
	//verifica nomes
	verificaNome($_FILES['i3GEOuploadshp']['name']);
	verificaNome($_FILES['i3GEOuploadshx']['name']);
	verificaNome($_FILES['i3GEOuploaddbf']['name']);

	//sobe arquivo
	$Arquivo = $_FILES['i3GEOuploadshp']['tmp_name'];
	$status =  move_uploaded_file($Arquivo,$dirmap."/".$_FILES['i3GEOuploadshp']['name']);
	$Arquivo = $_FILES['i3GEOuploadshx']['tmp_name'];
	$status =  move_uploaded_file($Arquivo,$dirmap."/".$_FILES['i3GEOuploadshx']['name']);
	$Arquivo = $_FILES['i3GEOuploaddbf']['tmp_name'];
	$status =  move_uploaded_file($Arquivo,$dirmap."/".$_FILES['i3GEOuploaddbf']['name']);
	if($status != 1)
	{echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo shp";paraAguarde();exit;}
	if($status == 1)
	{
		echo "<p class='paragrafo' >Arquivo enviado. Adicionando tema...</p>";
		$mapt = ms_newMapObj($temasaplic."/novotema.map");
		$novolayer = $mapt->getLayerByName("novotema");
		$novolayer->set("data",$dirmap."/".$_FILES['i3GEOuploadshp']['name']);
		$novolayer->set("name",$_FILES['i3GEOuploadshp']['name']);
		$novolayer->setmetadata("TEMA",$_FILES['i3GEOuploadshp']['name']);
		$novolayer->setmetadata("DOWNLOAD","SIM");
		$sfileObj = ms_newShapefileObj($dirmap."/".$_FILES['i3GEOuploadshp']['name'], -1);
		$tipo = $sfileObj->type;
		if ($tipo == 1){$novolayer->set("type",MS_LAYER_POINT);} // ponto
		if ($tipo == 3){$novolayer->set("type",MS_LAYER_LINE);}
		if ($tipo == 5){$novolayer->set("type",MS_LAYER_POLYGON);}
		$novolayer->setmetadata("TEMALOCAL","SIM");
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
		if($uploadEPSG != "")
		{$novolayer->setProjection("init=epsg:".$uploadEPSG);}
		$adiciona = ms_newLayerObj($mapa, $novolayer);
		$salvo = $mapa->save($map_file);
		//grava os templates de cada tema
		echo "<p class='paragrafo' >Tema criado!!! Redesenhando o mapa.";
		echo "<script>window.parent.i3GEO.atualiza()</script>";
	}
	else
	{
		echo "<p class='paragrafo' >Erro ao enviar o arquivo.</p>";
		paraAguarde();
		exit;
	}
}
else
{
	echo "<p class='paragrafo' >Erro ao enviar o arquivo. Talvez o tamanho do arquivo seja maior do que o permitido.</p>";	
}
paraAguarde();
function paraAguarde(){
	echo "<script>window.parent.i3GEOF.upload.aguarde.visibility='hidden';</script>";
}
function verificaNome($nome)
{
	$nome = strtolower($nome);
	$lista = explode(".",$nome);
	$extensao = $lista[count($lista) - 1];
	if(($extensao != "dbf") && ($extensao != "shx") && ($extensao != "shp"))
	{
		echo "Nome de arquivo inválido.";
		paraAguarde();
		exit;
	}
}
?>
</body>
</html>