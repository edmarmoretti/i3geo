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
<body bgcolor="white" style="background-color:white;text-align:left;">
<p>
<?php
if (isset($_FILES['i3GEOaplicarsld']['name']))
{
	//$ndir = dirname($filen);
	require_once ("../../ms_configura.php");
	$mapa = ms_newMapObj($map_file);
	echo "<p class='paragrafo' >Carregando o arquivo...</p>";
	$dirmap = dirname($map_file);
	//verifica nomes
	verificaNome($_FILES['i3GEOaplicarsld']['name']);
	//sobe arquivo
	$Arquivo = $_FILES['i3GEOaplicarsld']['tmp_name'];
	$status =  move_uploaded_file($Arquivo,$dirmap."/".$_FILES['i3GEOaplicarsld']['name']);

	if($status != 1)
	{echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo SLD";paraAguarde();exit;}
	if($status == 1)
	{
		echo "<p class='paragrafo' >Arquivo enviado. Aplicando SLD...$tema</p>";
		$layer = $mapa->getlayerbyname($tema);
		$arq = $dirmap."/".$_FILES['i3GEOaplicarsld']['name'];
		$abre = fopen($arq, "r");
		$buffer = fread($abre, filesize($arq));
		fclose($abre);
		$layer->applySLD($buffer);
		$layer->setmetadata("cache","");
		$salvo = $mapa->save($map_file);
		echo "<p class='paragrafo' >Aplicado!!! Redesenhando o mapa.";
		echo "<script>window.parent.i3GEO.atualiza();window.parent.i3GEO.Interface.atualizaTema('',window.parent.i3GEO.temaAtivo);</script>";
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
	echo "<script>window.parent.i3GEOF.aplicarsld.aguarde.visibility='hidden';</script>";
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