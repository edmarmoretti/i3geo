<html>
<style>
body {
	font: 14pt arial, helvetica, clean, sans-serif;
	color: rgb(100, 100, 100);
}
</style>
<body>
	<?php
	/*
	 Title: abrefontemapfile

	Abre no navegador a p&aacute;gina com os metadados sobre um tema.

	O link para os metadados &eacute; obtido do banco de administra&ccedil;&atilde;o.

	*/
	error_reporting(0);
	include (dirname(__FILE__)."/../classesphp/conexao.php");
	include_once(dirname(__FILE__)."/safe.php");

	if(!file_exists($locaplic."/temas/".$tema.".map")){
		exit;
	}
	if(!isset($tema))
	{
		echo "Nenhum tema definido.";exit;
	}
	$r = pegaDadosAdmin("select link_tema from ".$esquemaadmin."i3geoadmin_temas where codigo_tema = '$tema'",$dbh);
	error_reporting(0);
	$link = $r[0]["link_tema"];
	if($link == "")
	{
		echo "O link para a fonte n&atilde;o est&aacute; cadastrado. Entre em contato com o administrador do sistema.";
	}
	else{
	    echo "<meta http-equiv='refresh' content='0;url=$link'>";
	}
?>