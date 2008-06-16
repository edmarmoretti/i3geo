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
$cp = new cpaint();
//faz a busca da função que deve ser executada
switch ($funcao)
{
	//verifica os editores
	case "verificaEditores":
	$cp->set_data(verificaEditores($editores));
	$cp->return_data();
	break;
	
	case "pegaSistemas":
	$sis = pegaDados('SELECT * from i3geoadmin_sistemas order by nome_sistema');
	for($i=0;$i<count($sis);++$i)
	{
		$funcoes = 	pegaDados('SELECT * from i3geoadmin_sistemasf where id_sistema ='.($sis[$i]["id_sistema"]));
		$sis[$i]["funcoes"] = $funcoes;
	}
	$cp->set_data($sis);
	$cp->return_data();
	break;
	
	case "alterarSistemas":
	alterarSistemas();
	if($id_sistema == "")
	$sis = pegaDados('SELECT * from i3geoadmin_sistemas');
	else
	$sis = pegaDados('SELECT * from i3geoadmin_sistemas where id_sistema ='.$id_sistema);
	for($i=0;$i<count($sis);++$i)
	{
		$funcoes = 	pegaDados('SELECT * from i3geoadmin_sistemasf where id_sistema ='.($sis[$i]["id_sistema"]));
		$sis[$i]["funcoes"] = $funcoes;
	}
	$cp->set_data($sis);
	$cp->return_data();
	break;

	case "alterarFuncoes":
	alterarFuncoes();
	if($id_funcao == "")
	$sis = pegaDados('SELECT * from i3geoadmin_sistemas');
	else
	$sis = pegaDados('SELECT * from i3geoadmin_sistemas where id_sistema ='.$id_sistema);
	for($i=0;$i<count($sis);++$i)
	{
		$funcoes = 	pegaDados('SELECT * from i3geoadmin_sistemasf where id_sistema ='.($sis[$i]["id_sistema"]));
		$sis[$i]["funcoes"] = $funcoes;
	}
	$cp->set_data($sis);
	$cp->return_data();
	break;

	
	case "excluir":
	$f = verificaFilhos();
	if(!$f)
	$cp->set_data(excluirSistemas());
	else
	$cp->set_data("erro");
	$cp->return_data();
	break;
	
	case "excluirFuncoes":
	$cp->set_data(excluirFuncoes());
	$cp->return_data();
	break;
	
	case "importarXmlSistemas":
	$cp->set_data(importarXmlSistemas());
	$cp->return_data();
	break;
}
/*
Function: alterarSistemas

Altera o registro de um WS
*/
function alterarSistemas()
{
	global $id_sistema,$perfil,$nome;
	try 
	{
    	require_once("conexao.php");
		$nome = mb_convert_encoding($nome,"UTF-8","ISO-8859-1");
    	if($id_sistema != "")
    	$dbhw->query("UPDATE i3geoadmin_sistemas SET nome_sistema = '$nome',perfil_sistema = '$perfil' WHERE id_sistema = $id_sistema");
    	else
    	$dbhw->query("INSERT INTO i3geoadmin_sistemas (nome_sistema,perfil_sistema) VALUES ('','')");
    	$dbhw = null;
    	$dbh = null;
    	return "ok";
	}
	catch (PDOException $e)
	{
    	return "Error!: " . $e->getMessage();
	}
}
function alterarFuncoes()
{
	global $id_sistema,$id_funcao,$perfil,$nomefuncao,$w,$h,$abrir;
	try 
	{
    	require_once("conexao.php");
		$nomefuncao = mb_convert_encoding($nomefuncao,"UTF-8","ISO-8859-1");
    	if($id_funcao != "")
    	$dbhw->query("UPDATE i3geoadmin_sistemasf SET nome_funcao = '$nomefuncao',perfil_funcao = '$perfil', w_funcao = '$w',h_funcao = '$h', abrir_funcao = '$abrir' WHERE id_sistema = $id_sistema and id_funcao = $id_funcao");
    	else
    	$dbhw->query("INSERT INTO i3geoadmin_sistemasf (id_sistema,nome_funcao,perfil_funcao,w_funcao,h_funcao,abrir_funcao) VALUES ('$id_sistema','','','$w','$h','')");
    	$dbhw = null;
    	$dbh = null;
    	return "ok";
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
    	$dbhw->query("DELETE from i3geoadmin_sistemasf WHERE id_sistema = $id");
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
    	return "ok";
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
		$nome = ixml($item,"NOMESIS");
		$perfil = ixml($item,"PERFIL");
		if(!isset($sistemasExistentes[$nome]))
		$dbhw->query("INSERT INTO i3geoadmin_sistemas (nome_sistema,perfil_sistema) VALUES ('$nome','$perfil')");
		$sistemasExistentes[$nome] = 0;
		$id_sistema = $dbh->lastInsertId("id_sistema");
		foreach ($item->FUNCAO as $funcao)
		{
			$abrir_funcao = ixml($funcao,"ABRIR");
			$nome_funcao = ixml($funcao,"NOMEFUNCAO");
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
function verificaFilhos()
{
	try 
	{
    	global $id;
    	$res = false;
   		$r = pegaDados("select * from  i3geoadmin_sistemasf where id_sistema=$id");
   		if(count($r) > 0)
   		$res = true;
    	return $res;
	}
	catch (PDOException $e)
	{
    	return "Error!: " . $e->getMessage();
	}
}

?>