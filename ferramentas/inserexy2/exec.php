<?php
include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
include (dirname(__FILE__) . "/../../classesphp/classe_shp.php");
switch (strtoupper($_GET["funcao"])) {
    case "INSERESHP":
        $m = new SHP($_SESSION["map_file"], $_GET["tema"]);
        $retorno = $m->insereSHP($_GET["xy"], $_GET["projecao"], $_GET["item"], $_GET["valor"]);
        break;
    case "CRIASHPVAZIO":
        $m = new SHP($_SESSION["map_file"]);
        $retorno = $m->criaSHPvazio($_GET["tituloTema"]);
        $m->salva();
        break;
    case "LISTAPONTOSSHAPE":
        $m = new SHP($_SESSION["map_file"], $_GET["tema"]);
        $retorno = $m->listaPontosShape();
        break;
    case "SPHPT2SHP":
        $m = new SHP($_SESSION["map_file"], $_GET["tema"], $_SESSION["locaplic"], $_GET["ext"]);
        $retorno = $m->shpPT2shp($_SESSION["locaplic"], $_GET["para"]);
        $m->salva();
        break;
    case "MOSTRAWKT":
        //vem de funcoes gerais
        $res = xy2wkt($_GET["xy"]);
        $retorno = array(
            $res["ponto"],
            $res["linha"],
            $res["poligono"]
        );
        break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);