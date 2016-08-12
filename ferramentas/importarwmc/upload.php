<?php
require_once(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");
include_once (dirname(__FILE__)."/../../classesphp/carrega_ext.php");
error_reporting(0);
session_name("i3GeoPHP");
if (isset($_POST["g_sid"]))
{session_id($_POST["g_sid"]);}
session_start();
$map_file = $_SESSION["map_file"];
?>
<html>
<head>
<link rel="stylesheet" type="text/css" href="../../css/input.css" />
<link rel="stylesheet" type="text/css" href="../../css/geral.css" />
<title></title>
</head>
<body bgcolor="white" style="background-color:white;text-align:left;">
<p>
<?php
include_once (dirname(__FILE__)."/../../classesphp/sani_request.php");
error_reporting(0);
require_once (dirname(__FILE__)."/../../ms_configura.php");
$dirmap = dirname($map_file);
$arquivo = "";

if(isset($logExec) && $logExec["upload"] == true){
	i3GeoLog("prog: importarwmc filename:" . $_FILES['i3GEOimportarwmc']['name'],$dir_tmp);
}

if(isset($_FILES['i3GEOimportarwmc']['name']) && !($_POST["i3GEOimportarwmcurl"]) && strlen(basename($_FILES['i3GEOimportarwmc']['name'])) < 200)
{
	echo "<p class='paragrafo' >Carregando o arquivo...</p>";
	//verifica nomes
	$ArquivoDest = $_FILES['i3GEOimportarwmc']['name'];
	$ArquivoDest = $ArquivoDest . md5(uniqid(rand(), true));
	$ArquivoDest = str_replace(".xml","",$ArquivoDest).".xml";

	$ArquivoDest = strip_tags($ArquivoDest);
	$ArquivoDest = htmlspecialchars($ArquivoDest, ENT_QUOTES);

	verificaNome($ArquivoDest);
	//sobe arquivo

	$checkphp = fileContemString($_FILES['i3GEOimportarwmc']['tmp_name'],"<?php");
	if($checkphp == true){
		exit;
	}

	$Arquivo = $_FILES['i3GEOimportarwmc']['tmp_name'];
	$status =  move_uploaded_file($Arquivo,$dirmap."/".$ArquivoDest);
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