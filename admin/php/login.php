<?php
/*
Title: funcoes_login.php

Controle das requisi&ccedil;&otilde;es em Ajax utilizadas para gerenciar login de usu&aacute;rio e controle de acesso

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

i3geo/classesphp/funcoes_login.php

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
error_reporting(E_ALL);
//
//pega as variaveis passadas com get ou post
//
/**
 * TODO documentar o sistema de login
 */
include_once(__DIR__."/../../classesphp/pega_variaveis.php");
session_write_close();
session_name("i3GeoLogin");
//se o usuario estiver tentando fazer login
if(!empty($usuario) && !empty($senha)){
	logoutUsuario();
	session_regenerate_id();
	$_SESSION = array();
	session_start();
}
else{//se nao, verifica se o login ja existe realmente
	if(!empty($_COOKIE["i3geocodigologin"])){
		session_id($_COOKIE["i3geocodigologin"]);
		session_start();
		if($_SESSION["usuario"] != $_COOKIE["i3geousuariologin"]){
			logoutUsuario();
		}
	}
	else{//caso nao exista, retorna um erro
		$retorno = "erro";
	}
}
$retorno = "logout"; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
	/*
	Valor: LOGIN

	Verifica usu&aacute;rio e senha e registra id da sessao que guarda o resultado.

	*/
	case "LOGIN":
		include_once(__DIR__."/admin.php");
		$teste = autenticaUsuario($usuario,$senha);
		if($teste != false){
			$_SESSION["usuario"] = $usuario;
			$_SESSION["id_usuario"] = $teste["usuario"]["id_usuario"];
			$_SESSION["senha"] = $senha;
			$_SESSION["papeis"] = $teste["papeis"];
			$_SESSION["operacoes"] = $teste["operacoes"];
			$fingerprint = 'I3GEOLOGIN' . $_SERVER['HTTP_USER_AGENT'];
			//var_dump($_SESSION["operacoes"]);exit;
			$_SESSION['fingerprint'] = md5($fingerprint . session_id());
			$retorno = array("id"=>session_id(),"nome"=>$teste["usuario"]["nome_usuario"]);
			cpjson($retorno);
		}
		else{
			logoutUsuario();
			cpjson("logout");
		}
	break;
	/*
	 Valor: VALIDAOPERACAOUSUARIO

	Verifica se um usuario pode executar uma operacao

	Para que o usuario possa executar a operacao, o papel ao qual ele pertence deve estar registrado em operacoespaeis no banco de administracao

	Se $operacao for vazio, e retornado "sim", o que permite que a verificacao apenas confirme que o login esta correto na sessao

	Paremeter:

	$operacao - operacao que sera verificada
	*/
	case "VALIDAOPERACAOSESSAO":
		$retorno = "nao";
		if($operacao == ""){
			$retorno = "sim";
		}
		else{
			if(verificaOperacaoSessao($operacao) == true){
				$retorno = "sim";
			}
			else{
				logoutUsuario();
			}
		}
		cpjson($retorno);
	break;
}
function verificaPapelSessao($id_papel){
	$resultado = false;
	//verifica se e administrador
	if(validaSessao()){
		foreach($_SESSION["papeis"] as $p){
			if($p["id_papel"] == 1 || $p["id_papel"] == $id_papel){
				return true;
			}
		}
	}
	return $resultado;
}
function verificaOperacaoSessao($operacao){
	$resultado = false;
	//verifica se e administrador
	if(validaSessao()){
		foreach($_SESSION["papeis"] as $p){
			if($p["id_papel"] == 1){
				return true;
			}
		}
		if(!empty($_SESSION["operacoes"][$operacao])){
			$resultado = true;
		}
	}
	return $resultado;
}
function validaSessao(){
	$fingerprint = 'I3GEOLOGIN' . $_SERVER['HTTP_USER_AGENT'];
	if($_SESSION['fingerprint'] != md5($fingerprint . session_id())){
		return false;
	}
	if($_SESSION["usuario"] != $_COOKIE["usuario"]){
		return false;
	}
	return true;
}
function autenticaUsuario($usuario,$senha){
	include(__DIR__."/conexao.php");
	/**
	 * TODO aplicar md5 na senha
	 */
	$dados = pegaDados("select * from ".$esquemaadmin."i3GEOadmin_usuarios where login = '$usuario' and senha = '$senha' and ativo = 1",$locaplic);
	if(count($dados) > 0){
		$papeis = pegaDados("select * from ".$esquemaadmin."i3geoadmin_papelusuario where id_usuario = ".$dados[0]["id_usuario"],$locaplic);
		$op = pegadados("SELECT O.codigo, PU.id_usuario FROM ".$esquemaadmin."i3geoadmin_operacoes AS O JOIN ".$esquemaadmin."i3geoadmin_operacoespapeis AS OP ON O.id_operacao = OP.id_operacao JOIN ".$esquemaadmin."i3geoadmin_papelusuario AS PU ON OP.id_papel = PU.id_papel	WHERE id_usuario = ".$dados[0]["id_usuario"],$locaplic);
		$operacoes = array();
		foreach($op as $o){
			$operacoes[$o["codigo"]] = true;
		}
		$r = array("usuario"=>$dados[0],"papeis"=>$papeis,"operacoes"=>$operacoes);
		return $r;
	}
	else{
		return false;
	}
}
function logoutUsuario(){
	$_COOKIE = array();
	$_SESSION = array();
	session_destroy();
}
?>