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
$funcoesEdicao = array (
		"ADICIONAR",
		"ALTERAR",
		"EXCLUIR",
		"LISTA",
		"LISTAUNICO"
);
if (in_array ( strtoupper ( $funcao ), $funcoesEdicao )) {
	if (verificaOperacaoSessao ( "admin/html/operacoes" ) === false) {
		header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
		exit ();
	}
}
include (dirname ( __FILE__ ) . "/../../../admin/php/conexao.php");
include ("funcoes.php");
$id = $_POST ["id"];
$id_operacao = $_POST ["id_operacao"];
$id_papel = $_POST ["id_papel"];

testaSafeNumerico ( [
		$id,
		$id_operacao,
		$id_papel
] );

$funcao = strtoupper ( $funcao );
// converte os parametros de definicao dos papeis em um array
if ($funcao == "ADICIONAR" || $funcao == "ALTERAR") {
	$papeis = array ();
	$papeis [] = 1; // admin
	foreach ( array_keys ( $_POST ) as $k ) {
		$teste = explode ( "-", $k );
		if ($teste [0] == "id_papel") {
			$papeis [] = $teste [1] * 1;
		}
	}
	array_unique ( $papeis );
}
switch ($funcao) {
	case "ADICIONAR" :
		$novo = \admin\usuarios\operacoes\adicionar ( $_POST ["codigo"], $_POST ["descricao"], $papeis, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		}
		break;
	case "ALTERAR" :
		$novo = \admin\usuarios\operacoes\alterar ( $id_operacao, $_POST ["codigo"], $_POST ["descricao"], $papeis, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		}
		break;
	case "LISTAUNICO" :
		$operacao = \admin\usuarios\operacoes\listar($dbh,$id_operacao);
		if ($operacao === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		} else {
			$papeisoperacao = \admin\usuarios\operacoes\listaPapeisOperacao($dbh,$id_operacao);
			// cria o indice do array conforme o id da operacao
			$o = array ();
			foreach ( $papeisoperacao as $op ) {
				$o [$op ["id_papel"]] = $op;
			}
			$operacao ["papeis"] = $o;
			// todos os papeis
			$papeis = \admin\usuarios\operacoes\listaPapeis($dbh);
			$dbhw = null;
			$dbh = null;
			retornaJSON ( array (
					"operacao" => $operacao,
					"papeis" => $papeis
			) );
		}
		break;
	case "LISTA" :
		$operacoes = \admin\usuarios\operacoes\listar($dbh);
		if ($operacoes === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		} else {
			$papeis = \admin\usuarios\operacoes\listaPapeis($dbh);
			$dbhw = null;
			$dbh = null;
			retornaJSON ( array (
					"operacoes" => $operacoes,
					"papeis" => $papeis
			) );
		}
		break;
	case "EXCLUIR" :
		$retorna = \admin\usuarios\operacoes\excluir ( $id_operacao, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		}
		break;
	default :
		header ( "HTTP/1.1 500 erro funcao nao existe" );
		break;
}
?>