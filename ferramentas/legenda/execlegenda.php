<?php
include_once (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
$retorno = "";
include_once (dirname(__FILE__) . "/../../classesphp/classe_legenda.php");
$m = new Legenda($_SESSION["map_file"], $_SESSION["locaplic"], $_GET["tema"]);
switch (strtoupper($_GET["funcao"])) {
    case "APLICALEGENDAIMG":
        $retorno = $m->aplicaLegendaImg($_GET["imagem"]);
        $m->salva();
        break;
    case "EDITALEGENDA":
        $retorno = $m->tabelaLegenda();
        break;
    case "CONTAGEMCLASSE":
        $retorno = $m->tabelaLegenda("sim");
        $m->salva();
        break;
    case "APLICATODASCLASSES":
        $retorno = $m->aplicaTodasClasses($_GET["parametro"], $_GET["valor"]);
        $m->salva();
        break;
    case "APLICAPARAMETRO":
        $retorno = $m->aplicaParametro($_GET["classe"], $_GET["estilo"], $_GET["outlinecolor"], $_GET["backgroundcolor"], $_GET["color"], $_GET["symbolname"], $_GET["size"], $_GET["opacidade"], $_GET["width"], $_GET["pattern"], $_GET["angle"], $_GET["minsize"], $_GET["maxsize"], $_GET["offsetx"], $_GET["offsety"]);
        $m->salva();
        break;
    case "PARAMETROS":
        $retorno = $m->pegaParametros($_GET["classe"]);
        break;
    case "SOBEESTILO":
        $retorno = $m->sobeEstilo($_GET["classe"], $_GET["estilo"]);
        $m->salva();
        break;
    case "DESCEESTILO":
        $retorno = $m->desceEstilo($_GET["classe"], $_GET["estilo"]);
        $m->salva();
        break;
    case "ADICIONAESTILO":
        $retorno = $m->adicionaEstilo($_GET["classe"], $_GET["estilo"]);
        $m->salva();
        break;
    case "EXCLUIESTILO":
        $retorno = $m->excluiEstilo($_GET["classe"], $_GET["estilo"]);
        $m->salva();
        break;
    case "LISTASIMBOLOS":
        $retorno = $m->listaSimbolos($_GET["tipo"], $_SESSION["dir_tmp"], $_SESSION["imgdir"], $_GET["onclick"]);
        if ($retorno == "") {
            $retorno = $m->listaSimbolos($_GET["tipo"], $_SESSION["dir_tmp"], $_SESSION["imgdir"], $_GET["onclick"], 8, 1, true);
        }
        break;
}
ob_clean();
if (! $retorno) {
    header("HTTP/1.1 500 erro legenda nao disponivel");
} else {
    header("Content-type: application/json");
    echo json_encode($retorno);
}
exit();
?>