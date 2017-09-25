<?php
namespace admin\catalogo\mapfile\disponibilidade;
use PDOException;
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
	$dados ["download"] = strtoupper ( $layer->getmetadata ( "download" ) );
	if (empty ( $dados ["download"] )) {
		$dados ["download"] = "SIM";
	}
	$dados ["permiteogc"] = strtoupper ( $layer->getmetadata ( "permiteogc" ) );
	if (empty ( $dados ["permiteogc"] )) {
		$dados ["permiteogc"] = "SIM";
	}
	$dados ["permitedownload"] = strtoupper ( $layer->getmetadata ( "permitedownload" ) );
	if (empty ( $dados ["permitedownload"] )) {
		$dados ["permitedownload"] = "SIM";
	}
	$dados ["permitekml"] = strtoupper ( $layer->getmetadata ( "permitekml" ) );
	if (empty ( $dados ["permitekml"] )) {
		$dados ["permitekml"] = "SIM";
	}
	$dados ["permitekmz"] = strtoupper ( $layer->getmetadata ( "permitekmz" ) );
	if (empty ( $dados ["permitekmz"] )) {
		$dados ["permitekmz"] = "SIM";
	}
	$dados ["arquivodownload"] = $layer->getmetadata ( "arquivodownload" );
	$dados ["arquivokmz"] = $layer->getmetadata ( "arquivokmz" );
	$dados ["description_template"] = $layer->getmetadata ( "description_template" );
	return $dados;
}
function alterar($locaplic, $id_tema, $codigo, $permiteogc, $permitedownload, $permitekml, $permitekmz, $download, $arquivodownload, $arquivokmz, $description_template, $dbhw){
	$esquemaadmin = $_SESSION["esquemaadmin"];
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
	$layer->setmetadata ( "download", $download );
	$layer->setmetadata ( "permiteogc", $permiteogc );
	$layer->setmetadata ( "permitedownload", $permitedownload );
	$layer->setmetadata ( "permitekml", $permitekml );
	$layer->setmetadata ( "permitekmz", $permitekmz );
	$layer->setmetadata ( "arquivodownload", $arquivodownload );
	$layer->setmetadata ( "description_template", $description_template );

	$layer->setmetadata ( "arquivokmz", $arquivokmz );
	if (! empty ( $id_tema )) {
		try {
			$dataCol = array (
					"kml_tema" => $permitekml,
					"kmz_tema" => $permitekmz,
					"ogc_tema" => $permiteogc,
					"download_tema" => $download
			);
			$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoadmin_temas", $dataCol, "WHERE id_tema = $id_tema" );
			if ($resultado === false) {
				return false;
			}
		} catch ( PDOException $e ) {
			return false;
		}
	}
	try {
		$mapa->save ( $arq );
		\admin\php\funcoesAdmin\removeCabecalhoMapfile ( $arq );
		return true;
	} catch (Exception $e) {
		return false;
	}
}
?>