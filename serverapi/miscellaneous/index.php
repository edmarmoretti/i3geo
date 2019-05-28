<?php
include ("../safe.php");
include ("../../classesphp/classe_vermultilayer.php");
switch (strtoupper($_GET["funcao"])) {
    case "GETSIDENTIFY":
        include_once ("../../classesphp/classe_menutemas.php");
        $m = new Menutemas($_SESSION["map_file"], $_SESSION["perfil"], $_SESSION["locaplic"], "", $_SESSION["editores"], $_GET["idioma"]);
        $retorno = $m->pegaSistemasI();
        break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);