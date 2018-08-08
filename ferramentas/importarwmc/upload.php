<?php
require_once(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");
include_once (dirname(__FILE__)."/../../classesphp/carrega_ext.php");
//error_reporting(0);
session_name("i3GeoPHP");
if (isset($_POST["g_sid"]))
{session_id($_POST["g_sid"]);}
session_start();
$map_file = $_SESSION["map_file"];
?>
<html>
<head>
</head>
<body bgcolor="white" style="background-color:white;text-align:left;">
<p>
<?php
include_once (dirname(__FILE__)."/../../classesphp/sani_request.php");
//error_reporting(0);
require_once (dirname(__FILE__)."/../../ms_configura.php");
include(dirname(__FILE__)."/../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
error_reporting(0);
$dirmap = dirname($map_file);
$arquivo = "";

if(isset($logExec) && $logExec["upload"] == true){
	i3GeoLog("prog: importarwmc filename:" . $_FILES['i3GEOimportarwmc']['name'],$dir_tmp);
}

if(isset($_FILES['i3GEOimportarwmc']['name']) && strlen(basename($_FILES['i3GEOimportarwmc']['name'])) < 200)
{
	echo "<p class='paragrafo' >Carregando o arquivo...</p>";
	//verifica nomes
	$ArquivoDest = $_FILES['i3GEOimportarwmc']['name'];
	$ArquivoDest = $ArquivoDest . md5(uniqid(rand(), true));

	$ArquivoDest = str_replace(".xml","",$ArquivoDest);
	$ArquivoDest = str_replace(".","",$ArquivoDest).".xml";

	$ArquivoDest = strip_tags($ArquivoDest);
	$ArquivoDest = htmlspecialchars($ArquivoDest, ENT_QUOTES);

	verificaNome($ArquivoDest);
	//sobe arquivo

	$checkphp = fileContemString($_FILES['i3GEOimportarwmc']['tmp_name'],"<?php");
	if($checkphp == true){
	    echo "Arquivo invalido";
		exit;
	}

	$Arquivo = $_FILES['i3GEOimportarwmc']['tmp_name'];

	$status =  move_uploaded_file($Arquivo,$dirmap."/".$ArquivoDest);

	$arquivo = $dirmap."/".$ArquivoDest;
}
if($arquivo != "" && file_exists($arquivo)){
    incluiWMC();
}
paraAguarde();
function incluiWMC(){
	global $map_file,$arquivo;
	$mapa = ms_newMapObj($map_file);
	$proj = $mapa->getprojection();
	$mapa->loadMapContext($arquivo,true);
	unlink($arquivo);
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
	echo "<script>window.parent.i3GEO.atualiza();window.parent.i3GEOF.importarwmc.doneok()</script>";
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