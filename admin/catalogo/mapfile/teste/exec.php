<?php
/****************************************************************/
// include (dirname ( __FILE__ ) . "/../../../../ms_configura.php");
//
// checa login
// valida _GET e _POST, juntando em _GET
// pega algumas variaveis de uso mais comum
// session_start
//
include ("../../../php/checaLogin.php");
\admin\php\login\checaLogin();
// funcoes de administracao
include ($_SESSION["locaplic"] . "/admin/php/funcoesAdmin.php");
//
// carrega outras funcoes e extensoes do PHP
//
include ($_SESSION["locaplic"] . "/classesphp/carrega_ext.php");
//
// carrega as funcoes locais
// depende de funcoesAdmin.php
//
// include ("funcoes.php");
//
// conexao com o banco de administracao
// cria as variaveis $dbh e $dbhw alem de conexaoadmin
//
include ($_SESSION["locaplic"] . "/admin/php/conexao.php");
/**
 * ************************************************************
 */
if (\admin\php\funcoesAdmin\verificaOperacaoSessao("admin/html/editormapfile") === false) {
    header("HTTP/1.1 403 Vc nao pode realizar essa operacao");
    exit();
}
if (! empty($funcao)) {
    $codigo = str_replace(" ", "", $_POST["codigo"]);
    if (empty($codigo)) {
        header("HTTP/1.1 500 erro parametro invalido");
        exit();
    }
    $tema = $_SESSION["locaplic"] . "/temas/" . $codigo . ".map";
    if (! file_exists($tema)) {
        header("HTTP/1.1 500 erro mapfile nao encontrado");
        exit();
    }

    $funcao = strtoupper($funcao);
}
switch ($funcao) {
    case "TESTAIMG":
        $versao = \admin\php\funcoesAdmin\versao();
        $versao = $versao["principal"];
        ms_ResetErrorList();
        $tempo = microtime(true);
        $retorno = testaMapaImg($tema);
        \admin\php\funcoesAdmin\retornaJSON($retorno);
        break;
    case "TESTATABELA":
        $versao = \admin\php\funcoesAdmin\versao();
        $versao = $versao["principal"];
        ms_ResetErrorList();
        $tempo = microtime(true);
        $retorno = testaTabela($tema);
        \admin\php\funcoesAdmin\retornaJSON($retorno);
        break;
}

function mapaBase($locaplic, $versao, $base)
{
    if ($base == "" || ! isset($base)) {
        $base = "";
        if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')) {
            $base = $_SESSION["locaplic"] . "/aplicmap/geral1windowsv" . $versao . ".map";
        } else {
            if ($base == "" && file_exists('/var/www/i3geo/aplicmap/geral1debianv' . $versao . '.map')) {
                $base = "/var/www/i3geo/aplicmap/geral1debianv" . $versao . ".map";
            }
            if ($base == "" && file_exists('/var/www/html/i3geo/aplicmap/geral1fedorav' . $versao . '.map')) {
                $base = "/var/www/html/i3geo/aplicmap/geral1fedorav" . $versao . ".map";
            }
            if ($base == "" && file_exists('/opt/www/html/i3geo/aplicmap/geral1fedorav' . $versao . '.map')) {
                $base = "/opt/www/html/i3geo/aplicmap/geral1v" . $versao . ".map";
            }
            if ($base == "") {
                $base = $_SESSION["locaplic"] . "/aplicmap/geral1v" . $versao . ".map";
            }
        }
    }
    return $base;
}

