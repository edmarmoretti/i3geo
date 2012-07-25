<?php
/*
Title: metaestat.php

Fun&ccedil;&otilde;es utilizadas pelo sistema de metadados de dados estat&iacute;sticos

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2012 Edmar Moretti
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.gov.br

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

i3geo/admin/php/metaestat.php

Parametros:

O par&acirc;metro principal &eacute; "funcao", que define qual opera&ccedil;&atilde;o ser&aacute; executada, por exemplo, sistemas.php?funcao=pegasistemas.

Cada opera&ccedil;&atilde;o possu&iacute; seus próprios par&acirc;metros, que devem ser enviados tamb&eacute;m na requisi&ccedil;&atilde;o da opera&ccedil;&atilde;o.
*/
include_once(__DIR__."/admin.php");
/*
include_once(__DIR__."/login.php");

$funcoesEdicao = array(
		"ALTERARSISTEMAS",
		"ALTERARFUNCOES",
		"EXCLUIRSISTEMA",
		"EXCLUIRFUNCAO"
);
if(in_array(strtoupper($funcao),$funcoesEdicao)){
	if(verificaOperacaoSessao("admin/html/sistemas") == false){
		retornaJSON("Vc nao pode realizar essa operacao.");exit;
	}
}
*/
error_reporting(E_ALL);
include(__DIR__."/classe_metaestat.php");

