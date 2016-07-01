<?php
/*
Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Edmar Moretti
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma copia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
error_reporting(0);
//
//pega as variaveis passadas com get ou post
//
include_once(dirname(__FILE__)."/../../../admin/php/login.php");
$funcoesEdicao = array(
		"ALTERAROPERACOES",
		"ADICIONAPAPELOPERACOES",
		"EXCLUIRPAPELOPERACAO"
);
if(in_array(strtoupper($funcao),$funcoesEdicao)){
	if(verificaOperacaoSessao("admin/html/operacoes") == false){
		retornaJSON("Vc nao pode realizar essa operacao.");exit;
	}
}
switch (strtoupper($funcao))
{
	case "ALTERAROPERACOES":
		$novo = alterarOperacoes();
		$sql = "SELECT * from ".$esquemaadmin."i3geousr_operacoes WHERE id_operacao = ".$novo;
		retornaJSON(pegaDados($sql));
		exit;
	break;
	case "PEGAOPERACOESEPAPEIS":
		$operacoes = pegaDados("SELECT id_operacao,codigo,descricao from ".$esquemaadmin."i3geousr_operacoes order by codigo");
		$papeis = pegaDados("SELECT P.id_papel, P.nome, P.descricao, OP.id_operacao FROM ".$esquemaadmin."i3geousr_operacoes AS O JOIN ".$esquemaadmin."i3geousr_operacoespapeis AS OP ON O.id_operacao = OP.id_operacao JOIN ".$esquemaadmin."i3geousr_papeis AS P ON OP.id_papel = P.id_papel ");
		$o = array();
		$resultado = array();
		foreach ($operacoes as $operacao){
			//pega os papeis registrados para cada operacao
			$p = array();
			foreach ($papeis as $papel){
				if($papel["id_operacao"] == $operacao["id_operacao"]){
					$p[$papel["id_papel"]] = $papel;
				}
			}
			$operacao["papeis"] = $p;
			$o[] = $operacao;
		}
		$papeis = pegaDados("SELECT * from ".$esquemaadmin."i3geousr_papeis WHERE nome <> 'admin' order by nome");
		retornaJSON(array("operacoes"=>$o,"papeis"=>$papeis));
	break;
	case "PEGAOPERACOES":
		retornaJSON(pegaDados("SELECT id_operacao,codigo,descricao from ".$esquemaadmin."i3geousr_operacoes order by codigo"));
		exit;
	break;
	case "PEGAPAPEISOPERACAO":
		$dados = pegaDados("SELECT P.id_papel, P.nome, P.descricao, OP.id_operacao FROM ".$esquemaadmin."i3geousr_operacoes AS O JOIN ".$esquemaadmin."i3geousr_operacoespapeis AS OP ON O.id_operacao = OP.id_operacao JOIN ".$esquemaadmin."i3geousr_papeis AS P ON OP.id_papel = P.id_papel WHERE O.id_operacao = $id_operacao");
		$dados[] = array("id_papel"=>1,"nome"=>"admin","descricao"=>"admin");
		retornaJSON($dados);
		exit;
	break;
	case "PEGADADOSOPERACAO":
		retornaJSON(pegaDados("SELECT * from ".$esquemaadmin."i3geousr_operacoes WHERE id_operacao = $id_operacao"));
		exit;
	break;
	case "ADICIONAPAPELOPERACOES":
		adicionaPapelOperacoes();
		$dados = pegaDados("SELECT P.id_papel, P.nome, P.descricao, OP.id_operacao FROM ".$esquemaadmin."i3geousr_operacoes AS O JOIN ".$esquemaadmin."i3geousr_operacoespapeis AS OP ON O.id_operacao = OP.id_operacao JOIN ".$esquemaadmin."i3geousr_papeis AS P ON OP.id_papel = P.id_papel WHERE O.id_operacao = $id_operacao AND P.id_papel = $id_papel");
		retornaJSON($dados);
		exit;
	break;
	case "EXCLUIRPAPELOPERACAO":
		excluirPapelOperacao();
		retornaJSON("ok");
		exit;
		break;
	case "LISTAPAPEIS":
		retornaJSON(pegaDados("SELECT * from ".$esquemaadmin."i3geousr_papeis order by nome"));
		exit;
	break;
}
cpjson($retorno);
function alterarOperacoes(){
	global $id_operacao,$codigo,$descricao;
	try{
		include(dirname(__FILE__)."/conexao.php");
		if($convUTF){
			$descricao = utf8_encode($descricao);
		}
		if($id_operacao != ""){
			$dataCol = array(
				"codigo" => $codigo,
				"descricao" => $descricao
			);
			i3GeoAdminUpdate($dbhw,"i3geousr_operacoes",$dataCol,"WHERE id_operacao = $id_operacao");
			$retorna = $id_operacao;
		}
		else{
			$dataCol = array(
					"descricao" => ''
			);
			$retorna = i3GeoAdminInsertUnico($dbhw,"i3geousr_operacoes",$dataCol,"descricao","id_operacao");
		}
		$dbhw = null;
		$dbh = null;
		return $retorna;
	}
	catch (PDOException $e){
		return "Error!: " . $e->getMessage();
	}
}
function adicionaPapelOperacoes(){
	global $id_operacao,$id_papel;
	try{
		include(dirname(__FILE__)."/conexao.php");
		$dataCol = array(
				"id_operacao" => $id_operacao,
				"id_papel" => $id_papel
		);
		i3GeoAdminInsert($dbhw,"i3geousr_operacoespapeis",$dataCol);
		$dbhw = null;
		$dbh = null;
		return "ok";
	}
	catch (PDOException $e){
		return "Error!: " . $e->getMessage();
	}
}
function excluirPapelOperacao(){
	global $id_operacao,$id_papel;
	try{
		include(dirname(__FILE__)."/conexao.php");
		$sql = "DELETE from ".$esquemaadmin."i3geousr_operacoespapeis WHERE id_operacao = $id_operacao AND id_papel = $id_papel";
		$dbhw->query($sql);
		i3GeoAdminInsertLog($dbhw,$sql);
		$dbhw = null;
		$dbh = null;
		return "ok";
	}
	catch (PDOException $e){
		return "Error!: " . $e->getMessage();
	}
}
?>
