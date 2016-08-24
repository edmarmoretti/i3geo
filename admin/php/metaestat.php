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
Voc&ecirc; deve ter recebido uma copia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/admin/php/metaestat.php

Parametros:

O par&acirc;metro principal &eacute; "funcao", que define qual opera&ccedil;&atilde;o ser&aacute; executada, por exemplo, sistemas.php?funcao=pegasistemas.

Cada opera&ccedil;&atilde;o possu&iacute; seus proprios par&acirc;metros, que devem ser enviados tamb&eacute;m na requisi&ccedil;&atilde;o da opera&ccedil;&atilde;o.
*/
include_once(dirname(__FILE__)."/login.php");

$codigo_estat_conexao = $_GET["codigo_estat_conexao"];//pode ser string ou numerico
$codigo_variavel = $_GET["codigo_variavel"];
$codigo_tipo_periodo = $_GET["codigo_tipo_periodo"];
$codigo_tipo_regiao = $_GET["codigo_tipo_regiao"];
$codigo_unidade_medida = $_GET["codigo_unidade_medida"];
$codigo_tipo_regiao_pai = $_GET["codigo_tipo_regiao_pai"];
$id_medida_variavel = $_GET["id_medida_variavel"];
$id_classificacao = $_GET["id_classificacao"];
$id_link = $_GET["id_link"];
$id_classe = $_GET["id_classe"];
$id_parametro_medida = $_GET["id_parametro_medida"];
$id_fonteinfo = $_GET["id_fonteinfo"];
$id_agregaregiao = $_GET["id_agregaregiao"];
$id_mapa = $_GET["id_mapa"];
$id_mapa_grupo = $_GET["id_mapa_grupo"];
$id_mapa_tema = $_GET["id_mapa_tema"];
$id_pai = $_GET["id_pai"];

testaSafeNumerico([$codigo_tipo_regiao_pai,$id_pai,$id_mapa_tema,$id_mapa_grupo,$id_mapa,$id_agregaregiao,$codigo_tipo_regiao,$codigo_tipo_periodo,$id_fonteinfo,$codigo_unidade_medida,$codigo_variavel,$id_medida_variavel,$id_classificacao,$id_link,$id_classe,$id_parametro_medida]);

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
	"ALTERAFONTEINFO",
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
	"OBTEMDADOSTABELADB",
	"INSERIRDADOS",
	"MANTEMDADOSREGIAO",
	"SALVAATRIBUTOSTIPOREGIAO",
	"SALVAATRIBUTOSMEDIDAVARIAVEL",
	"EXCLUIATRIBUTOSMEDIDAVARIAVEL",
	"REGIAO2SHP",
	"ESQUEMASCONEXAO",
	"TABELASESQUEMA",
	"ALTERAESTILOSCLASSIFICACAO",
	"INFOTABELA"
);
if(in_array(strtoupper($funcao),$funcoesEdicao)){
	//se a funcao esta no array eh feita a verificacao se o usuario esta logado e se ele esta em um grupo que
	//permite o uso da operacao admin/metaestat/geral
	if(verificaOperacaoSessao("admin/metaestat/geral") == false){
		//algumas funcoes possuem tratamento especial sem login
		if(strtoupper($funcao) == "ESQUEMASCONEXAO"){
			$esquema = array(array("oid"=>0,"esquema"=>"public"));
			retornaJSON($esquema);exit;
		}
		if(strtoupper($funcao) == "TABELASESQUEMA"){
			if($_GET["nome_esquema"] != "public"){
				retornaJSON("Vc nao pode realizar essa operacao.");exit;
			}
		}
		if(strtoupper($funcao) != "ESQUEMASCONEXAO" && strtoupper($funcao) != "TABELASESQUEMA"){
			retornaJSON("Vc nao pode realizar essa operacao.");exit;
		}
	}
}
//verifica as funcoes que manipulam o banco de dados
$funcoesEdicao = array(
		"CRIATABELADB",
		"CRIAESQUEMADB",
		"ALTERANOMETABELADB",
		"ALTERANOMEESQUEMADB",
		"COPIATABELADB",
		"CRIACOLUNADB",
		"ALTERANOMECOLUNADB",
);
if(in_array(strtoupper($funcao),$funcoesEdicao)){
	if(verificaOperacaoSessao("admin/metaestat/editorbanco") == false){
		retornaJSON("Vc nao pode realizar essa operacao.");exit;
	}
}




