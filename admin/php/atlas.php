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
	
	case "pegaAtlas":
	$sis = dadosAtlas();
	$cp->set_data($sis);
	$cp->return_data();
	break;
	
	case "alterarAtlas":
	alterarAtlas();
	$sis = dadosAtlas();
	$cp->set_data($sis);
	$cp->return_data();
	break;

	case "alterarPranchas":
	alterarPranchas();
	$sis = dadosAtlas();
	$cp->set_data($sis);
	$cp->return_data();
	break;
	
	case "alterarTemas":
	alterarTemas();
	$sis = dadosAtlas();
	$cp->set_data($sis);
	$cp->return_data();
	break;

	case "excluir":
	$tabela = "i3geoadmin_atlas";	
	$f = verificaFilhos();
	if(!$f)
	$cp->set_data(excluirAtlas());
	else
	$cp->set_data("erro");	
	$cp->return_data();
	break;
	
	case "excluirPranchas":
	$tabela = "i3geoadmin_atlasp";	
	$f = verificaFilhos();
	if(!$f)
	$cp->set_data(excluirPranchas());
	else
	$cp->set_data("erro");	
	$cp->return_data();
	break;

	case "excluirTemas":
	$cp->set_data(excluirTemas());
	$cp->return_data();
	break;
	
	case "importarXmlAtlas":
	$cp->set_data(importarXmlAtlas());
	$cp->return_data();
	break;
}
function dadosAtlas()
{
	global $id_atlas;
	if($id_atlas == "")
	$sis = pegaDados('SELECT * from i3geoadmin_atlas order by titulo_atlas');
	else
	$sis = pegaDados("SELECT * from i3geoadmin_atlas where id_atlas = '$id_atlas' ");
	for($i=0;$i<count($sis);++$i)
	{
		$pranchas = pegaDados('SELECT * from i3geoadmin_atlasp where id_atlas ='.($sis[$i]["id_atlas"]));
		for($j=0;$j<count($pranchas);++$j)
		{
			$temas = pegaDados('SELECT * from i3geoadmin_atlast where id_prancha ='.($pranchas[$j]["id_prancha"]));
			if(count($temas) > 0)
			$pranchas[$j]["temas"] = $temas;
			else
			$pranchas[$j]["temas"] = "";
		}
		if(count($pranchas) > 0)
		$sis[$i]["pranchas"] = $pranchas;
		else
		$sis[$i]["pranchas"] = "";
	}
	return $sis;
}
function alterarAtlas()
{
	global $id_atlas,$basemapfile_atlas,$desc_atlas,$h_atlas,$w_atlas,$icone_atlas,$link_atlas,$pranchadefault_atlas,$template_atlas,$tipoguias_atlas,$titulo_atlas;
	
	try 
	{
    	$desc_atlas = mb_convert_encoding($desc_atlas,"UTF-8","ISO-8859-1");
    	$titulo_atlas = mb_convert_encoding($titulo_atlas,"UTF-8","ISO-8859-1");
    	include("conexao.php");
    	if($id_atlas != "")
    	$dbhw->query("UPDATE i3geoadmin_atlas SET basemapfile_atlas='$basemapfile_atlas',desc_atlas='$desc_atlas',h_atlas='$h_atlas',w_atlas='$w_atlas',icone_atlas='$icone_atlas',link_atlas='$link_atlas',pranchadefault_atlas='$pranchadefault_atlas',template_atlas='$template_atlas',tipoguias_atlas='$tipoguias_atlas',titulo_atlas='$titulo_atlas' WHERE id_atlas = $id_atlas");
    	else
    	$dbhw->query("INSERT INTO i3geoadmin_atlas (basemapfile_atlas,desc_atlas,h_atlas,w_atlas,icone_atlas,link_atlas,pranchadefault_atlas,template_atlas,tipoguias_atlas,titulo_atlas) VALUES ('','','$h_atlas','$w_atlas','','','','','$tipoguias_atlas','')");
    	$dbhw = null;
    	$dbh = null;
    	return "ok";
	}
	catch (PDOException $e)
	{
    	return "Error!: " . $e->getMessage();
	}
}
function alterarPranchas()
{
	global $mapext_prancha,$id_atlas,$id_prancha,$desc_prancha,$h_prancha,$w_prancha,$icone_prancha,$link_prancha,$titulo_prancha;
	try 
	{
    	$desc_prancha = mb_convert_encoding($desc_prancha,"UTF-8","ISO-8859-1");
    	$titulo_prancha = mb_convert_encoding($titulo_prancha,"UTF-8","ISO-8859-1");
    	include("conexao.php");
    	if($id_prancha != "")
    	$dbhw->query("UPDATE i3geoadmin_atlasp SET mapext_prancha='$mapext_prancha',desc_prancha='$desc_prancha',h_prancha='$h_prancha',w_prancha='$w_prancha',icone_prancha='$icone_prancha',link_prancha='$link_prancha',titulo_prancha='$titulo_prancha' WHERE id_prancha = $id_prancha and id_atlas='$id_atlas'");
    	else
    	$dbhw->query("INSERT INTO i3geoadmin_atlasp (mapext_prancha,desc_prancha,h_prancha,w_prancha,icone_prancha,link_prancha,titulo_prancha,id_atlas) VALUES ('','','$h_prancha','$w_prancha','','','','$id_atlas')");
    	$dbhw = null;
    	$dbh = null;
    	return "ok";
	}
	catch (PDOException $e)
	{
    	return "Error!: " . $e->getMessage();
	}
}
function alterarTemas()
{
	global $id_tema,$id_prancha,$codigo_tema,$ligado_tema;
	try 
	{
    	include("conexao.php");
    	if($id_tema != "")
    	$dbhw->query("UPDATE i3geoadmin_atlast SET codigo_tema='$codigo_tema',ligado_tema='$ligado_tema' WHERE id_prancha = $id_prancha and id_tema='$id_tema'");
    	else
    	$dbhw->query("INSERT INTO i3geoadmin_atlast (codigo_tema,ligado_tema,id_prancha) VALUES ('','','$id_prancha')");
    	$dbhw = null;
    	$dbh = null;
    	return "ok";
	}
	catch (PDOException $e)
	{
    	return "Error!: " . $e->getMessage();
	}
}

