<!DOCTYPE html>
<html lang="pt-br">
<head>
<?php
if (! isset($_GET["temas"]) && isset($_GET["layers"])) {
    $_GET["temas"] = $_GET["layers"];
}
if (isset($_GET["BBOX"])) {
    //sanitiza
    $_GET["BBOX"] = str_replace(" ",",",trim(strip_tags($_GET["BBOX"])));
    define('MAPEXT', "'".implode("','",explode(",",$_GET["BBOX"]))."'");
} else {
    define('MAPEXT','');
}
//sanitiza
$_GET["temas"] = str_replace(" ",",",trim(strip_tags($_GET["temas"])));
define('LISTADETEMAS', "'".implode("','",explode(",",$_GET["temas"]))."'");
$configInc = array(
    "debug" => "", //posfixos inserido na carga do script do i3geo
    "tipo" => "OSM", // OL ou OSM
    "inc" => "inc", //caminho para os includes PHP com os componentes da interface
    "pathjs" => "..", //caminho para o include dos arquivos JS
    "pathcss" => "..", //caminho para o include dos arquivos css
    "pathconfig" => ".", //caminho para o include do arquivo JS config.php
    "pathtutorial" => ".", //caminho para o include do arquivo JS tutorial.js
    "pathtemplates" => "templates", //caminho para a pasta template com os arquivos MUSTACHE
    "nocache" => time()
);
include ($configInc["inc"] . "/meta.php");
?>
<title>i3GEO - OpenLayers</title>
<?php
include ($configInc["inc"] . "/js.php");
include ($configInc["inc"] . "/css.php");
?>
<style>
.ol-attribution.ol-uncollapsible {
	height: 2.1em;
	right: 24px;
	background: none;
	margin-bottom: 15px;
}

.foraDoMapa+span>span {
	background-color: yellow;
}
</style>
</head>
<!-- As palavras entre {{{}}} sao utilizadas para a traducao. Veja i3geo/js/dicionario.js
        Marque com data-traduzir="true" os elementos que deverao passar pelo tradutor
    -->
