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
    case "PEGALISTADETEMAS":
        include ("../../classesphp/classe_menutemas.php");
        $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $editores, $_GET["idioma"]);
        $retorno = $m->pegaListaDeTemas($_GET["grupo"], $_GET["subgrupo"], $_GET["idmenu"]);
        break;
    case "PEGALISTADESISTEMAS":
        include ("../../classesphp/classe_menutemas.php");
        $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $editores, $_GET["idioma"]);
        $retorno = $m->pegaSistemas();
        break;
    case "PROCURARTEMASESTRELA":
        include ("../../classesphp/classe_menutemas.php");
        $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $editores, $_GET["idioma"]);
        $retorno = $m->procurartemasestrela($_GET["nivel"], $_GET["fatorestrela"]);
        break;
    case "GETLAYERSWMS":
        include ("../../classesphp/classe_ows.php");
        $m = new Ows($_GET["servico"]);
        $retorno = $m->getLayersWMS($_GET["nivel"],$_GET["id_ws"],$_GET["tipo_ws"],$_GET["nomelayer"]);
        break;
    case "GETLAYERSARCGISREST":
        include("../../classesphp/conexao.php");
        $sql = "SELECT link_ws from {$esquemaadmin}i3geoadmin_ws WHERE id_ws = '". $_GET["id_ws"]*1 ."'";
        $q = $dbh->query($sql,PDO::FETCH_ASSOC)->fetchAll();
        $servico = $q[0]["link_ws"];
        include ("../../classesphp/classe_ows.php");
        if(!empty($_GET["nomelayer"])){
            $m = new Ows($servico . "/" . $_GET["nomelayer"]);
        } else {
            $m = new Ows($servico);
        }
        $retorno = json_decode($m->getLayersARCGISREST());
        break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);