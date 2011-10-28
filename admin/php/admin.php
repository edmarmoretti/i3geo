<?php
/*
Title: Funções de uso geral

Funções utilizadas por outros programas do sistema de administração.

No início do programa é feita a inclusão do i3geo/ms_configura.php e i3geo/classesphp/funcoes_gerais.php

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

i3geo/admin/php/admin.php
*/

if(!isset($locaplic))
{
	$locaplic = "";
	if(file_exists("../../../ms_configura.php"))
	{include_once("../../../ms_configura.php");}
	else
	{
		if(file_exists("../../ms_configura.php"))
		{include_once("../../ms_configura.php");}
		else
		{
			if(file_exists("../ms_configura.php"))
			{include_once("../ms_configura.php");}
			else
			{include_once("ms_configura.php");}
		}	
	}
}
include_once($locaplic."/classesphp/pega_variaveis.php");
error_reporting(0);
//
//carrega o phpmapscript
//
include_once ($locaplic."/classesphp/carrega_ext.php");
include_once ($locaplic."/classesphp/funcoes_gerais.php");

//
//verifica se o cliente pode editar
//se funcao for verificaEditores vai para case específico
//
if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
{$mapfile = "geral1windows";}
else
{$mapfile = "geral1";}
/*
Function: retornaJSON

Converte um array em um objeto do tipo JSON utilizando a biblioteca CPAINT

Parametro:

obj {array}

Retorno:

Imprime na saída a string JSON
*/
function retornaJSON($obj)
{
	global $locaplic;
	//if(function_exists("json_encode"))
	//{echojson(json_encode($obj));}
	//else
	//{
		include_once($locaplic."/pacotes/cpaint/JSON/json2.php");
		error_reporting(0);
		$j = new Services_JSON();
		$texto = $j->encode($obj);
		if (!mb_detect_encoding($texto,"UTF-8",true))
		$texto = utf8_encode($texto);
		echo $texto;
	//}
/*
	include_once($locaplic."/pacotes/cpaint/JSON/json2.php");
	error_reporting(0);
	$j = new Services_JSON();
	$texto = $j->encode($obj);
	if (!mb_detect_encoding($texto,"UTF-8",true))
	$texto = utf8_encode($texto);
	header("Content-type: text/ascii; charset=UTF-8");
	header('Expires: Fri, 14 Mar 1980 20:53:00 GMT');
	header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
	header('Cache-Control: no-cache, must-revalidate');
	header('Pragma: no-cache');
	echo $texto;
	exit;
*/
}
/*
Function: verificaDuplicados

Verifica se o resultado de um SQL retoena mais de um registro

Parametros:

sql {string} - sql que será executado

dbh {PDO} - objeto PDO de conexão com o banco

Retorno:

{boolean}
*/
function verificaDuplicados($sql,$dbh)
{
	$res = $dbh->query($sql,PDO::FETCH_ASSOC);
	if(count($res->fetchAll())>0)
	return true;
	else
	return false;
}
/*
Function: exclui

Exlcui um registro de uma tabela do banco de dados de administração

Utiliza variáveis globais para fazer a consulta ao banco

Globals:

tabela - nome da tabela

coluna - nome da coluna

id - valor
*/
function exclui()
{
	global $tabela,$coluna,$id;
	try 
	{
    	include("conexao.php");
    	$dbhw->query("DELETE from $tabela WHERE $coluna = $id");
    	$dbhw = null;
    	$dbh = null;
    	return "ok";
	}
	catch (PDOException $e)
	{
    	return "Error!: " . $e->getMessage();
	}
}
/*
Function: pegaDados

Executa um sql de busca de dados

Parametros:

sql {string} - sql que será executado

locaplic {string} - endereço do i3Geo no sistema de arquivos

Retorno:

Array originada de fetchAll
*/
function pegaDados($sql,$locaplic="")
{
   	$resultado = array();
   	if($locaplic == "")
   	include("conexao.php");
   	else
   	include("$locaplic/admin/php/conexao.php");
   	error_reporting(E_ALL);
   	$q = $dbh->query($sql,PDO::FETCH_ASSOC);
   	if($q)
   	{
   		$resultado = $q->fetchAll();
   		$dbh = null;
   		$dbhw = null;
   		return $resultado;
   	}
   	else
   	{
		$e = $dbh->errorInfo();
		//$e1 = $dbhw->errorInfo();
   		$dbh = null;
   		$dbhw = null;    	
		//echo " erro: ".$e[2];
		throw new Exception(" erro admin.php funcao pegaDados: <br><span style=color:red >".$e[2]."<br><span style=color:green >");
   	}
}
/*
Function: verificaFilhos

Verifica se o pai tem filhos nos componentes hierárquicos do banco de administração

Por exemplo, pode-se verificar se um grupo possuí subgrupos, indicando-se como tabela i3geoadmin_grupos e o id do grupo

Variáveis globais:

tabela {string} - tabela do banco de dados

id {string} - valor a ser procurado

Retorno:

{booleano}
*/
function verificaFilhos()
{
	global $tabela,$id;
	try 
	{
    	$res = false;
    	if($tabela == "i3geoadmin_n2")
    	{
    		$r = pegaDados("select * from i3geoadmin_n3 where id_n2=$id");
    		if(count($r) > 0)
    		$res = true;
    	}
    	if($tabela == "i3geoadmin_n1")
    	{
    		$r = pegaDados("select * from i3geoadmin_n2 where id_n1=$id");
    		if(count($r) > 0)
    		$res = true;
    	}
    	if($tabela == "i3geoadmin_menus")
    	{
    		$r = pegaDados("select * from i3geoadmin_n1 where id_menu=$id");
    		if(count($r) > 0)
    		$res = true;
    	}
    	if($tabela == "i3geoadmin_grupos")
    	{
    		$r = pegaDados("select n1.id_grupo from i3geoadmin_n1 as n1, i3geoadmin_n2 as n2 where n1.id_n1 = n2.id_n1 and n1.id_grupo = '$id'");
    		if(count($r) > 0)
    		$res = true;
    	}
    	if($tabela == "i3geoadmin_subgrupos")
    	{
    		$r = pegaDados("select n2.id_subgrupo from i3geoadmin_n3 as n3, i3geoadmin_n2 as n2 where n2.id_n2 = n3.id_n3 and n2.id_subgrupo = '$id'");
    		if(count($r) > 0)
    		$res = true;
    	}
    	if($tabela == "i3geoadmin_temas")
    	{
    		$r = pegaDados("select id_tema from i3geoadmin_n3 where id_tema = '$id'");
    		if(count($r) > 0)
    		$res = true;
    	}
    	if($tabela == "i3geoadmin_sistemas")
    	{
    		$r = pegaDados("SELECT id_sistema from i3geoadmin_sistemasf where id_sistema ='$id'");
    		if(count($r) > 0)
    		$res = true;
    	}
    	if($tabela == "i3geoadmin_atlas")
    	{
    		$r = pegaDados("SELECT id_atlas from i3geoadmin_atlasp where id_atlas ='$id'");
    		if(count($r) > 0)
    		$res = true;
    	}
    	if($tabela == "i3geoadmin_atlasp")
    	{
    		$r = pegaDados("SELECT id_prancha from i3geoadmin_atlast where id_prancha ='$id'");
    		if(count($r) > 0)
    		$res = true;
    	}
    	if($tabela == "i3geoadmin_n2")
    	{
    		$r = pegaDados("SELECT id_n3 from i3geoadmin_n3 where id_n2 ='$id'");
    		if(count($r) > 0)
    		$res = true;
    	}
    	if($tabela == "i3geoadmin_n1")
    	{
    		$r = pegaDados("SELECT id_n2 from i3geoadmin_n2 where id_n1 ='$id'");
    		if(count($r) > 0)
    		$res = true;
    		$r = pegaDados("SELECT id_raiz from i3geoadmin_raiz where nivel='1' and id_nivel ='$id'");
    		if(count($r) > 0)
    		$res = true;
    	}
    	if($tabela == "mapfiles")
    	{
    		$r = pegaDados("SELECT id_tema from i3geoadmin_n3 where id_tema ='$id'");
    		if(count($r) > 0)
   			$res = true;
    	}
    	return $res;
	}
	catch (PDOException $e)
	{
    	return "Error!: " . $e->getMessage();
	}
}
/*
Function: resolveAcentos

Converte uma string para uma codificação de caracteres determinada

Parametros:

palavra {string} - palavra a ser convertida

tipo {string} - ISO|UTF

Retorno:

{string}
*/
function resolveAcentos($palavra,$tipo)
{
	if($tipo == "ISO")
	{
		$palavra = mb_convert_encoding($palavra,"AUTO","ISO-8859-1");
	}
	if($tipo == "UTF")
	{
		$palavra = mb_convert_encoding($palavra,"AUTO","UTF-8");
	}
	if($tipo == "html")
	$palavra = htmlentities($palavra);
	if($tipo == "palno")
	$palavra = urldecode($palavra);
	return $palavra;
}
?>