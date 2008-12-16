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
//faz a busca da função que deve ser executada
switch ($funcao)
{
	case "pegaAtlas":
		retornaJSON(pegaDados('SELECT id_atlas,titulo_atlas from i3geoadmin_atlas order by ordem_atlas'));
		exit;
	break;
	case "pegaPranchas":
		retornaJSON(pegaDados("SELECT id_prancha,titulo_prancha from i3geoadmin_atlasp where id_atlas='$id_atlas' order by ordem_prancha"));
		exit;
	break;
	case "pegaTemas":
		retornaJSON(pegaDados("SELECT * from i3geoadmin_atlast where id_prancha = '$id_prancha' order by ordem_tema"));
		exit;
	break;
	case "pegaDadosAtlas":
		retornaJSON(pegaDados('SELECT * from i3geoadmin_atlas where id_atlas ='.$id_atlas));
		exit;
	break;
	case "pegaDadosPrancha":
		retornaJSON(pegaDados('SELECT * from i3geoadmin_atlasp where id_prancha ='.$id_prancha));
		exit;
	break;
	case "pegaDadosTema":
		retornaJSON(pegaDados("SELECT * from i3geoadmin_atlast where id_tema = '$id_tema'"));
		exit;
	break;
	case "alterarAtlas":
		$novo = alterarAtlas();
		$sql = "SELECT * from i3geoadmin_atlas WHERE id_atlas = '".$novo."'";
		retornaJSON(pegaDados($sql));
		exit;
	break;
	case "alterarPrancha":
		$novo = alterarPrancha();
		$sql = "SELECT * from i3geoadmin_atlasp WHERE id_prancha = '".$novo."'";
		retornaJSON(pegaDados($sql));
		exit;
	break;
	case "alterarTema":
		$novo = alterarTema();
		$sql = "SELECT * from i3geoadmin_atlast WHERE id_tema = '".$novo."'";
		retornaJSON(pegaDados($sql));
	break;
	case "excluirAtlas":
		$tabela = "i3geoadmin_atlas";
		$f = verificaFilhos();
		if(!$f)
		retornaJSON(excluirAtlas());
		else
		retornaJSON("erro");	
		exit;
	break;
	case "excluirPrancha":
		$tabela = "i3geoadmin_atlasp";	
		$f = verificaFilhos();
		if(!$f)
		retornaJSON(excluirPrancha());
		else
		retornaJSON("erro");	
		exit;
	break;
	case "excluirTema":
		retornaJSON(excluirTema());
		exit;
	break;
	case "movimentaNo":
		movimentaNo();	
		retornaJSON("ok");
		exit;
	break;

	case "importarXmlAtlas":
		retornaJSON(importarXmlAtlas());
		exit;
	break;
}
function movimentaNo()
{
	global $tipo,$movimento,$id;
	if($tipo == "tema")
	{
		//pega a ordem atual
		$reg = pegaDados("SELECT ordem_tema,id_prancha from i3geoadmin_atlast where id_tema = '$id'");
		$ordematual = $reg[0]["ordem_tema"];
		$prancha = $reg[0]["id_prancha"];
		$where = " id_prancha = '$prancha' and";
		$posfixo = "tema";
		$tabela = "atlast";
	}
	if($tipo == "prancha")
	{
		//pega a ordem atual
		$reg = pegaDados("SELECT ordem_prancha,id_atlas from i3geoadmin_atlasp where id_prancha = '$id'");
		$ordematual = $reg[0]["ordem_prancha"];
		$atlas = $reg[0]["id_atlas"];
		$where = "id_atlas = '$atlas' and ";
		$posfixo = "prancha";
		$tabela = "atlasp";
	}
	if($tipo == "atlas")
	{
		//pega a ordem atual
		$ordematual = pegaDados("SELECT ordem_atlas from i3geoadmin_atlas where id_atlas = '$id'");
		$ordematual = $ordematual[0]["ordem_atlas"];
		$where = "";
		$posfixo = "atlas";
		$tabela = "atlas";
	}
	include("conexao.php");
	if($movimento == "sobe")
	{
		$menos = $ordematual - 1;
		$dbhw->query("UPDATE i3geoadmin_$tabela SET 'ordem_$posfixo' = $ordematual where $where ordem_$posfixo = '$menos'");
		$dbhw->query("UPDATE i3geoadmin_$tabela SET 'ordem_$posfixo' = $menos where id_$posfixo = '$id'");
	}	
	if($movimento == "desce")
	{
		$mais = $ordematual + 1;
		$dbhw->query("UPDATE i3geoadmin_$tabela SET 'ordem_$posfixo' = $ordematual where $where ordem_$posfixo = '$mais'");
		$dbhw->query("UPDATE i3geoadmin_$tabela SET 'ordem_$posfixo' = $mais where id_$posfixo = '$id'");
	}			
   	$dbhw = null;
   	$dbh = null;
   	return "ok";
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
	global $publicado_atlas,$id_atlas,$basemapfile_atlas,$desc_atlas,$h_atlas,$w_atlas,$icone_atlas,$link_atlas,$pranchadefault_atlas,$template_atlas,$tipoguias_atlas,$titulo_atlas,$ordem_atlas;
	try 
	{
    	include("conexao.php");
		if($convUTF)
		{
			$desc_atlas = utf8_encode($desc_atlas);
			$titulo_atlas = utf8_encode($titulo_atlas);
		}
    	if($id_atlas != "")
    	{
    		$dbhw->query("UPDATE i3geoadmin_atlas SET publicado_atlas='$publicado_atlas',ordem_atlas=$ordem_atlas,basemapfile_atlas='$basemapfile_atlas',desc_atlas='$desc_atlas',h_atlas=$h_atlas,w_atlas=$w_atlas,icone_atlas='$icone_atlas',link_atlas='$link_atlas',pranchadefault_atlas='$pranchadefault_atlas',template_atlas='$template_atlas',tipoguias_atlas='$tipoguias_atlas',titulo_atlas='$titulo_atlas' WHERE id_atlas = $id_atlas");
    		$retorna = $id_atlas;
    	}
    	else
    	{
			$o = $dbhw->query("SELECT MAX(ordem_atlas) as o FROM i3geoadmin_atlas");
			$o = $o->fetchAll();
			$o = $o[0]['o'] + 1;
    		$dbhw->query("INSERT INTO i3geoadmin_atlas (publicado_atlas,ordem_atlas,basemapfile_atlas,desc_atlas,h_atlas,w_atlas,icone_atlas,link_atlas,pranchadefault_atlas,template_atlas,tipoguias_atlas,titulo_atlas) VALUES ('',$o,'','',null,null,'','','','','','')");
			$id = $dbhw->query("SELECT id_atlas FROM i3geoadmin_atlas");
			$id = $id->fetchAll();
			$id = intval($id[count($id)-1]['id_atlas']);
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
function alterarPrancha()
{
	global $mapext_prancha,$id_atlas,$id_prancha,$desc_prancha,$h_prancha,$w_prancha,$icone_prancha,$link_prancha,$titulo_prancha,$ordem_prancha;
	try 
	{
    	include("conexao.php");
		if($convUTF)
		{
			$desc_prancha = utf8_encode($desc_prancha);
			$titulo_prancha = utf8_encode($titulo_prancha);
		}
    	if($id_prancha != "")
    	{
    		$dbhw->query("UPDATE i3geoadmin_atlasp SET ordem_prancha='$ordem_prancha', mapext_prancha='$mapext_prancha',desc_prancha='$desc_prancha',h_prancha='$h_prancha',w_prancha='$w_prancha',icone_prancha='$icone_prancha',link_prancha='$link_prancha',titulo_prancha='$titulo_prancha' WHERE id_prancha = '$id_prancha'");
    		$retorna = $id_prancha;
    	}
    	else
    	{
			$o = $dbhw->query("SELECT MAX(ordem_prancha) as o FROM i3geoadmin_atlasp WHERE id_atlas = '$id_atlas'");
			$o = $o->fetchAll();
			$o = $o[0]['o'] + 1;

    		$dbhw->query("INSERT INTO i3geoadmin_atlasp (ordem_prancha,mapext_prancha,desc_prancha,h_prancha,w_prancha,icone_prancha,link_prancha,titulo_prancha,id_atlas) VALUES ($o,'','','$h_prancha','$w_prancha','','','$titulo_prancha','$id_atlas')");
    		$id = $dbhw->query("SELECT id_prancha FROM i3geoadmin_atlasp");
			$id = $id->fetchAll();
			$id = intval($id[count($id)-1]['id_prancha']);
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
function alterarTema()
{
	global $id_tema,$id_prancha,$codigo_tema,$ligado_tema,$ordem_tema;
	try 
	{
    	include("conexao.php");
    	if($id_tema != "")
    	{
    		$dbhw->query("UPDATE i3geoadmin_atlast SET ordem_tema='$ordem_tema',codigo_tema='$codigo_tema',ligado_tema='$ligado_tema' WHERE id_tema='$id_tema'");
    		$retorna = $id_tema;
    	}
    	else
    	{
			$o = $dbhw->query("SELECT MAX(ordem_tema) as o FROM i3geoadmin_atlast where id_prancha = '$id_prancha'");
			$o = $o->fetchAll();
			$o = $o[0]['o'] + 1;

    		$dbhw->query("INSERT INTO i3geoadmin_atlast (ordem_tema,codigo_tema,ligado_tema,id_prancha) VALUES ($o,'','','$id_prancha')");
			$id = $dbhw->query("SELECT id_tema FROM i3geoadmin_atlast");
			$id = $id->fetchAll();
			$id = intval($id[count($id)-1]['id_tema']);
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
function excluirPrancha()
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
function excluirTema()
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
	set_time_limit(180);
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
	$contaAtlas = 0;
	foreach($xml->ATLAS as $atlas)
	{
		$titulo = html_entity_decode(ixml($atlas,"TITULO"));
		$desc = html_entity_decode(ixml($atlas,"DESCRICAO"));
		if($convUTF)
		{
			$titulo = utf8_encode($titulo);
			$desc = utf8_encode($desc);
		}
		$icone = ixml($atlas,"ICONE");
		$link = ixml($atlas,"LINKMAISINFO");
		$template = ixml($atlas,"TEMPLATEHTML");
		$w = ixml($atlas,"WABERTURA");
		$h = ixml($atlas,"HABERTURA");
		if($w == ""){$w = 'null';}
		if($h == ""){$h = 'null';}
		$pranchadefault = ixml($atlas,"PRANCHADEFAULT");
		$tipoguias = ixml($atlas,"TIPOGUIAS");
		$base = ixml($atlas,"BASEMAPFILE");
		if(!isset($atlasExistentes[$titulo]))
		$dbhw->query("INSERT INTO i3geoadmin_atlas (publicado_atlas,desc_atlas,h_atlas,w_atlas,icone_atlas,link_atlas,pranchadefault_atlas,template_atlas,tipoguias_atlas,titulo_atlas,ordem_atlas,basemapfile_atlas) VALUES ('','$desc',$h,$w,'$icone','$link','$pranchadefault','$template','$tipoguias','$titulo',$contaAtlas,'$base')");
		$atlasExistentes[$titulo] = 0;	
		$id_atlas = $dbhw->query("SELECT id_atlas FROM i3geoadmin_atlas");
		$id_atlas = $id_atlas->fetchAll();
		$id_atlas = intval($id_atlas[count($id_atlas)-1]['id_atlas']);
		$contaAtlas++;
		$contaPrancha = 0;
		foreach ($atlas->PRANCHAS->PRANCHA as $prancha)
		{
			$titulo = html_entity_decode(ixml($prancha,"TITULO"));
			$desc = html_entity_decode(ixml($prancha,"DESCRICAO"));
			if($convUTF)
			{
				$titulo = utf8_encode($titulo);
				$desc = utf8_encode($desc);
			}
			$icone = ixml($prancha,"ICONE");
			$link = ixml($prancha,"LINKMAISINFO");
			$w = ixml($prancha,"WABERUTRA");
			$h = ixml($prancha,"HABERTURA");
			if($w == ""){$w = 'null';}
			if($h == ""){$h = 'null';}
			$mapext = ixml($prancha,"MAPEXT");
			$dbhw->query("INSERT INTO i3geoadmin_atlasp (id_atlas,desc_prancha,h_prancha,w_prancha,icone_prancha,link_prancha,titulo_prancha,mapext_prancha,ordem_prancha) VALUES ('$id_atlas','$desc',$h,$w,'$icone','$link','$titulo','$mapext',$contaPrancha)");
			$id_prancha = $dbhw->query("SELECT id_prancha FROM i3geoadmin_atlasp");
			$id_prancha = $id_prancha->fetchAll();
			$id_prancha = intval($id_prancha[count($id_prancha)-1]['id_prancha']);
			$contaPrancha++;
			$contaTema = 0;
			foreach ($prancha->TEMAS->TEMA as $tema)
			{
				$codigo = ixml($tema,"CODIGO");
				$ligado = ixml($tema,"LIGADO");
				$dbhw->query("INSERT INTO i3geoadmin_atlast (id_prancha,codigo_tema,ligado_tema,ordem_tema) VALUES ('$id_prancha','$codigo','$ligado',$contaTema)");
				$contaTema++;
			}
		}
	}
	$dbhw = null;
	$dbh = null;
	return "Dados importados.";
}
?>