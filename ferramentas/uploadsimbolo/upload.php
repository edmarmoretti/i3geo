<?php
//
//caso o usu&aacute;rio seja um administrador, ele pode enviar um nome de diret&oacute;rio onde os arquivos ser&atilde;o armazenados
//na vari&aacute;vel $dirDestino
//
require_once(dirname(__FILE__)."/../../classesphp/pega_variaveis.php");
require_once(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");
include_once (dirname(__FILE__)."/../../classesphp/carrega_ext.php");
error_reporting(0);
if (ob_get_level() == 0) ob_start();
?>
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<link rel="stylesheet" type="text/css" href="../../css/geral.css" />
<title></title>
</head>
<body bgcolor="white" style="background-color:white;text-align:left;">
<p>
<?php
if (isset($_FILES['i3GEOuploadsimboloarq']['name'])){
	require_once (dirname(__FILE__)."/../../ms_configura.php");
	echo "<p class='paragrafo' >Carregando o arquivo...</p>";
	ob_flush();
	flush();
	sleep(1);
	include_once(dirname(__FILE__)."/../../admin/php/login.php");
	if(verificaOperacaoSessao("admin/php/editortexto") == false){
		echo "Vc nao pode realizar salvar os dados no servidor em uma pasta espec&iacute;fica";exit;
	}
	if(!isset($dirDestino) || $dirDestino == ""){
		$dirDestino = $locaplic."/symbols/images";
	}
	if(!file_exists($dirDestino)){
		$dirDestino = dirname($locaplic)."/".$dirDestino;
		if(!file_exists($dirDestino)){
			echo "<p class='paragrafo' >Pasta n&atilde;o existe no servidor";paraAguarde();exit;
		}
	}
	//verifica nomes

	$nome = basename($_FILES['i3GEOuploadsimboloarq']['name']);
	verificaNome($nome);
	//sobe arquivo
	$Arquivo = $_FILES['i3GEOuploadsimboloarq']['tmp_name'];
	$destino = $dirDestino."/".$nome;

	if(file_exists($destino))
	{echo "<p class='paragrafo' >J&aacute; existe um arquivo com o nome ".$destino;paraAguarde();exit;}
	$status =  move_uploaded_file($Arquivo,$destino);
	if($status != 1)
	{echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo. Pode ser uma limita&ccedil;&atilde;o quanto ao tamanho do arquivo.";paraAguarde();exit;}
	if(!file_exists($destino))
	{echo "<p class='paragrafo' >Ocorreu algum problema no envio do arquivo ".$destino;paraAguarde();exit;}

	echo "<p class='paragrafo' >Arquivo enviado.</p>";
	echo "<p class='paragrafo'>Nome: ".$destino." </p>";
}
else
{
	echo "<p class='paragrafo' >Erro ao enviar o arquivo. Talvez o tamanho do arquivo seja maior do que o permitido.</p>";
}
paraAguarde();
function paraAguarde(){
	echo "<script>try{window.scrollTo(0,10000);window.parent.i3GEOF.upload.aguarde.visibility='hidden';}catch(e){};</script>";
}
function verificaNome($nome)
{
	$nome = strtolower($nome);
	$lista = explode(".",$nome);
	$extensao = $lista[count($lista) - 1];
	if(($extensao != "png") && ($extensao != "jpg"))
	{
		echo "Nome de arquivo inv&aacute;lido.";
		paraAguarde();
		exit;
	}
}
?>
</body>
</html>