include(dirname(__FILE__)."/classe_metaestat.php");
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
		if(empty($_GET["filtro_esquema"])){
			$_GET["filtro_esquema"] = "";
		}
		retornaJSON($m->listaVariavel($codigo_variavel,$_GET["filtro_esquema"]));
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
			$valores = $m->listaDadosRegiao($codigo_tipo_regiao,$_GET["codigoregiaopai"],$_GET["valorregiaopai"]);
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
			$d = dirname(__FILE__)."/../../ferramentas/metaestat/templates";
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
			$metaestatTemplates = dirname(__FILE__)."/../../ferramentas/metaestat/templates";
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
			$codigo_variavel = $m->alteraVariavel($codigo_variavel,$_GET["nome"],$_GET["descricao"]);
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
		$filtro =  $_GET["filtro"];
		$filtro = str_replace("'",'"',$filtro);
		$m = new Metaestat();
		$default = false;
		//verifica se a criacao da medida esta sendo feita na tabela default
		if($codigo_tipo_periodo < 5 && $esquemadb == "i3geo_metaestat" && $_GET["colunaidgeo"] == "codigoregiao" && $_GET["tabela"] = "dados_medidas"){
			$default = true;
		}
		if(empty($id_medida_variavel)){
			//isso ira criar um novo registro
			$id_medida_variavel = $m->alteraMedidaVariavel($codigo_variavel);
			//o filtro e necessario para permitir a selecao dos registros apenas do que pertence a medida da variavel escolhida
			//se a tabela nao for a default, o filtro nao se aplica
			if($default == true && $filtro == ""){
				$filtro = " id_medida_variavel = $id_medida_variavel ";
			}
			if(!empty($nomemedida)){
				$m->alteraMedidaVariavel("",$id_medida_variavel,$codigo_unidade_medida,$codigo_tipo_periodo,$codigo_tipo_regiao,$codigo_estat_conexao,$_GET["esquemadb"],$_GET["tabela"],$_GET["colunavalor"],$_GET["colunaidgeo"],$_GET["colunaidunico"],$filtro,$_GET["nomemedida"]);
			}
		}
		else{
			//o filtro e necessario para permitir a selecao dos registros apenas do que pertence a medida da variavel escolhida
			if($default == true && $filtro == ""){
				$filtro = " id_medida_variavel = $id_medida_variavel ";
			}
			$m->alteraMedidaVariavel("",$id_medida_variavel,$codigo_unidade_medida,$codigo_tipo_periodo,$codigo_tipo_regiao,$codigo_estat_conexao,$_GET["esquemadb"],$_GET["tabela"],$_GET["colunavalor"],$_GET["colunaidgeo"],$_GET["colunaidunico"],$filtro,$_GET["nomemedida"]);
		}
		if(!empty($_GET["colunaAno"]) || !empty($_GET["colunaMes"]) || !empty($_GET["colunaDia"]) || !empty($_GET["colunaHora"])){
			$default = true;
		}
		//adiciona os parametros de tempo conforme o tipo de periodo escolhido
		//
		//se os nomes das colunas com os parametros de tempo forem definidas
		//os parametros sao criados
		//isso acontece se a criacao da medida estiver sendo feita em uma tabela que nao e a default
		//
		if($default == true){
			$m->excluirRegistro("i3geoestat_parametro_medida","id_medida_variavel",$id_medida_variavel);
			$id_pai = 0;
			//anual
			if($codigo_tipo_periodo >= 1){
				if(empty($_GET["colunaAno"])){
					$_GET["colunaAno"] = "ano";
				}
				$id_parametro_medida = $m->alteraParametroMedida($id_medida_variavel,"","","","","","");
				$m->alteraParametroMedida($id_medida_variavel,$id_parametro_medida,"Ano","",$_GET["colunaAno"],$id_pai,1);
				$id_pai = $id_parametro_medida;
			}
			//mensal
			if($codigo_tipo_periodo >= 2){
				$id_parametro_medida = $m->alteraParametroMedida($id_medida_variavel,"","","","","","");
				if(empty($_GET["colunaMes"])){
					$_GET["colunaMes"] = "mes";
				}
				$m->alteraParametroMedida($id_medida_variavel,$id_parametro_medida,"Mes","",$_GET["colunaMes"],$id_pai,2);
				$id_pai = $id_parametro_medida;
			}
			//diario
			if($codigo_tipo_periodo >= 3){
				$id_parametro_medida = $m->alteraParametroMedida($id_medida_variavel,"","","","","","");
				if(empty($colunaDia)){
					$colunaDia = "dia";
				}
				$m->alteraParametroMedida($id_medida_variavel,$id_parametro_medida,"Dia","",$_GET["colunaDia"],$id_pai,3);
				$id_pai = $id_parametro_medida;
			}
			//horario
			if($codigo_tipo_periodo == 4){
				$id_parametro_medida = $m->alteraParametroMedida($id_medida_variavel,"","","","","","");
				if(empty($_GET["colunaHora"])){
					$_GET["colunaHora"] = "hora";
				}
				$m->alteraParametroMedida($id_medida_variavel,$id_parametro_medida,"Hora","",$_GET["colunaHora"],$id_pai,4);
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
			$m->alteraParametroMedida("",$id_parametro_medida,$_GET["nome"],$_GET["descricao"],$_GET["coluna"],$id_pai,$_GET["tipo"]);
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
				$m->alteraClassificacaoMedida($id_classificacao,$id_classificacao,$_GET["nome"],$_GET["observacao"]);
			}
		}
		else{
			$m->alteraClassificacaoMedida("",$id_classificacao,$_GET["nome"],$_GET["observacao"]);
		}
		retornaJSON($m->listaClassificacaoMedida($id_medida_variavel,$id_classificacao));
		exit;
	break;
	case "CALCULACLASSIFICACAO":
		$cores = $_GET["cores"];
		$limite = $_GET["limite"];
		$numintervalos = $_GET["numintervalos"];
		$tipo = $_GET["tipo"];
		//as cores vem no formato rgb(0,0,0);
		if(!empty($cores)){
			$cores = str_replace("rgb(","",$cores);
			$cores = str_replace(")","",$cores);
			$cores = explode("|",$cores);
		}
		if(empty($limite)){
			$limite = "";
		}

		if($tipo == "quebrasnaturais"){
			$m = new Metaestat();
			$dados = $m->dadosMedidaVariavel($id_medida_variavel,"",0,"",$limite,true);
			$metaVariavel = $m->listaMedidaVariavel("",$id_medida_variavel);
			$colunavalor = $metaVariavel["colunavalor"];
			$valores = array();

			foreach($dados as $d){
				if($d[$colunavalor]){
					$valores[] = $d[$colunavalor];
				}
			}
			include(dirname(__FILE__)."/../../pacotes/jenks-master/jenks.php");
			$intervalos = getJenksClasses($numintervalos, $valores);
			$m->excluirRegistro("i3geoestat_classes","id_classificacao",$id_classificacao);
			for ($i=0; $i < $numintervalos; ++$i){
				if ($i == $numintervalos - 1){
					$expressao = "(([".$colunavalor."]>=".$intervalos[$i]."))";
					$titulo = ">= ".$intervalos[$i];
				}
				else{
					$expressao = "(([".$colunavalor."]>=".$intervalos[$i].")and([".$colunavalor."]<".$intervalos[$i+1]."))";
					$titulo = ">= ".$intervalos[$i]." e < que ".($intervalos[$i+1]);
				}
				$id_classe = $m->alteraClasseClassificacao($id_classificacao);
				if(!empty($cores)){
					$cor = explode(",",$cores[$i]);
					$vermelho = $cor[0];
					$verde = $cor[1];
					$azul = $cor[2];
				}
				$m->alteraClasseClassificacao("",$id_classe,$titulo,$expressao,$vermelho,$verde,$azul,"","","255","255","255","2");
			}
			retornaJSON("ok");
			exit;
		}
		if($tipo == "quartil"){
			$m = new Metaestat();
			$dados = $m->sumarioMedidaVariavel($id_medida_variavel,"","",$limite,true);
			if($dados == false){
				retornaJSON("erro");
				exit;
			}
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
			exit;
			retornaJSON("ok");
			exit;
		}
		//para efeitos de compatibilidade com o nome de $tipo
		if(empty($numintervalos) || $tipo == "intiguais5"){
			$numintervalos = 5;
		}
		if($tipo == "intiguais5" || $tipo == "intiguais"){
			$m = new Metaestat();
			$dados = $m->sumarioMedidaVariavel($id_medida_variavel,"","",$limite,true);
			if($dados == false){
				retornaJSON("erro");
				exit;
			}
			$min = $dados["menor"];
			$max = $dados["maior"];
			$item = $dados["colunavalor"];
			$intervalo = ($max - $min) / $numintervalos;
			//adiciona as classes novas
			$intatual = $min;
			$m->excluirRegistro("i3geoestat_classes","id_classificacao",$id_classificacao);
			for ($i=0; $i < $numintervalos; ++$i){
				if ($i == $numintervalos - 1){
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
			retornaJSON("ok");
			exit;
		}
		//o menor e o maior valor sao enviados como parametro ($min e $max)
		//para efeitos de compatibilidade com o nome de $tipo
		if(empty($numintervalos) || $tipo == "intiguais5mm"){
			$numintervalos = 5;
		}
		if($tipo == "intiguais5mm" || $tipo == "intiguaismm"){
			$m = new Metaestat();
			$metaVariavel = $m->listaMedidaVariavel("",$id_medida_variavel);
			$item = $metaVariavel["colunavalor"];
			$intervalo = ($max - $min) / $numintervalos;
			//adiciona as classes novas
			$intatual = $min;
			$m->excluirRegistro("i3geoestat_classes","id_classificacao",$id_classificacao);
			for ($i=0; $i < $numintervalos; ++$i){
				if ($i == $numintervalos - 1){
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
			retornaJSON("ok");
			exit;
		}
		retornaJSON("ok");
		exit;
	break;
	case "ALTERAESTILOSCLASSIFICACAO":
		$tipo = $_GET["tipo"];
		$aumentar = $_GET["aumentar"];
		if($tipo == "tamanho"){
			$m = new Metaestat();
			$classes = $m->listaClasseClassificacao($id_classificacao);
			$nclasses = count($classes);
			$tamanhoini -= $aumentar;
			for($i=0;$i<$nclasses;$i++){
				$c = $classes[$i];
				$m->alteraClasseClassificacao(
					$id_classificacao,
					$c["id_classe"],
					$c["titulo"],
					$c["expressao"],
					$c["vermelho"],
					$c["verde"],
					$c["azul"],
					$tamanhoini + $aumentar,
					$c["simbolo"],
					$c["overmelho"],
					$c["overde"],
					$c["oazul"],
					$tamanhoini + $aumentar
				);
				$tamanhoini += $aumentar;
			}
			retornaJSON("ok");
			exit;
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
			$titulo = $_GET["titulo"];
			$expressao = $_GET["expressao"];
			$m->alteraClasseClassificacao("",$id_classe,$titulo,$expressao,$_GET["vermelho"],$_GET["verde"],$_GET["azul"],$_GET["tamanho"],$_GET["simbolo"],$_GET["overmelho"],$_GET["overde"],$_GET["oazul"],$_GET["otamanho"]);
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
			$m->alteraLinkMedida("",$id_link,$_GET["nome"],$_GET["link"]);
		}
		retornaJSON($m->listaLinkMedida($id_medida_variavel,$id_link));
		exit;
	break;
	case "ALTERAFONTEINFO":
		$m = new Metaestat();
		if(empty($id_fonteinfo)){
			//isso ira criar um novo registro
			$id_fonteinfo = $m->alteraFonteinfo();
		}
		else{
			$m->alteraFonteinfo($id_fonteinfo,$_GET["titulo"],$_GET["link"]);
		}
		retornaJSON($m->listaFonteinfo($id_fonteinfo));
		exit;
	break;
	case "ADICIONAFONTEINFOMEDIDA":
		$m = new Metaestat();
		//echo $id_medida_variavel;exit;
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
			$codigo_unidade_medida = $m->alteraUnidadeMedida($codigo_unidade_medida,$_GET["nome"],$_GET["sigla"],$_GET["permitesoma"],$_GET["permitemedia"]);
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
			$codigo_estat_conexao = $m->alteraConexao($codigo_estat_conexao,$_GET["bancodedados"],$_GET["host"],$_GET["porta"],$_GET["usuario"]);
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
			$codigo_tipo_regiao = $m->alteraTipoRegiao($codigo_tipo_regiao,$_GET["nome_tipo_regiao"],$_GET["descricao_tipo_regiao"],$_GET["esquemadb"],$_GET["tabela"],$_GET["colunageo"],$_GET["colunacentroide"],$_GET["data"],$_GET["identificador"],$_GET["colunanomeregiao"],$_GET["srid"],$codigo_estat_conexao,$_GET["colunasvisiveis"],$_GET["apelidos"]);
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
			$id_agregaregiao = $m->alteraAgregaRegiao("",$id_agregaregiao,$codigo_tipo_regiao_pai,$_GET["colunaligacao_regiaopai"]);
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
				$codigo_unidade_medida = $m->alteraTipoPeriodo($codigo_tipo_periodo,$_GET["nome"],$_GET["descricao"]);
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
			$id_mapa = $m->alteraMapa($id_mapa,$_GET["titulo"],$_GET["template"],$_GET["logoesquerdo"],$_GET["logodireito"],$_GET["publicado"]);
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
			$id_mapa_grupo = $m->alteraMapaGrupo($id_mapa,$id_mapa_grupo,$_GET["titulo"]);
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
			$id_mapa_tema = $m->alteraMapaTema($id_mapa_grupo,$id_mapa_tema,$_GET["titulo"],$id_medida_variavel);
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
			$m->negativaValoresMedidaVariavel($id);
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
		$resultado["conexaoregistrada"] = $m->listaConexao("",false,false);
		$resultado["fonteinfo"] = $m->listaFonteinfo();
		retornaJSON($resultado);
	break;
	/*
	Valor: SQLMEDIDAVARIAVEL

	Sql para acessar os dados de uma medida de uma variavel

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
		$dados = $m->dadosMedidaVariavel($id_medida_variavel,$_GET["filtro"],$_GET["todasascolunas"],$_GET["agruparpor"]);
		if($_GET["formato"] == "json"){
			retornaJSON($dados);
		}
		if($_GET["formato"] == "xml"){
			header("Content-type: application/xml");
			echo($m->formataXML($dados));
		}
		if($_GET["formato"] == "csv"){
			require_once(dirname(__FILE__)."/../../pacotes/parsecsv/parsecsv.lib.php");
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
		//$filtro usa aspas duplas para enviar os parametros
		$filtro = str_replace('"',"'",$_GET["filtro"]);
		$m = new Metaestat();
		if(!isset($codigo_tipo_regiao)){
			$codigo_tipo_regiao = "";
		}
		if(!isset($_GET["opacidade"])){
			$_GET["opacidade"] = "";
		}
		if($_GET["cachemapfile"] === "nao"){
			$_GET["cachemapfile"] = false;
		}
		else{
			$_GET["cachemapfile"] = true;
		}
		if($_GET["formato"] == "json"){
			retornaJSON($m->mapfileMedidaVariavel($id_medida_variavel,$filtro,$_GET["todasascolunas"],$_GET["tipolayer"],$_GET["titulolayer"],$id_classificacao,$_GET["agruparpor"],$codigo_tipo_regiao,$_GET["opacidade"],false,$_GET["cachemapfile"]));
		}
		exit;
	break;
	/*
	Valor: MAPFILETIPOREGIAO

	Gera um mapfile de um tipo de regiao

	*/
	case "MAPFILETIPOREGIAO":
		$m = new Metaestat();
		if(empty($_GET["outlinecolor"])){
			$_GET["outlinecolor"] = "255,0,0";
		}
		if(empty($_GET["width"])){
			$_GET["width"] = 1;
		}
		if(empty($_GET["nomes"])){
			$_GET["nomes"] = "nao";
		}
		retornaJSON($m->mapfileTipoRegiao($codigo_tipo_regiao,$_GET["outlinecolor"],$_GET["width"],$_GET["nomes"]));
		exit;
	break;
	/*
	Valor: KMLMEDIDAVARIAVEL

	Gera um arquivo kml que pode ser aberto no googleearth

	*/
	case "KMLMEDIDAVARIAVEL":
		$m = new Metaestat();
		$r = $m->mapfileMedidaVariavel($id_medida_variavel,$_GET["filtro"],$_GET["todasascolunas"],$_GET["tipolayer"],$_GET["titulolayer"],$id_classificacao,$_GET["agruparpor"]);
		//cria um mapfile completo, que inclui a camada no mapfile de inicializacao do i3geo
		$mapfile = $m->mapfileCompleto($r["mapfile"]);
		$formato = $_GET["formato"];
		if($formato == "kml" || $formato == "kmz"){
			//define as variaveis necessarias ao pacote kmlserver
			set_time_limit(0);
			$_REQUEST["map"] = $mapfile;
			$_REQUEST["typename"] = $r["layer"];
			$_REQUEST["request"] = $formato;
			//$_REQUEST["service"] = "icon";
			include (dirname(__FILE__)."/../../pacotes/kmlmapserver/classes/kmlserver.class.php");
			$server = new KmlServer();
		}else{//3d com tme
			if(!isset($dir_tmp)){
				include(dirname(__FILE__)."/../../ms_configura.php");
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
			include (dirname(__FILE__)."/../../pacotes/tme/TME_i3geo.php");
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
		$dados = $m->sumarioMedidaVariavel($id_medida_variavel,$_GET["filtro"],$_GET["agruparpor"]);
		if($_GET["formato"] == "json"){
			retornaJSON($dados);
		}
		if($_GET["formato"] == "xml"){
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
		if($_GET["formato"] == "json"){
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
		if(empty($_GET["excluigeom"])){
			$_GET["excluigeom"] = "";
		}
		if($_GET["formato"] == "json"){
			retornaJSON($m->tabelasEsquema($codigo_estat_conexao,$_GET["nome_esquema"],$_GET["excluigeom"]));
		}
		exit;
	break;
	case "CRIATABELADB":
		$m = new Metaestat();
		if($nome_esquema != "i3geo_metaestat"){
			retornaJSON("erro");
			exit;
		}
		retornaJSON($m->criaTabelaDB($codigo_estat_conexao,$_GET["nome_esquema"],$_GET["nome_tabela"],$_GET["comentario"]));
		exit;
	break;
	case "CRIAESQUEMADB":
		$m = new Metaestat();
		retornaJSON($m->criaEsquemaDB($codigo_estat_conexao,$_GET["nome_esquema"]));
		exit;
		break;
	case "ALTERANOMETABELADB":
		$m = new Metaestat();
		if($_GET["nome_esquema"] != "i3geo_metaestat"){
			retornaJSON("erro");
			exit;
		}
		retornaJSON($m->alteraNomeTabelaDB($codigo_estat_conexao,$_GET["nome_esquema"],$_GET["nome_tabela"],$_GET["novonome_tabela"]));
		exit;
	break;
	case "ALTERANOMEESQUEMADB":
		$m = new Metaestat();
		retornaJSON($m->alteraNomeEsquemaDB($codigo_estat_conexao,$_GET["nome_esquema"],$_GET["novonome_esquema"]));
		exit;
	break;
	case "COPIATABELADB":
		$m = new Metaestat();
		if($_GET["nome_esquema"] != "i3geo_metaestat"){
			retornaJSON("erro");
			exit;
		}
		retornaJSON($m->copiaTabelaDB($codigo_estat_conexao,$_GET["nome_esquema"],$_GET["nome_tabela"],$_GET["novonome_tabela"]));
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
		if(empty($_GET["tipo"])){
			$_GET["tipo"] = "";
		}
		if($_GET["formato"] == "json"){
			retornaJSON($m->colunasTabela($codigo_estat_conexao,$_GET["nome_esquema"],$_GET["nome_tabela"],$_GET["tipo"]));
		}
		exit;
	break;
	case "INFOTABELA":
		$m = new Metaestat();
		$colunas = $m->colunasTabela($codigo_estat_conexao,$_GET["nome_esquema"],$_GET["nome_tabela"],"");
		$comentario = $m->comentarioTabela($codigo_estat_conexao,$_GET["nome_esquema"],$_GET["nome_tabela"]);
		if($_GET["formato"] == "json"){
			retornaJSON(array(
				"colunas"=>$colunas,
				"comentario"=>$comentario
			));
		}
		exit;
	case "CRIACOLUNADB":
		$m = new Metaestat();
		if($_GET["nome_esquema"] != "i3geo_metaestat"){
			retornaJSON("erro");
			exit;
		}
		retornaJSON($m->criaColunaDB($codigo_estat_conexao,$_GET["nome_esquema"],$_GET["nome_tabela"],$_GET["nova_coluna"],$_GET["tipo"]));
		exit;
	break;
	case "ALTERANOMECOLUNADB":
		$m = new Metaestat();
		if($_GET["nome_esquema"] != "i3geo_metaestat"){
			retornaJSON("erro");
			exit;
		}
		retornaJSON($m->alteraNomeColunaDB($codigo_estat_conexao,$_GET["nome_esquema"],$_GET["nome_tabela"],$_GET["nome_coluna"],$_GET["novonome_coluna"]));
		exit;
	break;
	case "OBTEMDADOSTABELADB":
		$m = new Metaestat();
		if($_GET["formato"] == "json"){
			retornaJSON($m->obtemDadosTabelaDB($codigo_estat_conexao,$_GET["nome_esquema"],$_GET["nome_tabela"],$_GET["geo"],$_GET["nreg"]));
		}
		if($_GET["formato"] == "csv"){
			$dados = $m->obtemDadosTabelaDB($codigo_estat_conexao,$_GET["nome_esquema"],$_GET["nome_tabela"],$_GET["geo"],$_GET["nreg"]);
			require_once(dirname(__FILE__)."/../../pacotes/parsecsv/parsecsv.lib.php");
			$csv = new parseCSV();
			//$csv->encoding('UTF-16', 'UTF-8');
			$csv->titles = $dados["nomescolunas"];
			$csv->output(true, 'mvar'.$_GET["nome_tabela"].'_'.date('dmY').'.csv', $dados["linhas"]);
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
		if($_GET["formato"] == "json"){
			$c = $m->descreveColunasTabela($codigo_estat_conexao,$_GET["nome_esquema"],$_GET["nome_tabela"]);
			$s = $m->listaTabelaSerial($codigo_estat_conexao,$_GET["nome_esquema"],$_GET["nome_tabela"]);
			for($i=0;$i<count($c);$i++){
				if($c[$i]["field"] == $s){
					$c[$i]["serial"] = true;
				}
				else{
					$c[$i]["serial"] = false;
				}
			}
			retornaJSON($c);
		}
		exit;
	break;
	case "ARVOREVAR":
		$m = new Metaestat();
		if(empty($codigo_variavel)){
			$codigo_variavel = "";
		}
		$dados = $m->relatorioCompleto($codigo_variavel,$_GET["dadosGerenciais"]);
		retornaJSON($dados);
		exit;
		break;
	case "RELATORIOCOMPLETO":
		$m = new Metaestat();
		if(empty($codigo_variavel)){
			$codigo_variavel = "";
		}
		$dados = $m->relatorioCompleto($codigo_variavel,$_GET["dadosGerenciais"]);
		if(empty($_GET["detalhes"])){
			$_GET["detalhes"] = "sim";
		}
		$dados = $m->formataRelatorioHtml($dados,$_GET["detalhes"]);
		retornaJSON($dados);
		exit;
	break;
	//insere dados com base em um arquivo csv ja existente no servidor
	case "INSERIRDADOS":
		$m = new Metaestat();
		retornaJSON($m->inserirDados($nomearquivoserv,$id_medida_variavel,$_GET["codigoregiao"],$_GET["valor"],$_GET["tipoinclusao"],$_GET["ano"],$_GET["mes"],$_GET["dia"],$_GET["hora"]));
		exit;
	break;
	//grava ou cria um registro de uma regiao
	case "MANTEMDADOSREGIAO":
		$m = new Metaestat();
		retornaJSON($m->mantemDadosRegiao($codigo_tipo_regiao,$_GET["identificador"],$_GET["identificadornovo"],$_GET["nome"],$_GET["wkt"],$_GET["tipo"]));
		exit;
	break;
	case "LISTAATRIBUTOSMEDIDAVARIAVELXY":
		$m = new Metaestat();
		$regiao = $m->xy2regiao($codigo_tipo_regiao, $_GET["x"], $_GET["y"]);
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
	case "LISTATODOSATRIBUTOSMEDIDAVARIAVELXY":
		$lista = array();
		$m = new Metaestat();
		$regiao = $m->xy2regiao($codigo_tipo_regiao, $_GET["x"], $_GET["y"]);
		$identificador_regiao = $regiao["identificador_regiao"];
		$variaveis = $m->listaVariavel();
		$dadosVariavel = array();

		foreach($variaveis as $variavel){
			$medidas = $m->listaMedidaVariavel($variavel["codigo_variavel"]);
			$valores = array();
			foreach($medidas as $medida){
				$dadosMedida = $m->listaAtributosMedidaVariavelRegiao($identificador_regiao,$medida["id_medida_variavel"]);
				if($dadosMedida != ""){
					$valores[] = array(
						"medida" => $medida["nomemedida"],
						"dados" => $dadosMedida
					);
				}
			}
			if(!empty($valores)){
				$dadosVariavel[] = array(
					"variavel" => $variavel["nome"],
					"dados" => $valores
				);
			}
		}
		retornaJSON($dadosVariavel);
		exit;
	break;
	case "SALVAATRIBUTOSMEDIDAVARIAVEL":
		/*	"&codigo_tipo_regiao="+codigo_tipo_regiao+"&identificador_regiao="+identificador_regiao+"&id_medida_variavel="+id_medida_variavel+"&colunas="+colunasT[0]+"&valores="+valoresT.join("|")+"&idsunicos="+idsunicosT[0]
		*/
		$_GET["valores"] = explode("#",$_GET["valores"]);//array de uma lista de strings com valores separados por ;
		$_GET["idsunicos"] = explode("|",$_GET["idsunicos"]);//array
		$_GET["colunas"] = explode("|",$_GET["colunas"]);//array
		$m = new Metaestat();
		$resultado = $m->salvaAtributosMedidaVariavel($id_medida_variavel,$codigo_tipo_regiao,$_GET["identificador_regiao"],$_GET["idsunicos"],$_GET["colunas"],$_GET["valores"]);
		retornaJSON($resultado);
		exit;
	break;
	//utilizado na ferramenta de identificacao
	case "SALVAATRIBUTOSTIPOREGIAO":
		$m = new Metaestat();
		$resultado = $m->mantemDadosRegiao($codigo_tipo_regiao,$_GET["identificador_regiao"],$_GET["identificador_regiao"],$_GET["valores"],"","alterar",$_GET["colunas"]);
		retornaJSON($resultado);
		exit;
		break;
	case "EXCLUIATRIBUTOSMEDIDAVARIAVEL":
		$m = new Metaestat();
		$resultado = $m->excluiAtributosMedidaVariavel($id_medida_variavel,$codigo_tipo_regiao,$_GET["identificador_regiao"],$id);
		retornaJSON($resultado);
		exit;
	break;
	case "REGIAO2SHP":
		$m = new Metaestat();
		$shp = $m->regiao2shp($codigo_tipo_regiao);
		include(dirname(__FILE__)."/../../pacotes/kmlmapserver/classes/zip.class.php");

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
