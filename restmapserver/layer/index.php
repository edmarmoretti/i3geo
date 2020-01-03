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
include (I3GEOPATH . "/restmapserver/classes/util.php");
include (I3GEOPATH . "/restmapserver/classes/layer.php");
include (I3GEOPATH . "/restmapserver/classes/map.php");
include (I3GEOPATH . "/restmapserver/classes/admin.php");
include (I3GEOPATH . "/restmapserver/classes/metaestatinfo.php");
include (I3GEOPATH . "/restmapserver/classes/statistics.php");
$container = $app->getContainer();
$container['util'] = function ($c) {
    return new \restmapserver\Util();
};
$container['layer'] = function ($c) {
    return new \restmapserver\Layer();
};
$container['map'] = function ($c) {
    return new \restmapserver\Map();
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
 * 		path="/i3geo/restmapserver/layer/{mapId}/{layerName}/moveUp/",
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
 * 		path="/i3geo/restmapserver/layer/{mapId}/{layerName}/moveDown/",
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
 * 		path="/i3geo/restmapserver/layer/{mapId}/{layerName}/toggleStatusClass/",
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
 * 		path="/i3geo/restmapserver/layer/{mapId}/{layerName}/zoomSel/",
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
$app->run();
exit;

switch (strtoupper($_GET["funcao"])) {
    case "LIMPASEL":
        include (I3GEOPATH."/classesphp/classe_selecao.php");
        $m = new Selecao($_SESSION["map_file"], $_GET["tema"]);
        $m->selecaoLimpa();
        $retorno = true;
        break;
    case "INVERTESTATUSLEGENDA":
        include (I3GEOPATH."/classesphp/classe_temas.php");
        $m = new Temas($_SESSION["map_file"], $_GET["tema"]);
        $m->inverteStatusLegenda();
        $m->salva();
        $retorno = true;
        break;
    case "COPIA":
        include (I3GEOPATH."/classesphp/classe_temas.php");
        $m = new Temas($_SESSION["map_file"], $_GET["tema"]);
        $m->copiaTema();
        $m->salva();
        $retorno = true;
        break;
    case "ITENS":
        include (I3GEOPATH."/classesphp/classe_atributos.php");
        $m = new Atributos($_SESSION["map_file"], $_GET["tema"], "", $_GET["ext"]);
        $retorno = $m->listaItens();
        break;
    case "VALORESITEM":
        include (I3GEOPATH."/classesphp/classe_atributos.php");
        $m = new Atributos($_SESSION["map_file"], $_GET["tema"], "", $_GET["ext"]);
        $retorno = $m->listaUnicoRapida($_GET["item"]);
        break;
    case "ALTERLAYERNAME":
        include (I3GEOPATH."/classesphp/classe_temas.php");
        $valor = mb_convert_encoding($_GET["title"], "ISO-8859-1", mb_detect_encoding($_GET["title"]));
        $m = new Temas($_SESSION["map_file"], $_GET["idlayer"]);
        $retorno = $m->mudaNome($valor);
        $m->salva();
        break;
}