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
		$novo = alterar ( $locaplic, $id_tema, $codigo, $_POST["aplicaextensao"],$_POST["permitecomentario"],$_POST["temporizador"],$_POST["escondido"],$_POST["transitioneffect"],$_POST["status"],$_POST["iconetema"], $_POST["mensagem"]);
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
		/*


	$layer->setmetadata("escala",$_GET["escala"]);
	$layer->setmetadata("extensao",$_GET["extensao"]);

	$dados["cache"] = $layer->getmetadata("cache");
	$dados["tiles"] = $layer->getmetadata("tiles");
	$dados["cortepixels"] = $layer->getmetadata("cortepixels");

definicao de editavel ou nao

	$dados["editavel"] = $layer->getmetadata("EDITAVEL"); //SIM ou NAO
	$dados["colunaidunico"] = $layer->getmetadata("COLUNAIDUNICO");
	$dados["tabelaeditavel"] = $layer->getmetadata("TABELAEDITAVEL");
	$dados["esquematabelaeditavel"] = $layer->getmetadata("ESQUEMATABELAEDITAVEL");
	$dados["colunageometria"] = $layer->getmetadata("COLUNAGEOMETRIA");

linha do tempo

	$dados["ltempoformatodata"] = $layer->getmetadata("ltempoformatodata");
	$dados["ltempoiteminicio"] = $layer->getmetadata("ltempoiteminicio");
	$dados["ltempoitemfim"] = $layer->getmetadata("ltempoitemfim");
	$dados["ltempoitemtitulo"] = $layer->getmetadata("ltempoitemtitulo");
	$dados["ltempoitemdescricao"] = $layer->getmetadata("ltempoitemdescricao");
	$dados["ltempoconvencode"] = $layer->getmetadata("ltempoconvencode");
	$dados["ltempoitemtip"] = $layer->getmetadata("ltempoitemtip");
	$dados["ltempoitemimagem"] = $layer->getmetadata("ltempoitemimagem");
	$dados["ltempoitemicone"] = $layer->getmetadata("ltempoitemicone");
	$dados["ltempoitemlink"] = $layer->getmetadata("ltempoitemlink");

conexao com wms

		$dados["wms_srs"] = $layer->getmetadata("wms_srs");
		$dados["wms_name"] = $layer->getmetadata("wms_name");
		$dados["wms_server_version"] = $layer->getmetadata("wms_server_version");
		$dados["wms_format"] = $layer->getmetadata("wms_format");
		$dados["wms_auth_username"] = $layer->getmetadata("wms_auth_username");
		$dados["wms_auth_password"] = $layer->getmetadata("wms_auth_password");
		$dados["wms_auth_type"] = $layer->getmetadata("wms_auth_type");
		$dados["wms_connectiontimeout"] = $layer->getmetadata("wms_connectiontimeout");
		$dados["wms_latlonboundingbox"] = $layer->getmetadata("wms_latlonboundingbox");
		$dados["wms_proxy_auth_type"] = $layer->getmetadata("wms_proxy_auth_type");

		$dados["wms_proxy_host"] = $layer->getmetadata("wms_proxy_host");
		$dados["wms_proxy_port"] = $layer->getmetadata("wms_proxy_port");
		$dados["wms_proxy_type"] = $layer->getmetadata("wms_proxy_type");
		$dados["wms_proxy_username"] = $layer->getmetadata("wms_proxy_username");
		$dados["wms_proxy_password"] = $layer->getmetadata("wms_proxy_password");
		$dados["wms_sld_body"] = $layer->getmetadata("wms_sld_body");
		$dados["wms_sld_url"] = $layer->getmetadata("wms_sld_url");
		$dados["wms_style"] = $layer->getmetadata("wms_style");
		$dados["wms_bgcolor"] = $layer->getmetadata("wms_bgcolor");
		$dados["wms_transparent"] = $layer->getmetadata("wms_transparent");
		$dados["wms_time"] = $layer->getmetadata("wms_time");
		$dados["wms_tile"] = $layer->getmetadata("wms_tile");

outros

	$dados["classesitem"] = $layer->getmetadata("classesitem");
	$dados["classesnome"] = $layer->getmetadata("classesnome");
	$dados["classescor"] = $layer->getmetadata("classescor");
	$dados["classessimbolo"] = $layer->getmetadata("classessimbolo");
	$dados["classestamanho"] = $layer->getmetadata("classestamanho");
	$dados["palletefile"] = $layer->getmetadata("palletefile");
	$dados["palletestep"] = $layer->getmetadata("palletestep");
	$dados["description_template"] = $layer->getmetadata("description_template");
	$dados["editorsql"] = $layer->getmetadata("editorsql");






		 ENCODING [string]

		 The encoding used for text in the layer data source. The value must be supported by ICONV (for example LATIN1).
		 When ENCODING is set (and not equal to UTF-8), the data source text attributes will be converted to UTF-8.

		 New in version 7.0.


		 MAXFEATURES [integer]
		 Specifies the number of features that should be drawn for this layer in the CURRENT
		 window. Has some interesting uses with annotation and with sorted data (i.e. lakes by area).

		 */

		$dados["status"] = $layer->status;
		retornaJSON ( array (
				"dados" => $dados
		) );
		break;
}
cpjson ( $retorno );
function alterar($locaplic, $id_tema, $codigo, $aplicaextensao, $permitecomentario, $temporizador, $escondido, $transitioneffect, $status, $iconetema, $mensagem) {
	global $convUTF, $esquemaadmin;
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
	$layer->set("status",$status);
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