//faz a busca da fun&ccedil;&atilde;o que deve ser executada
switch (strtoupper($funcao))
{
	/*
	Note:

	Valores que o par&acirc;metro &funcao pode receber. Os par&acirc;metros devem ser enviados na requisi&ccedil;&atilde;o em AJAX.
	*/
	/*
	Valor: LISTACONEXAO

	Lista de conexoes

	Retorno:

	{JSON}
	*/
	case "LISTACONEXAO":
		$m = new Metaestat();
		retornaJSON($m->listaConexao($id_conexao));
		exit;
	break;
	/*
	 Valor: LISTAVARIAVEL

	Lista de variaveis

	Retorno:

	{JSON}
	*/
	case "LISTAVARIAVEL":
		$m = new Metaestat();
		retornaJSON($m->listaVariavel($codigo_variavel));
		exit;
	break;
	/*
	 Valor: LISTAMEDIDAVARIAVEL

	Lista das medidas de uma variavel

	Retorno:

	{JSON}
	*/
	case "LISTAMEDIDAVARIAVEL":
		$m = new Metaestat();
		retornaJSON($m->listaMedidaVariavel($codigo_variavel,$id_medida_variavel));
		exit;
	break;
	/*
	 Valor: LISTADIMENSAO

	Lista de dimensoes

	Retorno:

	{JSON}
	*/
	case "LISTADIMENSAO":
		$m = new Metaestat();
		retornaJSON($m->listaDimensao($id_medida_variavel,$id_dimensao_medida));
		exit;
	break;
	/*
	 Valor: LISTAUNIDADEMEDIDA

	Lista de unidades de medida

	Retorno:

	{JSON}
	*/
	case "LISTAUNIDADEMEDIDA":
		$m = new Metaestat();
		retornaJSON($m->listaUnidadeMedida($codigo_unidade_medida));
		exit;
	break;
	/*
	 Valor: LISTATIPOPERIODO

	Lista de unidades de medida

	Retorno:

	{JSON}
	*/
	case "LISTATIPOPERIODO":
		$m = new Metaestat();
		retornaJSON($m->listaTipoPeriodo($codigo_tipo_periodo));
		exit;
	break;
	/*
	 Valor: LISTATIPOREGIAO

	Lista de tipos de regiao

	Retorno:

	{JSON}
	*/
	case "LISTATIPOREGIAO":
		$m = new Metaestat();
		retornaJSON($m->listaTipoRegiao($codigo_tipo_regiao));
		exit;
	break;
	/*
	Valor: ALTERARVARIAVEL

	Altera os dados de uma variavel

	Retorno:

	{JSON}
	*/
	case "ALTERAVARIAVEL":
		$m = new Metaestat();
		if(empty($codigo_variavel)){
			$codigo_variavel = $m->alteraVariavel();
		}
		else{
			$codigo_variavel = $m->alteraVariavel($codigo_variavel,$nome,$descricao);
		}
		retornaJSON($m->listaVariavel($codigo_variavel));
		exit;
	break;
	/*
	 Valor: ALTERAMEDIDAVARIAVEL

	Altera os dados de uma medida de uma variavel

	Retorno:

	{JSON}
	*/
	case "ALTERAMEDIDAVARIAVEL":
		$m = new Metaestat();
		if(empty($id_medida_variavel)){
			$id_medida_variavel = $m->alteraMedidaVariavel($codigo_variavel);
		}
		else{
			$m->alteraMedidaVariavel("",$id_medida_variavel,$codigo_unidade_medida,$codigo_tipo_periodo,$codigo_tipo_regiao,$codigo_estat_conexao,$esquemadb,$tabela,$colunavalor,$colunaidgeo,$filtro,$nomemedida);
		}
		retornaJSON($m->listaMedidaVariavel("",$id_medida_variavel));
		exit;
	break;
	/*
	 Valor: ALTERADIMENSAOMEDIDA

	Altera os dados de uma dimensao de uma medida

	Retorno:

	{JSON}
	*/
	case "ALTERADIMENSAOMEDIDA":
		$m = new Metaestat();
		if(empty($id_dimensao_medida)){
			$id_dimensao_medida = $m->alteraDimensaoMedida($id_medida_variavel);
		}
		else{
			$m->alteraDimensaoMedida("",$id_dimensao_medida,$nomedimensao,$descricao,$coluna,$agregavalores);
		}
		retornaJSON($m->listaDimensao($id_medida_variavel,$id_dimensao_medida));
		exit;
		break;
	/*
	Valor: EXCLUIRVARIAVEL

	Exclui uma variavel

	Parametros:

	codigo_variavel

	Retorno:

	{JSON}
	*/
	case "EXCLUIRVARIAVEL":
		$tabela = "i3geoestat_variavel";
		$id = $codigo_variavel;
		$f = verificaFilhos();
		if(!$f){
			$m = new Metaestat();
			retornaJSON($m->excluirRegistro("i3geoestat_variavel","codigo_variavel",$id));
		}
		else
			retornaJSON("erro");
		exit;
	break;
	/*
	 Valor: EXCLUIRMEDIDAVARIAVEL

	Exclui uma medida da variavel

	Parametros:

	codigo_variavel

	Retorno:

	{JSON}
	*/
	case "EXCLUIRMEDIDAVARIAVEL":
		$tabela = "i3geoestat_medida_variavel";
		$id = $id_medida_variavel;
		$f = verificaFilhos();
		if(!$f){
			$m = new Metaestat();
			retornaJSON($m->excluirRegistro("i3geoestat_medida_variavel","id_medida_variavel",$id));
		}
		else
			retornaJSON("erro");
		exit;
	break;
	/*
	 Valor: EXCLUIRDIMENSAOMEDIDA

	Exclui uma medida da variavel

	Parametros:

	codigo_variavel

	Retorno:

	{JSON}
	*/
	case "EXCLUIRDIMENSAOMEDIDA":
		$m = new Metaestat();
		retornaJSON($m->excluirRegistro("i3geoestat_dimensao_medida","id_dimensao_medida",$id_dimensao_medida));
		exit;
	break;
	/*
	Valor: LISTADADOSTABELASAUXILIARES

	Lista os valores das tabelas auxiliares

	Retorno:

	{JSON}
	*/
	case "LISTADADOSTABELASAUXILIARES":
		$m = new Metaestat();
		$resultado = array();
		$resultado["tipo_periodo"] = $m->listaTipoPeriodo();
		$resultado["unidade_medida"] = $m->listaUnidadeMedida();
		$resultado["tipo_regiao"] = $m->listaTipoRegiao();
		$resultado["conexao"] = $m->listaConexao();
		retornaJSON($resultado);
	break;
	/*
	Valor: SQLMEDIDAVARIAVEL

	Sql para acessar os dados de uma medida de uma variável

	Retorno:

	{JSON}
	*/
	case "SQLMEDIDAVARIAVEL":
		$m = new Metaestat();
		retornaJSON($m->sqlMedidaVariavel($id_medida_variavel));
		exit;
	break;
	/*
	Valor: DADOSMEDIDAVARIAVEL

	Mostra os dados de uma media de uma variavel

	Parametros:

	formato

	filtro

	todasascolunas - 0 ou 1

	Retorno:

	{JSON}
	*/
	case "DADOSMEDIDAVARIAVEL":
		$m = new Metaestat();
		if($formato == "json"){
			retornaJSON($m->dadosMedidaVariavel($id_medida_variavel,$filtro,$todasascolunas));
		}
		exit;
	break;
}
?>