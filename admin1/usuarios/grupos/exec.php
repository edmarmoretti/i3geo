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
	if (verificaOperacaoSessao ( "admin/html/usuarios" ) === false) {
		header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
		exit ();
	}
}
include (dirname ( __FILE__ ) . "/../../../admin/php/conexao.php");
$funcao = strtoupper ( $funcao );
// converte os parametros de definicao dos papeis em um array
if ($funcao == "ADICIONAR" || $funcao == "ALTERAR") {
	$usuarios = array ();
	foreach ( array_keys ( $_POST ) as $k ) {
		$teste = explode ( "-", $k );
		if ($teste[0] == "id_usuario") {
			$usuarios[] = $teste[1] * 1;
		}
	}
	array_unique ( $usuarios );
}
switch ($funcao) {
	case "ADICIONAR" :
		$novo = adicionar( $nome,$descricao, $usuarios, $dbhw );
		if ($novo != false) {
			$sql = "SELECT * from " . $esquemaadmin . "i3geousr_grupos WHERE id_grupo = " . $novo;
			$dados = pegaDados ( $sql, $dbh );
			if ($dados === false) {
				header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
				exit ();
			}
			retornaJSON ( $dados );
		} else {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		exit ();
		break;
	case "ALTERAR" :
		$novo = alterar ( $id_grupo, $nome, $descricao, $usuarios, $dbhw );
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$sql = "SELECT * from " . $esquemaadmin . "i3geousr_grupos WHERE id_grupo = " . $novo;
		$dados = pegaDados ( $sql, $dbh );
		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $dados );
		exit ();
		break;
	case "LISTA" :
		$grupos = pegaDados ( "SELECT id_grupo,nome,descricao from ".$esquemaadmin."i3geousr_grupos order by nome", $dbh, false );
		$usuarios = pegaDados ( "SELECT U.nome_usuario, U.id_usuario, U.login, UP.id_grupo FROM ".$esquemaadmin."i3geousr_usuarios AS U JOIN ".$esquemaadmin."i3geousr_grupousuario AS UP ON U.id_usuario = UP.id_usuario", dbh, false );
		if ($usuarios === false || $grupos === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$o = array ();
		foreach ( $grupos as $grupo ) {
			$p = array ();
			foreach ( $usuarios as $usuario ) {
				if ($usuario["id_grupo"] == $grupo["id_grupo"]) {
					$p[$usuario["id_usuario"]] = $usuario;
				}
			}
			$grupo["usuarios"] = $p;
			$o[] = $grupo;
		}
		$usuarios = pegaDados ( "SELECT id_usuario, login, nome_usuario from " . $esquemaadmin . "i3geousr_usuarios WHERE ativo = 1 order by login", $dbh );
		$dbhw = null;
		$dbh = null;
		if ($usuarios === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit();
		}
		retornaJSON ( array (
				"grupos" => $o,
				"usuarios" => $usuarios
		) );
		break;
	case "EXCLUIR" :
		$retorna = excluir ( $id_grupo, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $id_grupo );
		exit ();
		break;
}
cpjson ( $retorno );
// $usuarios deve ser um array
function adicionar($nome, $descricao, $usuarios, $dbhw) {
	global $esquemaadmin;
	try {
		$dataCol = array(
			"nome" => '',
			"descricao" => ''
		);
		$id_grupo = i3GeoAdminInsertUnico ( $dbhw, "i3geousr_grupos", $dataCol, "nome", "id_grupo" );
		$retorna = alterar ( $id_grupo, $nome, $descricao, $usuarios, $dbhw );
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterar($id_grupo, $nome, $descricao, $usuarios, $dbhw) {
	global $esquemaadmin;
	if ($convUTF) {
		$nome = utf8_encode ( $nome );
		$descricao = utf8_encode ( $descricao );
	}
	$dataCol = array (
			"nome" => $nome,
			"descricao" => $descricao
	);

	$resultado = i3GeoAdminUpdate ( $dbhw, "i3geousr_grupos", $dataCol, "WHERE id_grupo = $id_grupo" );
	if ($resultado === false) {
		return false;
	}
	// apaga todos os papeis
	$resultado = excluirUsuarios ( $id_grupo, $dbhw );
	if ($resultado === false) {
		return false;
	}
	if (! empty ( $usuarios )) {
		// atualiza papeis vinculados
		foreach ( $usuarios as $p ) {
			$resultado = adicionaUsuario ( $id_grupo, $p, $dbhw );
			if ($resultado === false) {
				return false;
			}
		}
	}
	return $id_grupo;
}
function adicionaUsuario($id_grupo, $id_usuario, $dbhw) {
	global $esquemaadmin;
	$dataCol = array (
			"id_usuario" => $id_usuario,
			"id_grupo" => $id_grupo
	);
	$resultado = i3GeoAdminInsert ( $dbhw, "i3geousr_grupousuario", $dataCol );
	return $resultado;
}
function excluir($id_grupo, $dbhw) {
	global $esquemaadmin;
	$resultado = i3GeoAdminExclui ( $esquemaadmin . "i3geousr_grupos", "id_grupo", $id_grupo, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	if ($resultado === true) {
		$resultado = excluirUsuarios ( $id_grupo, $dbhw );
	}
	return $resultado;
}
function excluirUsuarios($id_grupo, $dbhw) {
	global $esquemaadmin;
	$resultado = i3GeoAdminExclui ( $esquemaadmin . "i3geousr_grupousuario", "id_grupo", $id_grupo, $dbhw, false );
	return $resultado;
}
?>
