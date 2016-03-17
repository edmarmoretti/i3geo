<?php
//$tema - nome do mapfile
//$colunat - coluna que contem os periodos
//$tempo - tempo entre os frames
//$w
//$h
//$cache
//$mapext
//http://localhost/i3geo/ferramentas/animagif/exec.php?tema=_llocali&colunat=ANOCRIA&w=500&h=500&mapext=-72%20-33%20-32%204
include("../../ms_configura.php");
include("../../classesphp/funcoes_gerais.php");
include("../../classesphp/pega_variaveis.php");
include("../../classesphp/carrega_ext.php");
$nometemp = nomeRandomico();
$arqtemp = $dir_tmp."/".$nometemp;
//
//carrega o phpmapscript
//
if (!function_exists('ms_GetVersion'))
{
	if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
	{
		if(!@dl('php_mapscript_48.dll'))
			dl('php_mapscript.dll');
	}
	else
	{dl('php_mapscript.so');
	}
}
$versao = versao();
$versao = $versao["principal"];

//cria um mapa temporario
if($base == "" or !isset($base)){
	$base = "";
	if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')){
		$base = $locaplic."/aplicmap/geral1windowsv".$versao.".map";
	}
	else{
		if($base == "" && file_exists('/var/www/i3geo/aplicmap/geral1debianv'.$versao.'.map')){
			$base = "/var/www/i3geo/aplicmap/geral1debianv".$versao.".map";
		}
		if($base == "" && file_exists('/var/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
			$base = "/var/www/html/i3geo/aplicmap/geral1fedorav".$versao.".map";
		}
		if($base == "" && file_exists('/opt/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
			$base = "/opt/www/html/i3geo/aplicmap/geral1v".$versao.".map";
		}
		if($base == ""){
			$base = $locaplic."/aplicmap/geral1v".$versao.".map";
		}
	}
}
else{
	if(!file_exists($base)){
		$base = $locaplic."/aplicmap/".$base;
	}
}
$mapa = ms_newMapObj($base);

//remove as camadas do mapa base
$numlayers = $mapa->numlayers;
for ($i=0;$i < $numlayers;$i++){
	$layern = $mapa->getlayer($i);
	if($layern->name != "copyright"){
		$layern->set("status",MS_DELETE);
	}
	else{
		$layern->set("status",MS_DEFAULT);
	}
}
//ajusta o label
$l = $mapa->getlayerbyname("copyright");
$classe = $l->getclass(0);
$label = $classe->getLabel(0);
$label->updatefromstring("LABEL TYPE TRUETYPE END");
$label->set("font","arial");
$label->set("size",15);
$label->updatefromstring("LABEL POSITION lr END");
//$label->updatefromstring("LABEL OUTLINECOLOR 255 255 255 OUTLINEWIDTH 10 END");
//$labels = new styleObj($classe);
$label->updatefromstring('LABEL STYLE GEOMTRANSFORM "labelpoly" COLOR 255 255 255 END END');
//
$mapa->save($arqtemp.".map");
//adiciona ao mapa base as camadas do mapfile indicado em $tema
$nmapa = ms_newMapObj($locaplic."/temas/".$tema.".map");
$numlayers = $nmapa->numlayers;
for ($i=0;$i < $numlayers;$i++){
	$layern = $nmapa->getlayer($i);
	$layern->set("status",MS_DEFAULT);
	if (!empty($postgis_mapa)){
		if ($layern->connectiontype == MS_POSTGIS){
			$lcon = $layern->connection;
			error_reporting(0);
			if (($lcon == " ") || ($lcon == "") || (in_array($lcon,array_keys($postgis_mapa)))){
				if(($lcon == " ") || ($lcon == "")){
					$layern->set("connection",$postgis_mapa);
				}
				else{
					$layern->set("connection",$postgis_mapa[$lcon]);
				}
			}
		}
	}
	autoClasses($layern,$nmapa);
	cloneInlineSymbol($layern,$nmapa,$mapa);
	ms_newLayerObj($mapa, $layern);
}
$mapa->save($arqtemp.".map");
//aplica a extensao geografica
$layer = $mapa->getlayerbyname($tema);

$extatual = $mapa->extent;
$ret = "";
if(isset($mapext)){
	$ret = str_replace(","," ",$mapext);
}
else{
	$ret = $layer->getmetadata("extensao");
}
if ($ret != ""){
	$ret = explode(" ",$ret);
	$extatual->setextent($ret[0],$ret[1],$ret[2],$ret[3]);
}
$mapa->setsize($w,$h);
$sca = $mapa->scalebar;
$sca->set("status",MS_OFF);
$c = $mapa->imagecolor;
$c->setrgb(-1,-1,-1);
$o = $mapa->outputformat;
$o->set("imagemode",MS_IMAGEMODE_RGBA);
$o->set("transparent",MS_TRUE);
$mapa->save($arqtemp.".map");
$mapa = ms_newMapObj($arqtemp.".map");
if(validaAcessoTemas($arqtemp.".map",false) == true){
	echo "Existem temas restritos";exit;
}
//pega a lista de valores unicos da $colunat
include_once("../../classesphp/classe_atributos.php");
$m = new Atributos($arqtemp.".map",$tema);
$lista = $m->listaRegistros($colunat,"mapa","sim",0,"","tudo","nao");
$lista = $lista[1]["registros"];
$listaunica = array();
foreach($lista as $l){
	$v = $l["valores"][0]["valor"];
	if($v != ""){
		$listaunica[] = $v;
	}
}
sort($listaunica);
//cria as imagens para cada periodo
$layer = $mapa->getlayerbyname($tema);

$l = $mapa->getlayerbyname("copyright");
$c = $l->getclass(0);
$label = $c->getLabel(0);

$imagens = array();
$duracao = array();
$objImagem = "";
//$listaunica = array($listaunica[1]);
foreach($listaunica as $d){
	$filtro = "(([$colunat] = $d))";
	$layer->setfilter($filtro);
	$nomec = $arqtemp.$d.".png";

	$s = "LABEL TEXT '".$d."' END";
	$label->updateFromString($s);

	if($objImagem == ""){
		$objImagem = $mapa->draw();
		$objImagem->saveImage($nomec);
	}
	else{
		$i = $mapa->draw();
		$objImagem->pasteImage($i,-1);
		$objImagem->saveImage($nomec);
	}
	$imagens[] = $nomec;
	$duracao[] = 40;
}
//junta as imagens no gif
include("../../pacotes/gifcreator/GifCreator.php");
$gc = new GifCreator();
$gc->create($imagens, $duracao, 1);
$gifBinary = $gc->getGif();
//retorna o gif para o navegador
header('Content-type: image/gif');
header('Content-Disposition: filename="butterfly.gif"');
echo $gifBinary;
exit;
?>