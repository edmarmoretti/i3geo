<?php
/*
 Title: webservices.php

Fun&ccedil;&otilde;es utilizadas pelo editor do cadastro de Web Services

&Eacute; utilizado nas fun&ccedil;&otilde;es em AJAX da interface de edi&ccedil;&atilde;o

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

i3geo/admin/php/webservices.php

Parametros:

O par&acirc;metro principal &eacute; "funcao", que define qual opera&ccedil;&atilde;o ser&aacute; executada, por exemplo, webservices.php?funcao=pegaws

Cada opera&ccedil;&atilde;o possu&iacute; seus próprios par&acirc;metros, que devem ser enviados tamb&eacute;m na requisi&ccedil;&atilde;o da opera&ccedil;&atilde;o.

*/
error_reporting(0);
//
//n&atilde;o sei pq mas ob_start e clean s&atilde;o necess&aacute;rios no Linux para n&atilde;o gerar erro indesejado
//
include_once(dirname(__FILE__)."/login.php");

$id_ws = $_GET["id_ws"];
$id = $_GET["id"];

testaSafeNumerico([$id,$id_ws]);

$funcoesEdicao = array(
		"ALTERARWS",
		"EXCLUIR"
);
if(in_array(strtoupper($funcao),$funcoesEdicao)){
	if(verificaOperacaoSessao("admin/html/webservices") == false){
		retornaJSON("Vc nao pode realizar essa operacao.");exit;
	}
}
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
switch (strtoupper($funcao))
{
	/*
	 Note:

	Valores que o par&acirc;metro &funcao pode receber. Os par&acirc;metros devem ser enviados na requisi&ccedil;&atilde;o em AJAX.
	*/
	/*
	 Valor: PEGAWS

	Lista de servi&ccedil;os cadastrados

	Retorno:

	{JSON}
	*/
	case "PEGAWS":
		if(isset($tipows) && $tipows != "")	{
			$sql = "SELECT id_ws,nome_ws,tipo_ws from ".$esquemaadmin."i3geoadmin_ws where tipo_ws = '".strtoupper($_GET["tipows"])."' order by tipo_ws,nome_ws ";
		}
		else{
			$sql = "SELECT id_ws,nome_ws,tipo_ws from ".$esquemaadmin."i3geoadmin_ws order by tipo_ws,nome_ws";
		}
		retornaJSON(pegaDados($sql));
		exit;
		break;
		/*
		 Valor: PEGADADOS

		Dados de um servico

		Parametro:

		id_ws {string}

		Retorno:

		{JSON}
		*/
	case "PEGADADOS":
		retornaJSON(pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_ws where id_ws='$id_ws'"));
		exit;
		break;
		/*
		 Valor: ALTERARWS

		Altera um registro

		Parametros:

		id_ws

		desc_ws

		nome_ws

		link_ws

		autor_ws

		tipo_ws

		Retorno:

		{JSON}
		*/
	case "ALTERARWS":
		$novo = alterarWS();
		$sql = "SELECT * from ".$esquemaadmin."i3geoadmin_ws WHERE id_ws = '".$novo."'";
		retornaJSON(pegaDados($sql));
		exit;
		break;
		/*
		 Valor: EXCLUIR

		Exclui um registro

		Parametro:

		id {string}

		Retorno:

		{JSON}
		*/
	case "EXCLUIR":
		retornaJSON(excluirWS());
		exit;
		break;

}
/*
 Altera o registro de um WS
*/
function alterarWS(){
    return;
}
function excluirWS(){
    return;
}
function adicionaAcesso($id_ws,$sucesso){
	return;
}
?>