<?php
/*
Title: webservices.php

Funções utilizadas pelo editor do cadastro de Web Services

É utilizado nas funções em AJAX da interface de edição

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/admin/php/webservices.php

Parametros:

O parâmetro principal é "funcao", que define qual operação será executada, por exemplo, webservices.php?funcao=pegaws

Cada operação possuí seus próprios parâmetros, que devem ser enviados também na requisição da operação.

*/
error_reporting(0);
//
//não sei pq mas ob_start e clean são necessários no Linux para não gerar erro indesejado
//
ob_start();
include_once("admin.php");
ob_clean();
//faz a busca da função que deve ser executada
switch (strtoupper($funcao))
{
	/*
	Note:
	
	Valores que o parâmetro &funcao pode receber. Os parâmetros devem ser enviados na requisição em AJAX.
	*/
	/*
	Valor: PEGAWS
	
	Lista de serviços cadastrados
	
	Retorno:
	
	{JSON}
	*/
	case "PEGAWS":
		if(isset($tipows) && $tipows != "")
		{$sql = "SELECT id_ws,nome_ws,tipo_ws from ".$esquemaadmin."i3geoadmin_ws where tipo_ws = '".strtoupper($tipows)."' order by tipo_ws,nome_ws ";}
		else
		{$sql = "SELECT id_ws,nome_ws,tipo_ws from ".$esquemaadmin."i3geoadmin_ws order by tipo_ws,nome_ws";}
		retornaJSON(pegaDados($sql));
		exit;
	break;
	/*
	Valor: PEGADADOS
	
	Dados de um servico
	
	Parametro:
	
	id_ws {string}
	
	Retorno:
	
	{JSON}
	*/	
	case "PEGADADOS":
		retornaJSON(pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_ws where id_ws='$id_ws'"));
		exit;
	break;
	/*
	Valor: ALTERARWS
	
	Altera um registro
	
	Parametros:
	
	id_ws
	
	desc_ws
	
	nome_ws
	
	link_ws
	
	autor_ws
	
	tipo_ws
	
	Retorno:
	
	{JSON}
	*/	
	case "ALTERARWS":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		$novo = alterarWS();
		$sql = "SELECT * from ".$esquemaadmin."i3geoadmin_ws WHERE id_ws = '".$novo."'";
		retornaJSON(pegaDados($sql));
		exit;
	break;
	/*
	Valor: EXCLUIR
	
	Exclui um registro
	
	Parametro:
	
	id {string}
	
	Retorno:
	
	{JSON}
	*/		
	case "EXCLUIR":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		retornaJSON(excluirWS());
		exit;
	break;
	
	case "IMPORTARXMLWS":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		retornaJSON(importarXmlWS());
		exit;
	break;
}
/*
Altera o registro de um WS
*/
function alterarWS()
{
	global $esquemaadmin,$id_ws,$desc_ws,$nome_ws,$link_ws,$autor_ws,$tipo_ws;
	try 
	{
    	require_once("conexao.php");
		if($convUTF)
		{
			$nome_ws = utf8_encode($nome_ws);
			$desc_ws = utf8_encode($desc_ws);
			$autor_ws = utf8_encode($autor_ws);
		}
    	if($id_ws != "")
    	{
    		$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_ws SET desc_ws = '$desc_ws',nome_ws = '$nome_ws', link_ws = '$link_ws', autor_ws = '$autor_ws', tipo_ws = '$tipo_ws' WHERE id_ws = $id_ws");
    		$retorna = $id_ws;
    	}
    	else
    	{
    		$idtemp = (rand (9000,10000)) * -1;
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_ws (nome_ws,desc_ws,autor_ws,tipo_ws,link_ws,nacessos,nacessosok) VALUES ('$idtemp','','','','',0,0)");
			$id = $dbh->query("SELECT id_ws FROM ".$esquemaadmin."i3geoadmin_ws WHERE nome_ws = '$idtemp'");
			$id = $id->fetchAll();
			$id = $id[0]['id_ws'];
			$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_ws SET nome_ws = '' WHERE id_ws = $id AND nome_ws = '$idtemp'");
			$retorna = $id;
    	}
    	$dbhw = null;
    	$dbh = null;
    	return $retorna;
	}
	catch (PDOException $e)
	{
    	return "Error!: " . $e->getMessage();
	}
}
function excluirWS()
{
	global $id,$esquemaadmin;
	try 
	{
    	include("conexao.php");
    	$dbhw->query("DELETE from ".$esquemaadmin."i3geoadmin_ws WHERE id_ws = $id");
    	$dbhw = null;
    	$dbh = null;
    	return "ok";
	}
	catch (PDOException $e)
	{
    	return "Error!: " . $e->getMessage();
	}
}
function adicionaAcesso($id_ws,$sucesso)
{
	global $esquemaadmin;
	try
	{
    	if($id_ws == ""){return;}
    	include("conexao.php");
    	$dados = pegaDados("select * from ".$esquemaadmin."i3geoadmin_ws WHERE id_ws = $id_ws");
    	if(count($dados) == 0){return;};
    	if($dados[0]["nacessos"] == ""){$dados[0]["nacessos"] = 0;}
    	$acessos = $dados[0]["nacessos"] + 1;
    	
    	if($sucesso)
    	$ok = $dados[0]["nacessosok"] + 1;
    	else
    	$ok = $dados[0]["nacessosok"];
    	
    	if($ok == ""){$ok = 0;}
   		$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_ws SET nacessos = '$acessos',nacessosok = '$ok' WHERE id_ws = $id_ws");
    	$dbhw = null;
    	$dbh = null;
	}
	catch (PDOException $e)
	{
    	return "Error!: " . $e->getMessage();
	}
}
?>