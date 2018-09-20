<?php
include_once (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
$retorno = "";
include_once (dirname(__FILE__) . "/../../classesphp/classe_alteraclasse.php");
if(!isset($_GET["ext"])){
    $_GET["ext"] = "";
}
$m = new Alteraclasse($_SESSION["map_file"], $_GET["tema"], "", $_GET["ext"]);

switch (strtoupper($_GET["funcao"])) {
    case "ADICIONAOPACIDADE":
        $retorno = $m->adicionaopacidade();
        $m->salva();
        break;
    case "ALTERACORESCLASSES":
        $retorno = $m->alteraCoresClasses($_GET["cori"], $_GET["corf"]);
        $m->salva();
        break;
    case "ALTERACLASSES":
        $retorno = $m->alteraclasses($_GET["tema"], $_GET["nomes"], $_GET["exps"], "nao", $_GET["minScales"], $_GET["maxScales"], $_GET["separador"]);
        $m->salva();
        break;
    case "ADICIONACLASSE":
        $retorno = $m->adicionaclasse();
        $m->salva();
        break;
    case "INVERTECORESCLASSES":
        $retorno = $m->inverteCoresClasses();
        $m->salva();
        break;
    case "CALCULATAMANHOCLASSES":
        $retorno = $m->calculaTamanhoClasses($_GET["size"]);
        $m->salva();
        break;
    case "ORDENACLASSES":
        $retorno = $m->ordenaClasses();
        $m->salva();
        break;
    case "SOBECLASSE":
        $retorno = $m->sobeclasse($_GET["idclasse"]);
        $m->salva();
        break;
    case "DESCECLASSE":
        $retorno = $m->desceclasse($_GET["idclasse"]);
        $m->salva();
        break;
    case "APLICACORESRGB":
        $cores = str_replace("rgb", "", $_GET["cores"]);
        $cores = str_replace(")", "", $cores);
        $cores = str_replace("(", "", $cores);
        $retorno = $m->aplicacoresrgb(explode("|", $cores));
        $m->salva();
        break;
    case "SIMBOLOUNICO":
        $retorno = $m->simbolounico();
        $m->salva();
        break;
    case "VALORUNICO":
        $retorno = $m->valorunico($_GET["item"], $_GET["ignorar"], $_GET["itemNome"]);
        $m->salva();
        break;
    case "TIPOCLASSES":
        if($_GET["tipoCalculo"] == "nclasses"){
            $retorno = $m->intervalosiguais($_GET["item"], $_GET["nclasses"], $_GET["ignorar"]);
        }
        if($_GET["tipoCalculo"] == "quebrasnaturais"){
            $retorno = $m->quebrasnaturais($_GET["item"], $_GET["nclasses"], $_GET["ignorar"]);
        }
        if($_GET["tipoCalculo"] == "quantil"){
            $retorno = $m->quantil($_GET["item"], $_GET["nclasses"], $_GET["ignorar"]);
        }
        $m->salva();
        break;
    case "METADE":
        $retorno = $m->metade($_GET["item"], $_GET["itemid"], $_GET["ignorar"]);
        $m->salva();
        break;
    case "MEDIA":
        $retorno = $m->classemedia($_GET["item"], $_GET["ignorar"]);
        $m->salva();
        break;
    case "QUARTIL":
        $retorno = $m->quartis($_GET["item"], $_GET["ignorar"], $_GET["tipoLegenda"]);
        $m->salva();
        break;
    case "ALTERAGEOMETRIA":
        $retorno = $m->alterageometria($_GET["tipo"]);
        $m->salva();
        break;
}
ob_clean();
if (! $retorno) {
    header("HTTP/1.1 500 erro legenda nao disponivel");
} else {
    header("Content-type: application/json");
    echo json_encode($retorno);
}
?>