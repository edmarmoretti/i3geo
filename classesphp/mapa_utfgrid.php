<?php
for ($i = 0; $i < $numlayers; ++ $i) {
    $l = $mapa->getLayer($i);
    $layerName = $l->name;
    if ($layerName != $_GET["layer"]) {
        $l->set("status", MS_OFF);
    } else {
        $l->set("status", MS_DEFAULT);
        $l->setmetadata("WMS_INCLUDE_ITEMS", "all");
        if($l->getmetadata("UTFITEM") != ""){
            $l->updateFromString("LAYER UTFITEM '" . $l->getmetadata("UTFITEM") . "' END");
        }
        if($l->getmetadata("UTFDATA") != ""){
            $l->updateFromString("LAYER UTFDATA '" . $l->getmetadata("UTFDATA") . "' END");
        }
    }
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
    carregaCacheImagemUtfGrid($cachedir, $_SESSION["map_file"], $_GET["tms"]);
}
$mapa->selectOutputFormat("utfgrid");

ms_ioinstallstdouttobuffer();
$req = ms_newowsrequestobj();

$_GET["BBOX"] = str_replace(" ",",",$_GET["BBOX"]);
foreach ($_GET as $k=>$v){
    $req->setParameter(strtoupper($k), $v);
}
$req->setParameter("REQUEST", "GetMap");
$req->setParameter("SERVICE", "WMS");
$req->setParameter("VERSION","1.1.1");
$req->setParameter("SRS","EPSG:4326");
$req->setParameter("LAYERS",$_GET["layer"]);
$req->setParameter("FORMAT","application/json");

/*
for($i=0;$i < $req->numparams;$i++){
    echo $req->getName($i)." ".$req->getValue($i)."<br>";
}
exit;
*/
$mapa->owsdispatch($req);
ob_clean();
ms_iostripstdoutbuffercontentheaders();
header("Content-type: application/json; subtype=json");
ms_iogetStdoutBufferBytes();
//ms_iogetstdoutbufferstring();
ms_ioresethandlers();

exit;


// nao usa o cache pois e necessario processar a imagem com alguma rotina de filtro
if ($cache == true && $_GET["cache"] != "nao") {
    // cache ativo. Salva a imagem em cache
    $nomer = salvaCacheImagemUtfGrid($cachedir, $map_fileX, $_GET["tms"]);
    cabecalhoImagemUtfGrid($nomer);
    if ($_SESSION["i3georendermode"] == 2) {
        header("X-Sendfile: $nomer");
    } else {
        readfile($nomer);
    }
} else {
    // se for necessario cortar a imagem, $img->saveImage() nao funciona
    if ($_SESSION["i3georendermode"] == 0 || ($_SESSION["i3georendermode"] == 1 && $cortePixels > 0)) {
        $nomer = ($img->imagepath) . "temp" . nomeRand() . ".png";
        $img->saveImage($nomer);
        //
        // corta a imagem gerada para voltar ao tamanho normal
        //
        $img = imagecreatefrompng($nomer);
            imagealphablending($img, false);
            imagesavealpha($img, true);
        cabecalhoImagem($nomer);
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
            $img = cortaImagemDisco($nomer, $cortePixels, 256);
        }
        cabecalhoImagem($nomer);
        header("X-Sendfile: " . $nomer);
    }
}

function cabecalhoImagemUtfGrid($nome)
{
    if (ob_get_contents()) {
        ob_clean();
    }
    $lastModified = filemtime($nome);
    // set last-modified header
    header("Last-Modified: " . gmdate("D, d M Y H:i:s", $lastModified) . " GMT");
    // make sure caching is turned on
    header('Cache-Control: public,max-age=86400'); // 24 horas
    header("Content-type: image/png");
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

function salvaCacheImagemUtfGrid($cachedir, $map, $tms)
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
        error_log("salvando imagem");
        $img->saveImage($nome);
        //
        // corta a imagem gerada para voltar ao tamanho normal
        //
        if ($cortePixels > 0) {
            $img = cortaImagemDisco($nome, $cortePixels, 256);
        }
        chmod($nome, 0744);
    }
    return $nome;
}

function carregaCacheImagemUtfGrid($cachedir, $map, $tms, $i3georendermode = 0)
{

    if ($cachedir == "") {
        $nome = dirname(dirname($map)) . "/cache" . $tms;
    } else {
        $nome = $cachedir . $tms;
    }
    $nome = str_replace(".png", "", $nome) . ".png";
    if (file_exists($nome)) {
        cabecalhoImagem($nome);
        if ($i3georendermode = 0 || $i3georendermode = 1 || empty($i3georendermode)) {
            readfile($nome);
        } else {
            header("X-Sendfile: " . $nome);
        }
        exit();
    }
}
?>
