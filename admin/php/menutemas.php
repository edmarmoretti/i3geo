<?php
/*
Title: Administração dos mapfiles principais

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
include_once("admin.php");
if(!isset($funcao))
{$funcao = "";}
if(!isset($idioma))
{$idioma = "pt";}
if($idioma == "")
{$idioma = "pt";}
//faz a busca da função que deve ser executada
switch ($funcao)
{
	//verifica os editores
	case "verificaEditores":
	retornaJSON(verificaEditores($editores));
	exit;
	break;
	
	case "importarXmlMenu":
	if(verificaEditores($editores) == "nao")
	{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
	retornaJSON(importarXmlMenu());
	exit;
	break;
	
	case "pegaMenus":
	if($idioma == "pt")
	{$coluna = "nome_tema";}
	else
	{$coluna = $idioma;}
	$dados = pegaDados('SELECT * from i3geoadmin_menus order by nome_menu');
	retornaJSON($dados);
	exit;
	break;

	case "pegaMenus2":
	if($idioma == "pt")
	{$coluna = "nome_menu";}
	else
	{$coluna = $idioma;}
	$dados = pegaDados("SELECT publicado_menu,perfil_menu,aberto,desc_menu,id_menu,$coluna as nome_menu from i3geoadmin_menus order by nome_menu");
	retornaJSON($dados);
	exit;
	break;

	case "pegaTags":
	$sql = "SELECT * from i3geoadmin_tags order by nome";
	retornaJSON(pegaDados($sql));
	exit;
	break;
	
	case "pegaTagsPorMapfile":
	if($idioma == "pt")
	{$coluna = "nome_tema";}
	else
	{$coluna = $idioma;}

    $q = pegaDados("select link_tema,tags_tema,codigo_tema,$coluna as nome_tema from i3geoadmin_temas");
    $temas = array();
    $temaExiste = array();
    foreach($q as $row)
	{
		$ts = html_entity_decode($row['tags_tema']);
		$i = $row['codigo_tema'];
		$nome = $row['nome_tema'];
		$link = $row['link_tema'];
		$tags = explode(" ",$ts);
		foreach($tags as $t)
		{
			if (removeAcentos($t) == $tag)
			{
				if(!isset($temaExiste[$i]))
				{
					$temas[] = array("codigoMap"=>$i,"nome"=>$nome,"link"=>$link);
					$temaExiste[$i] = 0;
				}
			}
		}
	}
	retornaJSON($temas);
	exit;
	break;	
	
	case "pegaPerfis":
	$dados = pegaDados('SELECT * from i3geoadmin_perfis order by perfil');
	if(count($dados) == 0){$dados = array("id_perfil"=>"","perfil"=>"");}
	retornaJSON($dados);
	exit;
	break;

	case "alteraMenus":
	if(verificaEditores($editores) == "nao")
	{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
	retornaJSON(alteraMenus());
	exit;
	break;

	case "pegaGrupos":
	$nome = "nome_grupo";
	if($idioma != "pt")
	{$nome = $idioma;}
	$dados = pegaDados("SELECT * from i3geoadmin_grupos order by $nome");
	retornaJSON($dados);
	exit;
	break;

	case "pegaGrupos2":
	$nome = "nome_grupo";
	if($idioma != "pt")
	{$nome = $idioma;}
	$dados = pegaDados("SELECT desc_grupo,id_grupo,$nome as 'nome_grupo' from i3geoadmin_grupos order by $nome");
	retornaJSON($dados);
	exit;
	break;

	case "alteraGrupos":
	if(verificaEditores($editores) == "nao")
	{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
	retornaJSON(alteraGrupos());
	exit;
	break;

	case "pegaSubGrupos":
	$dados = pegaDados('SELECT * from i3geoadmin_subgrupos order by nome_subgrupo');
	retornaJSON($dados);
	exit;
	break;
	
	case "pegaSubGrupos2":
	$nome = "nome_subgrupo";
	if($idioma != "pt")
	{$nome = $idioma;}
	$dados = pegaDados("SELECT desc_subgrupo,id_subgrupo,$nome as 'nome_subgrupo' from i3geoadmin_subgrupos order by nome_subgrupo");
	retornaJSON($dados);
	exit;
	break;
	
	case "alteraSubGrupos":
	if(verificaEditores($editores) == "nao")
	{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
	retornaJSON(alteraSubGrupos());
	exit;
	break;

	case "pegaTemas":
	$sql = "SELECT * from i3geoadmin_temas where id_tema = '$id_tema'";
	retornaJSON(pegaDados($sql));
	exit;
	break;
	
	case "pegaTemaPorMapfile":
	$sql = "SELECT * from i3geoadmin_temas where codigo_tema = '$codigo_tema'";
	$dados = pegaDados($sql);
	if(is_array($dados) && count($dados) == 0)
	{
		registraTema();
		$dados = pegaDados($sql);
	}
	if(is_array($dados) && count($dados) > 1)
	{$dados = "erro. Mais de um mapfile com mesmo código registrado no banco";}
	retornaJSON($dados);
	exit;
	break;	
	
	case "pegaTemas2":
	retornaJSON(pegaTemas2());
	exit;
	break;
	
	case "alteraTemas":
	//$r será igual ao novo id criado, no caso de inserção de um novo tema
	if(verificaEditores($editores) == "nao")
	{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
	$r = alteraTemas();
	if($id == "")
	retornaJSON($r);
	else
	retornaJSON(pegaDados("select * from i3geoadmin_temas where id_tema = '$id'"));
	exit;
	break;
	
	case "alteraTags":
	if(verificaEditores($editores) == "nao")
	{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
	$novo = alteraTags();
	$sql = "SELECT * from i3geoadmin_tags WHERE id_tag = '".$novo."'";
	retornaJSON(pegaDados($sql));
	exit;
	break;
	
	case "alteraPerfis":
	if(verificaEditores($editores) == "nao")
	{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
	$novo = alteraPerfis();
	$sql = "SELECT * from i3geoadmin_perfis WHERE id_perfil = '".$novo."'";
	retornaJSON(pegaDados($sql));
	exit;
	break;
	
	case "excluirRegistro":
	if(verificaEditores($editores) == "nao")
	{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
	if($tabela == "grupos")
	{
		$tabela = "i3geoadmin_grupos";
		$coluna = "id_grupo";
		$filhos = verificaFilhos();
		if($filhos)
		{
			retornaJSON("erro");
			exit;
		}	
	}
	if($tabela == "tags")
	{
		$tabela = "i3geoadmin_tags";
		$coluna = "id_tag";
		//excluiTagTemas($id);
	}
	if($tabela == "perfis")
	{
		$tabela = "i3geoadmin_perfis";
		$coluna = "id_perfil";
		excluiPerfil($id);
	}
	if($tabela == "subgrupos")
	{
		$tabela = "i3geoadmin_subgrupos";
		$coluna = "id_subgrupo";
		$filhos = verificaFilhos();
		if($filhos)
		{
			retornaJSON("erro");
			exit;
		}
	}
	if($tabela == "temas")
	{
		$tabela = "i3geoadmin_temas";
		$coluna = "id_tema";
		$filhos = verificaFilhos();
		if($filhos)
		{
			retornaJSON("erro");
			exit;
		}
	}
	if($tabela == "menus")
	{
		$tabela = "i3geoadmin_menus";
		$coluna = "id_menu";
		$filhos = verificaFilhos();
		if($filhos)
		{
			retornaJSON("erro");
			exit;
		}
	}
	retornaJSON(exclui());
	exit;
	break;
	
	case "listaMapsTemas":
	retornaJSON(listaMapsTemas());
	exit;
	break;
}
function excluiPerfil($id)
{
	require_once("conexao.php");
	$perfil = "";
    foreach($dbh->query("select * from i3geoadmin_perfis where perfil = '$id'") as $row)
    {$perfil = $row["perfil"];}
    if($perfil == "")
    {return;}
    $q = $dbh->query("select * from i3geoadmin_mapas");
	foreach($q as $row)
   	{
   		$t = $row['perfil_mapa'];
   		$i = $row['id_mapa'];
   		$ts = str_replace($perfil,"",$t);
   		if($t != $ts)
   		$dbhw->query("UPDATE i3geoadmin_mapas SET perfil_mapa = '$ts' WHERE id_mapa = $i");
   	}
   	$q = $dbh->query("select * from i3geoadmin_menus");
	foreach($q as $row)
   	{
   		$t = $row['perfil_menu'];
   		$i = $row['id_menu'];
   		$ts = str_replace($perfil,"",$t);
   		if($t != $ts)
   		$dbhw->query("UPDATE i3geoadmin_menus SET perfil_menu = '$ts' WHERE id_menu = $i");
   	}
   	$q = $dbh->query("select * from i3geoadmin_n1");
	foreach($q as $row)
   	{
   		$t = $row['perfil_n1'];
   		$i = $row['id_n1'];
   		$ts = str_replace($perfil,"",$t);
   		if($t != $ts)
   		$dbhw->query("UPDATE i3geoadmin_n1 SET perfil_n1 = '$ts' WHERE id_n1 = $i");
   	}
   	$q = $dbh->query("select * from i3geoadmin_n2");
	foreach($q as $row)
   	{
   		$t = $row['perfil_n2'];
   		$i = $row['id_n2'];
   		$ts = str_replace($perfil,"",$t);
   		if($t != $ts)
   		$dbhw->query("UPDATE i3geoadmin_n2 SET perfil_n2 = '$ts' WHERE id_n2 = $i");
   	}
   	$q = $dbh->query("select * from i3geoadmin_n3");	
	foreach($q as $row)
   	{
   		$t = $row['perfil_n3'];
   		$i = $row['id_n3'];
   		$ts = str_replace($perfil,"",$t);
   		if($t != $ts)
   		$dbhw->query("UPDATE i3geoadmin_n3 SET perfil_n3 = '$ts' WHERE id_n3 = $i");
   	}
   	$q = $dbh->query("select * from i3geoadmin_raiz");
	foreach($q as $row)
   	{
   		$t = $row['perfil'];
   		$i = $row['id_raiz'];
   		$ts = str_replace($perfil,"",$t);
   		if($t != $ts)
   		$dbhw->query("UPDATE i3geoadmin_raiz SET perfil = '$ts' WHERE id_raiz = $i");
   	}
   	$q = $dbh->query("select * from i3geoadmin_sistemasf");
	foreach($q as $row)
   	{
   		$t = $row['perfil_funcao'];
   		$i = $row['id_funcao'];
   		$ts = str_replace($perfil,"",$t);
   		if($t != $ts)
   		$dbhw->query("UPDATE i3geoadmin_sistemasf SET perfil_funcao = '$ts' WHERE id_funcao = $i");
   	}   	
}
function excluiTagTemas($id)
{
	require_once("conexao.php");
	$q1 = $dbh->query("select * from i3geoadmin_tags where id_tag = $id");
    foreach($q1 as $row)
    {$nometag = $row["nome"];}
    if($nometag == ""){return;}
    $q = $dbh->query("select * from i3geoadmin_temas");
	foreach($q as $row)
   	{
   		$t = $row['tags_tema'];
   		$i = $row['id_tema'];
   		$ts = str_replace($nometag,"",$t);
   		if($t != $ts)
   		$dbhw->query("UPDATE i3geoadmin_temas SET tags_tema = '$ts' WHERE id_tema = $i");
   	}			
}
/*
Function: pegaTemas

Pega a lista de temas

Parameters:

filtro - texto para filtrar os dados
*/
function pegaTemas()
{
	global $filtro;
	try 
	{
    	$resultado = array();
    	require_once("conexao.php");
    	foreach($dbh->query('SELECT * from i3geoadmin_temas order by nome_tema') as $row)
    	{
        	$continua = true;
        	if(isset($filtro) && $filtro != "")
        	{
        		$continua = false;
        		if ($row['codigo_tema'] == $filtro)
        		{$continua = true;}
        		$testanome = mb_convert_encoding($filtro,"UTF-8","ISO-8859-1");
        		if (!stristr($row['nome_tema'],$testanome) === FALSE)
        		{$continua = true;}
        		if (!stristr($row['tags_tema'],$testanome) === FALSE)
        		{$continua = true;}
        	}
        	if($row['codigo_tema'] == ""){$continua = true;}
        	if ($continua)
        	$resultado[] = array(
				"nome_tema"=>$row['nome_tema'],
				"codigo_tema"=>$row['codigo_tema'],
				"id_tema"=>$row['id_tema'],
				"desc_tema"=>$row['desc_tema'],
				"link_tema"=>$row['link_tema'],
				"tipoa_tema"=>$row['tipoa_tema'],
				"download_tema"=>$row['download_tema'],
				"ogc_tema"=>$row['ogc_tema'],
				"kml_tema"=>$row['kml_tema'],
				"kmz_tema"=>$row['kmz_tema'],
				"tags_tema"=>$row['tags_tema']
				);
    	}
    	$dbh = null;
    	$dbh = null;
    	return $resultado;
	}
	catch (PDOException $e)
	{
    	return "Error!: " . $e->getMessage();
	}
}
function pegaTemas2()
{
	global $filtro;
	try 
	{
    	$resultado = array();
    	require_once("conexao.php");
    	foreach($dbh->query('SELECT codigo_tema,nome_tema,id_tema from i3geoadmin_temas order by nome_tema') as $row)
    	{
        	$continua = true;
        	if(isset($filtro) && $filtro != "")
        	{
        		$continua = false;
        		if ($row['codigo_tema'] == $filtro)
        		{$continua = true;}
        		$testanome = mb_convert_encoding($filtro,"UTF-8","ISO-8859-1");
        		if (!stristr($row['nome_tema'],$testanome) === FALSE)
        		{$continua = true;}
        	}
        	if($row['codigo_tema'] == ""){$continua = true;}
        	if ($continua)
        	$resultado[] = array(
				"nome_tema"=>$row['nome_tema'],
				"codigo_tema"=>$row['codigo_tema'],
				"id_tema"=>$row['id_tema']
				);
    	}
    	$dbh = null;
    	$dbh = null;
    	return $resultado;
	}
	catch (PDOException $e)
	{
    	return "Error!: " . $e->getMessage();
	}
}
/*
Function: alteraMenus

Altera o registro de um menu. Se id for vazio acrescenta o registro
*/
function alteraMenus()
{
	global $nome,$desc,$id,$aberto,$perfil,$publicado_menu,$en,$es,$it;
	try 
	{
		$retorna = "";
    	include("conexao.php");
		if($convUTF)
		{
			$nome = utf8_encode($nome);
			$desc = utf8_encode($desc);
		}
    	if($id != "")
    	{
    		$dbhw->query("UPDATE i3geoadmin_menus SET en = '$en', es = '$es', it = '$it', publicado_menu = '$publicado_menu',aberto = '$aberto', nome_menu = '$nome', desc_menu = '$desc', perfil_menu = '$perfil' WHERE id_menu = $id");
    	}
    	else
    	{
    		$dbhw->query("INSERT INTO i3geoadmin_menus (it,es,en,publicado_menu, nome_menu, desc_menu, aberto, perfil_menu) VALUES ('','','','','', '','SIM','')");
    	}
    	$dbhw = null;
    	$dbh = null;
    	return "ok";
	}
	catch (PDOException $e)
	{
    	return "Error!: " . $e->getMessage();
	}
}
function alteraPerfis()
{
	global $perfil,$id;
	//$perfil = resolveAcentos($perfil,"html");
	
	try 
	{
		$dbh = "";
    	include("conexao.php");
    	if($convUTF) $perfil = utf8_encode($perfil);  	
    	$retorna = "";
    	if($id != "")
		{
   			$original = "";
   			foreach($dbh->query("select * from i3geoadmin_perfis where id_perfil = $id") as $row)
   			{$original = $row["perfil"];}
   			$dbhw->query("UPDATE i3geoadmin_perfis SET perfil = '$perfil' WHERE id_perfil = $id");
			if($original != "")
			{
   				$q = $dbh->query("select * from i3geoadmin_mapas");
   				foreach($q as $row)
	    		{
        			$t = $row['perfil_mapa'];
        			$i = $row['id_mapa'];
        			$ts = str_replace($original,$perfil,$t);
        			if($t != $ts)
        			$dbhw->query("UPDATE i3geoadmin_mapas SET perfil_mapa = '$ts' WHERE id_mapa = $i");
	    		}
	    		$q = $dbh->query("select * from i3geoadmin_menus");
   				foreach($q as $row)
	    		{
        			$t = $row['perfil_menu'];
        			$i = $row['id_menu'];
        			$ts = str_replace($original,$perfil,$t);
        			if($t != $ts)
	       			$dbhw->query("UPDATE i3geoadmin_menus SET perfil_menu = '$ts' WHERE id_menu = $i");
	    		}
	    		$q = $dbh->query("select * from i3geoadmin_n1");
    			foreach($q as $row)
	    		{
	       			$t = $row['n1_perfil'];
	       			$i = $row['id_n1'];
	       			$ts = str_replace($original,$perfil,$t);
	       			if($t != $ts)
	       			$dbhw->query("UPDATE i3geoadmin_n1 SET n1_perfil = '$ts' WHERE id_n1 = $i");
	    		}
	    		$q = $dbh->query("select * from i3geoadmin_n2");
    			foreach($q as $row)
	    		{
	       			$t = $row['n2_perfil'];
	       			$i = $row['id_n2'];
	       			$ts = str_replace($original,$perfil,$t);
	       			if($t != $ts)
	       			$dbhw->query("UPDATE i3geoadmin_n2 SET n2_perfil = '$ts' WHERE id_n2 = $i");
	    		}
	    		$q = $dbh->query("select * from i3geoadmin_n3");
    			foreach($q as $row)
	    		{
	       			$t = $row['n3_perfil'];
	       			$i = $row['id_n3'];
	       			$ts = str_replace($original,$perfil,$t);
	       			if($t != $ts)
	       			$dbhw->query("UPDATE i3geoadmin_n3 SET n3_perfil = '$ts' WHERE id_n3 = $i");
	    		}
	    		$q = $dbh->query("select * from i3geoadmin_raiz");
    			foreach($q as $row)
	    		{
	       			$t = $row['perfil'];
	       			$i = $row['id_raiz'];
	       			$ts = str_replace($original,$perfil,$t);
	       			if($t != $ts)
	       			$dbhw->query("UPDATE i3geoadmin_raiz SET perfil = '$ts' WHERE id_raiz = $i");
	    		}
	    		$q = $dbh->query("select * from i3geoadmin_sistemas");
    			foreach($q as $row)
	    		{
	       			$t = $row['perfil_sistema'];
	       			$i = $row['id_sistema'];
	       			$ts = str_replace($original,$perfil,$t);
	       			if($t != $ts)
	       			$dbhw->query("UPDATE i3geoadmin_sistemas SET perfil_sistema = '$ts' WHERE id_sistema = $i");
	    		}
	    		$q = $dbh->query("select * from i3geoadmin_sistemasf");
    			foreach($q as $row)
	    		{
	       			$t = $row['perfil_funcao'];
	       			$i = $row['id_funcao'];
	       			$ts = str_replace($original,$perfil,$t);
	       			if($t != $ts)
	       			$dbhw->query("UPDATE i3geoadmin_sistemasf SET perfil_funcao = '$ts' WHERE id_funcao = $i");
	    		}
			}
			$retorna = $id;
    	}
    	else
    	{
    		$dbhw->query("INSERT INTO i3geoadmin_perfis (perfil) VALUES ('$perfil')");
			$id = $dbh->query("SELECT * FROM i3geoadmin_perfis");
			$id = $id->fetchAll();
			$id = intval($id[count($id)-1]['id_perfil']);
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
function alteraTags()
{
	global $nome,$id;
	try 
	{
		
		$dbh = "";
		//$nome = mb_convert_encoding($nome,"UTF-8","ISO-8859-1");
    	include("conexao.php");
    	if($convUTF) $nome = utf8_encode($nome);
    	$retorna = "";
    	if($id != "")
		{
    		if(!verificaDuplicados("select * from i3geoadmin_tags where nome = '$nome'",$dbh))
    		{
    			$original = "";
    			$q = $dbh->query("select * from i3geoadmin_tags where id_tag = $id");
    			foreach($q as $row)
    			{$original = $row["nome"];}
    			$dbhw->query("UPDATE i3geoadmin_tags SET nome = '$nome' WHERE id_tag = $id");
    			//exclui os registros do tag alterado nos temas
    			/*
    			if($original != "")
    			{
    				$q = $dbh->query("select tags_tema,id_tema from i3geoadmin_temas");
    				foreach($q as $row)
		    		{
	        			$ts = $row['tags_tema'];
	        			$i = $row['id_tema'];
	        			$ts = str_replace($original,$nome,$ts);
	        			$dbhw->query("UPDATE i3geoadmin_temas SET tags_tema = '$ts' WHERE id_tema = $i");
		    		}
    			}
    			*/	
    		}
    		$retorna = $id;		
		}
    	else
    	{
    		$dbhw->query("INSERT INTO i3geoadmin_tags (nome) VALUES ('$nome')");
			$id = $dbh->query("SELECT * FROM i3geoadmin_tags");
			$id = $id->fetchAll();
			$id = intval($id[count($id)-1]['id_tag']);
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
Function: alteraGrupos

Altera o registro de um grupo. Se id for vazio acrescenta o registro
*/
function alteraGrupos()
{
	global $nome,$desc,$id,$en,$es,$it;
	try 
	{
    	include("conexao.php");
    	if($convUTF)
    	{
			$nome = utf8_encode($nome);
			$desc = utf8_encode($desc);    		
    	}
    	if($id != "")
    	{
    		$dbhw->query("UPDATE i3geoadmin_grupos SET en = '$en', es = '$es', it = '$it', nome_grupo = '$nome', desc_grupo = '$desc' WHERE id_grupo = $id");
    	}
    	else
    	{
    		$dbhw->query("INSERT INTO i3geoadmin_grupos (nome_grupo, desc_grupo, en, es, it) VALUES ('', '','','','')");
    	}
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
Function: alteraSubGrupos

Altera o registro de um sub-grupo. Se id for vazio acrescenta o registro
*/
function alteraSubGrupos()
{
	global $nome,$desc,$id,$en,$es,$it;
	try 
	{
    	require_once("conexao.php");
    	if($convUTF)
		{
			$nome = utf8_encode($nome);
			$desc = utf8_encode($desc);			
		}
    	$retorna = "";
    	if($id != "")
    	{
	    	$dbhw->query("UPDATE i3geoadmin_subgrupos SET en = '$en', es = '$es', it = '$it', nome_subgrupo = '$nome', desc_subgrupo = '$desc' WHERE id_subgrupo = $id");
    	}
    	else
    	{
    		$dbhw->query("INSERT INTO i3geoadmin_subgrupos (nome_subgrupo, desc_subgrupo, en, es, it) VALUES ('', '','','','')");
    	}
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
Function: registraTema

Registra um mapfile na tabela de temas
*/
function registraTema()
{
	global $codigo_tema;
	try 
	{
		$retorna = "ok";
    	include("conexao.php");
		$sql = "SELECT * from i3geoadmin_temas where codigo_tema = '$codigo_tema'";
		$dados = pegaDados($sql);
		if(count($dados) == 0)
		{$dbhw->query("INSERT INTO i3geoadmin_temas (nome_tema,codigo_tema,kml_tema,kmz_tema,ogc_tema,download_tema,tags_tema,link_tema,desc_tema) VALUES ('$codigo_tema','$codigo_tema','SIM','NAO','SIM','SIM','','','')");}
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
Function: alteraTemas

Altera o registro de um tema. Se id for vazio acrescenta o registro
*/
function alteraTemas()
{
	global $nome,$desc,$id,$codigo,$tipoa,$download,$ogc,$kml,$link,$tags,$kmz,$locaplic;
	//error_reporting(E_ALL);
	try 
	{
		$retorna = "ok";
    	include("conexao.php");
    	if($convUTF)
		{
			$nome = utf8_encode($nome);
			$desc = utf8_encode($desc);
			$tags = utf8_encode($tags);		
		}
    	if($id != "")
    	{
	    	if(!isset($kmz))
	    	$dbhw->query("UPDATE i3geoadmin_temas SET tags_tema='$tags', link_tema='$link', nome_tema ='$nome',desc_tema='$desc',codigo_tema='$codigo',tipoa_tema='$tipoa',download_tema='$download',ogc_tema='$ogc',kml_tema='$kml' WHERE id_tema = $id");
    		else
	    	$dbhw->query("UPDATE i3geoadmin_temas SET tags_tema='$tags', link_tema='$link', nome_tema ='$nome',desc_tema='$desc',codigo_tema='$codigo',tipoa_tema='$tipoa',download_tema='$download',ogc_tema='$ogc',kml_tema='$kml',kmz_tema='$kmz' WHERE id_tema = $id");    		
    		$retorna = $id;
    		if(!isset($kmz)){$kmz = "nao";}
 			$sql = "SELECT * from i3geoadmin_temas where id_tema = '$id'";
    		$q = $dbh->query($sql,PDO::FETCH_ASSOC);
    		$resultado = $q->fetchAll();
    		$mapfile = $resultado[0]["codigo_tema"];
			$mapfile = $locaplic."/temas/".$mapfile.".map";

			if($mapa = @ms_newMapObj($mapfile))
			{
				$mapa = ms_newMapObj($mapfile);
				$nomes = $mapa->getalllayernames();
				foreach($nomes as $nome)
				{
					$layer = $mapa->getlayerbyname($nome);
					$layer->setmetadata("permitedownload",strtolower($download));
					$layer->setmetadata("permiteogc",strtolower($ogc));
					$layer->setmetadata("permitekml",strtolower($kml));
					$layer->setmetadata("permitekmz",strtolower($kmz));
				}
				$mapa->save($mapfile);
				removeCabecalho($mapfile);
			}
    	}
    	else
    	{
    		$dbhw->query("INSERT INTO i3geoadmin_temas (nome_tema) VALUES ('xxxxxX')");// (link_tema,kml_tema,ogc_tema,download_tema,nome_tema,desc_tema,codigo_tema,tipoa_tema,tags_tema) VALUES ('','', '','','','','','','')");
			$id = $dbh->query("SELECT * FROM i3geoadmin_temas WHERE nome_tema = 'xxxxxX'");
			$id = $id->fetchAll();
			$id = intval($id[0]['id_tema']);
			if(!isset($kmz))
			$dbhw->query("UPDATE i3geoadmin_temas SET tags_tema='', link_tema='', nome_tema ='',desc_tema='',codigo_tema='',tipoa_tema='',download_tema='',ogc_tema='',kml_tema='' WHERE id_tema = $id");
			else
			$dbhw->query("UPDATE i3geoadmin_temas SET tags_tema='', link_tema='', nome_tema ='',desc_tema='',codigo_tema='',tipoa_tema='',download_tema='',ogc_tema='',kml_tema='',kmz_tema='' WHERE id_tema = $id");
			$retorna = $id;
    	}
    	//verifica se é necessário adicionar algum tag novo
    	$tags = explode(" ",$tags);
    	
    	foreach($tags as $tag)
    	{
    		if(!(verificaDuplicados("select * from i3geoadmin_tags where nome = '$tag'",$dbh)))
    		{
		    	$dbhw->query("INSERT INTO i3geoadmin_tags (nome) VALUES ('$tag')");   		
    		}	
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
Function: listaMapsTemas

Retorna a lista de mapfiles do diretorio i3geo/temas

Parameters:

cp - objeto CPAINT

locaplic - localização da instalação do I3Geo
*/
function listaMapsTemas()
{
 	global $cp,$locaplic,$letra;
 	$arquivos = array();
	if (is_dir($locaplic."/temas"))
	{
   		if ($dh = opendir($locaplic."/temas")) 
		{
       		while (($file = readdir($dh)) !== false) 
			{
				if(!stristr($file, '.map') === FALSE || !stristr($file, ".php")===FALSE)
				{
					$file = str_replace(".map","",$file);
					$file = str_replace(".php","",$file);
					if(isset($letra) && $letra != "")
					{
						if(strtolower(substr(basename($file),0,1)) == strtolower($letra))
						{$arquivos[] = $file;}
					}
					else
					{$arquivos[] = $file;}
				}
			}
       	}
       	closedir($dh);
   	}
   	sort($arquivos);
 	return $arquivos;
}
/*
/*
Function importarXmlMenu

Importa um arquivo xml do tipo "menutemas" para o banco de dados
*/
function importarXmlMenu()
{
	global $nomemenu,$xml;
	error_reporting(E_ALL);
	set_time_limit(0);
	$listaDeTags = array();
	if(!file_exists($xml))
	{return "<br><b>Arquivo $xml n&atilde;o encontrado";}
	include_once("../../classesphp/funcoes_gerais.php");
	include("conexao.php");
	if($convUTF) $nomemenu = utf8_encode($nomemenu);
	$dbhw->query("INSERT INTO i3geoadmin_menus (perfil_menu,desc_menu,nome_menu,publicado_menu,aberto) VALUES ('','','$nomemenu','SIM','NAO')");
	$id_menu = $dbh->query("SELECT id_menu FROM i3geoadmin_menus where nome_menu = '$nomemenu'");
	$id_menu = $id_menu->fetchAll();
	$id_menu = $id_menu[0]['id_menu'];
	$xml = simplexml_load_file($xml);
	//
	//importa os grupos
	//
	$gruposExistentes = array();
	$q = $dbh->query("select * from i3geoadmin_grupos");
	$resultado = $q->fetchAll();
	foreach($resultado as $r)
	{$gruposExistentes[$r["nome_grupo"]] = 0;}
	foreach($xml->GRUPO as $grupo)
	{
		$nome = html_entity_decode(ixml($grupo,"GTIPO"));
		$descricao = html_entity_decode(ixml($grupo,"DTIPO"));
		if($convUTF)
		{
			$nome = utf8_encode($nome);
			$descricao = utf8_encode($descricao);
		}
		if(!isset($gruposExistentes[$nome]))
		{
			$nome = str_replace("'","",$nome);
			$descricao = str_replace("'","",$descricao);
			$dbhw->query("INSERT INTO i3geoadmin_grupos (desc_grupo,nome_grupo) VALUES ('$descricao','$nome')");
		}
		$gruposExistentes[$nome] = 0;
	}
	//
	//importa os sub-grupos
	//
	$subgruposExistentes = array();
	$q = $dbh->query("select * from i3geoadmin_subgrupos");
	$resultado = $q->fetchAll();
	foreach($resultado as $r)
	{$subgruposExistentes[$r["nome_subgrupo"]] = 0;}
	foreach($xml->GRUPO as $grupo)
	{
		foreach($grupo->SGRUPO as $sgrupo)
		{
			$nome = html_entity_decode(ixml($sgrupo,"SDTIPO"));
			if($convUTF)
			{
				$nome = utf8_encode($nome);
			}
			$descricao = "";
			if(!isset($subgruposExistentes[$nome]))
			{
				$nome = str_replace("'","",$nome);
				$descricao = str_replace("'","",$descricao);
				$dbhw->query("INSERT INTO i3geoadmin_subgrupos (desc_subgrupo,nome_subgrupo) VALUES ('$descricao','$nome')");
				$subgruposExistentes[$nome] = 0;
			}
		}
	}
	//
	//importa os temas
	//
	$temasExistentes = array();
	$q = $dbh->query("select * from i3geoadmin_temas");
	$resultado = $q->fetchAll();
	foreach($resultado as $r)
	{
		if($r["codigo_tema"])
		$temasExistentes[$r["codigo_tema"]] = 0;
	}
	foreach($xml->TEMA as $tema)
	{
		$nome = html_entity_decode(ixml($tema,"TNOME"));
		$descricao = html_entity_decode(ixml($tema,"TDESC"));
		if($convUTF)
		{
			$nome = utf8_encode($nome);
			$descricao = utf8_encode($descricao);
		}
		$codigo = ixml($tema,"TID");
		$link = ixml($tema,"TLINK");
		$tipo = ixml($tema,"TIPOA");
		$tags = ixml($tema,"TAGS");
		if($convUTF) $tags = utf8_encode($tags);
		$down = ixml($tema,"DOWNLOAD");
		$kml = ixml($tema,"KML");
		$ogc = ixml($tema,"OGC");
		$listaDeTags = array_merge($listaDeTags,explode(" ",$tags));		
		if(!isset($temasExistentes[$codigo]))
		{
			$nome = str_replace("'","",$nome);
			$descricao = str_replace("'","",$descricao);
			$dbhw->query("INSERT INTO i3geoadmin_temas (nacessos,kml_tema,kmz_tema,ogc_tema,download_tema,tags_tema,tipoa_tema,link_tema,desc_tema,nome_tema,codigo_tema) VALUES (0,'$kml','NAO','$ogc','$down','$tags','$tipo','$link','$descricao','$nome','$codigo')");
		}
		$temasExistentes[$codigo] = 0;
	}
	foreach($xml->GRUPO as $grupo)
	{
		foreach($grupo->TEMA as $tema)
		{
			$nome = html_entity_decode(ixml($tema,"TNOME"));
			$descricao = html_entity_decode(ixml($tema,"TDESC"));
			if($convUTF)
			{
				$nome = utf8_encode($nome);
				$descricao = utf8_encode($descricao);
			}
			$codigo = ixml($tema,"TID");
			$link = ixml($tema,"TLINK");
			$tipo = ixml($tema,"TIPOA");
			$tags = ixml($tema,"TAGS");
			if($convUTF) $tags = utf8_encode($tags);
			$down = ixml($tema,"DOWNLOAD");
			$kml = ixml($tema,"KML");
			$ogc = ixml($tema,"OGC");		
			$listaDeTags = array_merge($listaDeTags,explode(" ",$tags));		
			if(!isset($temasExistentes[$codigo]))
			{
				$nome = str_replace("'","",$nome);
				$descricao = str_replace("'","",$descricao);
				$dbhw->query("INSERT INTO i3geoadmin_temas (nacessos,kml_tema,kmz_tema,ogc_tema,download_tema,tags_tema,tipoa_tema,link_tema,desc_tema,nome_tema,codigo_tema) VALUES (0,'$kml','NAO','$ogc','$down','$tags','$tipo','$link','$descricao','$nome','$codigo')");
			}
			$temasExistentes[$codigo] = 0;
		}
		foreach($grupo->SGRUPO as $sgrupo)
		{
			foreach($sgrupo->TEMA as $tema)
			{
				$nome = html_entity_decode(ixml($tema,"TNOME"));
				$descricao = html_entity_decode(ixml($tema,"TDESC"));
				if($convUTF)
				{
					$nome = utf8_encode($nome);
					$descricao = utf8_encode($descricao);
				}
				$codigo = ixml($tema,"TID");
				$link = ixml($tema,"TLINK");
				$tipo = ixml($tema,"TIPOA");
				$tags = html_entity_decode(ixml($tema,"TAGS"));
				if($convUTF) $tags = utf8_encode($tags);
				$down = ixml($tema,"DOWNLOAD");
				$kml = ixml($tema,"KML");
				$ogc = ixml($tema,"OGC");		
				$listaDeTags = array_merge($listaDeTags,explode(" ",$tags));		
				if(!isset($temasExistentes[$codigo]))
				{
					$nome = str_replace("'","",$nome);
					$descricao = str_replace("'","",$descricao);
					$dbhw->query("INSERT INTO i3geoadmin_temas (nacessos,kml_tema,kmz_tema,ogc_tema,download_tema,tags_tema,tipoa_tema,link_tema,desc_tema,nome_tema,codigo_tema) VALUES (0,'$kml','NAO','$ogc','$down','$tags','$tipo','$link','$descricao','$nome','$codigo')");
				}
				$temasExistentes[$codigo] = 0;
			}
		}		
	}
	//
	//monta árvore
	//
	//
	//registra os temas no nível da raiz
	//
	foreach($xml->TEMA as $tema)
	{
		$codigo = ixml($tema,"TID");
		$perfil = ixml($tema,"PERFIL");
		$r = $dbh->query("select id_tema from i3geoadmin_temas where codigo_tema = '$codigo'");
		$id_tema = $r->fetchAll();
		$id_tema = $id_tema[0]['id_tema'];
		$dbhw->query("INSERT INTO i3geoadmin_raiz (id_tema,id_menu,id_nivel,nivel,perfil,ordem) VALUES ('$id_tema','$id_menu','0','0','$perfil','0')");		
	}
	//
	//registra o restante
	//
	$contaGrupo = 0;
	foreach($xml->GRUPO as $grupo)
	{
		$gtipo = html_entity_decode(ixml($grupo,"GTIPO"));
		if($convUTF) $gtipo = utf8_encode($gtipo);
		$n1_perfil = ixml($grupo,"PERFIL");
		$r = $dbh->query("select id_grupo from i3geoadmin_grupos where nome_grupo = '$gtipo'");
		$id_grupo = $r->fetchAll();
		$id_grupo = $id_grupo[0]['id_grupo'];
		//echo "INSERT INTO i3geoadmin_n1 (ordem,publicado,id_menu,id_grupo,n1_perfil) VALUES ($contaGrupo,'SIM',$id_menu,$id_grupo,'$n1_perfil')"."<br>";
		
		$dbhw->query("INSERT INTO i3geoadmin_n1 (ordem,publicado,id_menu,id_grupo,n1_perfil) VALUES ($contaGrupo,'SIM',$id_menu,$id_grupo,'$n1_perfil')");

		$contaGrupo++;
		$id_n1 = $dbh->query("SELECT id_n1 FROM i3geoadmin_n1 where id_menu = '$id_menu' and id_grupo = '$id_grupo'");
		$id_n1 = $id_n1->fetchAll();
		$id_n1 = $id_n1[0]['id_n1'];

		foreach($grupo->TEMA as $tema)
		{
			$codigo = ixml($tema,"TID");
			$perfil = ixml($tema,"PERFIL");
			$r = $dbh->query("select id_tema from i3geoadmin_temas where codigo_tema = '$codigo'");
			$id_tema = $r->fetchAll();
			$id_tema = $id_tema[0]['id_tema'];
			$dbhw->query("INSERT INTO i3geoadmin_raiz (id_tema,id_menu,id_nivel,nivel,perfil,ordem) VALUES ($id_tema,$id_menu,$id_n1,'1','$perfil','0')");		
		}
		$contaSubGrupo = 0;
		foreach($grupo->SGRUPO as $subgrupo)
		{
			$sdtipo = html_entity_decode(ixml($subgrupo,"SDTIPO"));
			if($convUTF) $sdtipo = utf8_encode($sdtipo);
			$n2_perfil = ixml($subgrupo,"PERFIL");
			$r = $dbh->query("select id_subgrupo from i3geoadmin_subgrupos where nome_subgrupo = '$sdtipo'");
			$id_subgrupo = $r->fetchAll();
			$id_subgrupo = $id_subgrupo[0]['id_subgrupo'];
			
			$dbhw->query("INSERT INTO i3geoadmin_n2 (publicado,ordem,id_n1,id_subgrupo,n2_perfil) VALUES ('SIM',$contaSubGrupo,$id_n1,$id_subgrupo,'$n2_perfil')");
			$contaSubGrupo++;
			$id_n2 = $dbh->query("SELECT id_n2 FROM i3geoadmin_n2 where id_n1='$id_n1' and id_subgrupo = '$id_subgrupo'");
			$id_n2 = $id_n2->fetchAll();
			$id_n2 = $id_n2[0]['id_n2'];
			$contaTema = 0;
			foreach($subgrupo->TEMA as $tema)
			{
				$codigo = ixml($tema,"TID");
				$perfil = ixml($tema,"PERFIL");
				$r = $dbh->query("select id_tema from i3geoadmin_temas where codigo_tema = '$codigo'");
				$id_tema = $r->fetchAll();
				$id_tema = $id_tema[0]['id_tema'];
				$dbhw->query("INSERT INTO i3geoadmin_n3 (publicado,ordem,id_n2,id_tema,n3_perfil) VALUES ('SIM',$contaTema,$id_n2,$id_tema,'$perfil')");		
				$contaTema++;
			}		
		}
	}	
	//registra os tags
	$listaDeTags = array_unique($listaDeTags);
	foreach ($listaDeTags as $t)
	{
		if($t != "" && !(verificaDuplicados("select * from i3geoadmin_tags where nome = '$t'",$dbh)))
		$dbhw->query("INSERT INTO i3geoadmin_tags (nome) VALUES ('$t')");			
	}
	$dbhw = null;
	$dbh = null;
	return "Dados importados.";
}

function removeCabecalho($arq,$symbolset=true)
{
	$handle = fopen($arq, "r");
	if ($handle)
	{
    	$cabeca = array();
    	if($symbolset)
    	{
    		$cabeca[] = "MAP\n";
    		//$final[] = "SYMBOLSET ../symbols/simbolos.sym\n";
    		//$final[] = "FONTSET   ".'"'."../symbols/fontes.txt".'"'."\n";
    	}
    	$grava = false;
    	while (!feof($handle)) 
    	{
        	$linha = fgets($handle);
        	if($symbolset)
        	{
        		if(strtoupper(trim($linha)) == "SYMBOLSET")
        		{$cabeca[] = $linha;}
        		if(strtoupper(trim($linha)) == "FONTSET")
        		{$cabeca[] = $linha;}
        	}
        	if(strtoupper(trim($linha)) == "LAYER")
        	{$grava = true;}
        	if($grava)
        	{$final[] = rtrim($linha, "\r\n") . PHP_EOL;}
    	}
    	fclose($handle);
	}
	$final = array_merge($cabeca,$final);
	$handle = fopen($arq, "w+");
	foreach ($final as $f)
	{
		//
		//remove resultados em branco
		//e grava a linha
		//
		$teste = strtoupper($f);
		$teste = trim($teste);
		$teste = str_replace(" ","",$teste);
		$teste = str_replace("'","",$teste);
		$teste = str_replace('"',"",$teste);
		$teste = preg_replace('/[\n\r\t ]*/', '', $teste);
      	$testar = array("KEYIMAGE","TILEINDEX","TILEITEM","SYMBOL","LABELITEM","FILTERITEM","GROUP","ENCODING","TIP","CLASSE","ITENSDESC","CLASSESNOME","ITENSLINK","ESCALA","CLASSESSIMBOLO","MENSAGEM","EXTENSAO","CLASSESITEM","ESCONDIDO","CLASSESCOR","DOWNLOAD","CLASSESTAMANHO","ITENS","TEMA","APLICAEXTENSAO","IDENTIFICA");
		$passou = true;
		foreach ($testar as $t)
		{if($teste == $t){$passou = false;}}
		if($passou)
		fwrite($handle,$f);
	}
	fclose($handle);
	chmod($arq, 0666);
}
?>