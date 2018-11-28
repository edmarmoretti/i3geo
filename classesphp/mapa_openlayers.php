<?php
/*
 * Title: mapa_openlayers.php
 *
 * Faz o processamento de um mapfile segundo as necessidades do i3geo, como por exemplo, fazendo a substitui&ccedil;&atilde;o
 * das vari&aacute;veis de conex&atilde;o com banco e outras opera&ccedil;&otilde;es espec&iacute;ficas do i3Geo.
 *
 * &Eacute; utilizado especificamente nas interfaces que utilizam a biblioteca OpenLayers.
 *
 *
 * Parametros:
 *
 * g_sid {string} - codigo da "section" PHP
 *
 * tipolayer {fundo|} - (opcional) indica que a imagem a ser produzida comp&otilde;e o fundo do mapa
 *
 * BBOX {xmin xmax ymin ymax} - extens&atilde;o geogr&aacute;fica a ser utilizada no desenho do mapa
 *
 * WIDTH {numeric} - largura do mapa
 *
 * HEIGHT {numeric} - altura do mapa
 *
 * layer {string} - codigo do layer existente no mapa que ser&aacute; desenhado
 *
 * DESLIGACACHE {sim|nao} - for&ccedil;a a n&atilde;o usar o cache de imagens qd definido como "sim", do contr&aacute;rio, o uso ou n&atilde;o do cache ser&aacute; definido automaticamente
 *
 * TIPOIMAGEM {cinza|sepiaclara|sepianormal|negativo|detectaBordas|embassa|gaussian_blur|selective_blur|mean_removal|pixelate
 * } - filtro de imagem que ser&aacute; aplicado na imagem
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
 * i3geo/classesphp/mapa_openlayers.php
 *
 */

//include ("sani_request.php");
// para efeitos de compatibilidade
if (! function_exists('ms_GetVersion')) {
    include_once ("carrega_ext.php");
}

error_reporting(0);
inicializa();

if(!isset($_GET["cacheprefixo"])){
    $_GET["cacheprefixo"] = "";
}

//
// calcula a extensao geografica com base no x,y,z
// nos casos do modo notile, a requisicao e feita como se fosse um wms
// quando for do tipo tms $_GET["tms"] contem os parametros do tile
//
if (!empty($_GET["tms"])) {
    $_GET["WIDTH"] = 256;
    $_GET["HEIGHT"] = 256;
    $temp = explode("/", $_GET["tms"]);
    //var_dump($temp);exit;
    $z = $temp[2];
    $x = $temp[3];
    $y = str_replace(".png", "", $temp[4]);

    $n = pow(2, $z + 1);
    $lon1 = $x / $n * 360.0 - 180.0;
    $lon2 = ($x + 1) / $n * 360.0 - 180.0;
    $n = pow(2, $z);
    $lat1 = $y / $n * 180.0 - 90.0;
    $lat2 = ($y + 1) / $n * 180.0 - 90;
    $_GET["BBOX"] = $lon1 . " " . $lat1 . " " . $lon2 . " " . $lat2;
}
//echo $_GET["BBOX"];exit;
// para o caso da versao 3 do OpenLayers
if (isset($_GET["X"]) && ! ($_GET["REQUEST"] == "getfeatureinfo" || $_GET["REQUEST"] == "GetFeatureInfo" || strtolower($_GET["REQUEST"]) == "getfeature")) {
    $box = str_replace(" ", ",", $_GET["BBOX"]);
    $box = explode(",", $box);
    $res = ($box[2] + 180) - ($box[0] + 180);
    $res = $res / 256;
    $z = intval((0.703125 / $res) / 4) + 1;
    $x = floor((($box[0] + 180) / 360) * pow(2, $z));
    $y = floor((1 - log(tan(deg2rad($box[3])) + 1 / cos(deg2rad($box[3]))) / pi()) / 2 * pow(2, $z));

    $_GET["WIDTH"] = 256;
    $_GET["HEIGHT"] = 256;
    $_GET["tms"] = "/" . $_GET["layer"] . "/" . $z . "/" . $x . "/" . $y . ".png";
}
if (isset($_GET["TileMatrix"])) {
    if(empty($_GET["WIDTH"])){
        $_GET["WIDTH"] = 256;
        $_GET["HEIGHT"] = 256;
    }
    $z = $_GET["TileMatrix"];
    $x = $_GET["TileCol"];
    $y = $_GET["TileRow"];
    // calcula resolucoes
    $res = array();
    $temp = 0.703125;
    for ($i = 0; $i < 40; $i ++) {
        $res[] = $temp;
        $temp = $temp / 2;
    }

    $_GET["tms"] = "/wmts/" . $_GET["layer"] . "/" . $z . "/" . $x . "/" . $y . ".png";
    if($_GET["cacheprefixo"] != ""){
        $_GET["tms"] = "/wmts/" . $_GET["cacheprefixo"] . $_GET["layer"] . "/" . $z . "/" . $x . "/" . $y . ".png";
    }

    if ($z . "/" . $x . "/" . $y == "0/0/0" || $x == - 1 || $y == - 1) {
        return;
    }
    $top_left_minx = - 180;
    $top_left_maxy = 90;

    $x_size = $res[$z - 1] * $_GET["WIDTH"];
    $y_size = $x_size;

    $lon1 = $top_left_minx + ($x * $x_size);
    $lat1 = $top_left_maxy - ($y * $y_size) - $y_size;
    $lon2 = $top_left_minx + ($x * $x_size) + $x_size;
    $lat2 = $top_left_maxy - ($y * $y_size);

    $_GET["BBOX"] = $lon1 . " " . $lat1 . " " . $lon2 . " " . $lat2;
}

