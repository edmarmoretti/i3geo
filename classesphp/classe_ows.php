<?php

class Ows
{

    public $locaplic;

    public $server;

    public $i3geo_proxy_server;

    public $dir_tmp;

    function __construct($server)
    {
        include (dirname(__FILE__) . "/../ms_configura.php");
        error_reporting(0);
        if (! function_exists('ms_newMapObj')) {
            return false;
        }
        include ($locaplic . "/funcoes_gerais.php");
        $this->locaplic = $locaplic;
        $this->server = $server;
        $this->i3geo_proxy_server = $i3geo_proxy_server;
        $this->dir_tmp = $dir_tmp;
        $teste = explode("=", $this->server);
        if (count($teste) > 1) {
            $this->server = $this->server . "&";
        } else {
            $teste = explode("?", $this->server);
            if (count($teste) == 1) {
                $this->server = $this->server . "?";
            }
        }
    }
    function getLayersARCGISREST(){
        $curl = curl_init ();
        curl_setopt ( $curl, CURLOPT_URL, $this->server."&f=json" );
        curl_setopt ( $curl, CURLOPT_RETURNTRANSFER, 1 );
        curl_setopt ( $curl, CURLOPT_HEADER, 0 );
        if (isset ( $this->i3geo_proxy_server ) && $this->i3geo_proxy_server != "") {
            curl_setopt ( $curl, CURLOPT_PROXY, $this->i3geo_proxy_server );
        }
        $list = curl_exec ( $curl );
        curl_close ( $curl );
        return $list;
    }
    function getLayersWMS($nivel, $id_ws, $tipo_ws, $nomelayer = "")
    {
        // para o caso do sistema de metadados estatisticos
        $wms_capabilities = $this->getWmsGetCapabilities();
        $dom = new DomDocument();
        $dom->loadXML($wms_capabilities);
        $xpath = new DOMXPath($dom);
        $q = '//WMT_MS_Capabilities/Capability';
        $res = array();
        if ($nomelayer != "" && $nomelayer != "undefined") {
            for ($i = 0; $i < $nivel - 1; ++ $i) {
                $q .= "/Layer";
            }
            $layersanteriores = $xpath->query($q);
            foreach ($layersanteriores as $layeranterior) {
                $r1 = $this->getTag($layeranterior);
                if ($r1["nome"] == $nomelayer || $r1["titulo"] == $nomelayer) {
                    $layers = $xpath->query('Layer', $layeranterior);
                    foreach ($layers as $layer) {
                        $r = $this->getTag($layer);
                        if (! $r["nome"]) {
                            $r["nome"] = $r["titulo"];
                        }
                        $res[] = array(
                            "nome" => $r["nome"],
                            "titulo" => $r["titulo"],
                            "estilos" => $r["estilos"],
                            "srs" => $this->getSrs($dom),
                            "formats" => $this->getFormats($dom),
                            "version" => $this->getVersion($dom),
                            "formatsinfo" => $this->getFormatsinfo($dom)
                        );
                    }
                    if ($layers->length == 0) {
                        $res[] = array(
                            "nome" => $r1["nome"],
                            "titulo" => $r1["titulo"],
                            "estilos" => (array(
                                array(
                                    "nome" => "default",
                                    "titulo" => "default"
                                )
                            )),
                            "srs" => $this->getSrs($dom),
                            "formats" => $this->getFormats($dom),
                            "version" => $this->getVersion($dom),
                            "formatsinfo" => $this->getFormatsinfo($dom)
                        );
                    }
                }
            }
        } else {
            //
            // pega os layers no primeiro n&iacute;vel
            //
            $q .= "/Layer";
            $layers = $xpath->query($q);
            $res = array();
            foreach ($layers as $layer) {
                $r = $this->getTag($layer);
                // var_dump($r);
                if (! $r["nome"]) {
                    $r["nome"] = $r["titulo"];
                }
                if (array_search("Style", $r["tags"]) || array_search("Layer", $r["tags"])) {
                    $res[] = array(
                        "nome" => $r["nome"],
                        "titulo" => $r["titulo"],
                        "estilos" => $r["estilos"],
                        "srs" => $this->getSrs($dom),
                        "formats" => $this->getFormats($dom),
                        "version" => $this->getVersion($dom),
                        "formatsinfo" => $this->getFormatsinfo($dom)
                    );
                }
            }
        }
        return ($res);
    }
    function getFormatsinfo($dom) {
        $xpath = new DOMXPath ( $dom );
        $query = '//WMT_MS_Capabilities/Capability/Request/GetFeatureInfo/Format';
        $entries = $xpath->query ( $query );
        if ($entries == FALSE || $entries->length == 0) {
            $teste = $xpath->registerNamespace ( "tag", "http://www.opengis.net/wms" );
            $q = '/tag:WMS_Capabilities/tag:Capability/tag:Request/tag:GetCapabilities/tag:Format';
            $entries = $xpath->query ( $q );
        }
        $arr = array ();
        foreach ( $entries as $entry ) {
            $arr [] = $entry->nodeValue;
        }
        return $arr;
    }
    function getVersion($dom) {
        $n = $dom->getElementsByTagName ( 'WMT_MS_Capabilities' );
        $params = $dom->getElementsByTagName ( '*' );
        foreach ( $params as $param ) {
            $v = $param->getAttribute ( 'version' );
            break;
        }
        return $v;
    }
    function getFormats($dom) {
        $xpath = new DOMXPath ( $dom );
        $query = '//WMT_MS_Capabilities/Capability/Request/GetMap/Format';
        $entries = $xpath->query ( $query );
        if ($entries == FALSE || $entries->length == 0) {
            $teste = $xpath->registerNamespace ( "tag", "http://www.opengis.net/wms" );
            $q = '/tag:WMS_Capabilities/tag:Capability/tag:Request/tag:GetMap/tag:Format';
            $entries = $xpath->query ( $q );
        }
        $arr = array ();
        foreach ( $entries as $entry ) {
            $arr [] = $entry->nodeValue;
        }
        return $arr;
    }
    function getSrs($dom) {
        $xpath = new DOMXPath ( $dom );
        $query = '//WMT_MS_Capabilities/Capability/Layer/SRS';
        $entries = $xpath->query ( $query );
        if ($entries == FALSE || $entries->length == 0) {
            $teste = $xpath->registerNamespace ( "tag", "http://www.opengis.net/wms" );
            $q = '/tag:WMS_Capabilities/tag:Capability/tag:Layer/tag:CRS';
            $entries = $xpath->query ( $q );
        }
        $srs = "";
        $single = array ();
        foreach ( $entries as $entry ) {
            $arr [] = $entry->nodeValue;
            if ($entry->nodeValue == "CRS:84") {
                $single [] = "CRS:84";
            }
            if ($entry->nodeValue == "EPSG:4326") {
                $single [] = "EPSG:4326";
            }
        }
        if (count ( $single ) > 0) {
            $arr = $single;
        }
        return $arr;
    }
    function getTag($layer) {
        $noslayer = $layer->childNodes;
        $resultado = array (
            "estiloas" => array (),
            "tags" => array ()
        );
        for($i = 0; $i < $noslayer->length; ++ $i) {
            $tnome = $noslayer->item ( $i )->tagName;
            $tvalor = $noslayer->item ( $i )->nodeValue;
            if ($tnome) {
                // echo "<br>".$tnome;
                if ($tnome == "Title") {
                    $resultado ["titulo"] = $tvalor;
                }
                if ($tnome == "Name") {
                    $resultado ["nome"] = $tvalor;
                }
                if ($tnome == "Abstract") {
                    $resultado ["resumo"] = $tvalor;
                }

                if ($tnome == "Style") {
                    $ss = $noslayer->item ( $i )->childNodes;
                    $ssl = $ss->length;
                    $n = "";
                    $t = "";
                    for($s = 0; $s < $ssl; $s ++) {
                        $snome = $ss->item ( $s )->tagName;
                        $svalor = $ss->item ( $s )->nodeValue;
                        if ($snome) {
                            if ($snome == "Title") {
                                $t = $svalor;
                            }
                            if ($snome == "Name") {
                                $n = $svalor;
                            }
                        }
                    }
                    if ($n != "") {
                        array_push ( $resultado ["estilos"], array (
                            "nome" => $n,
                            "titulo" => $t
                        ) );
                    }
                }
                array_push ( $resultado ["tags"], $tnome );
            }
        }
        return $resultado;
    }
    function getWmsGetCapabilities()
    {
        $wms_service_request = $this->server . "REQUEST=GetCapabilities&SERVICE=WMS";
        $teste = explode("version", strtolower($wms_service_request));
        if (count($teste) == 1) {
            $wms_service_request .= "&VERSION=1.1.1";
        }
        $nome = $this->dir_tmp . "/wms" . md5($wms_service_request) . ".xml";
        if (! file_exists($nome)) {
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, $wms_service_request);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($curl, CURLOPT_HEADER, 0);
            if (isset($this->i3geo_proxy_server) && $this->i3geo_proxy_server != "") {
                curl_setopt($curl, CURLOPT_PROXY, $this->i3geo_proxy_server);
            }
            $wms_capabilities = curl_exec($curl);
            curl_close($curl);
            if (! $wms_capabilities || $wms_capabilities == "") {
                return false;
            } else {
                $fp = fopen($nome, 'w');
                fwrite($fp, $wms_capabilities);
                fclose($fp);
                return $wms_capabilities;
            }
        } else {
            $handle = fopen($nome, "r");
            $wms_capabilities = fread($handle, filesize($nome));
            fclose($handle);
            return $wms_capabilities;
        }
    }
}
?>