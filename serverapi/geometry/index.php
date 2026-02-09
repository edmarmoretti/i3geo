<?php
define("I3GEOPATH", explode("serverapi",__FILE__)[0]);
include (I3GEOPATH."/serverapi/safe.php");
switch (strtoupper($_GET["funcao"])) {
    case "DIFFERENCE":
        include_once (I3GEOPATH."/classe_analise.php");
        $m = new Analise($_SESSION["map_file"], "");
        $retorno = $m->aplicaFuncaoListaWKT(explode("|", $_GET["geometrias"]), "difference", $_SESSION["dir_tmp"], $_SESSION["imgdir"]);
        break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);