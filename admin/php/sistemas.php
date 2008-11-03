<?php
/*
Title: Administração do cadastro de sistemas

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

File: i3geo/admin/sistemas.php

19/6/2007

*/
include_once("admin.php");
//faz a busca da função que deve ser executada
switch ($funcao)
{
	case "pegaSistemas":
	retornaJSON(pegaDados('SELECT * from i3geoadmin_sistemas order by nome_sistema'));
	exit;
	break;

	case "pegaSistema":
	retornaJSON(pegaDados("SELECT * from i3geoadmin_sistemas where id_sistema='$id_sistema'"));
	exit;
	break;

	case "pegaFuncoes":	
	retornaJSON(pegaDados("SELECT * from i3geoadmin_sistemasf where id_sistema ='$id_sistema'"));
	exit;
	break;

	case "pegaFuncao":	
	retornaJSON(pegaDados("SELECT * from i3geoadmin_sistemasf where id_funcao ='$id_funcao'"));
	exit;
	break;

	
	case "alterarSistemas":
	$novo = alterarSistemas();
	$sql = "SELECT * from i3geoadmin_sistemas WHERE id_sistema = '".$novo."'";
	retornaJSON(pegaDados($sql));
	exit;
	break;

	case "alterarFuncoes":
	$novo = alterarFuncoes();
	$sql = "SELECT * from i3geoadmin_sistemasf WHERE id_funcao = '".$novo."'";
	retornaJSON(pegaDados($sql));	
	exit;
	break;
	
	case "excluirSistema":
	$tabela = "i3geoadmin_sistemas";
	$f = verificaFilhos();
	if(!$f)
	{
		retornaJSON(excluirSistemas());
		exit;
	}
	else
	{
		retornaJSON("erro");
		exit;
	}
	break;
	
	case "excluirFuncao":
	retornaJSON(excluirFuncoes());
	exit;
	break;
	
	case "importarXmlSistemas":
	retornaJSON(importarXmlSistemas());
	exit;
	break;
}
/*
Function: alterarSistemas

Altera o registro de um WS
*/
function alterarSistemas()
{
	global $id_sistema,$perfil_sistema,$nome_sistema,$publicado_sistema;
	try 
	{
    	require_once("conexao.php");
		//$nome = mb_convert_encoding($nome,"UTF-8","ISO-8859-1");
    	if($id_sistema != "")
    	{
    		$dbhw->query("UPDATE i3geoadmin_sistemas SET publicado_sistema='$publicado_sistema',nome_sistema = '$nome_sistema',perfil_sistema = '$perfil_sistema' WHERE id_sistema = $id_sistema");
    		$retorna = $id_sistema;
    	}
    	else
    	{
    		$dbhw->query("INSERT INTO i3geoadmin_sistemas (publicado_sistema,nome_sistema,perfil_sistema) VALUES ('','','')");
			$id = $dbhw->query("SELECT id_sistema FROM i3geoadmin_sistemas");
			$id = $id->fetchAll();
			$id = intval($id[count($id)-1]['id_sistema']);
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
function alterarFuncoes()
{
	global $id_sistema,$id_funcao,$perfil_funcao,$nome_funcao,$w_funcao,$h_funcao,$abrir_funcao;
	try 
	{
    	require_once("conexao.php");
		//$nomefuncao = mb_convert_encoding($nomefuncao,"UTF-8","ISO-8859-1");
    	if($id_funcao != "")
    	{
    		$dbhw->query("UPDATE i3geoadmin_sistemasf SET nome_funcao = '$nome_funcao',perfil_funcao = '$perfil_funcao', w_funcao = '$w_funcao',h_funcao = '$h_funcao', abrir_funcao = '$abrir_funcao' WHERE id_funcao = $id_funcao");
    		$retorna = $id_funcao;
    	}
    	else
    	{
    		$dbhw->query("INSERT INTO i3geoadmin_sistemasf (id_sistema,nome_funcao,perfil_funcao,w_funcao,h_funcao,abrir_funcao) VALUES ('$id_sistema','','','$w','$h','')");
			$id = $dbhw->query("SELECT id_funcao FROM i3geoadmin_sistemasf");
			$id = $id->fetchAll();
			$id = intval($id[count($id)-1]['id_funcao']);
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
function excluirFuncoes()
{
	global $id;
	try 
	{
    	include("conexao.php");
    	$dbhw->query("DELETE from i3geoadmin_sistemasf WHERE id_funcao = $id");
    	$dbhw = null;
    	$dbh = null;
    	return "ok";
	}
	catch (PDOException $e)
	{
    	return "Error!: " . $e->getMessage();
	}
}
function excluirSistemas()
{
	global $id;
	try 
	{
    	include("conexao.php");
    	$dbhw->query("DELETE from i3geoadmin_sistemas WHERE id_sistema = $id");
    	$dbhw = null;
    	$dbh = null;
    	return $id;
	}
	catch (PDOException $e)
	{
    	return "Error!: " . $e->getMessage();
	}
}
function importarXmlSistemas()
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
	$sistemasExistentes = array();
	$q = $dbhw->query("select * from i3geoadmin_sistemas");
	$resultado = $q->fetchAll();
	foreach($resultado as $r)
	{$sistemasExistentes[$r["nome_sistema"]] = 0;}
	foreach($xml->SISTEMA as $item)
	{
		$nome = html_entity_decode(ixml($item,"NOMESIS"));
		$perfil = ixml($item,"PERFIL");
		if(!isset($sistemasExistentes[$nome]))
		$dbhw->query("INSERT INTO i3geoadmin_sistemas (publicado_sistema,nome_sistema,perfil_sistema) VALUES ('','$nome','$perfil')");
		$sistemasExistentes[$nome] = 0;
		$id_sistema = $dbhw->query("SELECT id_sistema FROM i3geoadmin_sistemas");
		$id_sistema = $id_sistema->fetchAll();
		$id_sistema = intval($id_sistema[count($id_sistema)-1]['id_sistema']);
		foreach ($item->FUNCAO as $funcao)
		{
			$abrir_funcao = ixml($funcao,"ABRIR");
			$nome_funcao = html_entity_decode(ixml($funcao,"NOMEFUNCAO"));
			$w_funcao = ixml($funcao,"JANELAW");
			$h_funcao = ixml($funcao,"JANELAH");
			$perfil_funcao = ixml($funcao,"PERFIL");
			$dbhw->query("INSERT INTO i3geoadmin_sistemasf (nome_funcao,abrir_funcao,perfil_funcao,w_funcao,h_funcao,id_sistema) VALUES ('$nome_funcao','$abrir_funcao','$perfil_funcao','$w_funcao','$h_funcao','$id_sistema')");			
		}
	}
	$dbhw = null;
	$dbh = null;
	return "Dados importados.";
}
?>