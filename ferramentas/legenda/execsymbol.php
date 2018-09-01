<?php
include_once (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
$retorno = "";
include_once (dirname(__FILE__) . "/../../classesphp/classe_legenda.php");
$m = new Legenda($_SESSION["map_file"], $_SESSION["locaplic"], $_POST["tema"]);
switch (strtoupper($_GET["funcao"])) {
    case "APLICATODASCLASSES":
        $retorno = $m->aplicaTodasClasses($_POST["parametro"], $_POST["valor"]);
        $m->salva();
        break;
    case "APLICAPARAMETRO":
        $retorno = $m->aplicaParametro($_POST["classe"], $_POST["estilo"], $_POST["outlinecolor"], $_POST["backgroundcolor"], $_POST["color"], $_POST["symbolname"], $_POST["size"], $_POST["opacidade"], $_POST["width"], $_POST["pattern"], $_POST["angle"], $_POST["minsize"], $_POST["maxsize"], $_POST["offsetx"], $_POST["offsety"]);
        $m->salva();
        break;
    case "PARAMETROS":
        $retorno = $m->pegaParametros($_POST["classe"]);
        break;
    case "SOBEESTILO":
        $retorno = $m->sobeEstilo($_POST["classe"], $_POST["estilo"]);
        $m->salva();
        break;
    case "DESCEESTILO":
        $retorno = $m->desceEstilo($_POST["classe"], $_POST["estilo"]);
        $m->salva();
        break;
    case "ADICIONAESTILO":
        $retorno = $m->adicionaEstilo($_POST["classe"], $_POST["estilo"]);
        $m->salva();
        break;
    case "EXCLUIESTILO":
        $retorno = $m->excluiEstilo($_POST["classe"], $_POST["estilo"]);
        $m->salva();
        break;
    case "LISTASIMBOLOS":
        $retorno = $m->listaSimbolos($_POST["tipo"], $_SESSION["dir_tmp"], $_SESSION["imgdir"], $_POST["onclick"]);
        if ($retorno == "") {
            $retorno = $m->listaSimbolos($_POST["tipo"], $_SESSION["dir_tmp"], $_SESSION["imgdir"], $_POST["onclick"], 8, 1, true);
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