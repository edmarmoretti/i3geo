<?php
/*
Title: arvore.php

Funções utilizadas pelo editor da árvore de menus para processar os nós

É utilizado nas funções em AJAX da interface de edição da árvore de menus

Processa os relacionamentos entre menus, grupos, subgrupos e temas necessário para a hierarquisação dos nós da árvore

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

i3geo/admin/php/arvore.php

Parametros:

O parâmetro principal é "funcao", que define qual operação será executada, por exemplo, arvore.php?funcao=pegaGrupos.

Cada operação possuí seus próprios parâmetros, que devem ser enviados também na requisição da operação.

*/
require_once("admin.php");
if(!isset($idioma))
{$idioma = "pt";}
if($idioma == "")
{$idioma = "pt";}
error_reporting(0);
//faz a busca da função que deve ser executada
switch (strtoupper($funcao))
{
	/*
	Note:
	
	Valores que o parâmetro &funcao pode receber. Os parâmetros devem ser enviados na requisição em AJAX.
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
		retornaJSON(pegaDados("select * from i3geoadmin_n1 LEFT JOIN i3geoadmin_grupos ON i3geoadmin_n1.id_grupo = i3geoadmin_grupos.id_grupo where id_n1 = $id"));
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
		retornaJSON(pegaDados("select * from i3geoadmin_n2 LEFT JOIN i3geoadmin_subgrupos ON i3geoadmin_n2.id_subgrupo = i3geoadmin_subgrupos.id_subgrupo where id_n2 = $id"));
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
		retornaJSON(pegaDados("select * from i3geoadmin_n3 LEFT JOIN i3geoadmin_temas ON i3geoadmin_n3.id_tema = i3geoadmin_temas.id_tema where id_n3 = $id"));
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
		retornaJSON(pegaDados("select * from i3geoadmin_raiz LEFT JOIN i3geoadmin_temas ON i3geoadmin_raiz.id_tema = i3geoadmin_temas.id_tema where id_raiz = $id"));
		exit;
	break;
	/*
	Valor: ADICIONARTEMARAIZ
	
	Adiciona tema na raiz de um nó menu
	
	Retorno:
	
	{JSON}
	*/		
	case "ADICIONARTEMARAIZ":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		$id_nivel = 0;
		$nivel = 0;
		$id_raiz = alterarRaiz();
		if($idioma == "pt")
		{$coluna = "nome_tema";}
		else
		{$coluna = $idioma;}
		$raiz = pegaDados("select i3geoadmin_raiz.id_raiz,$coluna as nome_tema from i3geoadmin_raiz LEFT JOIN i3geoadmin_temas ON  i3geoadmin_temas.id_tema = i3geoadmin_raiz.id_tema where i3geoadmin_raiz.id_raiz = '$id_raiz'");
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
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		$id_nivel = $id_n1;
		$nivel = 1;
		$id_raiz = alterarRaiz();
		if($idioma == "pt")
		{$coluna = "nome_tema";}
		else
		{$coluna = $idioma;}		
		$raiz = pegaDados("select i3geoadmin_raiz.id_raiz,$coluna as nome_tema from i3geoadmin_raiz LEFT JOIN i3geoadmin_temas ON  i3geoadmin_temas.id_tema = i3geoadmin_raiz.id_tema where i3geoadmin_raiz.id_raiz = '$id_raiz'");
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
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		$id_n1 = alteraN1();
		if($idioma == "pt")
		{$coluna = "nome_grupo";}
		else
		{$coluna = $idioma;}
		$grupos = pegaDados("select i3geoadmin_grupos.$coluna as nome_grupo,id_n1,i3geoadmin_n1.publicado from i3geoadmin_n1 LEFT JOIN i3geoadmin_grupos ON i3geoadmin_n1.id_grupo = i3geoadmin_grupos.id_grupo where id_menu='$id_menu' and id_n1 = '$id_n1'");
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
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		$id_n2 = alteraN2();
		if($idioma == "pt")
		{$coluna = "nome_subgrupo";}
		else
		{$coluna = $idioma;}
		$subgrupos = pegaDados("select i3geoadmin_subgrupos.$coluna as nome_subgrupo,i3geoadmin_n2.id_n2,i3geoadmin_n2.publicado from i3geoadmin_n2 LEFT JOIN i3geoadmin_subgrupos ON i3geoadmin_n2.id_subgrupo = i3geoadmin_subgrupos.id_subgrupo where i3geoadmin_n2.id_n2='$id_n2'");
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
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		$id_n3 = alteraN3();
		if($idioma == "pt")
		{$coluna = "nome_tema";}
		else
		{$coluna = $idioma;}
		$temas = pegaDados("select i3geoadmin_temas.$coluna as nome_tema,i3geoadmin_n3.id_n3,i3geoadmin_n3.publicado from i3geoadmin_n3 LEFT JOIN i3geoadmin_temas ON i3geoadmin_n3.id_tema = i3geoadmin_temas.id_tema where i3geoadmin_n3.id_n3='$id_n3'");
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
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
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
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
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
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
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
	
	nivel - nível da raiz
	
	Retorno:
	
	{JSON}
	*/
	case "ALTERARRAIZ":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
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
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
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
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
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
		retornaJSON(exclui());
		exit;
		break;
}
/*
Altera o registro de um nível 3 (temas)
*/
function alteraN3()
{
	global $publicado,$n3_perfil,$id,$id_n2,$id_tema,$ordem;
	try 
	{
    	require_once("conexao.php");
    	if($id != "")
    	{
    		$dbhw->query("UPDATE i3geoadmin_n3 SET ordem = $ordem, publicado = '$publicado',id_tema = '$id_tema', n3_perfil = '$n3_perfil' WHERE id_n3 = $id");
    		$retorna = $id;
    	}
    	else
    	{
			$o = $dbh->query("SELECT MAX(ordem) as o FROM i3geoadmin_n3 where id_n2 = '$id_n2'");
			$o = $o->fetchAll();
			$o = $o[0]['o'] + 1;
    		$idtemp = (rand (9000,10000)) * -1;
    		$dbhw->query("INSERT INTO i3geoadmin_n3 (publicado,id_n2,n3_perfil,ordem) VALUES ('NAO',$id_n2,'$idtemp',$o)");
			$id = $dbh->query("SELECT id_n3 FROM i3geoadmin_n3 where n3_perfil = '$idtemp'");
			$id = $id->fetchAll();
			$id = $id[0]['id_n3'];
    		$dbhw->query("UPDATE i3geoadmin_n3 SET n3_perfil = '' WHERE id_n3 = $id AND n3_perfil = '$idtemp'");
			$retorna = $id;
    	}
    	$dbhw = null;
    	$dbh = null;
    	return $retorna;
	}
	catch (PDOException $e)
	{return "Error!: " . $e->getMessage();}
}
/*
Altera o registro de um nível 2
*/
function alteraN2()
{
	global $publicado,$n2_perfil,$id,$id_subgrupo,$id_n1;
	try 
	{
    	require_once("conexao.php");
    	if($id != "")
    	{
    		$dbhw->query("UPDATE i3geoadmin_n2 SET publicado='$publicado', id_subgrupo = '$id_subgrupo', n2_perfil = '$n2_perfil' WHERE id_n2 = $id");
    		$retorna = $id;
    	}
    	else
    	{
			$o = $dbh->query("SELECT MAX(ordem) as o FROM i3geoadmin_n2 where id_n1 = '$id_n1'");
			$o = $o->fetchAll();
			$o = $o[0]['o'] + 1;
			$idtemp = (rand (9000,10000)) * -1;
    		$dbhw->query("INSERT INTO i3geoadmin_n2 (id_n1,n2_perfil,ordem,publicado) VALUES ($id_n1,'$idtemp',$o,'NAO')");
			$id = $dbh->query("SELECT id_n2 FROM i3geoadmin_n2 where n2_perfil = '$idtemp'");
			$id = $id->fetchAll();
			$id = $id[0]['id_n2'];
    		$dbhw->query("UPDATE i3geoadmin_n2 SET n2_perfil = '' WHERE id_n2 = $id AND n2_perfil = '$idtemp'");			
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
/*
Altera o registro de um nível 1 (grupos)
*/
function alteraN1()
{
	global $publicado,$n1_perfil,$id_grupo,$id,$id_menu;
	try 
	{
    	require_once("conexao.php");
    	if($id != "")
    	{
    		$dbhw->query("UPDATE i3geoadmin_n1 SET publicado = '$publicado', id_grupo = '$id_grupo', n1_perfil = '$n1_perfil' WHERE id_n1 = $id");
    		$retorna = $id;
    	}
    	else
    	{
			$o = $dbh->query("SELECT MAX(ordem) as o FROM i3geoadmin_n1 where id_menu = '$id_menu'");
			$o = $o->fetchAll();
			$o = $o[0]['o'] + 1;
			$idtemp = (rand (9000,10000)) * -1;
    		$dbhw->query("INSERT INTO i3geoadmin_n1 (id_menu,n1_perfil,ordem,publicado) VALUES ($id_menu,'$idtemp',$o,'NAO')");
			$id = $dbh->query("SELECT id_n1 FROM i3geoadmin_n1 where n1_perfil = '$idtemp'");
			$id = $id->fetchAll();
			$id = $id[0]['id_n1'];
    		$dbhw->query("UPDATE i3geoadmin_n1 SET n1_perfil = '' WHERE id_n1 = $id AND n1_perfil = '$idtemp'");			
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
/*
Altera o registro na raiz de um nível
*/
function alterarRaiz()
{
	global $id_nivel,$nivel,$id,$id_menu,$perfil,$id_tema;
	try 
	{
    	include("conexao.php");
    	if($id != "")
    	{
    		$dbhw->query("UPDATE i3geoadmin_raiz SET perfil = '$perfil', id_tema = '$id_tema'  WHERE id_raiz = $id");
    		$retorna = $id;
    	}
    	else
    	{
			$o = $dbh->query("SELECT MAX(ordem) as o FROM i3geoadmin_raiz where id_menu = '$id_menu' and nivel = '$nivel' and id_nivel = '$id_nivel'");
			$o = $o->fetchAll();
			$o = $o[0]['o'] + 1;
			$idtemp = (rand (9000,10000)) * -1;
    		$dbhw->query("INSERT INTO i3geoadmin_raiz (id_nivel,nivel,id_menu,perfil,ordem) VALUES ($id_nivel,$nivel,$id_menu,'$idtemp',$o)");
			$id = $dbh->query("SELECT id_raiz FROM i3geoadmin_raiz WHERE perfil = '$idtemp'");
			$id = $id->fetchAll();
			$id = $id[0]['id_raiz'];
			$dbhw->query("UPDATE i3geoadmin_raiz SET perfil = '' WHERE id_raiz = $id AND perfil = '$idtemp'");
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
function movimentaNo()
{
	global $tipo,$movimento,$id;
	if($tipo == "raizmenu" || $tipo == "raizgrupo")
	{
		//pega a ordem atual
		$reg = pegaDados("SELECT * from i3geoadmin_raiz where id_raiz = '$id'");
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
		$reg = pegaDados("SELECT ordem,id_menu from i3geoadmin_n1 where id_n1 = '$id'");
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
		$reg = pegaDados("SELECT ordem,id_n1 from i3geoadmin_n2 where id_n2 = '$id'");
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
		$reg = pegaDados("SELECT ordem,id_n2 from i3geoadmin_n3 where id_n3 = '$id'");
		$ordematual = $reg[0]["ordem"];
		$idbase = $reg[0]["id_n2"];
		$colunaBate = "id_n2";
		$where = "$colunaBate = '$idbase' ";
		$posfixo = "n3";
		$tabela = "n3";
	}
	include("conexao.php");
	if($movimento == "sobe")
	{
		if ($ordematual > 1)
		{
			$menos = $ordematual - 1;
			//echo "UPDATE i3geoadmin_$tabela SET 'ordem' = $ordematual where $where and ordem = '$menos'";
			$dbhw->query("UPDATE i3geoadmin_$tabela SET ordem = $ordematual where $where and ordem = '$menos'");
			$dbhw->query("UPDATE i3geoadmin_$tabela SET ordem = $menos where id_$posfixo = '$id'");
		}
	}	
	if($movimento == "desce")
	{
		$mais = $ordematual + 1;
		$dbhw->query("UPDATE i3geoadmin_$tabela SET ordem = $ordematual where $where and ordem = '$mais'");
		$dbhw->query("UPDATE i3geoadmin_$tabela SET ordem = $mais where id_$posfixo = '$id'");
	}	
   	$dbhw = null;
   	$dbh = null;
   	return "ok";
}
?>