function testaTabela($tema)
{
    global $versao, $base, $tempo;
    $dir_tmp = $_SESSION["dir_tmp"];
    $postgis_mapa = $_SESSION["postgis_mapa"];
    $locaplic = $_SESSION["locaplic"];
    $base = mapaBase($locaplic, $versao, $base);

    $mapa = ms_newMapObj($base);
    $nmapa = ms_newMapObj($tema);
    // error_reporting ( E_ALL );
    ms_ResetErrorList();

    $numlayers = $nmapa->numlayers;
    $dados = "";
    for ($i = 0; $i < $numlayers; $i ++) {
        $layern = $nmapa->getlayer($i);
        $layern->set("status", MS_DEFAULT);
        // error_reporting ( E_ALL );
        if ($layern->classitem != "" && $layern->connectiontype == 7 && $layern->numclasses > 0 && $layern->getmetadata("wms_sld_body") == "") {
            $tipotemp = $layern->type;
            $tiporep = $layern->getmetadata("tipooriginal");
            $layern->set("type", MS_LAYER_POLYGON);
            if ($tiporep == "linear") {
                $layern->set("type", MS_LAYER_LINE);
            }
            if ($tiporep == "pontual") {
                $layern->set("type", MS_LAYER_POINT);
            }
            $sld = $layern->generateSLD();
            if ($sld != "") {
                $layern->setmetadata("wms_sld_body", str_replace('"', "'", $sld));
            }
            $layern->set("type", $tipotemp);
        }
        $layerAdicionado = ms_newLayerObj($mapa, $layern);
        $pegarext = $layern->name;
    }

    zoomTema($pegarext, $mapa);
    include_once ($_SESSION["locaplic"] . "/classesphp/classe_atributos.php");

    $t = new Atributos($mapa, $layern->name);

    $r = $t->itensTexto();
    $colunas = explode(";", $r["itens"]);

    $ncolunas = count($colunas);
    $registros = $r["valores"];
    $nregistros = count($registros);
    $error = "";
    $error = ms_GetErrorObj();
    $tab = "";
    while ($error && $error->code != MS_NOERR) {
        $tab .= "<br>Error in %s: %s<br>";
        $tab .= $error->routine;
        $tab .= $error->message;
        $error = $error->next();
    }
    $tab .= "Registros em ISO-8859-1 s&atilde;o convertidos para UTF8<br>";
    $tab .= "Registros: " . $nregistros;
    "<br>";
    $tab .= "<br><b>Tempo leitura (s): ";
    $tab .= microtime(true) - $tempo;
    $tab .= "</b>";
    $tab .= "<table>";
    $tab .= "<tr>";
    foreach ($colunas as $co) {
        $tab .= "<td><b>" . $co . "</b></td>";
    }
    $tab .= "</tr>";
    foreach ($registros as $reg) {
        $tab .= "<tr>";
        $cc = explode(";", $reg);
        foreach ($cc as $c) {
            if (mb_detect_encoding($c, 'UTF-8, ISO-8859-1') == "ISO-8859-1") {
                $c = utf8_encode($c);
            }
            $tab .= "<td>" . $c . "</td>";
        }
        $tab .= "</tr>";
    }
    $tab .= "</table>";
    $tab .= "<br><b>Tempo total (montagem da tabela) (s): ";
    $tab .= microtime(true) - $tempo;
    $tab .= "</b>";
    return $tab;
}

