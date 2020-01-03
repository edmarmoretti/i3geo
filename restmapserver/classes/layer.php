<?php
namespace restmapserver;

class Layer
{

    function __construct()
    {
        $this->util = new \restmapserver\Util();
    }

    /**
     * Corrige layers do tipo GRID.
     * Bug do mapserver nao permite renderizar grids
     *
     * @param object $layerOrigem
     * @param object $layerDestino
     */
    function fixLayerGrid($layerOrigem, $layerDestino)
    {
        if ($layerOrigem->connectiontype == MS_GRATICULE) {
            ms_newgridobj($layerDestino);
            $layerDestino->grid->set("labelformat", $layerOrigem->grid->labelformat);
            $layerDestino->grid->set("mininterval", $layerOrigem->grid->mininterval);
            $layerDestino->grid->set("maxinterval", $layerOrigem->grid->maxinterval);
            $layerDestino->grid->set("minsubdivide", $layerOrigem->grid->minsubdivide);
            $layerDestino->grid->set("maxsubdivide", $layerOrigem->grid->maxsubdivide);
            $layerDestino->grid->set("minarcs", $layerOrigem->grid->minarcs);
            $layerDestino->grid->set("maxarcs", $layerOrigem->grid->maxarcs);
        }
    }

    /**
     * Importa os simbolos inline de um layer de um mapfile para outro mapfile
     *
     * @param
     *            object map que contem o layer layern
     * @param
     *            object layer que contem o simbolo original
     * @param
     *            object mapa destino do simbolo clonado
     */
    function cloneInlineSymbol($nmapa, $layern, $mapObj)
    {
        $numclasses = $layern->numclasses;
        for ($ci = 0; $ci < $numclasses; $ci ++) {
            $classe = $layern->getclass($ci);
            $numestilos = $classe->numstyles;
            for ($ei = 0; $ei < $numestilos; $ei ++) {
                $estilo = $classe->getstyle($ei);
                if ($estilo->symbolname != "") {
                    $nomesimbolo = $estilo->symbolname;
                    $simbolo = $nmapa->getSymbolObjectById($nmapa->getSymbolByName($nomesimbolo));
                    if ($simbolo->inmapfile == MS_TRUE || file_exists($nomesimbolo)) {
                        $simbolon = new symbolObj($mapObj, $nomesimbolo);
                        $simbolon->set("inmapfile", MS_TRUE);
                        $simbolon->setImagePath($simbolo->imagepath);
                        $simbolon->setPoints($simbolo->getPointsArray());
                        $simbolon->set("type", $simbolo->type);
                        $simbolon->set("character", $simbolo->character);
                        $simbolon->set("filled", $simbolo->filled);
                        $simbolon->set("sizex", $simbolo->sizex);
                        $simbolon->set("sizey", $simbolo->sizey);
                        $simbolon->set("transparent", $simbolo->transparent);
                        $simbolon->set("transparentcolor", $simbolo->transparentcolor);
                    }
                }
            }
        }
    }

    /**
     * Verifica se um layer pode fornecer os atributos
     *
     * @param object $layerObj
     * @return boolean
     */
    function getAttributesIsValid($layerObj)
    {
        if ($layerObj == "") {
            return false;
        }
        if ($layerObj->connectiontype == MS_GRATICULE) {
            return false;
        }
        if (strtolower($layerObj->getmetadata("identifica")) == "nao") {
            return false;
        }
        if (strtolower($layerObj->getmetadata("CLASSE")) == "nao") {
            return false;
        }
        if (strtolower($layerObj->getmetadata("TEMA")) == "nao") {
            return false;
        }
        if ($layerObj->getmetadata("PLUGINI3GEO") != "") {
            $teste = json_decode($layerObj->getmetadata("PLUGINI3GEO"), true);
            if ($teste["plugin"] == "layergeojson") {
                return false;
            }
        }
        if ($layerObj->connectiontype != MS_WMS) {
            $this->setCon($layerObj);
            $sopen = $layerObj->open();
            $this->hiddeCon($layerObj);
            $layerObj->close();
            if ($sopen == MS_FAILURE) {
                return false;
            }
        }
        return true;
    }

