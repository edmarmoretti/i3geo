<?php
/*
 * Gera uma miniatura de um mapfile salvo no banco de dados
 * Verifica se a imagem existe, caso contrario cria uma no diretorio temporario
 *
 * @param restauramapa - id do mapa a ser restaurado
 * @param w
 * @param h
 */
include_once (dirname(__FILE__)."/../../ms_configura.php");
include(dirname(__FILE__)."/../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
include_once (dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");

if (filter_var($_GET["restauramapa"], FILTER_VALIDATE_INT) === false){
	exit;
}

$base = restauraMapaAdmin($_GET["restauramapa"],$dir_tmp);

$nomeImagem = dirname($base)."/".str_replace(".map","","restauramapa".$_GET["restauramapa"])."_miniatura.png";
//por seguranca
$nomeImagem = str_replace(".png","",$nomeImagem);
$nomeImagem = str_replace(".","",$nomeImagem).".png";

if(!file_exists($nomeImagem)){
	$mapa = ms_newMapObj($base);
	substituiConObj($mapa,$postgis_mapa);
	$mapa->setsize($_GET["w"],$_GET["h"]);
	$sca = $mapa->scalebar;
	$sca->set("status",MS_OFF);
	$objImagemM = @$mapa->draw();
	$objImagemM->saveImage($nomeImagem);
}
ob_clean();
header('Content-Type: image/png');
readfile($nomeImagem);
?>