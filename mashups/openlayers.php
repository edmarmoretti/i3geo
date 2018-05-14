<?php
/**
 * DESLIGACACHE (opcional) {sim|nao} - forca a nao usar o cache de imagens qd
 * definido como "sim", do contr&aacute;rio, o uso ou n&atilde;o do cache
 * ser&aacute; definido automaticamente
 */
include_once (dirname(__FILE__) . "/../ms_configura.php");
include_once (dirname(__FILE__) . "/../classesphp/sani_request.php");
include_once (dirname(__FILE__) . "/../classesphp/carrega_ext.php");
include_once (dirname(__FILE__) . "/../classesphp/funcoes_gerais.php");
error_reporting(0);
// variaveis utilizadas
$parurl = array_merge($_GET, $_POST);
if (count($parurl) == 0) {
    ajuda();
    exit();
}

if (isset($parurl["opacidade"])) {
    $opacidade = $parurl["opacidade"] * 1;
} else {
    $opacidade = "''";
}
if (isset($parurl["restauramapa"])) {
    $restauramapa = $parurl["restauramapa"] * 1;
} else {
    $restauramapa = "''";
}
if (isset($parurl["mapext"])) {
    $mapext = str_replace(" ", ",", $parurl["mapext"]);
    $mapext = "[$mapext]";
} else {
    $mapext = "[]";
}
if (! isset($parurl["temas"]) && isset($parurl["layers"])) {
    $parurl["temas"] = $parurl["layers"];
}
$temas = explode(",", str_replace(" ", ",", $parurl["temas"]));
if (! isset($parurl["visiveis"])) {
    $parurl["visiveis"] = $parurl["temas"];
}
$visiveis = explode(",", str_replace(" ", ",", $parurl["visiveis"]));
$off = array_diff($temas, $visiveis);
// filtros
$filtros = array();
foreach ($temas as $tema) {
    if (isset($parurl["map_layer_" . $tema . "_filter"])) {
        $filtros[] = array(
            "layer" => $tema,
            "expression" => $parurl["map_layer_" . $tema . "_filter"]
        );
    }
}
$filtros = json_encode($filtros);

$estilo = "";
if (isset($parurl["altura"])) {
    $estilo .= ";height:" . $parurl["altura"] . "px";
}
if (isset($parurl["largura"])) {
    $estilo .= ";width:" . $parurl["largura"] . "px";
}

//
// define quais controles ser&atilde;o mostrados no mapa
//
$objControles = array(
    "new ol.control.Attribution({collapsible: true})"
);
if (isset($parurl["controles"])) {
    $controles = $parurl["controles"];
    $controles = str_replace(" ", ",", $controles);
    $controles = strtolower($controles);
    $controles = explode(",", $controles);
    if (in_array("navigation", $controles)) {
        $objControles[] = "new ol.control.Zoom()";
    }
    if (in_array("panzoombar", $controles)) {
        $objControles[] = "new ol.control.ZoomSlider()";
    }
    if (in_array("scaleline", $controles)) {
        $objControles[] = "new ol.control.ScaleLine()";
    }
    if (in_array("mouseposition", $controles)) {
        $objControles[] = "new ol.control.MousePosition({coordinateFormat : function(c){return ol.coordinate.toStringHDMS(c);}})";
    }
    if (in_array("overviewmap", $controles)) {
        $objControles[] = "new ol.control.OverviewMap()";
    }
} else {
    $controles = "";
    $objControles[] = "new ol.control.Zoom()";
    $objControles[] = "new ol.control.ZoomSlider()";
    $objControles[] = "new ol.control.ScaleLine()";
    $objControles[] = "new ol.control.MousePosition({coordinateFormat : function(c){return ol.coordinate.toStringHDMS(c);}})";
}
//
// define quais botoes ser&atilde;o mostrados no mapa
//
$objBotoes = array();
$objBotoesHtml = array();
if (isset($parurl["botoes"])) {
    $botoes = $parurl["botoes"];
    $botoes = str_replace(" ", ",", $botoes);
    $botoes = strtolower($botoes);
    $botoes = explode(",", $botoes);
    if (in_array("imprimir", $botoes)) {
        $objBotoes[] = "'imprimir':true";
    }
    if (in_array("pan", $botoes)) {
        $objBotoes[] = "'pan':true";
    }
    $objBotoesHtml["zoombox"] = "hidden";
    if (in_array("zoombox", $botoes)) {
        // usa bootstrap
        $objBotoes[] = "'zoombox':false";
        $objBotoesHtml["zoombox"] = "";
    }
    $objBotoesHtml["analise"] = "hidden";
    if (in_array("analise", $botoes)) {
        // usa bootstrap
        $objBotoesHtml["analise"] = "";
    }
    $objBotoesHtml["camadas"] = "hidden";
    if (in_array("camadas", $botoes)) {
        // usa bootstrap
        $objBotoesHtml["camadas"] = "";
    }
    $objBotoesHtml["catalogo"] = "hidden";
    if (in_array("catalogo", $botoes)) {
        // usa bootstrap
        $objBotoesHtml["catalogo"] = "";
    }
    $objBotoesHtml["legenda"] = "hidden";
    if (in_array("legenda", $botoes)) {
        // usa bootstrap
        $objBotoes[] = "'legenda':false";
        $objBotoesHtml["legenda"] = "";
    }
    $objBotoesHtml["procura"] = "hidden";
    if (in_array("procura", $botoes)) {
        // usa bootstrap
        $objBotoes[] = "'procura':false";
        $objBotoesHtml["procura"] = "";
    }
    $objBotoesHtml["identifica"] = "hidden";
    if (in_array("identifica", $botoes)) {
        // usa bootstrap
        $objBotoes[] = "'identifica':false";
        $objBotoesHtml["identifica"] = "";
    }
    $objBotoesHtml["zoomtot"] = "hidden";
    if (in_array("zoomtot", $botoes)) {
        // usa bootstrap
        $objBotoes[] = "'zoomtot':false";
        $objBotoesHtml["zoomtot"] = "";
    }
    $objBotoesHtml["zoomanterior"] = "hidden";
    if (in_array("zoomanterior", $botoes)) {
        // usa bootstrap
        $objBotoesHtml["zoomanterior"] = "";
    }
    $objBotoesHtml["zoomproximo"] = "hidden";
    if (in_array("zoomproximo", $botoes)) {
        // usa bootstrap
        $objBotoesHtml["zoomproximo"] = "";
    }
    $objBotoesHtml["grid"] = "hidden";
    if (in_array("grid", $botoes)) {
        // usa bootstrap
        $objBotoes[] = "'grid':false";
        $objBotoesHtml["grid"] = "";
    }
    $objBotoesHtml["marcador"] = "hidden";
    if (in_array("marcador", $botoes)) {
        // usa bootstrap
        $objBotoesHtml["marcador"] = "";
    }
    if (in_array("zoomout", $botoes)) {
        $objBotoes[] = "'zoomout':true";
    }
    if (in_array("zoomin", $botoes)) {
        $objBotoes[] = "'zoomin':true";
    }
    if (in_array("distancia", $botoes)) {
        $objBotoes[] = "'distancia':true";
    }
    if (in_array("area", $botoes)) {
        $objBotoes[] = "'area':true";
    }
    if (in_array("linha", $botoes)) {
        $objBotoes[] = "'linha':true";
    }
    if (in_array("ponto", $botoes)) {
        $objBotoes[] = "'ponto':true";
    }
    if (in_array("poligono", $botoes)) {
        $objBotoes[] = "'poligono':true";
    }
    if (in_array("edita", $botoes)) {
        $objBotoes[] = "'edita':true";
    }
    if (in_array("listag", $botoes)) {
        $objBotoes[] = "'listag':true";
    }
    if (in_array("corta", $botoes)) {
        $objBotoes[] = "'corta':true";
    }
    if (in_array("apaga", $botoes)) {
        $objBotoes[] = "'apaga':true";
    }
    if (in_array("salva", $botoes)) {
        $objBotoes[] = "'salva':true";
    }
    if (in_array("ajuda", $botoes)) {
        $objBotoes[] = "'ajuda':true";
    }
    if (in_array("fecha", $botoes)) {
        $objBotoes[] = "'fecha':true";
    }
    if (in_array("tools", $botoes)) {
        $objBotoes[] = "'tools':true";
    }
    if (in_array("undo", $botoes)) {
        $objBotoes[] = "'undo':true";
    }
    if (in_array("propriedades", $botoes)) {
        $objBotoes[] = "'propriedades':true";
    }
    if (in_array("frente", $botoes)) {
        $objBotoes[] = "'frente':true";
    }
    if (in_array("texto", $botoes)) {
        $objBotoes[] = "'texto':true";
    }
    if (in_array("novaaba", $botoes)) {
        $objBotoes[] = "'novaaba':true";
    }
    $botoes = "{" . implode(",", $objBotoes) . "}";
} else {
    $objBotoes[] = "'imprimir':true";
    $objBotoesHtml["zoombox"] = "";
    $objBotoesHtml["analise"] = "";
    $objBotoesHtml["camadas"] = "";
    $objBotoesHtml["catalogo"] = "";
    $objBotoesHtml["legenda"] = "";
    $objBotoesHtml["procura"] = "";
    $objBotoesHtml["identifica"] = "";
    $objBotoesHtml["zoomtot"] = "";
    $objBotoesHtml["zoomanterior"] = "";
    $objBotoesHtml["zoomproximo"] = "";
    $objBotoesHtml["grid"] = "";
    $objBotoesHtml["marcador"] = "";
    $objBotoes[] = "'distancia':true";
    $objBotoes[] = "'area':true";
    $objBotoes[] = "'linha':true";
    $objBotoes[] = "'ponto':true";
    $objBotoes[] = "'poligono':true";
    $objBotoes[] = "'edita':true";
    $objBotoes[] = "'listag':true";
    $objBotoes[] = "'corta':true";
    $objBotoes[] = "'apaga':true";
    $objBotoes[] = "'salva':true";
    $objBotoes[] = "'tools':true";
    $objBotoes[] = "'undo':true";
    $objBotoes[] = "'propriedades':true";
    $objBotoes[] = "'frente':true";

    $botoes = "{" . implode(",", $objBotoes) . "}";
}
if (isset($parurl["kml"])) {
    $kml = $parurl["kml"];
    $kml = str_replace(" ", ",", $kml);
    $kml = explode(",", $kml);
    $kml = "'" . implode("','", $kml) . "'";
} else {
    $kml = "";
}
if (isset($parurl["DESLIGACACHE"])) {
    $DESLIGACACHE = $parurl["DESLIGACACHE"];
} else {
    $DESLIGACACHE = "";
}
if (isset($parurl["numzoomlevels"])) {
    $numzoomlevels = $parurl["numzoomlevels"];
} else {
    $numzoomlevels = 20;
}
if (isset($parurl["maxextent"])) {
    $maxextent = "[" . $parurl["maxextent"] . "]";
} else {
    $maxextent = "undefined";
}
if (isset($parurl["pontos"])) {
    $pontos = str_replace(" ", ",", $parurl["pontos"]);
} else {
    $pontos = "";
}
if (isset($parurl["marca"])) {
    $marca = $parurl["marca"];
} else {
    $marca = "../pacotes/openlayers/img/marker-gold.png";
}
if (isset($parurl["tiles"])) {
    $tiles = $parurl["tiles"];
} else {
    $tiles = "true";
}
if (isset($parurl["ativarodadomouse"]) && $parurl["ativarodadomouse"] == "false") {
    $ativarodadomouse = "";
} else {
    $ativarodadomouse = "new ol.interaction.MouseWheelZoom(),";
}
if (! isset($parurl["legendahtml"])) {
    $parurl["legendahtml"] = "";
}
$legendahtml = $parurl["legendahtml"];
if (! isset($parurl["layerDefault"])) {
    $parurl["layerDefault"] = "";
}
$layerDefault = $parurl["layerDefault"];
// cria as pastas temporarias caso nao existam
if (! file_exists($dir_tmp)) {
    @mkdir($dir_tmp, 0744);
}
if (file_exists($dir_tmp)) {
    if (! file_exists($dir_tmp . "/comum")) {
        @mkdir($dir_tmp . "/comum", 0744);
    }
    if (! file_exists($dir_tmp . "/saiku-datasources")) {
        @mkdir($dir_tmp . "/saiku-datasources", 0744);
        chmod($dir_tmp . "/saiku-datasources", 0744);
    }
    if (! file_exists($dir_tmp . "/cache")) {
        @mkdir($dir_tmp . "/cache", 0744);
        chmod($dir_tmp . "/cache", 0744);
    }
    if (! file_exists($dir_tmp . "/cache/googlemaps")) {
        @mkdir($dir_tmp . "/cache/googlemaps", 0744);
        chmod($dir_tmp . "/cache/googlemaps", 0744);
    }
}
if (empty($opacidade)) {
    $opacidade = 1;
}

