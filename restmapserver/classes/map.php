<?php
namespace restmapserver;

class Map
{

    function __construct()
    {
        include_once (I3GEOPATH . "/restmapserver/classes/util.php");
        $this->util = new \restmapserver\Util();
        include_once (I3GEOPATH . "/restmapserver/classes/layer.php");
        $this->layer = new \restmapserver\Layer();
        include_once (I3GEOPATH . "/restmapserver/classes/admin.php");
        $this->admin = new \restmapserver\Admin();
        include_once (I3GEOPATH . "/restmapserver/classes/metaestatinfo.php");
        $this->metaestatinfo = new \restmapserver\MetaestatInfo();
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

    function getParameters($mapId, $w = "", $h = "")
    {
        if ($this->open($mapId) == false) {
            return false;
        }
        $mapObj = ms_newMapObj($_SESSION["map_file"]);
        $e = $mapObj->extent;
        $ext = ($e->minx) . " " . ($e->miny) . " " . ($e->maxx) . " " . ($e->maxy);
        $temp = $mapObj->scalebar;
        $temp->set("status", MS_OFF);
        $c = $mapObj->imagecolor;
        $c->setrgb(255, 255, 255);
        $of = $mapObj->outputformat;
        $of->set("imagemode", MS_IMAGEMODE_RGBA);
        $of->set("transparent", MS_ON);
        $of->setOption("QUANTIZE_FORCE", "OFF");
        $of->set("driver", "AGG/PNG");
        if ($_SESSION["interface"] == "googlemaps") {
            $mapObj->setProjection("+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m");
        }
        if (! empty($w)) {
            $mapObj->setsize($w, $h);
        }
        $legenda = $mapObj->legend;
        $legenda->set("status", MS_OFF);
        $mapObj->setmetadata("ows_enable_request", "*");
        $imgo = $mapObj->prepareImage();
        if ($imgo->imagepath == "") {
            echo "Erro IMAGEPATH vazio";
            exit();
        }
        $temp = $mapObj->scalebar;
        $temp->set("status", MS_OFF);
        $mapObj->setmetadata("interface", $_SESSION["interface"]);
        $customizacoesinit = $mapObj->getmetadata("CUSTOMIZACOESINIT");
        $mapObj->setmetadata("CUSTOMIZACOESINIT", "");
        $mapObj->save($_SESSION["map_file"]);

        $escalaMapa = $mapObj->scaledenom;
        $celula = $mapObj->cellsize;
        //
        // pega os parametros de cada tema
        //
        $qyfile = str_replace(".map", ".qy", $_SESSION["map_file"]);
        $arqsel = (file_exists($qyfile)) ? true : false;

        $temas = $this->getLayersParameters($mapObj);
        $versao = $this->util->mapserverversion();
        $nomer = ($imgo->imagepath) . uniqid("mapa") . ".png";
        $nomer = ($imgo->imageurl) . basename($nomer);
        // pega a cor de fundo do mapa
        $c = $mapObj->imagecolor;
        $cordefundo = $c->red . "," . $c->green . "," . $c->blue;
        // pega o texto de copyright
        $copyright = "";
        $lc = @$mapObj->getlayerbyname("copyright");
        if ($lc != "" && $lc->status == MS_DEFAULT) {
            $shape = $lc->getShape(new \resultObj(0));
            $copyright = $shape->text;
        }
        $res["editor"] = "nao";
        //
        // papeis do usuario se estiver logado
        //
        $res["papeis"] = array();
        $logado = "nao";
        $res["i3geoPermiteLogin"] = "sim";
        if (isset($_SESSION["i3geoPermiteLogin"]) && $_SESSION["i3geoPermiteLogin"] == false) {
            $_COOKIE = array();
            $res["i3geoPermiteLogin"] = "nao";
        }
        if (! empty($_COOKIE["i3geocodigologin"])) {
            session_write_close();
            session_name("i3GeoLogin");
            session_id($_COOKIE["i3geocodigologin"]);
            session_start();
            // var_dump($_SESSION);exit;
            $logado = "sim";
            if (! empty($_SESSION["usuario"]) && $_SESSION["usuario"] == $_COOKIE["i3geousuariologin"]) {
                $res["papeis"] = $_SESSION["papeis"];
            } else {
                $logado = "nao";
            }
            // verifica se o usuario logado pode ver as opcoes de edicao do sistema de admin dentro do mapa
            foreach ($res["papeis"] as $p) {
                if ($p < 3) {
                    $res["editor"] = "sim";
                }
            }
        }
        $res["mapexten"] = $ext;
        $res["mapscale"] = $escalaMapa;
        $res["mapres"] = $mapObj->resolution;
        $res["pixelsize"] = $celula;
        $res["mapfile"] = "";
        $res["cgi"] = ""; // $locmapserv;
        $res["extentTotal"] = $ext;
        $res["mapimagem"] = ""; // $nomer;
        $res["geoip"] = "nao";
        $res["listavisual"] = "";
        $res["utilizacgi"] = "nao"; // $utilizacgi;
        $res["versaoms"] = $versao["principal"];
        $res["versaomscompleta"] = $versao["completa"];
        $res["versaoint"] = $versao["inteiro"];
        $res["mensagens"] = $this->getLayersMessages($mapObj);
        $res["r"] = (isset($_SESSION["R_path"])) ? "sim" : "nao";
        $res["extentref"] = "";
        $res["kmlurl"] = ""; // @$kmlurl;
        $res["mensageminicia"] = $_SESSION["mensagemInicia"];
        $res["interfacePadrao"] = $_SESSION["interfacePadrao"];
        $res["w"] = $w;
        $res["h"] = $h;
        $res["titulo"] = $_SESSION["tituloInstituicao"];
        $res["tempo"] = "";
        $res["erro"] = '';
        $res["mappath"] = ""; // $imgo->imagepath;
        $res["mapurl"] = ""; // $imgo->imageurl;
        $res["navegacaoDir"] = $_SESSION["navegadoresLocais"];
        $res["autenticadoopenid"] = "nao";
        $res["emailInstituicao"] = $_SESSION["emailInstituicao"];
        $res["cordefundo"] = $cordefundo;
        $res["copyright"] = $copyright;
        $res["logado"] = $logado;
        $res["saikuUrl"] = $_SESSION["saikuUrl"];
        $res["statusFerramentas"] = $_SESSION["statusFerramentas"];
        $res["googleApiKey"] = $_SESSION["googleApiKey"];
        // parametros de inicializacao armazenados com o mapa quando o usuario utiliza a opcao de salvar mapa no nbanco de dados
        $customizacoesinit = $mapObj->getmetadata("CUSTOMIZACOESINIT");
        $res["editavel"] = $mapObj->getmetadata("EDITAVEL");
        return array(
            "variaveis" => $res,
            "temas" => $temas,
            "customizacoesinit" => $customizacoesinit
        );
    }

    function getLayersParameters($mapObj)
    {
        // obtem os dados sobre todos os temas no banco de dados de administracao
        $dadosTemas = $this->admin->getData("select codigo_tema,link_tema from " . $_SESSION["esquemaadmin"] . "i3geoadmin_temas");
        $temas = array();
        $existesel = false;
        $dir = dirname($_SESSION["map_file"]);
        $chaves = array(
            "name",
            "nomeoriginal",
            "status",
            "tema",
            "transparency",
            "type",
            "sel",
            "nsel",
            "escala",
            "download",
            "features",
            "connectiontype",
            "zoomtema",
            "contextoescala",
            "etiquetas",
            "identifica",
            "editorsql",
            "linhadotempo",
            "escondido",
            "iconetema",
            "classe",
            "permitecomentario",
            "exttema",
            "aplicaextensao",
            "transitioneffect",
            "wmsurl",
            "wmsname",
            "wmsformat",
            "wmssrs",
            "wmstile",
            "tiles",
            "temporizador",
            "permiteogc",
            "itembuscarapida",
            "usasld",
            "cache",
            "editavel",
            "colunaidunico",
            "cortepixels",
            "plugini3geo",
            "link_tema",
            "ferramentas",
            "legendaimg",
            "offsite",
            "numclasses",
            "id_medida_variavel",
            "codigo_tipo_regiao",
            "utfgrid",
            "maxscaledenom",
            "minscaledenom",
            "group",
            "cacheprefixo",
            "local"
        );
        $c = $mapObj->numlayers;
        for ($i = 0; $i < $c; ++ $i) {
            $oLayer = $mapObj->getlayer($i);
            $oLayer->set("template", "none.htm");
            $sel = "nao";
            $nSel = 0;
            $arqS = $dir . "/" . $oLayer->name . "_qy.map";
            if (file_exists($arqS)) {
                $sel = "sim";
                $existesel = true;
                $handle = fopen($arqS, "r");
                $conteudo = fread($handle, filesize($arqS));
                fclose($handle);
                $nSel = count(unserialize($conteudo));
            }
            $escondido = $oLayer->getmetadata("escondido");
            if ($escondido == "") {
                $escondido = "nao";
            }
            if ((strtoupper($oLayer->getmetadata("tema")) != "NAO")) {
                $escala = $oLayer->getmetadata("escala");
                if ($escala == "") {
                    $escala = 0;
                }
                $down = $oLayer->getmetadata("download");
                //
                // verifica se o layer &eacute; do tipo features
                //
                $features = "nao";
                if (($oLayer->data == "") && ($oLayer->connection == "")) {
                    $features = "sim";
                }
                $ct = $oLayer->connectiontype;
                //
                // verifica se o tema tem wfs
                //
                $wfs = $oLayer->getmetadata("wfs");
                //
                // verifica se o tema utiliza SLD
                //
                $usasld = "nao";
                if ($oLayer->getmetadata("wms_sld_body") !== "" || $oLayer->getmetadata("wms_sld_url") !== "") {
                    $usasld = "sim";
                }
                //
                // verifica se o tema pode receber a opera&ccedil;&atilde;o de zoom para o tema
                //
                if (($ct != 1) && ($oLayer->getmetadata("extensao") == "" && $oLayer->getmetadata("exttema") == "")) {
                    $zoomtema = "nao";
                    $exttema = "";
                } else {
                    $zoomtema = "sim";
                    $exttema = $oLayer->getmetadata("extensao");
                    if ($exttema == "") {
                        $exttema = $oLayer->getmetadata("extensao");
                    }
                }
                //
                // verifica se existe restri&ccedil;&atilde;o de escala
                //
                $contextoescala = "nao";
                if (($oLayer->minscaledenom > 0) || ($oLayer->maxscaledenom > 0)) {
                    $contextoescala = "sim";
                }
                //
                // verifica se o usu&aacute;rio pode editar o SQL em DATA
                //
                $editorsql = "nao";
                if ($ct == 3 || $ct == 4 || $ct == 6 || $ct == 8) {
                    if (strtoupper($oLayer->getmetadata("editorsql")) != "NAO") {
                        $editorsql = "sim";
                    }
                }
                //
                // verifica se o tema pode ser utilizado para gerar gr&aacute;ficos de linha do tempo
                //
                $ltempo = "nao";
                if ($oLayer->getmetadata("ltempoformatodata") !== "") {
                    $ltempo = "sim";
                }
                $local = "nao";
                if ($oLayer->getMetaData("TEMALOCAL") != "") {
                    $local = "sim";
                }
                // verifica se o tema faz cache automatico
                //
                $cache = "nao";
                if (strtoupper($oLayer->getmetadata("cache")) == "SIM") {
                    $cache = "sim";
                }
                $temporizador = "";
                if ($oLayer->getmetadata("temporizador") != "") {
                    $cache = "nao";
                    $temporizador = $oLayer->getmetadata("temporizador");
                }
                $cortepixels = 0;
                if ($oLayer->getmetadata("cortepixels") != "") {
                    $cortepixels = $oLayer->getmetadata("cortepixels");
                }
                //
                // verifica se o tema receber&aacute; efeito de transi&ccedil;&atilde;o de zoom
                //
                $transitioneffect = "nao";
                if ($oLayer->getmetadata("transitioneffect") == "SIM") {
                    $transitioneffect = "sim";
                }
                //
                $permitecomentario = "nao";
                if ($oLayer->getmetadata("nomeoriginal") != "" && strtoupper($oLayer->getmetadata("permitecomentario")) != "NAO") {
                    $permitecomentario = "sim";
                }
                $aplicaextensao = "nao";
                if (strtoupper($oLayer->getmetadata("aplicaextensao")) == "SIM") {
                    $aplicaextensao = "sim";
                }
                $wmsurl = "";
                $wmsformat = "";
                $wmssrs = "";
                $wmstile = "0";
                $wmsname = "";
                if ($ct == 7 && strtoupper($oLayer->getmetadata("cache")) != "SIM") {
                    $wmsurl = ($oLayer->connection) . "&layers=" . ($oLayer->getmetadata("wms_name")) . "&style=" . ($oLayer->getmetadata("wms_style"));
                    $tempo = $oLayer->getmetadata("wms_time");
                    if ($tempo != "") {
                        $wmsurl .= "&TIME=" . $tempo;
                    }
                    $wmsformat = $oLayer->getmetadata("wms_format");
                    $wmssrs = $oLayer->getmetadata("wms_srs");
                    $wmstile = $oLayer->getmetadata("wms_tile");
                    $wmsname = $oLayer->getmetadata("wms_name");
                    if ($wmstile == 1) {
                        $wmsurl = ($oLayer->connection);
                    }
                    if ($wmstile == "") {
                        $wmstile = "0";
                    }
                }
                //
                // indica se a camada sera inserida no mapa como singletile ou nao
                //
                $tiles = strtolower($oLayer->getmetadata("TILES"));
                $plugini3geo = "";
                if ($oLayer->getmetadata("PLUGINI3GEO") != "") {
                    $plugini3geo = $oLayer->getmetadata("PLUGINI3GEO");
                    if (! mb_detect_encoding($plugini3geo, "UTF-8", true)) {
                        $plugini3geo = mb_convert_encoding($plugini3geo, "UTF-8", "ISO-8859-1");
                    }
                    $plugini3geo = json_decode($plugini3geo);
                }
                // pega dados do banco
                $link_tema = "";
                $temp = $oLayer->getmetadata("nomeoriginal");
                if ($temp != "" && array_key_exists($temp, $dadosTemas)) {
                    $link_tema = $dadosTemas[$temp];
                    $link_tema = $link_tema["link_tema"];
                }
                // aqui pega o valor link_tema em METADATA
                // esse METADATA nao e definido pelo i3Geo e teria de ser incluido manualmente,
                // por uma aplicacao por exemplo
                if ($link_tema == "" && $oLayer->getmetadata("link_tema") != "") {
                    $link_tema = $oLayer->getmetadata("link_tema");
                }
                //
                // parametros para ferramentas especiaifcas
                //
                $ferramentas = array();
                // mapa 3d
                if ($oLayer->getmetadata("tme") != "") {
                    $f = $oLayer->getmetadata("tme");
                    if (! mb_detect_encoding($f, "UTF-8", true)) {
                        $f = mb_convert_encoding($f, "UTF-8", "ISO-8859-1");
                    }
                    $ferramentas["tme"] = json_decode($f);
                }
                // utfgrid
                $utfgrid = "nao";
                if ($oLayer->getmetadata("UTFITEM") != "" || $oLayer->getmetadata("UTFDATA") != "") {
                    $utfgrid = "sim";
                }
                // storymap
                if ($oLayer->getmetadata("storymap") != "") {
                    $f = $oLayer->getmetadata("storymap");
                    if (! mb_detect_encoding($f, "UTF-8", true)) {
                        $f = mb_convert_encoding($f, "UTF-8", "ISO-8859-1");
                    }
                    $ferramentas["storymap"] = json_decode(str_replace("'", '"', $f));
                }
                // wmstime
                if ($oLayer->getmetadata("wmstime") != "") {
                    $f = $oLayer->getmetadata("wmstime");
                    if (! mb_detect_encoding($f, "UTF-8", true)) {
                        $f = mb_convert_encoding($f, "UTF-8", "ISO-8859-1");
                    }
                    $ferramentas["wmstime"] = json_decode(str_replace("'", '"', $f));
                }
                // animagif
                if ($oLayer->getmetadata("animagif") != "") {
                    $f = $oLayer->getmetadata("animagif");
                    if (! mb_detect_encoding($f, "UTF-8", true)) {
                        $f = mb_convert_encoding($f, "UTF-8", "ISO-8859-1");
                    }
                    $ferramentas["animagif"] = json_decode(str_replace("'", '"', $f));
                }
                $temas[] = array(
                    $oLayer->name,
                    $oLayer->getmetadata("nomeoriginal"),
                    $oLayer->status,
                    mb_convert_encoding(($oLayer->getmetadata("tema")), "UTF-8", "ISO-8859-1"),
                    $oLayer->opacity,
                    $oLayer->type,
                    $sel,
                    $nSel,
                    $escala,
                    $down,
                    $features,
                    $ct,
                    $zoomtema,
                    $contextoescala,
                    $oLayer->getmetadata("TIP"),
                    $oLayer->getmetadata("IDENTIFICA"),
                    $editorsql,
                    $ltempo,
                    strtolower($escondido),
                    $oLayer->getmetadata("iconetema"),
                    $oLayer->getmetadata("classe"),
                    $permitecomentario,
                    $exttema,
                    $aplicaextensao,
                    $transitioneffect,
                    $wmsurl,
                    $wmsname,
                    $wmsformat,
                    $wmssrs,
                    $wmstile,
                    $tiles,
                    $temporizador,
                    $oLayer->getmetadata("permiteogc"),
                    $oLayer->getmetadata("itembuscarapida"),
                    $usasld,
                    $cache,
                    $oLayer->getmetadata("EDITAVEL"),
                    $oLayer->getmetadata("COLUNAIDUNICO"),
                    $cortepixels,
                    $plugini3geo,
                    $link_tema,
                    $ferramentas,
                    $oLayer->getmetadata("legendaimg"),
                    $oLayer->offsite->red . "," . $oLayer->offsite->green . "," . $oLayer->offsite->blue,
                    $oLayer->numclasses,
                    $oLayer->getmetadata("METAESTAT_ID_MEDIDA_VARIAVEL"),
                    $oLayer->getmetadata("METAESTAT_CODIGO_TIPO_REGIAO"),
                    $utfgrid,
                    $oLayer->maxscaledenom,
                    $oLayer->minscaledenom,
                    $oLayer->group,
                    $oLayer->getmetadata("cacheprefixo"),
                    $local
                );
            }
        }
        $temas = array_reverse($temas);
        return array(
            "chaves" => $chaves,
            "valores" => $temas
        );
    }

    function getLayersMessages($mapObj)
    {
        $mensagem = "";
        $c = $mapObj->numlayers;
        for ($i = 0; $i < $c; ++ $i) {
            $l = $mapObj->getlayer($i);
            if ($l->status == MS_DEFAULT) {
                $mensagem .= $l->getmetadata("mensagem");
            }
        }
        if (function_exists("mb_convert_encoding")) {
            $mensagem = mb_convert_encoding($mensagem, "UTF-8", "ISO-8859-1");
        }
        return ($mensagem);
    }

    /**
     * Apaga o arquivo que armazena quais elementos estao selecionados
     */
    function clearQyfile($file)
    {
        $qyfile = str_replace(".map", ".qy", $file);
        if (file_exists($qyfile)) {
            unlink($qyfile);
        }
    }

    /**
     * Esconde a string de conexao com o banco de dados em um arquivo mapfile
     */
    function hiddeCon($map_file = "")
    {
        if (empty($map_file)) {
            $map_file = $_SESSION["map_file"];
        }
        $postgis_mapa = $_SESSION["postgis_mapa"];
        $keys = array_keys($postgis_mapa);
        $mapObj = ms_newMapObj($map_file);
        $numlayers = $mapObj->numlayers;
        for ($i = 0; $i < $numlayers; ++ $i) {
            $layer = $mapObj->getlayer($i);
            if ($layer->connectiontype == MS_POSTGIS) {
                $conec = $layer->connection;
                $layer->set("connection", "");
                if ($layer->getmetadata("conexaooriginal") != "") {
                    $layer->set("connection", $layer->getmetadata("conexaooriginal"));
                } else {
                    foreach ($keys as $k) {
                        if ($postgis_mapa[$k] == $conec || $k == $conec) {
                            $layer->set("connection", $k);
                        }
                    }
                }
            }
        }
        $mapObj->save($map_file);
        $mapObj->free();
    }

    /**
     * Adiciona uma camada baseada no sistema de metadados estatisticos
     *
     * @param string $metaestatids
     * @param string $layerson
     */
    function addLayersMetaestat($metaestatids = "", $layerson = "")
    {
        $metaestatids = explode(",", $metaestatids);
        if (count($metaestatids) == 0) {
            return;
        }
        $metaestatidsligados = explode(",", $layerson);
        foreach ($metaestatids as $metaestatid) {
            $parametros = $this->admin->i3geoestat_parametro_medida($metaestatid, "", "", true, true);
            // id_parametro_medida,coluna
            $filtroPar = array();
            $tituloPar = array();
            foreach ($parametros as $parametro) {
                $valoresparametro = $this->metaestatinfo->valorUnicoMedidaVariavel($metaestatid, $parametro["coluna"]);
                $valormaior = $valoresparametro[count($valoresparametro) - 1];
                $filtroPar[] = " " . $parametro["coluna"] . "::text = '" . $valormaior[$parametro["coluna"]] . "' ";
                $tituloPar[] = $parametro["coluna"] . ": " . $valormaior[$parametro["coluna"]];
            }
            $dadosMedida = $this->admin->i3geoestat_medida_variavel_variavel("", $metaestatid);
            // var_dump($dadosMedida);exit;
            $tituloCamada = mb_convert_encoding($dadosMedida["nomemedida"], "ISO-8859-1", mb_detect_encoding($dadosMedida["nomemedida"]));
            if (count($tituloPar) > 0) {
                $tituloCamada = $tituloCamada . " (" . implode(" ,", $tituloPar) . " )";
            }
            $mapfilemetaestat = $this->metaestatinfo->mapfileMedidaVariavel($metaestatid, implode(" AND ", $filtroPar), 0, "polygon", $tituloCamada, "", "", "", "", false, true, $_SESSION["dir_tmp"] . "/metaestatTempInit" . $metaestatid . ".map");
            // echo $mapfilemetaestat["mapfile"];exit;
            $map = ms_newMapObj($_SESSION["map_file"]);
            $mapTemp = ms_newMapObjFromString($mapfilemetaestat["mapfile"]);
            $l = $mapTemp->getlayerbyname($mapfilemetaestat["layer"]);
            $l->set("status", MS_DEFAULT);
            if ($l->type == MS_LAYER_POLYGON) {
                $map->insertLayer($l, 0);
            } else {
                $map->insertLayer($l, - 1);
            }
            $map->save($_SESSION["map_file"]);
        }
    }

    function addLayerWms($wmslayertitle, $url, $proj, $formatlist, $type = "", $version = "1.1.1", $wmslayername = "", $representationtype = "", $suportsld = false, $infoformat = "text/plain", $time = "", $tile = 0, $allitens = false)
    {
        $mapa = ms_newMapObj($_SESSION["map_file"]);
        include_once (I3GEOPATH . "/classesphp/wmswfs.php");

        // limpa selecao
        $this->clearQyfile($_SESSION["map_file"]);
        $layer = ms_newLayerObj($mapa);
        $layer->set("status", MS_DEFAULT);
        $nomecamada = mb_convert_encoding($wmslayername, "ISO-8859-1", "AUTO");
        if ($wmslayername == "default") {
            $nomecamada = $wmslayertitle;
        }
        $layer->setmetadata("CLASSE", "SIM");
        $layer->setmetadata("TEXTO", "NAO");
        $layer->setmetadata("tema", $nomecamada);
        $layer->setmetadata("nomeoriginal", $wmslayertitle); // nome original do layer no web service
        $layer->setmetadata("tipooriginal", $representationtype);
        $layer->set("name", uniqid("wms_"));
        if ($representationtype != "") {
            $layer->set("type", MS_LAYER_POLYGON);
            if ($representationtype == "linear") {
                $layer->set("type", MS_LAYER_LINE);
                $classe = ms_newClassObj($layer);
                $estilo = ms_newStyleObj($classe);
                $cor = $estilo->color;
                $cor->setRGB(- 1, - 1, - 1);
            }
            if ($representationtype == "pontual") {
                $layer->set("type", MS_LAYER_POINT);
            }
            $sld = $layer->generateSLD();
            $fp = fopen(dirname($_SESSION["map_file"]) . "/" . $layer->name . "sld.xml", "a");
            fputs($fp, $sld);
            fclose($fp);
        }
        $layer->set("type", MS_LAYER_RASTER);
        $layer->set("connection", $url);
        $layer->setconnectiontype(MS_WMS);
        $epsg = "EPSG:4326";
        $e4291 = "nao";
        $ecrs = "nao";
        $pos = str_replace(" ", ",", $proj);
        $pos = explode(",", $pos);
        if (count($pos) > 1) {
            foreach ($pos as $p) {
                $p = explode(":", $p);
                if ($p[1] == "4326") {
                    $epsg = "EPSG:4326";
                }
                if ($p[1] == "84") {
                    $ecrs = "CRS:84";
                    $ecrs = "sim";
                }
            }
        } else {
            $epsg = $proj;
        }
        if ($e4291 == "sim") {
            $epsg = "EPSG:4618";
        }
        if ($ecrs == "sim") {
            $epsg = $ecrs;
        }
        $epsg = trim($epsg);
        $layer->setmetadata("wms_srs", $epsg);
        $layer->setmetadata("wms_crs", $epsg);
        $layer->setmetadata("wms_name", $wmslayertitle);
        $layer->setmetadata("wms_server_version", $version);

        $layer->setmetadata("wms_formatlist", $formatlist);
        $layer->setmetadata("formatosinfo", $infoformat);
        $layer->setmetadata("wms_exceptions_format", "application/vnd.ogc.se_xml");
        $layer->setmetadata("wms_LAYERS", $wmslayertitle);
        $layer->setmetadata("wms_STYLES", "");
        $layer->setmetadata("wms_connectiontimeout", "30");
        $layer->setmetadata("wms_force_separate_request", "1");
        $layer->setmetadata("wms_tile", $tile);
        if ($time != "")
            $layer->setmetadata("wms_time", $time);
        // pega o tipo de formato de imagem que deve ser requisitado
        // a prefer&ecirc;ncia &eacute; png, mas se n&atilde;o for poss&iacute;vel, pega o primeiro da lista de formatos
        // dispon&iacute;veis no formato
        if (stristr($formatlist, "png")) {
            $im = "image/png";
        } else {
            $im = explode(",", $formatlist);
            $im = $im[0];
        }
        if (($representationtype != "") && ($suportsld == true)) {
            $layer->setmetadata("wms_sld_url", $_SESSION["imgurl"] . $layer->name . "sld.xml");
            $layer->setmetadata("sld", $_SESSION["map_file"] . "/" . $layer->name . "sld.xml");
        } else {
            $urllegenda = $url . "&request=getlegendgraphic&version=" . $version . "&service=wms&layer=" . $wmslayertitle . "&format=" . $im;
            $layer->setmetadata("legendawms", $urllegenda);
        }
        $layer->setmetadata("wms_format", $im);
        $layer->setmetadata("wfs", "nao");
        $layer->setmetadata("wfs", "nao");
        if ($allitens == true) {
            $layer->setmetadata("tip", "allitens");
        }

        $c = $layer->offsite;
        $c->setrgb(255, 255, 255);
        $of = $this->mapa->outputformat;

        $salvo = $mapa->save($_SESSION["map_file"]);
        return array(
            "layer" => layer
        );
    }

    /**
     * Adiciona ao mapa um layer com base em uma string com coordenadas
     *
     * @param string $lines
     *            -54 -12 -50 -12,-50 -1 -50 -2 -50 -3
     * @param string $namelines
     * @param string $symbol
     * @param number $symbolsize
     * @param string $symbolcolor
     * @return array("name"=>"","shapefile"=>"")
     */
    function addLayerByLines($lines = "", $namelines = "Linhas", $symbol = "ponto", $symbolsize = 10, $symbolcolor = "255 0 0")
    {
        if (empty($lines)) {
            return false;
        }
        include (I3GEOPATH . "/pacotes/phpxbase/api_conversion.php");
        //
        // cria o shape file
        //
        $tipol = MS_SHP_ARC;
        $nomeshp = dirname($_SESSION["map_file"]) . "/" . uniqid("lines");
        // cria o dbf
        $def = array();
        $items = array(
            "COORD"
        );
        foreach ($items as $ni) {
            $def[] = array(
                $ni,
                "C",
                "254"
            );
        }
        if (! function_exists(dbase_create)) {
            xbase_create($nomeshp . ".dbf", $def);
        } else {
            dbase_create($nomeshp . ".dbf", $def);
        }
        $dbname = $nomeshp . ".dbf";
        $db = xbase_open($dbname, 2);
        $novoshpf = ms_newShapefileObj($nomeshp, $tipol);
        $linhas = explode(",", $lines);
        $pontosLinhas = array(); // guarda os pontos de cada linha em arrays
        foreach ($linhas as $l) {
            $tempPTs = explode(" ", $l);
            $temp = array();
            foreach ($tempPTs as $p) {
                if (is_numeric($p)) {
                    $temp[] = $p;
                }
            }
            $pontosLinhas[] = $temp;
        }
        foreach ($pontosLinhas as $ptsl) {
            $linhas = $ptsl;
            $shape = ms_newShapeObj(MS_SHAPE_LINE);
            $linha = ms_newLineObj();
            $reg = array();
            $reg[] = implode(",", $ptsl);
            for ($ci = 0; $ci < count($linhas); $ci = $ci + 2) {
                $linha->addXY($linhas[$ci], $linhas[$ci + 1]);
            }
            $shape->add($linha);
            $novoshpf->addShape($shape);
            xbase_add_record($db, $reg);
        }
        $novoshpf->free();
        xbase_close($db);
        // adiciona o layer
        $mapa = ms_newMapObj($_SESSION["map_file"]);
        $layer = ms_newLayerObj($mapa);
        $layer->set("name", basename($nomeshp));
        $layer->set("data", $nomeshp . ".shp");
        $layer->setmetadata("DOWNLOAD", "sim");
        $layer->setmetadata("temalocal", "sim");
        $layer->setmetadata("tema", $namelines);
        $layer->setmetadata("classe", "sim");
        $layer->set("type", MS_LAYER_LINE);
        $layer->set("status", MS_DEFAULT);
        $classe = ms_newClassObj($layer);
        $classe->set("name", " ");
        $estilo = ms_newStyleObj($classe);
        if (! empty($symbol)) {
            $estilo->set("symbolname", $symbol);
        }
        $estilo->set("width", $symbolsize);
        $cor = $estilo->color;
        $corsimbolo = str_replace(" ", ",", $symbolcolor);
        $corsimbolo = explode(",", $corsimbolo);
        $cor->setRGB($corsimbolo[0], $corsimbolo[1], $corsimbolo[2]);
        $salvo = $mapa->save($_SESSION["map_file"]);
        return array(
            "name" => basename($nomeshp),
            "shapefile" => $nomeshp
        );
    }

    /**
     * Adiciona ao mapa um layer com base em uma string com coordenadas
     *
     * @param string $polygons
     *            -54 -12 -50 -12 -50 -10 -54 -12
     * @param string $namepolygons
     * @param string $symbol
     * @param number $symbolsize
     * @param string $symbolcolor
     * @return array("name"=>"","shapefile"=>"")
     */
    function addLayerByPolygons($polygons = "", $namepolygons = "Poligonos", $symbolcolor = "255 0 0")
    {
        if (empty($polygons)) {
            return false;
        }
        include (I3GEOPATH . "/pacotes/phpxbase/api_conversion.php");
        //
        // cria o shape file
        //
        $tipol = MS_SHP_POLYGON;
        $nomeshp = dirname($_SESSION["map_file"]) . "/" . uniqid("polys");
        // cria o dbf
        $def = array();
        $items = array(
            "COORD"
        );
        foreach ($items as $ni) {
            $def[] = array(
                $ni,
                "C",
                "254"
            );
        }
        if (! function_exists(dbase_create)) {
            xbase_create($nomeshp . ".dbf", $def);
        } else {
            dbase_create($nomeshp . ".dbf", $def);
        }
        $dbname = $nomeshp . ".dbf";
        $db = xbase_open($dbname, 2);
        $novoshpf = ms_newShapefileObj($nomeshp, $tipol);
        $linhas = explode(",", trim($polygons));
        $pontosLinhas = array(); // guarda os pontos de cada linha em arrays
        foreach ($linhas as $l) {
            $tempPTs = explode(" ", trim($l));
            $temp = array();
            foreach ($tempPTs as $p)
                if (is_numeric($p)) {
                    $temp[] = $p;
                }
            $pontosLinhas[] = $temp;
        }
        foreach ($pontosLinhas as $ptsl) {
            $linhas = $ptsl;
            $shape = ms_newShapeObj(MS_SHAPE_POLYGON);
            $linha = ms_newLineObj();
            $reg = array();
            $reg[] = "";
            for ($ci = 0; $ci < count($linhas); $ci = $ci + 2) {
                $linha->addXY($linhas[$ci], $linhas[$ci + 1]);
            }
            $shape->add($linha);
            $novoshpf->addShape($shape);
            xbase_add_record($db, $reg);
        }
        $novoshpf->free();
        xbase_close($db);
        // adiciona o layer
        $mapa = ms_newMapObj($_SESSION["map_file"]);
        $layer = ms_newLayerObj($mapa);
        $layer->set("name", basename($nomeshp));
        $layer->set("data", $nomeshp . ".shp");
        $layer->setmetadata("DOWNLOAD", "sim");
        $layer->setmetadata("temalocal", "sim");
        $layer->setmetadata("tema", $namepolygons);
        $layer->setmetadata("classe", "sim");
        $layer->setmetadata("ATLAS", "nao");
        $layer->set("type", MS_LAYER_POLYGON);
        $layer->set("opacity", "50");
        $layer->set("status", MS_DEFAULT);
        $classe = ms_newClassObj($layer);
        $classe->set("name", " ");
        $estilo = ms_newStyleObj($classe);

        $cor = $estilo->color;
        $corsimbolo = str_replace(" ", ",", $symbolcolor);
        $corsimbolo = explode(",", $corsimbolo);
        $cor->setRGB($corsimbolo[0], $corsimbolo[1], $corsimbolo[2]);

        $salvo = $mapa->save($_SESSION["map_file"]);
        return array(
            "name" => basename($nomeshp),
            "shapefile" => $nomeshp
        );
    }

    /**
     * Adiciona ao mapa um layer com base em uma string com coordenadas
     *
     * @param string $points
     * @param string $namepoints
     * @param string $symbol
     * @param number $symbolsize
     * @param string $symbolcolor
     * @return array("name"=>"","shapefile"=>"")
     */
    function addLayerByPoints($points = "", $namepoints = "Pontos", $symbol = "ponto", $symbolsize = 10, $symbolcolor = "255 0 0")
    {
        if (empty($points)) {
            return false;
        }
        include (I3GEOPATH . "/pacotes/phpxbase/api_conversion.php");
        //
        // cria o shape file
        //
        $tipol = MS_SHP_POINT;
        $nomeshp = dirname($_SESSION["map_file"]) . "/" . uniqid("points");

        // cria o dbf
        $def = array();
        $items = array(
            "COORD"
        );
        foreach ($items as $ni) {
            $def[] = array(
                $ni,
                "C",
                "254"
            );
        }
        if (! function_exists(dbase_create)) {
            xbase_create($nomeshp . ".dbf", $def);
        } else {
            dbase_create($nomeshp . ".dbf", $def);
        }
        $dbname = $nomeshp . ".dbf";
        $db = xbase_open($dbname, 2);
        $novoshpf = ms_newShapefileObj($nomeshp, $tipol);
        $pontos = explode(",", trim(str_replace(" ", ",", $points)));
        foreach ($pontos as $p) {
            if (is_numeric($p)) {
                $pontosn[] = $p;
            }
        }
        $pontos = $pontosn;
        for ($ci = 0; $ci < count($pontos); $ci = $ci + 2) {
            $reg = array();
            $reg[] = $pontos[$ci] . " " . $pontos[$ci + 1];
            $shape = ms_newShapeObj($tipol);
            $linha = ms_newLineObj();
            $linha->addXY($pontos[$ci], $pontos[$ci + 1]);
            $shape->add($linha);
            $novoshpf->addShape($shape);
            xbase_add_record($db, $reg);
        }
        $novoshpf->free();
        xbase_close($db);
        // adiciona o layer
        $mapa = ms_newMapObj($_SESSION["map_file"]);
        $layer = ms_newLayerObj($mapa);
        $layer->set("name", basename($nomeshp));
        $layer->set("data", $nomeshp . ".shp");
        $layer->setmetadata("DOWNLOAD", "sim");
        $layer->setmetadata("tema", $namepoints);
        $layer->setmetadata("classe", "sim");
        $layer->setmetadata("temalocal", "sim");
        $layer->set("type", MS_LAYER_POINT);
        $layer->set("status", MS_DEFAULT);
        $classe = ms_newClassObj($layer);
        $classe->set("name", " ");
        $estilo = ms_newStyleObj($classe);
        $estilo->set("symbolname", $symbol);
        $estilo->set("size", $symbolsize);
        $cor = $estilo->color;
        if (! isset($corsimbolo)) {
            $corsimbolo = "255,0,0";
        }
        $corsimbolo = str_replace(" ", ",", $symbolcolor);
        $corsimbolo = explode(",", $corsimbolo);
        $cor->setRGB($corsimbolo[0], $corsimbolo[1], $corsimbolo[2]);
        $salvo = $mapa->save($_SESSION["map_file"]);
        return array(
            "name" => basename($nomeshp),
            "shapefile" => $nomeshp
        );
    }

    /**
     * Adiciona ao mapa um layer com base em uma string wkt
     *
     * @param string $wkt
     * @param string $namewkt
     * @param string $symbol
     * @param number $symbolsize
     * @param string $symbolcolor
     * @return array("name"=>"","shapefile"=>"")
     */
    function addLayerByWkt($wkt = "", $namewkt = "wktlayer", $symbol = "ponto", $symbolsize = 10, $symbolcolor = "255 0 0")
    {
        if (empty($wkt)) {
            return false;
        }
        include (I3GEOPATH . "/pacotes/phpxbase/api_conversion.php");
        $shape = ms_shapeObjFromWkt($wkt);
        $tipol = $shape->type;
        if ($tipol == 0) {
            $tipol = 3;
        }
        $nomeshp = dirname($_SESSION["map_file"]) . "/" . uniqid("wkt");
        // cria o dbf
        $def = array();
        $items = array(
            "COORD"
        );
        foreach ($items as $ni) {
            $def[] = array(
                $ni,
                "C",
                "254"
            );
        }
        if (! function_exists(dbase_create)) {
            xbase_create($nomeshp . ".dbf", $def);
        } else {
            dbase_create($nomeshp . ".dbf", $def);
        }
        $dbname = $nomeshp . ".dbf";
        $db = xbase_open($dbname, 2);
        if ($tipol == 1) {
            $novoshpf = ms_newShapefileObj($nomeshp, MS_SHP_ARC);
        }
        if ($tipol == 3) {
            $novoshpf = ms_newShapefileObj($nomeshp, MS_SHP_MULTIPOINT);
        }
        if ($tipol == 2) {
            $novoshpf = ms_newShapefileObj($nomeshp, MS_SHP_POLYGON);
        }
        $reg[] = "";
        $novoshpf->addShape($shape);
        xbase_add_record($db, $reg);
        $novoshpf->free();
        xbase_close($db);
        // adiciona o layer
        $mapa = ms_newMapObj($_SESSION["map_file"]);
        $layer = ms_newLayerObj($mapa);
        $layer->set("name", basename($nomeshp));
        $layer->set("data", $nomeshp . ".shp");
        $layer->setmetadata("DOWNLOAD", "sim");
        $layer->setmetadata("temalocal", "sim");
        $layer->setmetadata("tema", $namewkt);
        $layer->setmetadata("classe", "sim");
        $layer->set("type", $shape->type);
        $layer->set("status", MS_DEFAULT);
        $classe = ms_newClassObj($layer);
        $classe->set("name", " ");
        $estilo = ms_newStyleObj($classe);
        if ($shape->type == 0) {
            $estilo->set("symbolname", $symbol);
            $estilo->set("size", $symbolsize);
        }
        if ($shape->type == 1) {
            $estilo->set("symbolname", $symbol);
            $estilo->set("width", $symbolsize);
        }
        if ($shape->type == 2) {
            $layer->set("opacity", "50");
        }
        $cor = $estilo->color;
        $corsimbolo = str_replace(" ", ",", $symbolcolor);
        $corsimbolo = explode(",", $corsimbolo);
        $cor->setRGB($corsimbolo[0], $corsimbolo[1], $corsimbolo[2]);
        $salvo = $mapa->save($_SESSION["map_file"]);
        return array(
            "name" => basename($nomeshp),
            "shapefile" => $nomeshp
        );
    }

    function getAllRestrictLayers()
    {
        include_once (I3GEOPATH . "/restmapserver/classes/admin.php");
        $admin = new \restmapserver\Admin();
        $res = $admin->i3geousr_grupotema();
        $restritos = array();
        foreach ($res as $r) {
            if (in_array($r["codigo_tema"], $restritos)) {
                array_push($restritos[$r["codigo_tema"]], $r["id_grupo"]);
            } else {
                $restritos[$r["codigo_tema"]] = array(
                    $r["id_grupo"]
                );
            }
        }
        return $restritos;
    }

    function getRestrictLayersInMap($map_file)
    {
        $indevidos = array();
        $restritos = $this->getAllRestrictLayers();
        if (count($restritos) > 0) {
            include_once (I3GEOPATH . "/restmapserver/classes/util.php");
            $util = new \restmapserver\Util();
            $gruposusr = $util->getGruposUsrLogin();
            if (! is_object($map_file)) {
                $m = @ms_newMapObj($map_file);
            } else {
                $m = $map_file;
            }
            $c = $m->numlayers;
            for ($i = 0; $i < $c; ++ $i) {
                $layer = $m->getlayer($i);
                $meta = $layer->getmetadata("arquivotemaoriginal");
                // pode ser que o metadata nao esteja definido ainda
                if ($meta == "") {
                    $meta = str_replace(".map", "", basename($map_file));
                }
                if ($meta != "") {
                    if (in_array($meta, array_keys($restritos)) || in_array($layer->name, array_keys($restritos))) {
                        $indevido = true;
                        foreach ($gruposusr as $g) {
                            foreach ($restritos[$meta] as $r) {
                                if ($g == $r) {
                                    $indevido = false;
                                }
                            }
                        }
                        if ($indevido == true) {
                            array_push($indevidos, $layer->name);
                        }
                    }
                }
            }
        }
        return $indevidos;
    }

    /**
     * Remove de um mapfile os LAYERS que sao de acesso restrito e nao podem ser
     * utilizados pelo usuario logado
     *
     * @param string $map_file
     * @return boolean
     */
    function removeRestrictLayers($map_file = "")
    {
        if (empty($map_file)) {
            $map_file = $_SESSION["map_file"];
        }
        $indevidos = $this->getRestrictLayersInMap($map_file);
        $existeIndevidos = false;
        if (count($indevidos) > 0) {
            $existeIndevidos = true;
            if (! is_object($map_file)) {
                $m = ms_newMapObj($map_file);
            } else {
                $m = $map_file;
                $salva = false;
            }
            foreach ($indevidos as $i) {
                $l = $m->getlayerbyname($i);
                $l->set("status", MS_DELETE);
            }
            $m->save($map_file);
        }
        return $existeIndevidos;
    }

    /**
     * Adiciona um ou mais layers ao mapa
     *
     * @param string $layers
     *            Nomes dos arquivos mapfile existentes na pasta i3geo/temas
     */
    function layersAdd($mapId, $layernames, $save = true, $mapObj = false)
    {
        $temasdir = I3GEOPATH . "/temas";
        $layernames = str_replace(" ", ",", $layernames);
        $layersadd = explode(",", $layernames);
        if (count($layersadd) == 0) {
            return false;
        }
        if ($this->open($mapId) == false) {
            return false;
        }
        if ($mapObj == false) {
            $mapObj = ms_newMapObj($_SESSION["map_file"]);
        }
        $existeraster = false;
        foreach ($layersadd as $layername) {
            $layerfile = $temasdir . "/" . trim($layername) . ".map";
            if (file_exists($layerfile)) {
                if (@ms_newMapObj($layerfile)) {
                    $maptemp = @ms_newMapObj($layerfile);
                    $layersNames = $maptemp->getAllLayerNames();
                    foreach ($layersNames as $name) {
                        $l = $maptemp->getLayerByName($name);
                        if ($l->type == MS_LAYER_RASTER) {
                            $existeraster = true;
                        }
                        $l->setmetadata("nomeoriginal", $name);
                        $l->setmetadata("arquivotemaoriginal", str_replace(".map", "", basename($layerfile)));
                        $l->setmetadata("aplicaextensao", "");
                        // cria e aplica sld se for wms e existirem classes
                        if ($l->classitem != "" && $l->connectiontype == 7 && $l->numclasses > 0 && $l->getmetadata("wms_sld_body") == "") {
                            $tipotemp = $l->type;
                            $statustemp = $l->status;
                            $tiporep = $l->getmetadata("tipooriginal");
                            $l->set("type", MS_LAYER_POLYGON);
                            if ($tiporep == "linear") {
                                $l->set("type", MS_LAYER_LINE);
                            }
                            if ($tiporep == "pontual") {
                                $l->set("type", MS_LAYER_POINT);
                            }
                            $l->set("status", MS_DEFAULT);
                            $sld = $l->generateSLD();
                            if ($sld != "") {
                                $l->setmetadata("wms_sld_body", str_replace('"', "'", $sld));
                            }
                            $l->set("type", $tipotemp);
                            $l->set("status", $statustemp);
                        }
                        $this->layer->cloneInlineSymbol($maptemp, $l, $map);
                        if ($l->type == MS_LAYER_POLYGON && $l->getmetadata("METAESTAT") == "SIM") {
                            $mapObj->insertLayer($l, 0);
                        } else {
                            $mapObj->insertLayer($l, - 1);
                        }
                        $layerobj = $mapObj->getlayerbyname($l->name);
                        $this->layer->fixLayerGrid($l, $layerobj);
                        $this->correctShapefilePath($mapObj, $layerobj);
                        $this->correctClassLegend($layerobj);
                    }
                }
            }
        }
        ($save) ? $mapObj->save($_SESSION["map_file"]) : "";
        return true;
    }

    /**
     * Muda o status dos layers indicados para default
     *
     * @param string $layers
     *            lista de 'names' dos layers
     */
    function layersOn($mapId, $layernames, $save = true, $mapObj = false)
    {
        $layernames = str_replace(" ", ",", $layernames);
        $lista = explode(",", $layernames);
        if (count($lista) == 0) {
            return false;
        }
        if ($this->open($mapId) == false) {
            return false;
        }
        if ($mapObj == false) {
            $mapObj = ms_newMapObj($_SESSION["map_file"]);
        }
        foreach ($lista as $l) {
            if ($l == "") {
                continue;
            }
            if (@$mapObj->getLayerByName($l)) {
                $layer = $mapObj->getLayerByName($l);
                $layer->set("status", MS_DEFAULT);
            }
            $grupos = $mapObj->getLayersIndexByGroup($l);
            if (count($grupos) > 0) {
                for ($i = 0; $i < count($grupos); ++ $i) {
                    $layer = $mapObj->getLayer($grupos[$i]);
                    if (strtolower($layer->group) == strtolower($l)) {
                        $layer->set("status", MS_DEFAULT);
                    }
                }
            }
        }
        ($save) ? $mapObj->save($_SESSION["map_file"]) : "";
        return true;
    }

    function reordenatemas($lista)
    {
        // error_log("kkkk-------".$lista);
        $nlayers = $this->mapa->numlayers;
        $lista = explode(",", $lista);
        $lista = array_reverse($lista);
        $novaordem = array();
        foreach ($lista as $l) {
            for ($i = 0; $i < $nlayers; ++ $i) {
                $la = $this->mapa->getlayer($i);
                // $la->set("status",MS_DEFAULT);
                if (strtolower($la->getmetadata("escondido")) == "sim") {
                    if (! in_array($la->index, $novaordem)) {
                        $novaordem[] = $i;
                        // error_log("-------xxx".$la->name);
                    }
                } else {
                    // $g = strtoupper($la->group);
                    $n = strtoupper($la->name);
                    // if ((strtoupper($l) == $n) || (strtoupper($l) == $g)){
                    if (strtoupper($l) == $n) {
                        $novaordem[] = $i;
                    }
                }
            }
        }
        // acrescenta os layers que ficaram de fora
        for ($i = 0; $i < $nlayers; ++ $i) {
            if (! in_array($i, $novaordem)) {
                $novaordem[] = $i;
            }
        }
        $this->mapa->setlayersdrawingorder($novaordem);
        return "ok";
    }

    /**
     * Muda o status dos layers indicados para off
     *
     * @param string $layers
     *            lista de 'names' dos layers
     */
    function layersOff($mapId, $layernames, $save = true, $mapObj = false)
    {
        $layernames = str_replace(" ", ",", $layernames);
        $lista = explode(",", $layernames);
        if (count($lista) == 0) {
            return false;
        }
        if ($this->open($mapId) == false) {
            return false;
        }
        if ($mapObj == false) {
            $mapObj = ms_newMapObj($_SESSION["map_file"]);
        }
        foreach ($lista as $l) {
            if ($l == "") {
                continue;
            }
            if (@$mapObj->getLayerByName($l)) {
                $layer = $mapObj->getLayerByName($l);
                $layer->set("status", MS_OFF);
            }
            $grupos = $mapObj->getLayersIndexByGroup($l);
            if (count($grupos) > 0) {
                for ($i = 0; $i < count($grupos); ++ $i) {
                    $layer = $mapObj->getLayer($grupos[$i]);
                    if (strtolower($layer->group) == strtolower($l)) {
                        $layer->set("status", MS_OFF);
                    }
                }
            }
        }
        ($save) ? $mapObj->save($_SESSION["map_file"]) : "";
        return true;
    }

    function correctShapefilePath($mapobj, $layerobj)
    {
        if ($layerobj->connectiontype == MS_SHAPEFILE) {
            if ($mapobj->shapepath != "") {
                // o nome do arquivo pode conter .shp ou nao
                if (file_exists($mapobj->shapepath . "/" . $layerobj->data)) {
                    $layerobj->set("data", $mapobj->shapepath . "/" . $l->data);
                }
                if (file_exists($mapobj->shapepath . "/" . $layerobj->data . ".shp")) {
                    $layerobj->set("data", $mapobj->shapepath . "/" . $layerobj->data . ".shp");
                }
            }
        }
    }

    function correctClassLegend($layerobj)
    {
        if ($layerobj->getmetadata("classe") == "") {
            $layerobj->setmetadata("classe", "");
        }
        $pr = $layerobj->getProcessing();
        if (! in_array("LABEL_NO_CLIP=True", $pr)) {
            $layerobj->setprocessing("LABEL_NO_CLIP=True");
        }
        if (! in_array("POLYLINE_NO_CLIP=True", $pr)) {
            $layerobj->setprocessing("POLYLINE_NO_CLIP=True");
        }
    }

    /**
     * Muda o status dos layers indicados para delete
     *
     * @param string $mapId
     *            id do mapa
     * @param string $layers
     *            lista de 'names' dos layers
     */
    function layersDelete($mapId, $layernames, $save = true, $mapObj = false)
    {
        $layernames = str_replace(" ", ",", $layernames);
        $lista = explode(",", $layernames);
        if (count($lista) == 0) {
            return false;
        }
        if ($this->open($mapId) == false) {
            return false;
        }
        $this->clearQyfile($_SESSION["map_file"]);
        if ($mapObj == false) {
            $mapObj = ms_newMapObj($_SESSION["map_file"]);
        }
        foreach ($lista as $l) {
            if ($l == "") {
                continue;
            }
            if (@$mapObj->getLayerByName($l)) {
                $layer = $mapObj->getLayerByName($l);
                $layer->set("status", MS_DELETE);
            }
            $grupos = $mapObj->getLayersIndexByGroup($l);
            if (count($grupos) > 0) {
                for ($i = 0; $i < count($grupos); ++ $i) {
                    $layer = $mapObj->getLayer($grupos[$i]);
                    if (strtolower($layer->group) == strtolower($l)) {
                        $layer->set("status", MS_DELETE);
                    }
                }
            }
        }
        ($save) ? $mapObj->save($_SESSION["map_file"]) : "";
        return true;
    }

    function reorderLayers($mapId, $layernames, $save = true, $mapObj = false)
    {
        $layernames = str_replace(" ", ",", $layernames);
        $lista = explode(",", $layernames);
        if (count($lista) == 0) {
            return false;
        }
        if ($this->open($mapId) == false) {
            return false;
        }
        if ($mapObj == false) {
            $mapObj = ms_newMapObj($_SESSION["map_file"]);
        }
        $nlayers = $mapObj->numlayers;
        $lista = array_reverse($lista);
        $novaordem = array();
        foreach ($lista as $l) {
            for ($i = 0; $i < $nlayers; ++ $i) {
                $la = $mapObj->getlayer($i);
                if (strtolower($la->getmetadata("escondido")) == "sim") {
                    if (! in_array($la->index, $novaordem)) {
                        $novaordem[] = $i;
                    }
                } else {
                    $n = strtoupper($la->name);
                    if (strtoupper($l) == $n) {
                        $novaordem[] = $i;
                    }
                }
            }
        }
        // acrescenta os layers que ficaram de fora
        for ($i = 0; $i < $nlayers; ++ $i) {
            if (! in_array($i, $novaordem)) {
                $novaordem[] = $i;
            }
        }
        $mapObj->setlayersdrawingorder($novaordem);
        ($save) ? $mapObj->save($_SESSION["map_file"]) : "";
        return true;
    }

    function getLegendParameters($mapId, $w = 25, $h = 25, $mapObj = false)
    {
        if ($this->open($mapId) == false) {
            return false;
        }
        if ($mapObj == false) {
            $mapObj = ms_newMapObj($_SESSION["map_file"]);
        }
        $l = "";
        $numlayers = $mapObj->numlayers;
        $desligar = array();
        $legenda = array();
        for ($i = 0; $i < $numlayers; ++ $i) {
            $la = $mapObj->getlayer($i);
            if (strtoupper($la->getmetadata("CLASSE")) == "NAO" || strtoupper($la->getmetadata("ESCONDIDO")) == "SIM") {
                $la->set("status", MS_OFF);
            }
            $desligarLayer = array();
            if ($la->status == MS_DEFAULT) {
                // "legendawms" "http://mapas.mma.gov.br/cgi-bin/mapserv?map=/opt/www/html/webservices/biorregioes.map&service=wms&request=getlegendgraphic&version=1.1.1&service=wms&layer=biomas&format=image/png"

                if ($la->getmetadata("legendaimg") != "" || $la->getmetadata("legendawms") != "") {
                    $imagem = $la->getmetadata("legendaimg");
                    if ($imagem == "") {
                        $imagem = $la->getmetadata("legendawms");
                    }
                    $classes = array();
                    $classes[] = array(
                        "nome" => "",
                        "img" => $imagem,
                        "checked" => "checked",
                        "index" => 0,
                        "layer" => $la->name
                    );
                    $legenda[] = array(
                        "layer" => $la->name,
                        "nome" => $this->util->utf2iso($la->getmetadata("tema")),
                        "classes" => $classes,
                        "tipo" => "imagem"
                    );
                } else {
                    $la->set("minscaledenom", 0);
                    $la->set("maxscaledenom", 0);
                    $nc = $la->numclasses;
                    $classes = array();
                    for ($c = 0; $c < $nc; $c ++) {
                        $ck = "checked";
                        $classe = $la->getclass($c);
                        if ($classe->status == MS_OFF) {
                            $ck = "";
                        }
                        $cores = array(
                            "color" => "-1 -1 -1",
                            "outline" => "-1 -1 -1",
                            "background" => "-1 -1 -1"
                        );
                        // o simbolo pode ser definido apenas com base nas cores
                        $simple = true;

                        // remove o offset em simbolos do tipo imagem
                        if ($classe->numstyles > 0) {
                            $estilo = $classe->getstyle(0);
                            $simbolo = $mapObj->getSymbolObjectById($estilo->symbol);
                            if ($simbolo != "") {
                                if ($estilo->symbolname != "" && $simbolo->imagepath != "") {
                                    $estilo->set("offsetx", 0);
                                    $estilo->set("offsety", 0);
                                }
                            }
                            $cor = array(
                                "color" => $this->util->objColor2RGB($estilo->color),
                                "outline" => $this->util->objColor2RGB($estilo->outlinecolor),
                                "background" => $this->util->objColor2RGB($estilo->backgroundcolor)
                            );
                            if ($estilo->symbolname != "" && $estilo->symbolname != "linha" && $estilo->symbolname != "ponto") {
                                $simple = false;
                            }
                        }
                        $imagem = $classe->createLegendIcon($w, $h)->saveWebImage();
                        $classes[] = array(
                            "nome" => $this->util->utf2iso($classe->name),
                            "img" => $imagem,
                            "checked" => $ck,
                            "index" => $c,
                            "layer" => $la->name,
                            "cor" => $cor,
                            "w" => $w,
                            "h" => $h,
                            "minscaledenom" => $classe->minscaledenom,
                            "maxscaledenom" => $classe->maxscaledenom,
                            "simple" => $simple
                        );
                    }
                    $legenda[] = array(
                        "layer" => $la->name,
                        "nome" => $this->util->utf2iso($la->getmetadata("tema")),
                        "classes" => $classes,
                        "tipo" => ""
                    );
                }
            }
        }
        return (array(
            "legenda" => $legenda
        ));
    }

    function setSize($mapId, $w, $h)
    {
        if ($this->open($mapId) == false) {
            return false;
        }
        $mapObj = ms_newMapObj($_SESSION["map_file"]);
        $mapObj->setsize($w, $h);
        $salvo = $mapObj->save($_SESSION["map_file"]);
        $this->setQueryMapSize($w, $h);
        return true;
    }

    function setQueryMapSize($w, $h)
    {
        // le o map file
        $qyfile = str_replace(".map", ".qy", $_SESSION["map_file"]);
        if ($this->open($mapId) == false) {
            return false;
        }
        $mapObj = ms_newMapObj($_SESSION["map_file"]);
        if (! file_exists($qyfile)) {
            return true;
        }
        $abre = fopen($qyfile, "r");
        while (! feof($abre)) {
            $buffer = fgets($abre);
            $maparray[] = $buffer;
        }
        fclose($abre);
        $novoarray = array();
        $conta = 0;
        $pega = "nao";
        // procura a string "querymap"
        foreach ($maparray as $e) {
            $testa = explode("QUERYMAP", $e);
            if (count($testa) > 1) {
                $pega = "sim";
            } else {
                $pega = "nao";
            }
            $testa = explode("SIZE", $e);
            if ((count($testa) > 1) && ($pega == "sim")) {
                $e = "SIZE " . $w . " " . $h;
                $pega = "nao";
            }
            $novoarray[] = $e;
        }
        // salva o mapfile
        $abre = fopen($qyfile, "wt");
        foreach ($novoarray as $linha) {
            $escreve = fwrite($abre, $linha);
        }
        $fecha = fclose($abre);
        return true;
    }

    function centerPoint($mapId, $x, $y)
    {
        if ($this->open($mapId) == false) {
            return false;
        }
        $mapObj = ms_newMapObj($_SESSION["map_file"]);
        $pt = ms_newPointObj();
        $e = $mapObj->extent;
        $pt = $this->xy2pixel($mapObj, $x, $y);
        $mapObj->zoompoint(1, $pt, ($mapObj->width), ($mapObj->height), $e);
        $mapObj->save($_SESSION["map_file"]);
        return true;
    }

    /**
     *
     * @param object $mapObj
     * @param number $x
     * @param number $y
     * @return object
     */
    function xy2pixel($mapObj, $x, $y)
    {
        $pt = ms_newPointObj();
        $mapObj->prepareImage();
        $e = $mapObj->extent;
        $vx = ($e->minx * - 1) - ($x * - 1);
        $vy = ($y * - 1) + ($e->maxy * 1);
        $c = $mapObj->cellsize;
        $x = $vx / $c;
        $y = $vy / $c;
        $pt->setXY($x, $y);
        return $pt;
    }

    function createLayerPointFeature($mapId, $symbol = "marca", $x, $y, $offsetx, $offsety, $color = "255,0,0", $size = 5, $layerTitle = "Pontos inseridos")
    {
        if ($this->open($mapId) == false) {
            return false;
        }
        $mapObj = ms_newMapObj($_SESSION["map_file"]);
        $pinlayer = $this->createLayer($mapObj, MS_LAYER_POINT, MS_DEFAULT, $layerTitle);
        $c = $pinlayer->getclass(0);
        $c->set("name", "");
        $e = $c->getstyle(0);
        $e->set("size", $size);
        $e->set("symbolname", $symbol);
        $e->set("size", $size);
        $core = $e->color;
        $color = explode(",", str_replace(" ", ",", $color));
        $core->setrgb($color[0], $color[1], $color[2]);
        $pinlayer->setmetadata("tema", $layerTitle);
        $shp = ms_newshapeobj(MS_SHAPE_POINT);
        $lin = ms_newlineobj();
        $lin->addxy($x, $y);
        $shp->add($lin);
        $pinlayer->addfeature($shp);
        // verifica a projecao
        $c = $shp->getCentroid();
        if ($c->x > - 181 && $c->x < 181) {
            $pinlayer->setprojection($_SESSION["i3GeoProjDefault"]["proj4"]);
            $extensao = ($c->x - 0.01) . " " . ($c->y - 0.01) . " " . ($c->x + 0.01) . " " . ($c->y + 0.01);
        } else {
            $pinlayer->setprojection($mapObj->getProjection());
            $extensao = ($c->x - 50000) . " " . ($c->y - 50000) . " " . ($c->x + 50000) . " " . ($c->y + 50000);
        }
        $pinlayer->setmetadata("extensao", $extensao);
        $mapObj->save($_SESSION["map_file"]);
        return true;
    }

    function createLayer($mapObj, $ms_tipo, $ms_status, $title)
    {
        $l = ms_newLayerObj($mapObj);
        $l->set("type", $ms_tipo);
        $l->set("name", uniqid("i3geomap"));
        $l->setmetadata("tema", $title);
        $l->setmetadata("classe", "SIM");
        $l->set("status", $ms_status);
        $l->set("template", "none.htm");
        $l->setprocessing("LABEL_NO_CLIP=True");
        $l->setprocessing("POLYLINE_NO_CLIP=True");
        $classe = ms_newClassObj($l);
        $classe->set("name", "");
        $estilo = ms_newStyleObj($classe);
        $cor = $estilo->color;
        $cor->setrgb(31, 165, 165);
        $coro = $estilo->outlinecolor;
        $coro->setrgb(0, 0, 0);
        if ($ms_tipo == MS_LAYER_POINT) {
            $estilo->set("size", 4);
            $estilo->set("symbolname", "ponto");
        }
        // reposiciona o layer na pilha
        $ltipo = $l->type;
        if (($ltipo == 2) || ($ltipo == 3)) {
            $indicel = $l->index;
            $numlayers = $mapObj->numlayers;
            $nummove = 0;
            for ($i = $numlayers - 1; $i > 0; $i --) {
                $layerAbaixo = $mapObj->getlayer($i);
                $tipo = $layerAbaixo->type;
                if (($tipo != 2) && ($tipo != 3)) {
                    $nummove ++;
                }
            }
            if ($nummove > 2) {
                for ($i = 0; $i <= ($nummove - 3); ++ $i) {
                    $mapObj->movelayerup($indicel);
                }
            }
        }
        return $l;
    }

    function extentToLayer($mapId, $layerName)
    {
        if ($this->open($mapId) == false) {
            return false;
        }
        $mapObj = ms_newMapObj($_SESSION["map_file"]);
        $layerObj = $mapObj->getLayerByname($layerName);
        if($mapObj->getmetadata("interface") == "googlemaps"){
            $projO = $mapObj->getProjection();
            $mapObj->setProjection($_SESSION["i3GeoProjDefault"]["proj4"]);
        }
        $prjMapa = "";
        $prjTema = "";
        if($layerObj->type != MS_LAYER_RASTER){
            $prjMapa = $mapObj->getProjection();
            $prjTema = $layerObj->getProjection();
        }
        $extatual = $mapObj->extent;
        $ret = $layerObj->getmetadata("extensao");
        //
        //necess&aacute;rio para evitar que em qualquer redesenho do mapa, seja aplicado o zoom para o tema marcado com aplicaextensao
        //
        $layerObj->setmetadata("aplicaextensao","");
        if($ret == "" && $layerObj->type == MS_LAYER_RASTER){
            $ret = "-75.233614607 -33.7515829981 -27.592958622 5.272156";
        }
        if ($ret == ""){
            $ret = $layerObj->getextent();
            //reprojeta o retangulo
            if (($prjTema != "") && ($prjMapa != $prjTema))
            {
                $projInObj = ms_newprojectionobj($prjTema);
                $projOutObj = ms_newprojectionobj($prjMapa);
                $ret->project($projInObj, $projOutObj);
            }
            $extatual->setextent($ret->minx,$ret->miny,$ret->maxx,$ret->maxy);
        }
        else{
            $ret = explode(" ",$ret);
            $extatual->setextent($ret[0],$ret[1],$ret[2],$ret[3]);
        }
        if($mapObj->getmetadata("interface") == "googlemaps"){
            $mapObj->setProjection($projO);
        }
        $e = $mapObj->extent;
        $ext = $e->minx . " " . $e->miny . " " . $e->maxx . " " . $e->maxy;
        $mapObj->save($_SESSION["map_file"]);
        return($ext);
    }
}