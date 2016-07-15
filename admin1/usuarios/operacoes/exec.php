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
		"ADICIONAR",
		"ALTERAR",
		"EXCLUIR"
);
if(in_array(strtoupper($funcao),$funcoesEdicao)){
	if(verificaOperacaoSessao("admin/html/operacoes") === false){
		header("HTTP/1.1 403 Vc nao pode realizar essa operacao");exit;
	}
}
include(dirname(__FILE__)."/../../../admin/php/conexao.php");
$funcao = strtoupper($funcao);
//converte os parametros de definicao dos papeis em um array
if($funcao == "ADICIONAR" || $funcao == "ALTERAR"){
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
	case "ADICIONAR":
		$novo = adicionar($codigo,$descricao,$papeis,$dbhw);
		if($novo != false){
			$sql = "SELECT * from ".$esquemaadmin."i3geousr_operacoes WHERE id_operacao = ".$novo;
			$dados = pegaDados($sql,$dbh);
			if($dados === false){
				header("HTTP/1.1 500 erro ao consultar banco de dados");
				exit;
			}
			retornaJSON($dados);
		}
		else{
			header("HTTP/1.1 500 erro ao consultar banco de dados");
			exit;
		}
		exit;
		break;
	case "ALTERAR":
		$novo = alterar($id_operacao,$codigo,$descricao,$papeis,$dbhw);
		if($novo === false){
			header("HTTP/1.1 500 erro ao consultar banco de dados");
			exit;
		}
		$sql = "SELECT * from ".$esquemaadmin."i3geousr_operacoes WHERE id_operacao = ".$novo;
		$dados = pegaDados($sql,$dbh);
		if($dados === false){
			header("HTTP/1.1 500 erro ao consultar banco de dados");
			exit;
		}
		retornaJSON($dados);
		exit;
	break;
	case "LISTA":
		$operacoes = pegaDados("SELECT id_operacao,codigo,descricao from ".$esquemaadmin."i3geousr_operacoes order by codigo",$dbh,false);
		$papeis = pegaDados("SELECT P.id_papel, P.nome, P.descricao, OP.id_operacao FROM ".$esquemaadmin."i3geousr_operacoes AS O JOIN ".$esquemaadmin."i3geousr_operacoespapeis AS OP ON O.id_operacao = OP.id_operacao JOIN ".$esquemaadmin."i3geousr_papeis AS P ON OP.id_papel = P.id_papel ",$dbh,false);
		if($operacoes === false || $papeis === false){
			$dbhw = null;
			$dbh = null;
			header("HTTP/1.1 500 erro ao consultar banco de dados");
			exit;
		}
		$o = array();
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
		if($papeis === false){
			header("HTTP/1.1 500 erro ao consultar banco de dados");
			exit;
		}
		retornaJSON(array("operacoes"=>$o,"papeis"=>$papeis));
	break;
	case "EXCLUIR":
		$retorna = excluir($id_operacao,$dbhw);
		$dbhw = null;
		$dbh = null;
		if($retorna === false){
			header("HTTP/1.1 500 erro ao consultar banco de dados");
			exit;
		}
		retornaJSON($id_operacao);
		exit;
	break;
}
cpjson($retorno);
//$papeis deve ser um array
function adicionar($codigo,$descricao,$papeis,$dbhw){
	global $esquemaadmin;
	try{
		$dataCol = array(
			"descricao" => ''
		);
		$id_operacao = i3GeoAdminInsertUnico($dbhw,"i3geousr_operacoes",$dataCol,"descricao","id_operacao");
		$retorna = alterar($id_operacao,$codigo,$descricao,$papeis,$dbhw);
		return $retorna;
	}
	catch (PDOException $e){
		return false;
	}
}
//$papeis deve ser um array
function alterar($id_operacao,$codigo,$descricao,$papeis,$dbhw){
	global $esquemaadmin;
	if($convUTF){
		$descricao = utf8_encode($descricao);
	}
	$dataCol = array(
		"codigo" => $codigo,
		"descricao" => $descricao
	);
	$resultado = i3GeoAdminUpdate($dbhw,"i3geousr_operacoes",$dataCol,"WHERE id_operacao = $id_operacao");
	if($resultado === false){
		return false;
	}
	//apaga todos os papeis
	$resultado = excluirPapeis($id_operacao,$dbhw);
	if($resultado === false){
		return false;
	}
	if(!empty($papeis)){
		//atualiza papeis vinculados
		foreach($papeis as $p){
			$resultado = adicionaPapel($id_operacao,$p,$dbhw);
			if($resultado === false){
				return false;
			}
		}
	}
	return $id_operacao;
}
function adicionaPapel($id_operacao,$id_papel,$dbhw){
	global $esquemaadmin;
	$dataCol = array(
			"id_operacao" => $id_operacao,
			"id_papel" => $id_papel
	);
	$resultado = i3GeoAdminInsert($dbhw,"i3geousr_operacoespapeis",$dataCol);
	return $resultado;
}
function excluir($id_operacao,$dbhw){
	global $esquemaadmin;
	$resultado = i3GeoAdminExclui($esquemaadmin."i3geousr_operacoes","id_operacao",$id_operacao,$dbhw,false);
	if($resultado === false){
		return false;
	}
	if($resultado === true){
		$resultado = excluirPapeis($id_operacao,$dbhw);
	}
	return $resultado;
}
function excluirPapeis($id_operacao,$dbhw){
	global $esquemaadmin;
	$resultado = i3GeoAdminExclui($esquemaadmin."i3geousr_operacoespapeis","id_operacao",$id_operacao,$dbhw,false);
	return $resultado;
}
?>
