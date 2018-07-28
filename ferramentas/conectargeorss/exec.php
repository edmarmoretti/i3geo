<?php
include_once (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
$retorno = "";
$url = $_GET["url"];
switch (strtoupper($_GET["funcao"])) {
    /*
     * Valor: ADICIONATEMAGEORSS
     *
     * Adiciona um tema baseado em um RSS.
     *
     * <Mapa->adicionaTemaGeoRSS>
     */
    case "ADICIONATEMAGEORSS":
        include_once (dirname(__FILE__) . "/../../classesphp/classe_mapa.php");
        $m = new Mapa($_SESSION["map_file"]);
        $retorno = $m->adicionaTemaGeoRSS($_GET["url"], $_SESSION["dir_tmp"], $_SESSION["locaplic"]);
        if ($retorno != "erro") {
            $m->salva();
            $erro = "";
        } else {
            $erro = "erro.Nenhum dado espacializado foi encontrado.";
        }
        ob_clean();
        header("Content-type: application/json");
        echo json_encode(array(
            "errorMsg" => $erro
        ));
        exit();
        break;
}
?>