$map_fileX = $_SESSION["map_file"];
//
// verifica se o request e OGC
if (! empty($_GET["request"])) {
    $_GET["REQUEST"] = $_GET["request"];
}

$qyfile = dirname($map_fileX) . "/" . $_GET["layer"] . "_qy.map";
$qy = file_exists($qyfile);
if (! isset($_GET["DESLIGACACHE"])) {
    $_GET["DESLIGACACHE"] = "nao";
}
if (isset($_GET["REQUEST"])) {
    if ($_GET["REQUEST"] == "getlegendgraphic" || $_GET["REQUEST"] == "getfeatureinfo" || $_GET["REQUEST"] == "GetFeatureInfo" || strtolower($_GET["REQUEST"]) == "getfeature") {
        $_GET["DESLIGACACHE"] = "sim";
    }
}
//FORMAT pode ser utfgrid
if(!isset($_GET["FORMAT"])){
    $_GET["FORMAT"] = "";
}
if ($qy == false && $_GET["cache"] == "sim" && $_GET["DESLIGACACHE"] != "sim") {
    carregaCacheImagem($_SESSION["cachedir"], $_SESSION["map_file"], $_GET["tms"], $_SESSION["i3georendermode"], $_GET["FORMAT"]);
}
//
// map_fileX e para o caso register_globals = On no PHP.INI
//
if (isset($_GET["tipolayer"]) && $_GET["tipolayer"] == "fundo") {
    $map_fileX = str_replace(".map", "fundo.map", $map_fileX);
}
$postgis_mapa = $_SESSION["postgis_mapa"];