    /**
     * Define a extensao geografica de um mapa
     *
     * @param object $mapObj
     * @param boolean|string $extent
     */
    function setMapExtent($mapObj, $extent = false)
    {
        if(!$mapObj){
            return false;
        }
        if ($extent) {
            $extmapa = $mapObj->extent;
            $e = explode(",", str_replace(" ", ",", $extent));
            $mapObj->setextent((min($e[0], $e[2])), (min($e[1], $e[3])), (max($e[0], $e[2])), (max($e[1], $e[3])));
        }
        return $mapObj->extent;
    }

    /**
     * Altera os parametros do layer para permitir query
     *
     * @param object $layerObj
     */
    function ativateQuery($layerObj)
    {
        $layerObj->set("status", MS_DEFAULT);
        $layerObj->set("template", "none.htm");
    }

    /**
     * Obtem os parametros dos itens com base nos metadados do layer
     *
     * @param object $layerObj
     * @param object $itensLayer
     * @param boolean $onlyTips
     * @return array
     */
    function getItensParameters($layerObj, $itensLayer, $onlyTips = false)
    {
        // se o usuario estiver logado e o tema for editavel, a lista de itens
        // nao usa os alias para permitir a edicao dos dados
        if (! empty($_COOKIE["i3geocodigologin"]) && $layerObj->getmetadata("EDITAVEL") == "SIM") {
            $itens = "";
            $itensdesc = "";
            $lks = "";
            $itemimg = "";
            $locimg = "";
        } else {
            $itens = $layerObj->getmetadata("ITENS"); // itens
            $itensdesc = $layerObj->getmetadata("ITENSDESC"); // descri&ccedil;&atilde;o dos itens
            $lks = $layerObj->getmetadata("ITENSLINK"); // link dos itens
            $itemimg = $layerObj->getmetadata("ITEMIMG"); // indica um item que ser&aacute; utilizado para colocar um &iacute;cone
            $locimg = $layerObj->getmetadata("IMGLOC"); // indica o local onde est&atilde;o os &iacute;cones
        }
        $tips = $layerObj->getmetadata("TIP");
        // $nitens = count($itensLayer);
        if ($itens == "") {
            $itens = $itensLayer;
        } else {
            $itens = explode(",", $itens);
        }
        if ($itensdesc == "") {
            $itensdesc = $itens;
        } else {
            $itensdesc = explode(",", $itensdesc);
        }
        if ($lks == "") {
            $lks = array_fill(0, count($itens), '');
        } else {
            $lks = explode(",", $lks);
        }
        if ($itemimg == "") {
            $itemimg = array_fill(0, count($itens), '');
        } else {
            $itemimg = explode(",", $itemimg);
        }
        if ($locimg == "") {
            $locimg = array_fill(0, count($itens), '');
        } else {
            $locimg = explode(",", $locimg);
        }
        if ($tips == "allitens") {
            $tips = implode(",", $itens);
        }
        $tips = str_replace(" ", ",", $tips);
        $tips = explode(",", $tips);
        // o retorno deve ser do tipo TIP
        if ($onlyTips == true) {
            $itensMetadata = $itens;
            $temp = array_combine($itens, $itensdesc);
            $templ = array_combine($itens, $lks);
            $tempimg = array_combine($itens, $itemimg);
            $temploc = array_combine($itens, $locimg);
            $itensdesc = array();
            // se o usuario estiver logado e o tema for editavel, a lista de itens
            // nao usa os alias para permitir a edicao dos dados
            if (! empty($_COOKIE["i3geocodigologin"]) && $layerObj->getmetadata("EDITAVEL") == "SIM") {
                $itens = "";
                $itensdesc = "";
                $lks = "";
                $itemimg = "";
                $locimg = "";
            } else {
                $itens = $layerObj->getmetadata("ITENS"); // itens
                $itensdesc = $layerObj->getmetadata("ITENSDESC"); // descri&ccedil;&atilde;o dos itens
                $lks = $layerObj->getmetadata("ITENSLINK"); // link dos itens
                $itemimg = $layerObj->getmetadata("ITEMIMG"); // indica um item que ser&aacute; utilizado para colocar um &iacute;cone
                $locimg = $layerObj->getmetadata("IMGLOC"); // indica o local onde est&atilde;o os &iacute;cones
            }
            $tips = $layerObj->getmetadata("TIP");
            // $nitens = count($itensLayer);
            if ($itens == "") {
                $itens = $itensLayer;
            } else {
                $itens = explode(",", $itens);
            }
            if ($itensdesc == "") {
                $itensdesc = $itens;
            } else {
                $itensdesc = explode(",", $itensdesc);
            }
            if ($lks == "") {
                $lks = array_fill(0, count($itens), '');
            } else {
                $lks = explode(",", $lks);
            }
            if ($itemimg == "") {
                $itemimg = array_fill(0, count($itens), '');
            } else {
                $itemimg = explode(",", $itemimg);
            }
            if ($locimg == "") {
                $locimg = array_fill(0, count($itens), '');
            } else {
                $locimg = explode(",", $locimg);
            }
            if ($tips == "allitens") {
                $tips = implode(",", $itens);
            }
            $tips = str_replace(" ", ",", $tips);
            $tips = explode(",", $tips);
            if ($onlyTips == true) {
                $itensMetadata = $itens;
                $temp = array_combine($itens, $itensdesc);
                $templ = array_combine($itens, $lks);
                $tempimg = array_combine($itens, $itemimg);
                $temploc = array_combine($itens, $locimg);
                $itensdesc = array();
                $itens = array();
                $lks = array();
                $itemimg = array();
                $locimg = array();
                foreach ($itensLayer as $t) {
                    if (in_array($t, $itensMetadata)) {
                        $itens[] = $t;
                        if ($temp[$t] != "") {
                            $itensdesc[] = $temp[$t];
                        } else {
                            $itensdesc[] = $t;
                        }
                        if ($templ[$t] != "") {
                            $lks[] = $templ[$t];
                        } else {
                            $lks[] = "";
                        }
                        if ($tempimg[$t] != "") {
                            $itemimg[] = $tempimg[$t];
                        } else {
                            $itemimg[] = "";
                        }
                        if ($temploc[$t] != "") {
                            $locimg[] = $temploc[$t];
                        } else {
                            $locimg[] = "";
                        }
                    }
                }
            }
            $itens = array();
            $lks = array();
            $itemimg = array();
            $locimg = array();
            foreach ($itensLayer as $t) {
                if (in_array($t, $itensMetadata)) {
                    $itens[] = $t;
                    if ($temp[$t] != "") {
                        $itensdesc[] = $temp[$t];
                    } else {
                        $itensdesc[] = $t;
                    }
                    if ($templ[$t] != "") {
                        $lks[] = $templ[$t];
                    } else {
                        $lks[] = "";
                    }
                    if ($tempimg[$t] != "") {
                        $itemimg[] = $tempimg[$t];
                    } else {
                        $itemimg[] = "";
                    }
                    if ($temploc[$t] != "") {
                        $locimg[] = $temploc[$t];
                    } else {
                        $locimg[] = "";
                    }
                }
            }
        }
        if ($layerObj->connectiontype == MS_WMS) {
            $tips = $itens;
        }
        return array(
            "itens" => $itens,
            "lks" => $lks,
            "itemimg" => $itemimg,
            "locimg" => $locimg,
            "tips" => $tips,
            "itensdesc" => $itensdesc
        );
    }

