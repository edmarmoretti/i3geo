<?php
//http://localhost/i3geo/restmapserver/map/create/joao?funcao=create
define("I3GEOPATH", explode("restmapserver",__FILE__)[0]);
include (I3GEOPATH."/restmapserver/safe.php");
include (I3GEOPATH."/classesphp/classe_vermultilayer.php");

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

require '../vendor/autoload.php';

$app = new \Slim\App;
$app->get('/create/{name}', function (Request $request, Response $response, array $args) {
    $name = $args['name'];
    $response->getBody()->write("Hello, $name");

    return $response;
});
$app->run();
exit;


switch ("none") {
    case "CREATE":
        session_name("i3GeoPHP");
        unset($GLOBALS);
        if (session_status() == PHP_SESSION_ACTIVE) {
            // error_log("--------------Apagando a session");
            session_destroy();
            //lembrete: validaAcessoTemas usa cookies
            $_COOKIE = array();
        }
        include (I3GEOPATH."/ms_configura.php");
        $interfaceTemp = $_GET["interface"];
        $interface = "mashup";
        $funcao = $_GET["funcao"];
        include (I3GEOPATH."/ms_criamapa.php");
        $_SESSION["interface"] = $interfaceTemp;
        $temp = $_SESSION["map_file"];
        $retorno = session_id();
        session_write_close();
        // ver funcoes_gerais.php
        validaAcessoTemas($temp);
        break;
    case "START":
        include (I3GEOPATH."/classesphp/mapa_inicia.php");
        $retorno = iniciaMapa($_GET["w"],$_GET["h"],$_GET["kmlurl"]);
        break;
    case "EXCLUIRTEMAS":
        include_once (I3GEOPATH."/classesphp/classe_mapa.php");
        $m = new Mapa($_SESSION["map_file"]);
        $temas = $m->excluiTemas($_GET["temas"]);
        $m->salva();
        $retorno = true;
        break;
    case "REORDENATEMAS":
        include_once (I3GEOPATH."/classesphp/classe_temas.php");
        $m = new Temas($_SESSION["map_file"]);
        $m->reordenatemas($_GET["temas"]);
        $m->salva();
        $retorno = true;
        break;
    case "CRIALEGENDAJSON":
        include_once (I3GEOPATH."/classesphp/classe_legenda.php");
        $m = new Legenda($_SESSION["map_file"], $_SESSION["locaplic"], "");
        $r = $m->criaLegendaJson($_GET["w"], $_GET["h"]);
        $retorno = $r;
        break;
    case "MUDATAMANHO":
        $map = ms_newMapObj($_SESSION["map_file"]);
        $map->setsize($_GET["largura"], $_GET["altura"]);
        $salvo = $map->save($_SESSION["map_file"]);
        $m = new Mapa($_SESSION["map_file"]);
        $m->mudaQS($_GET["largura"], $_GET["altura"]);
        $retorno = true;
        break;
    case "ZOOMPONTO":
        include (I3GEOPATH."/classesphp/classe_navegacao.php");
        include (I3GEOPATH."/classesphp/classe_temas.php");
        $m = new Navegacao($_SESSION["map_file"]);
        $m->zoomPonto($_GET["xy"]);
        $m->salva();
        $m = new Temas($_SESSION["map_file"], "");
        if (! isset($_GET["marca"])) {
            $_GET["marca"] = "ponto";
        }
        $m->insereFeature($marca, "POINT", $_GET["xy"], $_GET["texto"], $_GET["position"], $_GET["partials"], $_GET["offsetx"], $_GET["offsety"], $_GET["minfeaturesize"], $_GET["mindistance"], $_GET["force"], $_GET["shadowcolor"], $_GET["shadowsizex"], $_GET["shadowsizey"], $_GET["outlinecolor"], $_GET["cor"], $_GET["sombray"], $_GET["sombrax"], $_GET["sombra"], $_GET["fundo"], $_GET["angulo"], $_GET["tamanho"], $_GET["fonte"]);
        $m->salva();
        $retorno = true;
        break;
    case "MOVELAYERUP":
        include (I3GEOPATH."/classesphp/classe_temas.php");
        $m = new Temas($_SESSION["map_file"], $_GET["tema"]);
        $m->sobeTema();
        $m->salva();
        $retorno = true;
        break;
    case "MOVELAYERDOWN":
        include (I3GEOPATH."/classesphp/classe_temas.php");
        $m = new Temas($_SESSION["map_file"], $_GET["tema"]);
        $m->desceTema();
        $m->salva();
        $retorno = true;
        break;
    case "EXTENTTOLAYER":
        include (I3GEOPATH."/classesphp/classe_temas.php");
        $m = new Temas($_SESSION["map_file"], $_GET["tema"]);
        $retorno = $m->zoomTema();
        $m->salva();
        break;
    case "LIMPASEL":
        include (I3GEOPATH."/classesphp/classe_selecao.php");
        $m = new Selecao($_SESSION["map_file"]);
        $m->selecaoLimpa();
        $retorno = true;
        break;
    case "ADICIONATEMAWMS":
        include (I3GEOPATH."/classesphp/classe_mapa.php");
        $m = new Mapa($_SESSION["map_file"]);
        $m->adicionatemawms($_GET["tema"], $_GET["servico"], $_GET["nome"], $_GET["proj"], $_GET["formato"], $_SESSION["locaplic"], $_GET["tipo"], $_GET["versao"], $_GET["nomecamada"], $_SESSION["dir_tmp"], $_SESSION["imgdir"], $_SESSION["imgurl"], $_GET["tiporep"], $_GET["suportasld"], $_GET["formatosinfo"], $_GET["time"], $_GET["tile"], $_GET["allitens"]);
        $retorno = true;
        break;
    case "ADICIONATEMASHP":
        $retorno = array();
        if ($_SESSION["navegadoresLocais"] == "sim") {
            include (I3GEOPATH."/ms_configura.php");
            // verifica se esta cadastrado
            $ipcliente = pegaIPcliente();
            $ips = array();
            // pega os nomes de cada ip
            foreach ($navegadoresLocais["ips"] as $n) {
                $ips[] = gethostbyname($n);
                $ips[] = $n;
            }
            if (in_array($ipcliente, $ips)) {
                $drives = $navegadoresLocais["drives"];
                // pega o caminho
                // nome
                $split = explode("/", $_GET["arq"]);
                if (empty($split[0]) || ! in_array($split[0], array_keys($drives))) {
                    $retorno = array();
                } else {
                    include (I3GEOPATH."/classesphp/classe_mapa.php");
                    $m = new Mapa($_SESSION["map_file"]);
                    $path = $split[0];
                    $split[0] = "";
                    $shp = implode("/", $split);
                    $shp = explode(".", $shp);
                    $shp = $shp[0] . ".shp";
                    $path = $drives[$path] . $shp;
                    $retorno = $m->adicionaTemaSHP($path);
                    if ($retorno != "erro") {
                        $m->salva();
                    } else {
                        $retorno = array();
                    }
                }
            }
        }
        break;
    case "ADICIONATEMAIMG":
        $retorno = array();
        if ($_SESSION["navegadoresLocais"] == "sim") {
            include (I3GEOPATH."/ms_configura.php");
            // verifica se est&aacute; cadastrado
            $ipcliente = pegaIPcliente();
            $ips = array();
            // pega os nomes de cada ip
            foreach ($navegadoresLocais["ips"] as $n) {
                $ips[] = gethostbyname($n);
                $ips[] = $n;
            }
            if (in_array($ipcliente, $ips)) {
                $drives = $navegadoresLocais["drives"];
                // pega o caminho
                // nome
                $split = explode("/", $_GET["arq"]);
                if (empty($split[0]) || ! in_array($split[0], array_keys($drives))) {
                    $retorno = array();
                } else {
                    include (I3GEOPATH."/classesphp/classe_mapa.php");
                    $m = new Mapa($_SESSION["map_file"]);
                    $path = $split[0];
                    $split[0] = "";
                    $shp = implode("/", $split);
                    $path = $drives[$path] . $shp;
                    $retorno = $m->adicionaTemaIMG($path);
                    if ($retorno != "erro") {
                        $m->salva();
                    } else {
                        $retorno = array();
                    }
                }
            }
        }
        break;
    case "IDENTIFICA":
        $tema = "";
        if (isset($_GET["tema"])) {
            $tema = $_GET["tema"];
        }
        $opcao = $_GET["opcao"];
        $xy = $_GET["xy"];
        $resolucao = $_GET["resolucao"];
        $ext = $_GET["ext"];
        $opcao = $_GET["opcao"];
        $listaDeTemas = $_GET["listaDeTemas"];
        $wkt = $_GET["wkt"];
        if (! isset($tema)) {
            $tema = "";
        }
        if (! isset($listaDeTemas)) {
            $listaDeTemas = "";
        }
        if (! isset($resolucao)) {
            $resolucao = 5;
        }
        include (I3GEOPATH."/classesphp/classe_atributos.php");
        if (! isset($ext)) {
            $ext = "";
        }
        if (! isset($wkt)) {
            $wkt = "nao";
        }
        $m = new Atributos($_SESSION["map_file"], $tema, "", $ext);
        $retorno = $m->identifica($opcao, $xy, $resolucao, $ext, $listaDeTemas, $wkt);
        break;
    case "ADTEMA":
        include (I3GEOPATH."/classesphp/classe_mapa.php");
        $m = new Mapa($_SESSION["map_file"]);
        $salvar = $m->adicionaTema($_GET["temas"], $_SESSION["locaplic"]);
        if ($salvar) {
            $m->salva();
        }
        validaAcessoTemas($_SESSION["map_file"]);
        $retorno = true;
        break;
    case "PARAMETERS":
        include (I3GEOPATH."/classesphp/classe_mapa.php");
        $m = new Mapa($_SESSION["map_file"]);
        $par = $m->parametrosTemas();
        $e = $m->mapa->extent;
        $ext = $e->minx . " " . $e->miny . " " . $e->maxx . " " . $e->maxy;
        $res = array();
        $res["mapimagem"] = "";
        $res["mapexten"] = $ext;
        $res["mapres"] = "";
        $res["erro"] = "";
        $res["mapscale"] = "";
        $res["pixelsize"] = "";
        $res["mapimagem"] = "";
        $res["w"] = $m->mapa->width;
        $res["h"] = $m->mapa->height;
        $res["mappath"] = "";
        $res["mapurl"] = "";
        $res["mensagens"] = $m->pegaMensagens();
        $res["tempo"] = "";
        restauraCon($_SESSION["map_file"], $_SESSION["postgis_mapa"]);
        if ($par == "") {
            $retorno = false;
        } else {
            $retorno = array(
                "variaveis" => $res,
                "temas" => $par
            );
        }
        break;
    case "SEARCHINLAYERS":
        include (I3GEOPATH."/classesphp/classe_mapa.php");
        $m = new Mapa($_SESSION["map_file"]);
        $lista = $m->listaTemasBuscaRapida();
        if ($lista != "") {
            include (I3GEOPATH."/classesphp/classe_atributos.php");
            $m = new Atributos($_SESSION["map_file"]);
            $dados = $m->buscaRegistros($_GET["palavra"], $lista, "qualquer", "mapa");
            foreach ($dados as $tema) {
                $rs = $tema["resultado"];
                foreach ($rs as $r) {
                    $retorno[] = array(
                        "box" => $r["box"],
                        "valor" => $r["valores"][0]["valor"]
                    );
                }
            }
        } else {
            $retorno = false;
        }
        break;
    case "TEXTFONT":
        $retorno = listaTrueType($_SESSION["locaplic"], $_SESSION["imgdir"], $_SESSION["dir_tmp"]);
        break;
    case "ADDLAYERMETAESTAT":
        include (I3GEOPATH."/classesphp/classe_metaestatinfo.php");
        $m = new MetaestatInfo();
        if(!empty($_GET["filter"])){
            $_GET["filter"] = str_replace('"', "'", $_GET["filter"]);
            $final = array();
            $sepands = explode("|",$_GET["filter"]);
            foreach($sepands as $sepand){
                $linhas = explode("*",$sepand);
                if(!is_numeric(str_replace(array("'",","),"",$linhas[1]))){
                    exit;
                }
                if(count(explode(",",$linhas[1])) == 1){
                    $final[] = $linhas[0]." = ". $linhas[1];
                } else {
                    $final[] = $linhas[0]." IN (".$linhas[1].")";
                }
            }
            $_GET["filter"] = implode(" and ", $final);
        }
        //array("mapfile"=>$arq,"layer"=>$nomeDoLayer,"titulolayer"=>$titulolayer)
        $data = $m->mapfileMedidaVariavel($_GET["measure"], $_GET["filter"], 0, $_GET["layertype"], $_GET["title"], $_GET["classification"], $_GET["group"], $_GET["regiontype"], $_GET["opacity"], false);
        include (I3GEOPATH."/classesphp/classe_mapa.php");
        $m = new Mapa($_SESSION["map_file"]);
        $m->adicionaTema($data["mapfile"], $_SESSION["locaplic"]);
        $m->salva();
        validaAcessoTemas($_SESSION["map_file"]);
        $retorno = true;
        break;
    case "ADDLAYERREGION":
        include (I3GEOPATH."/classesphp/classe_metaestatinfo.php");
        $m = new MetaestatInfo();
        $retorno = $m->adicionaLimiteRegiao($_SESSION["map_file"],$_GET["region"]);
        validaAcessoTemas($_SESSION["map_file"]);
        break;
    case "TOGGLELAYERSVIS":
        include (I3GEOPATH."/classesphp/classe_mapa.php");
        $m = new Mapa($_SESSION["map_file"]);
        $retorno = $m->ligaDesligaTemas($_GET["on"], $_GET["off"], "nao");
        $m->salva();
        break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);