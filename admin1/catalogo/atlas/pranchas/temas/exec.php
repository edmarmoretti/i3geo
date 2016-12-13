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

include_once (dirname ( __FILE__ ) . "/../../../../../admin/php/login.php");
if (verificaOperacaoSessao ( "admin/html/atlas" ) === false) {
	header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
	exit ();
}
include (dirname ( __FILE__ ) . "/../../../../../admin/php/conexao.php");

$id_atlas = $_POST["id_atlas"];
$id_prancha = $_POST["id_prancha"];
$id_tema = $_POST["id_tema"];

testaSafeNumerico([$id,$id_atlas,$id_prancha]);

$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ADICIONAR" :
		$novo = adicionar( $id_prancha, $_POST["ordem_tema"], $_POST["ligado_tema"], $_POST["codigo_tema"], $dbhw );
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		exit ();
		break;
	case "ALTERAR" :
		$novo = alterar ( $id_tema, $_POST["ordem_tema"], $_POST["ligado_tema"], $_POST["codigo_tema"], $dbhw );
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$dados = pegaDados ( "SELECT id_tema from ".$esquemaadmin."i3geoadmin_atlast WHERE id_tema = $id_tema", $dbh, false );

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
		$dados = pegaDados("SELECT id_tema, ordem_tema, codigo_tema, ligado_tema from ".$esquemaadmin."i3geoadmin_atlast WHERE id_tema = '$id_tema'", $dbh, false);
		if ($dados === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados tabela de temas de uma prancha" );
			exit ();
		}
		$dbhw = null;
		$dbh = null;
		//pega a lista de temas
		include("../../../../../admin/php/classe_arvore.php");
		$arvore = new Arvore($locaplic);
		$temas = $arvore->pegaTodosTemas(true);
		retornaJSON ( array("dados"=>$dados[0], "temas"=>$temas) );
		break;
	case "LISTA" :
		$dados = pegaDados("SELECT id_tema, codigo_tema from ".$esquemaadmin."i3geoadmin_atlast WHERE id_prancha = '$id_prancha' ORDER BY ordem_tema", $dbh, false);
		if ($dados === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados tabela de temas de uma prancha" );
			exit ();
		}
		$dbhw = null;
		$dbh = null;
		//pega a lista de temas
		include("../../../../../admin/php/classe_arvore.php");
		$arvore = new Arvore($locaplic);
		$temas = $arvore->pegaTodosTemas(true);
		retornaJSON ( array("dados"=>$dados, "temas"=>$temas) );
		break;
	case "EXCLUIR" :
		$retorna = excluir ( $id_tema, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $id_tema );
		exit ();
		break;
}
cpjson ( $retorno );

function adicionar( $id_prancha, $ordem_tema, $ligado_tema, $codigo_tema, $dbhw ) {
	global $esquemaadmin;
	try {
		$dataCol = array(
			"ordem_tema"=>0,
			"codigo_tema"=>"",
			"ligado_tema"=>"",
			"id_prancha"=>$id_prancha
		);
		$id_tema = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_atlast",$dataCol,"codigo_tema","id_tema");
		$retorna = alterar ( $id_tema, $ordem_tema, $ligado_tema, $codigo_tema, $dbhw );

		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterar($id_tema, $ordem_tema, $ligado_tema, $codigo_tema, $dbhw) {
	global $esquemaadmin;
	//caso a atualizacao ocorra apos insert
	$dataCol = array(
			"ordem_tema"=>$ordem_tema,
			"codigo_tema"=>$codigo_tema,
			"ligado_tema"=>$ligado_tema
	);
	//caso registro ja exista
	if($codigo_tema == ""){
		$dataCol = array(
				"ordem_tema"=>$ordem_tema,
				"ligado_tema"=>$ligado_tema
		);
	}

	$resultado = i3GeoAdminUpdate ( $dbhw, "i3geoadmin_atlast", $dataCol, "WHERE id_tema = $id_tema" );
	if ($resultado === false) {
		return false;
	}
	return $id_tema;
}
function excluir($id_tema, $dbhw) {
	global $esquemaadmin;
	$resultado = i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_atlast", "id_tema", $id_tema, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>
