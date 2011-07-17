<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=ISO-8859-1">
    <title>Editor texto</title>
    <style type="text/css">
        body {
            margin:20;
        	padding:20;
			font-size:14px;
        }
	</style>
</head>
<body>
<?php
include_once("admin.php");
error_reporting(0);
if(verificaEditores($editores) == "nao")
{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
$mapfile = "../../temas/".$_GET["mapfile"].".map";
if(!file_exists($mapfile))
{echo "Arquivo $mapfile não existe.";exit;}
if($_POST["tipo"] == "gravar"){

exit;
}
echo "<TEXTAREA name=texto cols=100 rows=20 >";
echo file_get_contents($mapfile);
echo "</TEXTAREA>";
?>