function testaMapaImg($tema)
{
    global $versao, $base, $tempo;
    $dir_tmp = $_SESSION["dir_tmp"];
    $postgis_mapa = $_SESSION["postgis_mapa"];
    $locaplic = $_SESSION["locaplic"];
    $base = mapaBase($_SESSION["locaplic"], $versao, $base);
    $mapa = ms_newMapObj($base);
    // error_reporting ( E_ALL );
    ms_ResetErrorList();
    $erroComplemento = "";
    // verificacoes de compatibilidade Mapserver
    if ($versao >= 7) {
        $teste = file_get_contents($tema);
        if (stripos($teste, 'ANNOTATION') !== false) {
            $erroComplemento .= " Verifique se o LAYER e do tipo ANNOTATION";
        }
        if (stripos($teste, 'Cluster:FeatureCount') !== false) {
            $erroComplemento .= " Verifique se existe Cluster:FeatureCount e troque por Cluster_FeatureCount";
        }
    }
    try {
        ms_newMapObj($tema);
    } catch (Exception $e) {
        return array(
            "imgMapa" => "",
            "imgLegenda" => "",
            "tempo" => (microtime(true) - $tempo),
            "erro" => "Objeto map nao pode ser criado. Erro fatal. " . $erroComplemento
        );
    }
    if (@ms_newMapObj($tema)) {
        $nmapa = ms_newMapObj($tema);
    } else {
        $erro = "";
        $error = ms_GetErrorObj();
        while ($error && $error->code != MS_NOERR) {
            $erro .= "<br>Error in %s: %s<br>\n";
            $erro .= "<br>" . $error->routine;
            $erro .= "<br>" . $error->message;
            $error = $error->next();
        }
        return array(
            "imgMapa" => "",
            "imgLegenda" => "",
            "tempo" => (microtime(true) - $tempo),
            "erro" => $erro . " " . $erroComplemento
        );
    }
    \admin\php\funcoesAdmin\substituiConObj($mapa, $postgis_mapa);
    \admin\php\funcoesAdmin\substituiConObj($nmapa, $postgis_mapa);
    $numlayers = $nmapa->numlayers;
    $dados = "";
    $simbolos = array();
    for ($i = 0; $i < $numlayers; $i ++) {
        $layern = $nmapa->getlayer($i);
        $layern->set("status", MS_DEFAULT);
        autoClassesLocal($layern, $nmapa);
        // error_reporting ( E_ALL );
        if ($layern->classitem != "" && $layern->connectiontype == 7 && $layern->numclasses > 0 && $layern->getmetadata("wms_sld_body") == "") {
            $tipotemp = $layern->type;
            $tiporep = $layern->getmetadata("tipooriginal");
            $layern->set("type", MS_LAYER_POLYGON);
            if ($tiporep == "linear") {
                $layern->set("type", MS_LAYER_LINE);
            }
            if ($tiporep == "pontual") {
                $layern->set("type", MS_LAYER_POINT);
            }
            $sld = $layern->generateSLD();
            if ($sld != "") {
                $layern->setmetadata("wms_sld_body", str_replace('"', "'", $sld));
            }
            $layern->set("type", $tipotemp);
        }
        // pega simbolos locais e aplica no novo mapa
        cloneInlineSymbolLocal($layern, $nmapa, $mapa);

        $layerAdicionado = ms_newLayerObj($mapa, $layern);

        corrigeLayerGridLocal($layerAdicionado, $mapa);
        corrigeLayerGridLocal($layern, $layerAdicionado);
        $pegarext = $layern->name;
    }
    zoomTema($pegarext, $mapa);
    $mapa->setsize(500, 500);
    $sca = $mapa->scalebar;
    $sca->set("status", MS_OFF);
    $objImagem = @$mapa->draw();

    // corrige o titulo da legenda
    $numlayers = $mapa->numlayers;
    for ($j = 0; $j < $numlayers; $j ++) {
        $l = $mapa->getlayer($j);
        if ($l->type != 3 && $l->type != 4) {
            $nclass = $l->numclasses;
            for ($i = 0; $i < $nclass; $i ++) {
                $classe = $l->getclass($i);
                if ($classe->title === "") {
                    $classe->title = $classe->name;
                }
            }
        }
    }
    $objImagemLegenda = @$mapa->drawLegend();
    if (! $objImagem) {
        $error = "";
        $erro = "";
        $error = ms_GetErrorObj();
        while ($error && $error->code != MS_NOERR) {
            $erro .= "<br>Error in %s: %s<br>";
            $erro .= "<br>" . $error->routine;
            $erro .= "<br>" . $error->message;
            $error = $error->next();
        }
        return array(
            "imgMapa" => "",
            "imgLegenda" => "",
            "tempo" => (microtime(true) - $tempo),
            "erro" => $erro . " " . $erroComplemento
        );
    }
    if ($objImagem->imagepath == "") {
        return array(
            "imgMapa" => "",
            "imgLegenda" => "",
            "tempo" => (microtime(true) - $tempo),
            "erro" => "Erro IMAGEPATH vazio. " . $erroComplemento
        );
    }
    $nomec = ($objImagem->imagepath) . \admin\php\funcoesAdmin\nomeRandomico() . "teste.png";
    $objImagem->saveImage($nomec);

    $nomel = ($objImagemLegenda->imagepath) . \admin\php\funcoesAdmin\nomeRandomico() . "testel.png";
    $objImagemLegenda->saveImage($nomel);

    $erro = "";
    $error = "";
    $error = ms_GetErrorObj();
    while ($error && $error->code != MS_NOERR) {
        $erro .= "<br>Error in %s: %s<br>";
        $erro .= "<br>" . $error->routine;
        $erro .= "<br>" . $error->message;
        $error = $error->next();
    }
    return array(
        "imgMapa" => ($objImagem->imageurl) . basename($nomec),
        "imgLegenda" => ($objImagemLegenda->imageurl) . basename($nomel),
        "tempo" => (microtime(true) - $tempo),
        "erro" => $erro . " " . $erroComplemento
    );
}