// por seguranca
//include_once ("funcoes_gerais.php");
$cachedir = $_SESSION["cachedir"];
if (isset($_GET["BBOX"])) {
    $_GET["mapext"] = str_replace(",", " ", $_GET["BBOX"]);
    $_GET["map_size"] = $_GET["WIDTH"] . " " . $_GET["HEIGHT"];
}
$_GET["TIPOIMAGEM"] = trim($_GET["TIPOIMAGEM"]);
$mapa = ms_newMapObj($map_fileX);
//
// processa os layers do mapfile
//
$numlayers = $mapa->numlayers;
$cache = false;
for ($i = 0; $i < $numlayers; ++ $i) {
    $l = $mapa->getLayer($i);
    $layerName = $l->name;
    if ($layerName != $_GET["layer"]) {
        $l->set("status", MS_OFF);
    }
    // no caso de haver uma mascara definida no layer
    if (ms_GetVersionInt() >= 60200) {
        if ($l->mask != "") {
            $lmask = $mapa->getlayerbyname($l->mask);
            if (! empty($postgis_mapa)) {
                if ($lmask->connectiontype == MS_POSTGIS) {
                    $lcon = $l->connection;
                    if (($lcon == " ") || ($lcon == "") || (in_array($lcon, array_keys($postgis_mapa)))) {
                        if (($lcon == " ") || ($lcon == "")) {
                            $lmask->set("connection", $postgis_mapa);
                        } else {
                            $lmask->set("connection", $postgis_mapa[$lcon]);
                        }
                    }
                }
            }
        }
    }
    if ($layerName == $_GET["layer"] || $l->group == $_GET["layer"] && $l->group != "") {
        if ($l->getmetadata("classesnome") != "" || $l->getmetadata("palletefile") != "") {
            if (! function_exists("autoClasses")) {
                include_once ("funcoes_gerais.php");
            }
            autoClasses($l, $mapa);
        }
        //
        // numero de pixels que serao considerados para corte da imagem no caso de cache ativo e tema de pontos
        //
        $cortePixels = 0;
        if ($l->getmetadata("cortepixels") != "" && $qy == false) {
            $cortePixels = $l->getmetadata("cortepixels");
        }
        $l->set("status", MS_DEFAULT);
        //a opacidade e controlada pela aplicacao
        //a renderiazacao e sempre com opacidade 1
        $l->updateFromString('LAYER COMPOSITE OPACITY 100 END END');
        $l->set("template", "none.htm");
        if (! empty($postgis_mapa)) {
            if ($l->connectiontype == MS_POSTGIS) {
                $lcon = $l->connection;
                if (($lcon == " ") || ($lcon == "") || (in_array($lcon, array_keys($postgis_mapa)))) {
                    if (($lcon == " ") || ($lcon == "")) {
                        $l->set("connection", $postgis_mapa);
                    } else {
                        $l->set("connection", $postgis_mapa[$lcon]);
                    }
                }
            }
        }
    }
    if (isset($_GET["REQUEST"])) {
        if ($_GET["REQUEST"] == "getlegendgraphic") {
            $nclass = $l->numclasses;
            for ($ic = 0; $ic < $nclass; $ic ++) {
                $classe = $l->getclass($ic);
                if ($classe->title === "") {
                    $classe->title = $classe->name;
                }
            }
        }
    }

    if ($layerName == $_GET["layer"]) {
        if (strtolower($l->getmetadata("cache")) == "sim") {
            $cache = true;
            $nomecache = $l->getmetadata("nomeoriginal");
            if ($nomecache == "") {
                $nomecache = $layerName;
            }
        }
        if (isset($_GET["REQUEST"])) {
            if ($_GET["REQUEST"] == "getfeatureinfo" || $_GET["REQUEST"] == "GetFeatureInfo" || strtolower($_GET["REQUEST"]) == "getfeature") {
                $l->setmetadata("gml_include_items", "all");
                $l->set("template", "none.htm");
                $l->setmetadata("WMS_INCLUDE_ITEMS", "all");
                $l->setmetadata("WFS_INCLUDE_ITEMS", "all");
                $l->setmetadata("ows_enable_request", "*");
                $l->set("dump", MS_TRUE);
                $l->setmetadata("ows_srs", "AUTO");
                if (strtolower($_GET["REQUEST"]) == "getfeature") {
                    $_GET["TYPENAME"] = $l->name;
                }
            }
        }
    }
    if ($layerName == $_GET["layer"] && ($_GET["FORMAT"] == "utfgrid")) {
        $_GET["SRS"] = "EPSG:4326";
        $mapa->setProjection("proj=latlong,a=6378137,b=6378137");
        include ("mapa_utfgrid.php");
        exit();
    }
}

