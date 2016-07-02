<?php
/*
Title: arvore.php

Fun&ccedil;&otilde;es utilizadas pelo editor da &aacute;rvore de menus para processar os nós

&Eacute; utilizado nas fun&ccedil;&otilde;es em AJAX da interface de edi&ccedil;&atilde;o da &aacute;rvore de menus

Processa os relacionamentos entre menus, grupos, subgrupos e temas necess&aacute;rio para a hierarquisa&ccedil;&atilde;o dos nós da &aacute;rvore

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

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

i3geo/admin/php/arvore.php

Parametros:

O par&acirc;metro principal &eacute; "funcao", que define qual opera&ccedil;&atilde;o ser&aacute; executada, por exemplo, arvore.php?funcao=pegaGrupos.

Cada opera&ccedil;&atilde;o possu&iacute; seus próprios par&acirc;metros, que devem ser enviados tamb&eacute;m na requisi&ccedil;&atilde;o da opera&ccedil;&atilde;o.

*/
include_once(dirname(__FILE__)."/login.php");
$funcoesEdicao = array(
		"ADICIONARTEMARAIZ",
		"ADICIONARTEMARAIZGRUPO",
		"ADICIONARGRUPO",
		"ADICIONARSUBGRUPO",
		"ADICIONARTEMA",
		"ALTERARGRUPO",
		"ALTERARSUBGRUPO",
		"ALTERARTEMA",
		"ALTERARRAIZ",
		"MOVIMENTANO",
		"EXCLUIR"
);
if(in_array(strtoupper($funcao),$funcoesEdicao)){
	if(verificaOperacaoSessao("admin/html/arvore") == false){
		retornaJSON("Vc nao pode realizar essa operacao.");exit;
	}
}

