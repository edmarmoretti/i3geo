<?php
define("I3GEOPATH", explode("restmapserver", __FILE__)[0]);

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

require '../vendor/autoload.php';
$config['displayErrorDetails'] = false;
$config['addContentLengthHeader'] = false;
$app = new \Slim\App([
    'settings' => $config
]);
$container = $app->getContainer();
$container['util'] = function ($c) {
    include (I3GEOPATH . "/restmapserver/classes/util.php");
    return new \restmapserver\Util();
};
$container['mscriamapa'] = function ($c) {
    include (I3GEOPATH . "/restmapserver/classes/mscriamapa.php");
    return new \restmapserver\Mscriamapa();
};
$container['map'] = function ($c) {
    include (I3GEOPATH . "/restmapserver/classes/map.php");
    return new \restmapserver\Map();
};
$container['identify'] = function ($c) {
    include (I3GEOPATH . "/restmapserver/classes/identify.php");
    return new \restmapserver\Identify();
};
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/restmapserver/map/create/",
 * 		tags={"map"},
 * 		operationId="create",
 * 		summary="Create a new map. Example to open the created map: http://localhost/i3geo/interface/openlayersdebug.php?&projection=osm",
 * 		@SWG\Parameter(
 * 			name="projection",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Projection type",
 *          enum={"osm", "geo"}
 * 		),
 * 		@SWG\Parameter(
 * 			name="mapfilebase",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Arquivo mapfile que servirao; de base para a
 *            criacao do mapa. Por default, sao utilizados
 *            os arquivos existentes em i3geo/aplicmap (geral1windows, geral1,...)
 *            Essa variavel pode ser definida em ms_configura tambem.
 *            Se nao estiver definida em nenhum lugar, o i3Geo
 *            tentara descobrir o arquivo adequado a ser utilizado."
 * 		),
 * 		@SWG\Parameter(
 * 			name="restoreMapId",
 * 			in="query",
 * 			required=false,
 * 			type="number",
 * 			description="ID do mapa salvo no banco de dados de administracao."
 * 		),
 * 		@SWG\Parameter(
 * 			name="mapext",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Extensao geografica xmin,ymin,xmax,ymax"
 * 		),
 * 		@SWG\Parameter(
 * 			name="layersadd",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Lista de layers que serao adicionados ao mapa (ver pasta i3geo/temas)."
 * 		),
 * 		@SWG\Parameter(
 * 			name="layerson",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Lista de layers que serao ligados (visiveis)."
 * 		),
 * 		@SWG\Parameter(
 * 			name="layersoff",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Lista de layers que serao desligados."
 * 		),
 * 		@SWG\Parameter(
 * 			name="metaestatids",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Lista de codigos de medidas de variaveis cadastradas no
 *            sistema de metadados estatisticos. Cada medida sera adicionada como
 *            um novo layer no mapa."
 * 		),
 * 		@SWG\Parameter(
 * 			name="wkt",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Coordenadas, no formato WKT que serao adicionadas ao mapa como uma camada nova."
 * 		),
 * 		@SWG\Parameter(
 * 		    name="namewkt",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Titulo da camada WKT quando &wkt for definido."
 * 		),
 * 		@SWG\Parameter(
 * 			name="points",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Coordenadas de pontos que serao adicionadas ao mapa como uma camada nova."
 * 		),
 * 		@SWG\Parameter(
 * 			name="namepoints",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Titulo da camada quando &points for definido."
 * 		),
 * 		@SWG\Parameter(
 * 			name="lines",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Coordenadas das linhas que serao adicionadas ao mapa como uma camada nova. Exemplo: -54 -12 -50 -12,-50 -1 -50 -2 -50 -3"
 * 		),
 * 		@SWG\Parameter(
 * 			name="namelines",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Titulo da camada quando &lines for definido."
 * 		),
 * 		@SWG\Parameter(
 * 			name="polygons",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Coordenadas dos poligonos que serao adicionadas ao mapa como uma camada nova. Exemplo: -54 -12 -50 -12 -50 -10 -54 -12"
 * 		),
 * 		@SWG\Parameter(
 * 			name="namepolygons",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Titulo da camada quando &polygons for definido."
 * 		),
 * 		@SWG\Parameter(
 * 			name="symbol",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Simbolo utilizado para eleemtnso adicionados via coordenadas (wkt por exemplo)."
 * 		),
 * 		@SWG\Parameter(
 * 			name="symbolsize",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Tamanho utilizado no simbolo definido com &symbol."
 * 		),
 * 		@SWG\Parameter(
 * 			name="symbolcolor",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Cor do simbolo (rgb) definido com &symbol."
 * 		),
 * 		@SWG\Parameter(
 * 			name="urlwms",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Url de um servico WMS cujo layer sera adicionado ao mapa."
 * 		),
 * 		@SWG\Parameter(
 * 			name="titlewms",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Titulo da camada com o WMS."
 * 		),
 * 		@SWG\Parameter(
 * 			name="srswms",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="SRS exemplo: EPSG:4326"
 * 		),
 * 		@SWG\Parameter(
 * 			name="layerwms",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Codigo do layer existente no servico WMS."
 * 		),
 * 		@SWG\Parameter(
 * 			name="imagewms",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Lista de tipos de imagens possiveis. Exemplo: image/png,image/jpeg."
 * 		),
 * 		@SWG\Parameter(
 * 			name="stylewms",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Codigo do estilo do LAYER existente no WMS."
 * 		),
 * 		@SWG\Parameter(
 * 			name="versionwms",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Versao do WMS."
 * 		),
 *      @SWG\Parameter(
 * 			name="map_layer_<layername>_filter",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Aplica filtros a um layer utilizando uma expressao Mapfile."
 * 		),
 *      @SWG\Definition(
 * 			title="Id do mapa criado",
 *          definition="mapId",
 *          type="string"
 * 		),
 *      @SWG\Response(
 * 			response="200",
 *          description="mapId - id do mapa criado",
 * 		)
 * 	)
 *
 */

