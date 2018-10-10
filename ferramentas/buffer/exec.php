<?php
include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
include (dirname(__FILE__) . "/../../classesphp/classe_analise.php");
$m = new Analise($_SESSION["map_file"],$_GET["tema"],$_SESSION["locaplic"]);
switch (strtoupper($_GET["funcao"]))
{
    case "CRIABUFFER":
        $retorno = $m->criaBuffer($_GET["distancia"],$_SESSION["locaplic"],$_GET["unir"],$_GET["wkt"],$_GET["multiplicar"],$_GET["itemdistancia"]);
        $m->salva();
    break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);
