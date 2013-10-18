<?php
include_once("admin.php");
include_once("login.php");
if(verificaOperacaoSessao("admin/metaestat/geral") == false){
	echo "Vc nao pode realizar essa operacao.";exit;
}
error_reporting(0);
?>
<html>
<head>
<link rel="stylesheet" type="text/css" href="../../css/geral.css" />
<title></title>
</head>
<body bgcolor="white" style="background-color:white;text-align:left;">
<p>
<?php
if (isset($_FILES['uploadimagem']['name'])){
	require_once (dirname(__FILE__)."/../../ms_configura.php");
	echo "<p class='paragrafo' >Carregando o arquivo...</p>";
	$arq = $metaestatTemplates."/logos/".$_FILES['uploadimagem']['name'];
	//verifica nomes
	verificaNome($_FILES['uploadimagem']['name']);
	//chmod($metaestatTemplates."/logos",777);
	if(file_exists($arq)){
		unlink($arq);
	}
	//sobe arquivo
	$Arquivo = $_FILES['uploadimagem']['tmp_name'];
	//echo $Arquivo;
	$status =  move_uploaded_file($Arquivo,$arq);
	if($status != 1)
	{echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo. Verifique as permissoes de escrita";exit;}
	if($status == 1){
		echo "<p class='paragrafo' >Arquivo enviado.</p>";
		chmod($arq,0777);
	}
	else{
		echo "<p class='paragrafo' >Erro ao enviar o arquivo.</p>";
		exit;
	}
}
else{
	echo "<p class='paragrafo' >Erro ao enviar o arquivo. Talvez o tamanho do arquivo seja maior do que o permitido.</p>";
}
function verificaNome($nome)
{
	$nome = strtolower($nome);
	$lista = explode(".",$nome);
	$extensao = $lista[count($lista) - 1];
	if($extensao != "png" && $extensao != "jpg")
	{
		echo "Nome de arquivo inv&aacute;lido.";
		exit;
	}
}
?>
</body>
</html>