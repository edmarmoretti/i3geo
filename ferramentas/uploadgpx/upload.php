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
if (isset($_FILES['i3GEOuploadgpx']['name']))
{
	//$ndir = dirname($filen);
	require_once ("../../ms_configura.php");
	$mapa = ms_newMapObj($map_file);
	echo "<p class='paragrafo' >Carregando o arquivo...</p>";
	$dirmap = dirname($map_file);
	//verifica nomes
	verificaNome($_FILES['i3GEOuploadgpx']['name']);

	//sobe arquivo
	$Arquivo = $_FILES['i3GEOuploadgpx']['tmp_name'];
	$status =  move_uploaded_file($Arquivo,$dirmap."/".$_FILES['i3GEOuploadgpx']['name']);

	if($status != 1)
	{echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo gpx";paraAguarde();exit;}
	if($status == 1)
	{
		echo "<p class='paragrafo' >Arquivo enviado. Adicionando tema...</p>";
		$novolayer = ms_newLayerObj($mapa);
		$tipos = array("waypoints","routes","tracks","route_points","track_points");
		foreach($tipos as $tipo){
			$novolayer->set("connection",$dirmap."/".$_FILES['i3GEOuploadgpx']['name']);
			if(ms_GetVersionInt() > 50201)
			{$novolayer->setconnectiontype(MS_OGR);}
			else
			{$novolayer->set("connectiontype",MS_OGR);}			
			$nome = str_replace(".","",$_FILES['i3GEOuploadgpx']['name']);
			$novolayer->set("name",$nome.$tipo);
			$novolayer->setmetadata("TEMA",$_FILES['i3GEOuploadgpx']['name']." ".$tipo);
			$novolayer->setmetadata("DOWNLOAD","SIM");
			$novolayer->setmetadata("CLASSE","SIM");
			$novolayer->setmetadata("TEXTO","NAO");
			if($tipo == "waypoints" || $tipo == "route_points" ||$tipo == "track_points")
			{$novolayer->set("type",MS_LAYER_POINT);}
			else
			{$novolayer->set("type",MS_LAYER_LINE);}
			$novolayer->set("data",$tipo);
			$novolayer->setmetadata("TEMALOCAL","SIM");
			$novolayer->setfilter("");
			$classe = ms_newClassObj($novolayer);
			$estilo = ms_newStyleObj($classe);
			if($tipo == "waypoints" || $tipo == "route_points" ||$tipo == "track_points")
			{
				$estilo->set("symbolname","ponto");
				$estilo->set("size",6);
			}
			$estilo->color->setrgb(200,50,0);
			$estilo->outlinecolor->setrgb(0,0,0);
			// le os itens
			$novolayer->set("status",MS_DEFAULT);
			$novolayer->set("template","none.htm");
			if(isset($uploadEPSG) && $uploadEPSG != "")
			{$novolayer->setProjection("init=epsg:".$uploadEPSG);}
			$adiciona = ms_newLayerObj($mapa, $novolayer);
		}
		$salvo = $mapa->save($map_file);
		//grava os templates de cada tema
		echo "<p class='paragrafo' >Camadas criadas!!! Redesenhando o mapa.";
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
	echo "<script>window.parent.i3GEOF.uploadgpx.aguarde.visibility='hidden';</script>";
}
function verificaNome($nome)
{
	$nome = strtolower($nome);
	$lista = explode(".",$nome);
	$extensao = $lista[count($lista) - 1];
	if($extensao != "gpx")
	{
		echo "Nome de arquivo inválido.";
		paraAguarde();
		exit;
	}
}
?>
</body>
</html>