if (! function_exists('imagepng')) {
    $_GET["TIPOIMAGEM"] = "";
}

if ($_GET["layer"] == "") {
    $cache = true;
}
if (($_GET == false) || ($qy) || (strtolower($_GET["DESLIGACACHE"]) == "sim")) {
    $cache = false;
} elseif ($_GET["TIPOIMAGEM"] != "" && $_GET["TIPOIMAGEM"] != "nenhum") {
    $cache = false;
}

if ($cache == true && $_GET["cache"] != "nao") {
    carregaCacheImagem($cachedir, $_SESSION["map_file"], $_GET["tms"]);
}
if (isset($_GET["map_size"])) {
    $map_size = explode(" ", $_GET["map_size"]);
    $mapa->setsize($map_size[0], $map_size[1]);
} else {
    $map_size = array(256,256);
    $mapa->setsize($map_size[0], $map_size[1]);
}

if (isset($_GET["mapext"])) {
    $mapext = explode(" ", $_GET["mapext"]);
    // para evitar erro quando o mapa e continuo
    if ($mapext[0] == $mapext[2] && $mapext[1] == $mapext[3]) {
        exit();
    }
    $mapa->setExtent($mapext[0], $mapext[1], $mapext[2], $mapext[3]);
}
//
// qd a cahamda e para um WMS, redireciona para ogc.php
//
if (isset($_GET["REQUEST"])) {
    if ($_GET["REQUEST"] == "getlegendgraphic" || $_GET["REQUEST"] == "getfeatureinfo" || $_GET["REQUEST"] == "GetFeatureInfo" || $_GET["REQUEST"] == "getfeature") {
        $req = ms_newowsrequestobj();
        if ($_GET["BBOX"]) {
            $_GET["BBOX"] = str_replace(" ", ",", $_GET["BBOX"]);
        }
        $_GET = array_merge($_GET, $_POST);

        foreach ($_GET as $k => $v) {
            $req->setParameter($k, $v);
        }
        $proto = "http" . ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? "s" : "") . "://";
        $server = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : $_SERVER['SERVER_NAME'];
        $or = $proto . $server . $_SERVER['PHP_SELF'];
        $mapa->setmetadata("wfs_onlineresource", $or . "?" . $_SERVER["QUERY_STRING"]);
        ms_ioinstallstdouttobuffer();
        $mapa->owsdispatch($req);
        $contenttype = ms_iostripstdoutbuffercontenttype();
        header("Content-type: $contenttype");
        ms_iogetStdoutBufferBytes();
        ms_ioresethandlers();
        exit();
    }
}

