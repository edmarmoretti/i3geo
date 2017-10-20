<?php
namespace admin\catalogo\mapfile\editavel;
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
	$dados["editavel"] = strtoupper($layer->getmetadata("editavel"));
	if($dados["editavel"] == ""){
		$dados["editavel"] = "NAO";
	}
	$dados["editavel"] = strtoupper($dados["editavel"]);
	$dados["esquematabelaeditavel"] = $layer->getmetadata("esquematabelaeditavel");
	$dados["tabelaeditavel"] = $layer->getmetadata("tabelaeditavel");
	$dados["colunaidunico"] = $layer->getmetadata("colunaidunico");
	$dados["colunageometria"] = $layer->getmetadata("colunageometria");
	return $dados;
}
function alterar($locaplic, $id_tema, $codigo, $editavel, $esquematabelaeditavel, $tabelaeditavel, $colunaidunico, $colunageometria) {
	$arq = $locaplic . "/temas/" . $codigo . ".map";
	if ($codigo == "" || ! file_exists ( $arq )) {
		header ( "HTTP/1.1 400 arquivo nao existe" );
		exit ();
	}
	$mapa = ms_newMapObj ( $arq );
	$layer = @$mapa->getlayerbyname ( $codigo );
	if ($layer == "") {
		return false;
	}
	$layer->setmetadata ( "editavel", $editavel );
	$layer->setmetadata ( "esquematabelaeditavel", $esquematabelaeditavel );
	$layer->setmetadata ( "tabelaeditavel", $tabelaeditavel );
	$layer->setmetadata ( "colunaidunico", $colunaidunico );
	$layer->setmetadata ( "colunageometria", $colunageometria );
	try {
		$mapa->save ( $arq );
		\admin\php\funcoesAdmin\removeCabecalhoMapfile ( $arq );
		return true;
	} catch (Exception $e) {
		return false;
	}
}
?>