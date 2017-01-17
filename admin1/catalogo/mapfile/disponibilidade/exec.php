<?php
/*
 * Licenca:
 *
 * GPL2
 *
 * i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet
 *
 * Direitos Autorais Reservados (c) 2006 Edmar Moretti
 * Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com
 *
 * Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
 * e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
 * GNU conforme publicada pela Free Software Foundation;
 *
 * Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
 * por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
 * de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
 * Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
 * Voc&ecirc; deve ter recebido uma copia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a
 * Free Software Foundation, Inc., no endere&ccedil;o
 * 59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 */
error_reporting ( 0 );
//
// pega as variaveis passadas com get ou post
//

include_once (dirname ( __FILE__ ) . "/../../../../admin/php/login.php");
if (verificaOperacaoSessao ( "admin/html/editormapfile" ) === false) {
	header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
	exit ();
}

include (dirname ( __FILE__ ) . "/../../../../admin/php/conexao.php");

$codigo = $_POST ["codigo"];
$id_tema = ( int ) $_POST ["id_tema"];

$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ALTERAR" :
		$codigo = str_replace ( " ", "", removeAcentos ( $codigo ) );
		$codigo = str_replace ( ".", "", $codigo );
		$codigo = strip_tags ( $codigo );
		$codigo = htmlspecialchars ( $codigo, ENT_QUOTES );
		$arq = $locaplic . "/temas/" . $codigo . ".map";
		if ($codigo == "" || ! file_exists ( $arq )) {
			header ( "HTTP/1.1 400 arquivo nao existe" );
			exit ();
		}
		// quando e feita a listagem unica, o mapfile ja foi registrado no banco se nao tinha sido antes
		$novo = alterar ( $locaplic, $id_tema, $codigo, $_POST["permiteogc"], $_POST["permitedownload"], $_POST["permitekml"], $_POST["permitekmz"], $_POST["download"], $_POST["arquivodownload"], $_POST["arquivokmz"], $dbhw );
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( array (
				"codigo" => $codigo
		) );
		exit ();
		break;
	case "LISTA" :
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
		retornaJSON ( array (
				"dados" => $dados
		) );
		break;
}
cpjson ( $retorno );
function alterar($locaplic, $id_tema, $codigo, $permiteogc, $permitedownload, $permitekml, $permitekmz, $download, $arquivodownload, $arquivokmz, $dbhw) {
	global $esquemaadmin;
	$arq = $locaplic . "/temas/" . $codigo . ".map";
	if (! file_exists ( $locaplic . "/temas/" . $codigo . ".map" )) {
		return false;
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
	$layer->setmetadata ( "arquivokmz", $arquivokmz );
	if (! empty ( $id_tema )) {
		try {
			$dataCol = array (
					"kml_tema" => $permitekml,
					"kmz_tema" => $permitekmz,
					"ogc_tema" => $permiteogc,
					"download_tema" => $download
			);
			$resultado = i3GeoAdminUpdate ( $dbhw, "i3geoadmin_temas", $dataCol, "WHERE id_tema = $id_tema" );
			if ($resultado === false) {
				return false;
			}
		} catch ( PDOException $e ) {
			return false;
		}
	}
	try {
		$mapa->save ( $arq );
		include (dirname ( __FILE__ ) . "/../../../php/removeCabecalhoMapfile.php");
		removeCabecalhoMapfile ( $arq );
		return true;
	} catch (Exception $e) {
		return false;
	}
}
?>
