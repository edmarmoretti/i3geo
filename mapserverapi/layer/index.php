<?php
define("I3GEOPATH", explode("mapserverapi", __FILE__)[0]);

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

require '../vendor/autoload.php';
$config['displayErrorDetails'] = false;
$config['addContentLengthHeader'] = false;
$app = new \Slim\App([
    'settings' => $config
]);
include (I3GEOPATH . "/mapserverapi/classes/util.php");
include (I3GEOPATH . "/mapserverapi/classes/layer.php");
include (I3GEOPATH . "/mapserverapi/classes/map.php");
include (I3GEOPATH . "/mapserverapi/classes/admin.php");
include (I3GEOPATH . "/mapserverapi/classes/metaestatinfo.php");
include (I3GEOPATH . "/mapserverapi/classes/statistics.php");
$container = $app->getContainer();
$container['util'] = function ($c) {
    return new \mapserverapi\Util();
};
$container['layer'] = function ($c) {
    return new \mapserverapi\Layer();
};
$container['map'] = function ($c) {
    return new \mapserverapi\Map();
};
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/mapserverapi/layer/{mapId}/{layerName}/queryByrect/",
 * 		tags={"layer"},
 * 		operationId="queryByrect",
 * 		summary="Get data by rect",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="layerName",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Layer name"
 * 		),
 * 		@SWG\Parameter(
 * 			name="wkt",
 * 			in="query",
 * 			required=true,
 * 			type="string",
 * 			description="Get results geometry",
 *          enum={"true", "false"}
 * 		),
 * 		@SWG\Parameter(
 * 			name="extent",
 * 			in="query",
 * 			required=true,
 * 			type="string",
 * 			description="Geographic extent (xmin, ymin, xmax, ymax)"
 * 		),
 *      @SWG\Response(
 * 			response="200",
 *          description="data",
 * 		)
 * )
 */
$app->map([
    'GET',
    'POST'
],'/{mapId}/{layerName}/queryByRect', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $mapObj = $this->map->getMapObj($args["mapId"]);
    $data = $this->layer->queryByrect($mapObj,$args["layerName"],json_decode($param["wkt"]),$param["extent"]);
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
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/mapserverapi/layer/{mapId}/{layerName}/moveUp/",
 * 		tags={"layer"},
 * 		operationId="moveUp",
 * 		summary="Change layer position in a map",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="layerName",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Layer name"
 * 		),
 *      @SWG\Response(
 * 			response="200",
 *          description="data",
 * 		)
 * )
 */
$app->map([
    'GET',
    'POST'
],'/{mapId}/{layerName}/moveUp', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $mapObj = $this->map->getMapObj($args["mapId"]);
    $data = $this->layer->moveUp($mapObj,$args["layerName"]);
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
    ->write(json_encode($data));
    return $response;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/mapserverapi/layer/{mapId}/{layerName}/moveDown/",
 * 		tags={"layer"},
 * 		operationId="moveUp",
 * 		summary="Change layer position in a map",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="layerName",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Layer name"
 * 		),
 *      @SWG\Response(
 * 			response="200",
 *          description="data",
 * 		)
 * )
 */
$app->map([
    'GET',
    'POST'
],'/{mapId}/{layerName}/moveDown', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $mapObj = $this->map->getMapObj($args["mapId"]);
    $data = $this->layer->moveDown($mapObj,$args["layerName"]);
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
    ->write(json_encode($data));
    return $response;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/mapserverapi/layer/{mapId}/{layerName}/toggleStatusClass/",
 * 		tags={"layer class"},
 * 		operationId="toggleStatusClass",
 * 		summary="Change class status",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="layerName",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Layer name"
 * 		),
 * 		@SWG\Parameter(
 * 			name="classIds",
 * 			in="query",
 * 			required=true,
 * 			type="string",
 * 			description="Class ids list"
 * 		),
 *      @SWG\Response(
 * 			response="200",
 *          description="data",
 * 		)
 * )
 */
$app->map([
    'GET',
    'POST'
],'/{mapId}/{layerName}/toggleStatusClass', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $mapObj = $this->map->getMapObj($args["mapId"]);
    $data = $this->layer->toggleStatusClass($mapObj,$args["layerName"],$param["classIds"]);
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
    ->write(json_encode($data));
    return $response;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/mapserverapi/layer/{mapId}/{layerName}/zoomSel/",
 * 		tags={"layer"},
 * 		operationId="zoomSel",
 * 		summary="Set map extent by layer selected shapes",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="layerName",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Layer name"
 * 		),
 *      @SWG\Response(
 * 			response="200",
 *          description="data",
 * 		)
 * )
 */
