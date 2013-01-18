<?php
/*
 Title: mapas.php

Fun&ccedil;&otilde;es utilizadas pelo editor do cadastro de mapas (links).

&Eacute; utilizado nas fun&ccedil;&otilde;es em AJAX da interface de edi&ccedil;&atilde;o dos links para mapas

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

i3geo/admin/php/mapas.php

Parametros:

O par&acirc;metro principal &eacute; "funcao", que define qual opera&ccedil;&atilde;o ser&aacute; executada, por exemplo, mapas.php?funcao=pegamapas.

Cada opera&ccedil;&atilde;o possu&iacute; seus próprios par&acirc;metros, que devem ser enviados tamb&eacute;m na requisi&ccedil;&atilde;o da opera&ccedil;&atilde;o.

*/
include_once(__DIR__."/login.php");
$funcoesEdicao = array(
		"ALTERARMAPA",
		"EXCLUIRMAPA"
);
if(in_array(strtoupper($funcao),$funcoesEdicao)){
	if(verificaOperacaoSessao("admin/html/mapas") == false){
		retornaJSON("Vc nao pode realizar essa operacao.");exit;
	}
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
	 Valor: PEGAMAPAS

	Lista os links existentes

	Retorno:

	{JSON}
	*/
	case "PEGAMAPAS":
		$semmapfile = pegaDados("SELECT id_mapa,nome_mapa,ordem_mapa,'nao' as contemmapfile from ".$esquemaadmin."i3geoadmin_mapas where mapfile = '' or mapfile is null order by ordem_mapa");
		$commapfile = pegaDados("SELECT id_mapa,nome_mapa,ordem_mapa,'sim' as contemmapfile from ".$esquemaadmin."i3geoadmin_mapas where mapfile != '' and mapfile is not null order by ordem_mapa");
		retornaJSON(array_merge($semmapfile,$commapfile));
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
		retornaJSON(excluirMapa());
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
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_mapas (publicado_mapa,ordem_mapa,perfil_mapa,desc_mapa,ext_mapa,imagem_mapa,linkdireto_mapa,outros_mapa,temas_mapa,ligados_mapa,nome_mapa) VALUES ('',0,'','','','','','','','','$id_temp')");
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