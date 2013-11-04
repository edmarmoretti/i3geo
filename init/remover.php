<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<link rel="stylesheet" type="text/css" href="../admin/html/admin.css">
</head>

<body class="yui-skin-sam fundoPonto" >
<div class="bordaSuperior"  >&nbsp;</div>
<div class="mascaraPrincipal" id="divGeral" style=text-align:left >
Remove a tela inicial de apresenta&ccedil;&atilde;o do i3Geo substituindo-a pela inicialliza&ccedil;&atilde;o direta do mapa.
Ap&oacute;s remover, a tela inicial pode ser vista utilizando-se o endere&ccedil;o i3geo/init. Para definir qual a interface que
ser&aacute; utilizada como default ao abrir o i3Geo edite o arquivo i3geo/ms_configura.php.<br><br>
<?php
$locaplic = dirname(__FILE__)."/..";
include_once(dirname(__FILE__)."/../admin/php/admin.php");
include_once(dirname(__FILE__)."/../admin/php/conexao.php");

if(empty($_POST["senha"]) || empty($_POST["usuario"])){
	formularioLoginMaster("remover.php");
	exit;
}
else{
	$continua = verificaMaster($_POST["usuario"],$_POST["senha"],$i3geomaster);
	if($continua == false){
		echo "<span style=color:red; >Usu&aacute;rio n&atilde;o registrado em i3geo/ms_configura.php na vari&aacute;vel i3geomaster";
		exit;
	}
}
error_reporting(0);
unlink("../index.htm");
unlink("../index.html");
if(file_exists("../index.htm") || file_exists("../index.html")){
	echo "<span style=color:red; > Sem permissao do sistema opercaional para excluir arquivo";
	exit;
}
copy("_index.htm","../index.htm");
copy("_index.html","../index.html");
chmod("../index.htm",0777);
chmod("../index.html",0777);
echo "<br><b>OK. Removido. Voce pode utilizar o init digitando i3geo/init no navegador";
?>
</div>
</body>
</html>
