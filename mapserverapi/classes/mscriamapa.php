<?php
namespace mapserverapi;

class Mscriamapa
{

    protected $mapid = "";

    function __construct()
    {
        $this->util = new \mapserverapi\Util();
        $this->map = new \mapserverapi\Map();
    }

    function createMap($param = [])
    {
        $mapId = $this->getMapId();
        $this->setSession(@$param["projection"], @$param["mapext"], @$param["kmlurl"]);
        $this->criateIndex();
        // restaura um mapa salvo
        $mapRestored = false;
        if (! empty($param["restoreMapId"])) {
            $mapRestored = $this->restoreMap($param["restoreMapId"] * 1);
        } else {
            $basemapfile = $this->util->getBaseMapfile();
            if (! empty($param["mapfilebase"])) {
                // safe
                $param["mapfilebase"] = basename(str_replace(".map", "", $param["mapfilebase"])) . ".map";
                if (file_exists(I3GEOPATH . "/" . $param["mapfilebase"])) {
                    $basemapfile = I3GEOPATH . "/" . $param["mapfilebase"];
                } elseif (file_exists(I3GEOPATH . "/aplicmap/" . $param["mapfilebase"])) {
                    $basemapfile = I3GEOPATH . "/aplicmap/" . $param["mapfilebase"];
                } elseif (file_exists(I3GEOPATH . "/" . $_SESSION["customDir"] . "/" . $param["mapfilebase"])) {
                    $basemapfile = I3GEOPATH . "/" . $_SESSION["customDir"] . "/" . $param["mapfilebase"];
                }
            }
            $map = ms_newMapObj($basemapfile);
            $map->save($_SESSION["map_file"]);
            $map->free();
            $_SESSION["base"] = $basemapfile;
        }
        if (isset($param["layersadd"])) {
            $this->map->addLayers($mapId, $param["layersadd"]);
        }
        if (isset($param["layerson"])) {
            $this->map->layersOn($mapId, $param["layerson"]);
        }
        if (isset($param["layersoff"])) {
            $this->map->layersOff($mapId, $param["layersoff"]);
        }
        if (isset($param["metaestatids"])) {
            $this->map->addLayersMetaestat($mapId,$param["metaestatids"], $param["layerson"]);
        }
        // processa parametros de inclusao de dados
        if (isset($param["wkt"])) {
            $this->map->addLayerByWkt($mapId,$param["wkt"], $param["namewkt"], $param["symbol"], $param["symbolsize"], $param["symbolcolor"]);
        }
        if (isset($param["points"])) {
            $this->map->addLayerByPoints($mapId,$param["points"], $param["namepoints"], $param["symbol"], $param["symbolsize"], $param["symbolcolor"]);
        }
        if (isset($param["lines"])) {
            $this->map->addLayerByLines($mapId,$param["lines"], $param["namelines"], $param["symbol"], $param["symbolsize"], $param["symbolcolor"]);
        }
        if (isset($param["polygons"])) {
            $this->map->addLayerByPolygons($mapId,$param["polygons"], $param["namepolygons"], $param["symbolcolor"]);
        }
        /*
         * $param["titlewms"] = "estados";
         * $param["urlwms"] = "http://bdgex.eb.mil.br/mapcache?";
         * $param["srswms"] = "EPSG:4326";
         * $param["layerwms"] = "estados";
         * $param["imagewms"] = "image/png,image/jpeg";
         * $param["stylewms"] = "";
         * $param["versionwms$i3GeoProjDefault"] = "1.1.1";
         */
        if (isset($param["urlwms"])) {
            $this->map->addLayerWms($mapId, $param["titlewms"], $param["urlwms"], $param["srswms"], $param["imagewms"], "", $param["versionwms"], $param["layerwms"]);
        }
        $this->map->removeRestrictLayers();
        $this->map->hiddeCon();
        $map = ms_newMapObj($_SESSION["map_file"]);
        ms_ResetErrorList();
        $proj = $this->util->getDefaultProjection("proj4");
        if ($proj != "") {
            $map->setProjection($proj);
            $map->save($_SESSION["map_file"]);
        }
        $this->applyFilter($map,$param);
        if (empty($_SESSION["mapext"])) {
            $_SESSION["mapext"] = $map->extent->minx . " " . $map->extent->miny . " " . $map->extent->maxx . " " . $map->extent->maxy;
        }
        $protocolo = explode("/", $_SERVER['SERVER_PROTOCOL']);
        $w = $map->web;
        $_SESSION["imgurl"] = strtolower($protocolo[0]) . "://" . $_SERVER['HTTP_HOST'] . $w->imageurl . $_SESSION["imgdir"] . "/";
        $_SESSION["tmpurl"] = strtolower($protocolo[0]) . "://" . $_SERVER['HTTP_HOST'] . $w->imageurl;

        $protocolo = $protocolo[0];
        $protocolo = strtolower($protocolo) . '://' . $_SERVER['SERVER_NAME'] . ":" . $_SERVER['SERVER_PORT'];
        $_SESSION["urli3geo"] = str_replace("/mapserverapi/map/index.php", "", $protocolo . $_SERVER["PHP_SELF"]);
        if ($param["idioma"] != "") {
            $arr_cookie_options = array (
                'expires' => time() + 60*60*24*365,
                'path' => '/',
                'secure' => true,     // or false
                'samesite' => 'Strict' // None || Lax  || Strict
            );
            setcookie("i3geolingua", $param["idioma"],$arr_cookie_options);
        }
        return $mapId;
    }

