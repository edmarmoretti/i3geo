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
$container['layer'] = function ($c) {
    include (I3GEOPATH . "/restmapserver/classes/layer.php");
    return new \restmapserver\Layer();
};
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/restmapserver/layer/{mapId}/{layerName}/queryByrect/",
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
    $data = $this->layer->queryByrect($args["mapId"],$args["layerName"],json_decode($param["wkt"]),$param["extent"]);
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
$app->map([
    'GET',
    'POST'
],'/{mapId}/{layerName}/moveUp', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $data = $this->layer->moveUp($args["mapId"],$args["layerName"]);
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
    ->write(json_encode($data));
    return $response;
});
$app->map([
    'GET',
    'POST'
],'/{mapId}/{layerName}/moveDown', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $data = $this->layer->moveDown($args["mapId"],$args["layerName"]);
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
    ->write(json_encode($data));
    return $response;
});
$app->run();