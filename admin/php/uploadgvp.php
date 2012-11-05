<?php
require_once("../../classesphp/pega_variaveis.php");
require_once("../../classesphp/funcoes_gerais.php");
include_once ("../../classesphp/carrega_ext.php");
error_reporting(E_ALL);
?>
<html>
<head>
<link rel="stylesheet" type="text/css" href="../../css/geral.css" />
<title></title>
</head>
<body bgcolor="white" style="background-color:white;text-align:left;">
<p>
<?php
if (isset($_FILES['i3GEOuploadgvp']['name'])){
	require_once ("../../ms_configura.php");
	echo "<p class='paragrafo' >Carregando o arquivo...</p>";
	$arq = $locaplic."/temas/".$_FILES['i3GEOuploadgvp']['name'];
	//verifica nomes
	verificaNome($_FILES['i3GEOuploadgvp']['name']);
	if(file_exists($arq)){
		unlink($arq);
	}
	//sobe arquivo
	$Arquivo = $_FILES['i3GEOuploadgvp']['tmp_name'];
	$status =  move_uploaded_file($Arquivo,$arq);
	if($status != 1)
	{echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo gvp";exit;}
	if($status == 1){
		echo "<p class='paragrafo' >Arquivo enviado.</p>";
		paraAguarde();
	}
	else{
		echo "<p class='paragrafo' >Erro ao enviar o arquivo.</p>";
		exit;
	}
}
else{
	echo "<p class='paragrafo' >Erro ao enviar o arquivo. Talvez o tamanho do arquivo seja maior do que o permitido.</p>";
}
function paraAguarde(){
	echo "<script>window.parent.core_pegaMapfiles('montaArvore()');</script>";
}
function verificaNome($nome)
{
	$nome = strtolower($nome);
	$lista = explode(".",$nome);
	$extensao = $lista[count($lista) - 1];
	if($extensao != "gvp")
	{
		echo "Nome de arquivo inv&aacute;lido.";
		paraAguarde();
		exit;
	}
}
?>
</body>
</html>