$o = $mapa->outputformat;
$o->set("imagemode", MS_IMAGEMODE_RGBA);
$o->set("transparent", MS_TRUE);
$legenda = $mapa->legend;
$legenda->set("status", MS_OFF);
$escala = $mapa->scalebar;
$escala->set("status", MS_OFF);
//
// se o layer foi marcado para corte altera os parametros para ampliar o mapa
// antes de gerar a imagem
//
if ($cortePixels > 0) {
    // $mapa->prepareImage();
    // echo $mapa->scaledenom;exit;
    $escalaInicial = $mapa->scaledenom;
    $extensaoInicial = $mapa->extent;
    if(empty($_GET["WIDTH"])){
        $_GET["WIDTH"] = 256;
    }
    $wh = $_GET["WIDTH"] + ($cortePixels * 2);
    $mapa->setsize($wh, $wh);
    $ponto = new pointObj();
    $ponto->setxy(($wh / 2), ($wh / 2));
    $mapa->zoomScale($escalaInicial, $ponto, $wh, $wh, $extensaoInicial);
}
// se nao houver selecao
if ($qy != true) {
    $img = $mapa->draw();
} else {
    //$handle = fopen($qyfile, "r");
    //$conteudo = fread($handle, filesize($qyfile));
    //fclose($handle);
    $conteudo = file_get_contents($qyfile);
    $shp = unserialize($conteudo);
    $l = $mapa->getLayerByname($_GET["layer"]);
    $c = $mapa->querymap->color;
    if ($l->connectiontype != MS_POSTGIS ) {
        if($l->type == MS_LAYER_POINT){
            $numclasses = $l->numclasses;
            if ($numclasses > 0) {
                $classe0 = $l->getClass(0);
                $classe0->setexpression("");
                $classe0->set("name", " ");
                for ($i = 1; $i < $numclasses; ++ $i) {
                    $classe = $l->getClass($i);
                    $classe->set("status", MS_DELETE);
                }
            }
            if($l->type == MS_LAYER_POINT){
                $classe0->getstyle(0)->set("symbolname","ponto");
            }
        }
        $indxlayer = $l->index;
        foreach ($shp as $indx) {
            $mapa->querybyindex($indxlayer, - 1, $indx, MS_TRUE);
        }
        $qm = $mapa->querymap;
        $qm->set("width", $map_size[0]);
        $qm->set("height", $map_size[1]);
        $img = $mapa->drawQuery();
    } else {
        $img = $mapa->draw();
        $numclasses = $l->numclasses;
        if ($numclasses > 0) {
            $classe0 = $l->getClass(0);
            $classe0->setexpression("");
            $classe0->set("name", " ");
            for ($i = 1; $i < $numclasses; ++ $i) {
                $classe = $l->getClass($i);
                $classe->set("status", MS_DELETE);
            }
        }
        if($l->type == MS_LAYER_POINT){
            $classe0->getstyle(0)->set("symbolname","ponto");
        }
        $cor = $classe0->getstyle(0)->color;
        $cor->setrgb($c->red, $c->green, $c->blue);
        $status = $l->open();
        $status = $l->whichShapes($mapa->extent);
        while ($shape = $l->nextShape()) {
            if (in_array($shape->index, $shp))
                $shape->draw($mapa, $l, $img);
        }
        $l->close();
    }
    $cache = false;
}
// nao usa o cache pois e necessario processar a imagem com alguma rotina de filtro
if ($_GET["TIPOIMAGEM"] != "" && $_GET["TIPOIMAGEM"] != "nenhum") {
    if ($img->imagepath == "") {
        echo "Erro IMAGEPATH vazio";
        exit();
    }
    $nomer = ($img->imagepath) . "filtroimgtemp" . nomeRand() . ".png";
    $img->saveImage($nomer);
    //
    // corta a imagem gerada para voltar ao tamanho normal
    //
    if ($cortePixels > 0) {
        cortaImagemDisco($nomer, $cortePixels, $_GET["WIDTH"]);
    }
    filtraImg($nomer, $_GET["TIPOIMAGEM"]);
    $img = imagecreatefrompng($nomer);
    imagealphablending($img, false);
    imagesavealpha($img, true);
    cabecalhoImagem($nomer);
    imagepng($img);
    imagedestroy($img);
} else {
    if ($cache == true && $_GET["cache"] != "nao") {
        // cache ativo. Salva a imagem em cache
        $nomer = salvaCacheImagem($cachedir, $map_fileX, $_GET["tms"]);
        cabecalhoImagem($nomer);
        header("i3geocache: gerado");
        if ($_SESSION["i3georendermode"] == 2) {
            header("X-Sendfile: $nomer");
        } else {
            readfile($nomer);
        }
    } else {
        // cache inativo
        if ($img->imagepath == "") {
            ilegal();
        }
        // se for necessario cortar a imagem, $img->saveImage() nao funciona
        if ($_SESSION["i3georendermode"] == 0 || ($_SESSION["i3georendermode"] == 1 && $cortePixels > 0)) {
            $nomer = ($img->imagepath) . "temp" . nomeRand() . ".png";
            $img->saveImage($nomer);
            //
            // corta a imagem gerada para voltar ao tamanho normal
            //
            if ($cortePixels > 0) {
                $img = cortaImagemDisco($nomer, $cortePixels, $_GET["WIDTH"]);
            } else {
                $img = imagecreatefrompng($nomer);
                imagealphablending($img, false);
                imagesavealpha($img, true);
            }
            cabecalhoImagem($nomer);
            header("i3geocache: nao");
            imagepng($img);
            imagedestroy($img);
            exit();
        }
        if ($_SESSION["i3georendermode"] == 1) {
            ob_clean();
            header('Content-Type: image/png');
            $img->saveImage();
        }
        if ($_SESSION["i3georendermode"] == 2) {
            $nomer = ($img->imagepath) . "temp" . nomeRand() . ".png";
            $img->saveImage($nomer);
            //
            // corta a imagem gerada para voltar ao tamanho normal
            //
            if ($cortePixels > 0) {
                $img = cortaImagemDisco($nomer, $cortePixels, $_GET["WIDTH"]);
            }
            cabecalhoImagem($nomer);
            header("X-Sendfile: ".$nomer);
        }
    }
}
function cabecalhoImagem($nome,$tipo="image/png")
{
    if (ob_get_contents()) {
        ob_clean();
    }
    $lastModified = filemtime($nome);
    // set last-modified header
    header("Last-Modified: " . gmdate("D, d M Y H:i:s", $lastModified) . " GMT");
    // make sure caching is turned on
    header('Cache-Control: public,max-age=86400'); // 24 horas
    header("Content-type: " . $tipo);
    header("Etag: " . md5($nome));
    // check if page has changed. If not, send 304 and exit
    if (array_key_exists('HTTP_IF_MODIFIED_SINCE', $_SERVER)) {
        $if_modified_since = strtotime(preg_replace('/;.*$/', '', $_SERVER['HTTP_IF_MODIFIED_SINCE']));
        if ($if_modified_since >= $lastModified) { // Is the Cached version the most recent?
            header($_SERVER['SERVER_PROTOCOL'] . ' 304 Not Modified');
            exit();
        }
    }
}

