<?php
/**
 * Cria um arquivo KMZ com base nos parametros definidos no mapfile $_GET["tema"]
 *
 * Abre o arquivo com cesium/kml3d
 */
include (dirname(__FILE__)."/../../classesphp/sani_request.php");
include("../../classesphp/funcoes_gerais.php");
include("../../ms_configura.php");
include("../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);

$nomeDoMapfileTema = dirname(__FILE__)."/../../temas/".$_GET["tema"].".map";
if(!file_exists($nomeDoMapfileTema)){
	$nomeDoMapfileTema = $dir_tmp."/".$_GET["tema"].".map";
}
//verifica se o mapfile existe
if(!file_exists($nomeDoMapfileTema)){
	echo $_GET["tema"]." nao existe";
	exit;
}
//gera o kmz
$verificaSID = false;
//pega os parametros do mapfile
$mapa = ms_newMapObj($nomeDoMapfileTema);
$l = $mapa->getlayerbyname($_GET["tema"]);
if($l == ""){
	exit;
}
$tme = $l->getmetadata("tme");
if($tme == ""){
	exit;
}
$tme = json_decode($tme,true);
//var_dump($tme);exit;
//define as variaveis que o TME precisa para rodar
$_GET["colunasvalor"] = implode(",",$tme["colsdata"]);
$_GET["barSize"] = $tme["lmax"];
$_GET["maxHeight"] = $tme["amax"];
$_GET["titulo"] = $tme["titulo"];
$_GET["nomelayer"] = $_GET["tema"];
$_GET["colunanomeregiao"] = $tme["colnome"];
$_GET["numvertices"] = $tme["numvertices"];
$_GET["outlinecolor"] = $tme["outlinecolor"];
$_GET["descricao"] = "";
$_GET["numvertices"] = $tme["numvertices"];
$_GET["outlinecolor"] = $tme["outlinecolor"];

//mapfile de inicializacao
$versao = versao();
$versao = $versao["principal"];
if(isset($base) && $base != ""){
	if(file_exists($base)){
		$f = $base;
	}
	else{
		$f = $locaplic."/aplicmap/".$base.".map";
	}
}
else {
	$f = "";
	if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')){
		$f = $locaplic."/aplicmap/geral1windowsv".$versao.".map";
	}
	else {
		if($f == "" && file_exists('/var/www/i3geo/aplicmap/geral1debianv'.$versao.'.map')){
			$f = "/var/www/i3geo/aplicmap/geral1debianv".$versao.".map";
		}
		if($f == "" && file_exists('/var/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
			$f = "/var/www/html/i3geo/aplicmap/geral1fedorav".$versao.".map";
		}
		if($f == "" && file_exists('/opt/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
			$f = "/opt/www/html/i3geo/aplicmap/geral1v".$versao.".map";
		}
		if($f == "")
		{
			$f = $locaplic."/aplicmap/geral1v".$versao.".map";
		}
	}
}
$map_file = $dir_tmp."/".md5(implode("",$_GET)).".map";

$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
$mapn = ms_newMapObj($f);
$w = $mapn->web;
$atual = $w->imageurl;
//cria um arquivo mapfile com o layer a ser adicionado
$maptemp = ms_newMapObj($nomeDoMapfileTema);
$layern = $maptemp->getLayerbyname($_GET["tema"]);
ms_newLayerObj($mapn, $layern);

$mapn->save($map_file);

$_SESSION["tmpurl"] = strtolower($protocolo[0])."://".$_SERVER['HTTP_HOST'].$atual;
$_SESSION["map_file"] = $map_file;
$_SESSION["postgis_mapa"] = $postgis_mapa;
$_SESSION["mapext"] = "-180,-90,180,90";
//cria o kmz
$inclusao = true;
include("../../pacotes/tme/TME_i3geo.php");
ob_clean();
$urln = "../cesium/kml3d.php?kmlurl=".$url."&legenda=".$legenda;
header("Location:".$urln);

?>