    /**
     * Obtem as colunas da tabela de atributos de um layer
     *
     * @param object $layerObj
     * @param object|boolean $mapObj
     * @return array
     */
    function getItens($layerObj, $mapObj = false)
    {
        $items = array();
        if ($layerObj->connectiontype == 7) {
            $url = $layerObj->connection;
            $temp = explode("?", $url);
            if (count($temp) == 1) {
                $url .= "?";
            }
            $url = $url . "&SERVICE=wfs&VERSION=1.1.0&REQUEST=DescribeFeatureType&TYPENAME=" . $layerObj->getmetadata("wms_name");
            // $url = "http://ogi.state.ok.us/geoserver/wfs?VERSION=1.1.0&REQUEST=DescribeFeatureType&TYPENAME=okcounties";
            // echo $url;exit;
            $xml = simplexml_load_file($url);
            if ($xml == false) {
                return array();
            }
            $dom = new \DOMDocument();
            $dom->loadXML($xml->asxml());
            $sequences = $dom->getElementsByTagName("sequence");

            foreach ($sequences as $sq) {
                $services = $sq->getElementsByTagName("element");
                foreach ($services as $s) {
                    $items[] = $s->getAttribute("name");
                }
            }
        } else {
            if ($layerObj->type == MS_LAYER_RASTER && $mapObj) {
                $pt = ms_newPointObj();
                $pt->setXY($mapObj->extent->minx + (($mapObj->extent->maxx - $mapObj->extent->minx) / 2), $mapObj->extent->miny + (($mapObj->extent->maxy - $mapObj->extent->miny) / 2));
                $layerObj->queryByPoint($pt, 0, 0);
            }
            $sopen = $layerObj->open();
            if ($sopen != MS_FAILURE) {
                $items = $layerObj->getItems();
            } else {
                $items = array();
            }
            if ($layerObj->type == MS_LAYER_RASTER) {
                $items[] = "pixel";
            }
            $layerObj->close();
        }
        return $items;
    }

