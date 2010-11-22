<?php
/*
Title: sistemas.php

Funções utilizadas pelo editor do cadastro de sistemas

Sistemas são opções adicionais que pode ser incluídas na árvore de adição de temas do i3Geo

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

i3geo/admin/php/sistemas.php

Parametros:

O parâmetro principal é "funcao", que define qual operação será executada, por exemplo, sistemas.php?funcao=pegasistemas.

Cada operação possuí seus próprios parâmetros, que devem ser enviados também na requisição da operação.
*/
include_once("admin.php");
error_reporting(0);
//faz a busca da função que deve ser executada
switch (strtoupper($funcao))
{
	/*
	Note:
	
	Valores que o parâmetro &funcao pode receber. Os parâmetros devem ser enviados na requisição em AJAX.
	*/
	/*
	Valor: PEGASISTEMAS
	
	Lista de sistemas
		
	Retorno:
	
	{JSON}
	*/
	case "PEGASISTEMAS":
		retornaJSON(pegaDados('SELECT * from i3geoadmin_sistemas order by nome_sistema'));
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
		retornaJSON(pegaDados("SELECT * from i3geoadmin_sistemas where id_sistema='$id_sistema'"));
		exit;
	break;
	/*
	Valor: PEGAFUNCOES
	
	Lista de funções de um sistema
	
	Parametro:
	
	id_sistema
		
	Retorno:
	
	{JSON}
	*/
	case "PEGAFUNCOES":	
		retornaJSON(pegaDados("SELECT * from i3geoadmin_sistemasf where id_sistema ='$id_sistema'"));
		exit;
	break;
	/*
	Valor: PEGAFUNCAO
	
	Pega os dados de uma função específica
	
	Parametro:
	
	id_funcao
		
	Retorno:
	
	{JSON}
	*/
	case "PEGAFUNCAO":	
		retornaJSON(pegaDados("SELECT * from i3geoadmin_sistemasf where id_funcao ='$id_funcao'"));
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
		$sql = "SELECT * from i3geoadmin_sistemas WHERE id_sistema = '".$novo."'";
		retornaJSON(pegaDados($sql));
		exit;
	break;
	/*
	Valor: ALTERARFUNCOES
	
	Altera os dados de uma função
	
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
		$sql = "SELECT * from i3geoadmin_sistemasf WHERE id_funcao = '".$novo."'";
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
	
	Exclui uma função
	
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
	global $id_sistema,$perfil_sistema,$nome_sistema,$publicado_sistema;
	try 
	{
    	require_once("conexao.php");
		if($convUTF)
		{
			$nome_sistema = utf8_encode($nome_sistema);
		}
    	if($id_sistema != "")
    	{
    		$dbhw->query("UPDATE i3geoadmin_sistemas SET publicado_sistema='$publicado_sistema',nome_sistema = '$nome_sistema',perfil_sistema = '$perfil_sistema' WHERE id_sistema = $id_sistema");
    		$retorna = $id_sistema;
    	}
    	else
    	{
    		$dbhw->query("INSERT INTO i3geoadmin_sistemas (publicado_sistema,nome_sistema,perfil_sistema) VALUES ('','','')");
			$id = $dbh->query("SELECT id_sistema FROM i3geoadmin_sistemas");
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
		if($convUTF)
		{
			$nome_funcao = utf8_encode($nome_funcao);
		}
    	if($id_funcao != "")
    	{
    		$dbhw->query("UPDATE i3geoadmin_sistemasf SET nome_funcao = '$nome_funcao',perfil_funcao = '$perfil_funcao', w_funcao = '$w_funcao',h_funcao = '$h_funcao', abrir_funcao = '$abrir_funcao' WHERE id_funcao = $id_funcao");
    		$retorna = $id_funcao;
    	}
    	else
    	{
    		$dbhw->query("INSERT INTO i3geoadmin_sistemasf (id_sistema,nome_funcao,perfil_funcao,w_funcao,h_funcao,abrir_funcao) VALUES ('$id_sistema','','','$w','$h','')");
			$id = $dbh->query("SELECT id_funcao FROM i3geoadmin_sistemasf");
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
	$q = $dbh->query("select * from i3geoadmin_sistemas");
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
		$dbhw->query("INSERT INTO i3geoadmin_sistemas (publicado_sistema,nome_sistema,perfil_sistema) VALUES ('','$nome','$perfil')");
		$sistemasExistentes[$nome] = 0;
		$id_sistema = $dbh->query("SELECT id_sistema FROM i3geoadmin_sistemas");
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
			$dbhw->query("INSERT INTO i3geoadmin_sistemasf (nome_funcao,abrir_funcao,perfil_funcao,w_funcao,h_funcao,id_sistema) VALUES ('$nome_funcao','$abrir_funcao','$perfil_funcao','$w_funcao','$h_funcao','$id_sistema')");			
		}
	}
	$dbhw = null;
	$dbh = null;
	return "Dados importados.";
}
?>