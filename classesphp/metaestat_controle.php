<?php
//
//o aplicativo que abre a janela para acesso a lista de variaveis, nao necessita da variavel de sessao
//
include ("sani_request.php");
$_pg = array_merge ( $_GET, $_POST );
$funcao = $_pg ["funcao"];
$g_sid = $_pg ["g_sid"];

if (empty ( $g_sid ) && strtoupper($funcao) != "LISTAVARIAVEL") {
	exit ();
}
if(!empty ( $g_sid )){
	session_name ( "i3GeoPHP" );
	session_id ( $g_sid );
	session_start ();
	$perfil = $_SESSION ["perfil"];
	$_pg ["perfil"] = $perfil;
	$map_file = $_SESSION ["map_file"];
	if (! file_exists ( $map_file )) {
		exit ();
	}
}
include (dirname ( __FILE__ ) . "/carrega_ext.php");
if (! function_exists ( "sobeAnno" )) {
	include (dirname ( __FILE__ ) . "/funcoes_gerais.php");
}
if (! isset ( $map_file ) && strtoupper($funcao) != "LISTAVARIAVEL") {
	ilegal ();
	exit ();
}
include (dirname ( __FILE__ ) . "/../ms_configura.php");
include (dirname ( __FILE__ ) . "/classe_metaestatinfo.php");
$retorno = "";