function zoomTema($nomelayer, &$mapa)
{
    $layer = $mapa->getlayerbyname($nomelayer);
    if ($layer->data == "" && $layer->connection == "") {
        return;
    }
    $prjMapa = $mapa->getProjection();
    $prjTema = $layer->getProjection();
    $extatual = $mapa->extent;
    $ret = $layer->getmetadata("extensao");
    if ($layer->type > 2 && $ret == "") {
        return;
    }
    $ct = $layer->connectiontype;
    if (($ret == "") && ($ct != 1)) {
        return;
    }
    if ($ret == "") {
        $ret = $layer->getextent();
        // reprojeta o retangulo
        if (($prjTema != "") && ($prjMapa != $prjTema)) {
            $projInObj = ms_newprojectionobj($prjTema);
            $projOutObj = ms_newprojectionobj($prjMapa);
            $ret->project($projInObj, $projOutObj);
        }
        $extatual->setextent($ret->minx, $ret->miny, $ret->maxx, $ret->maxy);
    } else {
        $ret = explode(" ", $ret);
        $extatual->setextent($ret[0], $ret[1], $ret[2], $ret[3]);
    }
}

function autoClassesLocal(&$nlayer, $mapa, $locaplic = null)
{
    $postgis_mapa = $_SESSION["postgis_mapa"];
    ;
    $substituicon = "nao";
    if ($nlayer->connectiontype == MS_POSTGIS) {
        if ($nlayer->connection == " ") {
            $nlayer->set("connection", $postgis_mapa);
            $substituicon = "sim";
        }
    }
    //
    // gera classes automaticamente (temas vetoriais)
    if ($nlayer->getmetadata("classesitem") != "") {
        $itemnome = $nlayer->getmetadata("classesnome");
        $itemid = $nlayer->getmetadata("classesitem");
        $itemcor = $nlayer->getmetadata("classescor");
        $itemsimbolo = $nlayer->getmetadata("classesimbolo");
        $itemtamanho = $nlayer->getmetadata("classestamanho");
        $classeoriginal = $nlayer->getclass(0);
        //
        // pega a extensao geografica que devera ser utilizada
        //
        $prjMapa = $mapa->getProjection();
        $prjTema = $nlayer->getProjection();
        $ret = $nlayer->getmetadata("extensao");
        if ($ret == "") {
            $ret = $nlayer->getextent();
            // reprojeta o retangulo
            if (($prjTema != "") && ($prjMapa != $prjTema)) {
                $projInObj = ms_newprojectionobj($prjTema);
                $projOutObj = ms_newprojectionobj($prjMapa);
                $ret->project($projInObj, $projOutObj);
            }
        } else {
            $temp = explode(" ", $ret);
            $ret = ms_newRectObj();
            $ret->setextent($temp[0], $temp[1], $temp[2], $temp[3]);
        }
        //
        $sopen = $nlayer->open();
        if ($sopen == MS_FAILURE) {
            return "erro";
        }

        $status = $nlayer->whichShapes($ret);
        $parametrosClasses = array();
        if ($status == 0) {
            while ($shape = $nlayer->nextShape()) {
                $id = trim($shape->values[$itemid]);
                if (! $parametrosClasses[$id]) {
                    $nome = "";
                    if ($itemnome != "")
                        $nome = trim($shape->values[$itemnome]);
                    $cor = "";
                    if ($itemcor != "")
                        $cor = explode(",", trim($shape->values[$itemcor]));
                    if (count($cor) != 3)
                        $cor = explode(" ", trim($shape->values[$itemcor]));
                    $tamanho = "";
                    if ($itemtamanho != "")
                        $tamanho = trim($shape->values[$itemtamanho]);
                    $simbolo = "";
                    if ($itemsimbolo != "")
                        $simbolo = trim($shape->values[$itemsimbolo]);
                    $parametrosClasses[$id] = array(
                        "nome" => $nome,
                        "cor" => $cor,
                        "tamanho" => $tamanho,
                        "simbolo" => $simbolo
                    );
                }
            }
            $fechou = $nlayer->close();
            // echo "<pre>";var_dump($parametrosClasses);
            if (count($parametrosClasses) > 0) {
                $ids = array_keys($parametrosClasses);
                for ($i = 0; $i < count($parametrosClasses); ++ $i) {
                    $p = $parametrosClasses[$ids[$i]];
                    // echo "<pre>";var_dump($p);
                    $nclasse = ms_newClassObj($nlayer, $classeoriginal);
                    if ($p["nome"] != "")
                        $nclasse->set("name", $p["nome"]);
                    $estilo = $nclasse->getstyle(0);
                    if ($p["cor"] != "") {
                        $cor = $p["cor"];
                        $ncor = $estilo->color;
                        if ($ncor == "")
                            $ncor = $estilo->outlinecolor;
                        $ncor->setrgb($cor[0], $cor[1], $cor[2]);
                    }
                    if ($p["tamanho"] != "")
                        $estilo->set("size", $p["tamanho"]);
                    if ($p["simbolo"] != "")
                        $estilo->set("symbolname", $p["simbolo"]);
                    $strE = "('[" . $itemid . "]'eq'" . $ids[$i] . "')";
                    $nclasse->setexpression($strE);
                }
                $classeoriginal->set("status", MS_DELETE);
            }
        }
        if ($substituicon == "sim") {
            $nlayer->set("connection", " ");
        }
    }
    $pf = $nlayer->getmetadata("palletefile");
    if ($pf != "") {
        if (! file_exists($pf)) {
            return;
        }
        $ps = $nlayer->getmetadata("palletesteps");
        if ($ps == "")
            $ps = 8;
        //
        // pega os valores do arquivo
        //
        $rules = array();
        $abre = fopen($pf, "r");
        $paletteRules = array();
        while (! feof($abre)) {
            $line = trim(fgets($abre));
            $pos = strpos($line, "#");
            if ($pos === false || $pos > 0) {
                $paletteEntry = explode(" ", $line);
                $rules[] = array(
                    "v0" => $paletteEntry[0],
                    "v1" => $paletteEntry[1],
                    "r0" => $paletteEntry[2],
                    "g0" => $paletteEntry[3],
                    "b0" => $paletteEntry[4],
                    "r1" => $paletteEntry[5],
                    "g1" => $paletteEntry[6],
                    "b1" => $paletteEntry[7]
                );
            }
        }
        fclose($abre);
        foreach ($rules as $rule) {
            $delta = ceil(($rule["v1"] - $rule["v0"]) / $ps);
            $legenda = true;
            for ($value = $rule["v0"]; $value < $rule["v1"]; $value += $delta) {
                $class = ms_newClassObj($nlayer);
                $style = ms_newStyleObj($class);
                if ($legenda) {
                    $class->set(name, round($value, 0));
                    $legenda = true;
                }
                $expression = "([pixel] > " . round($value, 0) . " AND [pixel] <= " . round($value + $delta, 0) . ")";
                $class->setExpression($expression);
                $rgb = getRGBpalleteLocal($rule, $value);
                $style->color->setRGB($rgb[0], $rgb[1], $rgb[2]);
            }
        }
    }
    return;
}

