<?php
//
//caso o usu&aacute;rio seja um administrador, ele pode enviar um nome de diret&oacute;rio onde os arquivos ser&atilde;o armazenados
//na vari&aacute;vel $dirDestino
//
require_once("../../classesphp/pega_variaveis.php");
require_once("../../classesphp/funcoes_gerais.php");
include_once ("../../classesphp/carrega_ext.php");
error_reporting(0);
session_name("i3GeoPHP");
if(isset($g_sid) && $g_sid != ""){
	session_id($g_sid);
	session_start();
	foreach(array_keys($_SESSION) as $k)
	{eval("\$".$k."='".$_SESSION[$k]."';");}
}
if (ob_get_level() == 0) ob_start();
?>
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<link rel="stylesheet" type="text/css" href="../../css/geral.css" />
<title></title>
</head>
<body bgcolor="white" style="background-color:white;text-align:left;">
<p>
<?php
if (isset($_FILES['i3GEOuploadshp']['name']))
{
	require_once ("../../ms_configura.php");
	echo "<p class='paragrafo' >Carregando o arquivo...</p>";
	ob_flush();
	flush();
	sleep(1);
	if(isset($map_file)){
		$mapa = ms_newMapObj($map_file);
		$dirmap = dirname($map_file);
	}
	if(isset($dirDestino) && $dirDestino != ""){
		$dirmap = $dirDestino;
		include_once(dirname(__FILE__)."/../../admin/php/login.php");
		if(verificaOperacaoSessao("admin/php/editortexto") == false){
			echo "Vc nao pode realizar salvar os dados no servidor em uma pasta espec&iacute;fica";exit;
		}
		if(!file_exists($dirmap))
		{echo "<p class='paragrafo' >Pasta n&atilde;o existe no servidor";paraAguarde();exit;}
	}
	//verifica nomes
	verificaNome($_FILES['i3GEOuploadshp']['name']);
	verificaNome($_FILES['i3GEOuploadshx']['name']);
	verificaNome($_FILES['i3GEOuploaddbf']['name']);
	//remove acentos
	$nomePrefixo = str_replace(" ","_",removeAcentos(str_replace(".shp","",$_FILES['i3GEOuploadshp']['name'])));
	//$nomePrefixo = $nomePrefixo."_".(nomeRandomico(4));

	//sobe arquivo
	$Arquivo = $_FILES['i3GEOuploadshp']['tmp_name'];
	if(file_exists($dirmap."/".$nomePrefixo.".shp"))
	{echo "<p class='paragrafo' >J&aacute; existe um SHP com o nome ".$dirmap."/".$nomePrefixo;paraAguarde();exit;}

	$status =  move_uploaded_file($Arquivo,$dirmap."/".$nomePrefixo.".shp");
	if($status != 1)
	{echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo SHP. Pode ser uma limita&ccedil;&atilde;o quanto ao tamanho do arquivo.";paraAguarde();exit;}
	$Arquivo = $_FILES['i3GEOuploadshx']['tmp_name'];
	$status =  move_uploaded_file($Arquivo,$dirmap."/".$nomePrefixo.".shx");
	if($status != 1)
	{echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo SHX";paraAguarde();exit;}
	$Arquivo = $_FILES['i3GEOuploaddbf']['tmp_name'];
	$status =  move_uploaded_file($Arquivo,$dirmap."/".$nomePrefixo.".dbf");
	if($status != 1)
	{echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo DBF";paraAguarde();exit;}

	if(!file_exists($dirmap."/".$nomePrefixo.".shp"))
	{echo "<p class='paragrafo' >Ocorreu algum problema no envio do arquivo ".$dirmap."/".$nomePrefixo;paraAguarde();exit;}

	echo "<p class='paragrafo' >Arquivo enviado.</p>";
	echo "<p class='paragrafo'>Nome: ".$dirmap."/".$nomePrefixo.".shp </p>";
	if(isset($map_file)){
		echo "<p class='paragrafo' >Adicionando tema...</p>";
		ob_flush();
		flush();
		sleep(1);
		$novolayer = ms_newLayerObj($mapa);
		$novolayer->set("data",$dirmap."/".$nomePrefixo.".shp");
		$novolayer->set("name",$nomePrefixo.".shp");
		$novolayer->setmetadata("TEMA",$nomePrefixo.".shp");
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
		if(isset($uploadEPSG) && $uploadEPSG != "")
		{$novolayer->setProjection("init=epsg:".$uploadEPSG);}
		//$adiciona = ms_newLayerObj($mapa, $novolayer);
		$salvo = $mapa->save($map_file);
		//grava os templates de cada tema
		echo "<b><p class='paragrafo' >Tema criado!!! Redesenhando o mapa.";
		echo "<script>window.scrollTo(0,10000);window.parent.i3GEO.atualiza()</script>";
	}
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
	if(($extensao != "dbf") && ($extensao != "shx") && ($extensao != "shp"))
	{
		echo "Nome de arquivo inv&aacute;lido.";
		paraAguarde();
		exit;
	}
}
?>
</body>
</html>