function salvaCacheImagem($cachedir, $map, $tms)
{
    global $img, $cortePixels;
    if ($cachedir == "") {

            $nome = dirname(dirname($map)) . "/cache" . $tms;

    } else {

            $nome = $cachedir . $tms;

    }
    $nome = str_replace(".png", "", $nome);
    $nome = $nome . ".png";
    if (! file_exists($nome)) {
        if (! file_exists(dirname($nome))) {
            @mkdir(dirname($nome), 0744, true);
            chmod(dirname($nome), 0744);
        }
        //error_log("salvando imagem");
        $img->saveImage($nome);
        //
        // corta a imagem gerada para voltar ao tamanho normal
        //
        if ($cortePixels > 0) {
            $img = cortaImagemDisco($nome, $cortePixels, $_GET["WIDTH"]);
        }
        chmod($nome, 0744);
    }
    return $nome;
}

function carregaCacheImagem($cachedir, $map, $tms, $i3georendermode = 0, $format = "")
{
    if ($cachedir == "") {
        $nome = dirname(dirname($map)) . "/cache" . $tms;
    } else {
        $nome = $cachedir . $tms;
    }
    if($format == "utfgrid"){
        $nome = str_replace(".png","",$nome) . ".json";
        $tipo = "application/json; subtype=json";
    } else {
        $nome = str_replace(".png","",$nome) . ".png";
        $tipo = "image/png";
    }

    cabecalhoImagem($nome,$tipo);
    if ($i3georendermode = 0 || $i3georendermode = 1 || empty($i3georendermode)) {
        header("i3geocache: sim");
        $leu = @readfile($nome);
        if($leu == false){
            header_remove();
        }
    } else {
        if (file_exists($nome)) {
            if (file_exists($nome)) {
            header("X-Sendfile: ".$nome);
            exit();
            }
        }
    }
    /*
    if (file_exists($nome)) {
        cabecalhoImagem($nome,$tipo);
        if ($i3georendermode = 0 || $i3georendermode = 1 || empty($i3georendermode)) {
            readfile($nome);
        } else {
            header("X-Sendfile: ".$nome);
        }
        exit();
    }
    */
}

