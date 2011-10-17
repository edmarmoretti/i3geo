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
<a href="http://mapserver.org/mapfile/index.html#mapfile" target="_new" >Documentação do Mapserver</a><br><br>
<a href="../html/editormapfile.html" target="_self" >Voltar</a><br><br>
<form action="editortexto.php?mapfile=<?php echo $_GET["mapfile"];?>" method=post > 

<input type=submit value="Salvar"/><input type=button value="Testar" onclick="testar()" /><input type=button value="Testar no i3Geo" onclick="abrirI3geo()" /> (Salve antes de testar)<br><br>
Edite:<br>
<?php
//evita erros removendo caracteres PHP
if(isset($_POST["texto"])){
	$gravarTexto = $_POST["texto"];
	$_POST["texto"] = "";
}
include_once("admin.php");
error_reporting(0);
if(verificaEditores($editores) == "nao")
{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
$mapfile = "../../temas/".$_GET["mapfile"].".map";
if(!file_exists($mapfile))
{echo "Arquivo $mapfile não existe.";exit;}
if($_POST["tipo"] == "gravar"){
	$fp = fopen($mapfile,"w");
	fwrite($fp,$gravarTexto);
	fclose($fp);
}

echo "<TEXTAREA name=texto cols=100 rows=20 >";
echo file_get_contents($mapfile);
echo "</TEXTAREA>";
echo "<input type=hidden name=tipo value=gravar />";
?>
</form>
<script>
function testar(){
	window.open("../../testamapfile.php?map=<?php echo $_GET["mapfile"]; ?>");
}
function abrirI3geo(){
	window.open("../../ms_criamapa.php?layers=<?php echo $_GET["mapfile"]; ?>");
}
</script>