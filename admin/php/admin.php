<?php
/*
Title: Funções gerais

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

File: i3geo/admin/mapfiles.php

19/6/2007

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
//if(isset($funcao) && $funcao != "verificaEditores")
//{if(verificaEditores($editores) == "nao"){echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php (variavel \$editores) podem acessar o sistema de administracao.";exit;}}
if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
{
	$mapfile = "geral1windows";
}
else
{
	$mapfile = "geral1";
}
if(isset($funcao) && $funcao == "limpar")
{
	$tabelas = array("i3geoadmin_atlas","i3geoadmin_atlasp","i3geoadmin_atlast","i3geoadmin_grupos","i3geoadmin_identifica","i3geoadmin_mapas","i3geoadmin_menus","i3geoadmin_n1","i3geoadmin_n2","i3geoadmin_n3","i3geoadmin_raiz","i3geoadmin_sistemas","i3geoadmin_sistemasf","i3geoadmin_subgrupos","i3geoadmin_tags","i3geoadmin_temas","i3geoadmin_ws");
	include("conexao.php");
	foreach($tabelas as $t)
	{
    	$dbhw->query("DELETE from $t");
	}
    $dbhw = null;
    $dbh = null;
    exit;
}
function retornaJSON($obj)
{
	global $locaplic;
	//
	//para os casos em que json não está habilitado
	//
	//if (!function_exists("json_encode"))
	//{
		include_once($locaplic."/pacotes/cpaint/JSON/json2.php");
		error_reporting(0);
		$j = new Services_JSON();
		$texto = $j->encode($obj);
		if (!mb_detect_encoding($texto,"UTF-8",true))
		$texto = utf8_encode($texto);
		header("Content-type: text/ascii; charset=UTF-8");
		echo $texto;
	/*
	}
	else
	{
		if(extension_loaded('zlib')){ob_start('ob_gzhandler');}
		$texto = json_encode($obj);
		if (mb_detect_encoding($texto,"UTF-8",false)!="UTF-8")
		{
			$texto = utf8_encode($texto);
		}
		//header("Content-type: application/ascii");
		//header("Content-type: text/ascii; charset=UTF-8");
		echo $texto;
		if(extension_loaded('zlib')){ob_end_flush();}
	}
	*/
	exit;
}
function verificaDuplicados($sql,$dbh)
{
	$res = $dbh->query($sql,PDO::FETCH_ASSOC);
	if(count($res->fetchAll())>0)
	return true;
	else
	return false;
}
/*
Function: verificaEditores

Verifica se o usuário atual está cadastrado como editor

Parameters:

editores - array com a lista de editores obtido do ms_configura.php

Return:

string - sim|nao
*/
function verificaEditores($editores)
{
	$editor = "nao";
	if($editores == ""){return $editor;}
	foreach ($editores as $e)
	{
		//$e = gethostbyname($e);
		$ip = "UNKNOWN";
		if (getenv("HTTP_CLIENT_IP")) $ip = getenv("HTTP_CLIENT_IP");
		else if(getenv("HTTP_X_FORWARDED_FOR")) $ip = getenv("HTTP_X_FORWARDED_FOR");
		else if(getenv("REMOTE_ADDR")) $ip = getenv("REMOTE_ADDR");
		else $ip = "UNKNOWN";
		if ($e == $ip){$editor="sim";}
	}
	return $editor;
}
/*
Function: exclui

Exlcui um registro de uma tabela
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
   	//var_dump($q);
   	if($q)
   	{
   		$resultado = $q->fetchAll();
   		$dbh = null;
   		$dbhw = null;
   		//error_reporting(0);
   		return $resultado;
   	}
   	else
   	{
    	$e = $dbh->errorInfo();
    	echo " erro: ".$e[2];
    	//echo $sql;
   		return;
   	}
}
/*
Function: verificaFilhos

Verifica se o pai tem filhos
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