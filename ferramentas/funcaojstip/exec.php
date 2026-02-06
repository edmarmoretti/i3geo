<?php
include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
include (dirname(__FILE__) . "/../../classesphp/classe_temas.php");
$m = new Temas($_SESSION["map_file"], $_GET["tema"]);
switch (strtoupper($_GET["funcao"])){
    case "PEGAFUNCOESJS":
        $retorno = base64_encode($m->pegaFuncoesJs());
        break;
    case "INSEREFUNCOESJS":
        $m->insereFuncoesJs(($_GET["texto"]));
        $m->salva();
        $retorno = base64_encode($m->pegaFuncoesJs());
        break;
    case "LIMPAFUNCOESJS":
        $m->limpaFuncoesJs();
        $m->salva();
        $retorno = base64_encode($m->pegaFuncoesJs());
        break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);