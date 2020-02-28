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
include (I3GEOPATH . "/restmapserver/classes/map.php");
include (I3GEOPATH . "/restmapserver/classes/layer.php");
include (I3GEOPATH . "/restmapserver/classes/util.php");
include (I3GEOPATH . "/restmapserver/classes/admin.php");
include (I3GEOPATH . "/restmapserver/classes/metaestatinfo.php");
include (I3GEOPATH . "/restmapserver/classes/statistics.php");
$container = $app->getContainer();
$container['util'] = function ($c) {
    return new \restmapserver\Util();
};
$container['mscriamapa'] = function ($c) {
    return new \restmapserver\Mscriamapa();
};
$container['map'] = function ($c) {
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
    include (I3GEOPATH . "/restmapserver/classes/mscriamapa.php");
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
    
    $json = json_encode($data);
    $jsonError = $this->util->jsonError();
    
    if ($jsonError != false) {
        $json = $jsonError;
    }
	$response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
        ->write($json);
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
 * 		tags={"map legend"},
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
    $data = $this->map->createLayerPointFeature($args["mapId"], $param["symbol"], $param["x"], $param["y"], $param["offsetx"], $param["offsety"], $param["color"], $param["size"], $param["layerTitle"]);
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
    $data = $this->map->extentToLayer($args["mapId"], $param["layerName"]);
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
 * 		tags={"map add layer"},
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
    $data = $this->map->addLayerWms($args["mapId"], $param["wms_name"], $param["url"], $param["proj"], $param["formatlist"], $param["layerTitle"], $param["version"], $param["wms_style"], $param["representationtype"], $param["suportsld"], $param["infoformat"], $param["time"], $param["tile"], json_decode($param["allitens"]));
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
    $data = $this->identify->query($args["mapId"], $param["x"], $param["y"], $param["resolution"], @$param["extent"], @$param["layerNames"], json_decode(@$param["allColumns"]));
    $json = json_encode($data);
    $jsonError = $this->util->jsonError();
    if ($jsonError != false) {
        $json = $jsonError;
    }
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
        ->write($json);
    return $response;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/restmapserver/map/{mapId}/addLayers/",
 * 		tags={"map add layer"},
 * 		operationId="addLayers",
 * 		summary="Add new layers to map",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="layerNames",
 * 			in="query",
 * 			required=true,
 * 			type="string",
 * 			description="Layers list. Map files with the same names defined in the list must exist in the i3geo/temas folder."
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
], '/{mapId}/addLayers', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $data = $this->map->addLayers($args["mapId"], $param["layerNames"]);
    $this->map->removeRestrictLayers();
    $this->map->hiddeCon();
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
        ->write(json_encode($data));
    return $response;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/restmapserver/map/{mapId}/searchInLayers/",
 * 		tags={"map attributes"},
 * 		operationId="searchInLayers",
 * 		summary="Search for data in existing layers on the map that allow searching.",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="search",
 * 			in="query",
 * 			required=true,
 * 			type="string",
 * 			description="Search string"
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
], '/{mapId}/searchInLayers', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    if (empty($param["search"])) {
        $data = array();
    } else {
        $data = $this->map->searchInLayers($args["mapId"], $param["search"], $param["extent"]);
    }
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
        ->write(json_encode($data));
    return $response;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/restmapserver/map/{mapId}/searchInLayers/",
 * 		tags={"map"},
 * 		operationId="textFontList",
 * 		summary="Get list of text fonts.",
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
], '/{mapId}/textFontList', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $data = $this->map->textFontList($args["mapId"]);
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
        ->write(json_encode($data));
    return $response;
});

