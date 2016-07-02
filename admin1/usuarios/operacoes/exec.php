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
		"ADICIONAROPERACAO",
		"ALTERAROPERACAO",
		"ADICIONAPAPELOPERACOES",
		"EXCLUIRPAPELOPERACAO"
);
if(in_array(strtoupper($funcao),$funcoesEdicao)){
	if(verificaOperacaoSessao("admin/html/operacoes") == false){
		retornaJSON("Vc nao pode realizar essa operacao.");exit;
	}
}
include(dirname(__FILE__)."/../../../admin/php/conexao.php");
$funcao = strtoupper($funcao);
//converte os parametros de definicao dos papeis em um array
if($funcao == "ADICIONAROPERACAO" || $funcao == "ALTERAROPERACAO"){
	$papeis = array();
	$papeis[] = 1; //admin
	foreach(array_keys($_POST) as $k){
		$teste = explode("-",$k);
		if($teste[0] == "id_papel"){
			$papeis[] = $teste[1]*1;
		}
	}
	array_unique($papeis);
}
switch ($funcao)
{
	case "ADICIONAROPERACAO":
		$novo = adicionarOperacao($codigo,$descricao,$papeis,$dbhw);
		if($novo != false){
			$sql = "SELECT * from ".$esquemaadmin."i3geousr_operacoes WHERE id_operacao = ".$novo;
			$dados = pegaDados($sql,$dbh);
			retornaJSON($dados);
		}
		else{
			retornaJSON("erro");
		}
		exit;
		break;
	case "ALTERAROPERACAO":
		$novo = alterarOperacao($id_operacao,$codigo,$descricao,$papeis,$dbhw);
		$sql = "SELECT * from ".$esquemaadmin."i3geousr_operacoes WHERE id_operacao = ".$novo;
		retornaJSON(pegaDados($sql,$dbh));
		exit;
	break;
	case "PEGAOPERACOESEPAPEIS":
		$operacoes = pegaDados("SELECT id_operacao,codigo,descricao from ".$esquemaadmin."i3geousr_operacoes order by codigo",$dbh,false);
		$papeis = pegaDados("SELECT P.id_papel, P.nome, P.descricao, OP.id_operacao FROM ".$esquemaadmin."i3geousr_operacoes AS O JOIN ".$esquemaadmin."i3geousr_operacoespapeis AS OP ON O.id_operacao = OP.id_operacao JOIN ".$esquemaadmin."i3geousr_papeis AS P ON OP.id_papel = P.id_papel ",$dbh,false);
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
		$papeis = pegaDados("SELECT * from ".$esquemaadmin."i3geousr_papeis order by nome",$dbh);
		$dbhw = null;
		$dbh = null;
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
		$retorna = excluirPapelOperacao($id_operacao,$id_papel,$dbhw);
		$dbhw = null;
		$dbh = null;
		retornaJSON($retorna);
		exit;
		break;
	case "LISTAPAPEIS":
		retornaJSON(pegaDados("SELECT * from ".$esquemaadmin."i3geousr_papeis order by nome"));
		exit;
	break;
}
cpjson($retorno);
//$papeis deve ser um array
function adicionarOperacao($codigo,$descricao,$papeis,$dbhw){
	global $esquemaadmin;
	try{
		$dataCol = array(
			"descricao" => ''
		);
		$id_operacao = i3GeoAdminInsertUnico($dbhw,"i3geousr_operacoes",$dataCol,"descricao","id_operacao");
		$retorna = alterarOperacao($id_operacao,$codigo,$descricao,$papeis,$dbhw);
		return $retorna;
	}
	catch (PDOException $e){
		return false;
	}
}
//$papeis deve ser um array
function alterarOperacao($id_operacao,$codigo,$descricao,$papeis,$dbhw){
	global $esquemaadmin;
	try{
		if($convUTF){
			$descricao = utf8_encode($descricao);
		}
		$dataCol = array(
			"codigo" => $codigo,
			"descricao" => $descricao
		);
		i3GeoAdminUpdate($dbhw,"i3geousr_operacoes",$dataCol,"WHERE id_operacao = $id_operacao");
		//apaga todos os papeis
		excluirPapelOperacao($id_operacao,"",$dbhw);
		if(!empty($papeis)){
			//atualiza papeis vinculados
			foreach($papeis as $p){
				adicionaPapelOperacao($id_operacao,$p,$dbhw);
			}
		}
		$retorna = $id_operacao;
		return $retorna;
	}
	catch (PDOException $e){
		return false;
	}
}
function adicionaPapelOperacao($id_operacao,$id_papel,$dbhw){
	global $esquemaadmin;
	try{
		$dataCol = array(
				"id_operacao" => $id_operacao,
				"id_papel" => $id_papel
		);
		i3GeoAdminInsert($dbhw,"i3geousr_operacoespapeis",$dataCol);
		return true;
	}
	catch (PDOException $e){
		return false;
	}
}
function excluirPapelOperacao($id_operacao,$id_papel,$dbhw){
	global $esquemaadmin;
	try{
		if($id_papel == ""){
			$sql = "DELETE from ".$esquemaadmin."i3geousr_operacoespapeis WHERE id_operacao = $id_operacao";
		}
		else{
			$sql = "DELETE from ".$esquemaadmin."i3geousr_operacoespapeis WHERE id_operacao = $id_operacao AND id_papel = $id_papel";
		}
		$dbhw->query($sql);
		i3GeoAdminInsertLog($dbhw,$sql);
		return true;
	}
	catch (PDOException $e){
		return false;
	}
}
?>
