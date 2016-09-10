<html>
<style>
body
{
	font:14pt arial,helvetica,clean,sans-serif;
	color:rgb(100,100,100);
}
p
{
	font:12pt arial,helvetica,clean,sans-serif;
	color:black;
}
</style>
<body>
<?php
include(dirname(__FILE__)."/../../../classesphp/carrega_ext.php");
include(dirname(__FILE__)."/../../../classesphp/sani_request.php");

echo "<p>O c&oacute;digo de barras abaixo pode ser lido por dispositivos m&oacute;veis, como os celulares ou pdas.";
echo "<p>Se o seu dispositivo possuir o software adequado, fotografe o c&oacute;digo para abrir o navegador de internet ou clique no link.";
$d = $_GET["d"]."&temasa=".$_GET["temasa"]."&layers=".$_GET["layers"];
echo "<p><a href='$d' >$d</a><br>";
echo "<img src='qr_img.php?host=".$_GET["host"]."&d=$d' />";
?>
