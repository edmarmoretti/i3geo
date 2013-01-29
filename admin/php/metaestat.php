<?php
/*
Title: metaestat.php

Fun&ccedil;&otilde;es utilizadas pelo sistema de metadados estat&iacute;sticos

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

include_once(__DIR__."/login.php");
//lista de funcoes que passam pela validacao de login
$funcoesEdicao = array(
	"ALTERAMAPAGRUPO",
	"ALTERAMAPATEMA",
	"ALTERAMAPA",
	"ALTERAVARIAVEL",
	"ALTERAMEDIDAVARIAVEL",
	"ALTERAPARAMETROMEDIDA",
	"ALTERACLASSIFICACAOMEDIDA",
	"CALCULACLASSIFICACAO",
	"ALTERACLASSECLASSIFICACAO",
	"ALTERALINKMEDIDA",
	"ALTERARFONTEINFO",
	"ADICIONAFONTEINFOMEDIDA",
	"ALTERARUNIDADEMEDIDA",
	"ALTERARCONEXAO",
	"ALTERARTIPOREGIAO",
	"ALTERAAGREGAREGIAO",
	"ALTERARTIPOPERIODO",
	"EXCLUIRMAPA",
	"EXCLUIRMAPAGRUPO",
	"EXCLUIRMAPATEMA",
	"EXCLUIRVARIAVEL",
	"EXCLUIRTIPOPERIODO",
	"EXCLUIRUNIDADEMEDIDA",
	"EXCLUIRFONTEINFO",
	"EXCLUIRFONTEINFOMEDIDA",
	"EXCLUIRCONEXAO",
	"EXCLUIRTIPOREGIAO",
	"EXCLUIRAGREGAREGIAO",
	"EXCLUIRMEDIDAVARIAVEL",
	"EXCLUIRPARAMETROMEDIDA",
	"EXCLUIRCLASSIFICACAOMEDIDA",
	"EXCLUIRCLASSECLASSIFICACAO",
	"EXCLUIRLINKMEDIDA",
	"CRIATABELADB",
	"ALTERANOMETABELADB",
	"COPIATABELADB",
	"CRIACOLUNADB",
	"ALTERANOMECOLUNADB",
	"OBTEMDADOSTABELADB",
	"INSERIRDADOS",
	"MANTEMDADOSREGIAO",
	"SALVAATRIBUTOSMEDIDAVARIAVEL",
	"EXCLUIATRIBUTOSMEDIDAVARIAVEL",
	"REGIAO2SHP"
);
if(in_array(strtoupper($funcao),$funcoesEdicao)){
	//se a funcao esta no array eh feita a verificacao se o usuario esta logado e se ele esta em um grupo que
	//permite o uso da operacao admin/metaestat/geral
	if(verificaOperacaoSessao("admin/metaestat/geral") == false){
		retornaJSON("Vc nao pode realizar essa operacao.");exit;
	}
}
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
		if(empty($filtro_esquema)){
			$filtro_esquema = "";
		}
		retornaJSON($m->listaVariavel($codigo_variavel,$filtro_esquema));
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
	case "LISTAHIERARQUIAREGIOES":
		$m = new Metaestat();
		$regioes = $m->listaHierarquiaRegioes($codigo_tipo_regiao);
		$valores = "";
		//se achou apenas uma regiao, pega os valores
		if(count($regioes) < 2 && $codigo_tipo_regiao != ""){
			$valores = $m->listaDadosRegiao($codigo_tipo_regiao,$codigoregiaopai,$valorregiaopai);
		}
		retornaJSON(array("regiaopai"=>$codigo_tipo_regiao,"regioes"=>$regioes,"valores"=>$valores));
		exit;
	break;
	case "LISTAREGIOESMEDIDA":
		$m = new Metaestat();
		retornaJSON($m->listaRegioesMedida($id_medida_variavel));
		exit;
		break;
	case "LISTAAGREGAREGIAO":
		$m = new Metaestat();
		if(empty($codigo_tipo_regiao)){
			$codigo_tipo_regiao = "";
		}
		retornaJSON($m->listaAgregaRegiao($codigo_tipo_regiao,$id_agregaregiao));
		exit;
	case "LISTAMAPAS":
		$m = new Metaestat();
		if(empty($id_mapa)){
			$id_mapa = "";
		}
		retornaJSON($m->listaMapas($id_mapa));
		exit;
	break;
	case "LISTAGRUPOSMAPA":
		$m = new Metaestat();
		retornaJSON($m->listaGruposMapa($id_mapa,$id_mapa_grupo));
		exit;
	break;
	case "LISTATEMASMAPA":
		$m = new Metaestat();
		retornaJSON($m->listaTemasMapa($id_mapa_grupo,$id_mapa_tema));
		exit;
	break;
	//lista os templates que o usuario pode escolher para publicar mapas
	//a pasta com alista e definida na variavel $metaestatTemplates localizada no ms_configura.php
	case "LISTATEMPLATESMAPA":
		if(empty($metaestatTemplates)){
			$d = __DIR__."/../../ferramentas/metaestat/templates";
		}
		else{
			$d = $locaplic.$metaestatTemplates;
		}
		$arq = listaArquivos($d);
		$arq["metaestatTemplates"] = $metaestatTemplates;
		retornaJSON($arq);
		exit;
	break;
	//lista os logos que o usuario pode escolher para publicar mapas
	//a pasta com alista e definida na variavel $metaestatTemplates/logos localizada no ms_configura.php
	case "LISTALOGOSMAPA":
		if(empty($metaestatTemplates)){
			$metaestatTemplates = __DIR__."/../../ferramentas/metaestat/templates";
		}
		else{
			$metaestatTemplates = $locaplic.$metaestatTemplates;
		}
		retornaJSON(listaArquivos($metaestatTemplates."/logos"));
		exit;
		break;
	/*
	Valor: ALTERARVARIAVEL

	Altera os dados de uma variavel
	*/
	case "ALTERAVARIAVEL":
		$m = new Metaestat();
		if(empty($codigo_variavel)){
			//isso ira criar um novo registro
			$codigo_variavel = $m->alteraVariavel();
			if(!empty($nome)){
				$m->alteraVariavel($codigo_variavel,$nome,$descricao);
			}
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
		$default = false;
		//verifica se a criacao da medida esta sendo feita na tabela default
		if($codigo_tipo_periodo < 5 && $esquemadb == "i3geo_metaestat" && $colunaidgeo == "codigoregiao"){
			$default = true;
		}
		if(empty($id_medida_variavel)){
			//isso ira criar um novo registro
			$id_medida_variavel = $m->alteraMedidaVariavel($codigo_variavel);
			//o filtro e necessario para permitir a selecao dos registros apenas do que pertence a medida da variavel escolhida
			if($default == true){
				$filtro = " id_medida_variavel = $id_medida_variavel ";
			}
			if(!empty($nomemedida)){
				$m->alteraMedidaVariavel("",$id_medida_variavel,$codigo_unidade_medida,$codigo_tipo_periodo,$codigo_tipo_regiao,$codigo_estat_conexao,$esquemadb,$tabela,$colunavalor,$colunaidgeo,$colunaidunico,$filtro,$nomemedida);
			}
		}
		else{
			$m->alteraMedidaVariavel("",$id_medida_variavel,$codigo_unidade_medida,$codigo_tipo_periodo,$codigo_tipo_regiao,$codigo_estat_conexao,$esquemadb,$tabela,$colunavalor,$colunaidgeo,$colunaidunico,$filtro,$nomemedida);
		}
		//adiciona os parametros de tempo conforme o tipo de periodo escolhido
		if($default == true){
			$m->excluirRegistro("i3geoestat_parametro_medida","id_medida_variavel",$id_medida_variavel);
			$id_pai = 0;
			//anual
			if($codigo_tipo_periodo >= 1){
				$id_parametro_medida = $m->alteraParametroMedida($id_medida_variavel,"","","","","","");
				$m->alteraParametroMedida($id_medida_variavel,$id_parametro_medida,"Ano","","ano",$id_pai,1);
				$id_pai = $id_parametro_medida;
			}
			//mensal
			if($codigo_tipo_periodo >= 2){
				$id_parametro_medida = $m->alteraParametroMedida($id_medida_variavel,"","","","","","");
				$m->alteraParametroMedida($id_medida_variavel,$id_parametro_medida,"Mes","","mes",$id_pai,2);
				$id_pai = $id_parametro_medida;
			}
			//diario
			if($codigo_tipo_periodo >= 3){
				$id_parametro_medida = $m->alteraParametroMedida($id_medida_variavel,"","","","","","");
				$m->alteraParametroMedida($id_medida_variavel,$id_parametro_medida,"Dia","","dia",$id_pai,3);
				$id_pai = $id_parametro_medida;
			}
			//horario
			if($codigo_tipo_periodo == 4){
				$id_parametro_medida = $m->alteraParametroMedida($id_medida_variavel,"","","","","","");
				$m->alteraParametroMedida($id_medida_variavel,$id_parametro_medida,"Hora","","hora",$id_pai,4);
			}
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
			//isso ira criar um novo registro
			$id_parametro_medida = $m->alteraParametroMedida($id_medida_variavel);
		}
		else{
			$m->alteraParametroMedida("",$id_parametro_medida,$nome,$descricao,$coluna,$id_pai,$tipo);
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
			//isso ira criar um novo registro
			$id_classificacao = $m->alteraClassificacaoMedida($id_medida_variavel);
			if(!empty($nome)){
				$m->alteraClassificacaoMedida($id_classificacao,$id_classificacao,$nome,$observacao);
			}
		}
		else{
			$m->alteraClassificacaoMedida("",$id_classificacao,$nome,$observacao);
		}
		retornaJSON($m->listaClassificacaoMedida($id_medida_variavel,$id_classificacao));
		exit;
	break;
	case "CALCULACLASSIFICACAO":
		//as cores vem no formato rgb(0,0,0);
		if(!empty($cores)){
			$cores = str_replace("rgb(","",$cores);
			$cores = str_replace(")","",$cores);
			$cores = explode(";",$cores);
		}
		if($tipo == "quartil"){
			$m = new Metaestat();
			$dados = $m->sumarioMedidaVariavel($id_medida_variavel);
			$dados = $dados["quartis"];
			$n = count($dados["expressoes"]);
			$m->excluirRegistro("i3geoestat_classes","id_classificacao",$id_classificacao);
			for($i=0;$i<$n;++$i){
				$id_classe = $m->alteraClasseClassificacao($id_classificacao);
				$expressao = $dados["expressoes"][$i];
				$titulo = $dados["nomes"][$i];
				if(!empty($cores)){
					$cor = explode(",",$cores[$i]);
					$vermelho = $cor[0];
					$verde = $cor[1];
					$azul = $cor[2];
				}
				$m->alteraClasseClassificacao("",$id_classe,$titulo,$expressao,$vermelho,$verde,$azul,"","","255","255","255","2");
			}
		}
		if($tipo == "intiguais5"){
			$m = new Metaestat();
			$dados = $m->sumarioMedidaVariavel($id_medida_variavel);
			$min = $dados["menor"];
			$max = $dados["maior"];
			$item = $dados["colunavalor"];
			$intervalo = ($max - $min) / 5;
			//adiciona as classes novas
			$intatual = $min;
			$m->excluirRegistro("i3geoestat_classes","id_classificacao",$id_classificacao);
			for ($i=0; $i < 5; ++$i){
				if ($i == 5 - 1){
					$expressao = "(([".$item."]>=".$intatual.")and([".$item."]<=".($intatual+$intervalo)."))";
				}
				else{
					$expressao = "(([".$item."]>=".$intatual.")and([".$item."]<".($intatual+$intervalo)."))";
				}
				$titulo = ">= ".$intatual." e < que ".($intatual+$intervalo);
				$intatual = $intatual + $intervalo;
				$id_classe = $m->alteraClasseClassificacao($id_classificacao);
				if(!empty($cores)){
					$cor = explode(",",$cores[$i]);
					$vermelho = $cor[0];
					$verde = $cor[1];
					$azul = $cor[2];
				}
				$m->alteraClasseClassificacao("",$id_classe,$titulo,$expressao,$vermelho,$verde,$azul,"","","255","255","255","2");
			}
		}
		//o menor e o maior valor sao enviados como parametro ($min e $max)
		if($tipo == "intiguais5mm"){
			$m = new Metaestat();
			$dados = $m->sumarioMedidaVariavel($id_medida_variavel);
			$item = $dados["colunavalor"];
			$intervalo = ($max - $min) / 5;
			//adiciona as classes novas
			$intatual = $min;
			$m->excluirRegistro("i3geoestat_classes","id_classificacao",$id_classificacao);
			for ($i=0; $i < 5; ++$i){
				if ($i == 5 - 1){
					$expressao = "(([".$item."]>=".$intatual.")and([".$item."]<=".($intatual+$intervalo)."))";
				}
				else{
					$expressao = "(([".$item."]>=".$intatual.")and([".$item."]<".($intatual+$intervalo)."))";
				}
				$titulo = ">= ".$intatual." e < que ".($intatual+$intervalo);
				$intatual = $intatual + $intervalo;
				$id_classe = $m->alteraClasseClassificacao($id_classificacao);
				if(!empty($cores)){
					$cor = explode(",",$cores[$i]);
					$vermelho = $cor[0];
					$verde = $cor[1];
					$azul = $cor[2];
				}
				$m->alteraClasseClassificacao("",$id_classe,$titulo,$expressao,$vermelho,$verde,$azul,"","","255","255","255","2");
			}
		}

		retornaJSON("ok");
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
			//isso ira criar um novo registro
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
			//isso ira criar um novo registro
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
			//isso ira criar um novo registro
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
			$codigo_tipo_regiao = $m->alteraTipoRegiao($codigo_tipo_regiao,$nome_tipo_regiao,$descricao_tipo_regiao,$esquemadb,$tabela,$colunageo,$colunacentroide,$data,$identificador,$colunanomeregiao,$srid,$codigo_estat_conexao,$colunasvisiveis,$apelidos);
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
			$id_agregaregiao = $m->alteraAgregaRegiao("",$id_agregaregiao,$codigo_tipo_regiao_pai,$colunaligacao_regiaopai);
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
			//impede a alteracao dos valores reservados
			if($codigo_tipo_periodo > 4){
				$codigo_unidade_medida = $m->alteraTipoPeriodo($codigo_tipo_periodo,$nome,$descricao);
			}
		}
		retornaJSON($m->listaTipoPeriodo($codigo_tipo_periodo));
		exit;
	break;
	/*
	 Valor: ALTERAMAPA

	Altera a tabela de mapas para publicacao

	Retorno:

	{JSON}
	*/
	case "ALTERAMAPA":
		$m = new Metaestat();
		if(empty($id_mapa)){
			$id_mapa = $m->alteraMapa();
		}
		else{
			$id_mapa = $m->alteraMapa($id_mapa,$titulo,$template,$logoesquerdo,$logodireito,$publicado);
		}
		retornaJSON($m->listaMapas($id_mapa));
		exit;
	break;
	/*
	 Valor: ALTERAMAPAGRUPO

	Altera a tabela de grupos para publicacao

	Retorno:

	{JSON}
	*/
	case "ALTERAMAPAGRUPO":
		$m = new Metaestat();
		if(empty($id_mapa_grupo)){
			$id_mapa_grupo = $m->alteraMapaGrupo($id_mapa);
		}
		else{
			$id_mapa_grupo = $m->alteraMapaGrupo($id_mapa,$id_mapa_grupo,$titulo);
		}
		retornaJSON($m->listaGruposMapa($id_mapa,$id_mapa_grupo));
		exit;
	break;
	case "ALTERAMAPATEMA":
		$m = new Metaestat();
		if(empty($id_mapa_tema)){
			$id_mapa_tema = $m->alteraMapaTema($id_mapa_grupo);
		}
		else{
			$id_mapa_tema = $m->alteraMapaTema($id_mapa_grupo,$id_mapa_tema,$titulo,$id_medida_variavel);
		}
		retornaJSON($m->listaTemasMapa($id_mapa_grupo,$id_mapa_tema));
		exit;
	break;
	/*
	 Valor: EXCLUIRMAPA

	Exclui um mapa do publicador

	*/
	case "EXCLUIRMAPA":
		$tabela = "i3geoestat_mapa";
		$id = $id_mapa;
		$f = verificaFilhos();
		if(!$f){
			$m = new Metaestat();
			retornaJSON($m->excluirRegistro("i3geoestat_mapa","id_mapa",$id));
		}
		else
			retornaJSON("erro");
	exit;
	break;
	case "EXCLUIRMAPAGRUPO":
		$tabela = "i3geoestat_mapa_grupo";
		$id = $id_mapa_grupo;
		$f = verificaFilhos();
		if(!$f){
			$m = new Metaestat();
			retornaJSON($m->excluirRegistro("i3geoestat_mapa_grupo","id_mapa_grupo",$id));
		}
		else
			retornaJSON("erro");
		exit;
	break;
	case "EXCLUIRMAPATEMA":
		$tabela = "i3geoestat_mapa_tema";
		$id = $id_mapa_tema;
		$m = new Metaestat();
		retornaJSON($m->excluirRegistro("i3geoestat_mapa_tema","id_mapa_tema",$id));
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
		//impede a alteracao dos valores reservados
		if($codigo_tipo_periodo > 4){
			$tabela = "i3geoestat_tipo_periodo";
			$id = $codigo_tipo_periodo;
			$f = verificaFilhos();
			if(!$f){
				$m = new Metaestat();
				retornaJSON($m->excluirRegistro("i3geoestat_tipo_periodo","codigo_tipo_periodo",$id));
			}
			else{
				retornaJSON("erro");
			}
		}
		else{
			retornaJSON("erro");
		}
		exit;
	break;
	/*
	 Valor: EXCLUIRUNIDADEMEDIDA

	Exclui uma unidade de medida"Dados inseridos"

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
		//impede a alteracao dos valores reservados
		if($codigo_estat_conexao > 0){
			$tabela = "i3geoestat_conexao";
			$id = $codigo_estat_conexao;
			$f = verificaFilhos();
			if(!$f){
				$m = new Metaestat();
				retornaJSON($m->excluirRegistro("i3geoestat_conexao","codigo_estat_conexao",$id));
			}
			else{
				retornaJSON("erro");
			}
		}
		else{
			retornaJSON("erro");
		}
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
		if($formato == "csv"){
			require_once(__DIR__."/../../pacotes/parsecsv/parsecsv.lib.php");
			$csv = new parseCSV();
			$csv->titles = array_keys($dados[0]);
			$csv->output(true, 'mvar'.$id_medida_variavel.'_'.date('dmY').'.csv', $dados);
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
		if(!isset($codigo_tipo_regiao)){
			$codigo_tipo_regiao = "";
		}
		if($formato == "json"){
			retornaJSON($m->mapfileMedidaVariavel($id_medida_variavel,$filtro,$todasascolunas,$tipolayer,$titulolayer,$id_classificacao,$agruparpor,$codigo_tipo_regiao));
		}
		exit;
	break;
	/*
	Valor: MAPFILETIPOREGIAO

	Gera um mapfile de um tipo de regiao

	*/
	case "MAPFILETIPOREGIAO":
		$m = new Metaestat();
		if(empty($outlinecolor)){
			$outlinecolor = "255,0,0";
		}
		if(empty($width)){
			$width = 1;
		}
		if(empty($nomes)){
			$nomes = "nao";
		}
		retornaJSON($m->mapfileTipoRegiao($codigo_tipo_regiao,$outlinecolor,$width,$nomes));
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
	case "CRIATABELADB":
		$m = new Metaestat();
		if($nome_esquema != "i3geo_metaestat"){
			retornaJSON("erro");
			exit;
		}
		retornaJSON($m->criaTabelaDB($codigo_estat_conexao,$nome_esquema,$nome_tabela));
		exit;
	break;
	case "ALTERANOMETABELADB":
		$m = new Metaestat();
		if($nome_esquema != "i3geo_metaestat"){
			retornaJSON("erro");
			exit;
		}
		retornaJSON($m->alteraNomeTabelaDB($codigo_estat_conexao,$nome_esquema,$nome_tabela,$novonome_tabela));
		exit;
	break;
	case "COPIATABELADB":
		$m = new Metaestat();
		if($nome_esquema != "i3geo_metaestat"){
			retornaJSON("erro");
			exit;
		}
		retornaJSON($m->copiaTabelaDB($codigo_estat_conexao,$nome_esquema,$nome_tabela,$novonome_tabela));
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
	case "CRIACOLUNADB":
		$m = new Metaestat();
		if($nome_esquema != "i3geo_metaestat"){
			retornaJSON("erro");
			exit;
		}
		retornaJSON($m->criaColunaDB($codigo_estat_conexao,$nome_esquema,$nome_tabela,$nova_coluna,$tipo));
		exit;
	break;
	case "ALTERANOMECOLUNADB":
		$m = new Metaestat();
		if($nome_esquema != "i3geo_metaestat"){
			retornaJSON("erro");
			exit;
		}
		retornaJSON($m->alteraNomeColunaDB($codigo_estat_conexao,$nome_esquema,$nome_tabela,$nome_coluna,$novonome_coluna));
		exit;
	break;
	case "OBTEMDADOSTABELADB":
		$m = new Metaestat();
		if($formato == "json"){
			retornaJSON($m->obtemDadosTabelaDB($codigo_estat_conexao,$nome_esquema,$nome_tabela,$geo));
		}
		if($formato == "csv"){
			$dados = $m->obtemDadosTabelaDB($codigo_estat_conexao,$nome_esquema,$nome_tabela,$geo);
			require_once(__DIR__."/../../pacotes/parsecsv/parsecsv.lib.php");
			$csv = new parseCSV();
			//$csv->encoding('UTF-16', 'UTF-8');
			$csv->titles = $dados["nomescolunas"];
			$csv->output(true, 'mvar'.$nome_tabela.'_'.date('dmY').'.csv', $dados["linhas"]);
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
		$dados = $m->relatorioCompleto($codigo_variavel,$dadosGerenciais);
		if(empty($detalhes)){
			$detalhes = "sim";
		}
		$dados = $m->formataRelatorioHtml($dados,$detalhes);
		retornaJSON($dados);
		exit;
	break;
	//insere dados com base em um arquivo csv ja existente no servidor
	case "INSERIRDADOS":
		$m = new Metaestat();
		retornaJSON($m->inserirDados($nomearquivoserv,$id_medida_variavel,$codigoregiao,$valor,$tipoinclusao,$ano,$mes,$dia,$hora));
		exit;
	break;
	//grava ou cria um registro de uma regiao
	case "MANTEMDADOSREGIAO":
		$m = new Metaestat();
		retornaJSON($m->mantemDadosRegiao($codigo_tipo_regiao,$identificador,$identificadornovo,$nome,$wkt,$tipo));
		exit;
	break;
	case "LISTAATRIBUTOSMEDIDAVARIAVELXY":
		$m = new Metaestat();
		$regiao = $m->xy2regiao($codigo_tipo_regiao, $x, $y);
		$identificador_regiao = $regiao["identificador_regiao"];
		$resultado = array();
		if($regiao != ""){
			$dados = $m->listaAtributosMedidaVariavelRegiao($identificador_regiao, $id_medida_variavel);
			$resultado = array(
				"atributos"=>$dados,
				"regiao"=>$regiao
			);
		}
		retornaJSON($resultado);
		exit;
	break;
	case "SALVAATRIBUTOSMEDIDAVARIAVEL":
		/*	"&codigo_tipo_regiao="+codigo_tipo_regiao+"&identificador_regiao="+identificador_regiao+"&id_medida_variavel="+id_medida_variavel+"&colunas="+colunasT[0]+"&valores="+valoresT.join("|")+"&idsunicos="+idsunicosT[0]
		*/
		$valores = explode("|",$valores);//array de uma lista de strings com valores separados por ;
		$idsunicos = explode(";",$idsunicos);//array
		$colunas = explode(";",$colunas);//array
		$m = new Metaestat();
		$resultado = $m->salvaAtributosMedidaVariavel($id_medida_variavel,$codigo_tipo_regiao,$identificador_regiao,$idsunicos,$colunas,$valores);
		retornaJSON($resultado);
		exit;
	break;
	case "EXCLUIATRIBUTOSMEDIDAVARIAVEL":
		$m = new Metaestat();
		$resultado = $m->excluiAtributosMedidaVariavel($id_medida_variavel,$codigo_tipo_regiao,$identificador_regiao,$id);
		retornaJSON($resultado);
		exit;
	break;
	case "REGIAO2SHP":
		$m = new Metaestat();
		$shp = $m->regiao2shp($codigo_tipo_regiao);
		include(__DIR__."/../../pacotes/kmlmapserver/classes/zip.class.php");

		$handle = fopen($shp.".shp", "r");
		$contentsshp = fread($handle, filesize($shp.".shp"));
		fclose($handle);

		$handle = fopen($shp.".shp", "r");
		$contentsdbf = fread($handle, filesize($shp.".dbf"));
		fclose($handle);

		$handle = fopen($shp.".shp", "r");
		$contentsshx = fread($handle, filesize($shp.".shx"));
		fclose($handle);

		$ziper = new zipfile();

		$ziper->addFile($contentsshp, basename($shp).'.shp');
		$ziper->addFile($contentsshx, basename($shp).'.shx');
		$ziper->addFile($contentsdbf, basename($shp).'.dbf');
		$arq = $shp.".zip";
		$ziper->output($arq);
		$dirtmp = basename(dirname($arq));
		$d = "/ms_tmp/".basename($arq);
		echo "<html><script> window.location.assign('$d'); </script></html>";
	break;
}
?>