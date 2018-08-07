<?php
//
//caso o usu&aacute;rio seja um administrador, ele pode enviar um nome de diret&oacute;rio onde os arquivos ser&atilde;o armazenados
//na vari&aacute;vel $dirDestino
//
include_once (dirname(__FILE__)."/../../classesphp/sani_request.php");
$_GET = array_merge($_GET,$_POST);
if(isset($_GET["tipo"])){
	$tipo = $_GET["tipo"];
}
require_once(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");
include_once (dirname(__FILE__)."/../../classesphp/carrega_ext.php");
//error_reporting(0);
session_name("i3GeoPHP");
if(isset($_GET["g_sid"]) && $_GET["g_sid"] != ""){
	session_id($_GET["g_sid"]);
	session_start();
	$map_file = $_SESSION["map_file"];
}
else{
	exit;
}
if(!file_exists($map_file)){
	exit;
}
if (ob_get_level() == 0) ob_start();

?>
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
</head>
<body bgcolor="white" style="background-color:white;text-align:left;">
<p>
<?php
if (isset($_FILES['i3GEOuploadshp']['name']))
{
	require_once (dirname(__FILE__)."/../../ms_configura.php");
	include(dirname(__FILE__)."/../blacklist.php");
	verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);

	if(isset($logExec) && $logExec["upload"] == true){
		i3GeoLog("prog: upload filename:" . $_FILES['i3GEOuploadshp']['name'],$dir_tmp);
	}

	echo "<p class='paragrafo' >Carregando o arquivo...</p>";
	ob_flush();
	flush();
	sleep(1);
	$mapa = ms_newMapObj($map_file);
	$dirmap = dirname($map_file);
	if(!file_exists($dirmap)){
		exit;
	}
	//verifica nomes
	verificaNome($_FILES['i3GEOuploadshp']['name']);
	verificaNome($_FILES['i3GEOuploadshx']['name']);
	verificaNome($_FILES['i3GEOuploaddbf']['name']);

	if($_FILES['i3GEOuploadprj']['name'] != ""){
		verificaNome($_FILES['i3GEOuploadprj']['name']);
	}

	//remove acentos
	$nomePrefixo = str_replace(" ","_",removeAcentos(str_replace(".shp","",$_FILES['i3GEOuploadshp']['name'])));

	$nomePrefixo = str_replace(".","",$nomePrefixo);
	$nomePrefixo = strip_tags($nomePrefixo);
	$nomePrefixo = htmlspecialchars($nomePrefixo, ENT_QUOTES);
	$nomePrefixo = $nomePrefixo . md5(uniqid(rand(), true));

	//sobe arquivo
	$Arquivo = $_FILES['i3GEOuploadshp']['tmp_name'];
	if(file_exists($dirmap."/".$nomePrefixo.".shp"))
	{echo "<p class='paragrafo' >J&aacute; existe um SHP com o nome ";paraAguarde();exit;}
	$status =  move_uploaded_file($Arquivo,$dirmap."/".$nomePrefixo.".shp");
	if($status != 1)
	{echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo SHP. Pode ser uma limita&ccedil;&atilde;o quanto ao tamanho do arquivo ou permiss&atilde;o de escrita na pasta indicada.";paraAguarde();exit;}

	$Arquivo = $_FILES['i3GEOuploadshx']['tmp_name'];
	$status =  move_uploaded_file($Arquivo,$dirmap."/".$nomePrefixo.".shx");
	if($status != 1)
	{echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo SHX";paraAguarde();exit;}

	$Arquivo = $_FILES['i3GEOuploaddbf']['tmp_name'];
	$status =  move_uploaded_file($Arquivo,$dirmap."/".$nomePrefixo.".dbf");
	if($status != 1)
	{echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo DBF";paraAguarde();exit;}

	if($_FILES['i3GEOuploadprj']['name'] != ""){
		$Arquivo = $_FILES['i3GEOuploadprj']['tmp_name'];
		$status =  move_uploaded_file($Arquivo,$dirmap."/".$nomePrefixo.".prj");
		if($status != 1){
			echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo PRJ";paraAguarde();exit;
		}
	}

	if(!file_exists($dirmap."/".$nomePrefixo.".shp"))
	{echo "<p class='paragrafo' >Ocorreu algum problema no envio do arquivo ";paraAguarde();exit;}


	$checkphp = fileContemString($dirmap."/".$nomePrefixo.".prj","<?");
	if($checkphp == true){
		echo "Arquivo prj invalido";
		unlink($dirmap."/".$nomePrefixo.".shp");
		unlink($dirmap."/".$nomePrefixo.".dbf");
		unlink($dirmap."/".$nomePrefixo.".shx");
		unlink($dirmap."/".$nomePrefixo.".prj");
		exit;
	}
	$checkphp = fileContemString($dirmap."/".$nomePrefixo.".shx","<?");
	if($checkphp == true){
		echo "Arquivo shx invalido";
		unlink($dirmap."/".$nomePrefixo.".shp");
		unlink($dirmap."/".$nomePrefixo.".dbf");
		unlink($dirmap."/".$nomePrefixo.".shx");
		unlink($dirmap."/".$nomePrefixo.".prj");
		exit;
	}
	$checkphp = fileContemString($dirmap."/".$nomePrefixo.".dbf","<?");
	if($checkphp == true){
		echo "Arquivo dbf invalido";
		unlink($dirmap."/".$nomePrefixo.".shp");
		unlink($dirmap."/".$nomePrefixo.".dbf");
		unlink($dirmap."/".$nomePrefixo.".shx");
		unlink($dirmap."/".$nomePrefixo.".prj");
		exit;
	}

	echo "<p class='paragrafo' >Arquivo enviado.</p>";
	echo "<p class='paragrafo'></p>";
	//nesse caso o formulario de upload esta sendo executado de dentro de um mapa interativo, por isso o mapfile ja existe
	echo "<p class='paragrafo' >Adicionando tema...</p>";
	ob_flush();
	flush();
	sleep(1);
	$novolayer = ms_newLayerObj($mapa);
	$novolayer->set("data",$dirmap."/".$nomePrefixo.".shp");
	$novolayer->set("name",$_FILES['i3GEOuploadshp']['name']);
	$novolayer->setmetadata("TEMA",$_FILES['i3GEOuploadshp']['name']);
	$novolayer->setmetadata("DOWNLOAD","SIM");
	$sfileObj = ms_newShapefileObj($dirmap."/".$nomePrefixo.".shp", -1);
	if(!isset($tipo) || $tipo == "")
	{$tipo = $sfileObj->type;}
	if ($tipo == 1){$novolayer->set("type",MS_LAYER_POINT);} // ponto
	if ($tipo == 3){$novolayer->set("type",MS_LAYER_LINE);}
	if ($tipo == 5){$novolayer->set("type",MS_LAYER_POLYGON);}
	$novolayer->setmetadata("TEMALOCAL","SIM");
	$novolayer->setmetadata("CLASSE","SIM");
	$novolayer->setmetadata("TEXTO","NAO");
	//if (($tipo != 3) and ($tipo != 8 )){$novolayer->set("type",0);}
	$novolayer->setfilter("");
	$classe = ms_newClassObj($novolayer);
	$classe->set("name","");
	$estilo = ms_newStyleObj($classe);
	if ($tipo == 1)
	{
		$estilo->set("symbolname","ponto");
		$estilo->set("size",6);
	}
	$estilo->color->setrgb(200,50,0);
	$estilo->outlinecolor->setrgb(0,0,0);
	// le os itens
	$novolayer->set("status",MS_DEFAULT);
	$abriu = $novolayer->open();
	$items = $novolayer->getItems();
	$fechou = $novolayer->close();
	if ($items != "")
	{
		$its = implode(",",$items);
		$novolayer->setmetadata("ITENS",$its);
		$novolayer->setmetadata("ITENSDESC",$its);
		$novolayer->set("template","none.htm");
	}
	if(isset($_GET["uploadEPSG"]) && $_GET["uploadEPSG"] != ""){
		$novolayer->setProjection("init=epsg:".$_GET["uploadEPSG"]);
	}
	if(file_exists($dirmap."/".$nomePrefixo.".prj")){
		$novolayer->setProjection("AUTO");
	}
	//$adiciona = ms_newLayerObj($mapa, $novolayer);
	$salvo = $mapa->save($map_file);
	//grava os templates de cada tema
	echo "<b><p class='paragrafo' >Tema criado!!! Redesenhando o mapa.";
	echo "<script>window.scrollTo(0,10000);window.parent.i3GEO.atualiza();window.parent.i3GEOF.uploadshp.doneok();</script>";
}
else
{
	echo "<p class='paragrafo' >Erro ao enviar o arquivo. Talvez o tamanho do arquivo seja maior do que o permitido.</p>";
}
restauraCon($map_file,$postgis_mapa);
paraAguarde();
function paraAguarde(){
	echo "<script>window.parent.i3GEOF.uploadshp.destroy();</script>";
}
function verificaNome($nome){
	if(strlen(basename($nome)) > 200){
		exit;
	}
	$nome = strtolower($nome);
	$lista = explode(".",$nome);
	$extensao = $lista[count($lista) - 1];
	if(($extensao != "dbf") && ($extensao != "shx") && ($extensao != "shp") && ($extensao != "prj"))
	{
		echo "Nome de arquivo inv&aacute;lido. $nome";
		paraAguarde();
		exit;
	}
}
?>
</body>
</html>
