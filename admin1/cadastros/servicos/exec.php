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
	if (verificaOperacaoSessao ( "admin/html/webservices" ) === false) {
		header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
		exit ();
	}
}
include (dirname ( __FILE__ ) . "/../../../admin/php/conexao.php");
$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ADICIONAR" :
		$novo = adicionar( $autor_ws, $desc_ws, $link_ws, $nome_ws, $tipo_ws,$dbhw );
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		exit ();
		break;
	case "ALTERAR" :
		$novo = alterar ( $id_ws,$autor_ws, $desc_ws, $link_ws, $nome_ws, $tipo_ws,$dbhw );
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$dados = pegaDados ( "SELECT id_ws,autor_ws,desc_ws,link_ws,nome_ws,tipo_ws from ".$esquemaadmin."i3geoadmin_ws order by nome_ws", $dbh, false );
		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $dados );
		exit ();
		break;
	case "LISTA" :
		$ws = pegaDados ( "SELECT id_ws,autor_ws,desc_ws,link_ws,nome_ws,tipo_ws from ".$esquemaadmin."i3geoadmin_ws order by nome_ws", $dbh, false );
		if ($ws === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$dbhw = null;
		$dbh = null;
		retornaJSON ( $ws );
		break;
	case "EXCLUIR" :
		$retorna = excluir ( $id_ws, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $id_ws );
		exit ();
		break;
}
cpjson ( $retorno );

// $papeis deve ser um array
function adicionar($autor_ws,$desc_ws,$link_ws,$nome_ws,$tipo_ws,$dbhw) {
	global $esquemaadmin;
	try {
		$dataCol = array(
			"desc_ws" => '',
			"nome_ws" => '',
			"link_ws" => '',
			"autor_ws" => '',
			"tipo_ws" => '',
			"nacessos" => 0,
			"nacessosok" => 0
		);
		$id_ws = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_ws",$dataCol,"nome_ws","id_ws");
		$retorna = alterar ( $id_ws,$autor_ws,$desc_ws,$link_ws,$nome_ws,$tipo_ws,$dbhw );

		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterar($id_ws,$autor_ws,$desc_ws,$link_ws,$nome_ws,$tipo_ws,$dbhw) {
	global $esquemaadmin;
	if($convUTF){
		$nome_ws = utf8_encode($nome_ws);
		$desc_ws = utf8_encode($desc_ws);
		$autor_ws = utf8_encode($autor_ws);
	}
	$dataCol = array(
		"desc_ws" => $desc_ws,
		"nome_ws" => $nome_ws,
		"link_ws" => $link_ws,
		"autor_ws" => $autor_ws,
		"tipo_ws" => $tipo_ws
	);
	$resultado = i3GeoAdminUpdate ( $dbhw, "i3geoadmin_ws", $dataCol, "WHERE id_ws = $id_ws" );
	if ($resultado === false) {
		return false;
	}
	return $id_ws;
}
function excluir($id_ws, $dbhw) {
	global $esquemaadmin;
	$resultado = i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_ws", "id_ws", $id_ws, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
//usado em wmswfs.php
function adicionaAcesso($id_ws,$sucesso){
	global $esquemaadmin;
	try	{
		if($id_ws == ""){
			return;
		}
		include("conexao.php");
		$dados = pegaDados("select * from ".$esquemaadmin."i3geoadmin_ws WHERE id_ws = $id_ws");
		if(count($dados) == 0){
			return;
		};
		if($dados[0]["nacessos"] == ""){
			$dados[0]["nacessos"] = 0;
		}
		$acessos = $dados[0]["nacessos"] + 1;

		if($sucesso)
			$ok = $dados[0]["nacessosok"] + 1;
			else
				$ok = $dados[0]["nacessosok"];

				if($ok == ""){
					$ok = 0;
				}
				$dataCol = array(
						"nacessos" => $acessos,
						"nacessosok" => $ok
				);
				i3GeoAdminUpdate($dbhw,"i3geoadmin_ws",$dataCol,"WHERE id_ws = $id_ws");
				$dbhw = null;
				$dbh = null;
	}
	catch (PDOException $e){
		return "Error!: ";
	}
}
?>
