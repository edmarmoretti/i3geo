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
	<link rel="stylesheet" type="text/css" href="../html/admin.css">
</head>
<body class=" yui-skin-sam fundoPonto">
<div class="bordaSuperior"  >&nbsp;</div>
<div class="mascaraPrincipal" id="divGeral" style="width:80%">
	<div id=cabecalhoPrincipal ></div>
	<h1>Editor de mapfiles</h1>
	<a href="http://mapserver.org/mapfile/index.html#mapfile" target="_new" >Documentação do Mapserver</a><br><br>
	<a href="../html/editormapfile.html" target="_self" >Voltar</a><br><br>
	<form action="editortexto.php?mapfile=<?php echo $_GET["mapfile"];?>" method=post > 
	<input type=submit value="Salvar"/><input type=button value="Testar" onclick="testar()" /><input type=button value="Testar no i3Geo" onclick="abrirI3geo()" /> (Salve antes de testar)<br><br>
	<div id="comboMapfiles" >Aguarde...</div>
	<br>
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
	$mapfile = $locaplic."/temas/".$_GET["mapfile"].".map";
	if(!file_exists($mapfile))
	{echo "Arquivo $mapfile não existe.";exit;}
	if($_POST["tipo"] == "gravar"){
		$fp = fopen($mapfile,"w");
		fwrite($fp,$gravarTexto);
		fclose($fp);
	}
	echo "Edite:<br>";
	echo "<TEXTAREA name=texto cols=100 rows=20 style='width:100%'>";
	echo file_get_contents($mapfile);
	echo "</TEXTAREA>";
	echo "<input type=hidden name=tipo value=gravar />";
	$mapa = ms_newMapObj($mapfile);
	$n = $mapa->numlayers;
	echo "Colunas dos layers:<br><br>";
	for($i=0;$i<$n;$i++){
		$l = $mapa->getlayer($i);
		echo $l->name.": ".(implode(",",pegaItens($l)))."<br><br>";
	}	
	?>
	</form>
</div>
<script type="text/javascript" src="../js/core.js"></script>
<script src="../../classesjs/classe_util.js" type="text/javascript"></script>
<script>
function comboMapfiles(){
	var n = $mapfiles.length,
		i,ins;
	ins = "<select onchange='mudaMapfile(this)'><option value=''>Edite outro mapfile</option>";
	for(i=0;i<n;i++){
		if($mapfiles[i].extensao === "map"){
			ins += "<option value='"+$mapfiles[i].codigo+"'>"+$mapfiles[i].codigo+" - "+$mapfiles[i].nome+"</optiona>";
		}
	}
	ins += "</select>";
	$i("comboMapfiles").innerHTML = ins;
};
core_pegaMapfiles("comboMapfiles()","","");
function mudaMapfile(obj){
	if(obj.value != ""){
		window.location.href = "editortexto.php?mapfile="+obj.value;
	}
}
function testar(){
	window.open("../../testamapfile.php?map=<?php echo $_GET["mapfile"]; ?>");
}
function abrirI3geo(){
	window.open("../../ms_criamapa.php?layers=<?php echo $_GET["mapfile"]; ?>");
}
</script>