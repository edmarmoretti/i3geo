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

include_once (dirname ( __FILE__ ) . "/../../../../../admin/php/login.php");
$funcoesEdicao = array (
		"ADICIONAR",
		"ALTERAR",
		"EXCLUIR"
);
if (in_array ( strtoupper ( $funcao ), $funcoesEdicao )) {
	if (verificaOperacaoSessao ( "admin/html/arvore" ) === false) {
		header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
		exit ();
	}
}
include (dirname ( __FILE__ ) . "/../../../../../admin/php/conexao.php");

$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ADICIONAR" :
		$novo = adicionar( $id_subgrupo, $id_n1, $publicado, $n2_perfil, $ordem, $dbhw );
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		exit ();
		break;
	case "ALTERAR" :
		$novo = alterar ( $id_n2, $id_subgrupo, $id_menu, $publicado, $n2_perfil, $ordem, $dbhw );
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$dados = pegaDados ( "SELECT id_n2 from ".$esquemaadmin."i3geoadmin_n2 WHERE id_n2 = $id_n2", $dbh, false );

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
		$subgrupos = $arvore->pegaSubgruposGrupo($id_menu,$id_n1);
		$temas = $arvore->pegaTodosTemas(true);
		$tiposSubGrupos = $arvore->pegaListaDeTiposSubGrupos();
		unset($arvore);
		$subgrupos["perfis"] = $perfis;
		$subgrupos["temas"] = $temas;
		$subgrupos["tiposSubGrupos"] = $tiposSubGrupos;
		retornaJSON($subgrupos);
		break;
	case "EXCLUIR" :
		$r = pegaDados("SELECT id_n3 from ".$esquemaadmin."i3geoadmin_n3 where id_n2 ='$id'");
		if(count($r) > 0){
			header ( "HTTP/1.1 500 erro ao excluir. Exclua os subgrupos primeiro" );
			exit ();
		}
		$retorna = excluir ( $id_n2, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $id_n2 );
		exit ();
		break;
}
cpjson ( $retorno );

function adicionar( $id_subgrupo, $id_n1, $publicado, $n2_perfil, $ordem, $dbhw) {
	global $esquemaadmin;
	try {
		$dataCol = array(
				"id_n1" => $id_n1,
				"publicado" => 'NAO',
				"ordem" => 0,
				"n2_perfil" => ''
		);
		$id_n2 = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_n2",$dataCol,"n2_perfil","id_n2");
		$retorna = alterar ( $id_n2, $id_subgrupo, $id_n1, $publicado, $n2_perfil, $ordem, $dbhw );
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterar($id_n2, $id_subgrupo, $id_n1, $publicado, $n2_perfil, $ordem, $dbhw) {
	global $esquemaadmin;
	$dataCol = array(
			"publicado" => $publicado,
			"id_subgrupo" => $id_subgrupo,
			"ordem" => $ordem,
			"n2_perfil" => $n2_perfil
	);
	$resultado = i3GeoAdminUpdate($dbhw,"i3geoadmin_n2",$dataCol,"WHERE id_n2 = $id_n2");
	if ($resultado === false) {
		return false;
	}
	return $id_n2;
}
function excluir($id_n1, $dbhw) {
	global $esquemaadmin;
	$resultado = i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_n2", "id_n2", $id_n2, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>