    function getMapId()
    {
        if ($this->mapid != "") {
            return $this->mapid;
        }
        session_name("i3GeoPHP");
        unset($GLOBALS);
        $_COOKIE = array();
        if (session_status() == PHP_SESSION_ACTIVE) {
            session_destroy();
        }
        $_SESSION = array();
        ini_set("session.cookie_secure", 1);
        session_start();
        $this->mapid = session_id();
        return $this->mapid;
    }

    function setSession($projection = "osm", $mapext = "", $kmlurl = "")
    {
        include (I3GEOPATH . "/ms_configura.php");
        // verifica se o usuario trocou a senha do master
        if ($_SERVER['SERVER_NAME'] != "localhost" && ($i3geomaster[0]["usuario"] == "admin" && $i3geomaster[0]["senha"] == "admin")) {
            echo json_encode(array(
                "bloqueado" => "Bloqueado. ATENCAO!!! Acesso bloqueado: edite o arquivo i3geo/ms_configura.php e altere o login e senha da variavel i3geomaster"
            ));
            exit();
        }
        $_SESSION["kmlurl"] = $kmlurl;
        $_SESSION["projection"] = $projection;
        $_SESSION["interface"] = ($projection == "geo") ? "openlayers" : "googlemaps";
        $_SESSION["mapext"] = str_replace(",", " ", $mapext);

        $_SESSION["base"] = $base;
        $_SESSION["dir_tmp"] = $dir_tmp;
        $_SESSION["cachedir"] = $cachedir;
        $_SESSION["emailInstituicao"] = $emailInstituicao;
        $_SESSION["locmapserv"] = $locmapserv;
        $_SESSION["locaplic"] = $locaplic;
        $_SESSION["R_path"] = $R_path;
        $_SESSION["debug"] = false;
        $_SESSION["ler_extensoes"] = [];
        $_SESSION["postgis_mapa"] = $postgis_mapa;
        $_SESSION["perfil"] = $perfil;
        $_SESSION["navegadoresLocais"] = $navegadoresLocais;
        $_SESSION["utilizacgi"] = $utilizacgi;
        $_SESSION["tituloInstituicao"] = $tituloInstituicao;
        $_SESSION["googleApiKey"] = $googleApiKey;
        $_SESSION["mensagemInicia"] = $mensagemInicia;
        $_SESSION["interfacePadrao"] = $interfacePadrao;
        $_SESSION["i3geoPermiteLogin"] = $i3geoPermiteLogin;
        $_SESSION["customDir"] = (! isset($customDir)) ? "" : $customDir;
        $_SESSION["contadorsalva"] = 0; // essa variavel e utilizada pela ferramenta telaremota. Toda vez que o mapa e salvo, acrescenta 1 (veja classesphp/mapa_controle.php)
        $_SESSION["i3georendermode"] = $i3georendermode;
        $_SESSION["i3geoPermiteLogin"] = $i3geoPermiteLogin;
        $_SESSION["i3geoBlFerramentas"] = $i3geoBlFerramentas;
        $_SESSION["i3GeoProjDefault"] = $i3GeoProjDefault;
        $_SESSION["i3geo_proxy_server"] = $i3geo_proxy_server;
        if ($esquemaadmin != "") {
            $_SESSION["esquemaadmin"] = str_replace(".", "", $esquemaadmin) . ".";
        } else {
            $_SESSION["esquemaadmin"] = "";
        }
        $_SESSION["statusFerramentas"] = $statusFerramentas;
        $_SESSION['fingerprint'] = md5('I3GEOSEC' . $_SERVER['HTTP_USER_AGENT'] . session_id());
        $diretorios = $this->criaDirMapa($_SESSION["dir_tmp"], $_SESSION["cachedir"]);
        if ($diretorios == false) {
            header("Content-type: application/json");
            echo json_encode(array(
                "errorMsg" => "Nao foi possivel criar o mapa em ms_tmp"
            ));
            exit();
        }
        $_SESSION["map_file"] = $diretorios[0];
        $_SESSION["mapdir"] = $diretorios[1];
        $_SESSION["imgdir"] = $diretorios[2];
    }

