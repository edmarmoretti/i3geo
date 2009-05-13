<?php
/*
Title: Administração do cadastro de web services

About: Licença

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;
tanto a versão 2 da Licença.
Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

File: i3geo/admin/webservices.php

19/6/2007

*/
error_reporting(0);
//
//não sei pq mas ob_start e clean são necessários no Linux para não gerar erro indesejado
//
ob_start();
include_once("admin.php");
ob_clean();
//faz a busca da função que deve ser executada
switch ($funcao)
{
	case "pegaWS":
	retornaJSON(pegaDados('SELECT id_ws,nome_ws,tipo_ws from i3geoadmin_ws order by tipo_ws,nome_ws'));
	exit;
	break;
	
	case "pegaDados":
	retornaJSON(pegaDados("SELECT * from i3geoadmin_ws where id_ws='$id_ws'"));
	exit;
	break;
	
	case "alterarWS":
	if(verificaEditores($editores) == "nao")
	{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
	$novo = alterarWS();
	$sql = "SELECT * from i3geoadmin_ws WHERE id_ws = '".$novo."'";
	retornaJSON(pegaDados($sql));
	exit;
	break;
	
	case "excluir":
	if(verificaEditores($editores) == "nao")
	{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
	retornaJSON(excluirWS());
	exit;
	break;
	
	case "importarXmlWS":
	if(verificaEditores($editores) == "nao")
	{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
	retornaJSON(importarXmlWS());
	exit;
	break;
}
/*
Function: alterarWS

Altera o registro de um WS
*/
function alterarWS()
{
	global $id_ws,$desc_ws,$nome_ws,$link_ws,$autor_ws,$tipo_ws;
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
    		$dbhw->query("UPDATE i3geoadmin_ws SET desc_ws = '$desc_ws',nome_ws = '$nome_ws', link_ws = '$link_ws', autor_ws = '$autor_ws', tipo_ws = '$tipo_ws' WHERE id_ws = $id_ws");
    		$retorna = $id_ws;
    	}
    	else
    	{
    		$dbhw->query("INSERT INTO i3geoadmin_ws (nome_ws,desc_ws,autor_ws,tipo_ws,link_ws,nacessos,nacessosok) VALUES ('','','','','',0,0)");
			$id = $dbh->query("SELECT id_ws FROM i3geoadmin_ws");
			$id = $id->fetchAll();
			$id = intval($id[count($id)-1]['id_ws']);
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
	global $id;
	try 
	{
    	include("conexao.php");
    	$dbhw->query("DELETE from i3geoadmin_ws WHERE id_ws = $id");
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
	try
	{
    	include("conexao.php");
    	$dados = pegaDados("select * from i3geoadmin_ws WHERE id_ws = $id_ws");
    	//var_dump($dados);
    	$acessos = $dados[0]["nacessos"] + 1;
    	if($sucesso)
    	$ok = $dados[0]["nacessosok"] + 1;
    	else
    	$ok = $dados[0]["nacessosok"];
   		$dbhw->query("UPDATE i3geoadmin_ws SET nacessos = '$acessos',nacessosok = '$ok' WHERE id_ws = $id_ws");
    	$dbhw = null;
    	$dbh = null;
	}
	catch (PDOException $e)
	{
    	return "Error!: " . $e->getMessage();
	}
}
function importarXmlWS()
{
	global $xml,$tipo;
	set_time_limit(180);
	if(!file_exists($xml))
	{return "<br><b>Arquivo $xml n&atilde;o encontrado";}
	include_once("../../classesphp/funcoes_gerais.php");
	include("conexao.php");
	$xml = simplexml_load_file($xml);
	//
	//importa os grupos
	//
	$wsExistentes = array();
	$q = $dbh->query("select * from i3geoadmin_ws");
	$resultado = $q->fetchAll();
	foreach($resultado as $r)
	{$wsExistentes[$r["nome_ws"]] = 0;}
	foreach($xml->channel as $c)
	{
		foreach($c->item as $item)
		{
			$desc = html_entity_decode(ixml($item,"description"));
			$nome = html_entity_decode(ixml($item,"title"));
			$autor = html_entity_decode(ixml($item,"author"));
			$link = ixml($item,"link");
			if($convUTF)
			{
				$nome = utf8_encode($nome);
				$desc = utf8_encode($desc);
				$autor = utf8_encode($autor);
			}
			if(!isset($wsExistentes[$nome]))
			$dbhw->query("INSERT INTO i3geoadmin_ws (nome_ws,desc_ws,autor_ws,link_ws,tipo_ws,nacessos,nacessosok) VALUES ('$nome','$desc','$autor','$link','$tipo',0,0)");
			$wsExistentes[$nome] = 0;
		}
	}
	$dbhw = null;
	$dbh = null;
	return "Dados importados.";
}
?>