function ajuda()
{
    echo "
	<pre><b>
	Mashup OpenLayers
	Par&acirc;metros:
	.restauramapa - id do mapa armazenado no sistema de administracao e que ser&aacute; restaurado para ser aberto novamente (veja em i3geo/admin/catalogo/mapas/index.php)
	.opacidade - opacidade (de 0 a 1) aplicada aos temas do tipo poligonal ou raster (default 1)
	.kml - lista de endere&ccedil;os (url) de um arquivos kml que ser&atilde;o adicionados ao mapa. Separado por ','
	.temas - lista com os temas (mapfiles) do i3Geo que ser&atilde;o inclu&iacute;dos no mapa. Pode ser inclu&iacute;do um arquivo mapfile que esteja fora da pasta i3geo/temas. Nesse caso, deve-se definir o caminho completo do arquivo e tamb&eacute;m o par&acirc;metro &layers
	.visiveis - lista de temas (mesmos nomes do par&acirc;metro temas) que iniciar&atilde;o como vis&iacute;veis no mapa. Se n&atilde;o for definido, todos os temas ser&atilde;o vis&iacute;veis.
	.numzoomlevels - n&uacute;mero de n&iacute;veis de zoom
	.maxextent - extens&atilde;o geogr&aacute;fica m&aacute;xima do mapa (xmin,ymin,xmax,ymax)
	.mapext - extens&atilde;o geogr&aacute;fica inicial do mapa (xmin,ymin,xmax,ymax)
	.largura - lagura do mapa em pixels
	.altura - altura do mapa em pixels
	.pontos - lista de coordenadas x e y que ser&atilde;o inclu&iacute;das como marcas no mapa
	.marca - nome do arquivo que cont&eacute;m a imagem que ser&aacute; utilizada para mostrar as coordenadas
	.tiles (true|false) - indica se o modo tile ser&aacute; usado ou n&atilde;o (true por default). O modo tile pode tornar o mashup mais lento em algumas situa&ccedil;&otilde;es.
	.ativarodadomouse (true|false) - ativa ou n&atilde;o o zoom com base na roda do mouse (default &eacute; true)

	.Filtros

	filtros podem ser adicionados incluindo o parametro da seguinte forma: &map_layer_<nomedotema>_filter=

	Exemplo de filtro

	?map_layer__lbiomashp_filter=(('[CD_LEGENDA]'='CAATINGA'))

	no caso de camadas Postgis basta usar map_layer__lbiomashp_filter=cd_legenda='CAATINGA'

	.fundo - lista com os nomes, separados por ',' dos layers que ser&atilde;o usados como fundo para o mapa. Se n&atilde;o for definido,
	ser&aacute; usado o default. O primeiro da lista ser&aacute; o fundo ativo. Se na lista de temas de fundo estiver algum
	tema incluido com o parametro 'temas', esses ser&atilde;o inclu&iacute;dos como temas de fundo.
	Quando for vazio, o ultimo layer sera considerado como o layer de fundo
	Os seguintes fundos podem usados nessa lista: (lista completa na variavel i3GEO.Interface.openlayers.LAYERSADICIONAIS que pode ser verificada por meio do console javascript do navegador)

	eng
	oce - ESRI Ocean Basemap
	ims - ESRI Imagery World 2D
	wsm - ESRI World Street Map

	.controles - lista com os nomes dos controles que ser&atilde;o adicionados ao mapa. Se n&atilde;o for definido, todos os controles ser&atilde;o adicionados
	   navigation
	   panzoombar
	   scaleline
	   mouseposition
	   overviewmap
	   keyboarddefaults

    .botoes - lista com os nomes dos botoes que ser&atilde;o adicionados ao mapa. Se n&atilde;o for definido, todos os bot&otilde;es ser&atilde;o adicionados
    	zoombox
    	zoomtot
        zoomanterior
        zoomproximo
    	distancia
    	area
    	identifica
    	ponto
    	linha
    	poligono
    	texto
    	edita
    	listag (lista geometrias)
    	apaga
    	captura
    	procura
    	frente
    	propriedades
    	tools
    	undo
    	salva
    	ajuda
    	fecha
    	corta
    	legenda
    	novaaba
    	grid
    	imprimir
        marcador
        analise
        catalogo
        camadas
	";
    exit();
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta http-equiv="Category" content="i3Geo Mapa interativo MMA geoprocessamento sig mobile">
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0">
<title>i3GEO - OpenLayers</title>
<script src="../pacotes/ol4/ol.js"></script>
<script src="../js/i3geo.js"></script>
<!-- lista com os links que serao mostrados na guia ferramentas -->
<script src="listaDeFerramentas.js"></script>
<!-- configuracoes default tipo pode ser OL (openLayers) ou GM (googlemaps) -->
<script src="../interface/config.php?tipo=OL"></script>
<script src="../ferramentas/editorol/editorol.js"></script>
<link rel="stylesheet" type="text/css" href="../pacotes/ol4/ol.css">
<link rel="stylesheet" type="text/css" href="../pacotes/bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="../pacotes/bootstrap-material-design/dist/css/bootstrap-material-design.min.css">
<!-- <link rel="stylesheet" type="text/css" href="../pacotes/bootstrap-material-design/dist/css/ripples.min.css">-->

<!-- <link rel="stylesheet" type="text/css" href="../pacotes/bootstrap-accessibility-plugin/plugins/js/bootstrap-accessibility.min.js"> -->
<link rel="stylesheet" type="text/css" href="../css/default.css">
<style>
.ol-attribution.ol-uncollapsible {
    height: 2.1em;
    right: 24px;
    background: none;
    margin-bottom: 35px;
}

.foraDoMapa+span>span {
	background-color: yellow;
}

.olControlEditingToolbar1 {
	width: auto;
	float: none;
	right: 0px;
}

.olControlEditingToolbar1 div {
	background-image: url(openlayers.png);
	background-repeat: no-repeat;
	float: left;
	right: 0px;
	height: 29px;
	margin: 2px;
	width: 29px;
	cursor: pointer;
	top: 0px;
	padding: px;
}

.ol-i3GEOcontrols {
	top: 2.8em;
	left: 3.5em;
	width: auto;
	max-width: 70px;
}

.ol-mouse-position {
	left: 10px;
	position: absolute;
	bottom: 5px;
	top: auto;
}
</style>
</head>
<!-- As palavras entre {{{}}} sao utilizadas para a traducao. Veja i3geo/js/dicionario.js
		Marque com data-traduzir="true" os elementos que deverao passar pelo tradutor
	-->
<body id="i3geo" style='background: white;'>
    <div style="background: white;<?php echo $estilo;?>">
        <div id="mapai3Geo" style="<?php echo $estilo;?>"></div>
        <!-- barra de icones de navegacao -->
        <div class="ol-i3GEOcontrols ol-control" data-traduzir="true">
            <button title="{{{volta}}}" class="<?php echo $objBotoesHtml["zoomanterior"];?>" onclick="i3GEO.navega.extensaoAnterior()" style="float: left;">
                <!--<img style="width:16px;" src="../imagens/oxygen/16x16/draw-triangle1.png">-->
                <i class="material-icons">undo</i>
            </button>
            <button title="{{{avanca}}}" class="<?php echo $objBotoesHtml["zoomproximo"];?>" onclick="i3GEO.navega.extensaoProximo()" style="float: left;">
                <!--<img style="width:16px;" src="../imagens/oxygen/16x16/draw-triangle2.png">-->
                <i class="material-icons">redo</i>
            </button>
            <button title="{{{d2t}}}" class="<?php echo $objBotoesHtml["zoomtot"];?>" onclick="i3GEO.Interface.zoom2ext(i3GEO.parametros.extentTotal)" style="float: left;">
                <!--<img style="width:20px;" src="../imagens/gisicons/projection.png">-->
                <i class="material-icons">public</i>
            </button>
            <button onclick="i3GEO.Interface.zoomli()" class="<?php echo $objBotoesHtml["zoombox"];?>" style="float: left;">
                <!--<img style="width:20px;" src="../imagens/gisicons/zoom-region.png">-->
                <i class="material-icons">zoom_in</i>
            </button>

            <button title="{{{graticule}}}" class="<?php echo $objBotoesHtml["grid"];?>" onclick="i3GEO.Interface.grade()" style="float: left;">
                <!--<img style="width:16px;" src="../imagens/gisicons/graticule.png">-->
                <i class="material-icons">grid_on</i>
            </button>
            <button class="hidden-xs hidden-sm <?php echo $objBotoesHtml["marcador"];?>" title="{{{x79}}}" data-template="../interface/templates/ferramentasSend.html"
                onclick="i3GEO.marcador.inicia(this)" style="float: left;">
                <!--<img style="width:20px;" src="../imagens/gisicons/save1.png">-->
                <i class="material-icons">bookmark_border</i>
            </button>
            <div id="barraDeBotoesEditor" class="olControlEditingToolbar1 noprint"></div>
        </div>
        <!--barra de progresso que e mostrada conforme as camadas sao desenhadas no mapa. Esse elemento deve ter o id="i3GEOprogressoCamadas" -->
        <div id="i3GEOprogressoCamadas" class="progress" style="display: block; position: absolute; top: 0px; height: 5px; width: 0%; margin: auto;">
            <div class="progress-bar progress-bar-striped active" role="progressbar" style="width: 100%"></div>
        </div>
        <!--barra de aguarde id="i3GEObarraAguarde" -->
        <div id="i3GEObarraAguarde" class="progress" style="display: block; position: absolute; top: 0px; height: 5px; width: 0%; margin: auto;">
            <div class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" style="width: 100%"></div>
        </div>
        <!-- mensagem de copyright -->
        <div id="i3GEOcopyright">i3Geo</div>
        <!-- botoes laterais que abrem guias moveis -->
        <div id="i3GEOguiaMovel">
            <!-- configuracao para todos os botoes
			data-idconteudo - id do DIV que contem o conteudo da guia e que sera mostrado ao ser clicado
		-->
            <div class="iconesGuiaMovel ol-control" data-traduzir="true">
                <!-- ferramentas
				data-idLista - id do DIV dentro de idconteudo que sera utilizado para mostrar as "pastas" que abrem o proximo nivel
				data-idLinks - id do DIV dentro de idconteudo que sera utilizado para mostrar a lista de links que abre cada ferramenta
				data-idMigalha - id do DIV que sera utilizado para mostrar o link de retorno ao nivel anterior
			-->
                <div class="<?php echo $objBotoesHtml["analise"];?>" data-idconteudo="guia8obj" data-idLinks="listaFerramentasLinks" data-idMigalha="migalhaFerramentas" data-idLista="listaFerramentas"
                    onclick="i3GEO.guias.ativa('ferramentas',this)">
                    <button title="{{{iconeFerramentas}}}" class="iconeGuiaMovel" style="color: white; box-shadow: none;">
                        <i class="material-icons">business_center</i>
                    </button>
                </div>
                <!-- temas existentes no mapa
				data-idListaDeCamadas - id onde sera incluida a lista de camadas
				data-idListaFundo - id onde sera incluida a lista de camadas de fundo (mapa base)
				data-verificaAbrangencia - se for uma string, faz a verificacao se a camada esta fora da abrangencia atual do mapa,
					inserindo ou nao a string como uma classe CSS. Pode degradar a performance e depende
					do metadata existente na camada. Deixe vazio para nao ativar a operacao.
			-->
                <div class="<?php echo $objBotoesHtml["camadas"];?>" onclick="i3GEO.guias.ativa('temas',this)" data-verificaAbrangencia="" data-idconteudo="guia1obj" data-idListaFundo="listaFundo"
                    data-idListaDeCamadas="listaTemas" >
                    <button title="{{{iconeMapa}}}" class="iconeGuiaMovel" style="color: white; box-shadow: none;">
                        <i class="material-icons"><i class="material-icons">visibility</i></i>
                    </button>
                </div>
                <!-- catalogo de adicao de temas ao mapa
				data-idCatalogo - id do DIV que contem a primeira pagina do catalogo. Esse DIV sera escondido e mostrado conforme o usuario navega pelo catalogo
				data-idMenus - id do DIV que recebera a lista de menus cadastrados no sistema de administracao
				data-idNavegacao - id do DIV que recebera a lista de opcoes apos o usuario clicar em um item do catalogo principal
				data-idMigalha - id do DIV que recebera o link para retorno ao nivel anterior do catalogo

				Variaveis javascript:
				i3GEO.catalogoMenus.IDSMENUS - (array) apenas os menus com idmenu que constem nessa lista serao mostrados. Por default e vazio.
			-->
                <div class="<?php echo $objBotoesHtml["catalogo"];?>" onclick="i3GEO.guias.ativa('adiciona',this)" data-idconteudo="guia2obj" data-idMigalha="catalogoMigalha"
                    data-idNavegacao="catalogoNavegacao" data-idCatalogo="catalogoPrincipal" data-idMenus="catalogoMenus" >
                    <button title="{{{iconeCatalogo}}}" class="iconeGuiaMovel" style="color: white; box-shadow: none;">
                        <i class="material-icons">layers</i>
                    </button>
                </div>
                <!-- legenda -->
                <div class="<?php echo $objBotoesHtml["legenda"];?>" onclick="i3GEO.guias.ativa('legenda',this)" data-idconteudo="guia4obj" data-idLegenda="legendaHtml" >
                    <button title="{{{iconeLegenda}}}" class="iconeGuiaMovel" style="color: white; box-shadow: none;">
                        <i class="material-icons">view_list</i>
                    </button>
                </div>
                <!-- Busca -->
                <div class="<?php echo $objBotoesHtml["procura"];?>" onclick="i3GEO.guias.ativa('buscaRapida',this)" data-idconteudo="guia7obj" >
                    <button class="iconeGuiaMovel" style="color: white; box-shadow: none;">
                        <i class="material-icons">search</i>
                    </button>
                </div>
                <div class="<?php echo $objBotoesHtml["identifica"];?>" onclick="i3GEO.guias.ativa('identificaBalao',this)" >
                    <button title="{{{iconeBalao}}}" class="iconeGuiaMovel" style="color: white; box-shadow: none;">
                        <i class="material-icons">location_on</i>
                    </button>
                </div>
            <!-- A opcao de identificacao esta integrada ao balao de informacoes, mas pode aparecer aqui tambem
            <div class="hidden-xs hidden-sm" onclick="i3GEO.guias.ativa('identifica',this)" style="margin-top: 3px;">
                <button title="{{{iconeIdentifica}}}" class="iconeGuiaMovel" style="box-shadow: none;">
                    <img src="../imagens/gisicons/pointer-info.png" style="cursor: pointer; padding: 3px;">
                </button>
            </div>
            -->
        </div>
        <!-- veja i3GEO.guias.CONFIGURA -->
        <!-- Os IDs sao definidos no botao que ativa a guia veja: "i3GEOguiaMovel" -->
        <!-- se height nao estiver definido sera utilizada a altura do mapa -->
        <div id="i3GEOguiaMovelMolde">
            <div id="i3GEOguiaMovelConteudo">
                <!-- camadas existentes no mapa -->
                <div id='guia1obj' data-traduzir="true" style='display: none;'>
                    <div class="i3GEOfechaGuia" onclick="i3GEO.guias.abreFecha('fecha');">
                        <button>
                            <span class="pull-left">{{{iconeMapa}}}</span>
                            <span class="pull-right material-icons">cancel</span>
                        </button>
                    </div>
                    <div class="separadorCabecalhoGuias">&nbsp;</div>
                    <div class="guiaOverflow">
                        <div class="list-group condensed noprint">
                            <label>{{{opcoes}}}</label>
                            <a data-target="#opcoesGuia1" class="btn btn-sm btn-primary pull-right" style="margin-top: 0px; padding-top: 0px; padding-bottom: 0px;" type="button" data-toggle="collapse">
                                <span class="caret"></span>
                            </a>
                            <div class="text-left collapse" id="opcoesGuia1" style="margin-left: 30px;">
                                <p>
                                    <a onclick="i3GEO.arvoreDeCamadas.atualiza(i3GEO.arvoreDeCamadas.CAMADAS,true)" href="javascript:void(0)">Refresh</a>
                                </p>
                                <p>
                                    <a onclick="i3GEO.arvoreDeCamadas.aplicaTemas('ligartodos')" href="javascript:void(0)">{{{t3a}}}</a>
                                </p>
                                <p>
                                    <a onclick="i3GEO.arvoreDeCamadas.aplicaTemas('desligartodos')" href="javascript:void(0)">{{{t3b}}}</a>
                                </p>
                                <p>
                                    <a onclick="i3GEO.arvoreDeCamadas.dialogo.excluir()" href="javascript:void(0)">{{{t12}}}</a>
                                </p>
                                <p>
                                    <a onclick="i3GEO.arvoreDeCamadas.dialogo.filtro()" href="javascript:void(0)">{{{t2a}}}</a>
                                </p>
                                <p>
                                    <a onclick="i3GEO.mapa.dialogo.opacidade()" href="javascript:void(0)">{{{t20}}}</a>
                                </p>
                                <p>
                                    <a onclick="i3GEO.mapa.dialogo.animacao()" href="javascript:void(0)">{{{p21}}}</a>
                                </p>
                                <p>
                                    <a onclick="i3GEO.mapa.dialogo.imprimir()" href="javascript:void(0)">{{{d12}}}</a>
                                </p>
                                <p>
                                    <a onclick="i3GEO.mapa.limpasel()" href="javascript:void(0)">{{{t4}}}</a>
                                </p>
                            </div>
                        </div>
                        <hr>
                        <!-- Esta div acrescenta a lista de de camadas dispon&iacute;veis no mapa atual -->
                        <div id="listaTemas" style="overflow: none;" data-template="../interface/templates/camada.html"></div>
                        <!-- Esta div acrescenta a lista de de camadas de fundo
                    A lista de camadas de fundo e obtida da variavel i3GEO.Interface.openlayers.LAYERSADICIONAIS
                    Essa variavel e definida via javascript, e no caso das interfaces padrao do i3Geo, e definida
                    no programa interface/config.php
                    -->
                        <div class="list-group condensed">
                            <label>{{{camadasDeFundo}}}</label>
                            <a data-target="#collapseFundo" class="btn btn-sm btn-primary pull-right" style="margin-top: 0px; padding-top: 0px; padding-bottom: 0px;" type="button"
                                data-toggle="collapse">
                                <span class="caret"></span>
                            </a>
                            <div style="margin-left: 0px;" class="collapse text-left" id="collapseFundo">
                                <form>
                                    <div id="listaFundo" class="form-group" data-template="../interface/templates/camadaFundo.html"></div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Catalogo de temas -->
                <div id='guia2obj' data-traduzir="true" style='display: none; text-align: left;'>
                    <div class="i3GEOfechaGuia" onclick="i3GEO.guias.abreFecha('fecha');i3GEO.catalogoMenus.mostraCatalogoPrincipal();">
                        <button>
                            <span class="pull-left">{{{iconeCatalogo}}}</span>
                            <span class="pull-right material-icons">cancel</span>
                        </button>
                    </div>
                    <div class="separadorCabecalhoGuias">&nbsp;</div>
                    <div class="guiaOverflow">
                        <!-- aqui entra a lista de elementos quando uma das opcoes e clicada -->
                        <div id="catalogoMigalha" data-template="../interface/templates/catalogoMigalha.html"></div>
                        <div id="catalogoNavegacao"></div>
                        <!-- Opcoes -->
                        <div id="catalogoPrincipal">
                            <div class="list-group condensed noprint">
                                <label>{{{opcoes}}}</label>
                                <a data-target="#opcoesGuia2" class="btn btn-sm btn-primary pull-right" style="margin-top: 0px; padding-top: 0px; padding-bottom: 0px;" type="button"
                                    data-toggle="collapse">
                                    <span class="caret"></span>
                                </a>
                                <div class="text-left collapse" id="opcoesGuia2" style="margin-left: 30px;">
                                    <p>
                                        <a href="javascript:void(0)" onclick="i3GEO.login.dialogo.abreLogin()">Login/Logout</a>
                                    </p>
                                    <p>
                                        <!-- <a href="javascript:void(0)" onclick="i3GEO.arvoreDeTemas.atualiza()">Refresh</a> -->
                                    </p>
                                    <li class="divider"></p>
                                        <p>
                                            <a href="javascript:void(0)" onclick="i3GEO.arvoreDeTemas.dialogo.conectaservico()">{{{a15}}}</a>
                                        </p>
                                        <p>
                                            <a href="javascript:void(0)" onclick="i3GEO.arvoreDeTemas.dialogo.uploadarquivo()">{{{a14}}}</a>
                                        </p>
                                        <p>
                                            <a href="javascript:void(0)" onclick="i3GEO.arvoreDeTemas.dialogo.downloadbase()">{{{a3}}}</a>
                                        </p>
                                        <p>
                                            <a href="javascript:void(0)" onclick="i3GEO.arvoreDeTemas.dialogo.importarwmc()">{{{a3a}}}</a>
                                        </p>
                                        <p>
                                            <!-- <a href="javascript:void(0)" onclick="i3GEO.arvoreDeTemas.dialogo.nuvemTags()">{{{a5a}}}</a> -->
                                        </p>
                                        <p>
                                            <!-- <a href="javascript:void(0)" onclick="i3GEO.arvoreDeTemas.dialogo.carouselTemas()">Miniaturas</a> -->
                                        </p>
                                        <p>
                                            <a href="javascript:void(0)" onclick="i3GEO.arvoreDeTemas.dialogo.buscaInde()">Busca na INDE</a>
                                        </p>
                                        <p>
                                            <a href="javascript:void(0)" onclick="i3GEO.mapa.dialogo.metaestat()">Cartogramas estatisticos</a>
                                        </p>
                                        <p>
                                            <a href="http://localhost/i3geo/kml.php?tipoxml=kml" target="_blank">{{{a13}}}</a>
                                        </p>
                                </div>
                            </div>
                            <hr>
                            <!-- busca tema no catalogo
                        <div class="form-group label-floating">
                            <label class="control-label" for="i3GEObuscatema">{{{a1}}}</label>
                            <div class="input-group">
                                <input id="i3GEObuscatema" class="form-control" type="text" value="">
                                <span class="input-group-btn">
                                    <a onclick="i3GEO.arvoreDeTemas.buscaTema2($i('i3GEObuscatema').value);return false;" role="button" type="button" class="btn btn-warning btn-fab btn-fab-max" href="javascript:void(0)">
                                        <span class="material-icons ">send</span>
                                    </a>
                                </span>
                            </div>
                        </div>
                         -->
                            <!-- A lista de menus e uma funcao de i3GEO.guias.CONFIGURA.adiciona
                            Nessa funcao ficam tambem os parametros:
                            "idOndeMenus": "catalogoMenus",
                            "idCatalogoPrincipal": "catalogoPrincipal",
                            "idCatalogoNavegacao": "catalogoNavegacao",
                            "idOndeMigalha": "catalogoMigalha"
                        -->
                            <div id="catalogoMenus" data-templateDir="../interface/templates/dir.html" data-templateTema="../interface/templates/tema.html"></div>

                            <div id="arvoreAdicionaTema"></div>

                            <!--
                        As funcoes de inicializacao recebem um objeto com parametros. Que por padrao sao:
                        config: {
                            'templateDir': 'templates/dir.html',
                            'templateTema': 'templates/tema.html',
                            'idCatalogoPrincipal': 'catalogoPrincipal',
                            'idCatalogoNavegacao': 'catalogoNavegacao',
                            'idOndeMigalha': 'catalogoMigalha'
                        }

                        exemplo:

                        onclick="i3GEO.catalogoInde.inicia({'templateDir': 'templates/dir.html','templateTema': 'templates/tema.html','idCatalogoPrincipal':'catalogoPrincipal','idCatalogoNavegacao':'catalogoNavegacao','idOndeMigalha':'catalogoMigalha'})"
                        -->

                            <!-- servicos da INDE brasileira -->
                            <div class="list-group condensed">
                                <div class="row-content text-left">
                                    <a onclick="i3GEO.catalogoInde.inicia()" role="button" class="btn btn-primary btn-fab btn-fab-max" href="javascript:void(0)">
                                        <span class="material-icons ">folder_open</span>
                                    </a>
                                    <label style="width: 255px; vertical-align: middle;">
                                        <a onclick="i3GEO.catalogoInde.inicia()" role="button" href="javascript:void(0)">
                                            <h4>INDE-Br</h4>
                                        </a>
                                        <h6>Infraestrutura Nacional de Dados Espaciais do Brasil</h6>
                                    </label>
                                </div>
                            </div>
                            <hr>
                            <!-- lista de wms cadastrados no sistema de administracao -->
                            <div class="list-group condensed">
                                <div class="row-content text-left">
                                    <a onclick="i3GEO.catalogoOgc.inicia();return false;" role="button" class="btn btn-primary btn-fab btn-fab-max" href="javascript:void(0)">
                                        <span class="material-icons ">folder_open</span>
                                    </a>
                                    <label style="width: 255px; vertical-align: middle;">
                                        <a onclick="i3GEO.catalogoOgc.inicia()" role="button" href="javascript:void(0)">
                                            <h4>OGC-WMS</h4>
                                        </a>
                                        <h6>{{{descOgcWms}}}</h6>
                                    </label>
                                </div>
                            </div>
                            <hr>
                            <!--  regioes cadastradas no sistema de metadados -->
                            <div class="list-group condensed">
                                <div class="row-content text-left">
                                    <a onclick="i3GEO.catalogoRegioes.inicia()" role="button" class="btn btn-primary btn-fab btn-fab-max" href="javascript:void(0)">
                                        <span class="material-icons ">folder_open</span>
                                    </a>
                                    <label style="width: 255px; vertical-align: middle;">
                                        <a onclick="i3GEO.catalogoRegioes.inicia()" role="button" href="javascript:void(0)">
                                            <h4>{{{x87}}}</h4>
                                        </a>
                                        <h6>{{{descLimLoc}}}</h6>
                                    </label>
                                </div>
                            </div>
                            <hr>
                            <!--  camadas que vem do sistema de metadados estatisticos -->
                            <div class="list-group condensed">
                                <div class="row-content text-left">
                                    <a onclick="i3GEO.catalogoMetaestat.inicia()" role="button" class="btn btn-primary btn-fab btn-fab-max" href="javascript:void(0)">
                                        <span class="material-icons ">folder_open</span>
                                    </a>
                                    <label style="width: 255px; vertical-align: middle;">
                                        <a onclick="i3GEO.catalogoMetaestat.inicia()" role="button" href="javascript:void(0)">
                                            <h4>{{{x57}}}</h4>
                                        </a>
                                        <h6>{{{descMeta}}}</h6>
                                    </label>
                                </div>
                            </div>
                            <hr>
                            <!--  mapas cadastrados no sistema de administracao (nao funcional)
                        <div class="list-group condensed"><div class="row-content text-left">
                            <a onclick="i3GEO.catalogoMapas.inicia({'seletorTemplateDir': '#guia2objTemplateDir','seletorTemplateTema': '#guia2objTemplateTema','idCatalogoPrincipal':'catalogoPrincipal','idCatalogoNavegacao':'catalogoNavegacao','idOndeMigalha':'catalogoMigalha'})" role="button" class="btn btn-primary btn-fab btn-fab-max" href="javascript:void(0)"><span class="material-icons ">folder_open</span></a>
                            <label style="width: 255px;vertical-align: middle;">
                                <a onclick="i3GEO.catalogoMapas.inicia({'seletorTemplateDir': '#guia2objTemplateDir','seletorTemplateTema': '#guia2objTemplateTema','idCatalogoPrincipal':'catalogoPrincipal','idCatalogoNavegacao':'catalogoNavegacao','idOndeMigalha':'catalogoMigalha'})" role="button" href="javascript:void(0)">
                                <h4>{{{x90}}}</h4></a>
                                <h6>{{{descMapas}}}</h6>
                            </label>
                        </div></div><hr>
                        -->
                            <!--  camadas por estrelas -->
                            <div class="list-group condensed">
                                <div class="row-content text-left">
                                    <a onclick="i3GEO.catalogoEstrelas.inicia({'valorEstrela':5,'numEstrelas':1})" role="button" class="btn btn-primary btn-fab btn-fab-max" href="javascript:void(0)">
                                        <span class="material-icons ">folder_open</span>
                                    </a>
                                    <label style="width: 255px; vertical-align: middle;">
                                        <a onclick="i3GEO.catalogoEstrelas.inicia({'valorEstrela':5,'numEstrelas':1})" role="button" href="javascript:void(0)">
                                            <h4>{{{t46}}}</h4>
                                        </a>
                                        <h6>{{{descEstrelas}}}</h6>
                                    </label>
                                </div>
                            </div>
                            <hr>
                            <!--  sistemas que adicionam camadas -->
                            <div class="list-group condensed">
                                <div class="row-content text-left">
                                    <a onclick="i3GEO.catalogoSistemas.inicia()" role="button" class="btn btn-primary btn-fab btn-fab-max" href="javascript:void(0)">
                                        <span class="material-icons ">folder_open</span>
                                    </a>
                                    <label style="width: 255px; vertical-align: middle;">
                                        <a onclick="i3GEO.catalogoSistemas.inicia()" role="button" href="javascript:void(0)">
                                            <h4>{{{a11}}}</h4>
                                        </a>
                                        <h6>{{{descSistemas}}}</h6>
                                    </label>
                                </div>
                            </div>
                            <hr>
                            <!--  navegacao em diretorios -->
                            <div class="list-group condensed">
                                <div class="row-content text-left">
                                    <a onclick="i3GEO.catalogoDir.inicia()" role="button" class="btn btn-primary btn-fab btn-fab-max" href="javascript:void(0)">
                                        <span class="material-icons ">folder_open</span>
                                    </a>
                                    <label style="width: 255px; vertical-align: middle;">
                                        <a onclick="i3GEO.catalogoDir.inicia()" role="button" href="javascript:void(0)">
                                            <h4>{{{a6}}}</h4>
                                        </a>
                                        <h6>{{{descDir}}}</h6>
                                    </label>
                                </div>
                            </div>
                            <hr>
                        </div>
                    </div>
                </div>
                <!-- Legenda -->
                <div data-traduzir="true" id='guia4obj' style='display: none; text-align: left'>
                    <div class="i3GEOfechaGuia" onclick="i3GEO.legenda.off('legendaHtml');i3GEO.guias.abreFecha('fecha');">
                        <button>
                            <span class="pull-left">{{{iconeLegenda}}}</span>
                            <span class="pull-right material-icons">cancel</span>
                        </button>
                    </div>
                    <div class="separadorCabecalhoGuias">&nbsp;</div>
                    <div class="guiaOverflow">
                        <a href='javascript:void(0)' onclick="i3GEO.legenda.inicia({'janela':true})">{{{x11}}}</a>
                        <div id="legendaHtml" data-template="../interface/templates/legenda.html" data-size="35,25" style='display: none; text-align: left'></div>
                    </div>
                </div>
                <!-- busca
                Funcoes de busca por registros. Pode ser feita nos temas existentes no mapa, em um servico de busca e no google
                No botao que dispara a busca, ficam os parametros de configuracao
                Esses parametros indicam qual o checkbox que define o tipo de busca, o local onde os dados serao mostrados e o template para formatar o resultado
                -->
                <div data-traduzir="true" id='guia7obj' style='display: none; text-align: left'>
                    <div class="i3GEOfechaGuia" onclick="i3GEO.guias.abreFecha('fecha');">
                        <button>
                            <span class="pull-left">{{{t23}}}</span>
                            <span class="pull-right material-icons">cancel</span>
                        </button>
                    </div>
                    <div class="separadorCabecalhoGuias">&nbsp;</div>
                    <div class="guiaOverflow">
                        <form onSubmit="return false;">
                            <div class="form-group label-floating">
                                <label class="control-label" for="valorBuscaRapida">{{{x36}}}</label>
                                <div class="input-group">
                                    <input class="form-control" type="text" value="" name="valorBuscaRapida">
                                    <span class="input-group-btn">
                                        <a onclick="i3GEO.busca.inicia(this);return false;" data-templateGoogle="../interface/templates/buscaEmTemas.html" data-inputGoogle="[name=google]"
                                            data-ondeGoogle=".i3GEOresultadoBuscaGoogle" data-templateTemasMapa="../interface/templates/buscaEmTemas.html" data-inputTemasMapa="[name=temasMapa]"
                                            data-ondeTemasMapa=".i3GEOresultadoBuscaTemasMapa" data-templateServico="../interface/templates/buscaEmServico.html" data-ondeConteiner="#guia7obj"
                                            data-inputOndePalavra="[name=valorBuscaRapida]" data-inputServicosExternos="[name=servicosExternos]"
                                            data-ondeServicosExternos=".i3GEOresultadoBuscaServicos" role="button" type="button" class="btn btn-warning btn-fab btn-fab-max" href="javascript:void(0)">
                                            <span class="material-icons ">send</span>
                                        </a>
                                    </span>
                                </div>
                            </div>
                            <h4>{{{x37}}}:</h4>
                            <div class="form-inline" style="width: 100%;">
                                <div class="list-group condensed">
                                    <div class="checkbox text-left">
                                        <label>
                                            <input checked class="noprint" value="on" type="checkbox" value="" name="servicosExternos">
                                            {{{x38}}}
                                        </label>
                                    </div>
                                </div>
                                <div class="list-group condensed">
                                    <div class="checkbox text-left">
                                        <label>
                                            <input class="noprint" value="on" type="checkbox" name="temasMapa">
                                            {{{x39}}}
                                        </label>
                                    </div>
                                </div>
                                <!-- Apenas para a interface google maps
                            <div class="list-group condensed">
                                <div class="checkbox text-left">
                                <label>
                                    <input class="noprint" value="on" type="checkbox" name="google">
                                    <span class="checkbox-material noprint"><span class="check"></span></span> Google
                                </label>
                                </div>
                            </div>
                             -->
                            </div>
                        </form>
                        <hr>
                        <div class="i3GEOresultadoBuscaServicos"></div>
                        <div class="i3GEOresultadoBuscaTemasMapa"></div>
                        <div class="i3GEOresultadoBuscaGoogle"></div>
                        <div class="alert alert-info" role="alert">{{{x40}}}</div>
                    </div>
                </div>
                <!-- Ferramentas -->
                <div data-traduzir="true" id='guia8obj' style='display: none; text-align: left'>
                    <div class="i3GEOfechaGuia" onclick="i3GEO.guias.abreFecha('fecha');">
                        <button>
                            <span class="pull-left">{{{iconeFerramentas}}}</span>
                            <span class="pull-right material-icons">cancel</span>
                        </button>
                    </div>
                    <div class="separadorCabecalhoGuias">&nbsp;</div>
                    <div class="guiaOverflow">
                        <div class="form-inline" style="width: 100%;">
                            <div class="text-center form-group" style="margin: 4px;">
                                <a onclick="i3GEO.guias.abreFecha('fecha');i3GEO.analise.dialogo.area();" role="button" class="btn btn-success btn-fab btn-fab-max" href="javascript:void(0)">
                                    <img style="margin-top: 4px;" src="../imagens/gisicons/area-measure.png">
                                </a>
                                <h6>{{{d21at}}}</h6>
                            </div>
                            <div class="text-center form-group" style="margin: 4px;">
                                <a onclick="i3GEO.guias.abreFecha('fecha');i3GEO.analise.dialogo.distancia();" role="button" class="btn btn-success btn-fab btn-fab-max" href="javascript:void(0)">
                                    <img style="margin-top: 4px;" src="../imagens/gisicons/length-measure.png">
                                </a>
                                <h6>{{{d21t}}}</h6>
                            </div>
                            <div class="text-center form-group" style="margin: 4px;">
                                <a onclick="i3GEO.guias.abreFecha('fecha');i3GEO.mapa.dialogo.selecao();" role="button" class="btn btn-success btn-fab btn-fab-max" href="javascript:void(0)">
                                    <img style="margin-top: 4px;" src="../imagens/gisicons/select.png">
                                </a>
                                <h6>{{{d24t}}}</h6>
                            </div>
                            <div class="text-center form-group" style="margin: 4px;">
                                <a onclick="i3GEO.guias.abreFecha('fecha');i3GEO.mapa.dialogo.geolocal();" role="button" class="btn btn-success btn-fab btn-fab-max" href="javascript:void(0)">
                                    <img style="margin-top: 4px;" src="../imagens/gisicons/layer-gps.png">
                                </a>
                                <h6>{{{localiza}}}</h6>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                        <hr>
                        <div id="migalhaFerramentas" data-template="../interface/templates/ferramentasMigalha.html" style='display: block; text-align: left;'></div>
                        <div id="listaFerramentasLinks" data-template="../interface/templates/ferramentasLink.html" style='display: block; text-align: left'></div>
                        <div id="listaFerramentas" data-template="../interface/templates/ferramentasFolder.html" style='display: block; text-align: left'></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
	//desativa os layers de fundo
	$.each(i3GEO.Interface.openlayers.LAYERSADICIONAIS, function( index, value ) {
		i3GEO.Interface.openlayers.LAYERSADICIONAIS[index].setVisible(false);
		//ativa o layer de fundo
		if(i3GEO.Interface.openlayers.LAYERSADICIONAIS[index].get("name") == "<?php echo str_replace("e_","",$parurl["fundo"]);?>"){
			i3GEO.Interface.openlayers.LAYERSADICIONAIS[index].setVisible(true);
		}
	});

	function adicionaBotoesEditor(){
		i3GEO.editorOL.mapa = i3geoOL;
		if (!i3GEO.desenho.layergrafico) {
			i3GEO.desenho.openlayers.criaLayerGrafico();
			i3GEO.editorOL.mapa.addLayers([i3GEO.desenho.layergrafico]);
		}
		if (!i3GEO.editorOL.backup) {
			i3GEO.editorOL.backup = new ol.layer.Vector({
				source : new ol.source.Vector({
					features : new ol.Collection(),
					useSpatialIndex : false,
					name : "Backup"
				}),
				visible: false
			});
			i3GEO.editorOL.backup.setMap(i3geoOL);
			i3GEO.editorOL.backup.getFeatures = function(){
				return i3GEO.editorOL.backup.getSource().getFeatures();
			};
		}
		//i3GEO.editorOL.botoes e definido na criacao do mapa, veja editorButtons
		i3GEO.editorOL.criaBotoes(i3GEO.editor.botoes,"barraDeBotoesEditor");
		i3GEO.editorOL.kml = [<?php echo $kml; ?>];
		i3GEO.editorOL.adicionaKml();
		i3GEO.editorOL.numzoom = <?php echo $numzoomlevels;?>;
		i3GEO.editorOL.marca = '<?php echo $marca;?>';
		i3GEO.editorOL.pontos = [<?php echo $pontos;?>];
		i3GEO.editorOL.adicionaMarcas();
	};
	(function() {
		var parametrosMapa = {
			//arquivo mapfile que servira de base para a criacao do mapa. Por default, sao utilizados os arquivos existentes em i3geo/aplicmap (geral1windows, geral1,...)
			//Essa variavel pode ser definida em ms_configura tambem. Se nao estiver definida em nenhum lugar, o i3Geo tentara descobrir o arquivo adequado a ser utilizado. Voce pode utilizar essa opcao para abrir um mapa com as camadas que voce quiser, mas para evitar redundâncias, prefira o uso de &temasa
			mapfilebase: "",
			//extensao geografica do mapa
			//deve ser definida em coordenadas no formato decimos de grau e na projecao geografica na sequencia xmin ymin xmax ymax
			//exemplo [-77,-26,-30,6]
			mapext: <?php echo $mapext;?>,
			//perfil utilizado para restringir os menus de temas mostrando apenas os que correspondem a determinado perfil
			perfil: "",
			//layers que serao adicionados ao mapa.
			//Cada layer corresponde ao nome do mapfile existente na pasta i3geo/temas sem a extensao '.map'
			layers: {
				//array com a lista dos layers que serao adicionados e ligados (visiveis)
				add: <?php echo "['".implode("','",$temas)."']";?>,
				//array com a lista dos layers que serao adicionados mas nao ligados
				on: <?php echo "['".implode("','",$visiveis)."']";?>,
				//array com os layers desligados
				off: <?php echo "['".implode("','",$off)."']";?>
			},
			//lista de coordenadas x e y que serao adicionadas como pontos no mapa
			points: {
				//array com a lista de coordenadas
				coord: [],
				//titulo da nova camada
				title: "",
			},
			//lista de coordenadas x e y que serao adicionadas como linhas no mapa
			lines: {
				//array de arrays com a lista de coordenadas de cada linha
				//exemplo [[-54,-12,-50,-12],[-50,-1,-50,-2,-50,-3]]
				coord: [[]],
				//titulo da nova camada
				title:""
			},
			//lista de coordenadas x e y que serao adicionadas como poligonos no mapa
			polygons: {
				//array de arrays com a lista de coordenadas de cada poligono. A primeira coordenada deve ser igual a ultima.
				//exemplo [[-50,-1,-48,-2,-50,-3,-50,-1]]
				coord: [[]],
				//titulo da nova camada
				title:""
			},
			//insere elementos no mapa com coordenadas definidas em wkt
			wkt: {
				//string no formato wkt
				coord: "",
				//titulo da nova camada
				title: ""
			},
			//simbolo que sera utilizado para desenhar os elementos inseridos
			symbol: {
				//codigo do simbolo conforme definido em i3geo/symbols
				name: "",
				//em rgb, exemplo "0 255 0"
				color: "",
				//em pixels
				size: ""
			},
			//arquivo KML que sera incluido no mapa. Valido apenas na interface google maps
			kml: {
				url: ""
			},
			//endereco de um WMS (sera incluido como uma camada no mapa)
			wms: {
				url: "",
				layer: "",
				style: "",
				title: "",
				srs: "",
				imagetype: "",
				version: ""
			},
			//filtros que serao aplicados aos layers. Utilize a expressaso conforme definido na documentacao
			//do mapserver, exemplo
			//{layer: "_lbiomashp",expression: "(('[CD_LEGENDA]'='CAATINGA'))"} ou {layer: "_lbiomashp",expression: "cd_legenda='CAATINGA'"}
			filters: <?php echo $filtros;?>,
			//id de um mapa salvo e que sera recuperado
			restoreMapId : <?php echo $restauramapa;?>,
            cacheOff : '<?php echo $DESLIGACACHE;?>'
		};
		var config = {
			//id do elemento HTML onde o corpo do mapa sera renderizado
			mapBody : "mapai3Geo",
			//tipo de mapa. Pode ser:
			//OL - utiliza o OpenLayers e coordenadas geograficas
			//OSM - utiliza o OpenLayers e o OpenStreetMap como fundo, em projecao semelhante ao GoogleMaps
			//GM - utiliza o GoogleMaps como motor de controle do mapa
			mapType : "OL",
			//armazena em um cookie a ultima extensao geografica do mapa e utiliza essa extensao quando o mapa for aberto
			saveExtension : false,
			//aplica um filtro de cores apos a renderizacao da imagem de cada camada que compoe o mapa cinza|sepiaclara|sepianormal
			posRenderType : "",
			//Endereco do servidor i3Geo. Utilizado para gerar as requisicoes AJAX
			//Por default e definido como: i3GEO.util.protocolo() + "://" + window.location.host + "/i3geo"
			i3GeoServer : "",
			//opacidade default para camadas que nao sejam do tipo linha ou ponto
			//a opacidade sera aplicada ao objeto HTML e nao ao LAYER original
			//se for vazio, sera utilizado o valor definido no LAYER original
			//Nao se aplica na interface googlemaps
			layerOpacity: <?php echo $opacidade; ?>,
			//Funcao que sera executada apos a inicializacao do mapa
			afterStart : function(){
				$('.iconeGuiaMovel').tooltip({
					animation : false,
					trigger : "manual hover",
					placement : "left"
				});
				$('.iconeGuiaMovel').tooltip('show');
				setTimeout(function(){$('.iconeGuiaMovel').tooltip('hide');},5000);

				$('.ol-i3GEOcontrols button').tooltip({
					animation : false,
					trigger : "hover",
					placement : "auto"
				});

				$(".guiaOverflow").css("height",
						i3GEO.parametros.h - 60);
				$(".guiaOverflow").mCustomScrollbar({
					scrollbarPosition : "inside",
					theme : "inset-2-dark"
				});
				i3GEO.eventos.adicionaEventos("RESIZE", $(
						".guiaOverflow").css("height",
						i3GEO.parametros.h - 60));

				//$("#i3GEOguiaMovelConteudo").mCustomScrollbar({scrollbarPosition: "outside",theme:"inset-2-dark"});
				adicionaBotoesEditor();
				$i("openlayers").style.backgroundColor = "rgb(245,245,245)";
			},
			//parametros de configuracao de diferentes componentes do mapa, como o catalogo de temas, balao de info, etc
			components : {
				//define se ao clicar no mapa sera feita a busca de atributos nas camadas existentes no mapa
				info: true,
				//lista com os codigos dos menus que serao considerados na montagem do catalogo de temas
				idsMenus : [],
				//webservice utilizado na opcao de encontrar lugares
				searchService : "http://mapas.mma.gov.br/webservices/geonames.php",
				//webservice wms que faz a apresentacao do lugar encontrado por searchService
				searchWms : "http://mapas.mma.gov.br/webservices/geonameswms.php",
				//posicao do mapa de referencia, em pixels [top,right]
				referenceMapPosition : [4,120],
				//propriedades do balao de informacoes mostrado quando o usuario clica no mapa
				tooltip : {
					//o resultado sera mostrado em uma janela do tipo modal
					modal : false,
					//url que sera utilizada para obter os dados via $.get. Deve estar no mesmo dominio do i3Geo.
					//Ao final da url serao inseridos os parametros &xx=&yy= com valores em decimos de grau
					//use apenas se modal for true
					//exemplo: http://i3geo.saude.gov.br/i3geo/sage_tabelas/odm/odm6.php?
					url: "",
					//template que sera usado para compor o resultado da busca de dados
					//se for vazio, serao utilizadas as outras opcoes
					//se contiver a string {{{url}}} a mesma sera substituida por url
					//exemplo: "<iframe style='width:400px;height:190px;border:0px white solid' src='{{{url}}}'></iframe>"
					templateModal: "",
					//serao mostrados todos os dados ou apenas aqueles definidos na configuracao da camada
					simple: true,
					removeAoAdicionar : true,
					//parametros exclusivos da interface openlayers
					autoPan : true,
					autoPanAnimation : {
						duration : 250
					},
					minWidth : '200px',
					//Altura e largura do tooltip (balao)
					toolTipSize : ["100px","200px"]
				},
				//barra de rolagem - ver plugin jquery https://github.com/malihu/malihu-custom-scrollbar-plugin
				scrollBar: {
					theme: "inset-2",
					axis: "yx",
					scrollbarPosition: "inside",
					scrollButtons:{ enable: true },
					advanced:{ autoExpandHorizontalScroll: true }
				}
			},
			//parametros de configuracao das ferramentas que sao acionadas sob demanda
			//ferramentas localizadas em i3geo/ferramentas
			tools : {
				//ferramenta de busca de camadas em um servico CSW
				buscainde : {
					//endereco do servico no padrao CSW
					csw : "http://www.metadados.inde.gov.br/geonetwork/srv/br"
				},
				//ferramenta de identificacao
				identifica : {
					//resolucao em pixels para busca de elementos
					resolution : 8
				}
			},
			//configuracoes especificas para a interface que utiliza o OpenLayers
			openLayers : {
				//utiliza ou nao tiles ao renderizar as camadas do mapa
				//a utilizacao de tiles pode ser definida em cada camada, mas se essa propriedade for true, a definicao das camadas nao serao consideradas
				singleTile : !<?php echo $tiles; ?>,
				//opcoes de inicializacao do mapa conforme definido na API do OpenLayers
				MapOptions : {
					layers : [],
					controls : [<?php echo implode(",",$objControles); ?>],
					loadTilesWhileAnimating : true,
					loadTilesWhileInteracting : true,
					//os objetos devem ser comentados na interface googleMaps
					interactions : [
						new ol.interaction.DoubleClickZoom(),
						new ol.interaction.KeyboardPan(),
						new ol.interaction.KeyboardZoom(),
						<?php echo $ativarodadomouse;?>
						new ol.interaction.PinchRotate(),
						new ol.interaction.PinchZoom(),
						new ol.interaction.DragZoom(),
						new ol.interaction.DragPan()
					]
				},
				//opcoes para o objeto view, que e uma instancia de MapOptions
				ViewOptions : {
					maxZoom : <?php echo $numzoomlevels;?>,
					extent : <?php echo $maxextent;?>
				},
				//botoes que sao mostrados no editor vetorial
				editorButtons : <?php echo $botoes;?>
			},
			//configuracoes especificas para a interface GoogleMaps
			googleMaps : {
				//opcoes de inicializacao do mapa conforme definido na API do GoogleMaps
				MapOptions : {
					//estilo que sera utilizado no mapa
					//pode ser um desses: roadmap, satellite, hybrid, terrain, Red, Countries, Night, Blue, Greyscale, No roads, Mixed, Chilled
					//ver i3GEO.Interface.googleMaps.ESTILOS
					mapTypeId : "roadmap",
					scaleControl : true,
					mapTypeControl : true,
					mapTypeControlOptions: {
						//position : google.maps.ControlPosition.LEFT_BOTTOM
					},
					zoomControl:true,
					zoomControlOptions: {
						//style : google.maps.ZoomControlStyle.SMALL,
						//position : google.maps.ControlPosition.LEFT_CENTER
					},
					streetViewControl : true,
					streetViewControlOptions: {
						//position : google.maps.ControlPosition.LEFT_CENTER
					}
				}
			}
		};
		//
		//inicia o mapa
		//Veja tambem config.php
		//
		//O primeiro parametro permite alterar o mapa, inserindo camadas e outras definicoes que afetam o corpo do mapa
		//O segundo parametro inclui configuracoes que afetam o funcionamento da interface que controla a visualizacao do mapa
		//
		i3GEO.init(parametrosMapa,config);
	})();
	</script>
</body>

</html>
