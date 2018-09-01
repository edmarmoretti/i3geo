<?php
include_once (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
$retorno = "";
include_once (dirname(__FILE__) . "/../../classesphp/classe_alteraclasse.php");
if(!isset($_POST["ext"])){
    $_POST["ext"] = "";
}
$m = new Alteraclasse($_SESSION["map_file"], $_POST["tema"], "", $_POST["ext"]);
switch (strtoupper($_GET["funcao"])) {
    case "ADICIONAOPACIDADE":
        $retorno = $m->adicionaopacidade();
        $m->salva();
        break;
    case "ALTERACORESCLASSES":
        $retorno = $m->alteraCoresClasses($_POST["cori"], $_POST["corf"]);
        $m->salva();
        break;
    case "ALTERACLASSES":
        $retorno = $m->alteraclasses($_POST["ids"], $_POST["nomes"], $_POST["exps"], $_POST["base64"], $_POST["minScales"], $_POST["maxScales"], $_POST["separador"]);
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
        $retorno = $m->calculaTamanhoClasses($_POST["size"]);
        $m->salva();
        break;
    case "ORDENACLASSES":
        $retorno = $m->ordenaClasses();
        $m->salva();
        break;
    case "SOBECLASSE":
        $retorno = $m->sobeclasse($_POST["idclasse"]);
        $m->salva();
        break;
    case "DESCECLASSE":
        $retorno = $m->desceclasse($_POST["idclasse"]);
        $m->salva();
        break;
    case "APLICACORESRGB":
        $cores = str_replace("rgb", "", $_POST["cores"]);
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
        $retorno = $m->valorunico($_POST["item"], $_POST["ignorar"], $_POST["itemNome"]);
        $m->salva();
        break;
    case "NCLASSES":
        $retorno = $m->intervalosiguais($_POST["item"], $_POST["nclasses"], $_POST["ignorar"]);
        $m->salva();
        break;
    case "QUEBRASNATURAIS":
        $retorno = $m->quebrasnaturais($_POST["item"], $_POST["nclasses"], $_POST["ignorar"]);
        $m->salva();
        break;
    case "QUANTIL":
        $retorno = $m->quantil($_POST["item"], $_POST["nclasses"], $_POST["ignorar"]);
        $m->salva();
        break;
    case "METADE":
        $retorno = $m->metade($_POST["item"], $_POST["itemid"], $_POST["ignorar"]);
        $m->salva();
        break;
    case "MEDIA":
        $retorno = $m->classemedia($_POST["item"], $_POST["ignorar"]);
        $m->salva();
        break;
    case "QUARTIL":
        $retorno = $m->quartis($_POST["item"], $_POST["ignorar"], $_POST["tipoLegenda"]);
        $m->salva();
        break;
    case "ALTERAGEOMETRIA":
        $retorno = $m->alterageometria($_POST["tipo"]);
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