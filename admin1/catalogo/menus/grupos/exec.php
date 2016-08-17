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

include_once (dirname ( __FILE__ ) . "/../../../../admin/php/login.php");
$funcoesEdicao = array (
		"ADICIONAR",
		"ALTERAR",
		"EXCLUIR",
		"ORDENA"
);
if (in_array ( strtoupper ( $funcao ), $funcoesEdicao )) {
	if (verificaOperacaoSessao ( "admin/html/arvore" ) === false) {
		header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
		exit ();
	}
}
include (dirname ( __FILE__ ) . "/../../../../admin/php/conexao.php");

$id_menu = $_POST["id_menu"];
$id_n1 = $_POST["id_n1"];
$id_grupo = $_POST["id_grupo"];
testaSafeNumerico([$id_menu,$id_n1, $id_grupo]);

$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ORDENA" :
		$ordem = explode(" ",$_POST["ordem"]);
		//verifica se existe a mesma quantidade de registros no banco e na lista de ids
		$dados = pegaDados ( "SELECT ordem from ".$esquemaadmin."i3geoadmin_n1 WHERE id_menu = $id_menu", $dbh, false );
		if(count($dados) != count($ordem)){
			header ( "HTTP/1.1 500 erro numero de registros nao batem" );
			exit ();
		}
		//verifica se os ids existem no mesmo nivel
		$dados = pegaDados ( "SELECT ordem from ".$esquemaadmin."i3geoadmin_n1 WHERE id_menu = $id_menu AND id_n1 IN (" . implode(",",$ordem). ")", $dbh, false );
		if(count($dados) != count($ordem)){
			header ( "HTTP/1.1 500 erro ids nao batem" );
			exit ();
		}

		$retorna = i3GeoAdminOrdena($dbhw,$ordem,"i3geoadmin_n1","id_n1");
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
		$novo = adicionar( $id_grupo, $id_menu, $_POST["publicado"], $_POST["n1_perfil"], $_POST["ordem"], $dbhw );
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		exit ();
		break;
	case "ALTERAR" :
		$novo = alterar ( $id_n1, $id_grupo, $id_menu, $_POST["publicado"], $_POST["n1_perfil"], $_POST["ordem"], $dbhw );
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$dados = pegaDados ( "SELECT id_n1 from ".$esquemaadmin."i3geoadmin_n1 WHERE id_n1 = $id_n1", $dbh, false );

		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$dbhw = null;
		$dbh = null;
		retornaJSON ( $dados );
		exit ();
		break;
	case "LISTA" :
		$perfis = pegaDados ( "SELECT id_perfil, perfil from ".$esquemaadmin."i3geoadmin_perfis order by perfil", $dbh, false );
		$dbhw = null;
		$dbh = null;
		include($locaplic."/admin/php/classe_arvore.php");
		$arvore = new Arvore($locaplic);
		$grupos = $arvore->pegaGruposMenu($id_menu);
		$temas = $arvore->pegaTodosTemas(true);
		$tiposGrupos = $arvore->pegaListaDeTiposGrupos();
		unset($arvore);
		$grupos["perfis"] = $perfis;
		$grupos["temas"] = $temas;
		$grupos["tiposGrupos"] = $tiposGrupos;
		retornaJSON($grupos);
		break;
	case "EXCLUIR" :
		$r = pegaDados("SELECT id_n2 from ".$esquemaadmin."i3geoadmin_n2 where id_n1 ='$id_n1'");
		if(count($r) > 0){
			header ( "HTTP/1.1 500 erro ao excluir. Exclua os subgrupos primeiro" );
			exit ();
		}
		$r = pegaDados("SELECT id_raiz from ".$esquemaadmin."i3geoadmin_raiz where nivel='1' and id_nivel ='$id_n1'");
		if(count($r) > 0){
			header ( "HTTP/1.1 500 erro ao excluir. Exclua os temas na raiz do grupo primeiro" );
			exit ();
		}
		$retorna = excluir ( $id_n1, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $id_n1 );
		exit ();
		break;
}
cpjson ( $retorno );

function adicionar( $id_grupo, $id_menu, $publicado, $n1_perfil, $ordem, $dbhw) {
	global $esquemaadmin;
	try {
		$dataCol = array(
				"id_menu" => $id_menu,
				"publicado" => 'NAO',
				"ordem" => 0,
				"n1_perfil" => ''
		);
		$id_n1 = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_n1",$dataCol,"n1_perfil","id_n1");
		$retorna = alterar ( $id_n1, $id_grupo, $id_menu, $publicado, $n1_perfil, $ordem, $dbhw );
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterar($id_n1, $id_grupo, $id_menu, $publicado, $n1_perfil, $ordem, $dbhw) {
	global $esquemaadmin;
	$dataCol = array(
			"publicado" => $publicado,
			"id_grupo" => $id_grupo,
			"ordem" => $ordem,
			"n1_perfil" => $n1_perfil
	);
	$resultado = i3GeoAdminUpdate($dbhw,"i3geoadmin_n1",$dataCol,"WHERE id_n1 = $id_n1");
	if ($resultado === false) {
		return false;
	}
	return $id_n1;
}
function excluir($id_n1, $dbhw) {
	global $esquemaadmin;
	$resultado = i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_n1", "id_n1", $id_n1, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>
