<?php
include_once("admin.php");
include_once("login.php");
if(verificaOperacaoSessao("admin/metaestat/geral") == false){
	echo "Vc nao pode realizar essa operacao.";exit;
}
error_reporting(0);
if (ob_get_level() == 0) ob_start();
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
	require_once (dirname(__FILE__)."/../../ms_configura.php");
	echo "<p class='paragrafo' >Carregando o arquivo...</p>";
	ob_flush();
	flush();
	sleep(1);
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
	echo "<script>window.scrollTo(0,10000);window.parent.core_pegaMapfiles('montaArvore()');</script>";
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