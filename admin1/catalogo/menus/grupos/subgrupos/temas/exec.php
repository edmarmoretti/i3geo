<?php
//
//Executa as operacoes para um grupo de um menu
//
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

include_once (dirname ( __FILE__ ) . "/../../../../../../admin/php/login.php");
$funcoesEdicao = array (
		"ADICIONAR",
		"ALTERAR",
		"EXCLUIR",
		"ORDENA",
		"LISTA",
		"LISTAUNICO"
);
if (in_array ( strtoupper ( $funcao ), $funcoesEdicao )) {
	if (verificaOperacaoSessao ( "admin/html/arvore" ) === false) {
		header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
		exit ();
	}
}
include (dirname ( __FILE__ ) . "/../../../../../../admin/php/conexao.php");

$id_n2 = $_POST["id_n2"];
$id_n3 = $_POST["id_n3"];
$id_tema = $_POST["id_tema"];
testaSafeNumerico([$id_tema,$id_n2,$id_n3]);

$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ORDENA" :
		$ordem = explode(" ",$_POST["novaordem"]);
		//verifica se existe a mesma quantidade de registros no banco e na lista de ids
		$dados = pegaDados ( "SELECT ordem from ".$esquemaadmin."i3geoadmin_n3 WHERE id_n2 = $id_n2", $dbh, false );
		if(count($dados) != count($ordem)){
			header ( "HTTP/1.1 500 erro numero de registros nao batem" );
			exit ();
		}
		//verifica se os ids existem no mesmo nivel
		$dados = pegaDados ( "SELECT ordem from ".$esquemaadmin."i3geoadmin_n3 WHERE id_n2 = $id_n2 AND id_n3 IN (" . implode(",",$ordem). ")", $dbh, false );
		if(count($dados) != count($ordem)){
			header ( "HTTP/1.1 500 erro ids nao batem" );
			exit ();
		}

		$retorna = i3GeoAdminOrdena($dbhw,$ordem,"i3geoadmin_n3","id_n3");
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 500 erro ao ordenar" );
			exit ();
		}
		retornaJSON ( $retorna );
		exit();
		break;
	case "ADICIONAR" :
		$novo = adicionar( $id_tema, $id_n2, $_POST["publicado"], $_POST["n3_perfil"], $_POST["ordem"], $dbhw );
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		exit ();
		break;
	case "ALTERAR" :
		$novo = alterar ( $id_n3, $id_tema, $id_n2, $_POST["publicado"], $_POST["n3_perfil"], $_POST["ordem"], $dbhw );
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$dados = pegaDados ( "SELECT id_n3 from ".$esquemaadmin."i3geoadmin_n3 WHERE id_n3 = $id_n3", $dbh, false );

		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$dbhw = null;
		$dbh = null;
		retornaJSON ( $dados );
		exit ();
		break;
	case "LISTAUNICO" :
		$dados = pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_n3 LEFT JOIN ".$esquemaadmin."i3geoadmin_temas ON i3geoadmin_n3.id_tema = i3geoadmin_temas.id_tema where id_n3 = $id_n3");
		if ($dados === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$dbhw = null;
		$dbh = null;
		retornaJSON($dados[0]);
		break;
	case "LISTA" :
		$perfis = pegaDados ( "SELECT id_perfil, perfil from ".$esquemaadmin."i3geoadmin_perfis order by lower(perfil)", $dbh, false );
		$dbhw = null;
		$dbh = null;
		include($locaplic."/admin/php/classe_arvore.php");
		$arvore = new Arvore($locaplic);
		$temassubgrupo = array("dados" => $arvore->pegaTemasSubGrupo($id_n2));
		$temas = $arvore->pegaTodosTemas(true);
		unset($arvore);
		$temassubgrupo["perfis"] = $perfis;
		$temassubgrupo["temas"] = $temas;
		retornaJSON($temassubgrupo);
		break;
	case "EXCLUIR" :
		$retorna = excluir ( $id_n3, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $id_n3 );
		exit ();
		break;
}
cpjson ( $retorno );

function adicionar( $id_tema, $id_n2, $publicado, $n3_perfil, $ordem, $dbhw) {
	global $esquemaadmin;
	try {
		$dataCol = array(
				"id_n2" => $id_n2,
				"publicado" => 'NAO',
				"ordem" => 0,
				"n3_perfil" => ''
		);
		$id_n3 = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_n3",$dataCol,"n3_perfil","id_n3");
		$retorna = alterar ( $id_n3, $id_tema, $id_n2, $publicado, $n3_perfil, $ordem, $dbhw );
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterar($id_n3, $id_tema, $id_n2, $publicado, $n3_perfil, $ordem, $dbhw) {
	global $esquemaadmin;
	$dataCol = array(
			"publicado" => $publicado,
			"id_tema" => $id_tema,
			"ordem" => $ordem,
			"n3_perfil" => $n3_perfil
	);
	$resultado = i3GeoAdminUpdate($dbhw,"i3geoadmin_n3",$dataCol,"WHERE id_n3 = $id_n3");
	if ($resultado === false) {
		return false;
	}
	return $id_n3;
}
function excluir($id_n3, $dbhw) {
	global $esquemaadmin;
	$resultado = i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_n3", "id_n3", $id_n3, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>
