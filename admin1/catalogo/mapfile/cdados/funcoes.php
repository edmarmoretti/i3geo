<?php
namespace admin\catalogo\mapfile\cdados;
use Exception;
function listar($locaplic,$codigo){
	// pega o nome registrado no mapfile
	if (! file_exists ( $locaplic . "/temas/" . $codigo . ".map" )) {
		header ( "HTTP/1.1 500 erro mapfile nao existe" );
		exit ();
	}
	$mapa = ms_newMapObj ( $locaplic . "/temas/" . $codigo . ".map" );
	$layer = $mapa->getlayerbyname ( $codigo );
	if ($layer == "") {
		header ( "HTTP/1.1 500 erro nao existe LAYER com o nome $codigo" );
		exit ();
	}
	$dados = array ();
	$dados["escala"] = $layer->getmetadata("escala");
	$dados["extensao"] = $layer->getmetadata("extensao");
	$versao = \admin\php\funcoesAdmin\versao();
	$versao = $versao["principal"];
	if($versao >= 7){
		$dados["encoding"] = $layer->encoding;
	}
	else {
		$dados["encoding"] = "notInVersion";
	}
	$dados["status"] = $layer->status;
	return $dados;
}
function alterar($locaplic, $id_tema, $codigo, $escala, $extensao, $encoding) {
	$arq = $locaplic . "/temas/" . $codigo . ".map";
	if (! file_exists ( $locaplic . "/temas/" . $codigo . ".map" )) {
		return false;
	}
	$mapa = ms_newMapObj ( $arq );
	$layer = @$mapa->getlayerbyname ( $codigo );
	if ($layer == "") {
		return false;
	}
	$layer->setmetadata ( "escala", $escala );
	$layer->setmetadata ( "extensao", str_replace(","," ",$extensao) );
	$versao = \admin\php\funcoesAdmin\versao();
	$versao = $versao["principal"];
	if($versao >= 7){
		$layer->set("encoding",$encoding);
	}
	try {
		$mapa->save ( $arq );
		\admin\php\funcoesAdmin\removeCabecalhoMapfile ( $arq );
		return true;
	} catch (Exception $e) {
		return false;
	}
}
function calculaExtensao($locaplic, $id_tema, $codigo){
	$postgis_mapa = $_SESSION["postgis_mapa"];
	$arq = $locaplic . "/temas/" . $codigo . ".map";
	if (! file_exists ( $locaplic . "/temas/" . $codigo . ".map" )) {
		return false;
	}
	$mapa = ms_newMapObj ( $arq );

	\admin\php\funcoesAdmin\substituiConObj($mapa,$postgis_mapa);
	$extatual = $mapa->extent;
	$extatual->setextent(-180,-90,180,90);
	$layer = @$mapa->getlayerbyname ( $codigo );
	if ($layer == "") {
		return false;
	}
	$original = $layer->getmetadata("extensao");
	$ret = $layer->getextent();
	$ret = $ret->minx." ".$ret->miny." ".$ret->maxx." ".$ret->maxy;
	if($ret != "   "){
		$layer->setmetadata ( "extensao", $ret);
	}
	try {
		$mapa->save ( $arq );
		\admin\php\funcoesAdmin\removeCabecalhoMapfile ( $arq );
		return $ret;
	} catch (Exception $e) {
		return false;
	}
}
?>