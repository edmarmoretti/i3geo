<?php
namespace admin\catalogo\mapfile\renderizacao;
function listar($locaplic,$codigo){
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
	$dados["cacheprefixo"] = strtoupper($layer->getmetadata("cacheprefixo"));
	$dados["cache"] = strtoupper($layer->getmetadata("cache"));
	if($dados["cache"] == ""){
		$dados["cache"] = "NAO";
	}
	$dados["tiles"] = strtoupper($layer->getmetadata("tiles"));
	if($dados["tiles"] == ""){
		$dados["tiles"] = "SIM";
	}
	$dados["cortepixels"] = $layer->getmetadata("cortepixels");
	$dados["maxfeatures"] = $layer->maxfeatures;
	if($dados["maxfeatures"] == -1){
		$dados["maxfeatures"] = "";
	}
	return $dados;
}
function alterar($locaplic, $id_tema, $codigo, $cache, $tiles, $maxfeatures, $cortepixels, $cacheprefixo) {
    $arq = $locaplic . "/temas/" . $codigo . ".map";
	if (! file_exists ( $locaplic . "/temas/" . $codigo . ".map" )) {
		return false;
	}
	$mapa = ms_newMapObj ( $arq );
	$layer = @$mapa->getlayerbyname ( $codigo );
	if ($layer == "") {
		return false;
	}
	$layer->setmetadata ( "cache", $cache );
	$layer->setmetadata ( "cacheprefixo", $cacheprefixo );
	$layer->setmetadata ( "tiles", $tiles );
	$layer->setmetadata ( "cortepixels", $cortepixels );
	if(empty($maxfeatures)){
		$maxfeatures = -1;
	}
	$layer->set("maxfeatures",$maxfeatures);

	try {
		$mapa->save ( $arq );
		\admin\php\funcoesAdmin\removeCabecalhoMapfile ( $arq );
		return true;
	} catch (Exception $e) {
		return false;
	}
}
?>