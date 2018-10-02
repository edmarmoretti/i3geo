<?php
include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
include (dirname(__FILE__) . "/../../classesphp/classe_analise.php");
$m = new Analise($_SESSION["map_file"]);
switch (strtoupper($_GET["funcao"]))
{
    case "GRADEDEHEX":
        $retorno = $m->gradeDeHex($_GET["dd"],$_GET["px"],$_GET["py"],$_SESSION["locaplic"],$_GET["nptx"],$_GET["npty"],(boolean)json_decode(strtolower($_GET["proj"])));
        $m->salva();
    break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);
?>