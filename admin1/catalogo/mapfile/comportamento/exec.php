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
