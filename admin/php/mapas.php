<?php
/*
Title: Administração do menu de mapas

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

File: i3geo/admin/mapas.php

19/6/2007

*/
include_once("admin.php");
//faz a busca da função que deve ser executada
switch ($funcao)
{
	case "pegaMapas":
	retornaJSON(pegaDados('SELECT id_mapa,nome_mapa,ordem_mapa from i3geoadmin_mapas order by ordem_mapa'));
	exit;
	break;

	case "pegaDadosMapa":
	$dadosMapa = pegaDados('SELECT * from i3geoadmin_mapas where id_mapa ='.$id_mapa);
	retornaJSON($dadosMapa);
	exit;
	break;

	case "alterarMapa":
	$novo = alterarMapa();
	$sql = "SELECT * from i3geoadmin_mapas WHERE id_mapa = '".$novo."'";
	retornaJSON(pegaDados($sql));
	exit;
	break;
	
	case "excluirMapa":
	retornaJSON(excluirMapa());
	exit;
	break;
	
	case "importarXmlMapas":
	retornaJSON(importarXmlMapas());
	exit;
	break;
}
/*
Function: alterarMapas

Altera o registro de um mapa
*/
function alterarMapa()
{
	global $publicado_mapa,$ordem_mapa,$id_mapa,$desc_mapa,$ext_mapa,$imagem_mapa,$outros_mapa,$nome_mapa,$linkdireto_mapa,$temas_mapa,$ligados_mapa,$perfil_mapa;
	try 
	{
		//$nome = mb_convert_encoding($nome,"UTF-8","ISO-8859-1");
		//$desc = mb_convert_encoding($desc,"UTF-8","ISO-8859-1");
    	require_once("conexao.php");
    	$retorna = "";
    	if($id_mapa != "")
    	{
    		$dbhw->query("UPDATE i3geoadmin_mapas SET publicado_mapa='$publicado_mapa',ordem_mapa='$ordem_mapa',desc_mapa = '$desc_mapa',ext_mapa = '$ext_mapa',imagem_mapa = '$imagem_mapa',outros_mapa = '$outros_mapa',nome_mapa = '$nome_mapa', linkdireto_mapa = '$linkdireto_mapa',temas_mapa = '$temas_mapa',ligados_mapa = '$ligados_mapa',perfil_mapa = '$perfil_mapa' WHERE id_mapa = $id_mapa");
    		$retorna = $id_mapa;
    	}
    	else
    	{
    		$dbhw->query("INSERT INTO i3geoadmin_mapas (publicado_mapa,ordem_mapa,perfil_mapa,desc_mapa,ext_mapa,imagem_mapa,linkdireto_mapa,outros_mapa,temas_mapa,ligados_mapa,nome_mapa) VALUES ('','','','','','','','','','','')");
			$id = $dbh->query("SELECT * FROM i3geoadmin_mapas");
			$id = $id->fetchAll();
			$id = intval($id[count($id)-1]['id_mapa']);
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
function excluirMapa()
{
	global $id;
	try 
	{
    	include("conexao.php");
    	$dbhw->query("DELETE from i3geoadmin_mapas WHERE id_mapa = $id");
    	$dbhw = null;
    	$dbh = null;
    	return "ok";
	}
	catch (PDOException $e)
	{
    	return "Error!: " . $e->getMessage();
	}
}
function importarXmlMapas()
{
	global $xml;
	if(!file_exists($xml))
	{return "<br><b>Arquivo $xml n&atilde;o encontrado";}
	include_once("../../classesphp/funcoes_gerais.php");
	include("conexao.php");
	$xml = simplexml_load_file($xml);
	//
	//importa os grupos
	//
	$mapasExistentes = array();
	$q = $dbhw->query("select * from i3geoadmin_mapas");
	$resultado = $q->fetchAll();
	foreach($resultado as $r)
	{$mapasExistentes[$r["nome_mapa"]] = 0;}
	foreach($xml->MAPA as $mapa)
	{
		$perfil = ixml($mapa,"PERFIL");
		$descricao = html_entity_decode(ixml($mapa,"DESCRICAO"));
		//$descricao = mb_convert_encoding($descricao,"UTF-8","ISO-8859-1");
		$nome = html_entity_decode(ixml($mapa,"NOME"));
		//$nome = mb_convert_encoding($nome,"UTF-8","ISO-8859-1");
		$imagem = ixml($mapa,"IMAGEM");
		$temas = ixml($mapa,"TEMAS");
		$ligados = ixml($mapa,"LIGADOS");
		$extensao = ixml($mapa,"EXTENSAO");
		$outros = ixml($mapa,"OUTROS");
		$linkdireto = ixml($mapa,"LINKDIRETO");
		if(!isset($mapasExistentes[$nome]))
		$dbhw->query("INSERT INTO i3geoadmin_mapas (publicado_mapa,perfil_mapa,desc_mapa,ext_mapa,imagem_mapa,linkdireto_mapa,nome_mapa,outros_mapa,temas_mapa,ligados_mapa) VALUES ('','$perfil','$descricao','$extensao','$imagem','$linkdireto','$nome','$outros','$temas','$ligados')");
		$mapasExistentes[$nome] = 0;
	}
	$dbhw = null;
	$dbh = null;
	return "Dados importados.";
}
?>