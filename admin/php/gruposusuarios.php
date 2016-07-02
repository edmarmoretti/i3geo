<?php
/*
Title: gruposusuarios.php

Controle das requisi&ccedil;&otilde;es em Ajax utilizadas para gerenciar grupos de usu&aacute;rio e controle de acesso

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

i3geo/classesphp/gruposusuarios.php

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
		"ALTERARGRUPOS",
		"EXCLUIRGRUPO"
);
if(in_array(strtoupper($funcao),$funcoesEdicao)){
	if(verificaOperacaoSessao("admin/html/usuarios") == false){
		retornaJSON("Vc nao pode realizar essa operacao.");exit;
	}
}
switch (strtoupper($funcao))
{
	case "ALTERARGRUPOS":
		$novo = alterarGrupos();
		if($novo == false){
			retornaJSON(array());
			exit;
		}
		$sql = "SELECT id_grupo,nome,descricao from ".$esquemaadmin."i3geousr_grupos WHERE id_grupo = ".$novo;
		retornaJSON(pegaDados($sql));
		exit;
	break;
	case "PEGAGRUPOS":
		retornaJSON(pegaDados("SELECT id_grupo,nome,descricao from ".$esquemaadmin."i3geousr_grupos order by nome"));
		exit;
	break;
	case "PEGAUSUARIOSGRUPO":
		$dados = pegaDados("SELECT U.id_usuario, U.login, UP.id_grupo FROM ".$esquemaadmin."i3geousr_usuarios AS U JOIN ".$esquemaadmin."i3geousr_grupousuario AS UP ON U.id_usuario = UP.id_usuario WHERE UP.id_grupo = $id_grupo");
		retornaJSON($dados);
		exit;
	break;
	case "PEGADADOSGRUPO":
		retornaJSON(pegaDados("SELECT * from ".$esquemaadmin."i3geousr_grupos WHERE id_grupo = $id_grupo"));
		exit;
	break;
	case "EXCLUIRGRUPO":
		$tabela = "i3geousr_grupous";
		$id = $id_grupo;
		$f = verificaFilhos();
		if(!$f){
			excluirGrupo();
			retornaJSON("ok");
		}
		else
			retornaJSON("erro");
		exit;
	break;
	case "ADICIONAUSUARIOGRUPO":
		adicionaUsuarioGrupo();
		$dados = pegaDados("SELECT U.id_usuario, U.login, UP.id_grupo FROM ".$esquemaadmin."i3geousr_usuarios AS U JOIN ".$esquemaadmin."i3geousr_grupousuario AS UP ON U.id_usuario = UP.id_usuario WHERE UP.id_grupo = $id_grupo AND UP.id_usuario = $id_usuario");
		retornaJSON($dados);
		exit;
	break;
	case "EXCLUIRUSUARIOGRUPO":
		retornaJSON(excluirUsuarioGrupo());
		exit;
	break;
	case "LISTAUSUARIOS":
		retornaJSON(pegaDados("Select id_usuario,login,ativo from ".$esquemaadmin."i3geousr_usuarios order by login"));
		exit;
	break;
}
cpjson($retorno);
function alterarGrupos()
{
	global $id_grupo,$nome,$descricao;
	try
	{
		include(dirname(__FILE__)."/conexao.php");
		if($convUTF){
			$nome = utf8_encode($nome);
			$descricao = utf8_encode($descricao);
		}
		if($id_grupo != ""){
			//verifica uniciade de login
			$dados = pegaDados("select nome from ".$esquemaadmin."i3geousr_grupos where nome = '$nome'");
			if(count($dados) > 0){
				$retorna = false;
			}
			$dataCol = array(
				"nome" => $nome,
				"descricao" => $descricao
			);
			i3GeoAdminUpdate($dbhw,"i3geousr_grupos",$dataCol,"WHERE id_grupo = $id_grupo");
			$retorna = $id_grupo;
		}
		else{
			$dataCol = array(
				"nome" => '',
				"descricao" => ''
			);
			$retorna = i3GeoAdminInsertUnico($dbhw,"i3geousr_grupos",$dataCol,"nome","id_grupo");
		}
		$dbhw = null;
		$dbh = null;
		return $retorna;
	}
	catch (PDOException $e){
		return "Error!: ";
	}
}
function adicionaUsuarioGrupo(){
	global $id_usuario,$id_grupo;
	try	{
		include(dirname(__FILE__)."/conexao.php");
		$dataCol = array(
			"id_usuario" => $id_usuario,
			"id_grupo" => $id_grupo
		);
		i3GeoAdminInsert($dbhw,"i3geousr_grupousuario",$dataCol);
		$dbhw = null;
		$dbh = null;
		return "ok";
	}
	catch (PDOException $e){
		return "Error!: ";
	}
}
function excluirGrupo()
{
	global $id_grupo,$esquemaadmin;
	try{
		exclui($esquemaadmin."i3geousr_grupos","id_grupo",$id_grupo);
		return "ok";
	}
	catch (PDOException $e)
	{
		return "Error!: ";
	}
}
function excluirUsuarioGrupo()
{
	global $id_usuario,$id_grupo;
	try
	{
		include(dirname(__FILE__)."/conexao.php");
		$sql = "DELETE FROM ".$esquemaadmin."i3geousr_grupousuario WHERE id_usuario = $id_usuario AND id_grupo = $id_grupo ";
		$dbhw->query($sql);
		i3GeoAdminInsertLog($dbhw,$sql);
		$dbhw = null;
		$dbh = null;
		return "ok";
	}
	catch (PDOException $e)
	{
		return "Error!: ";
	}
}
?>