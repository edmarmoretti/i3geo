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
		"EXCLUIR"
);
if (in_array ( strtoupper ( $funcao ), $funcoesEdicao )) {
	if (verificaOperacaoSessao ( "admin/html/arvore" ) == false) {
		header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
		exit ();
	}
}
include (dirname ( __FILE__ ) . "/../../../admin/php/conexao.php");
if(!isset($idioma) || $idioma == ""){
	$idioma = "pt";
}

$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ADICIONAR" :
		$novo = adicionar( $publicado_menu, $perfil_menu, $aberto, $desc_menu, $nome_menu, $es, $en, $dbhw );
		if ($novo == false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		exit ();
		break;
	case "ALTERAR" :
		$novo = alterar ( $id_menu, $publicado_menu, $perfil_menu, $aberto, $desc_menu, $nome_menu, $es, $en, $dbhw );
		if ($novo == false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$dados = pegaDados ( "SELECT id_menu, publicado_menu, perfil_menu, aberto, desc_menu, nome_menu, es, en from ".$esquemaadmin."i3geoadmin_menus WHERE id_menu = $id_menu order by nome_menu", $dbh, false );
		if ($dados == false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$dbhw = null;
		$dbh = null;
		retornaJSON ( $dados );
		exit ();
		break;
	case "LISTA" :
		$dados = pegaDados ( "SELECT id_menu, publicado_menu, perfil_menu, aberto, desc_menu, nome_menu, es, en from ".$esquemaadmin."i3geoadmin_menus order by nome_menu", $dbh, false );
		if ($dados == false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$perfis = pegaDados ( "SELECT id_perfil, perfil from ".$esquemaadmin."i3geoadmin_perfis order by perfil", $dbh, false );
		$dbhw = null;
		$dbh = null;
		retornaJSON ( array("dados"=>$dados, "perfis"=>$perfis) );
		break;
	case "EXCLUIR" :
		$retorna = excluir ( $id_menu, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna == false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $id_menu );
		exit ();
		break;
}
cpjson ( $retorno );

// $papeis deve ser um array
function adicionar($publicado_menu, $perfil_menu, $aberto, $desc_menu, $nome_menu, $es, $en, $dbhw) {
	global $esquemaadmin;
	try {
		$dataCol = array(
			"en" => "",
			"es" => "",
			"it" => "",
			"publicado_menu" => "",
			"aberto" => "SIM",
			"nome_menu" => "",
			"desc_menu" => "",
			"perfil_menu" => ""
		);
		$id_menu = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_menus",$dataCol,"nome_menu","id_menu");
		$retorna = alterar ( $id_menu, $publicado_menu, $perfil_menu, $aberto, $desc_menu, $nome_menu, $es, $en,$dbhw );

		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterar($id_menu, $publicado_menu, $perfil_menu, $aberto, $desc_menu, $nome_menu, $es, $en,$dbhw) {
	global $esquemaadmin;
	if($convUTF){
		$nome_menu = utf8_encode($nome_menu);
		$desc_menu = utf8_encode($desc_menu);
		$en = utf8_encode($en);
		$es = utf8_encode($es);
		$perfil_menu = utf8_encode($perfil_menu);
	}
	$perfil_menu = str_replace(","," ",trim($perfil_menu));
	//verifica a consistencia da lista de perfis
	$perfis = pegaDados ( "SELECT perfil from ".$esquemaadmin."i3geoadmin_perfis order by perfil", $dbw, false );
	$p = array();
	foreach ($perfis as $perfil){
		$p[] = $perfil["perfil"];
	}
	$perfil_menu = implode(" ",array_intersect(explode(" ",$perfil_menu),$p));

	$dataCol = array(
		"en" => $en,
		"es" => $es,
		"it" => '',
		"publicado_menu" => $publicado_menu,
		"aberto" => $aberto,
		"nome_menu" => $nome_menu,
		"desc_menu" => $desc_menu,
		"perfil_menu" => $perfil_menu
	);
	$resultado = i3GeoAdminUpdate ( $dbhw, "i3geoadmin_menus", $dataCol, "WHERE id_menu = $id_menu" );
	if ($resultado == false) {
		return false;
	}
	return $id_menu;
}
function excluir($id_menu, $dbhw) {
	global $esquemaadmin;
	$resultado = i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_menus", "id_menu", $id_menu, $dbhw, false );
	if ($resultado == false) {
		return false;
	}
	return $resultado;
}
?>