if(!isset($idioma))
{
	$idioma = "pt";
}
if($idioma == "")
{
	$idioma = "pt";
}
error_reporting(0);
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
switch (strtoupper($funcao))
{
	/*
	Note:

	Valores que o par&acirc;metro &funcao pode receber. Os par&acirc;metros devem ser enviados na requisi&ccedil;&atilde;o em AJAX.
	*/
	/*
	Valor: PEGAGRUPOS

	Grupos de um menu

	Parametro:

	id_menu {string}

	Retorno:

	{JSON}
	*/
	case "PEGAGRUPOS":
		require_once("classe_arvore.php");
		$arvore = new Arvore($locaplic,$idioma);
		$grupos = $arvore->pegaGruposMenu($id_menu);
		unset($arvore);
		retornaJSON($grupos);
		exit;
		break;
		/*
		Valor: PEGASUBGRUPOS

		Subgrupos de um grupo

		Parametros:

		id_menu {string}

		id_n1 {string} - id do gupo

		Retorno:

		[JSON}
		*/
	case "PEGASUBGRUPOS":
		require_once("classe_arvore.php");
		$arvore = new Arvore($locaplic,$idioma);
		$sgrupos = $arvore->pegaSubgruposGrupo($id_menu,$id_n1);
		unset($arvore);
		retornaJSON($sgrupos);
		exit;
		break;
		/*
		Valor: PEGATEMAS

		Temas de um subgrupo

		Parametro:

		id_n2 {string} - id do subgupo

		Retorno:

		{JSON}
		*/
	case "PEGATEMAS":
		require_once("classe_arvore.php");
		$arvore = new Arvore($locaplic,$idioma);
		$temas = $arvore->pegaTemasSubGrupo($id_n2);
		unset($arvore);
		retornaJSON($temas);
		exit;
		break;
		/*
		Valor: PEGADADOSGRUPO

		Dados de um grupo

		Parametro:

		id {string} - id do grupo

		Retorno:

		{JSON}
		*/
	case "PEGADADOSGRUPO":
		retornaJSON(pegaDados("select * from ".$esquemaadmin."i3geoadmin_n1 LEFT JOIN ".$esquemaadmin."i3geoadmin_grupos ON i3geoadmin_n1.id_grupo = i3geoadmin_grupos.id_grupo where id_n1 = $id"));
		exit;
		break;
		/*
		Valor: PEGADADOSSUBGRUPO

		Dados de um subgrupo

		Parametro:

		id {string} - id do subgrupo

		Retorno:

		{JSON}
		*/
	case "PEGADADOSSUBGRUPO":
		retornaJSON(pegaDados("select * from ".$esquemaadmin."i3geoadmin_n2 LEFT JOIN ".$esquemaadmin."i3geoadmin_subgrupos ON i3geoadmin_n2.id_subgrupo = i3geoadmin_subgrupos.id_subgrupo where id_n2 = $id"));
		exit;
		break;
		/*
		Valor: PEGADADOSTEMA

		Dados de um tema

		Parametro:

		id {string} - id do tema

		Retorno:

		{JSON}
		*/
	case "PEGADADOSTEMA":
		retornaJSON(pegaDados("select * from ".$esquemaadmin."i3geoadmin_n3 LEFT JOIN ".$esquemaadmin."i3geoadmin_temas ON i3geoadmin_n3.id_tema = i3geoadmin_temas.id_tema where id_n3 = $id"));
		exit;
		break;
		/*
		Valor: PEGADADOSRAIZ

		Dados dos temas registrados em uma raiz (grupo ou menu)

		Parametro:

		id {string} - id da raiz

		Retorno:

		{JSON}
		*/
	case "PEGADADOSRAIZ":
		retornaJSON(pegaDados("select * from ".$esquemaadmin."i3geoadmin_raiz LEFT JOIN ".$esquemaadmin."i3geoadmin_temas ON i3geoadmin_raiz.id_tema = i3geoadmin_temas.id_tema where id_raiz = $id"));
		exit;
		break;
		/*
		Valor: ADICIONARTEMARAIZ

		Adiciona tema na raiz de um nó menu

		Retorno:

		{JSON}
		*/
	case "ADICIONARTEMARAIZ":
		$id_nivel = 0;
		$nivel = 0;
		$id_raiz = alterarRaiz();
		if($idioma == "pt")
		{
			$coluna = "nome_tema";
		}
		else
		{$coluna = $idioma;
		}
		$raiz = pegaDados("select i3geoadmin_raiz.id_raiz,$coluna as nome_tema from ".$esquemaadmin."i3geoadmin_raiz LEFT JOIN ".$esquemaadmin."i3geoadmin_temas ON  i3geoadmin_temas.id_tema = i3geoadmin_raiz.id_tema where i3geoadmin_raiz.id_raiz = '$id_raiz'");
		retornaJSON(array("raiz"=>$raiz,"grupos"=>array()));
		exit;
		break;
		/*
		Valor: ADICIONARTEMARAIZGRUPO

		Adiciona tema na raiz de um nó grupo

		Parametros:

		id_n1 - id do grupo

		Retorno:

		{JSON}
		*/
	case "ADICIONARTEMARAIZGRUPO":
		$id_nivel = $id_n1;
		$nivel = 1;
		$id_raiz = alterarRaiz();
		if($idioma == "pt")
		{
			$coluna = "nome_tema";
		}
		else
		{$coluna = $idioma;
		}
		$raiz = pegaDados("select i3geoadmin_raiz.id_raiz,$coluna as nome_tema from ".$esquemaadmin."i3geoadmin_raiz LEFT JOIN ".$esquemaadmin."i3geoadmin_temas ON  i3geoadmin_temas.id_tema = i3geoadmin_raiz.id_tema where i3geoadmin_raiz.id_raiz = '$id_raiz'");
		retornaJSON(array("raiz"=>$raiz,"grupos"=>array()));
		exit;
		break;
		/*
		Valor: ADICIONARGRUPO

		Adiciona um novo grupo em um nó

		Parametros:

		id_menu - id do menu

		Retorno:

		{JSON}
		*/
	case "ADICIONARGRUPO":
		$id_n1 = alteraN1();
		if($idioma == "pt"){
			$coluna = "nome_grupo";
		}
		else{
			$coluna = $idioma;
		}
		$grupos = pegaDados("select i3geoadmin_grupos.$coluna as nome_grupo,id_n1,i3geoadmin_n1.publicado from ".$esquemaadmin."i3geoadmin_n1 LEFT JOIN ".$esquemaadmin."i3geoadmin_grupos ON i3geoadmin_n1.id_grupo = i3geoadmin_grupos.id_grupo where id_menu='$id_menu' and id_n1 = '$id_n1'");
		$raiz = array();
		retornaJSON(array("raiz"=>$raiz,"grupos"=>$grupos));
		exit;
		break;
		/*
		Valor: ADICIONARSUBGRUPO

		Adiciona um novo subgrupo em um nó

		Parametros:

		id_n2 - id do nó

		Retorno:

		{JSON}
		*/
	case "ADICIONARSUBGRUPO":
		$id_n2 = alteraN2();
		if($idioma == "pt")
		{
			$coluna = "nome_subgrupo";
		}
		else
		{$coluna = $idioma;
		}
		$subgrupos = pegaDados("select i3geoadmin_subgrupos.$coluna as nome_subgrupo,i3geoadmin_n2.id_n2,i3geoadmin_n2.publicado from ".$esquemaadmin."i3geoadmin_n2 LEFT JOIN ".$esquemaadmin."i3geoadmin_subgrupos ON i3geoadmin_n2.id_subgrupo = i3geoadmin_subgrupos.id_subgrupo where i3geoadmin_n2.id_n2='$id_n2'");
		$raiz = array();
		retornaJSON(array("raiz"=>$raiz,"subgrupos"=>$subgrupos));
		exit;
		break;
		/*
		Valor: ADICIONARTEMA

		Adiciona um novo tema em um nó de um subgrupo

		Parametros:

		id_n3 - id do nó

		Retorno:

		{JSON}
		*/
	case "ADICIONARTEMA":
		$id_n3 = alteraN3();
		if($idioma == "pt")
		{
			$coluna = "nome_tema";
		}
		else
		{$coluna = $idioma;
		}
		$temas = pegaDados("select i3geoadmin_temas.$coluna as nome_tema,i3geoadmin_n3.id_n3,i3geoadmin_n3.publicado from ".$esquemaadmin."i3geoadmin_n3 LEFT JOIN ".$esquemaadmin."i3geoadmin_temas ON i3geoadmin_n3.id_tema = i3geoadmin_temas.id_tema where i3geoadmin_n3.id_n3='$id_n3'");
		$raiz = array();
		retornaJSON($temas);
		exit;
		break;
		/*
		Valor: ALTERARGRUPO

		Altera o registro de um grupo

		Parametros:

		publicado - status do grupo

		n1_perfil

		id_grupo

		id - código do nó (id_n1)

		id_menu

		Retorno:

		{JSON}
		*/
	case "ALTERARGRUPO":
		//verifica se um novo grupo deve ser adicionado no banco de dados
		if(!empty($nomeNovoGrupo)){
			include_once(dirname(__FILE__)."/menutemas.php");
			$id_grupo = "";
			$nome_grupo = $nomeNovoGrupo;
			$id_grupo = alteraGrupos();
		}
		retornaJSON(alteraN1());
		exit;
		break;
		/*
		Valor: ALTERARSUBGRUPO

		Altera o registro de um subgrupo

		Parametros:

		publicado - status do subgrupo

		n2_perfil

		id_subgrupo

		id - código do nó (id_n2)

		id_n1 - código do nó (id_n1)

		Retorno:

		{JSON}
		*/
	case "ALTERARSUBGRUPO":
		//verifica se um novo sub-grupo deve ser adicionado no banco de dados
		if(!empty($nomeNovoSubGrupo)){
			include_once(dirname(__FILE__)."/menutemas.php");
			$id_subgrupo = "";
			$nome_subgrupo = $nomeNovoSubGrupo;
			$id_subgrupo = alteraSubGrupos();
		}
		retornaJSON(alteraN2());
		exit;
		break;
		/*
		Valor: ALTERARTEMA

		Altera o registro de um tema

		Parametros:

		publicado - status do tema

		n3_perfil

		id_tema

		id - código do nó (id_n3)

		id_n2 - código do nó (id_n2)

		Retorno:

		{JSON}
		*/
	case "ALTERARTEMA":
		retornaJSON(alteraN3());
		exit;
		break;
		/*
		Valor: ALTERARRAIZ

		Altera o registro de um tema na raiz de um menu ou grupo

		Parametros:

		publicado - status do tema

		perfil

		id_tema

		id_menu

		id - código do nó (id_raiz)

		id_nivel

		nivel - n&iacute;vel da raiz

		Retorno:

		{JSON}
		*/
	case "ALTERARRAIZ":
		retornaJSON(alterarRaiz());
		exit;
		break;
		/*
		Valor: MOVIMENTANO

		Muda a ordem de um nó

		Parametros:

		tipo - tipo de nó grupo|subgrupo|tema|raizgrupo

		movimento - sobe|desce

		id- id do nó

		Retorno:

		{JSON}
		*/
	case "MOVIMENTANO":
		movimentaNo();
		retornaJSON("ok");
		exit;
		break;
		/*
		Valor: EXCLUIR

		Exclui um registro

		Parametros:

		tabela

		coluna

		id

		Retorno:

		{JSON}
		*/
	case "EXCLUIR";
		if($tabela == "i3geoadmin_raiz")
		{
			$coluna = "id_raiz";
		}
		if($tabela == "i3geoadmin_n3")
		{
			$coluna = "id_n3";
		}
		if($tabela == "i3geoadmin_n2")
		{
			$coluna = "id_n2";
			$f = verificaFilhos();
			if($f)
			{
				retornaJSON("erro");
				exit;
			}
		}
		if($tabela == "i3geoadmin_n1")
		{
			$coluna = "id_n1";
			$f = verificaFilhos();
			if($f)
			{
				retornaJSON("erro");
				exit;
			}
		}
		retornaJSON(
			exclui($esquemaadmin.$tabela,$coluna,$id)
		);
		exit;
	break;
}
/*
Altera o registro de um n&iacute;vel 3 (temas)
*/
function alteraN3(){
	global $publicado,$n3_perfil,$id,$id_n2,$id_tema,$ordem,$esquemaadmin;
	try	{
		require_once("conexao.php");
		if($id != ""){
			$dataCol = array(
				"ordem" => $ordem,
				"publicado" => $publicado,
				"id_tema" => $id_tema,
				"n3_perfil" => $n3_perfil
			);
			i3GeoAdminUpdate($dbhw,"i3geoadmin_n3",$dataCol,"WHERE id_n3 = $id");
			$retorna = $id;
		}
		else{
			$o = $dbh->query("SELECT MAX(ordem) as o FROM ".$esquemaadmin."i3geoadmin_n3 where id_n2 = '$id_n2'");
			$o = $o->fetchAll();
			$o = $o[0]['o'] + 1;
			$dataCol = array(
				"id_n2" => $id_n2,
				"publicado" => 'NAO',
				"ordem" => $o,
				"n3_perfil" => ''
			);
			$retorna = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_n3",$dataCol,"n3_perfil","id_n3");
		}
		$dbhw = null;
		$dbh = null;
		return $retorna;
	}
	catch (PDOException $e){
		return "Error!: ";
	}
}
/*
Altera o registro de um n&iacute;vel 2
*/
function alteraN2(){
	global $publicado,$n2_perfil,$id,$id_subgrupo,$id_n1,$esquemaadmin;
	try	{
		require("conexao.php");
		if($id != ""){
			$dataCol = array(
				"publicado" => $publicado,
				"id_subgrupo" => $id_subgrupo,
				"n2_perfil" => $n2_perfil
			);
			i3GeoAdminUpdate($dbhw,"i3geoadmin_n2",$dataCol,"WHERE id_n2 = $id");
			$retorna = $id;
		}
		else{
			$o = $dbh->query("SELECT MAX(ordem) as o FROM ".$esquemaadmin."i3geoadmin_n2 where id_n1 = '$id_n1'");
			$o = $o->fetchAll();
			$o = $o[0]['o'] + 1;
			$dataCol = array(
					"id_n1" => $id_n1,
					"publicado" => 'NAO',
					"ordem" => $o,
					"n2_perfil" => ''
			);
			$retorna = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_n2",$dataCol,"n2_perfil","id_n2");
		}
		$dbhw = null;
		$dbh = null;
		return $retorna;
	}
	catch (PDOException $e){
		return "Error!: ";
	}
}
/*
Altera o registro de um n&iacute;vel 1 (grupos)
*/
function alteraN1(){
	global $publicado,$n1_perfil,$id_grupo,$id,$id_menu,$esquemaadmin;
	try{
		require("conexao.php");
		if($id != ""){
			$dataCol = array(
					"publicado" => $publicado,
					"id_grupo" => $id_grupo,
					"n1_perfil" => $n1_perfil
			);
			i3GeoAdminUpdate($dbhw,"i3geoadmin_n1",$dataCol,"WHERE id_n1 = $id");
			$retorna = $id;
		}
		else{
			$o = $dbh->query("SELECT MAX(ordem) as o FROM ".$esquemaadmin."i3geoadmin_n1 where id_menu = '$id_menu'");
			$o = $o->fetchAll();
			$o = $o[0]['o'] + 1;
			$dataCol = array(
					"id_menu" => $id_menu,
					"publicado" => 'NAO',
					"ordem" => $o,
					"n1_perfil" => ''
			);
			$retorna = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_n1",$dataCol,"n1_perfil","id_n1");
		}
		$dbhw = null;
		$dbh = null;
		return $retorna;
	}
	catch (PDOException $e){
		return "Error!: ";
	}
}
/*
Altera o registro na raiz de um n&iacute;vel
*/
function alterarRaiz()
{
	global $id_nivel,$nivel,$id,$id_menu,$perfil,$id_tema,$esquemaadmin;
	try{
		include("conexao.php");
		if($id != ""){
			$dataCol = array(
					"id_tema" => $id_tema,
					"perfil" => $perfil
			);
			i3GeoAdminUpdate($dbhw,"i3geoadmin_raiz",$dataCol,"WHERE id_raiz = $id");
			$retorna = $id;
		}
		else{
			$o = $dbh->query("SELECT MAX(ordem) as o FROM ".$esquemaadmin."i3geoadmin_raiz where id_menu = '$id_menu' and nivel = '$nivel' and id_nivel = '$id_nivel'");
			$o = $o->fetchAll();
			$o = $o[0]['o'] + 1;
			$dataCol = array(
					"id_menu" => $id_menu,
					"id_nivel" => $id_nivel,
					"nivel" => $nivel,
					"ordem" => $o,
					"perfil" => ''
			);
			$retorna = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_raiz",$dataCol,"perfil","id_raiz");
		}
		$dbhw = null;
		$dbh = null;
		return $retorna;
	}
	catch (PDOException $e)
	{
		return "Error!: ";
	}
}
function movimentaNo(){
	global $tipo,$movimento,$id,$esquemaadmin;
	if($tipo == "raizmenu" || $tipo == "raizgrupo")
	{
		//pega a ordem atual
		$reg = pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_raiz where id_raiz = '$id'");
		$ordematual = $reg[0]["ordem"];
		$idmenu = $reg[0]["id_menu"];
		$nivel = $reg[0]["nivel"];
		$idnivel = $reg[0]["id_nivel"];
		$where = "id_menu = '$idmenu' and nivel = '$nivel' and id_nivel = '$idnivel' ";
		$posfixo = "raiz";
		$tabela = "raiz";
	}

	if($tipo == "grupo")
	{
		//pega a ordem atual
		$reg = pegaDados("SELECT ordem,id_menu from ".$esquemaadmin."i3geoadmin_n1 where id_n1 = '$id'");
		$ordematual = $reg[0]["ordem"];
		$idbase = $reg[0]["id_menu"];
		$colunaBate = "id_menu";
		$where = "$colunaBate = '$idbase' ";
		$posfixo = "n1";
		$tabela = "n1";
	}
	if($tipo == "subgrupo")
	{
		//pega a ordem atual
		$reg = pegaDados("SELECT ordem,id_n1 from ".$esquemaadmin."i3geoadmin_n2 where id_n2 = '$id'");
		$ordematual = $reg[0]["ordem"];
		$idbase = $reg[0]["id_n1"];
		$colunaBate = "id_n1";
		$where = "$colunaBate = '$idbase' ";
		$posfixo = "n2";
		$tabela = "n2";
	}
	if($tipo == "tema")
	{
		//pega a ordem atual
		$reg = pegaDados("SELECT ordem,id_n2 from ".$esquemaadmin."i3geoadmin_n3 where id_n3 = '$id'");
		$ordematual = $reg[0]["ordem"];
		$idbase = $reg[0]["id_n2"];
		$colunaBate = "id_n2";
		$where = "$colunaBate = '$idbase' ";
		$posfixo = "n3";
		$tabela = "n3";
	}
	include("conexao.php");
	if($movimento == "sobe"){
		if ($ordematual > 1){
			$menos = $ordematual - 1;
			$dataCol = array(
				"ordem" => $ordematual
			);
			i3GeoAdminUpdate($dbhw,"i3geoadmin_".$tabela,$dataCol,"WHERE $where AND ordem = '$menos'");
			$dataCol = array(
				"ordem" => $menos
			);
			i3GeoAdminUpdate($dbhw,"i3geoadmin_".$tabela,$dataCol," where id_$posfixo = '$id'");
		}
	}
	if($movimento == "desce"){
		$mais = $ordematual + 1;
		$dataCol = array(
			"ordem" => $ordematual
		);
		i3GeoAdminUpdate($dbhw,"i3geoadmin_".$tabela,$dataCol,"WHERE $where AND ordem = '$mais'");
		$dataCol = array(
			"ordem" => $mais
		);
		i3GeoAdminUpdate($dbhw,"i3geoadmin_".$tabela,$dataCol," where id_$posfixo = '$id'");
	}
	$dbhw = null;
	$dbh = null;
	return "ok";
}
?>