<body id="i3geo" style='background: white;'>
    <!-- inclui o nome do usuario logado
    <div id="i3GEONomeLogin"
        style="position: absolute; left: 10px; top: 2px; font-size: 11px; z-index: 50000"></div>
    -->
    <!-- Aqui vai o mapa. O div a ser inserido e padronizado e depende da interface usar openlayers ou googlemaps
    Se os estilos width e height nao estiverem definidos, o tamanho do mapa abrangera a tela toda
    -->
    <div id="mapai3Geo" style="width: 100vw; height: 100vh"></div>
    <!-- aqui sera incluida a escala numerica. E necessario ter o id=i3GEOescalanum para que o valor seja atualizado-->
    <?php include($configInc["inc"]."/escalanum.php");?>
    <!-- aqui sera incluido o componente que mostra a coordenada geografica da posicao do mouse -->
    <?php include($configInc["inc"]."/coordenadas.php");?>
    <!-- barra de icones de navegacao -->
    <?php include($configInc["inc"]."/barradeicones.php");?>
    <?php include($configInc["inc"]."/barraaguarde.php");?>
    <!-- mensagem de copyright -->
    <div id="i3GEOcopyright">i3Geo</div>
    <!-- botoes laterais que abrem guias moveis -->
    <div id="i3GEOguiaMovel">
        <!-- configuracao para todos os botoes
            data-idconteudo - id do DIV que contem o conteudo da guia e que sera mostrado ao ser clicado
        -->
        <div class="iconesGuiaMovel ol-control" data-traduzir="true">
            <?php
            //include ($configInc["inc"] . "/iconeferramentas.php");
            include ($configInc["inc"] . "/iconecamadas.php");
            //include ($configInc["inc"] . "/iconecatalogo.php");
            include ($configInc["inc"] . "/iconelegenda.php");
            //include ($configInc["inc"] . "/iconebusca.php");
            //include ($configInc["inc"] . "/iconeinfo.php");
            //include ($configInc["inc"] . "/iconetutorial.php");
            ?>
        </div>
        <!-- veja i3GEO.guias.CONFIGURA -->
        <!-- Os IDs sao definidos no botao que ativa a guia veja: "i3GEOguiaMovel" -->
        <!-- se height nao estiver definido sera utilizada a altura do mapa -->
        <div id="i3GEOguiaMovelMolde">
            <div id="i3GEOguiaMovelConteudo">
                <?php
                //include ($configInc["inc"] . "/guiaferramentas.php");
                include ($configInc["inc"] . "/guiacamadas.php");
                //include ($configInc["inc"] . "/guiacatalogo.php");
                include ($configInc["inc"] . "/guialegenda.php");
                //include ($configInc["inc"] . "/guiabusca.php");
                ?>
            </div>
        </div>
    </div>
    <?php
    //include ($configInc["inc"] . "/modallogin.php");
    ?>
    <!--  para mostrar o banner de abertura -->
    <script id="i3GEOlogoMarcaTemplate" type="x-tmpl-mustache">
    <div>
        <table>
            <tr>
                <td>
                    <h4 >i3Geo - Software livre para cria&ccedil;&atilde;o de mapas
                        interativos e geoprocessamento</h4>
                    <h4 >Baseado no Mapserver, &eacute; licenciado sob GPL e integra o
                        Portal do Software P&uacute;blico Brasileiro</h4>
                </td>
            </tr>
        </table>
        <img class="img-thumbnail" src="../imagens/i3Geo_big.png" style="width:50px">
        <img class="img-thumbnail" src="../imagens/mapserv.png" style="width:50px">
        <img class="img-thumbnail" src="../imagens/pspb.png" style="width:50px">
        <div>&nbsp;</div>
    </div>
    </script>
    <script>
            //ativa o banner de inicializacao
            i3GEO.janela.tempoMsg(
                $i("i3GEOlogoMarcaTemplate").innerHTML, 4000);
            (function() {
            //parametros aplicados na criacao do arquivo mapfile
            var parametrosMapa = {
                //arquivo mapfile que servira de base para a criacao do mapa. Por default, sao utilizados os arquivos existentes em i3geo/aplicmap (geral1windows, geral1,...)
                //Essa variavel pode ser definida em ms_configura tambem. Se nao estiver definida em nenhum lugar, o i3Geo tentara descobrir o arquivo adequado a ser utilizado. Voce pode utilizar essa opcao para abrir um mapa com as camadas que voce quiser, mas para evitar redundâncias, prefira o uso de &temasa
                mapfilebase : "",
                //extensao geografica do mapa
                //deve ser definida em coordenadas no formato decimos de grau e na projecao geografica na sequencia xmin ymin xmax ymax
                //exemplo [-77,-26,-30,6]
                mapext : [<?php echo MAPEXT; ?>],
                //perfil utilizado para restringir os menus de temas mostrando apenas os que correspondem a determinado perfil
                perfil : "",
                //layers que serao adicionados ao mapa.
                //Cada layer corresponde ao nome do mapfile existente na pasta i3geo/temas sem a extensao '.map'
                layers : {
                //array com a lista dos layers que serao adicionados e ligados (visiveis)
                add : [<?php echo LISTADETEMAS; ?>],
                //array com a lista dos layers que serao adicionados mas nao ligados. Inclusive IDs do sistema de metadados estatisticos
                on : [<?php echo LISTADETEMAS; ?>],
                //array com os layers desligados
                off : [],
                //array com a lista de IDs que identificam medidas registradas no sistema de metadados
                //estatisticos
                metaestat : []
                },
                //lista de coordenadas x e y que serao adicionadas como pontos no mapa
                points : {
                //array com a lista de coordenadas
                coord : [],
                //titulo da nova camada
                title : ""
                },
                //lista de coordenadas x e y que serao adicionadas como linhas no mapa
                lines : {
                //array de arrays com a lista de coordenadas de cada linha
                //exemplo [[-54,-12,-50,-12],[-50,-1,-50,-2,-50,-3]]
                coord : [ [] ],
                //titulo da nova camada
                title : ""
                },
                //lista de coordenadas x e y que serao adicionadas como poligonos no mapa
                polygons : {
                //array de arrays com a lista de coordenadas de cada poligono. A primeira coordenada deve ser igual a ultima.
                //exemplo [[-50,-1,-48,-2,-50,-3,-50,-1]]
                coord : [ [] ],
                //titulo da nova camada
                title : ""
                },
                //insere elementos no mapa com coordenadas definidas em wkt
                wkt : {
                //string no formato wkt
                coord : "",
                //titulo da nova camada
                title : ""
                },
                //simbolo que sera utilizado para desenhar os elementos inseridos
                symbol : {
                //codigo do simbolo conforme definido em i3geo/symbols
                name : "",
                //em rgb, exemplo "0 255 0"
                color : "",
                //em pixels
                size : ""
                },
                kml : {
                url : ""
                },
                wms : {
                url : "",
                layer : "",
                style : "",
                title : "",
                srs : "",
                imagetype : "",
                version : ""
                },
                filters : [ {
                layer : "",
                expression : ""
                } ],
                restoreMapId : ""
            };
            var config = {
                mapBody : "mapai3Geo",
                mapType : "OSM",
                layerProgressBar: true,
                saveExtension : false,
                posRenderType : "",
                i3GeoServer : i3GeoUrl,
                layerOpacity : "",
                afterStart : function() {
                $('.iconeGuiaMovel').tooltip({
                    animation : false,
                    trigger : "manual hover",
                    placement : "left"
                });
                $('.iconeGuiaMovel').tooltip('show');
                setTimeout(function() {
                    $('.iconeGuiaMovel').tooltip('hide');
                }, 5000);

                $('.ol-i3GEOcontrols button')
                    .tooltip(
                        {
                            animation : false,
                            trigger : "hover",
                            placement : "auto",
                            template : "<div class='tooltip ' ><div class='tooltip-inner'></div></div>"
                        });
                tutorial.init();
                new ol.control.FullScreen({
                    target: $i("i3GEOFullscreen"),
                    className: "ol-FullScreen",
                    tipLabel: $trad("fullscreen"),
                    source: "i3geo"

                }).setMap(i3geoOL);
                new ol.control.Zoom({
                    target: $i("i3GEOzoomInOut")
                }).setMap(i3geoOL);
                },
                //parametros de configuracao de diferentes componentes do mapa, como o catalogo de temas, balao de info, etc
                components : {
                //restringe a inclusao de attribution apenas aos LAYERS adicionados manualmente
                //e nao aos que possuem o link para a fonte definido no mapfile
                restrictAtt : true,
                //define se ao clicar no mapa sera feita a busca de atributos nas camadas existentes no mapa
                info : true,
                //lista com os codigos dos menus que serao considerados na montagem do catalogo de temas
                idsMenus : [],
                //webservice utilizado na opcao de encontrar lugares
                searchService : "http://mapas.mma.gov.br/webservices/geonames.php",
                //webservice wms que faz a apresentacao do lugar encontrado por searchService
                searchWms : "http://mapas.mma.gov.br/webservices/geonameswms.php",
                //posicao do mapa de referencia, em pixels [top,right]
                //quando referenceType for igual a "api", deve-se usar a classe css utilizada
                //na respectiva api
                referenceMapPosition : [ 4, 120 ],
                //tipo do mapa de referencia. Pode ser wms, map ou api
                referenceType : "api",
                //propriedades do balao de informacoes mostrado quando o usuario clica no mapa
                tooltip : {
                    //o resultado sera mostrado em uma janela do tipo modal
                    modal : false,
                    //url que sera utilizada para obter os dados via $.get. Deve estar no mesmo dominio do i3Geo.
                    //Ao final da url serao inseridos os parametros &xx=&yy= com valores em decimos de grau
                    //use apenas se modal for true
                    //exemplo: http://i3geo.saude.gov.br/i3geo/sage_tabelas/odm/odm6.php?
                    url : "",
                    //template que sera usado para compor o resultado da busca de dados
                    //se for vazio, serao utilizadas as outras opcoes
                    //se contiver a string {{{url}}} a mesma sera substituida por url
                    //exemplo: "<iframe style='width:400px;height:190px;border:0px white solid' src='{{{url}}}'></iframe>"
                    templateModal : "",
                    //serao mostrados todos os dados ou apenas aqueles definidos na configuracao da camada
                    simple : true,
                    removeAoAdicionar : true,
                    //parametros exclusivos da interface openlayers
                    autoPan : false,
                    autoPanAnimation : {
                    duration : 250
                    },
                    minWidth : '200px',
                    //Altura e largura do tooltip (balao)
                    toolTipSize : [ "100px", "200px" ],
                    //mostra ou nao o balao caso seja vazio
                    openTipNoData : true
                },
                //barra de rolagem - ver plugin jquery https://github.com/malihu/malihu-custom-scrollbar-plugin
                scrollBar : {
                    theme : "minimal-dark",
                    axis : "yx",
                    scrollbarPosition : "inside",
                    scrollButtons : {
                    enable : true
                    },
                    advanced : {
                    autoExpandHorizontalScroll : true
                    }
                }
                },
                //parametros de configuracao das ferramentas que sao acionadas sob
                //demanda. Veja em js/ini_i3geo.js e js/configura.js
                //Algumas ferramentas localizadas em i3geo/ferramentas
                //permitem que qualquer parametro ou funcao seja sobrescrita
                //Veja o codigo de cada ferramenta para obter os nomes de parametros e funcoes
                //O codigo index.js da ferramenta deve permitir o uso dessas configuracoes (veja o final de cada index.js
                tools : {
                //ferramenta de identificacao
                identifica : {
                    //resolucao em pixels para busca de elementos
                    resolution : 12
                },
                legenda : {
                    //define o local onde os templates da ferramenta ficam armazenados
                    //esse eh o local default, colocado aqui para documentacao
                    templateDir : i3GeoUrl
                        + "/ferramentas/legenda"
                },
                metaestat : {},
                buscainde : {},
                //ferramenta mapa de referencia
                //difere das propriedades do mapa de referencia
                //utilizado pela api openlayers ou googlemaps
                opcoesmaparef : {
                    //opcoes de imagens. As imagens devem existir em i3geo/imagens e serem do tipo png
                    images : [ {
                    name : "Colorida",
                    img : "referencia1"
                    }, {
                    name : "B & W",
                    img : "referencia1cinza"
                    } ]
                },
                //janela de conversao de coordenadas
                wkt2layer : {
                    position : [ 150, 150 ]
                },
                area : {
                    position : [ 150, 10 ]
                },
                distancia : {
                    position : [ 150, 10 ]
                }
                },
                //configuracoes especificas para a interface que utiliza o OpenLayers
                openLayers : {
                //utiliza ou nao tiles ao renderizar as camadas do mapa
                //a utilizacao de tiles pode ser definida em cada camada, mas se essa propriedade for true, a definicao das camadas nao serao consideradas
                singleTile : false,
                //opcoes de inicializacao do mapa conforme definido na API do OpenLayers
                MapOptions : {
                    layers : [],
                    controls : [
                        //new ol.control.Zoom(),
                        //new ol.control.ZoomSlider(),
                        new ol.control.ScaleLine(),
                        new ol.control.Attribution({
                            collapsible : true
                        })
                    ],
                    loadTilesWhileAnimating : true,
                    loadTilesWhileInteracting : true,
                    //os objetos devem ser comentados na interface googleMaps
                    interactions : [
                        new ol.interaction.DoubleClickZoom(),
                        new ol.interaction.KeyboardPan(),
                        new ol.interaction.KeyboardZoom(),
                        new ol.interaction.MouseWheelZoom(),
                        //new ol.interaction.PinchRotate(),
                        new ol.interaction.PinchZoom(),
                        //new ol.interaction.DragZoom(),
                        i3GEO.navega.dragZoom(),
                        new ol.interaction.DragPan() ]
                },
                //opcoes para o objeto view, que e uma instancia de MapOptions
                //ver https://openlayers.org/en/latest/apidoc/ol.View.html
                ViewOptions : {

                }
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
                    mapTypeControlOptions : {
                    //position : google.maps.ControlPosition.LEFT_BOTTOM
                    },
                    zoomControl : true,
                    zoomControlOptions : {
                    //style : google.maps.ZoomControlStyle.SMALL,
                    //position : google.maps.ControlPosition.LEFT_CENTER
                    },
                    streetViewControl : true,
                    streetViewControlOptions : {
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
            //caso queira evitar os efeitos do material design, comente a linha abaixo
            //$.material = false;
            i3GEO.init(parametrosMapa, config);
            })();
        </script>
</body>

</html>
