<?php

namespace admin\catalogo\mapfile\conexao\local;

function listar($locaplic, $codigo) {
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
	$dados ["connection"] = $layer->connection;
	$dados ["connectiontype"] = $layer->connectiontype;
	$dados ["data"] = $layer->data;
	$dados ["tileindex"] = $layer->tileindex;
	$dados ["tileitem"] = $layer->tileitem;
	if ($dados ["tileindex"] == "") {
		$dados ["tileitem"] = "";
	}
	if (is_array ( $postgis_mapa )) {
		$dados ["postgis_mapa"] = array_keys ( $postgis_mapa );
	} else {
		$dados ["postgis_mapa"] = $postgis_mapa;
	}
	$dados ["type"] = $layer->type;
	$dados ["projection"] = $layer->getProjection ();
	if ($dados ["projection"] == "null") {
		$dados ["projection"] = "";
	}
	$dados ["projection"] = str_replace ( "+i", "i", $dados ["projection"] );
	$dados ["convcaracter"] = $layer->getmetadata ( "convcaracter" );
	// informacoes sobre a integracao com o sistema de metadados estatisticos
	$dados ["metaestat"] = $layer->getmetadata ( "metaestat" );
	if ($dados ["metaestat"] == "") {
		$dados ["metaestat"] = "NAO";
	}
	$dados ["metaestat_id_medida_variavel"] = $layer->getmetadata ( "metaestat_id_medida_variavel" );
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
		include (dirname ( __FILE__ ) . "/../../../php/removeCabecalhoMapfile.php");
		removeCabecalhoMapfile ( $arq );
		return true;
	} catch ( Exception $e ) {
		return false;
	}
}
?>