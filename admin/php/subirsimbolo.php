<?php
include_once(dirname(__FILE__)."/login.php");

if(in_array(strtoupper($funcao),$funcoesEdicao)){
  if(verificaOperacaoSessao("admin/html/editortexto") == false){
    retornaJSON("Vc nao pode realizar essa operacao.");exit;
  }
}
//locaplic e usado para definir a pasta de destino
if(empty($locaplic)){
  exit;
}
?>
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<link rel="stylesheet" type="text/css" href="../../css/input.css" />
<link rel="stylesheet" type="text/css" href="../../css/geral.css" />
<title></title>
</head>
<body bgcolor="white" style="background-color:white;text-align:left;">
<p>
<?php
if (isset($_FILES['i3GEOuploadsimboloarq']['name']) && strlen(basename($_FILES['i3GEOuploadsimboloarq']['name'])) < 200){
	$dirDestino = $_GET["dirDestino"];
	$dirDestino = str_replace(".","",$dirDestino);
	$dirDestino = $locaplic."/".$dirDestino;

	$checkphp = fileContemString($_FILES['i3GEOuploadsimboloarq']['tmp_name'],"<?php");
	if($checkphp == true){
		echo "Arquivo invalido";
		exit;
	}

	if(isset($logExec) && $logExec["upload"] == true){
		i3GeoLog("prog: uploadsimbolo filename:" . $_FILES['i3GEOuploadsimboloarq']['name'],$dir_tmp);
	}

	echo "<p class='paragrafo' >Carregando o arquivo...</p>";
	ob_flush();
	flush();
	sleep(1);

	if(!file_exists($dirDestino)){
		if(!file_exists($dirDestino)){
			echo "<p class='paragrafo' >Pasta n&atilde;o existe no servidor";
			paraAguarde();
			exit;
		}
	}
	//verifica nomes
	$nome = $_FILES['i3GEOuploadsimboloarq']['name'];

	$nome = str_replace(".png","",$nome);
	$nome = str_replace(".","",$nome).".png";

	$nome = strip_tags($nome);
	$nome = htmlspecialchars($nome, ENT_QUOTES);

	//$nome = $nome . md5(uniqid(rand(), true));

	verificaNome($nome);
	//sobe arquivo
	$Arquivo = $_FILES['i3GEOuploadsimboloarq']['tmp_name'];
	$destino = $dirDestino."/".$nome;

	$check = getimagesize($Arquivo);
	if($check === false) {
		exit;
	}

	if(file_exists($destino))
	{echo "<p class='paragrafo' >J&aacute; existe um arquivo com o nome ";paraAguarde();exit;}
	$status =  move_uploaded_file($Arquivo,$destino);
	if($status != 1)
	{echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo. Pode ser uma limita&ccedil;&atilde;o quanto ao tamanho do arquivo.";paraAguarde();exit;}
	if(!file_exists($destino))
	{echo "<p class='paragrafo' >Ocorreu algum problema no envio do arquivo ";paraAguarde();exit;}

	echo "<p class='paragrafo' >Arquivo enviado.</p>";
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