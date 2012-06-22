<?php
/*
Title: mapas.php

Funções utilizadas pelo editor do cadastro de mapas (links).

É utilizado nas funções em AJAX da interface de edição dos links para mapas

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

i3geo/admin/php/mapas.php

Parametros:

O parâmetro principal é "funcao", que define qual operação será executada, por exemplo, mapas.php?funcao=pegamapas.

Cada operação possuí seus próprios parâmetros, que devem ser enviados também na requisição da operação.

*/
include_once("admin.php");
error_reporting(0);
//faz a busca da função que deve ser executada
switch (strtoupper($funcao))
{
	/*
	Note:
	
	Valores que o parâmetro &funcao pode receber. Os parâmetros devem ser enviados na requisição em AJAX.
	*/
	/*
	Valor: PEGAMAPAS
	
	Lista os links existentes
	
	Retorno:
	
	{JSON}
	*/
	case "PEGAMAPAS":
	retornaJSON(pegaDados("SELECT id_mapa,nome_mapa,ordem_mapa from ".$esquemaadmin."i3geoadmin_mapas order by ordem_mapa"));
	exit;
	break;
	/*
	Valor: PEGADADOSMAPA
	
	Lista os dados de um link
	
	Parametro:
	
	id_mapa {string}
	
	Retorno:
	
	{JSON}
	*/
	case "PEGADADOSMAPA":
	$dadosMapa = pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_mapas where id_mapa =".$id_mapa);
	retornaJSON($dadosMapa);
	exit;
	break;
	/*
	Valor: ALTERARMAPA
	
	Altera os dados de um link
	
	Parametro:
	
	publicado_mapa
	
	ordem_mapa
	
	id_mapa
	
	desc_mapa
	
	ext_mapa
	
	imagem_mapa
	
	outros_mapa
	
	nome_mapa
	
	linkdireto_mapa
	
	temas_mapa
	
	ligados_mapa
	
	perfil_mapa
	
	Retorno:
	
	{JSON}
	*/
	case "ALTERARMAPA":
	if(verificaEditores($editores) == "nao")
	{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
	$novo = alterarMapa();
	$sql = "SELECT * from ".$esquemaadmin."i3geoadmin_mapas WHERE id_mapa = '".$novo."'";
	retornaJSON(pegaDados($sql));
	exit;
	break;
	/*
	Valor: EXCLUIRMAPA
	
	Exclui um link
	
	Parametro:
	
	id {string}
	
	Retorno:
	
	{JSON}
	*/	
	case "EXCLUIRMAPA":
	if(verificaEditores($editores) == "nao")
	{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
	retornaJSON(excluirMapa());
	exit;
	break;
	
	case "IMPORTARXMLMAPAS":
	if(verificaEditores($editores) == "nao")
	{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
	retornaJSON(importarXmlMapas());
	exit;
	break;
}
/*
Altera o registro de um mapa
*/
function alterarMapa()
{
	global $esquemaadmin,$publicado_mapa,$ordem_mapa,$id_mapa,$desc_mapa,$ext_mapa,$imagem_mapa,$outros_mapa,$nome_mapa,$linkdireto_mapa,$temas_mapa,$ligados_mapa,$perfil_mapa;
	try 
	{
    	require_once("conexao.php");
		if($convUTF)
		{
			$nome_mapa = utf8_encode($nome_mapa);
			$desc_mapa = utf8_encode($desc_mapa);
		}
    	$retorna = "";
    	if($id_mapa != "")
    	{
    		$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_mapas SET publicado_mapa='$publicado_mapa',ordem_mapa='$ordem_mapa',desc_mapa = '$desc_mapa',ext_mapa = '$ext_mapa',imagem_mapa = '$imagem_mapa',outros_mapa = '$outros_mapa',nome_mapa = '$nome_mapa', linkdireto_mapa = '$linkdireto_mapa',temas_mapa = '$temas_mapa',ligados_mapa = '$ligados_mapa',perfil_mapa = '$perfil_mapa' WHERE id_mapa = $id_mapa");
    		$retorna = $id_mapa;
    	}
    	else
    	{
    		$idtemp = (rand (9000,10000)) * -1;
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_mapas (publicado_mapa,ordem_mapa,perfil_mapa,desc_mapa,ext_mapa,imagem_mapa,linkdireto_mapa,outros_mapa,temas_mapa,ligados_mapa,nome_mapa) VALUES ('','','','','','','','','','','$id_temp')");
			$id = $dbh->query("SELECT * FROM ".$esquemaadmin."i3geoadmin_mapas WHERE nome_mapa = '$id_temp'");
			$id = $id->fetchAll();
			$id = $id[0]['id_mapa'];
			$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_mapas SET nome_mapa = '' WHERE id_mapa = $id AND nome_mapa = '$idtemp'");
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
	global $id,$esquemaadmin;
	try 
	{
    	include("conexao.php");
    	$dbhw->query("DELETE from ".$esquemaadmin."i3geoadmin_mapas WHERE id_mapa = $id");
    	$dbhw = null;
    	$dbh = null;
    	return "ok";
	}
	catch (PDOException $e)
	{
    	return "Error!: " . $e->getMessage();
	}
}
?>