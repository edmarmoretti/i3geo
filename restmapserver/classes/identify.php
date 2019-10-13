<?php
namespace restmapserver;

class Identify
{

    function __construct()
    {
        include_once (I3GEOPATH . "/restmapserver/classes/util.php");
        $this->util = new \restmapserver\Util();
        include_once (I3GEOPATH . "/restmapserver/classes/map.php");
        $this->map = new \restmapserver\Map();
        include_once (I3GEOPATH . "/restmapserver/classes/layer.php");
        $this->layer = new \restmapserver\Layer();
    }

    function open($mapId = "")
    {
        if ($mapId == "") {
            return false;
        }
        if (isset($_SESSION["map_file"])) {
            return true;
        }
        ini_set("session.use_cookies", 0);
        session_name("i3GeoPHP");
        session_id($mapId);
        session_start([
            'read_and_close' => true
        ]);
        if (@$_SESSION["fingerprint"]) {
            $f = explode(",", $_SESSION["fingerprint"]);
            if (md5('I3GEOSEC' . $_SERVER['HTTP_USER_AGENT'] . session_id()) != $f[0]) {
                return false;
            }
        } else {
            return false;
        }
        if (! isset($_SESSION["map_file"])) {
            return false;
        }
        return true;
    }

    function query($mapId, $x, $y, $resolution, $extent = "", $layerNames = "", $wkt = false, $allColumns = false)
    {
        if ($this->open($mapId) == false) {
            return false;
        }
        $mapObj = ms_newMapObj($_SESSION["map_file"]);
        if ($extent != "") {
            $extmapa = $mapObj->extent;
            $e = explode(",", str_replace(" ", ",", $extent));
            $extmapa->setextent($e[0], $e[1], $e[2], $e[3]);
        }
        $listatemas = array();
        $resultados = array();
        $layerNames = explode(",", str_replace(" ", ",", $layerNames));
        foreach ($layerNames as $layerName) {
            $layerObj = $mapObj->getlayerbyname($layerName);
            if ($this->layer->getAttributesIsValid($layerObj) == true) {
                $layers[] = $layerObj;
                $this->layer->ativateQuery($layerObj);
            }
        }
        foreach ($layers as $layer) {
            $resultados[$layer->name] = $this->getData($layer, $mapObj, $x, $y, $resolution, $wkt, $allColumns);
        }
        if (count($resultados) > 0) {
            $res = $this->format($mapObj, $layers, $resultados);
            return array(
                "point" => array(
                    "x" => $x * 1,
                    "y" => $y * 1
                ),
                "layers" => $res
            );
        } else {
            return (false);
        }
    }

