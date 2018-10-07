<?php
include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
include (dirname(__FILE__) . "/../../classesphp/classe_analise.php");
$m = new Analise($_SESSION["map_file"],$_GET["temaPt"],$_SESSION["locaplic"],$_GET["ext"]);
switch (strtoupper($_GET["funcao"]))
{
    case "PONTOEMPOLIGONO":
        $retorno = $m->pontoEmPoligono($_GET["temaPt"],$_GET["temasPo"],$_SESSION["locaplic"]);
        $m->salva();
    break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode(true);
?>