/**
 *
 * @SWG\Get(
 * 		path="/i3geo/restmapserver/map/{mapId}/addLayerMetaestatFilter/",
 * 		tags={"map add layer"},
 * 		operationId="addLayerMetaestatFilter",
 * 		summary="Add a new layer to the map based on the statistical metadata system.",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="measure",
 * 			in="query",
 * 			required=true,
 * 			type="number",
 * 			description="Measure id."
 * 		),
 * 		@SWG\Parameter(
 * 			name="filter",
 * 			in="query",
 * 			required=true,
 * 			type="string",
 * 			description="Filters that will be applied. Format: columnName * value | columName * value ."
 * 		),
 * 		@SWG\Parameter(
 * 			name="classification",
 * 			in="query",
 * 			required=true,
 * 			type="number",
 * 			description="Classification type code when there are more than one."
 * 		),
 * 		@SWG\Parameter(
 * 			name="opacity",
 * 			in="query",
 * 			required=false,
 * 			type="number",
 * 			description="Layer opacity."
 * 		),
 * 		@SWG\Parameter(
 * 			name="regiontype",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Region type code."
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
], '/{mapId}/addLayerMetaestatFilter', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $data = $this->map->addLayerMetaestatFilter($args["mapId"], $param["measure"], $param["filter"], $param["classification"], $param["opacity"], $param["regiontype"]);
    $this->map->removeRestrictLayers();
    $this->map->hiddeCon();
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
        ->write(json_encode($data));
    return $response;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/restmapserver/map/{mapId}/addLayerRegion/",
 * 		tags={"map add layer"},
 * 		operationId="addLayerRegion",
 * 		summary="Add a new layer to the map based on the statistical metadata system and regions.",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="region",
 * 			in="query",
 * 			required=true,
 * 			type="number",
 * 			description="Region id."
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
], '/{mapId}/addLayerRegion', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $data = $this->map->addLayerRegion($args["mapId"], $param["region"]);
    $this->map->removeRestrictLayers();
    $this->map->hiddeCon();
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
        ->write(json_encode($data));
    return $response;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/restmapserver/map/{mapId}/toggleLayersVis/",
 * 		tags={"map update"},
 * 		operationId="toggleLayersVis",
 * 		summary="Turn layers visibility on or off",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="on",
 * 			in="query",
 * 			required=true,
 * 			type="string",
 * 			description="Layers to turn on"
 * 		),
 * 		@SWG\Parameter(
 * 			name="off",
 * 			in="query",
 * 			required=true,
 * 			type="string",
 * 			description="Layers to turn off"
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
], '/{mapId}/toggleLayersVis', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $this->map->layersOn($args["mapId"], $param["on"]);
    $this->map->layersOff($args["mapId"], $param["off"]);
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
        ->write(json_encode(true));
    return true;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/restmapserver/map/{mapId}/addLayerShp/",
 * 		tags={"map add layer"},
 * 		operationId="addLayerShp",
 * 		summary="Add layer by shapefile",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="arq",
 * 			in="query",
 * 			required=true,
 * 			type="string",
 * 			description="Shape file. You must configure file system access permissions. See in ms_configura."
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
], '/{mapId}/addLayerShp', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $data = false;
    $permission = $this->map->verifyPermissionFile($args["mapId"], $param["arq"]);
    if ($permission == true) {
        $path = $this->map->getLocalShpPath($args["mapId"], $param["arq"], false);
        $data = $this->map->addLayerShp($args["mapId"], $path, false);
    }
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
        ->write(json_encode($data->name));
    return true;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/restmapserver/map/{mapId}/addLayerImg/",
 * 		tags={"map add layer"},
 * 		operationId="addLayerImg",
 * 		summary="Add layer by image file",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="arq",
 * 			in="query",
 * 			required=true,
 * 			type="string",
 * 			description="Image file. You must configure file system access permissions. See in ms_configura."
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
], '/{mapId}/addLayerImg', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $data = false;
    $permission = $this->map->verifyPermissionFile($args["mapId"], $param["arq"]);
    if ($permission == true) {
        $path = $this->map->getLocalImgPath($args["mapId"], $param["arq"], false);
        $data = $this->map->addLayerImg($args["mapId"], $path, false);
    }
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
    ->write(json_encode($data->name));
    return true;
});
$app->run();
