<?php
include_once (dirname(__FILE__) . "/../../classesphp/sani_request.php");
$_GET = array_merge($_GET, $_POST);
$mapexten = $_GET["mapexten"];
// error_reporting(0);
session_name("i3GeoPHP");
if (isset($_GET["g_sid"])) {
    session_id($_GET["g_sid"]);
}

session_start();
$map_file = $_SESSION["map_file"];
require_once (dirname(__FILE__) . "/../../ms_configura.php");
include (dirname(__FILE__) . "/../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $i3geoBlFerramentas, false);
//
// se as extens&otilde;es j&aacute; estiverem carregadas no PHP, vc pode comentar essa linha para que o processamento fique mais r&aacute;pido
//
include_once (dirname(__FILE__) . "/../../classesphp/carrega_ext.php");
//
// carrega o phpmapscript
//
$exts = get_loaded_extensions();
if (array_search("MapScript", $exts) != TRUE) {
    if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')) {
        if (! @dl('php_mapscript_48.dll'))
            dl('php_mapscript.dll');
    } else {
        dl('php_mapscript.so');
    }
}
require (dirname(__FILE__) . "/../../classesphp/funcoes_gerais.php");
// error_reporting(0);
$nomes = nomeRandomico(5);
$nomezip = str_replace(".map", "", $map_file) . $nomes . ".zip";
$arquivos = array();

$map = ms_newMapObj($map_file);
substituiConObj($map, $postgis_mapa);
$of = $map->outputformat;
$of->set("driver", "GDAL/GTiff");
$of->set("imagemode", "RGB");

if ($map->getmetadata("interface") == "googlemaps") {
    $proj4 = pegaProjecaoDefault("proj4");
    $map->setProjection($proj4);
    $map->set("units", MS_METERS);
    $map->preparequery();
    $map->set("scaledenom", $map->scaledenom * 100000);
}
$o = $map->outputformat;
if ($mapexten != "") {
    $ext = explode(" ", $mapexten);
    $extatual = $map->extent;
    $extatual->setextent($ext[0], $ext[1], $ext[2], $ext[3]);
}
$o->set("imagemode", MS_IMAGEMODE_RGB);
$protocolo = explode("/", $_SERVER['SERVER_PROTOCOL']);
// mapa
$imgo = $map->draw();
if ($imgo->imagepath == "") {
    echo "Erro IMAGEPATH vazio";
    exit();
}
$nomer = ($imgo->imagepath) . "mapa" . $nomes . ".tif";
$imgo->saveImage($nomer);
$arquivos[] = $nomer;
// legenda
// corrige o titulo da legenda
$numlayers = $map->numlayers;
for ($j = 0; $j < $numlayers; $j ++) {
    $l = $map->getlayer($j);
    if ($l->getmetadata("classe") == "NAO") {
        $l->set("status", MS_OFF);
    } else {
        if (($l->data != "") && (strtolower($l->getmetadata("escondido")) != "sim") && (strtolower($l->getmetadata("tema")) != "nao")) {
            if ($l->numclasses > 0) {
                $classe = $l->getclass(0);
                if (($classe->name == "") || ($classe->name == " ")) {
                    $classe->set("name", $l->getmetadata("tema"));
                }
            }
        }
        if ($l->type != 3 && $l->type != 4) {
            $nclass = $l->numclasses;
            for ($i = 0; $i < $nclass; $i ++) {
                $classe = $l->getclass($i);
                if ($classe->title === "") {
                    $classe->title = $classe->name;
                }
            }
        }
    }
}
$imgo = $map->drawlegend();
$nomer = ($imgo->imagepath) . "legenda" . $nomes . ".tif";
$imgo->saveImage($nomer);
$arquivos[] = $nomer;
// escala
$imgo = $map->drawscalebar();
$nomer = ($imgo->imagepath) . "escala" . $nomes . ".tif";
$imgo->saveImage($nomer);
$arquivos[] = $nomer;
// refer&ecirc;ncia
$ref = $map->reference;
$o = $ref->outlinecolor;
if ($o->red == - 1) {
    $o->setrgb(255, 0, 0);
}
$ref->set("status",MS_DEFAULT);

$imgo = $map->drawreferencemap();
$nomer = ($imgo->imagepath) . "ref" . $nomes . ".tif";
$imgo->saveImage($nomer);
$arquivos[] = $nomer;

include ("../../pacotes/kmlmapserver/classes/zip.class.php");
// zipa o arquivo
if (file_exists($nomezip)) {
    unlink($nomezip);
}
$ziper = new zipfile();
foreach($arquivos AS $a){
    $ziper->addFile(file_get_contents($a),basename($a));
}
$fp = fopen($nomezip, "wb");
fwrite($fp, $ziper->file());
fclose($fp);

if (file_exists($nomezip)) {
    ob_end_clean();
    header('Content-type: application/zip');
    header('Content-Disposition: attachment; filename=' . basename($nomezip));
    readfile($nomezip);
}
?>