/*
 * param["titlewms"] = "estados";
 * $param["urlwms"] = "http://bdgex.eb.mil.br/mapcache?";
 * $param["srswms"] = "EPSG:4326";
 * $param["layerwms"] = "estados";
 * $param["imagewms"] = "image/png,image/jpeg";
 * $param["stylewms"] = "";
 * $param["versionwms"] = "1.1.1";
 */
$app->map([
    'GET',
    'POST'
], '/create/', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $mapid = $this->mscriamapa->createMap($param);
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
        ->write(json_encode($mapid));
    return $response;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/restmapserver/map/{mapId}/getParameters/",
 * 		tags={"map"},
 * 		operationId="getParameters",
 * 		summary="Get the parameters of the map that was created",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 *      @SWG\Response(
 * 			response="200",
 *          description="parameters",
 * 		)
 * )
 */
$app->map([
    'GET',
    'POST'
], '/{mapId}/getParameters', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $data = $this->map->getParameters($args["mapId"], @$param["w"], @$param["h"]);
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
        ->write(json_encode($data));
    return $response;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/restmapserver/map/{mapId}/layersDelete/",
 * 		tags={"map update"},
 * 		operationId="layersDelete",
 * 		summary="Delete layers from a map",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="layernames",
 * 			in="query",
 * 			required=true,
 * 			type="string",
 * 			description="List of layer names"
 * 		),
 *      @SWG\Response(
 * 			response="200",
 *          description="Result status",
 * 		)
 * )
 */
$app->map([
    'GET',
    'POST'
], '/{mapId}/layersDelete', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $data = $this->map->layersDelete($args["mapId"], $param["layernames"], true, false);
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
        ->write(json_encode($data));
    return $response;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/restmapserver/map/{mapId}/reorderLayers/",
 * 		tags={"map update"},
 * 		operationId="reorderLayers",
 * 		summary="Reorder the layers in a map",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="layernames",
 * 			in="query",
 * 			required=true,
 * 			type="string",
 * 			description="List of layer names in the desidered order"
 * 		),
 *      @SWG\Response(
 * 			response="200",
 *          description="Result status",
 * 		)
 * )
 */
