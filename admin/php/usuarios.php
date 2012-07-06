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
Voc&ecirc; deve ter recebido uma c�pia da Licen&ccedil;a P&uacute;blica Geral do
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
include_once(__DIR__."/login.php");
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
		$sql = "SELECT * from ".$esquemaadmin."i3geoadmin_usuarios WHERE id_usuario = ".$novo;
		retornaJSON(pegaDados($sql));
		exit;
	break;
	case "PEGAUSUARIOS":
		retornaJSON(pegaDados("SELECT id_usuario,ativo,data_cadastro,email,login,nome_usuario from ".$esquemaadmin."i3geoadmin_usuarios order by nome_usuario"));
		exit;
	break;
	case "PEGAPAPEISUSUARIO":
		$dados = pegaDados("SELECT P.id_papel, P.nome, P.descricao, UP.id_usuario FROM ".$esquemaadmin."i3geoadmin_usuarios AS U JOIN ".$esquemaadmin."i3geoadmin_papelusuario AS UP ON U.id_usuario = UP.id_usuario JOIN ".$esquemaadmin."i3geoadmin_papeis AS P ON UP.id_papel = P.id_papel WHERE U.id_usuario = $id_usuario");
		retornaJSON($dados);
		exit;
	break;
	case "PEGADADOSUSUARIO":
		retornaJSON(pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_usuarios WHERE id_usuario = $id_usuario"));
		exit;
	break;
	case "EXCLUIRUSUARIO":
		$tabela = "i3geoadmin_usuarios";
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
		$dados = pegaDados("SELECT P.id_papel, P.nome, P.descricao, UP.id_usuario FROM ".$esquemaadmin."i3geoadmin_usuarios AS U JOIN ".$esquemaadmin."i3geoadmin_papelusuario AS UP ON U.id_usuario = UP.id_usuario JOIN ".$esquemaadmin."i3geoadmin_papeis AS P ON UP.id_papel = P.id_papel WHERE U.id_usuario = $id_usuario");
		retornaJSON($dados);
		exit;
	break;
	case "EXCLUIRPAPELUSUARIO":
		retornaJSON(excluirPapelUsuario());
	break;
	case "LISTAPAPEIS":
		retornaJSON(pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_papeis order by nome"));
		exit;
	break;
}
cpjson($retorno);
function alterarUsuarios()
{
	global $id_usuario,$ativo,$data_cadastro,$email,$login,$nome_usuario,$senha;
	try
	{
		include(__DIR__."/conexao.php");
		if($convUTF){
			$nome_usuario = utf8_encode($nome_usuario);
		}
		if($id_usuario != ""){
			$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_usuarios SET senha='$senha',nome_usuario='$nome_usuario',login='$login',email='$email',ativo=$ativo,data_cadastro='$data_cadastro' WHERE id_usuario = $id_usuario");
			$retorna = $id_usuario;
		}
		else{
			$idtemp = (rand (9000,10000)) * -1;
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_usuarios (senha,ativo) VALUES ('$idtemp',0)");
			$id = $dbh->query("SELECT id_usuario FROM ".$esquemaadmin."i3geoadmin_usuarios WHERE senha = '$idtemp'");
			$id = $id->fetchAll();
			$id = $id[0]['id_usuario'];
			//$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_usuarios SET nome_usuario = '' WHERE id_usuario = $id AND nome_usuario = '$idtemp'");
			$retorna = $id;
		}
		$dbhw = null;
		$dbh = null;
		return $retorna;
	}
	catch (PDOException $e){
		return "Error!: " . $e->getMessage();
	}
}
function adicionaPapelUsuario(){
	global $id_usuario,$id_papel;
	try
	{
		include(__DIR__."/conexao.php");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_papelusuario (id_usuario,id_papel) VALUES ($id_usuario,$id_papel)");
		$dbhw = null;
		$dbh = null;
		return "ok";
	}
	catch (PDOException $e){
		return "Error!: " . $e->getMessage();
	}
}
function excluirUsuario()
{
	global $id_usuario;
	try
	{
		include(__DIR__."/conexao.php");
		//echo "DELETE from ".$esquemaadmin."i3geoadmin_usuarios WHERE id_usuario = $id_usuario";exit;
		$dbhw->query("DELETE FROM ".$esquemaadmin."i3geoadmin_usuarios WHERE id_usuario = $id_usuario ");
		$dbhw = null;
		$dbh = null;
		return "ok";
	}
	catch (PDOException $e)
	{
		return "Error!: " . $e->getMessage();
	}
}
function excluirPapelUsuario()
{
	global $id_usuario,$id_papel;
	try
	{
		include(__DIR__."/conexao.php");
		//echo "DELETE from ".$esquemaadmin."i3geoadmin_usuarios WHERE id_usuario = $id_usuario";exit;
		$dbhw->query("DELETE FROM ".$esquemaadmin."i3geoadmin_papelusuario WHERE id_usuario = $id_usuario AND id_papel = $id_papel ");
		$dbhw = null;
		$dbh = null;
		return "ok";
	}
	catch (PDOException $e)
	{
		return "Error!: " . $e->getMessage();
	}
}
?>