    function getDataFromQuery($layerObj, $itensParameters, $wkt = false)
    {
        if (strtoupper($layerObj->getmetadata("convcaracter")) == "NAO") {
            $convert = function ($text) {
                return $this->util->iso2utf($text);
            };
        } else {
            $convert = function ($text) {
                return $text;
            };
        }
        $sopen = $layerObj->open();
        if ($sopen == MS_FAILURE) {
            return false;
        }
        $res_count = $layerObj->getNumresults();
        for ($i = 0; $i < $res_count; ++ $i) {
            $valori = array();
            $shape = $layerObj->getShape($layerObj->getResult($i));
            $conta = 0;
            foreach ($itensParameters["itens"] as $it) {
                $val = $shape->values[$it];
                $val = $convert($val);
                $link = $itensParameters["lks"][$conta];
                foreach ($itensParameters['itens'] as $t) {
                    $valtemp = $shape->values[$t];
                    $busca = '[' . $t . ']';
                    $link = str_replace($busca, $valtemp, $link);
                }
                $img = "";
                if ($itensParameters["locimg"][$conta] != "" && $itensParameters["itemimg"][$conta] != "") {
                    $img = "<img src='" . $itensParameters["locimg"][$conta] . "//" . $shape->values[$itensParameters["itemimg"][$conta]] . "' //>";
                } else {
                    if ($itensParameters['itemimg'][$conta] != "") {
                        $img = "<img src='" . $shape->values[$itensParameters["itemimg"][$conta]] . "' //>";
                    }
                }
                // indica se o item &eacute; tbm uma etiqueta
                $etiqueta = "nao";
                if (in_array($it, $itensParameters["tips"])) {
                    $etiqueta = "sim";
                }
                $arraytemp = array(
                    "item" => $it,
                    "alias" => $convert($itensParameters["itensdesc"][$conta]),
                    "valor" => $val,
                    "link" => $link,
                    "img" => $img,
                    "tip" => $etiqueta
                );
                $valori[$it] = $arraytemp;
                $conta = $conta + 1;
            }
            if ($wkt == true) {
                $arraytemp = array(
                    "alias" => "wkt",
                    "valor" => $shape->towkt(),
                    "link" => "",
                    "img" => "",
                    "tip" => ""
                );
                $valori["wkt"] = $arraytemp;
            }
            $valori["tema"] = $layerObj->name;
            $valori["titulo"] = $this->util->txt2utf($layerObj->getmetadata("tema"));
            $valori["hash"] = sha1(serialize($valori));
            $resultado[] = $valori;
        }
        $layerObj->close();
        return $resultado;
    }

