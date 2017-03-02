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

include_once (dirname ( __FILE__ ) . "/../../../admin/php/login.php");
if (verificaOperacaoSessao ( "admin/html/editormapfile" ) === false) {
	header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
	exit ();
}

include (dirname ( __FILE__ ) . "/../../../admin/php/conexao.php");
include ("funcoes.php");
$codigo = $_POST ["codigo"];
$codigo = str_replace ( " ", "", removeAcentos ( $codigo ) );
$codigo = str_replace ( ".", "", $codigo );
$codigo = strip_tags ( $codigo );
$codigo = htmlspecialchars ( $codigo, ENT_QUOTES );

$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ADICIONAR" :
		if(empty($_POST["titulolegenda"])){
			$_POST["titulolegenda"] = $_POST ["nome_tema"];
		}
		$novo = \admin\catalogo\mapfile\adicionar ( $locaplic, $_POST["titulolegenda"], $_POST ["link_tema"], $codigo, $_POST ["acessopublico"], $_POST ["metaestat"], $_POST ["nome_tema"], $_POST ["desc_tema"], $_POST ["en"], $_POST ["es"], true, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		} else {
			//e necessario retornar o codigo criado pois e usado na interface
			retornaJSON ( array (
					"codigo" => $codigo
			) );
		}
		break;
	case "ALTERAR" :
		if(empty($_POST["titulolegenda"])){
			$_POST["titulolegenda"] = $_POST ["nome_tema"];
		}
		//quando e feita a listagem unica, o mapfile ja foi registrado no banco se nao tinha sido antes
		$novo = \admin\catalogo\mapfile\alterar ( $locaplic, $_POST["id_tema"], $_POST["titulolegenda"], $_POST ["link_tema"], $codigo, $_POST ["acessopublico"], $_POST ["metaestat"], $_POST ["nome_tema"], $_POST ["desc_tema"], $_POST ["en"], $_POST ["es"], true, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		}
		break;
	case "EXCLUIR" :
		$retorna = \admin\catalogo\mapfile\excluir ( $codigo, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 400 $retorna" );
			exit ();
		}
		retornaJSON ( array (
				"codigo" => $codigo
		) );
		break;
	case "LISTA" :
		$retorna = \admin\catalogo\mapfile\listar ( $dbh, $_POST ["filtro"], $_POST ["palavra"], $_POST ["validar"] );
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $retorna );
		break;
	case "LISTAUNICO" :
		$retorna = \admin\catalogo\mapfile\listaUnico ( $dbh, $codigo );
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		} else {
			retornaJSON ( array("dados"=>$retorna) );
		}
		break;
	case "LIMPACACHE" :
		$retorna = \admin\catalogo\mapfile\limpaCache($locaplic, $codigo, $cachedir, $dir_tmp);
		retornaJSON ( "ok" );
		break;
	case "CLONARMAPFILE" :
		$novocodigo = $_POST ["novocodigo"];
		$novocodigo = str_replace ( " ", "", removeAcentos ( $novocodigo ) );
		$novocodigo = str_replace ( ".", "", $novocodigo );
		$novocodigo = strip_tags ( $novocodigo );
		$novocodigo = htmlspecialchars ( $novocodigo, ENT_QUOTES );
		$titulo = $_POST["titulo"];
		$retorna = \admin\catalogo\mapfile\clonarMapfile($codigo,$novocodigo,$titulo,$dbh,$dbhw);
		retornaJSON ( array (
				"codigo" => $novocodigo
		) );
		break;
	default:
		header ( "HTTP/1.1 500 erro funcao nao existe" );
		break;
}
?>