$app->map([
    'GET',
    'POST'
], '/{mapId}/reorderLayers', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $data = $this->map->reorderLayers($args["mapId"], $param["layernames"], true, false);
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
        ->write(json_encode($data));
    return $response;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/restmapserver/map/{mapId}/getLegendParameters/",
 * 		tags={"map","legend"},
 * 		operationId="getLegendParameters",
 * 		summary="Get legend parameters",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="w",
 * 			in="query",
 * 			required=true,
 * 			type="integer",
 * 			description="Icon width"
 * 		),
 * 		@SWG\Parameter(
 * 			name="h",
 * 			in="query",
 * 			required=true,
 * 			type="integer",
 * 			description="Icon heigth"
 * 		),
 *      @SWG\Response(
 * 			response="200",
 *          description="Result status",
 * 		)
 * )
 */
$app->map([
    'GET',
    'POST'
], '/{mapId}/getLegendParameters', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $data = $this->map->getLegendParameters($args["mapId"], $param["w"], $param["h"], false);
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
        ->write(json_encode($data));
    return $response;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/restmapserver/map/{mapId}/setSize/",
 * 		tags={"map update"},
 * 		operationId="setSize",
 * 		summary="Update map size",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="h",
 * 			in="query",
 * 			required=true,
 * 			type="integer",
 * 			description="Height"
 * 		),
 * 		@SWG\Parameter(
 * 			name="w",
 * 			in="query",
 * 			required=true,
 * 			type="integer",
 * 			description="Width"
 * 		),
 *      @SWG\Response(
 * 			response="200",
 *          description="Result status",
 * 		)
 * )
 */
$app->map([
    'GET',
    'POST'
], '/{mapId}/setSize', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $data = $this->map->setSize($args["mapId"], $param["w"], $param["h"]);
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
        ->write(json_encode($data));
    return $response;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/restmapserver/map/{mapId}/centerPoint/",
 * 		tags={"map navigation"},
 * 		operationId="centerPoint",
 * 		summary="Change map center",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="x",
 * 			in="query",
 * 			required=true,
 * 			type="number",
 * 			description="Longitude"
 * 		),
 * 		@SWG\Parameter(
 * 			name="y",
 * 			in="query",
 * 			required=true,
 * 			type="number",
 * 			description="Latitude"
 * 		),
 *      @SWG\Response(
 * 			response="200",
 *          description="Result status",
 * 		)
 * )
 */
$app->map([
    'GET',
    'POST'
], '/{mapId}/centerPoint', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $data = $this->map->centerPoint($args["mapId"], $param["x"], $param["y"]);
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
        ->write(json_encode($data));
    return $response;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/restmapserver/map/{mapId}/addPointFeature/",
 * 		tags={"map feature"},
 * 		operationId="addPointFeature",
 * 		summary="Add point",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="x",
 * 			in="query",
 * 			required=true,
 * 			type="number",
 * 			description="Longitude"
 * 		),
 * 		@SWG\Parameter(
 * 			name="y",
 * 			in="query",
 * 			required=true,
 * 			type="number",
 * 			description="Latitude"
 * 		),
 * 		@SWG\Parameter(
 * 			name="symbol",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Symbol name"
 * 		),
 * 		@SWG\Parameter(
 * 			name="size",
 * 			in="query",
 * 			required=false,
 * 			type="integer",
 * 			description="Symbol size"
 * 		),
 * 		@SWG\Parameter(
 * 			name="color",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="R,G,B color"
 * 		),
 * 		@SWG\Parameter(
 * 			name="offsetx",
 * 			in="query",
 * 			required=false,
 * 			type="number",
 * 			description="X symbol offset position"
 * 		),
 * 		@SWG\Parameter(
 * 			name="offsety",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Y symbol offset position"
 * 		),
 * 		@SWG\Parameter(
 * 			name="layerTitle",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="New layer title"
 * 		),
 *      @SWG\Response(
 * 			response="200",
 *          description="Result status",
 * 		)
 * )
 */
$app->map([
    'GET',
    'POST'
], '/{mapId}/createLayerPointFeature', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $data = $this->map->createLayerPointFeature($args["mapId"],$param["symbol"], $param["x"], $param["y"], $param["offsetx"], $param["offsety"], $param["color"], $param["size"], $param["layerTitle"]);
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
        ->write(json_encode($data));
    return $response;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/restmapserver/map/{mapId}/extentToLayer/",
 * 		tags={"map navigation"},
 * 		operationId="extentToLayer",
 * 		summary="Change map extent to layer extent",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="layerName",
 * 			in="query",
 * 			required=true,
 * 			type="string",
 * 			description="Layer name"
 * 		),
 *      @SWG\Response(
 * 			response="200",
 *          description="Result status",
 * 		)
 * )
 */
