<?php
include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
switch (strtoupper($_GET["funcao"]))
{
    case "GRAFICOSELECAO":
        include(dirname(__FILE__)."/../../classesphp/graficos.php");
        if(!isset($_GET["exclui"])){
            $_GET["exclui"] = "";
        }
        if(!isset($_GET["tipo"])){
            $_GET["tipo"] = "nenhum";
        }
        if(!isset($_GET["ordenax"])){
            $_GET["ordenax"] = "nao";
        }
        $itemvalores = explode(",",$_GET["itemvalores"]);
        if(count($itemvalores) == 1){
            $itemvalores = $itemvalores[0];
        }
        $retorno = iniciaDadosGrafico($_SESSION["map_file"],$_GET["tema"],$_GET["exclui"],$_GET["itemclasses"],$itemvalores,$_GET["tipo"],false,$_GET["ext"],true,$_GET["ordenax"]);
    break;
    case "INSEREFILTRO":
        include (dirname(__FILE__) . "/../../classesphp/classe_temas.php");
        $m = new Temas($_SESSION["map_file"], $_GET["tema"]);
        $retorno = $m->insereFiltro(base64_decode($_GET["filtro"]), "", "sim");
        $m->salva();
    break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);
