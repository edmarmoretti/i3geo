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
include_once("admin.php");
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
	$novo = alterarWS();
	$sql = "SELECT * from i3geoadmin_ws WHERE id_ws = '".$novo."'";
	retornaJSON(pegaDados($sql));
	exit;
	break;
	
	case "excluir":
	retornaJSON(excluirWS());
	exit;
	break;
	
	case "importarXmlWS":
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
		//$nome = mb_convert_encoding($nome,"UTF-8","ISO-8859-1");
		//$desc = mb_convert_encoding($desc,"UTF-8","ISO-8859-1");
		//$autor = mb_convert_encoding($autor,"UTF-8","ISO-8859-1");   	
    	if($id_ws != "")
    	{
    		$dbhw->query("UPDATE i3geoadmin_ws SET desc_ws = '$desc_ws',nome_ws = '$nome_ws', link_ws = '$link_ws', autor_ws = '$autor_ws', tipo_ws = '$tipo_ws' WHERE id_ws = $id_ws");
    		$retorna = $id_ws;
    	}
    	else
    	{
    		$dbhw->query("INSERT INTO i3geoadmin_ws (nome_ws,desc_ws,autor_ws,tipo_ws,link_ws) VALUES ('','','','','')");
			$id = $dbhw->query("SELECT id_ws FROM i3geoadmin_ws");
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
function importarXmlWS()
{
	global $xml,$tipo;
	if(!file_exists($xml))
	{return "<br><b>Arquivo $xml n&atilde;o encontrado";}
	include_once("../../classesphp/funcoes_gerais.php");
	include("conexao.php");
	$xml = simplexml_load_file($xml);
	//
	//importa os grupos
	//
	$wsExistentes = array();
	$q = $dbhw->query("select * from i3geoadmin_ws");
	$resultado = $q->fetchAll();
	foreach($resultado as $r)
	{$wsExistentes[$r["nome_ws"]] = 0;}
	foreach($xml->channel as $c)
	{
		foreach($c->item as $item)
		{
			$descricao = ixml($item,"description");
			$nome = ixml($item,"title");
			$autor = ixml($item,"author");
			$link = ixml($item,"link");
			if(!isset($wsExistentes[$nome]))
			$dbhw->query("INSERT INTO i3geoadmin_ws (nome_ws,desc_ws,autor_ws,link_ws,tipo_ws) VALUES ('$nome','$desc','$autor','$link','$tipo')");
			$wsExistentes[$nome] = 0;
		}
	}
	$dbhw = null;
	$dbh = null;
	return "Dados importados.";
}
?>