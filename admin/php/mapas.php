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
$cp = new cpaint();
//faz a busca da função que deve ser executada
switch ($funcao)
{
	//verifica os editores
	case "verificaEditores":
	$cp->set_data(verificaEditores($editores));
	$cp->return_data();
	break;
	
	case "pegaMapas":
	$cp->set_data(pegaDados('SELECT id_mapa,nome_mapa from i3geoadmin_mapas order by ordem_mapa'));
	$cp->return_data();
	break;

	case "pegaDadosMapa":
	$dadosMapa = pegaDados('SELECT * from i3geoadmin_mapas where id_mapa ='.$id_mapa);
	$cp->set_data(array("mapa"=>$dadosMapa));
	$cp->return_data();
	break;

	case "alterarMapa":
	$cp->set_data(alterarMapa());
	$cp->return_data();
	break;
	
	case "excluir":
	$cp->set_data(excluirMapa());
	$cp->return_data();
	break;
	
	case "importarXmlMapas":
	$cp->set_data(importarXmlMapas());
	$cp->return_data();
	break;
}
/*
Function: alterarMapas

Altera o registro de um mapa
*/
function alterarMapa()
{
	global $ordem_mapa,$id_mapa,$desc,$ext,$imagem,$outros,$nome,$linkdireto,$temas,$ligados,$perfil;
	try 
	{
		//$nome = mb_convert_encoding($nome,"UTF-8","ISO-8859-1");
		//$desc = mb_convert_encoding($desc,"UTF-8","ISO-8859-1");
    	require_once("conexao.php");
    	if($id_mapa != "")
    	$dbhw->query("UPDATE i3geoadmin_mapas SET ordem_mapa='$ordem_mapa',desc_mapa = '$desc',ext_mapa = '$ext',imagem_mapa = '$imagem',outros_mapa = '$outros',nome_mapa = '$nome', linkdireto_mapa = '$linkdireto',temas_mapa = '$temas',ligados_mapa = '$ligados',perfil_mapa = '$perfil' WHERE id_mapa = $id_mapa");
    	else
    	$dbhw->query("INSERT INTO i3geoadmin_mapas (ordem_mapa,perfil_mapa,desc_mapa,ext_mapa,imagem_mapa,linkdireto_mapa,outros_mapa,temas_mapa,ligados_mapa,nome_mapa) VALUES ('','','','','','','','','','$nome')");
    	$dbhw = null;
    	$dbh = null;
    	return "ok";
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
		$descricao = ixml($mapa,"DESCRICAO");
		//$descricao = mb_convert_encoding($descricao,"UTF-8","ISO-8859-1");
		$nome = ixml($mapa,"NOME");
		//$nome = mb_convert_encoding($nome,"UTF-8","ISO-8859-1");
		$imagem = ixml($mapa,"IMAGEM");
		$temas = ixml($mapa,"TEMAS");
		$ligados = ixml($mapa,"LIGADOS");
		$extensao = ixml($mapa,"EXTENSAO");
		$outros = ixml($mapa,"OUTROS");
		$linkdireto = ixml($mapa,"LINKDIRETO");
		if(!isset($mapasExistentes[$nome]))
		$dbhw->query("INSERT INTO i3geoadmin_mapas (perfil_mapa,desc_mapa,ext_mapa,imagem_mapa,linkdireto_mapa,nome_mapa,outros_mapa,temas_mapa,ligados_mapa) VALUES ('$perfil','$descricao','$extensao','$imagem','$linkdireto','$nome','$outros','$temas','$ligados')");
		$mapasExistentes[$nome] = 0;
	}
	$dbhw = null;
	$dbh = null;
	return "Dados importados.";
}
?>