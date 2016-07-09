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
		"ADICIONARUSUARIO",
		"ALTERARUSUARIO",
		"ADICIONAPAPELUSUARIO",
		"EXCLUIRUSUARIO",
		"ENVIARSENHA"
);
if (in_array ( strtoupper ( $funcao ), $funcoesEdicao )) {
	if (verificaOperacaoSessao ( "admin/html/usuarios" ) == false) {
		header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
		exit ();
	}
}
include (dirname ( __FILE__ ) . "/../../../admin/php/conexao.php");
$funcao = strtoupper ( $funcao );
// converte os parametros de definicao dos papeis em um array
if ($funcao == "ADICIONARUSUARIO" || $funcao == "ALTERARUSUARIO") {
	$papeis = array ();
	foreach ( array_keys ( $_POST ) as $k ) {
		$teste = explode ( "-", $k );
		if ($teste[0] == "id_papel") {
			$papeis[] = $teste[1] * 1;
		}
	}
	array_unique ( $papeis );
}
switch ($funcao) {
	case "ADICIONARUSUARIO" :
		$novo = adicionarUsuario( $ativo, $data_cadastro, $email, $login, $nome_usuario, $senha, $papeis, $dbhw );
		if ($novo != false) {
			$sql = "SELECT * from " . $esquemaadmin . "i3geousr_usuarios WHERE id_usuario = " . $novo;
			$dados = pegaDados ( $sql, $dbh );
			if ($dados == false) {
				header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
				exit ();
			}
			if(strtolower($enviaSenha) == "on"){
				if($senha == "" || $email == ""){
					$dados = header ( "HTTP/1.1 500 para enviar a senha &eacute; necess&aacute;rio preencher o valor de senha e e-mail" );
				} else {
					$dados = enviarSenha( $senha, $email );
				}
			}
			retornaJSON ( $dados );
		} else {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		exit ();
		break;
	case "ALTERARUSUARIO" :
		$novo = alterarUsuario ( $id_usuario, $ativo, $data_cadastro, $email, $login, $nome_usuario, $senha, $papeis, $dbhw );
		if ($novo == false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$sql = "SELECT * from " . $esquemaadmin . "i3geousr_usuarios WHERE id_usuario = " . $novo;
		$dados = pegaDados ( $sql, $dbh );
		if ($dados == false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		if(strtolower($enviaSenha) == "on"){
			if($senha == "" || $email == ""){
				$dados = header ( "HTTP/1.1 500 para enviar a senha &eacute; necess&aacute;rio preencher o valor de senha e e-mail" );
			} else {
				$dados = enviarSenha( $senha, $email );
			}
		}
		retornaJSON ( $dados );
		exit ();
		break;
	case "PEGAUSUARIOSEPAPEIS" :
		$usuarios = pegaDados ( "SELECT id_usuario,ativo,data_cadastro,email,login,nome_usuario from " . $esquemaadmin . "i3geousr_usuarios order by nome_usuario", $dbh, false );
		$papeis = pegaDados ( "SELECT P.id_papel, P.nome, P.descricao, UP.id_usuario FROM " . $esquemaadmin . "i3geousr_usuarios AS U JOIN " . $esquemaadmin . "i3geousr_papelusuario AS UP ON U.id_usuario = UP.id_usuario JOIN " . $esquemaadmin . "i3geousr_papeis AS P ON UP.id_papel = P.id_papel ", dbh, false );
		if ($usuarios == false || $papeis == false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$o = array ();
		foreach ( $usuarios as $usuario ) {
			// pega os papeis registrados para cada operacao
			$p = array ();
			foreach ( $papeis as $papel ) {
				if ($papel["id_usuario"] == $usuario["id_usuario"]) {
					$p[$papel["id_papel"]] = $papel;
				}
			}
			$usuario["papeis"] = $p;
			$o[] = $usuario;
		}
		$papeis = pegaDados ( "SELECT * from " . $esquemaadmin . "i3geousr_papeis order by nome", $dbh );
		$dbhw = null;
		$dbh = null;
		if ($papeis == false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit();
		}
		retornaJSON ( array (
				"usuarios" => $o,
				"papeis" => $papeis
		) );
		break;
	case "EXCLUIRUSUARIO" :
		$retorna = excluirUsuario ( $id_usuario, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna == false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $id_usuario );
		exit ();
		break;
	case "ENVIARSENHA" :
		if($senha == "" || $email == ""){
			header ( "HTTP/1.1 500 erro ao enviar e-mail. Prrencha o valor de e-mail e senha" );
			exit ();
		}
		$retorna = enviarSenha ( $senha, $email );
		if ($retorna == false) {
			header ( "HTTP/1.1 500 erro ao enviar e-mail $email" );
			exit ();
		}
		retornaJSON ( true );
		exit ();
		break;
}
cpjson ( $retorno );

function enviarSenha( $senha, $email ){
	$to      = $email;
	$subject = 'senha i3geo criada em '. date('l jS \of F Y h:i:s A');
	$message = $senha;
	return mail($to, $subject, $message);
}
// $papeis deve ser um array
function adicionarUsuario($ativo, $data_cadastro, $email, $login, $nome_usuario, $senha, $papeis, $dbhw) {
	global $esquemaadmin;
	try {
		$dataCol = array(
			"nome_usuario" => '',
			"login" => '',
			"email" => '',
			"ativo" => 0,
			"data_cadastro" => '',
			"senha" => ''
		);
		$id_usuario = i3GeoAdminInsertUnico ( $dbhw, "i3geousr_usuarios", $dataCol, "nome_usuario", "id_usuario" );
		$data_cadastro = date('l jS \of F Y h:i:s A');
		$retorna = alterarUsuario ( $id_usuario, $ativo, $data_cadastro, $email, $login, $nome_usuario, $senha, $papeis, $dbhw );
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterarUsuario($id_usuario, $ativo, $data_cadastro, $email, $login, $nome_usuario, $senha, $papeis, $dbhw) {
	global $esquemaadmin;
	if ($convUTF) {
		$nome_usuario = utf8_encode ( $nome_usuario );
	}
	$dataCol = array (
			"nome_usuario" => $nome_usuario,
			"login" => $login,
			"email" => $email,
			"ativo" => $ativo
	);
	// se a senha foi enviada, ela sera trocada
	if ($senha != "") {
		$dataCol ["senha"] = md5 ( $senha );
	}
	$resultado = i3GeoAdminUpdate ( $dbhw, "i3geousr_usuarios", $dataCol, "WHERE id_usuario = $id_usuario" );
	if ($resultado == false) {
		return false;
	}
	// apaga todos os papeis
	$resultado = excluirPapeisUsuario ( $id_usuario, $dbhw );
	if ($resultado == false) {
		return false;
	}
	if (! empty ( $papeis )) {
		// atualiza papeis vinculados
		foreach ( $papeis as $p ) {
			$resultado = adicionaPapelUsuario ( $id_usuario, $p, $dbhw );
			if ($resultado == false) {
				return false;
			}
		}
	}
	return $id_usuario;
}
function adicionaPapelUsuario($id_usuario, $id_papel, $dbhw) {
	global $esquemaadmin;
	$dataCol = array (
			"id_usuario" => $id_usuario,
			"id_papel" => $id_papel
	);
	$resultado = i3GeoAdminInsert ( $dbhw, "i3geousr_papelusuario", $dataCol );
	return $resultado;
}
function excluirUsuario($id_usuario, $dbhw) {
	global $esquemaadmin;
	$resultado = exclui ( $esquemaadmin . "i3geousr_usuarios", "id_usuario", $id_usuario, $dbhw, false );
	if ($resultado == false) {
		return false;
	}
	if ($resultado == true) {
		$resultado = excluirPapeisUsuario ( $id_usuario, $dbhw );
	}
	return $resultado;
}
function excluirPapeisUsuario($id_usuario, $dbhw) {
	global $esquemaadmin;
	$resultado = exclui ( $esquemaadmin . "i3geousr_papelusuario", "id_usuario", $id_usuario, $dbhw, false );
	return $resultado;
}
?>
