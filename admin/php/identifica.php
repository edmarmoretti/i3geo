<?php
/*
Title: identifica.php

Fun&ccedil;&otilde;es utilizadas pelo editor das op&ccedil;&otilde;es de identifica&ccedil;&atilde;o

Essas op&ccedil;&otilde;es s&atilde;o utilizadas na ferramenta de identifica&ccedil;&atilde;o de elementos do mapa

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
Voc&ecirc; deve ter recebido uma c�pia da Licen&ccedil;a P&uacute;blica Geral do
	GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/admin/php/identifica.php

Parametros:

O par&acirc;metro principal &eacute; "funcao", que define qual opera&ccedil;&atilde;o ser&aacute; executada, por exemplo, identifica.php?funcao=pegafuncoes

Cada opera&ccedil;&atilde;o possu&iacute; seus pr�prios par&acirc;metros, que devem ser enviados tamb&eacute;m na requisi&ccedil;&atilde;o da opera&ccedil;&atilde;o.

*/
include_once(dirname(__FILE__)."/login.php");
$funcoesEdicao = array(
		"ALTERARFUNCOES",
		"EXCLUIR"

);
if(in_array(strtoupper($funcao),$funcoesEdicao)){
	if(verificaOperacaoSessao("admin/html/identifica") == false){
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
		Valor: PEGAFUNCOES

		Lista de opera&ccedil;&otilde;es cadastradas

		Retorno:

		{JSON}
		*/
	case "PEGAFUNCOES":
		if(isset($id_i) && $id_i != ""){
			$dados = pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_identifica where id_i = $id_i order by nome_i");
		}
		else{
			$dados = pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_identifica order by nome_i");
		}
		retornaJSON($dados);
		exit;
		break;
		/*
		Valor: ALTERARFUNCOES

		Altera uma opera&ccedil;&atilde;o cadastrada

		Parametros:

		id_i - id da op&ccedil;&atilde;o

		abrir_i

		nome_i

		target_i

		publicado_i

		Retorno:

		{JSON}
		*/
	case "ALTERARFUNCOES":
		$novo = alterarFuncoes();
		$sql = "SELECT * from ".$esquemaadmin."i3geoadmin_identifica WHERE id_i = '".$novo."'";
		retornaJSON(pegaDados($sql));
		exit;
		break;
		/*
		Valor: EXCLUIR

		Exclui uma opera&ccedil;&atilde;o cadastrada

		Parametros:

		id - id da op&ccedil;&atilde;o

		Retorno:

		{JSON}
		*/
	case "EXCLUIR":
		retornaJSON(excluirFuncoes());
		exit;
		break;
}
/*
Altera o registro de um WS
*/
function alterarFuncoes(){
	global $id_i,$abrir_i,$nome_i,$target_i,$publicado_i,$esquemaadmin;
	try{
		//$nome_i = mb_convert_encoding($nome_i,"UTF-8","ISO-8859-1");
		require_once("conexao.php");
		if($convUTF){
			$nome_i = utf8_encode($nome_i);
		}
		if($id_i != ""){
			$dataCol = array(
				"publicado_i" => $publicado_i,
				"nome_i" => $nome_i,
				"abrir_i" => $abrir_i,
				"target_i" => $target_i
			);
			i3GeoAdminUpdate($dbhw,"i3geoadmin_identifica",$dataCol,"WHERE id_i = $id_i");
			$retorna = $id_i;
		}
		else{
			$dataCol = array(
				"publicado_i" => '',
				"nome_i" => '',
				"abrir_i" => '',
				"target_i" => ''
			);
			$retorna = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_identifica",$dataCol,"nome_i","id_i");
		}
		$dbhw = null;
		$dbh = null;
		return $retorna;
	}
	catch (PDOException $e){
		return "Error!: ";
	}
}
function excluirFuncoes(){
	global $id,$esquemaadmin;
	try{
		exclui($esquemaadmin."i3geoadmin_identifica","id_i",$id);
		return "ok";
	}
	catch (PDOException $e){
		return "Error!: ";
	}
}
?>