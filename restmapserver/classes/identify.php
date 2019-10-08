<?php
namespace restmapserver;

class Identify
{

    function __construct()
    {
        include_once (I3GEOPATH . "/restmapserver/classes/util.php");
        $this->util = new \restmapserver\Util();
        include_once (I3GEOPATH . "/restmapserver/classes/util.php");
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

    function query($mapId, $x, $y, $resolution, $extent = "", $layerNames = "", $wkt = false)
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
            $r = $this->getData($layer->name, $x, $y, $resolution, $wkt);
            $resultados[$layer->name] = array(
                "todosItens" => $r["itensLayer"],
                "tips" => $layer->getmetadata("TIP"),
                "dados" => $r["resultado"]
            );
        }
        if (count($resultados) > 0) {
            $res = $this->format($mapObj, $layers, $x, $y, $resultados);
            return ($res);
        } else {
            return (false);
        }
    }
    function getData($layerObj, $mapObj, $x, $y, $resolution, $wkt = false)
    {
        $pt = ms_newPointObj();
        $pt->setXY($x, $y);
        if (strtoupper($layerObj->getmetadata("convcaracter")) == "NAO") {
            $convC = function ($texto) {
                return $this->util->utf2iso($texto);
            };
        } else {
            $convC = function ($texto) {
                return $texto;
            };
        }
        $this->layer->setCon($layerObj);
        $itensLayer = $this->layer->getItens($layerObj, $mapObj);
        $itensParameters = $this->layer->getItensParameters($layerObj, $itensLayer);
        $resultado = array();
        if ($layer->connectiontype == MS_WMS) {
            $this->getDataFromWms($mapObj, $layerObj, $x, $y);
        } else {
            $layerObj->set("toleranceunits", MS_PIXELS);
            $layerObj->set("tolerance", $resolution);
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
                    $valori = array();
                    $shape = $layerObj->getShape($layerObj->getResult($i));
                    $conta = 0;
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
                        $arraytemp = array(
                            "item" => $it,
                            "alias" => $this->util->utf2iso($itensParameters["itensdesc"][$conta]),
                            "valor" => $val,
                            "link" => $link,
                            "img" => $img,
                            "tip" => $etiqueta
                        );
                        $valori[$it] = $arraytemp;
                        $conta = $conta + 1;
                        if ($wkt == "sim" && strtolower($layerObj->getmetadata("wkttip")) == "sim") {
                            $arraytemp = array(
                                "alias" => "wkt",
                                "valor" => $shape->towkt(),
                                "link" => "",
                                "img" => "",
                                "tip" => ""
                            );
                            $valori["wkt"] = $arraytemp;
                        }
                        $valori["hash"] = sha1(serialize($valori));
                        $resultado[] = $valori;
                    }
                }
                $layerObj->close();
            } else {
                $resultado[] = " ";
            }
        }
        return $resultado;
    }

    function getDataFromWms($mapObj, $layer, $x, $y)
    {
        $resultado = array();
        $wkt = "nao";
        $layer->set("toleranceunits", MS_PIXELS);
        $layer->set("tolerance", $resolucao);
        $mapa = desligatemas($mapa);
        $mapa = desligamargem($mapa);
        $imgo = $mapa->draw();
        $ptimg = xy2imagem($map_file, array(
            $x,
            $y
        ), $mapa);
        // $formatoinfo = "MIME";
        $formatosinfo = $layer->getmetadata("formatosinfo");
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
            $formatoinfo = $layer->getmetadata("wms_feature_info_type");
            if ($formatoinfo == "") {
                $formatoinfo = $layer->getmetadata("wms_feature_info_mime_type");
            }
            if ($formatoinfo == "") {
                $formatoinfo = "text/plain";
            }
        }
        $res = $layer->getWMSFeatureInfoURL($ptimg->x, $ptimg->y, 50, $formatoinfo);
        $res = str_replace("INFOFORMAT", "INFO_FORMAT", $res);
        $res2 = $layer->getWMSFeatureInfoURL($ptimg->x, $ptimg->y, 50, "text/html");
        $res2 = str_replace("INFOFORMAT", "INFO_FORMAT", $res2);
        $registros = array();
        if (strtoupper($formatoinfo) != "TEXT/HTML" && strtoupper($formatoinfo) != "MIME") {
            $resposta = file($res); // retorna cada linha da chamada wms
            $firstitem = "";
            foreach ($resposta as $r) {
                // verifica se a linha contem dados
                $t = explode("=", $r);
                if (count($t) > 1) {
                    $v = str_replace("\\n", "", $t[1]);
                    $v = str_replace("\\r", "", $v);
                    if (trim($v) != "") {
                        $va = trim($v);
                        if ($convC == true) {
                            $va = $this->converte($va);
                        }
                        if ($firstitem == trim($t[0])) {
                            $firstitem = "";
                            $resultado[] = $registros;
                            $registros = array();
                        }
                        if ($firstitem == "") {
                            $firstitem = trim($t[0]);
                        }

                        $etiqueta = "nao";
                        if (in_array(trim($t[0]), $tips)) {
                            $etiqueta = "sim";
                        }
                        $d = array(
                            "alias" => trim($t[0]),
                            "item" => trim($t[0]),
                            "valor" => trim($va, "'"),
                            "link" => "",
                            "img" => "",
                            "tip" => $etiqueta
                        );
                        if ($etip == false) {
                            $registros[] = $d;
                        } else {
                            $registros[trim($t[0])] = $d;
                        }
                    }
                }
            }
            $resultado[] = $registros;
            // caso esri
            if (count($resultado) > 0 && $resultado[0] == "") {
                $resposta = file($res);
                $cabecalho = str_replace('"   "', '"|"', $resposta[0]);
                $cabecalho = explode("|", $cabecalho);

                $linha = str_replace('"  "', '"|"', $resposta[1]);
                $linha = explode("|", $linha);
                for ($i = 0; $i < count($cabecalho); ++ $i) {
                    if ($convC == true) {
                        $va = $this->converte($linha[$i]);
                    } else {
                        $va = $linha[$i];
                    }
                    $etiqueta = "nao";
                    if (in_array(trim($t[0]), $tips)) {
                        $etiqueta = "sim";
                    }
                    $d = array(
                        "alias" => $cabecalho[$i],
                        "item" => $cabecalho[$i],
                        "valor" => $va,
                        "link" => "",
                        "img" => "",
                        "tip" => $etiqueta
                    );
                    if ($etip == false) {
                        $registros[] = $d;
                    } else {
                        $registros[$cabecalho[$i]] = $d;
                    }
                }
                $resultado[] = $registros;
            }
        }
        return $resultado;
    }
    function format($mapObj, $layers, $x, $y, $resultados)
    {
        $final = array();
        foreach ($layers as $layer) {
            $nometmp = $layer->name;
            if (strtoupper($layer->getMetaData("TEMA")) != "NAO") {
                $nometmp = $layer->getMetaData("TEMA");
            } else if ($layer->getMetaData("ALTTEMA") != "") {
                $nometmp = $layer->getMetaData("ALTTEMA");
            }
            $nometmp = $this->converte($nometmp);
            // identificador que marca o tipo de dados que podem ser salvos
            $tiposalva = "";
            // verifica se e editavel
            if ($layer->getmetadata("EDITAVEL") == "SIM") {
                // verifica login
                session_write_close();
                session_name("i3GeoLogin");
                if (! empty($_COOKIE["i3geocodigologin"])) {
                    session_id($_COOKIE["i3geocodigologin"]);
                    session_start();
                    // verifica usuario
                    if ($_SESSION["usuario"] == $_COOKIE["i3geousuariologin"]) {
                        // verifica se e administrador
                        foreach ($_SESSION["papeis"] as $p) {
                            if ($p == 1) {
                                $editavel = "sim";
                            }
                        }
                        // verifica operacao
                        if (! empty($_SESSION["operacoes"]["admin/metaestat/geral"])) {
                            $editavel = "sim";
                        }
                        if ($editavel == "sim") {

                            $editavel = "nao";
                            $id_medida_variavel = $layer->getMetaData("METAESTAT_ID_MEDIDA_VARIAVEL");
                            $colunaidunico = $layer->getMetaData("COLUNAIDUNICO");

                            if ($id_medida_variavel != "" || $codigo_tipo_regiao != "") {
                                include_once (dirname(__FILE__) . "/classe_metaestatinfo.php");
                                $m = new MetaestatInfo();
                                if ($id_medida_variavel != "") {
                                    $medidaVariavel = $m->listaMedidaVariavel("", $id_medida_variavel);
                                    $editavel = $medidaVariavel["colunavalor"];
                                    $tiposalva = "medida_variavel";
                                }
                                if ($codigo_tipo_regiao != "") {
                                    $regiao = $m->listaTipoRegiao($codigo_tipo_regiao);
                                    // todas as colunas podem ser alteradas
                                    $editavel = "todos";
                                    $tiposalva = "regiao";
                                }
                            }
                            // verifica se os parametros de edicao estao disponiveis, pois podem ter sido definidos pelo sistema de administracao
                            if ($layer->getMetaData("ESQUEMATABELAEDITAVEL") != "" && $layer->getMetaData("TABELAEDITAVEL") != "" && $layer->getMetaData("COLUNAIDUNICO") != "") {
                                $editavel = "todos";
                                $tiposalva = "regiao";
                            }
                        }
                    }
                }
            }
            $codigo_tipo_regiao = $layer->getMetaData("METAESTAT_CODIGO_TIPO_REGIAO");
            $funcoesjs = json_decode($this->converte($layer->getMetaData("FUNCOESJS")));
            $final[] = array(
                "funcoesjs" => $funcoesjs,
                "xy" => $xy,
                "tema" => $tema,
                "tiposalva" => $tiposalva,
                "nome" => $nometmp,
                "resultado" => $resultados[$tema],
                "editavel" => $editavel,
                "colunaidunico" => $colunaidunico,
                "id_medida_variavel" => $id_medida_variavel,
                "codigo_tipo_regiao" => $codigo_tipo_regiao
            );
        }
        return $final;
    }
}