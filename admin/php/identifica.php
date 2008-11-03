<?php
/*
Title: Administração do cadastro de funções da ferramenta identifica

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

File: i3geo/admin/identifica.php

19/6/2007

*/
include_once("admin.php");
//faz a busca da função que deve ser executada
switch ($funcao)
{
	//verifica os editores
	case "verificaEditores":
	retornaJSON(verificaEditores($editores));
	exit;
	break;
	
	case "pegaFuncoes":
	$dados = pegaDados('SELECT * from i3geoadmin_identifica');
	retornaJSON($dados);
	exit;
	break;
	
	case "alterarFuncoes":
	$novo = alterarFuncoes();
	$sql = "SELECT * from i3geoadmin_identifica WHERE id_i = '".$novo."'";
	retornaJSON(pegaDados($sql));
	exit;
	break;
	
	case "excluir":
	retornaJSON(excluirFuncoes());
	exit;
	break;
	
	case "importarXmlI":
	retornaJSON(importarXmlI());
	exit;;
	break;
}
/*
Function: alterarFuncoes

Altera o registro de um WS
*/
function alterarFuncoes()
{
	global $id_i,$abrir_i,$nome_i,$target_i,$publicado_i;
	try 
	{
    	//$nome_i = mb_convert_encoding($nome_i,"UTF-8","ISO-8859-1");
    	require_once("conexao.php");
    	if($id_i != "")
    	{
    		$dbhw->query("UPDATE i3geoadmin_identifica SET publicado_i = '$publicado_i',nome_i = '$nome_i',abrir_i = '$abrir_i', target_i = '$target_i' WHERE id_i = $id_i");
    		$retorna = $id_i;
    	}
    	else
    	{
    		$dbhw->query("INSERT INTO i3geoadmin_identifica (publicado_i,nome_i,abrir_i,target_i) VALUES ('','','','')");
			$id_i = $dbhw->query("SELECT id_i FROM i3geoadmin_identifica");
			$id_i = $id_i->fetchAll();
			$id_i = intval($id_i[count($id_i)-1]['id_i']);
			$retorna = $id_i;
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
function excluirFuncoes()
{
	global $id;
	try 
	{
    	include("conexao.php");
    	$dbhw->query("DELETE from i3geoadmin_identifica WHERE id_i = $id");
    	$dbhw = null;
    	$dbh = null;
    	return "ok";
	}
	catch (PDOException $e)
	{
    	return "Error!: " . $e->getMessage();
	}
}
function importarXmlI()
{
	global $xml;
	if(!file_exists($xml))
	{return "<br><b>Arquivo $xml n&atilde;o encontrado";}
	include_once("../../classesphp/funcoes_gerais.php");
	include("conexao.php");
	$xml = simplexml_load_file($xml);
	//
	//importa os grupos
	//
	$wsExistentes = array();
	$q = $dbhw->query("select * from i3geoadmin_identifica");
	$resultado = $q->fetchAll();
	foreach($resultado as $r)
	{$iExistentes[$r["nome_i"]] = 0;}
	foreach($xml->FUNCAO as $item)
	{
		$nome_i = html_entity_decode(ixml($item,"NOMESIS"));
		$target_i = ixml($item,"TARGET");
		$abrir_i = ixml($item,"ABRIR");
		if(!isset($iExistentes[$nome_i]))
		$dbhw->query("INSERT INTO i3geoadmin_identifica (publicado_i,nome_i,target_i,abrir_i) VALUES ('','$nome_i','$target_i','$abrir_i')");
		$iExistentes[$nome_i] = 0;
	}
	$dbhw = null;
	$dbh = null;
	return "Dados importados.";
}

?>