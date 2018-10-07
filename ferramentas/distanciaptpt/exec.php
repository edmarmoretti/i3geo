<?php
include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
include (dirname(__FILE__) . "/../../classesphp/classe_analise.php");
$m = new Analise($_SESSION["map_file"],$_GET["temaorigem"],$_SESSION["locaplic"]);
switch (strtoupper($_GET["funcao"]))
{
    case "DISTANCIAPTPT":
        $temaoverlay = $m->criaBuffer($_GET["distancia"],$_SESSION["locaplic"]);
        $retorno = $m->distanciaptpt($_GET["temaorigem"],$_GET["temadestino"],$temaoverlay,$_SESSION["locaplic"],$_GET["itemorigem"],$_GET["itemdestino"]);
        $m->salva();
    break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode(true);
?>