function getRGBpalleteLocal($rule, $value)
{
    $escala = ($value - $rule["v0"]) / ($rule["v1"] - $rule["v0"]);
    $r = $rule["r0"] + round(($rule["r1"] - $rule["r0"]) * $escala, 0);
    $g = $rule["g0"] + round(($rule["g1"] - $rule["g0"]) * $escala, 0);
    $b = $rule["b0"] + round(($rule["b1"] - $rule["b0"]) * $escala, 0);
    return array(
        $r,
        $g,
        $b
    );
}

function cloneInlineSymbolLocal($layern, $nmapa, $mapa)
{
    $numclasses = $layern->numclasses;
    for ($ci = 0; $ci < $numclasses; $ci ++) {
        $classe = $layern->getclass($ci);
        $numestilos = $classe->numstyles;
        for ($ei = 0; $ei < $numestilos; $ei ++) {
            $estilo = $classe->getstyle($ei);
            if ($estilo->symbolname != "") {
                $nomesimbolo = $estilo->symbolname;
                $simbolo = $nmapa->getSymbolObjectById($nmapa->getSymbolByName($nomesimbolo));
                if ($simbolo->inmapfile == MS_TRUE || file_exists($nomesimbolo)) {
                    $simbolon = new symbolObj($mapa, $nomesimbolo);
                    $simbolon->set("inmapfile", MS_TRUE);

                    $simbolon->setImagePath($simbolo->imagepath);
                    $simbolon->setPoints($simbolo->getPointsArray());
                    // $simbolon->setPattern($simbolo->getPatternArray());
                    $simbolon->set("type", $simbolo->type);
                    // $simbolon->set("antialias",$simbolo->antialias);
                    $simbolon->set("character", $simbolo->character);
                    $simbolon->set("filled", $simbolo->filled);

                    // $simbolon->set("font",$simbolo->font);
                    // $simbolon->set("position",$simbolo->position);
                    $simbolon->set("sizex", $simbolo->sizex);
                    $simbolon->set("sizey", $simbolo->sizey);
                    $simbolon->set("transparent", $simbolo->transparent);
                    $simbolon->set("transparentcolor", $simbolo->transparentcolor);
                    // $simbolon->set("anchorpoint",$simbolo->anchorpoint);
                }
            }
        }
    }
}

function corrigeLayerGridLocal($layerOrigem, $layerDestino)
{
    if ($layerOrigem->connectiontype == MS_GRATICULE) {
        ms_newgridobj($layerDestino);
        $layerDestino->grid->set("labelformat", $layerOrigem->grid->labelformat);
        $layerDestino->grid->set("mininterval", $layerOrigem->grid->mininterval);
        $layerDestino->grid->set("maxinterval", $layerOrigem->grid->maxinterval);
        $layerDestino->grid->set("minsubdivide", $layerOrigem->grid->minsubdivide);
        $layerDestino->grid->set("maxsubdivide", $layerOrigem->grid->maxsubdivide);
        $layerDestino->grid->set("minarcs", $layerOrigem->grid->minarcs);
        $layerDestino->grid->set("maxarcs", $layerOrigem->grid->maxarcs);
        // $layerDestino->updatefromstring("LAYER GRID LABELFORMAT '" . $layerOrigem->grid->labelformat . "' END END");
    }
}
?>
