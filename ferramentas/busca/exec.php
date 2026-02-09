<?php
include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
switch (strtoupper($_GET["funcao"]))
{
    case "LISTAVALORESITENS":
        include_once (dirname(__FILE__) . "/../../classesphp/classe_atributos.php");
        error_reporting(0);
        $m = new Atributos($_SESSION["map_file"], $_GET["tema"], "", $_GET["ext"]);
        $retorno = $m->buscaRegistros($_GET["palavra"], $_GET["lista"], $_GET["tipo"], $_GET["onde"]);
        break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);
?>