    function getData($layerObj, $mapObj, $x, $y, $resolution, $allColumns = false)
    {
        $pt = ms_newPointObj();
        $pt->setXY($x, $y);
        if (strtoupper($layerObj->getmetadata("convcaracter")) == "SIM") {
            $convC = function ($texto) {
                return $this->util->iso2utf($texto);
            };
        } else {
            $convC = function ($texto) {
                return $texto;
            };
        }
        $wkt = false;
        if (strtoupper($layerObj->getmetadata("wkttip")) == "SIM") {
            $wkt = true;
        }
        $this->layer->setCon($layerObj);
        $itensLayer = $this->layer->getItens($layerObj, $mapObj);
        $itensParameters = $this->layer->getItensParameters($layerObj, $itensLayer);
        if ($allColumns == true) {
            $itensParameters["tips"] = $itensParameters["itens"];
        }
        $resultado = array();
        $layerObj->set("toleranceunits", MS_PIXELS);
        $layerObj->set("tolerance", $resolution);
        if ($layerObj->connectiontype == MS_WMS) {
            $valori = $this->getDataFromWms($mapObj, $layerObj, $itensParameters, $x, $y);
            $resultado[] = array(
                "values" => $valori,
                "hash" => sha1(serialize($valori))
            );
            //adiciona o item na lista
            if(@$valori["htmlresult"]){
                $itensParameters["itens"] = array("htmlresult");
                $itensParameters["tips"] = array("htmlresult");
            }
        } else {
            if ($layerObj->type == MS_LAYER_RASTER) {
                $wkt = false;
                $ident = @$layerObj->queryByPoint($pt, 0, 0); // 0.01);
            } else {
                $ident = @$layerObj->queryByPoint($pt, 1, - 1); // 0.01);
            }
            if ($ident == MS_SUCCESS) {
                $sopen = $layerObj->open();
                $res_count = $layerObj->getNumresults();
                for ($i = 0; $i < $res_count; ++ $i) {
                    $shape = $layerObj->getShape($layerObj->getResult($i));
                    $conta = 0;
                    $valori = array();
                    foreach ($itensParameters["itens"] as $it) {
                        $val = $convC($shape->values[$it]);
                        $link = $itensParameters["lks"][$conta];
                        foreach ($itensParameters["itens"] as $t) {
                            $valtemp = $shape->values[$t];
                            $busca = '[' . $t . ']';
                            $link = str_replace($busca, $valtemp, $link);
                        }
                        $img = "";
                        if ($itensParameters["locimg"][$conta] != "" && $itensParameters["itemimg"][$conta] != "") {
                            $img = "<img src='" . $itensParameters["locimg"][$conta] . "//" . $shape->values[$itensParameters["itemimg"][$conta]] . "' //>";
                        } else {
                            if ($itensParameters["itemimg"][$conta] != "") {
                                $img = "<img src='" . $shape->values[$itensParameters["itemimg"][$conta]] . "' //>";
                            }
                        }
                        // indica se o item &eacute; tbm uma etiqueta
                        $etiqueta = "nao";
                        if (in_array($it, $itensParameters["tips"])) {
                            $etiqueta = "sim";
                        }
                        if ($allColumns == false && $etiqueta == "nao") {
                            continue;
                        }
                        $arraytemp = array(
                            "column" => $it,
                            "alias" => $this->util->iso2utf($itensParameters["itensdesc"][$conta]),
                            "value" => $val,
                            "link" => $link,
                            "img" => $img,
                            "tip" => $etiqueta
                        );
                        $valori[$it] = $arraytemp;
                        $conta = $conta + 1;
                        if ($wkt == true) {
                            $arraytemp = array(
                                "alias" => "wkt",
                                "value" => $shape->towkt(),
                                "link" => "",
                                "img" => "",
                                "tip" => ""
                            );
                            $valori["wkt"] = $arraytemp;
                        }
                    }
                    $resultado[] = array(
                        "values" => $valori,
                        "hash" => sha1(serialize($valori))
                    );
                }
                $layerObj->close();
            }
        }
        return array(
            "columns" => $itensParameters["itens"],
            "tips" => $itensParameters["tips"],
            "result" => $resultado
        );
    }

