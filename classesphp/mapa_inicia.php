<?php

/*
 * Title: mapa_inicia.php
 *
 * Inicia um novo mapa.
 *
 * Gera as imagens necess&aacute;rias para abrir o mapa e calcula um conjunto de vari&aacute;veis necess&aacute;rias
 * ao funcionamento do i3Geo. Os dados s&atilde;o devolvidos como um objeto json. Conforme a interface
 * que ser&aacute; utilizada pelo mapa, s&atilde;o feitos ajustes espec&iacute;ficos.
 *
 * Licenca:
 *
 * GPL2
 *
 * i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet
 *
 * Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
 * Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com
 *
 * Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
 * e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
 * GNU conforme publicada pela Free Software Foundation;
 *
 * Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
 * por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
 * de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
 * Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
 * Voc&ecirc; deve ter recebido uma copia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a
 * Free Software Foundation, Inc., no endere&ccedil;o
 * 59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 *
 * Arquivo:
 *
 * i3geo/classesphp/mapa_inicia.php
 */

/*
 * Function: iniciaMapa
 *
 * Inicia um mapa e obt&eacute;m os par&acirc;metros necess&aacute;rios para o funcionamento da interface HTML.
 *
 * Para permitir a troca din&acirc;mica de interfaces, s&atilde;o gravados no mapfile os METADATA status e opacity, com o prefixo "ol" para OpenLayers e "gm" para Google Maps e Earth
 *
 * Globais:
 *
 * $interface - nome da interface que ser&aacute; utilizada pelo mapa padrao|openlayers|googlemaps|googleearth|flamingo . O valor de $interface &eacute; tamb&eacute;m armazenado no metadata "interface" do objeto Map, podendo ser utilizada em outros programas do i3Geo.
 *
 * $openid - indica se o usu&aacute;rio foi ou n&atilde;o autenticado em alguma rede social (veja i3geo/pacotes/openid)
 *
 * $interfacePadrao - interface definida em ms_configura.php
 *
 * $navegadoresLocais - array que indica quais usu&aacute;rios podem navegar no servidor
 *
 * $cp - Objeto CPAINT.
 *
 * $map_file - Arquivo map file.
 *
 * $mapext - Extens&atilde;o geogr&aacute;fica do mapa.
 *
 * $w - Largura da imagem do mapa.
 *
 * $h - Altura da imagem do mapa.
 *
 * $R_path - Vari&aacute;vel definida no arquivo ms_configura.php que indica se o software R est&aacute; instalado.
 *
 * $locmapserv - Vari&aacute;vel definida no arquivo ms_configura.php que indica nome do mapserver cgi.
 *
 * $kmlurl - url de um arquivo kml que ser&aacute; inserido no mapa. V&aacute;lido para a interface google maps
 *
 * Retorno:
 *
 * {JSON}
 *
 * (start code)
 *
 * {
 * variaveis:,
 * temas:[{
 * "name":,
 * "status":,
 * "tema":,
 * "transparency":,
 * "type":,
 * "sel":,
 * "escala":,
 * "download":,
 * "features":,
 * "connectiontype":,
 * "zoomtema":,
 * "contextoescala":,
 * "etiquetas":,
 * "identifica":,
 * "editorsql":,
 * "escondido":
 * }]
 * }
 *
 * (end)
 */
 function iniciaMapa($w, $h, $kmlurl)
{
    //
    // verifica se algum tema e restrito a determinado usuario
    // as funcoes de validacao encontram-se em funcoes_gerais.php
    //
    include ($_SESSION["locaplic"]."/classesphp/classe_mapa.php");
    if (! function_exists("validaAcessoTemas")) {
        include ($_SESSION["locaplic"]."/classesphp/funcoes_gerais.php");
    }
    validaAcessoTemas($_SESSION["map_file"]);

    if ($_SESSION["dir_tmp"] != "" && isset($_SESSION["logExec"]) && $_SESSION["logExec"]["init"] == true) {
        i3GeoLog("prog: iniciaMapa interface: ".$_SESSION["interface"], $_SESSION["dir_tmp"]);
    }

    if (! isset($kmlurl)) {
        $kmlurl = "";
    }
    // error_reporting(0);
    if (! isset($_SESSION["interface"])) {
        $_SESSION["interface"] = "";
    }
    if ($_SESSION["interface"] == "openlayers") {
        $m = ms_newMapObj($_SESSION["map_file"]);
        $e = $m->extent;
        $ext = ($e->minx) . " " . ($e->miny) . " " . ($e->maxx) . " " . ($e->maxy);
        $c = $m->numlayers;
        for ($i = 0; $i < $c; ++ $i) {
            $layer = $m->getlayer($i);
            if ($layer->status == 2) {
                $layer->setmetadata("olstatus", "DEFAULT");
            } else {
                $layer->setmetadata("olstatus", "OFF");
            }
            $layer->setmetadata("olopacity", $layer->opacity);
            // error_log($layer->name);
        }
        $m->save($_SESSION["map_file"]);
    }
    if ($_SESSION["interface"] == "googlemaps") {
        $m = ms_newMapObj($_SESSION["map_file"]);
        $e = $m->extent;
        $ext = ($e->minx) . " " . ($e->miny) . " " . ($e->maxx) . " " . ($e->maxy);
        //if ($_SESSION["interface"] == "googlemaps") {
            $m->setProjection("+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m");
        //}
        $c = $m->numlayers;
        for ($i = 0; $i < $c; ++ $i) {
            $layer = $m->getlayer($i);
            if ($layer->status == 2) {
                $layer->setmetadata("gmstatus", "DEFAULT");
            } else {
                $layer->setmetadata("gmstatus", "OFF");
            }
            $layer->setmetadata("gmopacity", $layer->opacity);
            if ($layer->name == "mundo" || $layer->name == "estados") {
                $layer->set("status", MS_OFF);
            }
            if ($layer->type == MS_LAYER_POLYGON || $layer->type == MS_LAYER_RASTER) {
                if ($layer->opacity == "" || $layer->opacity == 100) {
                    $layer->set("opacity", 50);
                }
            }
            if ($layer->name == "rosadosventos" || $layer->name == "copyright") {
                $layer->set("status", MS_DELETE);
            }
        }
        $temp = $m->scalebar;
        $temp->set("status", MS_OFF);
        $c = $m->imagecolor;
        $c->setrgb(255, 255, 255);
        if ($_SESSION["interface"] == "googleearth") {
            $m->selectOutputFormat("jpeg");
            $of = $m->outputformat;
            $of->set("driver", "AGG/PNG");
        } else {
            $of = $m->outputformat;
        }
        $of->set("imagemode", MS_IMAGEMODE_RGBA);
        $of->set("transparent", MS_ON);
        $m->save($_SESSION["map_file"]);
    }
    $protocolo = explode("/", $_SERVER['SERVER_PROTOCOL']);
    $protocolo = $protocolo[0];
    $protocolo = strtolower($protocolo) . '://' . $_SERVER['SERVER_NAME'] . ":" . $_SERVER['SERVER_PORT'];
    $urli3geo = str_replace("/serverapi/map/index.php", "", $protocolo . $_SERVER["PHP_SELF"]);
    // altera o tamanho do query map para ficar igual ao do mapa
    sobeAnno($_SESSION["map_file"]);
    $m = new Mapa($_SESSION["map_file"]);
    if (isset($w)) {
        $m->mudaQS($w, $h);
        $m = new Mapa($_SESSION["map_file"]);
        $m->mapa->setsize($w, $h);
    }

    // error_reporting(0);
    //
    // verifica se a legenda deve ser embebida no mapa
    //
    $legenda = $m->mapa->legend;
    $legenda->set("status", MS_OFF);
    //
    // salva as altera&ccedil;&otilde;es feitas
    //
    $m->mapa->setmetadata("ows_enable_request", "*");
    $m->salva();
    //
    // cuidado ao mexer aqui
    // o mapa precisa ser salvo para registrar a extens&atilde;o geogr&aacute;fica
    //
    // $imgo = $m->mapa->draw();
    $imgo = $m->mapa->prepareImage();
    $m->salva($_SESSION["map_file"]);
    // $e = $m->mapa->extent;
    // $ext = ($e->minx)." ".($e->miny)." ".($e->maxx)." ".($e->maxy);
    $escalaMapa = $m->mapa->scaledenom;
    $celula = $m->mapa->cellsize;
    //
    // pega os parametros de cada tema
    //
    $qyfile = str_replace(".map", ".qy", $_SESSION["map_file"]);
    $arqsel = (file_exists($qyfile)) ? true : false;
    $m = new Mapa($_SESSION["map_file"], $_SESSION["locaplic"]);
    $temas = $m->parametrosTemas();
    $versao = versao();
    $temp = $m->mapa->scalebar;
    $temp->set("status", MS_OFF);
    $of = $m->mapa->outputformat;
    $of->set("imagemode", MS_IMAGEMODE_RGBA);
    $of->setOption("QUANTIZE_FORCE", "OFF");
    $of->set("driver", "AGG/PNG");
    $m->mapa->setmetadata("interface", $_SESSION["interface"]);
    $m->salva();
    $nomes = nomeRandomico(12);
    if ($imgo->imagepath == "") {
        echo "Erro IMAGEPATH vazio";
        exit();
    }

    $nomer = ($imgo->imagepath) . "mapa" . $nomes . ".png";
    $nomer = ($imgo->imageurl) . basename($nomer);
    // pega a cor de fundo do mapa
    $c = $m->mapa->imagecolor;
    $cordefundo = $c->red . "," . $c->green . "," . $c->blue;
    // pega o texto de copyright
    $copyright = "";
    $lc = @$m->mapa->getlayerbyname("copyright");
    if ($lc != "" && $lc->status == MS_DEFAULT) {
        if ($versao["principal"] >= 6) {
            $shape = $lc->getShape(new resultObj(0));
            $copyright = $shape->text;
        } else {
            $shape = $lc->getfeature(0, - 1);
            $copyright = $shape->text;
        }
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
    $res["mapres"] = $m->mapa->resolution;
    $res["pixelsize"] = $celula;
    $res["mapfile"] = "";
    $res["cgi"] = ""; // $locmapserv;
    $res["extentTotal"] = $ext;
    $res["mapimagem"] = ""; // $nomer;
    $geoip = "nao";
    $res["geoip"] = $geoip;
    $res["listavisual"] = "";
    // TODO depreciar na documentacao
    $res["utilizacgi"] = "nao"; // $utilizacgi;
    $res["versaoms"] = $versao["principal"];
    $res["versaomscompleta"] = $versao["completa"];
    $res["versaoint"] = $versao["inteiro"];
    $res["mensagens"] = $m->pegaMensagens();
    $res["r"] = (isset($_SESSION["R_path"])) ? "sim" : "nao";
    $res["extentref"] = "";
    $res["kmlurl"] = $kmlurl;
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
    if ($_SESSION["openid"] == true) {
        $res["autenticadoopenid"] = "sim";
    } else {
        $res["autenticadoopenid"] = "nao";
    }
    $res["emailInstituicao"] = $_SESSION["emailInstituicao"];
    $res["cordefundo"] = $cordefundo;
    $res["copyright"] = $copyright;
    $res["logado"] = $logado;
    $res["saikuUrl"] = $_SESSION["saikuUrl"];
    $res["statusFerramentas"] = $_SESSION["statusFerramentas"];
    $res["googleApiKey"] = $_SESSION["googleApiKey"];
    // parametros de inicializacao armazenados com o mapa quando o usuario utiliza a opcao de salvar mapa no nbanco de dados
    $customizacoesinit = $m->mapa->getmetadata("CUSTOMIZACOESINIT");
    $res["editavel"] = $m->mapa->getmetadata("EDITAVEL");
    $m->mapa->setmetadata("CUSTOMIZACOESINIT", "");
    $m->salva();
    restauraCon($_SESSION["map_file"], $_SESSION["postgis_mapa"]);
    copy($_SESSION["map_file"], (str_replace(".map", "reinc.map", $_SESSION["map_file"])));
    copy($_SESSION["map_file"], (str_replace(".map", "seguranca.map", $_SESSION["map_file"])));
    return array(
        "variaveis" => $res,
        "temas" => $temas,
        "customizacoesinit" => $customizacoesinit
    );
}