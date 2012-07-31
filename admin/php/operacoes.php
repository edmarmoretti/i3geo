<?php
/*
Title: operacoes.php

Controle das requisi&ccedil;&otilde;es em Ajax utilizadas para gerenciar operacoes de usu&aacute;rio e controle de acesso

Recebe as requisi&ccedil;&otilde;es feitas em JavaScript (AJAX) e retorna o resultado para a interface.

O par&acirc;metro "funcao" define qual a opera&ccedil;&atilde;o que ser&aacute; executada. Esse par&acirc;metro &eacute; verificado em um bloco "switch ($funcao)".

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
Voc&ecirc; deve ter recebido uma c�pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/classesphp/operacoes.php

Parametros:

funcao - op&ccedil;&atilde;o que ser&aacute; executada (veja abaixo a lista de Valores que esse par&acirc;metro pode assumir).

Retorno:

O resultado da opera&ccedil;&atilde;o ser&aacute; retornado em um objeto CPAINT.

A constru&ccedil;&atilde;o da string JSON &eacute; feita preferencialmente pelas fun&ccedil;&otilde;es nativas do PHP.
Para efeitos de compatibilidade, uma vez que at&eacute; a vers&atilde;o 4.2 a string JSON era construida pelo CPAINT,
o objeto CPAINT ainda &eacute; definido, por&eacute;m, a fun&ccedil;&atilde;o cpjson verifica se as fun&ccedil;&otilde;es nativas do PHPO (json)
est&atilde;o instaladas, se estiverem, utiliza-se a fun&ccedil;&atilde;o nativa, se n&atilde;o, utiliza-se o CPAINT para gerar o JSON.

Exemplo de chamada CPAINT (Ajax) do lado do cliente (javascript):

var p = "classesphp/mapa_controle.php?funcao=crialente&resolucao=1.5&g_sid="+g_sid

var cp = new cpaint()

cp.set_response_type("JSON")

cp.call(p,"lente",ajaxabrelente)

*/
error_reporting(0);
//
//pega as variaveis passadas com get ou post
//
include_once(__DIR__."/login.php");
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
function alterarOperacoes()
{
	global $id_operacao,$codigo,$descricao;
	try
	{
		include(__DIR__."/conexao.php");
		if($convUTF){
			$descricao = utf8_encode($descricao);
		}
		if($id_operacao != ""){
			$dbhw->query("UPDATE ".$esquemaadmin."i3geousr_operacoes SET codigo='$codigo',descricao='$descricao' WHERE id_operacao = $id_operacao");
			$retorna = $id_operacao;
		}
		else{
			$idtemp = (rand (9000,10000)) * -1;
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes (codigo,descricao) VALUES ('','$idtemp')");
			$id = $dbh->query("SELECT id_operacao FROM ".$esquemaadmin."i3geousr_operacoes WHERE descricao = '$idtemp'");
			$id = $id->fetchAll();
			$id = $id[0]['id_operacao'];
			$dbhw->query("UPDATE ".$esquemaadmin."i3geousr_operacoes SET descricao = '' WHERE id_operacao = $id AND descricao = '$idtemp'");
			$retorna = $id;
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
	try
	{
		include(__DIR__."/conexao.php");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoespapeis (id_operacao,id_papel) VALUES ($id_operacao,$id_papel)");
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
	try
	{
		include(__DIR__."/conexao.php");
		$dbhw->query("DELETE from ".$esquemaadmin."i3geousr_operacoespapeis WHERE id_operacao = $id_operacao AND id_papel = $id_papel");
		$dbhw = null;
		$dbh = null;
		return "ok";
	}
	catch (PDOException $e){
		return "Error!: " . $e->getMessage();
	}
}
?>