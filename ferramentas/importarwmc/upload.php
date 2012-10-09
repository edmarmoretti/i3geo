<?php
require_once("../../classesphp/funcoes_gerais.php");
include_once ("../../classesphp/carrega_ext.php");
error_reporting(E_ALL);
session_name("i3GeoPHP");
if (isset($_POST["g_sid"]))
{session_id($_POST["g_sid"]);}
session_start();
$map_file = $_SESSION["map_file"];
?>
<html>
<head>
<link rel="stylesheet" type="text/css" href="../../css/geral.css" />
<title></title>
</head>
<body bgcolor="white" style="background-color:white;text-align:left;">
<p>
<?php
error_reporting(E_ALL);
require_once ("../../ms_configura.php");
$dirmap = dirname($map_file);
$arquivo = "";
if(isset($_FILES['i3GEOimportarwmc']['name']) && !($_POST["i3GEOimportarwmcurl"]))
{
	echo "<p class='paragrafo' >Carregando o arquivo...</p>";
	//verifica nomes
	verificaNome($_FILES['i3GEOimportarwmc']['name']);
	//sobe arquivo
	$Arquivo = $_FILES['i3GEOimportarwmc']['tmp_name'];
	$status =  move_uploaded_file($Arquivo,$dirmap."/".$_FILES['i3GEOimportarwmc']['name']);
	$arquivo = $dirmap."/".$_FILES['i3GEOimportarwmc']['name'];
}
if($_POST["i3GEOimportarwmcurl"])
{
	$s = PHP_SHLIB_SUFFIX;
	if(!function_exists('curl_init'))
	{@dl( 'php_curl'.'.'.$s );}
	if(!function_exists('curl_init'))
	{echo "curl n&atilde;o instalado";}
	else{
		$curl = curl_init();
		curl_setopt ($curl, CURLOPT_URL, $_POST["i3GEOimportarwmcurl"]);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		$result = curl_exec($curl);
		curl_close ($curl);
		$arquivo = $dirmap."/".nomeRandomico();
		gravaDados(array($result),$arquivo);
	}
}
if($arquivo != "")
{incluiWMC();}
paraAguarde();
function incluiWMC(){
	global $map_file,$arquivo;
	$mapa = ms_newMapObj($map_file);
	$proj = $mapa->getprojection();
	$mapa->loadMapContext($arquivo,"MS_TRUE");
	$layers = $mapa->getalllayernames();
	foreach($layers as $nome){
		$l = $mapa->getlayerbyname($nome);
		$con = $l->connectiontype;
		if(($con == 7 || $con == 9) && $l->getmetadata("tema") == ""){
			if($l->getmetadata("wms_title") != "")
			{$l->setmetadata("tema",$l->getmetadata("wms_title"));}
			else
			{$l->setmetadata("tema",$l->getmetadata("wms_name"));}
		}
	}
	$mapa->setprojection($proj);
	$mapa->save($map_file);
	echo "Arquivo carregado com sucesso!";
}
function paraAguarde(){
	echo "<script>window.parent.i3GEOF.importarwmc.aguarde.visibility='hidden';</script>";
	echo "<script>window.parent.i3GEO.atualiza()</script>";
}
function verificaNome($nome)
{
	$nome = strtolower($nome);
	$lista = explode(".",$nome);
	$extensao = $lista[count($lista) - 1];
	if($extensao != "xml")
	{
		echo "Nome de arquivo inv&aacute;lido.";
		paraAguarde();
		exit;
	}
}
?>
</body>
</html>