<?php
if(!@empty($_GET["g_sid"])){
    include ("../safe.php");
    $map_file = $_SESSION["map_file"];
    $perfil = $_SESSION["perfil"];
    $locaplic = $_SESSION["locaplic"];
    $urli3geo = $_SESSION["urli3geo"];
    $editores = $_SESSION["editores"];
} else {
    include ("../../ms_configura.php");
    $map_file = "";
    $perfil = "";
    $urli3geo = "";
    $editores = "";
}

switch (strtoupper($_GET["funcao"])) {
    case "PEGALISTADEMENUS":
        include ("../../classesphp/classe_menutemas.php");
        $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $editores, $_GET["idioma"]);
        $retorno = $m->pegaListaDeMenus($_GET["filtraOgc"], $_GET["filtraDown"]);
        break;
    case "PEGALISTADEGRUPOS":
        include ("../../classesphp/classe_menutemas.php");
        $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $editores, $_GET["idioma"], $_GET["filtro"]);
        $retorno = array(
            "idmenu" => $_GET["idmenu"]*1,
            "grupos" => $m->pegaListaDeGrupos($_GET["idmenu"]*1, "nao", "nao", $_GET["ordenaNome"], $_GET["filtraOgc"], $_GET["filtraDown"])
        );
        break;
    case "PEGALISTADESUBGRUPOS":
        include ("../../classesphp/classe_menutemas.php");
        $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $editores, $_GET["idioma"], $_GET["filtro"]);
        $retorno = $m->pegaListaDeSubGrupos($_GET["grupo"], $_GET["idmenu"]);
        break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);