$app->map([
    'GET',
    'POST'
],'/{mapId}/{layerName}/zoomSel', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $mapObj = $this->map->getMapObj($args["mapId"]);
    $data = $this->layer->zoomSel($mapObj,$args["layerName"]);
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
    ->write(json_encode($data));
    return $response;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/mapserverapi/layer/{mapId}/{layerName}/clearSel/",
 * 		tags={"layer"},
 * 		operationId="clearSel",
 * 		summary="Clear layer selections",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="layerName",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Layer name"
 * 		),
 *      @SWG\Response(
 * 			response="200",
 *          description="data",
 * 		)
 * )
 */
$app->map([
    'GET',
    'POST'
],'/{mapId}/{layerName}/clearSel', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $mapObj = $this->map->getMapObj($args["mapId"]);
    $data = $this->layer->clearSel($mapObj,$args["layerName"]);
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
    ->write(json_encode($data));
    return $response;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/mapserverapi/layer/{mapId}/{layerName}/toggleLegend/",
 * 		tags={"layer legend"},
 * 		operationId="toggleLegend",
 * 		summary="Toggle layer legend",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="layerName",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Layer name"
 * 		),
 *      @SWG\Response(
 * 			response="200",
 *          description="data",
 * 		)
 * )
 */
$app->map([
    'GET',
    'POST'
],'/{mapId}/{layerName}/toggleLegend', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $mapObj = $this->map->getMapObj($args["mapId"]);
    $data = $this->layer->toggleLegend($mapObj,$args["layerName"]);
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
    ->write(json_encode($data));
    return $response;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/mapserverapi/layer/{mapId}/{layerName}/copy/",
 * 		tags={"layer"},
 * 		operationId="copy",
 * 		summary="Copy layer",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="layerName",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Layer name"
 * 		),
 *      @SWG\Response(
 * 			response="200",
 *          description="data",
 * 		)
 * )
 */
$app->map([
    'GET',
    'POST'
],'/{mapId}/{layerName}/copy', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $mapObj = $this->map->getMapObj($args["mapId"]);
    $data = $this->layer->copy($mapObj,$args["layerName"]);
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
    ->write(json_encode($data));
    return $response;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/mapserverapi/layer/{mapId}/{layerName}/getItensParameters/",
 * 		tags={"layer"},
 * 		operationId="getItensParameters",
 * 		summary="Get itens layer",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="layerName",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Layer name"
 * 		),
 *      @SWG\Response(
 * 			response="200",
 *          description="data",
 * 		)
 * )
 */
$app->map([
    'GET',
    'POST'
],'/{mapId}/{layerName}/getItensParameters', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $mapObj = $this->map->getMapObj($args["mapId"]);
    $layerObj = $mapObj->getLayerByName($args["layerName"]);
    $itensLayer = $this->layer->getItens($layerObj);
    $data = $this->layer->getItensParameters($layerObj, $itensLayer);
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
    ->write(json_encode($data));
    return $response;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/mapserverapi/layer/{mapId}/{layerName}/getUniqueValuesItem/",
 * 		tags={"layer"},
 * 		operationId="getUniqueValuesItem",
 * 		summary="Get item unique values",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="layerName",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Layer name"
 * 		),
 * 		@SWG\Parameter(
 * 			name="itemName",
 * 			in="query",
 * 			required=true,
 * 			type="string",
 * 			description="Item name"
 * 		),
 *      @SWG\Response(
 * 			response="200",
 *          description="data",
 * 		)
 * )
 */
$app->map([
    'GET',
    'POST'
],'/{mapId}/{layerName}/getUniqueValuesItem', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $mapObj = $this->map->getMapObj($args["mapId"]);
    $layerObj = $mapObj->getLayerByName($args["layerName"]);
    $data = $this->layer->getUniqueValuesItem($layerObj, @$param["itemName"]);
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
    ->write(json_encode($data));
    return $response;
});
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/mapserverapi/layer/{mapId}/{layerName}/alterName/",
 * 		tags={"layer"},
 * 		operationId="getUniqueValuesItem",
 * 		summary="Get item unique values",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="layerName",
 * 			in="path",
 * 			required=true,
 * 			type="string",
 * 			description="Layer name"
 * 		),
 * 		@SWG\Parameter(
 * 			name="layerTitle",
 * 			in="query",
 * 			required=true,
 * 			type="string",
 * 			description="New name"
 * 		),
 *      @SWG\Response(
 * 			response="200",
 *          description="data",
 * 		)
 * )
 */
$app->map([
    'GET',
    'POST'
],'/{mapId}/{layerName}/alterName', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $mapObj = $this->map->getMapObj($args["mapId"]);
    $data = $this->layer->alterName($mapObj,$args["layerName"], @$param["layerTitle"]);
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
    ->write(json_encode($data));
    return $response;
});
$app->run();
exit;