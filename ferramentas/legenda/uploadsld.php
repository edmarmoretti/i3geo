<?php
include_once (dirname(__FILE__)."/../../classesphp/sani_request.php");
require_once(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");
include_once (dirname(__FILE__)."/../../classesphp/carrega_ext.php");
//error_reporting(0);
$_GET = array_merge($_GET,$_POST);
session_name("i3GeoPHP");
if (isset($_GET["mapId"]))
{session_id($_GET["mapId"]);}
session_start();
$map_file = $_SESSION["map_file"];

include (dirname(__FILE__)."/../../ms_configura.php");
include("../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);

$layerName = $_GET["layerName"];

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
if (isset($_FILES['i3GEOaplicarsld']['name']) && strlen(basename($_FILES['i3GEOaplicarsld']['name'])) < 200 )
{
	//$ndir = dirname($filen);
	$mapa = ms_newMapObj($map_file);
	echo "<p class='paragrafo' >Carregando o arquivo...</p>";
	$dirmap = dirname($map_file);
	//verifica nomes
	$ArquivoDest = $_FILES['i3GEOaplicarsld']['name'];

	$ArquivoDest = strip_tags($ArquivoDest);
	$ArquivoDest = htmlspecialchars($ArquivoDest, ENT_QUOTES);

	$ArquivoDest = $ArquivoDest . md5(uniqid(rand(), true));

	$ArquivoDest = str_replace(".sld","",$ArquivoDest);
	$ArquivoDest = str_replace(".","",$ArquivoDest).".sld";


	verificaNome($ArquivoDest);

	//sobe arquivo
	$Arquivo = $_FILES['i3GEOaplicarsld']['tmp_name'];

	$checkphp = fileContemString($_FILES['i3GEOaplicarsld']['tmp_name'],"<?php");
	if($checkphp == true){
		exit;
	}

	$status =  move_uploaded_file($Arquivo,$dirmap."/".$ArquivoDest);
	if($status != 1)
	{echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo SLD";exit;}
	if($status == 1)
	{
		echo "<p class='paragrafo' >Arquivo enviado. Aplicando SLD...</p>";
		$layer = $mapa->getlayerbyname($layerName);
		$arq = $dirmap."/".$ArquivoDest;
		$buffer = file_get_contents($arq);
		$layer->applySLD($buffer);
		$layer->setmetadata("cache","");
		$mapa->save($map_file);
		echo "<p class='paragrafo' >Aplicado!!! Redesenhando o mapa.";
		echo "<script>window.parent.i3GEO.mapa.refresh();window.parent.i3GEO.Interface.atualizaTema('',window.parent.i3GEO.temaAtivo);</script>";
	}
	else
	{
		echo "<p class='paragrafo' >Erro ao enviar o arquivo.</p>";
		exit;
	}
}
else
{
	echo "<p class='paragrafo' >Erro ao enviar o arquivo. Talvez o tamanho do arquivo seja maior do que o permitido.</p>";
}
function verificaNome($nome)
{
	$nome = strtolower($nome);
	$lista = explode(".",$nome);
	$extensao = $lista[count($lista) - 1];
	if($extensao != "xml" && $extensao != "sld")
	{
		echo "Nome de arquivo inv&aacute;lido.";
		paraAguarde();
		exit;
	}
}
?>
</body>
</html>