    function queryByrect($mapObj, $layerName, $wkt = false, $extent = false)
    {
        if(!$mapObj){
            return false;
        }
        $layer = $mapObj->getLayerByname($layerName);
        if ($this->getAttributesIsValid($layer) == false) {
            return false;
        }
        $this->setCon($layer);
        $rectObj = $this->setMapExtent($mapObj, $extent);
        $this->ativateQuery($layer);
        $itensLayer = $this->getItens($layer, $mapObj);
        $itensParameters = $this->getItensParameters($layer, $itensLayer);
        $result = @$layer->queryByRect($rectObj);
        $this->hiddeCon($layer);
        if ($result == MS_SUCCESS) {
            return $this->getDataFromQuery($layer, $itensParameters, $wkt);
        } else {
            return false;
        }
    }

    function searchColumn($mapObj, $layerObj, $search, $column, $extent)
    {
        if(!$mapObj){
            return false;
        }
        if (strtoupper($layerObj->getmetadata("convcaracter")) == "SIM") {
            $convC = function ($texto) {
                return $this->util->iso2utf($texto);
            };
        } else {
            $convC = function ($texto) {
                return $texto;
            };
        }
        $this->ativateQuery($layerObj);
        $itensLayer = $this->getItens($layerObj);
        $itensParameters = $this->getItensParameters($layerObj, $itensLayer);
        $keys = array_combine($itensParameters["itens"], $itensParameters["itensdesc"]);
        $columnTitle = $column;
        if ($keys[$column]) {
            $columnTitle = $keys[$column];
        }
        $this->setCon($layerObj);
        $rectObj = $this->setMapExtent($mapObj, $extent);
        $result = @$layerObj->queryByRect($rectObj);
        $this->hiddeCon($layerObj);

        $resultado = array();
        $registers = array();
        if ($result == MS_SUCCESS) {
            $search = $this->util->remove_accents(strtolower($search));
            $layerObj->open();
            $res_count = $layerObj->getNumresults();
            for ($i = 0; $i < $res_count; ++ $i) {
                $shapeObj = $layerObj->getShape($layerObj->getResult($i));
                $valor = trim($shapeObj->values[$column]);
                $valorSemAcento = $this->util->remove_accents(strtolower($valor));
                if (stristr($valorSemAcento, $search)) {
                    $registers[] = array(
                        "box" => $this->shapeExtent($mapObj, $layerObj, $shapeObj),
                        "value" => $convC($valor)
                    );
                }
            }
            $resultado = array(
                "layerName" => $layerObj->name,
                "layerTitle" => $this->util->iso2utf($layerObj->getmetadata("tema")),
                "columnTitle" => $this->util->iso2utf($columnTitle),
                "column" => $column,
                "data" => $registers
            );
        }
        return ($resultado);
    }

    function setCon($layerObj)
    {
        if ($layerObj->connectiontype == MS_POSTGIS) {
            $lcon = $layerObj->connection;
            if (($lcon == " ") || ($lcon == "") || (in_array($lcon, array_keys($_SESSION["postgis_mapa"])))) {
                //
                // o metadata CONEXAOORIGINAL guarda o valor original para posterior substitui&ccedil;&atilde;o
                //
                $layerObj->set("connection", $_SESSION["postgis_mapa"][$lcon]);
                $layerObj->setmetadata("CONEXAOORIGINAL", $lcon);
            }
        }
    }

    function hiddeCon($objLayer)
    {
        if ($objLayer->connectiontype == MS_POSTGIS) {
            $objLayer->set("connection", $objLayer->getmetadata("CONEXAOORIGINAL"));
        }
    }

    function moveUp($mapObj, $layerName)
    {
        if(!$mapObj){
            return false;
        }
        $layerObj = $mapObj->getLayerByname($layerName);
        $qyfile = str_replace(".map", ".qy", $_SESSION["map_file"]);
        if (file_exists($qyfile)) {
            unlink($qyfile);
        }
        $nl = $mapObj->numlayers;
        $mover = 1;
        $indice = $layerObj->index;
        if ($indice < ($nl - 1)) {
            $conta = $indice + 1;
            $tmpl = $mapObj->getlayer($conta);
            if (($tmpl->getmetadata("escondido") != "")) {
                $mover = $mover + 1;
                $conta = $conta + 1;
            }
            $tmpl = $mapObj->getlayer($conta);
            if (($tmpl->group) != "") {
                $gr = $tmpl->group;
                $conta = $conta + 1;
                $tmpl = $mapObj->getlayer($conta);
                while ($gr == $tmpl->group) {
                    $mover = $mover + 1;
                    $conta = $conta + 1;
                    $tmpl = $mapObj->getlayer($conta);
                }
            }
        }
        for ($i = 0; $i < $mover; ++ $i) {
            $moveu = $mapObj->moveLayerDown($indice);
        }
        $mapObj->save($_SESSION["map_file"]);
        return true;
    }

