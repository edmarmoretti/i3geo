<?php
if(empty($_GET["id"])){
    exit;
}
include_once ("../classesphp/classe_menutemas.php");
$m = new Menutemas();
$mapas = $m->pegaListaDeMapas("",(int) $_GET["id"]);
if(count($mapas["mapas"]) > 0){
    $mapa = $mapas["mapas"];
    $link = $mapa["LINK"];
    if($mapa["LINK"] == ""){
        $link = "../ms_criamapa.php?temasa=" . $mapa["TEMAS"] . "&layers=" . $mapa["LIGADOS"];
        if ($mapa["EXTENSAO"] !== "") {
            $link .= "&mapext=" . $mapa["EXTENSAO"];
        }
        if ($mapa["OUTROS"] !== "") {
            $link .= "&" . $mapa["OUTROS"];
        }
    }
    echo "<meta http-equiv='refresh' content='0;url=$link'>";
}
?>