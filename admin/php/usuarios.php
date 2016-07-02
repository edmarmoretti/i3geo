<?php
/*
Title: usuarios.php

Controle das requisi&ccedil;&otilde;es em Ajax utilizadas para gerenciar usu&aacute;rio e controle de acesso

Recebe as requisi&ccedil;&otilde;es feitas em JavaScript (AJAX) e retorna o resultado para a interface.

O par&acirc;metro "funcao" define qual a opera&ccedil;&atilde;o que ser&aacute; executada. Esse par&acirc;metro &eacute; verificado em um bloco "switch ($funcao)".

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Edmar Moretti
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma copia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/classesphp/usuarios.php

Parametros:

funcao - op&ccedil;&atilde;o que ser&aacute; executada (veja abaixo a lista de Valores que esse par&acirc;metro pode assumir).

Retorno:

O resultado da opera&ccedil;&atilde;o ser&aacute; retornado em um objeto CPAINT.

A constru&ccedil;&atilde;o da string JSON &eacute; feita preferencialmente pelas fun&ccedil;&otilde;es nativas do PHP.
Para efeitos de compatibilidade, uma vez que at&eacute; a vers&atilde;o 4.2 a string JSON era construida pelo CPAINT,
o objeto CPAINT ainda &eacute; definido, por&eacute;m, a fun&ccedil;&atilde;o cpjson verifica se as fun&ccedil;&otilde;es nativas do PHPO (json)
est&atilde;o instaladas, se estiverem, utiliza-se a fun&ccedil;&atilde;o nativa, se n&atilde;o, utiliza-se o CPAINT para gerar o JSON.

Exemplo de chamada CPAINT (Ajax) do lado do cliente (javascript):

var p = "classesphp/mapa_controle.php?funcao=crialente&resolucao=1.5&g_sid="+g_sid

var cp = new cpaint()

cp.set_response_type("JSON")

cp.call(p,"lente",ajaxabrelente)

*/
error_reporting(0);
//
//pega as variaveis passadas com get ou post
//
include_once(dirname(__FILE__)."/login.php");
$funcoesEdicao = array(
		"ALTERARUSUARIOS",
		"EXCLUIRUSUARIO"
);
if(in_array(strtoupper($funcao),$funcoesEdicao)){
	if(verificaOperacaoSessao("admin/html/usuarios") == false){
		retornaJSON("Vc nao pode realizar essa operacao.");exit;
	}
}
switch (strtoupper($funcao))
{
	case "ALTERARUSUARIOS":
		$novo = alterarUsuarios();
		if($novo == false){
			retornaJSON(array());
			exit;
		}
		$sql = "SELECT id_usuario,ativo,data_cadastro,email,login,nome_usuario from ".$esquemaadmin."i3geousr_usuarios WHERE id_usuario = ".$novo;
		retornaJSON(pegaDados($sql));
		exit;
	break;
	case "PEGAUSUARIOS":
		retornaJSON(pegaDados("SELECT id_usuario,ativo,data_cadastro,email,login,nome_usuario from ".$esquemaadmin."i3geousr_usuarios order by nome_usuario"));
		exit;
	break;
	case "PEGAPAPEISUSUARIO":
		$dados = pegaDados("SELECT P.id_papel, P.nome, P.descricao, UP.id_usuario FROM ".$esquemaadmin."i3geousr_usuarios AS U JOIN ".$esquemaadmin."i3geousr_papelusuario AS UP ON U.id_usuario = UP.id_usuario JOIN ".$esquemaadmin."i3geousr_papeis AS P ON UP.id_papel = P.id_papel WHERE U.id_usuario = $id_usuario");
		retornaJSON($dados);
		exit;
	break;
	case "PEGADADOSUSUARIO":
		retornaJSON(pegaDados("SELECT * from ".$esquemaadmin."i3geousr_usuarios WHERE id_usuario = $id_usuario"));
		exit;
	break;
	case "EXCLUIRUSUARIO":
		$tabela = "i3geousr_usuarios";
		$id = $id_usuario;
		$f = verificaFilhos();
		if(!$f){
			excluirUsuario();
			retornaJSON("ok");
		}
		else
			retornaJSON("erro");
		exit;
	break;
	case "ADICIONAPAPELUSUARIO":
		adicionaPapelUsuario();
		$dados = pegaDados("SELECT P.id_papel, P.nome, P.descricao, UP.id_usuario FROM ".$esquemaadmin."i3geousr_usuarios AS U JOIN ".$esquemaadmin."i3geousr_papelusuario AS UP ON U.id_usuario = UP.id_usuario JOIN ".$esquemaadmin."i3geousr_papeis AS P ON UP.id_papel = P.id_papel WHERE U.id_usuario = $id_usuario");
		retornaJSON($dados);
		exit;
	break;
	case "EXCLUIRPAPELUSUARIO":
		retornaJSON(excluirPapelUsuario());
		exit;
	break;
	case "LISTAPAPEIS":
		retornaJSON(pegaDados("SELECT * from ".$esquemaadmin."i3geousr_papeis order by nome"));
		exit;
	break;
	case "ENVIARSENHAEMAIL":
		retornaJSON(enviarSenhaEmail());
		exit;
	break;
}
cpjson($retorno);
function enviarSenhaEmail(){
	global $id_usuario;
	include(dirname(__FILE__)."/conexao.php");
	$novaSenha = rand(9000,1000000);
	$dados = pegaDados("select * from ".$esquemaadmin."i3geousr_usuarios where id_usuario = $id_usuario and ativo = 1");
	if(count($dados) > 0){
		$senha = md5($novaSenha);
		$sql = "UPDATE ".$esquemaadmin."i3geousr_usuarios SET senha='$senha' WHERE id_usuario = $id_usuario";
		$dbhw->query($sql);
		i3GeoAdminInsertLog($dbhw,$sql);
		$to      = $dados[0]["email"];
		$subject = 'senha i3geo';
		$message = $novaSenha;
		mail($to, $subject, $message);
		return "Ok";
	}
	else{
		return "erro";
	}
}
function alterarUsuarios()
{
	global $id_usuario,$ativo,$data_cadastro,$email,$login,$nome_usuario,$senha;
	try
	{
		include(dirname(__FILE__)."/conexao.php");
		if($convUTF){
			$nome_usuario = utf8_encode($nome_usuario);
		}
		if($id_usuario != ""){
			//verifica uniciade de login
			$dados = pegaDados("select login from ".$esquemaadmin."i3geousr_usuarios where login = '$login'");
			if(count($dados) > 0){
				$retorna = false;
			}
			$dataCol = array(
				"nome_usuario" => $nome_usuario,
				"login" => $login,
				"email" => $email,
				"ativo" => $ativo,
				"data_cadastro" => $data_cadastro
			);
			//se a senha foi enviada, ela sera trocada
			if($senha != ""){
				$dataCol["senha"] = md5($senha);
			}
			i3GeoAdminUpdate($dbhw,"i3geousr_usuarios",$dataCol,"WHERE id_usuario = $id_usuario");
			$retorna = $id_usuario;
		}
		else{
			$dataCol = array(
				"nome_usuario" => '',
				"login" => '',
				"email" => '',
				"ativo" => 0,
				"data_cadastro" => '',
				"senha" => ''
			);
			$retorna = i3GeoAdminInsertUnico($dbhw,"i3geousr_usuarios",$dataCol,"nome_usuario","id_usuario");
		}
		$dbhw = null;
		$dbh = null;
		return $retorna;
	}
	catch (PDOException $e){
		return "Error!: ";
	}
}
function adicionaPapelUsuario(){
	global $id_usuario,$id_papel;
	try	{
		include(dirname(__FILE__)."/conexao.php");
		$dataCol = array(
			"id_usuario" => $id_usuario,
			"id_papel" => $id_papel
		);
		i3GeoAdminInsert($dbhw,"i3geousr_papelusuario",$dataCol);
		$dbhw = null;
		$dbh = null;
		return "ok";
	}
	catch (PDOException $e){
		return "Error!: ";
	}
}
function excluirUsuario(){
	global $id_usuario;
	try	{
		include(dirname(__FILE__)."/conexao.php");
		$sql = "DELETE FROM ".$esquemaadmin."i3geousr_usuarios WHERE id_usuario = $id_usuario ";
		$dbhw->query($sql);
		i3GeoAdminInsertLog($dbhw,$sql);
		$dbhw = null;
		$dbh = null;
		return "ok";
	}
	catch (PDOException $e)	{
		return "Error!: ";
	}
}
function excluirPapelUsuario(){
	global $id_usuario,$id_papel;
	try	{
		include(dirname(__FILE__)."/conexao.php");
		$sql = "DELETE FROM ".$esquemaadmin."i3geousr_papelusuario WHERE id_usuario = $id_usuario AND id_papel = $id_papel ";
		$dbhw->query($sql);
		i3GeoAdminInsertLog($dbhw,$sql);
		$dbhw = null;
		$dbh = null;
		return "ok";
	}
	catch (PDOException $e) {
		return "Error!: ";
	}
}
?>
