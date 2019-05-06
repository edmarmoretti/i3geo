<?php
include ("../safe.php");
switch (strtoupper($_GET["funcao"])) {
    case "EXCLUIRTEMAS":
        include_once ("../../classesphp/classe_mapa.php");
        $m = new Mapa($_SESSION["map_file"]);
        $temas = $m->excluiTemas($_GET["temas"]);
        $m->salva();
        $retorno = true;
        break;
    case "REORDENATEMAS":
        include_once ("../../classesphp/classe_temas.php");
        $m = new Temas($_SESSION["map_file"]);
        $m->reordenatemas($_GET["temas"]);
        $m->salva();
        $retorno = true;
        break;
    case "CRIALEGENDAJSON":
        include_once ("../../classesphp/classe_legenda.php");
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
        include ("../../classesphp/classe_navegacao.php");
        include ("../../classesphp/classe_temas.php");
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
        include ("../../classesphp/classe_temas.php");
        $m = new Temas($_SESSION["map_file"], $_GET["tema"]);
        $m->sobeTema();
        $m->salva();
        $retorno = true;
        break;
    case "MOVELAYERDOWN":
        include ("../../classesphp/classe_temas.php");
        $m = new Temas($_SESSION["map_file"], $_GET["tema"]);
        $m->desceTema();
        $m->salva();
        $retorno = true;
        break;
    case "EXTENTTOLAYER":
        include ("../../classesphp/classe_temas.php");
        $m = new Temas($_SESSION["map_file"], $_GET["tema"]);
        $retorno = $m->zoomTema();
        $m->salva();
        break;
    case "LIMPASEL":
        include ("../../classesphp/classe_selecao.php");
        $m = new Selecao($_SESSION["map_file"]);
        $m->selecaoLimpa();
        $retorno = true;
        break;
    case "ADICIONATEMAWMS":
        include ("../../classesphp/classe_mapa.php");
        $m = new Mapa($_SESSION["map_file"]);
        $m->adicionatemawms($_GET["tema"], $_GET["servico"], $_GET["nome"], $_GET["proj"], $_GET["formato"], $_SESSION["locaplic"], $_GET["tipo"], $_GET["versao"], $_GET["nomecamada"], $_SESSION["dir_tmp"], $_SESSION["imgdir"], $_SESSION["imgurl"], $_GET["tiporep"], $_GET["suportasld"], $_GET["formatosinfo"], $_GET["time"], $_GET["tile"], $_GET["allitens"]);
        $retorno = true;
        break;
    case "ADICIONATEMASHP":
        $retorno = array();
        if ($_SESSION["navegadoresLocais"] == "sim") {
            include ("../../ms_configura.php");
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
                    include ("../../classesphp/classe_mapa.php");
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
            include ("../../ms_configura.php");
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
                    include ("../../classesphp/classe_mapa.php");
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
        include ("../../classesphp/classe_vermultilayer.php");
        include ("../../classesphp/classe_atributos.php");
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
        include ("../../classesphp/classe_mapa.php");
        $m = new Mapa($_SESSION["map_file"]);
        $salvar = $m->adicionaTema($_GET["temas"], $_SESSION["locaplic"]);
        if ($salvar) {
            $m->salva();
        }
        validaAcessoTemas($_SESSION["map_file"]);
        $retorno = true;
        break;
    case "PARAMETERS":
        include ("../../classesphp/classe_mapa.php");
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
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);