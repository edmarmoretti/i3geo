<?php
include_once (dirname(__FILE__)."/../../classesphp/sani_request.php");
$_GET = array_merge($_GET,$_POST);
require_once(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");
include_once (dirname(__FILE__)."/../../classesphp/carrega_ext.php");
//error_reporting(0);
session_name("i3GeoPHP");
if (isset($_GET["g_sid"]))
{session_id($_GET["g_sid"]);}
session_start();
$map_file = $_SESSION["map_file"];
$postgis_mapa = $_SESSION["postgis_mapa"];
if (ob_get_level() == 0) ob_start();
?>
<html>
<head>
</head>
<body bgcolor="white" style="background-color:white;text-align:left;">
<p>
<?php
if (isset($_FILES['i3GEOuploadgpx']['name']) && strlen(basename($_FILES['i3GEOuploadgpx']['name'])) < 200 )
{
	$checkphp = fileContemString($_FILES['i3GEOuploadgpx']['tmp_name'],"<?php");
	if($checkphp == true){
		echo "erro";
		exit;
	}
	//$ndir = dirname($filen);
	require_once (dirname(__FILE__)."/../../ms_configura.php");
	include(dirname(__FILE__)."/../blacklist.php");
	verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);

	if(isset($logExec) && $logExec["upload"] == true){
		i3GeoLog("prog: uploadgpx filename:" . $_FILES['i3GEOuploadgpx']['name'],$dir_tmp);
	}

	$mapa = ms_newMapObj($map_file);
	echo "<p class='paragrafo' >Carregando o arquivo...</p>";
	ob_flush();
	flush();
	sleep(1);
	$dirmap = dirname($map_file);
	//verifica nomes
	$ArquivoDest = $_FILES['i3GEOuploadgpx']['name'];
	$ArquivoDest = $ArquivoDest . md5(uniqid(rand(), true));
	$ArquivoDest = str_replace(".gpx","",$ArquivoDest);
	$ArquivoDest = str_replace(".","",$ArquivoDest).".gpx";

	$ArquivoDest = strip_tags($ArquivoDest);
	$ArquivoDest = htmlspecialchars($ArquivoDest, ENT_QUOTES);

	verificaNome($ArquivoDest);

	//sobe arquivo
	$Arquivo = $_FILES['i3GEOuploadgpx']['tmp_name'];
	$status =  move_uploaded_file($Arquivo,$dirmap."/".$ArquivoDest);

	if($status != 1){
		echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo gpx";
		paraAguarde();
		exit;
	}
	if($status == 1){
		echo "<p class='paragrafo' >Arquivo enviado. Adicionando tema...</p>";
		ob_flush();
		flush();
		sleep(1);
		$tipos = array("waypoints","routes","tracks","route_points","track_points");
		foreach($tipos as $tipo){
			$novolayer = ms_newLayerObj($mapa);
			$novolayer->set("connection",$dirmap."/".$ArquivoDest);
			if(ms_GetVersionInt() > 50201)
			{$novolayer->setconnectiontype(MS_OGR);}
			else
			{$novolayer->set("connectiontype",MS_OGR);}
			$nome = str_replace(".","",$ArquivoDest);
			$novolayer->set("name",$_FILES['i3GEOuploadgpx']['name'].$tipo);
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
			$classe->set("name","");
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
			if(isset($_GET["uploadgpxEPSG"]) && $_GET["uploadgpxEPSG"] != ""){
			    $novolayer->setProjection("init=epsg:".$_GET["uploadgpxEPSG"]);
			}
		}
		$salvo = $mapa->save($map_file);
		//grava os templates de cada tema
		echo "<b><p class='paragrafo' >Camadas criadas!!! Redesenhando o mapa.";
		echo "<script>window.scrollTo(0,10000);window.parent.i3GEO.mapa.refresh();window.parent.i3GEOF.uploadgpx.doneok();</script>";
	}
	else
	{
		restauraCon($map_file,$postgis_mapa);
		echo "<p class='paragrafo' >Erro ao enviar o arquivo.</p>";
		paraAguarde();
		exit;
	}
}
else
{
	echo "<p class='paragrafo' >Erro ao enviar o arquivo. Talvez o tamanho do arquivo seja maior do que o permitido.</p>";
}
restauraCon($map_file,$postgis_mapa);
paraAguarde();
function paraAguarde(){
    echo "<script>window.parent.i3GEOF.uploadgpx.destroy();</script>";
}
function verificaNome($nome)
{
	$nome = strtolower($nome);
	$lista = explode(".",$nome);
	$extensao = $lista[count($lista) - 1];
	if($extensao != "gpx")
	{
		echo "Nome de arquivo inv&aacute;lido.";
		paraAguarde();
		exit;
	}
}
?>
</body>
</html>