$app->map([
    'GET',
    'POST'
], '/{mapId}/extentToLayer', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $data = $this->map->extentToLayer($args["mapId"],$param["layerName"]);
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
    ->write(json_encode($data));
    return $response;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/restmapserver/map/{mapId}/clearSel/",
 * 		tags={"map update"},
 * 		operationId="clearSel",
 * 		summary="Clear all layers selections",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 *      @SWG\Response(
 * 			response="200",
 *          description="Result status",
 * 		)
 * )
 */
$app->map([
    'GET',
    'POST'
], '/{mapId}/clearSel', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $data = $this->map->clearSel($args["mapId"]);
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
    ->write(json_encode($data));
    return $response;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/restmapserver/map/{mapId}/addLayerWms/",
 * 		tags={"map update"},
 * 		operationId="addLayerWms",
 * 		summary="Add layer by WMS",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="wms_name",
 * 			in="query",
 * 			required=true,
 * 			type="string",
 * 			description="Wms layer name"
 * 		),
 * 		@SWG\Parameter(
 * 			name="url",
 * 			in="query",
 * 			required=true,
 * 			type="string",
 * 			description="Service url"
 * 		),
 * 		@SWG\Parameter(
 * 			name="proj",
 * 			in="query",
 * 			required=true,
 * 			type="string",
 * 			description="Request projection"
 * 		),
 * 		@SWG\Parameter(
 * 			name="formatlist",
 * 			in="query",
 * 			required=true,
 * 			type="string",
 * 			description="Image response format"
 * 		),
 * 		@SWG\Parameter(
 * 			name="layerTitle",
 * 			in="query",
 * 			required=true,
 * 			type="string",
 * 			description="New layer title"
 * 		),
 * 		@SWG\Parameter(
 * 			name="version",
 * 			in="query",
 * 			required=true,
 * 			type="string",
 * 			description="Request version"
 * 		),
 * 		@SWG\Parameter(
 * 			name="representationtype",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Layer features type",
 *          enum={"poligonal", "linear", "pontual"}
 * 		),
 * 		@SWG\Parameter(
 * 			name="suportsld",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="SLD support",
 *          enum={"true", "false"}
 * 		),
 * 		@SWG\Parameter(
 * 			name="infoformat",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="MIME types for a GetFeature request"
 * 		),
 * 		@SWG\Parameter(
 * 			name="time",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Value to use for the TIME parameter in GetMap requests"
 * 		),
 * 		@SWG\Parameter(
 * 			name="tile",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Tiles support",
 *          enum={"true", "false"}
 * 		),
 * 		@SWG\Parameter(
 * 			name="allitens",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Enable tooltip",
 *          enum={"true", "false"}
 * 		),
 *      @SWG\Response(
 * 			response="200",
 *          description="Result status",
 * 		)
 * )
 */
$app->map([
    'GET',
    'POST'
], '/{mapId}/addLayerWms', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $data = $this->map->addLayerWms($args["mapId"],$param["wms_name"], $param["url"], $param["proj"], $param["formatlist"], $param["layerTitle"], $param["version"], $param["wms_style"], $param["representationtype"], $param["suportsld"], $param["infoformat"],$param["time"], $param["tile"], json_decode($param["allitens"]));
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
    ->write(json_encode($data));
    return $response;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/restmapserver/map/{mapId}/identify/",
 * 		tags={"map attributes"},
 * 		operationId="identify",
 * 		summary="Get layers data from point",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="x",
 * 			in="query",
 * 			required=true,
 * 			type="number",
 * 			description="X coordinate"
 * 		),
 * 		@SWG\Parameter(
 * 			name="y",
 * 			in="query",
 * 			required=true,
 * 			type="number",
 * 			description="Y coordinate"
 * 		),
 * 		@SWG\Parameter(
 * 			name="resolution",
 * 			in="query",
 * 			required=false,
 * 			type="number",
 * 			description="Search resolution in pixels"
 * 		),
 * 		@SWG\Parameter(
 * 			name="extent",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Geographic coordinates of a rect to search (xmin,ymin,xmax,ymax)"
 * 		),
 * 		@SWG\Parameter(
 * 			name="layerNames",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Search layers list"
 * 		),
 * 		@SWG\Parameter(
 * 			name="allColumns",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Show all columns",
 *          enum={"true", "false"}
 * 		),
 *      @SWG\Response(
 * 			response="200",
 *          description="Result status",
 * 		)
 * )
 */