    function criaDirMapa($dir_tmp = "", $cachedir = "")
    {
        if (empty($dir_tmp)) {
            return false;
        }
        if (! file_exists($dir_tmp)) {
            @mkdir($dir_tmp, 0744);
        }
        if (file_exists($dir_tmp)) {
            foreach (glob($dir_tmp . '/{,.}*.php', GLOB_BRACE) as $f) {
                rename($f, str_replace(".php", "_php_renomeado_por_ms_criamapa", $f));
            }
            $tmpdirname = uniqid("i3geomap");
            $crdir = @mkdir($dir_tmp . "/" . $tmpdirname, 0744);
            chmod($dir_tmp . "/" . $tmpdirname, 0744);
            $crdiri = @mkdir($dir_tmp . "/img" . $tmpdirname, 0744);
            chmod($dir_tmp . "/img" . $tmpdirname, 0744);
            $mapfile = $dir_tmp . "/" . $tmpdirname . "/" . $tmpdirname . ".map";
            $tmpimgname = "img" . $tmpdirname;
            if (! file_exists($dir_tmp . "/comum")) {
                @mkdir($dir_tmp . "/comum", 0744);
            }
            //
            if ($cachedir == "") {
                if (! file_exists($dir_tmp . "/cache")) {
                    @mkdir($dir_tmp . "/cache", 0744);
                    chmod($dir_tmp . "/cache", 0744);
                    @mkdir($dir_tmp . "/cache/googlemaps", 0744);
                    chmod($dir_tmp . "/cache/googlemaps", 0744);
                }
            } else {
                if (! file_exists($cachedir)) {
                    @mkdir($cachedir, 0744);
                    chmod($cachedir, 0744);
                    @mkdir($cachedir . "/googlemaps", 0744);
                    chmod($cachedir . "/googlemaps", 0744);
                }
            }
            if (file_exists($dir_tmp . "/" . $tmpdirname)) {
                return array(
                    $mapfile,
                    $tmpdirname,
                    $tmpimgname
                );
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    function criateIndex()
    {
        if (! file_exists($_SESSION["dir_tmp"] . "/index.htm")) {
            $f = fopen($_SESSION["dir_tmp"] . "/index.htm", "x");
            fclose($f);
            $f = fopen($_SESSION["dir_tmp"] . "/index.html", "x");
            fclose($f);
            $f = fopen($_SESSION["dir_tmp"] . "/" . $_SESSION["mapdir"] . "/index.html", "x");
            fclose($f);
            $f = fopen($_SESSION["dir_tmp"] . "/" . $_SESSION["mapdir"] . "/index.htm", "x");
            fclose($f);
            $f = fopen($_SESSION["dir_tmp"] . "/" . $_SESSION["imgdir"] . "/index.html", "x");
            fclose($f);
            $f = fopen($_SESSION["dir_tmp"] . "/" . $_SESSION["imgdir"] . "/index.htm", "x");
            fclose($f);
        }
        if (! file_exists($_SESSION["dir_tmp"] . "/index.htm")) {
            echo "Erro. N&atilde;o foi poss&iacute;vel gravar no diret&oacute;rio tempor&aacute;rio";
            exit();
        }
    }
    function restoreMap($restoreMapId = "")
    {
        $mapasalvo = $this->util->getSavedMap($restoreMapId);
        $mapfiletxt = $mapasalvo["mapfile"];
        if (empty($mapfiletxt)) {
            return false;
        }
        if (! preg_match('/MAP/', $mapfiletxt)) {
            $mapfiletxt = base64_decode($mapfiletxt);
        } else {
            // substitui strings especiais
            $mapfiletxt = str_replace("_!!_", '"', $mapfiletxt);
            $mapfiletxt = str_replace("_!_", "'", $mapfiletxt);
        }
        $mapfiletxt = str_ireplace("TYPE ANNOTATION", "TYPE POINT", $mapfiletxt);
        if (@ms_newMapObjFromString($mapfiletxt)) {
            $m = ms_newMapObjFromString($mapfiletxt);
            $w = $m->web;
            $w->set("imagepath", dirname($w->imagepath) . "/");
            $w->set("imageurl", dirname($w->imageurl) . "/");
            $m->save($_SESSION["map_file"]);
            $m->free();
            $this->util->hiddeCon($_SESSION["map_file"]);
            return true;
        } else {
            return false;
        }
    }
    function applyFilter($mapobj,$parurl)
    {
        $layersNames = $mapobj->getAllLayerNames();
        foreach ($layersNames as $name) {
            $filtro = @$parurl["map_layer_" . $name . "_filter"];
            if (! empty($filtro)) {
                $layer = $mapobj->getLayerByName($name);
                $layer->setmetadata("CACHE", "nao");
                //echo $filtro;exit;
                $layer->setfilter($filtro);
            }
        }
        $mapobj->save($_SESSION["map_file"]);
    }
}