function excluirPranchas()
{
	global $id;
	try 
	{
    	include("conexao.php");
    	$dbhw->query("DELETE from i3geoadmin_atlasp WHERE id_prancha = $id");
    	$dbhw = null;
    	$dbh = null;
    	return "ok";
	}
	catch (PDOException $e)
	{
    	return "Error!: " . $e->getMessage();
	}
}
function excluirTemas()
{
	global $id;
	try 
	{
    	include("conexao.php");
    	$dbhw->query("DELETE from i3geoadmin_atlast WHERE id_tema = $id");
    	$dbhw = null;
    	$dbh = null;
    	return "ok";
	}
	catch (PDOException $e)
	{
    	return "Error!: " . $e->getMessage();
	}
}
function excluirAtlas()
{
	global $id;
	try 
	{
    	include("conexao.php");
    	$dbhw->query("DELETE from i3geoadmin_atlas WHERE id_atlas = $id");
    	$dbhw = null;
    	$dbh = null;
    	return "ok";
	}
	catch (PDOException $e)
	{
    	return "Error!: " . $e->getMessage();
	}
}
function importarXmlAtlas()
{
	global $xml,$tipo;
	if(!file_exists($xml))
	{return "<br><b>Arquivo $xml n&atilde;o encontrado";}
	include_once("../../classesphp/funcoes_gerais.php");
	include("conexao.php");
	$xml = simplexml_load_file($xml);
	//
	//importa os atlas
	//
	$atlasExistentes = array();
	$q = $dbhw->query("select * from i3geoadmin_atlas");
	$resultado = $q->fetchAll();
	foreach($resultado as $r)
	{$atlasExistentes[$r["titulo_atlas"]] = 0;}
	foreach($xml->ATLAS as $atlas)
	{
		$titulo = ixml($atlas,"TITULO");
		$desc = ixml($atlas,"DESCRICAO");
		$icone = ixml($atlas,"ICONE");
		$link = ixml($atlas,"LINKMAISINFO");
		$template = ixml($atlas,"TEMPLATEHTML");
		$w = ixml($atlas,"WABERTURA");
		$h = ixml($atlas,"HABERTURA");
		$pranchadefault = ixml($atlas,"PRANCHADEFAULT");
		$tipoguias = ixml($atlas,"TIPOGUIAS");
		if(!isset($atlasExistentes[$titulo]))
		$dbhw->query("INSERT INTO i3geoadmin_atlas (desc_atlas,h_atlas,w_atlas,icone_atlas,link_atlas,pranchadefault_atlas,template_atlas,tipoguias_atlas,titulo_atlas) VALUES ('$desc','$h','$w','$icone','$link','$pranchadefault','$template','$tipoguias','$titulo')");
		$atlasExistentes[$titulo] = 0;
		$id_atlas = $dbh->lastInsertId("id_atlas");
		foreach ($atlas->PRANCHAS->PRANCHA as $prancha)
		{
			$titulo = ixml($prancha,"TITULO");
			$desc = ixml($prancha,"DESCRICAO");
			$icone = ixml($prancha,"ICONE");
			$link = ixml($prancha,"LINKMAISINFO");
			$w = ixml($prancha,"WABERUTRA");
			$h = ixml($prancha,"HABERTURA");
			$mapext = ixml($prancha,"MAPEXT");
			$dbhw->query("INSERT INTO i3geoadmin_atlasp (id_atlas,desc_prancha,h_prancha,w_prancha,icone_prancha,link_prancha,titulo_prancha,mapext_prancha) VALUES ('$id_atlas','$desc','$h','$w','$icone','$link','$titulo','$mapext')");
			$id_prancha = $dbh->lastInsertId("id_prancha");
			foreach ($prancha->TEMAS->TEMA as $tema)
			{
				$codigo = ixml($tema,"CODIGO");
				$ligado = ixml($tema,"LIGADO");
				$dbhw->query("INSERT INTO i3geoadmin_atlast (id_prancha,codigo_tema,ligado_tema) VALUES ('$id_prancha','$codigo','$ligado')");
			}

		}
	}
	$dbhw = null;
	$dbh = null;
	return "Dados importados.";
}
function verificaFilhos()
{
	global $tabela,$id;
	try 
	{
    	$res = false;
    	if($tabela == "i3geoadmin_atlas")
    	{
    		$r = pegaDados("select * from i3geoadmin_atlasp where id_atlas=$id");
    		if(count($r) > 0)
    		$res = true;
    	}
    	if($tabela == "i3geoadmin_atlasp")
    	{
    		$r = pegaDados("select * from i3geoadmin_atlast where id_prancha=$id");
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

?>