$app->map([
    'GET',
    'POST'
], '/{mapId}/identify', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $data = $this->identify->query($args["mapId"],$param["x"], $param["y"], $param["resolution"], @$param["extent"], @$param["layerNames"], json_decode(@$param["allColumns"]));
    $json = json_encode($data);
    $jsonError = $this->util->jsonError();
    if($jsonError != false){
        $json = $jsonError;
    }
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
    ->write($json);
    return $response;
});
$app->run();
exit();

switch ("none") {

    case "ADTEMA":
        include (I3GEOPATH . "/classesphp/classe_mapa.php");
        $m = new Mapa($_SESSION["map_file"]);
        $salvar = $m->adicionaTema($_GET["temas"], $_SESSION["locaplic"]);
        if ($salvar) {
            $m->salva();
        }
        validaAcessoTemas($_SESSION["map_file"]);
        $retorno = true;
        break;
    case "PARAMETERS":
        include (I3GEOPATH . "/classesphp/classe_mapa.php");
        $m = new Mapa($_SESSION["map_file"]);
        $par = $m->parametrosTemas();
        $e = $m->mapa->extent;
        $ext = $e->minx . " " . $e->miny . " " . $e->maxx . " " . $e->maxy;
        $res = array();
        $res["mapimagem"] = "";
        $res["mapexten"] = $ext;
        $res["mapres"] = "";
        $res["erro"] = "";
        $res["mapscale"] = "";
        $res["pixelsize"] = "";
        $res["mapimagem"] = "";
        $res["w"] = $m->mapa->width;
        $res["h"] = $m->mapa->height;
        $res["mappath"] = "";
        $res["mapurl"] = "";
        $res["mensagens"] = $m->pegaMensagens();
        $res["tempo"] = "";
        restauraCon($_SESSION["map_file"], $_SESSION["postgis_mapa"]);
        if ($par == "") {
            $retorno = false;
        } else {
            $retorno = array(
                "variaveis" => $res,
                "temas" => $par
            );
        }
        break;
    case "SEARCHINLAYERS":
        include (I3GEOPATH . "/classesphp/classe_mapa.php");
        $m = new Mapa($_SESSION["map_file"]);
        $lista = $m->listaTemasBuscaRapida();
        if ($lista != "") {
            include (I3GEOPATH . "/classesphp/classe_atributos.php");
            $m = new Atributos($_SESSION["map_file"]);
            $dados = $m->buscaRegistros($_GET["palavra"], $lista, "qualquer", "mapa");
            foreach ($dados as $tema) {
                $rs = $tema["resultado"];
                foreach ($rs as $r) {
                    $retorno[] = array(
                        "box" => $r["box"],
                        "valor" => $r["valores"][0]["valor"]
                    );
                }
            }
        } else {
            $retorno = false;
        }
        break;
    case "TEXTFONT":
        $retorno = listaTrueType($_SESSION["locaplic"], $_SESSION["imgdir"], $_SESSION["dir_tmp"]);
        break;
    case "ADDLAYERMETAESTAT":
        include (I3GEOPATH . "/classesphp/classe_metaestatinfo.php");
        $m = new MetaestatInfo();
        if (! empty($_GET["filter"])) {
            $_GET["filter"] = str_replace('"', "'", $_GET["filter"]);
            $final = array();
            $sepands = explode("|", $_GET["filter"]);
            foreach ($sepands as $sepand) {
                $linhas = explode("*", $sepand);
                if (! is_numeric(str_replace(array(
                    "'",
                    ","
                ), "", $linhas[1]))) {
                    exit();
                }
                if (count(explode(",", $linhas[1])) == 1) {
                    $final[] = $linhas[0] . " = " . $linhas[1];
                } else {
                    $final[] = $linhas[0] . " IN (" . $linhas[1] . ")";
                }
            }
            $_GET["filter"] = implode(" and ", $final);
        }
        // array("mapfile"=>$arq,"layer"=>$nomeDoLayer,"titulolayer"=>$titulolayer)
        $data = $m->mapfileMedidaVariavel($_GET["measure"], $_GET["filter"], 0, $_GET["layertype"], $_GET["title"], $_GET["classification"], $_GET["group"], $_GET["regiontype"], $_GET["opacity"], false);
        include (I3GEOPATH . "/classesphp/classe_mapa.php");
        $m = new Mapa($_SESSION["map_file"]);
        $m->adicionaTema($data["mapfile"], $_SESSION["locaplic"]);
        $m->salva();
        validaAcessoTemas($_SESSION["map_file"]);
        $retorno = true;
        break;
    case "ADDLAYERREGION":
        include (I3GEOPATH . "/classesphp/classe_metaestatinfo.php");
        $m = new MetaestatInfo();
        $retorno = $m->adicionaLimiteRegiao($_SESSION["map_file"], $_GET["region"]);
        validaAcessoTemas($_SESSION["map_file"]);
        break;
    case "TOGGLELAYERSVIS":
        include (I3GEOPATH . "/classesphp/classe_mapa.php");
        $m = new Mapa($_SESSION["map_file"]);
        $retorno = $m->ligaDesligaTemas($_GET["on"], $_GET["off"], "nao");
        $m->salva();
        break;
    case "ADICIONATEMASHP":
        $retorno = array();
        if ($_SESSION["navegadoresLocais"] == "sim") {
            include (I3GEOPATH . "/ms_configura.php");
            // verifica se esta cadastrado
            $ipcliente = pegaIPcliente();
            $ips = array();
            // pega os nomes de cada ip
            foreach ($navegadoresLocais["ips"] as $n) {
                $ips[] = gethostbyname($n);
                $ips[] = $n;
            }
            if (in_array($ipcliente, $ips)) {
                $drives = $navegadoresLocais["drives"];
                // pega o caminho
                // nome
                $split = explode("/", $_GET["arq"]);
                if (empty($split[0]) || ! in_array($split[0], array_keys($drives))) {
                    $retorno = array();
                } else {
                    include (I3GEOPATH . "/classesphp/classe_mapa.php");
                    $m = new Mapa($_SESSION["map_file"]);
                    $path = $split[0];
                    $split[0] = "";
                    $shp = implode("/", $split);
                    $shp = explode(".", $shp);
                    $shp = $shp[0] . ".shp";
                    $path = $drives[$path] . $shp;
                    $retorno = $m->adicionaTemaSHP($path);
                    if ($retorno != "erro") {
                        $m->salva();
                    } else {
                        $retorno = array();
                    }
                }
            }
        }
        break;
    case "ADICIONATEMAIMG":
        $retorno = array();
        if ($_SESSION["navegadoresLocais"] == "sim") {
            include (I3GEOPATH . "/ms_configura.php");
            // verifica se est&aacute; cadastrado
            $ipcliente = pegaIPcliente();
            $ips = array();
            // pega os nomes de cada ip
            foreach ($navegadoresLocais["ips"] as $n) {
                $ips[] = gethostbyname($n);
                $ips[] = $n;
            }
            if (in_array($ipcliente, $ips)) {
                $drives = $navegadoresLocais["drives"];
                // pega o caminho
                // nome
                $split = explode("/", $_GET["arq"]);
                if (empty($split[0]) || ! in_array($split[0], array_keys($drives))) {
                    $retorno = array();
                } else {
                    include (I3GEOPATH . "/classesphp/classe_mapa.php");
                    $m = new Mapa($_SESSION["map_file"]);
                    $path = $split[0];
                    $split[0] = "";
                    $shp = implode("/", $split);
                    $path = $drives[$path] . $shp;
                    $retorno = $m->adicionaTemaIMG($path);
                    if ($retorno != "erro") {
                        $m->salva();
                    } else {
                        $retorno = array();
                    }
                }
            }
        }
        break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);