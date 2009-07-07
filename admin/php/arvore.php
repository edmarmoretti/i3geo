<?php
/*
Title: Arvore

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

File: i3geo/admin/arvore.php

19/6/2007

*/
require_once("admin.php");
error_reporting(0);
//faz a busca da função que deve ser executada
switch ($funcao)
{
	case "pegaGrupos":
		require_once("classe_arvore.php");
		$arvore = new Arvore($locaplic);
		$grupos = $arvore->pegaGruposMenu($id_menu);
		unset($arvore);
		retornaJSON($grupos);
		exit;
	break;
	case "pegaSubGrupos":
		require_once("classe_arvore.php");
		$arvore = new Arvore($locaplic);
		$sgrupos = $arvore->pegaSubgruposGrupo($id_menu,$id_n1);
		unset($arvore);
		retornaJSON($sgrupos);
		exit;		
	break;
	case "pegaTemas":
		require_once("classe_arvore.php");
		$arvore = new Arvore($locaplic);
		$temas = $arvore->pegaTemasSubGrupo($id_n2);
		unset($arvore);
		retornaJSON($temas);
		exit;
	break;

	case "pegaDadosGrupo":
		retornaJSON(pegaDados("select * from i3geoadmin_n1 LEFT JOIN i3geoadmin_grupos ON i3geoadmin_n1.id_grupo = i3geoadmin_grupos.id_grupo where id_n1 = $id"));
		exit;
	break;
	case "pegaDadosSubGrupo":
		retornaJSON(pegaDados("select * from i3geoadmin_n2 LEFT JOIN i3geoadmin_subgrupos ON i3geoadmin_n2.id_subgrupo = i3geoadmin_subgrupos.id_subgrupo where id_n2 = $id"));
		exit;
	break;
	case "pegaDadosTema":
		retornaJSON(pegaDados("select * from i3geoadmin_n3 LEFT JOIN i3geoadmin_temas ON i3geoadmin_n3.id_tema = i3geoadmin_temas.id_tema where id_n3 = $id"));
		exit;
	break;
	case "pegaDadosRaiz":
		retornaJSON(pegaDados("select * from i3geoadmin_raiz LEFT JOIN i3geoadmin_temas ON i3geoadmin_raiz.id_tema = i3geoadmin_temas.id_tema where id_raiz = $id"));
		exit;
	break;


	case "adicionarTemaRaiz":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		$id_nivel = 0;
		$nivel = 0;
		$id_raiz = alterarRaiz();
		$raiz = pegaDados("select i3geoadmin_raiz.id_raiz,nome_tema from i3geoadmin_raiz LEFT JOIN i3geoadmin_temas ON  i3geoadmin_temas.id_tema = i3geoadmin_raiz.id_tema where i3geoadmin_raiz.id_raiz = '$id_raiz'");
		retornaJSON(array("raiz"=>$raiz,"grupos"=>array()));
		exit;
	break;
	case "adicionarTemaRaizGrupo":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		$id_nivel = $id_n1;
		$nivel = 1;
		$id_raiz = alterarRaiz();
		$raiz = pegaDados("select i3geoadmin_raiz.id_raiz,nome_tema from i3geoadmin_raiz LEFT JOIN i3geoadmin_temas ON  i3geoadmin_temas.id_tema = i3geoadmin_raiz.id_tema where i3geoadmin_raiz.id_raiz = '$id_raiz'");
		retornaJSON(array("raiz"=>$raiz,"grupos"=>array()));
		exit;
	break;	
	case "adicionarGrupo":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		$id_n1 = alteraN1();
		$grupos = pegaDados("select i3geoadmin_grupos.nome_grupo,id_n1,i3geoadmin_n1.publicado from i3geoadmin_n1 LEFT JOIN i3geoadmin_grupos ON i3geoadmin_n1.id_grupo = i3geoadmin_grupos.id_grupo where id_menu='$id_menu' and id_n1 = '$id_n1'");
		$raiz = array();
		retornaJSON(array("raiz"=>$raiz,"grupos"=>$grupos));
		exit;
	break;	
	case "adicionarSubGrupo":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		$id_n2 = alteraN2();
		$subgrupos = pegaDados("select i3geoadmin_subgrupos.nome_subgrupo,i3geoadmin_n2.id_n2,i3geoadmin_n2.publicado from i3geoadmin_n2 LEFT JOIN i3geoadmin_subgrupos ON i3geoadmin_n2.id_subgrupo = i3geoadmin_subgrupos.id_subgrupo where i3geoadmin_n2.id_n2='$id_n2'");
		$raiz = array();
		retornaJSON(array("raiz"=>$raiz,"subgrupos"=>$subgrupos));
		exit;
	break;	
	case "adicionarTema":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		$id_n3 = alteraN3();
		$temas = pegaDados("select i3geoadmin_temas.nome_tema,i3geoadmin_n3.id_n3,i3geoadmin_n3.publicado from i3geoadmin_n3 LEFT JOIN i3geoadmin_temas ON i3geoadmin_n3.id_tema = i3geoadmin_temas.id_tema where i3geoadmin_n3.id_n3='$id_n3'");
		$raiz = array();
		retornaJSON($temas);
		exit;
	break;	
	case "alterarGrupo":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		retornaJSON(alteraN1());
		exit;
	break;
	case "alterarSubGrupo":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		retornaJSON(alteraN2());
		exit;
	break;
	case "alterarTema":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		retornaJSON(alteraN3());
		exit;
	break;
	case "alterarRaiz":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		retornaJSON(alterarRaiz());
		exit;
	break;
	case "movimentaNo":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		movimentaNo();	
		retornaJSON("ok");
		exit;
	break;
	case "excluir";
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
Function: alteraN3

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
    		$dbhw->query("INSERT INTO i3geoadmin_n3 (publicado,id_n2,n3_perfil,ordem,id_tema) VALUES ('NAO',$id_n2,'',$o,$idtemp)");
			$id = $dbh->query("SELECT id_n3 FROM i3geoadmin_n3 where id_tema = '$idtemp'");
			$id = $id->fetchAll();
			$id = $id[0]['id_n3'];
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
Function: alteraN2

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
    		$dbhw->query("INSERT INTO i3geoadmin_n2 (id_n1,n2_perfil,ordem,publicado,id_subgrupo) VALUES ($id_n1,'',$o,'NAO',$idtemp)");
			$id = $dbh->query("SELECT id_n2 FROM i3geoadmin_n2 where id_subgrupo = '$idtemp'");
			$id = $id->fetchAll();
			$id = $id[0]['id_n2'];
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
Function: alteraN1

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
    		$dbhw->query("INSERT INTO i3geoadmin_n1 (id_menu,n1_perfil,ordem,publicado,id_grupo) VALUES ($id_menu,'',$o,'NAO',$idtemp)");
			$id = $dbh->query("SELECT id_n1 FROM i3geoadmin_n1 where id_grupo = '$idtemp'");
			$id = $id->fetchAll();
			$id = $id[0]['id_n1'];
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
Function: alterarRaiz

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
    		$dbhw->query("INSERT INTO i3geoadmin_raiz (id_nivel,nivel,id_menu,perfil,ordem) VALUES ($id_nivel,$nivel,$id_menu,'',$o)");
			$id = $dbh->query("SELECT id_raiz FROM i3geoadmin_raiz");
			$id = $id->fetchAll();
			$id = intval($id[count($id)-1]['id_raiz']);
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
			echo "UPDATE i3geoadmin_$tabela SET 'ordem' = $ordematual where $where and ordem = '$menos'";
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