    function moveDown($mapObj, $layerName)
    {
        if(!$mapObj){
            return false;
        }
        $layerObj = $mapObj->getLayerByname($layerName);
        $qyfile = str_replace(".map", ".qy", $_SESSION["map_file"]);
        if (file_exists($qyfile)) {
            unlink($qyfile);
        }
        $nl = $mapObj->numlayers;
        $mover = 1;
        $indice = $layerObj->index;
        if ($indice < $nl) {
            $conta = $indice - 1;
            $tmpl = $mapObj->getlayer($conta);
            if (($tmpl->getmetadata("escondido") != "")) {
                $mover = $mover + 1;
                $conta = $conta - 1;
            }
            $tmpl = $mapObj->getlayer($conta);
            if (($tmpl->group) != "") {
                $gr = $tmpl->group;
                $conta = $conta - 1;
                $tmpl = $mapObj->getlayer($conta);
                while ($gr == $tmpl->group) {
                    $mover = $mover + 1;
                    $conta = $conta - 1;
                    $tmpl = $mapObj->getlayer($conta);
                }
            }
        }
        for ($i = 0; $i < $mover; ++ $i) {
            $moveu = $mapObj->moveLayerUp($indice);
        }
        $mapObj->save($_SESSION["map_file"]);
        return true;
    }
    function shapeExtent($mapObj, $layerObj, $shapeObj)
    {
        if(!$mapObj){
            return false;
        }
        $prjMapa = $mapObj->getProjection();
        $prjTema = $layerObj->getProjection();
        $ret = $shapeObj->bounds;
        //
        // verifica se o retangulo est&aacute; ou n&atilde;o em coordenadas geogr&aacute;ficas
        //
        if ($ret->minx > 180 || $ret->minx < - 180) {
            // reprojeta o retangulo
            if (($prjTema != "") && ($prjMapa != $prjTema)) {
                $projInObj = ms_newprojectionobj($prjTema);
                $projOutObj = ms_newprojectionobj($prjMapa);
                $ret->project($projInObj, $projOutObj);
            }
        }
        $ext = $ret->minx . " " . $ret->miny . " " . $ret->maxx . " " . $ret->maxy;
        if (($shapeObj->type == MS_SHP_POINT) || ($shapeObj->type == 0)) {
            $minx = $ret->minx;
            $minx = $minx - 0.03;
            $maxx = $ret->maxx;
            $maxx = $maxx + 0.03;
            $miny = $ret->miny;
            $miny = $miny - 0.03;
            $maxy = $ret->maxy;
            $maxy = $maxy + 0.03;
            $ext = $minx . " " . $miny . " " . $maxx . " " . $maxy;
        }
        return $ext;
    }

    function toggleStatusClass($mapObj, $layerName, $classIds)
    {
        if(!$mapObj){
            return false;
        }
        $layerObj = $mapObj->getLayerByname($layerName);
        $classIds = explode(",", str_replace(" ", ",", $classIds));
        foreach($classIds as $classId){
            $classObj = $layerObj->getclass($classId);
            $status = $classObj->status;
            if ($status == MS_OFF) {
                $classObj->set("status", MS_ON);
                if ($layerObj->type == 3) {
                    $styleObj = $classObj->getstyle(0);
                    $styleObj->set("opacity", 100);
                }
            } else {
                $classObj->set("status", MS_OFF);
                if ($layerObj->type == 3) {
                    $styleObj = $classObj->getstyle(0);
                    $styleObj->set("opacity", 0);
                }
            }
            $layerObj->setMetaData("cache", "");
        }
        $mapObj->save($_SESSION["map_file"]);
        return true;
    }