function nomeRand($n = 10)
{
    $nomes = "";
    $a = 'azertyuiopqsdfghjklmwxcvbnABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $max = 51;
    for ($i = 0; $i < $n; ++ $i) {
        $nomes .= $a{mt_rand(0, $max)};
    }
    return $nomes;
}

function filtraImg($nomer, $tipoimagem)
{
    include_once ("classe_imagem.php");
    $tiposImagem = explode(" ", $tipoimagem);
    foreach ($tiposImagem as $tipoimagem) {
        $m = new Imagem($nomer);
        if ($tipoimagem == "cinza") {
            imagepng($m->cinzaNormal(), str_replace("\\", "/", $nomer));
        }
        if ($tipoimagem == "sepiaclara") {
            imagepng($m->sepiaClara(), str_replace("\\", "/", $nomer));
        }
        if ($tipoimagem == "sepianormal") {
            imagepng($m->sepiaNormal(), str_replace("\\", "/", $nomer));
        }
        if ($tipoimagem == "negativo") {
            imagepng($m->negativo(), str_replace("\\", "/", $nomer));
        }
        if ($tipoimagem == "detectaBordas") {
            imagepng($m->detectaBordas(), str_replace("\\", "/", $nomer));
        }
        if ($tipoimagem == "embassa") {
            imagepng($m->embassa(), str_replace("\\", "/", $nomer));
        }
        if ($tipoimagem == "gaussian_blur") {
            imagepng($m->gaussian_blur(), str_replace("\\", "/", $nomer));
        }
        if ($tipoimagem == "selective_blur") {
            imagepng($m->selective_blur(), str_replace("\\", "/", $nomer));
        }
        if ($tipoimagem == "mean_removal") {
            imagepng($m->mean_removal(), str_replace("\\", "/", $nomer));
        }
        if ($tipoimagem == "pixelate") {
            imagepng($m->pixelate(), str_replace("\\", "/", $nomer));
        }
    }
}

function inicializa()
{
    ini_set("session.use_cookies", 0);
    session_name("i3GeoPHP");
    if (@$_GET["g_sid"]) {
        session_id($_GET["g_sid"]);
    } elseif (@$_COOKIE["i3GeoPHP"]) {
        session_id($_COOKIE["i3GeoPHP"]);
    } else {
        ilegal();
    }
    session_start([
        'read_and_close' => true
    ]);
    if (isset($_GET["REQUEST"])) {
        if ($_GET["REQUEST"] == "getfeatureinfo" || $_GET["REQUEST"] == "GetFeatureInfo" || strtolower($_GET["REQUEST"]) == "getfeature") {
            return;
        }
    }
    if (@$_SESSION["fingerprint"]) {
        $f = explode(",", $_SESSION["fingerprint"]);
        if (md5('I3GEOSEC' . $_SERVER['HTTP_USER_AGENT'] . session_id()) != $f[0]) {
            ilegal("red");
        }
    } else {
        exit();
    }

    if (! isset($_SESSION["map_file"])) {
        exit();
    }
}

function ilegal($img="")
{
    $img = imagecreatefrompng("../imagens/ilegal".$img.".png");
    imagealphablending($img, false);
    imagesavealpha($img, true);
    ob_clean();
    echo header("Content-type: image/png \n\n");
    imagepng($img);
    exit();
}
/**
 * Corta uma imagem existente em disco
 */
function cortaImagemDisco($arquivo, $cortePixels, $tamanhoFinal = 256)
{
    $img = imagecreatefrompng($arquivo);
    $imgc = imagecreatetruecolor($tamanhoFinal, $tamanhoFinal);
    // necessario, sem isso algumas imagens sao geradas de forma errada
    imagesavealpha($imgc, true);
    $color = imagecolorallocatealpha($imgc, 0x00, 0x00, 0x00, 127);
    imagefill($imgc, 0, 0, $color);
    imagecopy($imgc, $img, 0, 0, $cortePixels, $cortePixels, $tamanhoFinal, $tamanhoFinal);
    imagepng($imgc, $arquivo);
    return $imgc;
}
?>
