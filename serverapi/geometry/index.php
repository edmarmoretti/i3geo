<?php
include ("../safe.php");
switch (strtoupper($_GET["funcao"])) {
    case "DIFFERENCE":
        include_once ("../../classe_analise.php");
        $m = new Analise($_SESSION["map_file"], "");
        $retorno = $m->aplicaFuncaoListaWKT(explode("|", $_GET["geometrias"]), "difference", $_SESSION["dir_tmp"], $_SESSION["imgdir"]);
        break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);