    function zoomSel($mapObj, $layerName)
    {
        if(!$mapObj){
            return false;
        }
        $layerObj = $mapObj->getLayerByname($layerName);
        if($mapObj->getmetadata("interface") == "googlemaps"){
            $projO = $mapObj->getProjection();
            $projecao = $this->util->getDefaultProjection("epsg");
            $mapObj->setProjection("init=epsg:".$projecao);
        }
        $extatual = $mapObj->extent;
        $prjMapa = $mapObj->getProjection();
        $prjTema = $layerObj->getProjection();
        $xmin = array();
        $xmax = array();
        $ymin = array();
        $ymax = array();
        $shapes = $this->getSelectedShapes($layerObj,$mapObj);
        $xmin = array();
        $xmax = array();
        $ymin = array();
        $ymax = array();
        foreach($shapes as $shape)
        {
            $bound = $shape->bounds;
            $xmin[] = $bound->minx;
            $xmax[] = $bound->maxx;
            $ymin[] = $bound->miny;
            $ymax[] = $bound->maxy;
        }
        $ret = ms_newRectObj();
        $ret->set("minx",min($xmin));
        $ret->set("miny",min($ymin));
        $ret->set("maxx",max($xmax));
        $ret->set("maxy",max($ymax));
        if (($prjTema != "") && ($prjMapa != $prjTema))
        {
            $projInObj = ms_newprojectionobj($prjTema);
            $projOutObj = ms_newprojectionobj($prjMapa);
            $ret->project($projInObj, $projOutObj);
        }
        $extatual->setextent($ret->minx,$ret->miny,$ret->maxx,$ret->maxy);
        if($mapObj->getmetadata("interface") == "googlemaps"){
            $mapObj->setProjection($projO);
        }
        $e = $mapObj->extent;
        $ext = $e->minx . " " . $e->miny . " " . $e->maxx . " " . $e->maxy;
        return($ext);
    }

    function getSelectedShapes($objLayer, $objMapa)
    {
        $shapes = array();
        $qyfile = dirname($_SESSION["map_file"]) . "/" . $objLayer->name . "_qy.map";
        if (! file_exists($qyfile)) {
            return $shapes;
        }
        $handle = fopen($qyfile, "r");
        $conteudo = fread($handle, filesize($qyfile));
        fclose($handle);
        $listaDeIndices = unserialize($conteudo);
        if (count($listaDeIndices) == 0) {
            return $shapes;
        }
        if ($objLayer->connectiontype != MS_POSTGIS) {
            $this->loadQuery($objLayer, $objMapa);
            $sopen = $objLayer->open();
            $res_count = $objLayer->getNumresults();
            $centroides = array();
            $shapes = array();
            for ($i = 0; $i < $res_count; ++ $i) {
                $shape = $objLayer->getShape($objLayer->getResult($i));
                $shp_index = $shape->index;
                $shapes[] = $shape;
            }
            $fechou = $objLayer->close();
        } else {
            $rect = ms_newRectObj();
            $rect->set("minx", - 180);
            $rect->set("miny", - 90);
            $rect->set("maxx", 180);
            $rect->set("maxy", 90);
            $status = $objLayer->open();
            $status = $objLayer->whichShapes($rect);
            while ($shape = $objLayer->nextShape()) {
                if (in_array($shape->index, $listaDeIndices)) {
                    $shapes[] = $shape;
                }
            }
            $objLayer->close();
        }
        return $shapes;
    }

    function loadQuery($objlayer, &$objmapa)
    {
        $qyfile = dirname($_SESSION["map_file"]) . "/" . $objlayer->name . "_qy.map";
        if (file_exists($qyfile)) {
            $indxlayer = $objlayer->index;
            $handle = fopen($qyfile, "r");
            $conteudo = fread($handle, filesize($qyfile));
            fclose($handle);
            $shp = unserialize($conteudo);
            foreach ($shp as $indx) {
                $objmapa->querybyindex($indxlayer, - 1, $indx, MS_TRUE);
            }
            return true;
        }
        return false;
    }
}