switch (strtoupper ( $funcao )) {
	case "RELATORIOCOMPLETO" :
		$m = new MetaestatInfo();
		if(empty($_pg ["codigo_variavel"])){
			$_pg ["codigo_variavel"] = "";
		}
		$dados = $m->relatorioCompleto($_pg ["codigo_variavel"],$_pg ["dadosGerenciais"]);
		if(empty($_pg["detalhes"])){
			$_pg["detalhes"] = "sim";
		}
		$dados = $m->formataRelatorioHtml($dados,$_pg["detalhes"]);
		retornaJSON($dados);
		break;
	case "LISTATIPOREGIAO" :
		$m = new MetaestatInfo ();
		$retorno = $m->listaTipoRegiao ( $_pg ["codigo_tipo_regiao"], false );
		retornaJSON ( $retorno );
		exit ();
		break;
	case "LISTAVARIAVEL" :
		$m = new MetaestatInfo ();
		if (empty ( $_pg ["filtro_esquema"] )) {
			$_pg ["filtro_esquema"] = "";
		}
		retornaJSON ( $m->listaVariavel ( $_pg ["codigo_variavel"], $_pg ["filtro_esquema"] ) );
		exit ();
		break;
	case "LISTAMEDIDAVARIAVEL" :
		$m = new MetaestatInfo ();
		retornaJSON ( $m->listaMedidaVariavel ( $_pg ["codigo_variavel"], $_pg ["id_medida_variavel"] ) );
		exit ();
		break;
	case "LISTAPARAMETRO" :
		$m = new MetaestatInfo ();
		retornaJSON ( $m->listaParametro ( $_pg ["id_medida_variavel"], $_pg ["id_parametro_medida"] ) );
		exit ();
		break;
	case "LISTAVALORESPARAMETRO" :
		$m = new MetaestatInfo ();
		retornaJSON ( $m->listaValoresParametro ( $_pg ["id_parametro_medida"] ) );
		exit ();
		break;
	case "LISTAUNIDADEMEDIDA" :
		$m = new MetaestatInfo ();
		retornaJSON ( $m->listaUnidadeMedida ( $_pg ["codigo_unidade_medida"] ) );
		exit ();
		break;
	case "LISTAFONTEINFO" :
		$m = new MetaestatInfo ();
		retornaJSON ( $m->listaFonteinfo ( $_pg ["id_fonteinfo"] ) );
		exit ();
		break;
	case "LISTAFONTEINFOMEDIDA" :
		$m = new MetaestatInfo ();
		retornaJSON ( $m->listaFonteinfoMedida ( $_pg ["id_medida_variavel"] ) );
		exit ();
		break;
	case "LISTATIPOPERIODO" :
		$m = new MetaestatInfo ();
		retornaJSON ( $m->listaTipoPeriodo ( $_pg ["codigo_tipo_periodo"] ) );
		exit ();
		break;
	case "LISTATIPOREGIAO" :
		$m = new MetaestatInfo ();
		retornaJSON ( $m->listaTipoRegiao ( $_pg ["codigo_tipo_regiao"] ) );
		exit ();
		break;
	case "LISTAHIERARQUIAREGIOES" :
		$m = new MetaestatInfo ();
		$regioes = $m->listaHierarquiaRegioes ( $_pg ["codigo_tipo_regiao"] );
		$valores = "";
		// se achou apenas uma regiao, pega os valores
		if (count ( $regioes ) < 2 && $_pg ["codigo_tipo_regiao"] != "") {
			$valores = $m->listaDadosRegiao ( $_pg ["codigo_tipo_regiao"], $_pg ["codigoregiaopai"], $_pg ["valorregiaopai"] );
		}
		retornaJSON ( array (
				"regiaopai" => $_pg ["codigo_tipo_regiao"],
				"regioes" => $regioes,
				"valores" => $valores
		) );
		exit ();
		break;
	case "LISTAREGIOESMEDIDA" :
		$m = new MetaestatInfo ();
		retornaJSON ( $m->listaRegioesMedida ( $_pg ["id_medida_variavel"] ) );
		exit ();
		break;
	case "LISTAAGREGAREGIAO" :
		$m = new MetaestatInfo ();
		if (empty ( $_pg ["codigo_tipo_regiao"] )) {
			$_pg ["codigo_tipo_regiao"] = "";
		}
		retornaJSON ( $m->listaAgregaRegiao ( $_pg ["codigo_tipo_regiao"], $_pg ["id_agregaregiao"] ) );
		exit ();
	case "LISTAMAPAS" :
		$m = new MetaestatInfo ();
		if (empty ( $_pg ["id_mapa"] )) {
			$_pg ["id_mapa"] = "";
		}
		retornaJSON ( $m->listaMapas ( $_pg ["id_mapa"] ) );
		exit ();
		break;
	case "LISTAGRUPOSMAPA" :
		$m = new MetaestatInfo ();
		retornaJSON ( $m->listaGruposMapa ( $_pg ["id_mapa"], $_pg ["id_mapa_grupo"] ) );
		exit ();
		break;
	case "LISTATEMASMAPA" :
		$m = new MetaestatInfo ();
		retornaJSON ( $m->listaTemasMapa ( $_pg ["id_mapa_grupo"], $_pg ["id_mapa_tema"] ) );
		exit ();
		break;
	// lista os templates que o usuario pode escolher para publicar mapas
	// a pasta com alista e definida na variavel $metaestatTemplates localizada no ms_configura.php
	case "LISTATEMPLATESMAPA" :
		if (empty ( $metaestatTemplates )) {
			$d = dirname ( __FILE__ ) . "/../../ferramentas/metaestat/templates";
		} else {
			$d = $locaplic . $metaestatTemplates;
		}
		$arq = listaArquivos ( $d );
		$arq ["metaestatTemplates"] = $metaestatTemplates;
		retornaJSON ( $arq );
		exit ();
		break;
	// lista os logos que o usuario pode escolher para publicar mapas
	// a pasta com alista e definida na variavel $metaestatTemplates/logos localizada no ms_configura.php
	case "LISTALOGOSMAPA" :
		if (empty ( $metaestatTemplates )) {
			$metaestatTemplates = dirname ( __FILE__ ) . "/../../ferramentas/metaestat/templates";
		} else {
			$metaestatTemplates = $locaplic . $metaestatTemplates;
		}
		retornaJSON ( listaArquivos ( $metaestatTemplates . "/logos" ) );
		exit ();
		break;
	case "LISTACLASSIFICACAOMEDIDA" :
		$m = new MetaestatInfo ();
		$lista = $m->listaClassificacaoMedida ( $_pg ["id_medida_variavel"], $_pg ["id_classificacao"] );
		if(count($lista) == 0){
			$lista = array(array("id_classificacao"=>"","nome"=>"default"));
		}
		retornaJSON ( $lista );
		exit ();
		break;
	case "MAPFILEMEDIDAVARIAVEL" :
		// $filtro usa aspas duplas para enviar os parametros
		$_pg["filtro"] = str_replace ( '"', "'", $_pg ["filtro"] );
		$m = new MetaestatInfo ();
		if (! isset ( $_pg["codigo_tipo_regiao"] )) {
			$_pg["codigo_tipo_regiao"] = "";
		}
		if (! isset ( $_pg["opacidade"] )) {
			$_pg["opacidade"] = "";
		}
		if ($_pg["cachemapfile"] === "nao") {
			$_pg["cachemapfile"] = false;
		} else {
			$_pg["cachemapfile"] = true;
		}
		if ($_pg["formato"] == "json") {
			retornaJSON ( $m->mapfileMedidaVariavel ( $_pg["id_medida_variavel"], $_pg["filtro"], $_GET ["todasascolunas"], $_GET ["tipolayer"], $_GET ["titulolayer"], $_pg["id_classificacao"], $_GET ["agruparpor"], $_pg["codigo_tipo_regiao"], $_GET ["opacidade"], false, $_GET ["cachemapfile"] ) );
		}
		exit ();
		break;
}
function retornaJSON($obj) {
	global $locaplic;
	include_once ($locaplic . "/pacotes/cpaint/JSON/json2.php");
	//error_reporting ( 0 );
	ob_end_clean ();
	$j = new Services_JSON ();
	$texto = $j->encode ( $obj );
	if (! mb_detect_encoding ( $texto, "UTF-8", true )) {
		$texto = utf8_encode ( $texto );
	}
	echo $texto;
}
?>
