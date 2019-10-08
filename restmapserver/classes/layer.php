<?php
namespace restmapserver;

class Layer
{

    function __construct()
    {
        include_once (I3GEOPATH . "/restmapserver/classes/util.php");
        $this->util = new \restmapserver\Util();
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
        if (strtolower($layerObj->getmetadata("identifica")) == "nao") {
            return false;
        }
        if (strtolower($layerObj->getmetadata("CLASSE")) == "nao") {
            return false;
        }
        if (strtolower($layerObj->getmetadata("TEMA")) == "nao") {
            return false;
        }
        if ($layerObj->connectiontype != MS_WMS) {
            $this->setCon($layerObj);
            $sopen = $layerObj->open();
            $this->hiddeCon($layerObj);
            if ($sopen == MS_FAILURE) {
                return false;
            }
            $layerObj->close();
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
        //$nitens = count($itensLayer);
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
            //$nitens = count($itensLayer);
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
            $dom = new DOMDocument();
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
                return $this->util->utf2iso($text);
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

    function queryByrect($mapId, $layerName, $wkt = false, $extent = false)
    {
        if ($this->open($mapId) == false) {
            return false;
        }
        $mapObj = ms_newMapObj($_SESSION["map_file"]);

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
    function setCon($layerObj){
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
    function hiddeCon($objLayer){
        if ($objLayer->connectiontype == MS_POSTGIS) {
            $objLayer->set("connection", $objLayer->getmetadata("CONEXAOORIGINAL"));
        }
    }
    function moveUp($mapId, $layerName)
    {
        if ($this->open($mapId) == false) {
            return false;
        }
        $mapObj = ms_newMapObj($_SESSION["map_file"]);
        $layerObj = $mapObj->getLayerByname($layerName);
        $qyfile = str_replace(".map", ".qy", $_SESSION["map_file"]);
        if (file_exists($qyfile)){
            unlink ($qyfile);
        }
        $nl = $mapObj->numlayers;
        $mover = 1;
        $indice = $layerObj->index;
        if ($indice < ($nl - 1))
        {
            $conta = $indice + 1;
            $tmpl = $mapObj->getlayer($conta);
            if (($tmpl->getmetadata("escondido") != ""))
            {
                $mover = $mover + 1;
                $conta = $conta + 1;
            }
            $tmpl = $mapObj->getlayer($conta);
            if (($tmpl->group) <> "")
            {
                $gr = $tmpl->group;
                $conta = $conta + 1;
                $tmpl = $mapObj->getlayer($conta);
                while($gr == $tmpl->group)
                {
                    $mover= $mover + 1;
                    $conta = $conta + 1;
                    $tmpl = $mapObj->getlayer($conta);
                }
            }
        }
        for ($i=0;$i<$mover;++$i){
            $moveu = $mapObj->moveLayerDown($indice);
        }
        $mapObj->save($_SESSION["map_file"]);
        return true;
    }
    function moveDown($mapId, $layerName)
    {
        if ($this->open($mapId) == false) {
            return false;
        }
        $mapObj = ms_newMapObj($_SESSION["map_file"]);
        $layerObj = $mapObj->getLayerByname($layerName);
        $qyfile = str_replace(".map", ".qy", $_SESSION["map_file"]);
        if (file_exists($qyfile)){
            unlink ($qyfile);
        }
        $nl = $mapObj->numlayers;
        $mover = 1;
        $indice = $layerObj->index;
        if ($indice < $nl)
        {
            $conta = $indice - 1;
            $tmpl = $mapObj->getlayer($conta);
            if (($tmpl->getmetadata("escondido") != ""))
            {
                $mover = $mover + 1;
                $conta = $conta - 1;
            }
            $tmpl = $mapObj->getlayer($conta);
            if (($tmpl->group) <> "")
            {
                $gr = $tmpl->group;
                $conta = $conta - 1;
                $tmpl = $mapObj->getlayer($conta);
                while($gr == $tmpl->group)
                {
                    $mover= $mover + 1;
                    $conta = $conta - 1;
                    $tmpl = $mapObj->getlayer($conta);
                }
            }
        }
        for ($i=0;$i<$mover;++$i){
            $moveu = $mapObj->moveLayerUp($indice);
        }
        $mapObj->save($_SESSION["map_file"]);
        return true;
    }
}