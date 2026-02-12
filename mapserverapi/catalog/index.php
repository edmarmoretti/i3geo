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
include (I3GEOPATH . "/mapserverapi/classes/catalog.php");
include (I3GEOPATH . "/mapserverapi/classes/util.php");
include (I3GEOPATH . "/mapserverapi/classes/map.php");
include (I3GEOPATH . "/mapserverapi/classes/layer.php");
$container = $app->getContainer();
$container['util'] = function ($c) {
    return new \mapserverapi\Util();
};
$container['catalog'] = function ($c) {
    return new \mapserverapi\Catalog();
};
$container['map'] = function ($c) {
    return new \mapserverapi\Map();
};
/**
 *
 * @SWG\Get(
 * 		path="/i3geo/mapserverapi/catalog/getMenus/",
 * 		tags={"map"},
 * 		operationId="getMenus",
 * 		summary="Get menus and layers in root node",
 * 		@SWG\Parameter(
 * 			name="mapId",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Map id"
 * 		),
 * 		@SWG\Parameter(
 * 			name="lang",
 * 			in="query",
 * 			required=false,
 * 			type="string",
 * 			description="Language (pt,en,es)"
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
], '/getMenus', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $this->map->open($param["mapId"]);
    $data = $this->catalog->getMenus($param["lang"]);
	//falta testar a validacao dos layers restritos
	$json = $this->util->toJson($data);
	$response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
        ->write($json);
    return $response;
});
$app->map([
    'GET',
    'POST'
], '/getMenuGroups', function (Request $request, Response $response, $args) {
    $param = $this->util->sanitizestrings($request->getQueryParams());
    $this->map->open($param["mapId"]);
    $data = $this->catalog->getMenuGroups($param["id_menu"],$param["lang"]);
    $json = $this->util->toJson($data);
    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()
    ->write($json);
    return $response;
});
$app->run();
exit;

switch (strtoupper($_GET["funcao"])) {
    case "PEGALISTADEGRUPOS":
        verifySql();
        include (I3GEOPATH."/classesphp/classe_menutemas.php");
        $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $editores, $_GET["idioma"], $_GET["filtro"]);
        $retorno = array(
            "idmenu" => $_GET["idmenu"] * 1,
            "grupos" => $m->pegaListaDeGrupos($_GET["idmenu"] * 1, "nao", "nao", $_GET["ordenaNome"], $_GET["filtraOgc"], $_GET["filtraDown"])
        );
        break;
    case "PEGALISTADESUBGRUPOS":
        verifySql();
        include (I3GEOPATH."/classesphp/classe_menutemas.php");
        $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $editores, $_GET["idioma"], $_GET["filtro"]);
        $retorno = $m->pegaListaDeSubGrupos($_GET["grupo"], $_GET["idmenu"]);
        break;
    case "PEGALISTADETEMAS":
        verifySql();
        include (I3GEOPATH."/classesphp/classe_menutemas.php");
        $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $editores, $_GET["idioma"]);
        $retorno = $m->pegaListaDeTemas($_GET["grupo"], $_GET["subgrupo"], $_GET["idmenu"]);
        break;
    case "PEGALISTADESISTEMAS":
        verifySql();
        include (I3GEOPATH."/classesphp/classe_menutemas.php");
        $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $editores, $_GET["idioma"]);
        $retorno = $m->pegaSistemas();
        break;
    case "PROCURARTEMASESTRELA":
        verifySql();
        include (I3GEOPATH."/classesphp/classe_menutemas.php");
        $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $editores, $_GET["idioma"]);
        $retorno = $m->procurartemasestrela($_GET["nivel"], $_GET["fatorestrela"]);
        break;
    case "GETLAYERSWMS":
        verifySql();
        include (I3GEOPATH."/classesphp/classe_ows.php");
        $m = new Ows($_GET["servico"]);
        $retorno = $m->getLayersWMS($_GET["nivel"], $_GET["id_ws"], $_GET["tipo_ws"], $_GET["nomelayer"]);
        break;
    case "GETLAYERSARCGISREST":
        verifySql();
        include (I3GEOPATH."/classesphp/conexao.php");
        $sql = "SELECT link_ws from {$esquemaadmin}i3geoadmin_ws WHERE id_ws = '" . $_GET["id_ws"] * 1 . "'";
        $q = $dbh->query($sql, PDO::FETCH_ASSOC)->fetchAll();
        $servico = $q[0]["link_ws"];
        include (I3GEOPATH."/classesphp/classe_ows.php");
        if (! empty($_GET["nomelayer"])) {
            $m = new Ows($servico . "/" . $_GET["nomelayer"]);
        } else {
            $m = new Ows($servico);
        }
        $retorno = json_decode($m->getLayersARCGISREST());
        break;
    case "EPSGLIST":
        $retorno = listaEpsg();
        break;

    case "GETINTERFACES":
        include (I3GEOPATH."/classesphp/funcoes_gerais.php");
        $pesquisarEm = array(
            $locaplic . "/interface"
        );
        if (isset($customDir) && $customDir != "" && $customDir != "interface") {
            $pesquisarEm[] = $locaplic . "/" . $customDir;
        }
        $retorno = array();
        foreach ($pesquisarEm as $p) {
            $r = listaArquivos($p);
            // var_dump($r);exit;
            $arqs = $r["arquivos"];
            $ext = $r["extensoes"];
            $nomes = $r["nomes"];
            $n = count($arqs);
            for ($i = 0; $i < $n; $i ++) {
                if (in_array($ext[$i], array(
                    "php",
                    "phtml",
                    "htm",
                    "html"
                ))) {
                    // verifica se tem a carga do js i3geo.js
                    $a = $p . "/" . $nomes[$i];
                    if(file_exists($a)){
                        $handle = fopen($a, "r");
                        $conteudo = fread($handle, filesize($a));
                        fclose($handle);
                        if (strstr($conteudo, "i3geo.js")) {
                            $retorno[] = "../" . basename($p) . "/" . $nomes[$i];
                        }
                    }
                }
            }
        }
        break;
    case "GETMAPS":
        verifySql();
        include (I3GEOPATH."/classesphp/classe_menutemas.php");
        $m = new Menutemas($map_file, $_GET["perfil"]);
        $retorno = $m->pegaListaDeMapas();
        break;
    case "DOWNLOADLAYER":
        session_name("i3GeoPHP");
        session_start();
        $retorno = downloadTema2("", $_GET["tema"], $locaplic, $dir_tmp, $postgis_mapa);
        $retorno["arquivos"] = "";
        $retorno["datas"] = "";
        $_SESSION["downloadZipTema"] = $retorno["shape-zip"];
        $retorno["shape-zip"] = basename($retorno["shape-zip"]);
        break;
}
function verifySql(){
    $bl = array(
        "exec ",
        "exec(",
        "password",
        "select",
        "_decode",
        "passthru",
        "shell_exec",
        "escapeshellarg",
        "escapeshellcmd",
        "proc_close",
        "proc_open",
        "popen",
        "delete",
        "drop",
        "update",
        "insert",
        "system",
        ";"
    );
    foreach (array_keys($_GET) as $k) {
        $k = str_ireplace($bl, "", $k);
        $k = filter_var($k, FILTER_SANITIZE_STRING);
        if ($_GET[$k] != "''") {
            $v = strip_tags($_GET[$k]);
            $v = str_ireplace($bl, "", $v);
            $_GET[$k] = trim($v);
        }
    }
}
