<?php
namespace admin\catalogo\mapfile\comportamento;
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
	$dados["aplicaextensao"] = $layer->getmetadata("aplicaextensao");
	if (empty ( $dados ["aplicaextensao"] )) {
		$dados ["aplicaextensao"] = "NAO";
	}
	$dados["permitecomentario"] = $layer->getmetadata("permitecomentario");
	if (empty ( $dados ["permitecomentario"] )) {
		$dados ["permitecomentario"] = "NAO";
	}
	$dados["temporizador"] = $layer->getmetadata("temporizador");
	if ($dados ["temporizador"] == 0) {
		$dados ["temporizador"] = "";
	}
	$dados["escondido"] = $layer->getmetadata("escondido");
	if (empty ( $dados ["escondido"] )) {
		$dados ["escondido"] = "NAO";
	}
	$dados["transitioneffect"] = $layer->getmetadata("transitioneffect");
	if (empty ( $dados ["transitioneffect"] )) {
		$dados ["transitioneffect"] = "NAO";
	}
	$dados["iconetema"] = $layer->getmetadata("iconetema");
	if (empty ( $dados ["iconetema"] )) {
		$dados ["iconetema"] = "";
	}
	$dados["mensagem"] = $layer->getmetadata("mensagem");
	if (empty ( $dados ["mensagem"] )) {
		$dados ["mensagem"] = "";
	}
	if(mb_detect_encoding($mensagem,'UTF-8, ISO-8859-1') == "ISO-8859-1"){
		$mensagem = utf8_encode($mensagem);
	}
	$dados["status"] = $layer->status;
	$dados["wkttip"] = $layer->getmetadata("wkttip");
	if (empty ( $dados ["wkttip"] )) {
		$dados ["wkttip"] = "NAO";
	}
	return $dados;
}
function alterar($locaplic, $id_tema, $codigo, $aplicaextensao, $permitecomentario, $temporizador, $escondido, $transitioneffect, $status, $iconetema, $mensagem, $wkttip){
	$convUTF = $_SESSION["convUTF"];
	$esquemaadmin = $_SESSION["esquemaadmin"];
	$arq = $locaplic . "/temas/" . $codigo . ".map";
	if (! file_exists ( $locaplic . "/temas/" . $codigo . ".map" )) {
		return false;
	}
	$mapa = ms_newMapObj ( $arq );
	$layer = @$mapa->getlayerbyname ( $codigo );
	if ($layer == "") {
		return false;
	}
	$layer->setmetadata ( "aplicaextensao", $aplicaextensao );
	$layer->setmetadata ( "permitecomentario", $permitecomentario );
	$layer->setmetadata ( "temporizador", $temporizador );
	$layer->setmetadata ( "escondido", $escondido );
	$layer->setmetadata ( "transitioneffect", $transitioneffect );
	$layer->setmetadata ( "iconetema", $iconetema );
	if(mb_detect_encoding($mensagem,'UTF-8, ISO-8859-1') == "UTF-8"){
		$mensagem = utf8_decode($mensagem);
	}
	$layer->setmetadata ( "mensagem", $mensagem );
	$layer->setmetadata ( "wkttip", $wkttip );
	$layer->set("status",$status);
	try {
		$mapa->save ( $arq );
		\admin\php\funcoesAdmin\removeCabecalhoMapfile ( $arq );
		return true;
	} catch (Exception $e) {
		return false;
	}
}
?>