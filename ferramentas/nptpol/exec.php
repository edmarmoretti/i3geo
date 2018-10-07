<?php
include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
include (dirname(__FILE__) . "/../../classesphp/classe_analise.php");
$m = new Analise($_SESSION["map_file"],$_GET["temaorigem"],$_SESSION["locaplic"],$_GET["ext"]);
switch (strtoupper($_GET["funcao"]))
{
    case "NPTPOL":
        $retorno = $m->nptPol($_GET["temaPt"],$_GET["temaPo"],$locaplic,$_GET["somaritem"]);
        $m->salva();
    break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode(true);
?>