    function getDataFromWms($mapObj, $layerObj, $itensParameters, $x, $y)
    {
        $resultado = array();
        $wkt = "nao";
        if ($mapObj->getmetadata("interface") == "googlemaps") {
            $projO = $mapObj->getProjection();
            $mapObj->setProjection($_SESSION["i3GeoProjDefault"]["proj4"]);
        }
        $ptimg = $this->map->xy2pixel($mapObj, $x, $y);
        $formatosinfo = $layerObj->getmetadata("formatosinfo");
        $formatosinfohtml = false;
        if ($formatosinfo != "") {
            $formatosinfo = explode(",", $formatosinfo);
            if ($formatosinfo[0] != "") {
                $formatoinfo = $formatosinfo[0];
            }
            foreach ($formatosinfo as $f) {
                if (strtoupper($f) == "TEXT/PLAIN") {
                    $formatoinfo = "text/plain";
                }
                if (strtoupper($f) == "TEXT/HTML") {
                    $formatosinfohtml = true;
                }
            }
        } else {
            $formatoinfo = $layerObj->getmetadata("wms_feature_info_type");
            if ($formatoinfo == "") {
                $formatoinfo = $layerObj->getmetadata("wms_feature_info_mime_type");
            }
            if ($formatoinfo == "") {
                $formatoinfo = "text/plain";
            }
        }
        $res = $layerObj->getWMSFeatureInfoURL($ptimg->x, $ptimg->y, 50, $formatoinfo);
        $res = str_replace("INFOFORMAT", "INFO_FORMAT", $res);
        $res2 = $layerObj->getWMSFeatureInfoURL($ptimg->x, $ptimg->y, 50, "text/html");
        $res2 = str_replace("INFOFORMAT", "INFO_FORMAT", $res2);
        // retorna a projecao inicial do mapa
        $mapObj->setProjection($projO);
        $registros = array();
        $resposta = file($res); // retorna cada linha da chamada wms
        $firstitem = "";
        foreach ($resposta as $r) {
            // verifica se a linha contem dados
            if (strpos($r, '<?xml') !== false) {
                continue;
            }
            $t = explode("=", $r);
            if (count($t) > 1) {
                $v = str_replace("\\n", "", $t[1]);
                $v = str_replace("\\r", "", $v);
                if (trim($v) != "") {
                    $va = trim($v);
                    if ($firstitem == trim($t[0])) {
                        $firstitem = "";
                        $resultado[] = $registros;
                        $registros = array();
                    }
                    if ($firstitem == "") {
                        $firstitem = trim($t[0]);
                    }
                    $etiqueta = "nao";
                    if (in_array(trim($t[0]), $itensParameters["tips"])) {
                        $etiqueta = "sim";
                    }
                    $d = array(
                        "alias" => trim($t[0]),
                        "column" => trim($t[0]),
                        "value" => trim($va, "'"),
                        "link" => "",
                        "img" => "",
                        "tip" => $etiqueta,
                        "html" => false
                    );
                    $registros[trim($t[0])] = $d;
                }
            }
        }
        // caso esri
        if (count($registros) > 0 && @$registros[0] == "") {
            $resposta = file($res);
            $cabecalho = str_replace('"   "', '"|"', $resposta[0]);
            $cabecalho = explode("|", $cabecalho);
            $linha = str_replace('"  "', '"|"', $resposta[1]);
            $linha = explode("|", $linha);
            for ($i = 0; $i < count($cabecalho); ++ $i) {
                $va = $linha[$i];
                $etiqueta = "nao";
                if (in_array(trim($t[0]), $itensParameters["tips"])) {
                    $etiqueta = "sim";
                }
                $d = array(
                    "alias" => $cabecalho[$i],
                    "column" => $cabecalho[$i],
                    "value" => $va,
                    "link" => "",
                    "img" => "",
                    "tip" => $etiqueta,
                    "html" => false
                );
                $registros[$cabecalho[$i]] = $d;
            }
        }
        // tenta como html
        if (empty($registros)) {
            $resposta = file($res2);
            $d = array(
                "alias" => "",
                "column" => "htmlresult",
                "value" => implode("",$resposta),
                "link" => "",
                "img" => "",
                "tip" => "sim",
                "html" => true
            );
            $registros["htmlresult"] = $d;
        }
        return $registros;
    }

    function format($mapObj, $layers, $resultados)
    {
        $final = array();
        foreach ($layers as $layer) {
            $nometmp = $layer->name;
            if (strtoupper($layer->getMetaData("TEMA")) != "NAO") {
                $nometmp = $layer->getMetaData("TEMA");
            } else if ($layer->getMetaData("ALTTEMA") != "") {
                $nometmp = $layer->getMetaData("ALTTEMA");
            }
            $nometmp = $this->util->iso2utf($nometmp);
            $js = $layer->getMetaData("FUNCOESJS");
            if ($js != "") {
                $funcoesjs = json_decode($this->util->iso2utf($js));
            } else {
                $funcoesjs = false;
            }
            $final[$layer->name] = array(
                "funcoesjs" => $funcoesjs,
                "layerName" => $layer->name,
                "layerTitle" => $nometmp,
                "columns" => $resultados[$layer->name]["columns"],
                "tips" => $resultados[$layer->name]["tips"],
                "data" => $resultados[$layer->name]["result"]
            );
        }
        return $final;
    }
}