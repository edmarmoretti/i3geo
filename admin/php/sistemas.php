<?php
/*
Title: sistemas.php

Fun&ccedil;&otilde;es utilizadas pelo editor do cadastro de sistemas

Sistemas s&atilde;o op&ccedil;&otilde;es adicionais que pode ser inclu&iacute;das na &aacute;rvore de adi&ccedil;&atilde;o de temas do i3Geo

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma cópia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/admin/php/sistemas.php

Parametros:

O par&acirc;metro principal &eacute; "funcao", que define qual opera&ccedil;&atilde;o ser&aacute; executada, por exemplo, sistemas.php?funcao=pegasistemas.

Cada opera&ccedil;&atilde;o possu&iacute; seus próprios par&acirc;metros, que devem ser enviados tamb&eacute;m na requisi&ccedil;&atilde;o da opera&ccedil;&atilde;o.
*/
include_once("admin.php");
error_reporting(0);
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
switch (strtoupper($funcao))
{
	/*
	Note:
	
	Valores que o par&acirc;metro &funcao pode receber. Os par&acirc;metros devem ser enviados na requisi&ccedil;&atilde;o em AJAX.
	*/
	/*
	Valor: PEGASISTEMAS
	
	Lista de sistemas
		
	Retorno:
	
	{JSON}
	*/
	case "PEGASISTEMAS":
		retornaJSON(pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_sistemas order by nome_sistema"));
		exit;
	break;
	/*
	Valor: PEGASISTEMA
	
	Dados de um sistemas
	
	Parametro:
	
	id_sistema
		
	Retorno:
	
	{JSON}
	*/
	case "PEGASISTEMA":
		retornaJSON(pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_sistemas where id_sistema='$id_sistema'"));
		exit;
	break;
	/*
	Valor: PEGAFUNCOES
	
	Lista de fun&ccedil;&otilde;es de um sistema
	
	Parametro:
	
	id_sistema
		
	Retorno:
	
	{JSON}
	*/
	case "PEGAFUNCOES":	
		retornaJSON(pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_sistemasf where id_sistema ='$id_sistema'"));
		exit;
	break;
	/*
	Valor: PEGAFUNCAO
	
	Pega os dados de uma fun&ccedil;&atilde;o espec&iacute;fica
	
	Parametro:
	
	id_funcao
		
	Retorno:
	
	{JSON}
	*/
	case "PEGAFUNCAO":	
		retornaJSON(pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_sistemasf where id_funcao ='$id_funcao'"));
		exit;
	break;
	/*
	Valor: ALTERARSISTEMAS
	
	Altera os dados de um sistema
	
	Parametros:
	
	id_sistema
	
	perfil_sistema
	
	nome_sistema
	
	publicado_sistema
		
	Retorno:
	
	{JSON}
	*/	
	case "ALTERARSISTEMAS":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		$novo = alterarSistemas();
		$sql = "SELECT * from ".$esquemaadmin."i3geoadmin_sistemas WHERE id_sistema = '".$novo."'";
		retornaJSON(pegaDados($sql));
		exit;
	break;
	/*
	Valor: ALTERARFUNCOES
	
	Altera os dados de uma fun&ccedil;&atilde;o
	
	Parametros:
	
	id_sistema
	
	id_funcao
	
	perfil_funcao
	
	nome_funcao
	
	w_funcao
	
	h_funcao
	
	abrir_funcao
		
	Retorno:
	
	{JSON}
	*/
	case "ALTERARFUNCOES":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		$novo = alterarFuncoes();
		$sql = "SELECT * from ".$esquemaadmin."i3geoadmin_sistemasf WHERE id_funcao = '".$novo."'";
		retornaJSON(pegaDados($sql));
		exit;
	break;
	/*
	Valor: EXCLUIRSISTEMA
	
	Exclui um sistema
	
	Parametros:
	
	id
		
	Retorno:
	
	{JSON}
	*/	
	case "EXCLUIRSISTEMA":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
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
	/*
	Valor: EXCLUIRFUNCAO
	
	Exclui uma fun&ccedil;&atilde;o
	
	Parametros:
	
	id
		
	Retorno:
	
	{JSON}
	*/	
	case "EXCLUIRFUNCAO":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		retornaJSON(excluirFuncoes());
		exit;
	break;
	
	case "IMPORTARXMLSISTEMAS":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		retornaJSON(importarXmlSistemas());
		exit;
	break;
}
/*
Altera o registro de um WS
*/
function alterarSistemas()
{
	global $esquemaadmin,$id_sistema,$perfil_sistema,$nome_sistema,$publicado_sistema;
	try 
	{
    	require_once("conexao.php");
		if($convUTF)
		{
			$nome_sistema = utf8_encode($nome_sistema);
		}
    	if($id_sistema != "")
    	{
    		$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_sistemas SET publicado_sistema='$publicado_sistema',nome_sistema = '$nome_sistema',perfil_sistema = '$perfil_sistema' WHERE id_sistema = $id_sistema");
    		$retorna = $id_sistema;
    	}
    	else
    	{
    		$idtemp = (rand (9000,10000)) * -1;
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_sistemas (publicado_sistema,nome_sistema,perfil_sistema) VALUES ('','$idtemp','')");
			$id = $dbh->query("SELECT id_sistema FROM ".$esquemaadmin."i3geoadmin_sistemas WHERE nome_sistema = '$idtemp'");
			$id = $id->fetchAll();
			$id = $id[0]['id_sistema'];
			$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_sistemas SET nome_sistema = '' WHERE id_sistema = $id AND nome_sistema = '$idtemp'");
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
	global $esquemaadmin,$id_sistema,$id_funcao,$perfil_funcao,$nome_funcao,$w_funcao,$h_funcao,$abrir_funcao;
	try 
	{
    	require_once("conexao.php");
		if($convUTF)
		{
			$nome_funcao = utf8_encode($nome_funcao);
		}
    	if($id_funcao != "")
    	{
    		$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_sistemasf SET nome_funcao = '$nome_funcao',perfil_funcao = '$perfil_funcao', w_funcao = '$w_funcao',h_funcao = '$h_funcao', abrir_funcao = '$abrir_funcao' WHERE id_funcao = $id_funcao");
    		$retorna = $id_funcao;
    	}
    	else
    	{
    		$idtemp = (rand (9000,10000)) * -1;
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_sistemasf (id_sistema,nome_funcao,perfil_funcao,w_funcao,h_funcao,abrir_funcao) VALUES ('$id_sistema','$idtemp','','$w','$h','')");
			$id = $dbh->query("SELECT id_funcao FROM ".$esquemaadmin."i3geoadmin_sistemasf WHERE nome_funcao = '$idtemp'");
			$id = $id->fetchAll();
			$id = $id[0]['id_funcao'];
			$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_sistemasf SET nome_funcao = '' WHERE id_funcao = $id AND nome_funcao = '$idtemp'");
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
	global $id,$esquemaadmin;
	try 
	{
    	include("conexao.php");
    	$dbhw->query("DELETE from ".$esquemaadmin."i3geoadmin_sistemasf WHERE id_funcao = $id");
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
	global $id,$esquemaadmin;
	try 
	{
    	include("conexao.php");
    	$dbhw->query("DELETE from ".$esquemaadmin."i3geoadmin_sistemas WHERE id_sistema = $id");
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
	global $xml,$tipo,$esquemaadmin;
	if(!file_exists($xml))
	{return "<br><b>Arquivo $xml n&atilde;o encontrado";}
	include_once("../../classesphp/funcoes_gerais.php");
	include("conexao.php");
	$xml = simplexml_load_file($xml);
	//
	//importa os grupos
	//
	$sistemasExistentes = array();
	$q = $dbh->query("select * from ".$esquemaadmin."i3geoadmin_sistemas");
	$resultado = $q->fetchAll();
	foreach($resultado as $r)
	{$sistemasExistentes[$r["nome_sistema"]] = 0;}
	foreach($xml->SISTEMA as $item)
	{
		$nome = html_entity_decode(ixml($item,"NOMESIS"));
		if($convUTF)
		{
			$nome = utf8_encode($nome);
		}
		$perfil = ixml($item,"PERFIL");
		if(!isset($sistemasExistentes[$nome]))
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_sistemas (publicado_sistema,nome_sistema,perfil_sistema) VALUES ('','$nome','$perfil')");
		$sistemasExistentes[$nome] = 0;
		$id_sistema = $dbh->query("SELECT id_sistema FROM ".$esquemaadmin."i3geoadmin_sistemas");
		$id_sistema = $id_sistema->fetchAll();
		$id_sistema = intval($id_sistema[count($id_sistema)-1]['id_sistema']);
		foreach ($item->FUNCAO as $funcao)
		{
			$abrir_funcao = ixml($funcao,"ABRIR");
			$nome_funcao = html_entity_decode(ixml($funcao,"NOMEFUNCAO"));
			if($convUTF)
			{
				$nome_funcao = utf8_encode($nome_funcao);
			}
			$w_funcao = ixml($funcao,"JANELAW");
			$h_funcao = ixml($funcao,"JANELAH");
			$perfil_funcao = ixml($funcao,"PERFIL");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_sistemasf (nome_funcao,abrir_funcao,perfil_funcao,w_funcao,h_funcao,id_sistema) VALUES ('$nome_funcao','$abrir_funcao','$perfil_funcao','$w_funcao','$h_funcao','$id_sistema')");			
		}
	}
	$dbhw = null;
	$dbh = null;
	return "Dados importados.";
}
?>