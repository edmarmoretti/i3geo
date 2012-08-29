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
include(__DIR__."/classe_metaestat.php");
error_reporting(0);
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
		retornaJSON($m->listaConexao($codigo_estat_conexao));
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
	Valor: LISTACLASSIFICACAOMEDIDA

	Lista as classificacoes de uma medida de uma variavel

	Retorno:

	{JSON}
	*/
	case "LISTACLASSIFICACAOMEDIDA":
		$m = new Metaestat();
		retornaJSON($m->listaClassificacaoMedida($id_medida_variavel,$id_classificacao));
		exit;
	break;
	case "LISTALINKMEDIDA":
		$m = new Metaestat();
		retornaJSON($m->listaLinkMedida($id_medida_variavel,$id_link));
		exit;
	break;
	/*
	 Valor: LISTACLASSECLASSIFICACAO

	Lista as classes de uma classificacoes

	Retorno:

	{JSON}
	*/
	case "LISTACLASSECLASSIFICACAO":
		$m = new Metaestat();
		retornaJSON($m->listaClasseClassificacao($id_classificacao,$id_classe));
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
	 Valor: LISTAPARAMETRO

	Lista de parametros

	Retorno:

	{JSON}
	*/
	case "LISTAPARAMETRO":
		$m = new Metaestat();
		retornaJSON($m->listaParametro($id_medida_variavel,$id_parametro_medida));
		exit;
	break;
	case "LISTAVALORESPARAMETRO":
		$m = new Metaestat();
		retornaJSON($m->listaValoresParametro($id_parametro_medida));
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
	case "LISTAFONTEINFO":
		$m = new Metaestat();
		retornaJSON($m->listaFonteinfo($id_fonteinfo));
		exit;
	break;
	case "LISTAFONTEINFOMEDIDA":
		$m = new Metaestat();
		retornaJSON($m->listaFonteinfoMedida($id_medida_variavel));
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
	case "LISTAAGREGAREGIAO":
		$m = new Metaestat();
		if(empty($codigo_tipo_regiao)){
			$codigo_tipo_regiao = "";
		}
		retornaJSON($m->listaAgregaRegiao($codigo_tipo_regiao,$id_agregaregiao));
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
	 Valor: ALTERAPARAMETROMEDIDA

	Altera os dados de uma parametro de uma medida

	Retorno:

	{JSON}
	*/
	case "ALTERAPARAMETROMEDIDA":
		$m = new Metaestat();
		if(empty($id_parametro_medida)){
			$id_parametro_medida = $m->alteraParametroMedida($id_medida_variavel);
		}
		else{
			$m->alteraParametroMedida("",$id_parametro_medida,$nome,$descricao,$coluna,$id_pai);
		}
		retornaJSON($m->listaParametro($id_medida_variavel,$id_parametro_medida));
		exit;
	break;
	/*
	 Valor: ALTERACLASSIFICACAOMEDIDA

	Altera os dados de uma classificacao de uma medida

	Retorno:

	{JSON}
	*/
	case "ALTERACLASSIFICACAOMEDIDA":
		$m = new Metaestat();
		if(empty($id_classificacao)){
			$id_classificacao = $m->alteraClassificacaoMedida($id_medida_variavel);
		}
		else{
			$m->alteraClassificacaoMedida("",$id_classificacao,$nome,$observacao);
		}
		retornaJSON($m->listaClassificacaoMedida($id_medida_variavel,$id_classificacao));
		exit;
	break;
	/*
	 Valor: ALTERACLASSECLASSIFICACAO

	Altera os dados de uma classe de uma classificacao

	Retorno:

	{JSON}
	*/
	case "ALTERACLASSECLASSIFICACAO":
		$m = new Metaestat();
		if(empty($id_classe)){
			$id_classe = $m->alteraClasseClassificacao($id_classificacao);
		}
		else{
			$m->alteraClasseClassificacao("",$id_classe,$titulo,$expressao,$vermelho,$verde,$azul,$tamanho,$simbolo,$overmelho,$overde,$oazul,$otamanho);
		}
		retornaJSON($m->listaClasseClassificacao($id_classificacao,$id_classe));
		exit;
	break;
	case "ALTERALINKMEDIDA":
		$m = new Metaestat();
		if(empty($id_link)){
			$id_link = $m->alteraLinkMedida($id_medida_variavel);
		}
		else{
			$m->alteraLinkMedida("",$id_link,$nome,$link);
		}
		retornaJSON($m->listaLinkMedida($id_medida_variavel,$id_link));
		exit;
	break;
	case "ALTERARFONTEINFO":
		$m = new Metaestat();
		if(empty($id_fonteinfo)){
			$id_fonteinfo = $m->alteraFonteinfo();
		}
		else{
			$m->alteraFonteinfo($id_fonteinfo,$titulo,$link);
		}
		retornaJSON($m->listaFonteinfo($id_fonteinfo));
		exit;
	break;
	case "ADICIONAFONTEINFOMEDIDA":
		$m = new Metaestat();
		$m->adicinaFonteinfoMedida($id_medida_variavel,$id_fonteinfo);
		retornaJSON($m->listaFonteInfo($id_fonteinfo));
		exit;
	break;
	/*
	 Valor: ALTERARUNIDADEMEDIDA

	Altera a tabela de unidades de medida

	Retorno:

	{JSON}
	*/
	case "ALTERARUNIDADEMEDIDA":
		$m = new Metaestat();
		if(empty($codigo_unidade_medida)){
			$codigo_unidade_medida = $m->alteraUnidadeMedida();
		}
		else{
			$codigo_unidade_medida = $m->alteraUnidadeMedida($codigo_unidade_medida,$nome,$sigla,$permitesoma,$permitemedia);
		}
		retornaJSON($m->listaUnidadeMedida($codigo_unidade_medida));
		exit;
	break;
	/*
	 Valor: ALTERARCONEXAO

	Altera a tabela de conexoes

	Retorno:

	{JSON}
	*/
	case "ALTERARCONEXAO":
		$m = new Metaestat();
		if(empty($codigo_estat_conexao)){
			$codigo_estat_conexao = $m->alteraConexao();
		}
		else{
			$codigo_estat_conexao = $m->alteraConexao($codigo_estat_conexao,$bancodedados,$host,$porta,$usuario);
		}
		retornaJSON($m->listaConexao($codigo_estat_conexao));
		exit;
	break;
	/*
	 Valor: ALTERARTIPOREGIAO

	Altera a tabela de regioes

	Retorno:

	{JSON}
	*/
	case "ALTERARTIPOREGIAO":
		$m = new Metaestat();
		if(empty($codigo_tipo_regiao)){
			$codigo_tipo_regiao = $m->alteraTipoRegiao();
		}
		else{
			$codigo_tipo_regiao = $m->alteraTipoRegiao($codigo_tipo_regiao,$nome_tipo_regiao,$descricao_tipo_regiao,$esquemadb,$tabela,$colunageo,$colunacentroide,$data,$identificador,$colunanomeregiao,$srid,$codigo_estat_conexao);
		}
		retornaJSON($m->listaTipoRegiao($codigo_tipo_regiao));
		exit;
	break;
	case "ALTERAAGREGAREGIAO":
		$m = new Metaestat();
		if(empty($id_agregaregiao)){
			$id_agregaregiao = $m->alteraAgregaRegiao($codigo_tipo_regiao);
		}
		else{
			$id_agregaregiao = $m->alteraAgregaRegiao("",$id_agregaregiao,$codigo_tipo_regiao_pai,$coluna_ligacao_regiaopai);
			$codigo_tipo_regiao = "";
		}
		retornaJSON($m->listaAgregaRegiao($codigo_tipo_regiao,$id_agregaregiao));
		exit;
	break;
	/*
	 Valor: ALTERARTIPOPERIODO

	Altera a tabela de tipos de periodo

	Retorno:

	{JSON}
	*/
	case "ALTERARTIPOPERIODO":
		$m = new Metaestat();
		if(empty($codigo_tipo_periodo)){
			$codigo_tipo_periodo = $m->alteraTipoPeriodo();
		}
		else{
			$codigo_unidade_medida = $m->alteraTipoPeriodo($codigo_tipo_periodo,$nome,$descricao);
		}
		retornaJSON($m->listaTipoPeriodo($codigo_tipo_periodo));
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
	 Valor: EXCLUIRTIPOPERIODO

	Exclui uma variavel

	Parametros:

	codigo_variavel

	Retorno:

	{JSON}
	*/
	case "EXCLUIRTIPOPERIODO":
		$tabela = "i3geoestat_tipo_periodo";
		$id = $codigo_tipo_periodo;
		$f = verificaFilhos();
		if(!$f){
			$m = new Metaestat();
			retornaJSON($m->excluirRegistro("i3geoestat_tipo_periodo","codigo_tipo_periodo",$id));
		}
		else
			retornaJSON("erro");
		exit;
	break;
	/*
	 Valor: EXCLUIRUNIDADEMEDIDA

	Exclui uma unidade de medida

	Retorno:

	{JSON}
	*/
	case "EXCLUIRUNIDADEMEDIDA":
		$tabela = "i3geoestat_unidade_medida";
		$id = $codigo_unidade_medida;
		$f = verificaFilhos();

		if(!$f){
			$m = new Metaestat();
			retornaJSON($m->excluirRegistro("i3geoestat_unidade_medida","codigo_unidade_medida",$id));
		}
		else
			retornaJSON("erro");
		exit;
	break;
	case "EXCLUIRFONTEINFO":
		$tabela = "i3geoestat_fonteinfo";
		$id = $id_fonteinfo;
		$f = verificaFilhos();

		if(!$f){
			$m = new Metaestat();
			retornaJSON($m->excluirRegistro("i3geoestat_fonteinfo","id_fonteinfo",$id));
		}
		else
			retornaJSON("erro");
		exit;
	break;
	case "EXCLUIRFONTEINFOMEDIDA":
		$m = new Metaestat();
		retornaJSON($m->excluirFonteinfoMedida($id_medida_variavel,$id_fonteinfo));
		exit;
	break;
	/*
	Valor: EXCLUIRCONEXAO

	Exclui uma conexao

	Retorno:

	{JSON}
	*/
	case "EXCLUIRCONEXAO":
		$tabela = "i3geoestat_conexao";
		$id = $codigo_estat_conexao;
		$f = verificaFilhos();
		if(!$f){
			$m = new Metaestat();
			retornaJSON($m->excluirRegistro("i3geoestat_conexao","codigo_estat_conexao",$id));
		}
		else
			retornaJSON("erro");
		exit;
	break;
	/*
	 Valor: EXCLUIRTIPOREGIAO

	Exclui uma regiao

	Retorno:

	{JSON}
	*/
	case "EXCLUIRTIPOREGIAO":
		$tabela = "i3geoestat_tipo_regiao";
		$id = $codigo_tipo_regiao;
		$f = verificaFilhos();
		if(!$f){
			$m = new Metaestat();
			retornaJSON($m->excluirRegistro("i3geoestat_tipo_regiao","codigo_tipo_regiao",$id));
		}
		else
			retornaJSON("erro");
		exit;
	break;
	case "EXCLUIRAGREGAREGIAO":
		$tabela = "i3geoestat_agregaregiao";
		$id = $id_agregaregiao;
		$m = new Metaestat();
		retornaJSON($m->excluirRegistro("i3geoestat_agregaregiao","id_agregaregiao",$id));
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
	Valor: EXCLUIRPARAMETROMEDIDA

	Exclui uma medida da variavel

	Parametros:

	id_parametro_medida

	Retorno:

	{JSON}
	*/
	case "EXCLUIRPARAMETROMEDIDA":
		$m = new Metaestat();
		retornaJSON($m->excluirRegistro("i3geoestat_parametro_medida","id_parametro_medida",$id_parametro_medida));
		exit;
	break;
	/*
	 Valor: EXCLUIRCLASSIFICACAOMEDIDA

	Exclui uma classificacao de uma medida da variavel

	Parametros:

	id_classificacao

	Retorno:

	{JSON}
	*/
	case "EXCLUIRCLASSIFICACAOMEDIDA":
		$tabela = "i3geoestat_classificacao";
		$id = $id_classificacao;
		$f = verificaFilhos();
		if(!$f){
			$m = new Metaestat();
			retornaJSON($m->excluirRegistro("i3geoestat_classificacao","id_classificacao",$id));
		}
		else
			retornaJSON("erro");
		exit;
	break;
	/*
	 Valor: EXCLUIRCLASSECLASSIFICACAO

	Exclui uma classe de uma classificacao

	Parametros:

	id_classe

	Retorno:

	{JSON}
	*/
	case "EXCLUIRCLASSECLASSIFICACAO":
		$m = new Metaestat();
		retornaJSON($m->excluirRegistro("i3geoestat_classes","id_classe",$id_classe));
		exit;
	break;
	case "EXCLUIRLINKMEDIDA":
		$m = new Metaestat();
		retornaJSON($m->excluirRegistro("i3geoestat_medida_variavel_link","id_link",$id_link));
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
		$resultado["fonteinfo"] = $m->listaFonteinfo();
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
		$dados = $m->sqlMedidaVariavel($id_medida_variavel);
		retornaJSON($dados);
		exit;
	break;
	/*
	Valor: DADOSMEDIDAVARIAVEL

	Mostra os dados de uma media de uma variavel

	Parametros:

	formato

	filtro

	agruparpor

	todasascolunas - 0 ou 1

	Retorno:

	{JSON}
	*/
	case "DADOSMEDIDAVARIAVEL":
		$m = new Metaestat();
		$dados = $m->dadosMedidaVariavel($id_medida_variavel,$filtro,$todasascolunas,$agruparpor);
		if($formato == "json"){
			retornaJSON($dados);
		}
		if($formato == "xml"){
			header("Content-type: application/xml");
			echo($m->formataXML($dados));
		}
		exit;
	break;
	/*
	 Valor: MAPFILEMEDIDAVARIAVEL

	Cria o mapfile de uma media de uma variavel

	Parametros:

	formato

	filtro

	agruparpor

	todasascolunas - 0 ou 1

	Retorno:

	{JSON}
	*/
	case "MAPFILEMEDIDAVARIAVEL":
		$m = new Metaestat();
		if($formato == "json"){
			retornaJSON($m->mapfileMedidaVariavel($id_medida_variavel,$filtro,$todasascolunas,$tipolayer,$titulolayer,$id_classificacao,$agruparpor));
		}
		exit;
	break;
	/*
	 Valor: KMLMEDIDAVARIAVEL

	Gera um arquivo kml que pode ser aberto no googleearth

	*/
	case "KMLMEDIDAVARIAVEL":
		$m = new Metaestat();
		$r = $m->mapfileMedidaVariavel($id_medida_variavel,$filtro,$todasascolunas,$tipolayer,$titulolayer,$id_classificacao,$agruparpor);
		//cria um mapfile completo, que inclui a camada no mapfile de inicializacao do i3geo
		$mapfile = $m->mapfileCompleto($r["mapfile"]);
		if($formato == "kml" || $formato == "kmz"){
			//define as variaveis necessarias ao pacote kmlserver
			set_time_limit(0);
			$_REQUEST["map"] = $mapfile;
			$_REQUEST["typename"] = $r["layer"];
			$_REQUEST["request"] = $formato;
			//$_REQUEST["service"] = "icon";
			include (__DIR__."/../../pacotes/kmlmapserver/classes/kmlserver.class.php");
			$server = new KmlServer();
		}else{//3d com tme
			if(!isset($dir_tmp)){
				include(__DIR__."/../../ms_configura.php");
			}
			$verificaSID = false;
			$mv = $m->listaMedidaVariavel("",$id_medida_variavel);
			$reg = $m->listaTipoRegiao($mv["codigo_tipo_regiao"]);
			$_GET["nomelayer"] = $r["layer"];
			$_GET["colunasvalor"] = $mv["colunavalor"];
			$_GET["colunanomeregiao"] = $reg["colunanomeregiao"];
			$_GET["titulo"] = $r["titulolayer"];
			$_GET["descricao"] = $mv["colunavalor"];
			$_SESSION["map_file"] = $mapfile;
			$_SESSION["postgis_mapa"] = "";
			$_SESSION["tmpurl"] = "";
			$_SESSION["mapext"] = "";
			$download = true;
			$parametersTME = array(
					'mapType'        => 'bar',
					'indicator'      => 'valores',
					'year'           => "",
					'classification' => 'equal',
					'mapTitle' => $r["titulolayer"],
					'timeType' => "slider", //para mais de um ano, escolha slider ou series
					'dirtmp' => $dir_tmp,
					'barSize'=> 5000
			);

			include (__DIR__."/../../pacotes/tme/TME_i3geo.php");
		}
		exit;
	break;
	/*
	Valor: SUMARIOMEDIDAVARIAVEL

	Sumario estatistico media de uma variavel

	Parametros:

	formato

	filtro

	Retorno:

	{JSON}
	*/
	case "SUMARIOMEDIDAVARIAVEL":
		$m = new Metaestat();
		$dados = $m->sumarioMedidaVariavel($id_medida_variavel,$filtro,$agruparpor);
		if($formato == "json"){
			retornaJSON($dados);
		}
		if($formato == "xml"){
			header("Content-type: application/xml");
			echo($m->formataXML($dados["grupos"]));
		}
		exit;
	break;
	/*
	Valor: ESQUEMASCONEXAO

	Lista os esquemas de uma conexao

	Parametros:

	formato

	codigo_estat_conexao

	Retorno:

	{JSON}
	*/
	case "ESQUEMASCONEXAO":
		$m = new Metaestat();
		if($formato == "json"){
			retornaJSON($m->esquemasConexao($codigo_estat_conexao));
		}
		exit;
	break;
	/*
	Valor: TABELASESQUEMA

	Lista as tabelas de um esquema

	Parametros:

	formato

	codigo_estat_conexao

	nome_esquema

	Retorno:

	{JSON}
	*/
	case "TABELASESQUEMA":
		$m = new Metaestat();
		if($formato == "json"){
			retornaJSON($m->tabelasEsquema($codigo_estat_conexao,$nome_esquema));
		}
		exit;
	break;
	/*
	 Valor: COLUNASTABELA

	Lista as colunas de uma tabela

	Parametros:

	formato

	codigo_estat_conexao

	nome_esquema

	nome_tabela

	Retorno:

	{JSON}
	*/
	case "COLUNASTABELA":
		$m = new Metaestat();
		if($formato == "json"){
			retornaJSON($m->colunasTabela($codigo_estat_conexao,$nome_esquema,$nome_tabela));
		}
		exit;
	break;
	/*
	 Valor: DESCREVECOLUNASTABELA

	Lista as colunas de uma tabela

	Parametros:

	formato

	codigo_estat_conexao

	nome_esquema

	nome_tabela

	Retorno:

	{JSON}
	*/
	case "DESCREVECOLUNASTABELA":
		$m = new Metaestat();
		if($formato == "json"){
			retornaJSON($m->descreveColunasTabela($codigo_estat_conexao,$nome_esquema,$nome_tabela));
		}
		exit;
	break;
	case "RELATORIOCOMPLETO":
		$m = new Metaestat();
		if(empty($codigo_variavel)){
			$codigo_variavel = "";
		}
		$dados = $m->relatorioCompleto($codigo_variavel);
		$dados = $m->formataRelatorioHtml($dados);
		retornaJSON($dados);
		exit;
	break;
}
?>