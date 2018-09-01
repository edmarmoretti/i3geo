<?php

/*
 * Title: classe_legenda.php
 *
 * Manipula&ccedil;&atilde;o da legenda.
 *
 * Cria legenda, edita simbolos, etc.
 *
 * Licenca:
 *
 * GPL2
 *
 *
 * i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet
 *
 * Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
 * Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com
 *
 * Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
 * e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
 * GNU conforme publicada pela Free Software Foundation;
 *
 * Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
 * por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
 * de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
 * Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
 * Voc&ecirc; deve ter recebido uma c�pia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a
 * Free Software Foundation, Inc., no endere&ccedil;o
 * 59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 *
 * Arquivo:
 *
 * i3geo/classesphp/classe_legenda.php
 */
/*
 * Classe: Legenda
 *
 */
class Legenda
{

    /*
     * Variavel: $mapa
     *
     * Objeto mapa
     */
    public $mapa;

    /*
     * Variavel: $arquivo
     *
     * Arquivo map file
     */
    protected $arquivo;

    /*
     * Variavel: $layer
     *
     * Objeto layer
     */
    public $layer;

    /*
     * Variavel: $nome
     *
     * Nome do layer
     */
    protected $nome;

    /*
     * Variavel: $grupo
     *
     * Array com os temas do grupo, se houver
     */
    protected $grupo;

    /*
     * Variavel: $visiveis
     *
     * Temas do grupo que s&atilde;o vis&iacute;veis em fun&ccedil;&atilde;o da escala
     */
    protected $visiveis;

    /*
     * Variavel: $indices
     *
     * Indices dos layers do grupo
     */
    protected $indices;

    /*
     * Variavel: $templateleg
     *
     * Template da legenda
     */
    protected $templateleg;

    /*
     * Variavel: $localaplicacao
     *
     * Localiza&ccedil;&atilde;o da aplica&ccedil;&atilde;o
     */
    protected $localaplicacao;

    /*
     * Variavel: $v
     *
     * Vers&atilde;o atual do Mapserver (primeiro d&iacute;gito)
     */
    public $v;

    /*
     * Function: __construct
     *
     * Cria um objeto Legenda
     *
     * parameters:
     *
     * $map_file - Endere&ccedil;o do mapfile no servidor.
     *
     * $locaplic - localiza&ccedil;&atilde;o do I3Geo no servidor
     *
     * $tema - nome do tema
     *
     * $template - nome do template para processar a legenda
     */
    function __construct($map_file = "", $locaplic = "", $tema = "", $template = "")
    {
        include (dirname(__FILE__) . "/../ms_configura.php");
        $this->postgis_mapa = $postgis_mapa;
        include_once (dirname(__FILE__) . "/funcoes_gerais.php");
        include_once (dirname(__FILE__) . "/classe_vermultilayer.php");
        $this->v = versao();
        $this->v = $this->v["principal"];
        $this->localaplicacao = $locaplic;
        if ($map_file == "") {
            return;
        }
        $this->mapa = ms_newMapObj($map_file);
        substituiConObj($this->mapa, $postgis_mapa);
        $this->arquivo = str_replace(".map", "", $map_file) . ".map";

        if ($tema != "" && @$this->mapa->getlayerbyname($tema)) {
            $this->layer = $this->mapa->getlayerbyname($tema);
            $this->nome = $tema;
            $vermultilayer = new vermultilayer();
            $vermultilayer->verifica($map_file, $tema);
            if ($vermultilayer->resultado == 1) // o tema e multi layer
            {
                $ls = $vermultilayer->temas;
                $this->visiveis = $vermultilayer->temasvisiveis;
            } else {
                $ls[] = $tema;
                $this->visiveis = array(
                    $tema
                );
            }
            $this->grupo = $ls;
            foreach ($ls as $l) {
                $t = $this->mapa->getlayerbyname($l);
                $this->indices[] = $t->index;
            }
        }
        if ($template == "") {
            $template = "legenda.htm";
        }
        if (file_exists($template)) {
            $this->templateleg = $template;
            return;
        }
        if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')) {
            $this->templateleg = $locaplic . "\\aplicmap\\" . $template;
        } else {
            $this->templateleg = $locaplic . "/aplicmap/" . $template;
        }
    }

    /*
     * function: salva
     *
     * Salva o mapfile atual
     */
    function salva()
    {
        if (isset($this->layer)) {
            $this->recalculaSLD();
        }
        restauraConObj($this->mapa, $this->postgis_mapa);
        $this->mapa->save($this->arquivo);
    }

    /*
     * function: recalculaSLD
     *
     * Constroi o SLD que &eacute; aplicado ao metadata wms_sld_body. O SLD resultante &eacute; baseado nas defini&ccedil;&otilde;es das classes existentes no layer
     */
    function recalculaSLD()
    {
        if ($this->layer->classitem != "" && $this->layer->connectiontype == 7 && $this->layer->numclasses > 0) {
            $tipotemp = $this->layer->type;
            $tiporep = $this->layer->getmetadata("tipooriginal");
            $this->layer->set("type", MS_LAYER_POLYGON);
            if ($tiporep == "linear") {
                $this->layer->set("type", MS_LAYER_LINE);
            }
            if ($tiporep == "pontual") {
                $this->layer->set("type", MS_LAYER_POINT);
            }
            $this->layer->set("status", MS_DEFAULT);
            $this->layer->setmetadata("wms_sld_body", "");
            $sld = $this->layer->generateSLD();
            if ($sld != "") {
                $this->layer->setmetadata("wms_sld_body", str_replace('"', "'", $sld));
            }
            $this->layer->set("type", $tipotemp);
        }
    }

    /*
     * function: aplicaLegendaImg
     *
     * Aplica o metadata legendaimg que define um arquivo de imagem no lugar da criacao automatica da legenda
     */
    function aplicaLegendaImg($imagem)
    {
        $this->layer->setmetadata("legendaimg", $imagem);
        return true;
    }

    /*
     * function: criaLegenda
     *
     * Gera a legenda processando o template HTML definido na constru&ccedil;&atilde;o da classe.
     *
     * Se o tema for um WMS ou se o metadata legendaimg estiver definido, executa $this->tabelaLegenda
     *
     * Return:
     *
     * string com a legenda HTML
     */
    function criaLegenda()
    {
        $l = "";
        $numlayers = $this->mapa->numlayers;
        if ($this->nome != "") {
            // verifica se &eacute; wms ou se o metadata legendaimg est&aacute; definido
            $c = $this->layer->connectiontype;
            if ($c == 7 || $this->layer->getmetadata("legendaimg") != "") {
                return ($this->tabelaLegenda());
            }
            for ($i = 0; $i < $numlayers; ++ $i) {
                $la = $this->mapa->getlayer($i);
                if ($la->name != $this->nome) {
                    $la->set("status", MS_OFF);
                }
                if ($la->group == $this->nome) {
                    $la->set("status", MS_DEFAULT);
                }
                $la->set("minscaledenom", 0);
                $la->set("maxscaledenom", 0);
            }
            $this->layer->set("status", MS_DEFAULT);
        }
        $desligar = array();
        for ($i = 0; $i < $numlayers; ++ $i) {
            $la = $this->mapa->getlayer($i);
            if (strtoupper($la->getmetadata("ESCONDIDO")) == "SIM") {
                $la->set("status", MS_OFF);
            }
            $desligarLayer = array();
            if ($la->status == MS_DEFAULT) {
                $nc = $la->numclasses;
                for ($c = 0; $c < $nc; $c ++) {
                    $classe = $la->getclass($c);
                    if ($classe->status == MS_OFF) {
                        $desligarLayer[] = $c;
                    }
                    // remove o offset em simbolos do tipo imagem
                    if ($classe->numstyles > 0) {
                        $estilo = $classe->getstyle(0);
                        if ($estilo->symbolname != "" && file_exists($estilo->symbolname)) {
                            $estilo->set("offsetx", 0);
                            $estilo->set("offsety", 0);
                        }
                    }
                }
                $la->set("minscaledenom", 0);
                $la->set("maxscaledenom", 0);
            }
            $desligar[$la->name] = $desligarLayer;
        }
        $legenda = $this->mapa->legend;
        $legenda->set("template", $this->templateleg);
        $tmparray["my_tag"] = "value_of_my_tag";
        if (! $l = @$this->mapa->processlegendtemplate($tmparray)) {
            return ("erro");
        }
        // e necessario explodir as partes da legenda para converter os caracteres
        $pedacos = explode("<tr>", $l);
        $n = count($pedacos);
        for ($i = 0; $i < $n; $i ++) {
            $pedacos[$i] = $this->converte($pedacos[$i]);
        }
        $l = implode("<tr>", $pedacos);
        return (array(
            "legenda" => $l,
            "desativar" => $desligar
        ));
    }

    function criaLegendaJson($w = 25, $h = 25)
    {
        $l = "";
        $numlayers = $this->mapa->numlayers;
        if ($this->nome != "") {
            // verifica se &eacute; wms ou se o metadata legendaimg est&aacute; definido
            $c = $this->layer->connectiontype;
            if ($c == 7 || $this->layer->getmetadata("legendaimg") != "") {
                // return ($this->tabelaLegenda());
            }
            for ($i = 0; $i < $numlayers; ++ $i) {
                $la = $this->mapa->getlayer($i);
                if ($la->name != $this->nome) {
                    $la->set("status", MS_OFF);
                }
                if ($la->group == $this->nome) {
                    $la->set("status", MS_DEFAULT);
                }
                $la->set("minscaledenom", 0);
                $la->set("maxscaledenom", 0);
            }
            $this->layer->set("status", MS_DEFAULT);
        }
        $desligar = array();
        $legenda = array();
        for ($i = 0; $i < $numlayers; ++ $i) {
            $la = $this->mapa->getlayer($i);
            if (strtoupper($la->getmetadata("CLASSE")) == "NAO" || strtoupper($la->getmetadata("ESCONDIDO")) == "SIM") {
                $la->set("status", MS_OFF);
            }
            $desligarLayer = array();
            if ($la->status == MS_DEFAULT) {
                // "legendawms" "http://mapas.mma.gov.br/cgi-bin/mapserv?map=/opt/www/html/webservices/biorregioes.map&service=wms&request=getlegendgraphic&version=1.1.1&service=wms&layer=biomas&format=image/png"

                if ($la->getmetadata("legendaimg") != "" || $la->getmetadata("legendawms") != "") {
                    $imagem = $la->getmetadata("legendaimg");
                    if ($imagem == "") {
                        $imagem = $la->getmetadata("legendawms");
                    }
                    $classes = array();
                    $classes[] = array(
                        "nome" => "",
                        "img" => $imagem,
                        "checked" => "checked",
                        "index" => 0,
                        "layer" => $la->name
                    );
                    $legenda[] = array(
                        "layer" => $la->name,
                        "nome" => $this->converte($la->getmetadata("tema")),
                        "classes" => $classes,
                        "tipo" => "imagem"
                    );
                } else {
                    $la->set("minscaledenom", 0);
                    $la->set("maxscaledenom", 0);
                    $nc = $la->numclasses;
                    $classes = array();
                    for ($c = 0; $c < $nc; $c ++) {
                        $ck = "checked";
                        $classe = $la->getclass($c);
                        if ($classe->status == MS_OFF) {
                            $ck = "";
                        }
                        $cores = array(
                            "color" => "-1 -1 -1",
                            "outline" => "-1 -1 -1",
                            "background" => "-1 -1 -1"
                        );
                        // o simbolo pode ser definido apenas com base nas cores
                        $simple = true;

                        // remove o offset em simbolos do tipo imagem
                        if ($classe->numstyles > 0) {
                            $estilo = $classe->getstyle(0);
                            $simbolo = $this->mapa->getSymbolObjectById($estilo->symbol);
                            if ($simbolo != "") {
                                if ($estilo->symbolname != "" && $simbolo->imagepath != "") {
                                    $estilo->set("offsetx", 0);
                                    $estilo->set("offsety", 0);
                                }
                            }
                            $cor = array(
                                "color" => corRGB($estilo->color),
                                "outline" => corRGB($estilo->outlinecolor),
                                "background" => corRGB($estilo->backgroundcolor)
                            );
                            if ($estilo->symbolname != "" && $estilo->symbolname != "linha" && $estilo->symbolname != "ponto") {
                                $simple = false;
                            }
                        }
                        $imagem = $classe->createLegendIcon($w, $h)->saveWebImage();

                        $classes[] = array(
                            "nome" => $this->converte($classe->name),
                            "img" => $imagem,
                            "checked" => $ck,
                            "index" => $c,
                            "layer" => $la->name,
                            "cor" => $cor,
                            "w" => $w,
                            "h" => $h,
                            "minscaledenom" => $classe->minscaledenom,
                            "maxscaledenom" => $classe->maxscaledenom,
                            "simple" => $simple
                        );
                    }
                    $legenda[] = array(
                        "layer" => $la->name,
                        "nome" => $this->converte($la->getmetadata("tema")),
                        "classes" => $classes,
                        "tipo" => ""
                    );
                }
            }
            $desligar[$la->name] = $desligarLayer;
        }
        return (array(
            "legenda" => $legenda
        ));
    }

    /*
     * function: legendaGrafica
     *
     * Desenha a imagem da legenda.
     *
     * return:
     * string de variaveis no formato javascript que permitem montar a legenda.
     */
    function legendaGrafica()
    {
        $numlayers = $this->mapa->numlayers;
        for ($i = 0; $i < $numlayers; ++ $i) {
            $layer = $this->mapa->getlayer($i);
            if (($layer->data != "") && (strtoupper($layer->getmetadata("escondido")) != "SIM") && (strtoupper($layer->getmetadata("tema")) != "NAO")) {
                if ($layer->numclasses > 0) {
                    $classe = $layer->getclass(0);
                    if (($classe->name == "") || ($classe->name == " ")) {
                        $classe->set("name", $layer->getmetadata("tema"));
                    }
                    // corrige o titulo da legenda
                    if ($layer->type != 3 && $layer->type != 4) {
                        $nclass = $layer->numclasses;
                        for ($j = 0; $j < $nclass; $j ++) {
                            $classe = $layer->getclass($j);
                            if ($classe->title === "") {
                                $classe->title = $classe->name;
                            }
                        }
                    }
                }
            }
        }
        $nomeImagem = nomeRandomico();
        $imgo = $this->mapa->drawlegend();
        if ($imgo->imagepath == "") {
            echo "Erro IMAGEPATH vazio";
            exit();
        }
        $arq = ($imgo->imagepath) . "leg" . $nomeImagem . ".png";
        $imgo->saveImage($arq);
        $nomer = ($imgo->imageurl) . basename($arq);
        return (array(
            "imagem" => $nomer,
            "width" => $imgo->width,
            "height" => $imgo->height,
            "path" => $imgo->imagepath,
            "url" => $imgo->imageurl,
            "arq" => $arq
        ));
    }

    /*
     * function: tabelaLegenda
     *
     * Cria elementos para construir uma legenda no formato de tabela em HTML.
     *
     * Utilizado na fun&ccedil;&atilde;o de edi&ccedil;&atilde;o de legenda e legenda de WMS
     *
     * parameters:
     *
     * totaliza - sim|nao indica se os totais de elementos devem ser acrescentados ao nome da classe
     *
     * return:
     * array
     */
    function tabelaLegenda($totaliza = "nao")
    {
        $linhas = array();
        foreach ($this->visiveis as $l) {
            $layer = $this->mapa->getlayerbyname($l);
            // verifica se &eacute; wms ou wfs
            $c = $layer->connectiontype;

            $s = $layer->getmetadata("wms_sld_url");
            $im = $layer->getmetadata("legendaimg");
            $nc = $layer->numclasses;
            //
            // se for wms e tiver classes define o tipo de layer para poder gerar a legenda corretamente
            //
            if ($c == 7 && $nc > 0) {
                $tipotemp = $layer->type;
                $tiporep = $layer->getmetadata("tipooriginal");
                $layer->set("type", MS_LAYER_POLYGON);
                if ($tiporep == "linear") {
                    $layer->set("type", MS_LAYER_LINE);
                }
                if ($tiporep == "pontual") {
                    $layer->set("type", MS_LAYER_POINT);
                }
            }
            //
            // se for WMS e n&atilde;o tiver classes, tenta pegar a legenda via requisi&ccedil;&atilde;o WMS
            //
            if ($c == 7) {
                if ($c == 7) {
                    $con = $layer->connection;
                    $ver = $layer->getmetadata("wms_server_version");
                    $lwms = $layer->getmetadata("wms_name");
                    $f = $layer->getmetadata("wms_formatlist");
                    $f = explode(",", $f);
                    $f = $f[0];
                    $imgLeg = $con . "&request=GetLegendGraphic&version=" . $ver . "&service=wms&layer=" . $lwms . "&format=" . $f . "&SLD=" . $s;
                    if ($layer->getmetadata("legendawms") != "") {
                        $imgLeg = $layer->getmetadata("legendawms");
                    }
                } else {
                    $imgLeg = $im;
                }
                $linhas[] = array(
                    "tema" => $l,
                    "idclasse" => "",
                    "nomeclasse" => "",
                    "expressao" => "",
                    "expressao" => "",
                    "imagem" => $imgLeg,
                    "minScale" => 0,
                    "maxScale" => 0
                );
            } else {
                for ($c = 0; $c < $nc; $c ++) {
                    $classe = $layer->getclass($c);
                    $imgi = $classe->createlegendicon(30, 15);
                    $classe->drawlegendicon(30, 15, $imgi, 0, 0);
                    $nomes = nomeRandomico(12);
                    $nomer = ($imgi->imagepath) . "icone" . $nomes . ".png";
                    $imgi->saveImage($nomer);
                    $i = ($imgi->imageurl) . basename($nomer);
                    $nomeclasse = $classe->name;

                    // if (function_exists("mb_convert_encoding"))
                    // {$nomeclasse = mb_convert_encoding($nomeclasse,"UTF-8","ISO-8859-1");}
                    $nomeclasse = $this->converte($nomeclasse);
                    $nomeexp = $classe->getExpressionString();
                    if (function_exists("mb_convert_encoding")) {
                        $nomeexp = mb_convert_encoding($nomeexp, "UTF-8", "ISO-8859-1");
                    }
                    $linhas[] = array(
                        "tema" => $l,
                        "idclasse" => $c,
                        "nomeclasse" => $nomeclasse,
                        "expressao" => $nomeexp,
                        "imagem" => $i,
                        "proc" => "",
                        "minScale" => $classe->minscaledenom,
                        "maxScale" => $classe->maxscaledenom
                    );
                }
                if (($totaliza == "sim") && ($nc > 1)) {
                    $layer->set("template", "none.htm");
                    $sopen = $layer->open();
                    if ($sopen == MS_FAILURE) {
                        return "erro";
                    }
                    $itens = $layer->getitems();
                    $total = 0;
                    $nreg = array();
                    for ($c = 0; $c < $nc; $c ++) {
                        $exp = $linhas[$c];
                        $exp = $exp["expressao"];
                        if ($exp !== "") {
                            if ($this->layer->connectiontype == MS_POSTGIS) {
                                $exp = str_replace("eq", " = ", $exp);
                                $exp = str_replace("ne", " != ", $exp);
                                $exp = str_replace("lt", " < ", $exp);
                                $exp = str_replace("gt", " < ", $exp);
                                $exp = str_replace("(", "", $exp);
                                $exp = str_replace(")", "", $exp);
                                $exp = str_replace("'[", "", $exp);
                                $exp = str_replace("]'", "", $exp);
                                $exp = str_replace("' [", "", $exp);
                                $exp = str_replace("] '", "", $exp);
                                $exp = str_replace("and", " and ", $exp);
                                $exp = str_replace("or", " or ", $exp);
                                $exp = str_replace("[", "", $exp);
                                $exp = str_replace("]", "", $exp);
                            }
                            $teste = $layer->queryByAttributes($itens[0], $exp, 1);
                            if ($teste != MS_SUCCESS) {
                                $teste = $layer->queryByAttributes($itens[0], mb_convert_encoding($exp, "ISO-8859-1", "UTF-8"), 1);
                            }
                            if ($teste != MS_SUCCESS) {
                                $teste = $layer->queryByAttributes($itens[0], mb_convert_encoding($exp, "UTF-8", "ISO-8859-1"), 1);
                            }
                        } else {
                            $teste = 0;
                        }
                        if ($teste == MS_SUCCESS) {
                            $n = $layer->getNumResults();
                            $nreg[] = $n;
                        } else {
                            $nreg[] = "erro";
                        }
                        $total = $total + $n;
                    }
                    $layer->close();
                    for ($c = 0; $c < $nc; $c ++) {
                        $classe = $layer->getclass($c);
                        $nome = $linhas[$c]["nomeclasse"];
                        $nome = explode(" - n=", $nome);
                        $nome = $nome[0] . " - n=" . $nreg[$c] . "(" . (round(($nreg[$c] * 100 / $total))) . "%)";
                        $classe->set("name", $nome);
                        $linhas[$c]["nomeclasse"] = $nome;
                        $linhas[$c]["nreg"] = $nreg[$c];
                        $linhas[$c]["totalreg"] = $total;
                    }
                }
                if ($layer->type == MS_LAYER_RASTER && $nc == 1) {
                    $proc = "";
                    $linhas = array();
                    if ($layer->num_processing > 0) {
                        $proc = $layer->getProcessing();
                    }
                    if ($layer->type == MS_LAYER_RASTER && $proc == "") {
                        $proc = array(
                            "RESAMPLE=NEAREST"
                        );
                    }
                    $linhas[] = array(
                        "tema" => $l,
                        "idclasse" => "",
                        "nomeclasse" => "",
                        "expressao" => "",
                        "imagem" => "",
                        "proc" => $proc,
                        "minScale" => 0,
                        "maxScale" => 0
                    );
                }
            }
        }
        return $linhas;
    }

    /*
     * function: excluiEstilo
     *
     * Exclui um estilo de uma classe.
     */
    function excluiEstilo($classe, $estilo)
    {
        if (! $this->layer) {
            return "erro";
        }
        $classe = $this->layer->getclass($classe);
        $classe->deletestyle($estilo);
        $this->layer->removeMetaData("cache");
        return true;
    }

    /*
     * function: adicionaEstilo
     *
     * Adiciona um estilo em uma classe.
     *
     * return:
     * objeto estilo
     */
    function adicionaEstilo($classe, $estilo)
    {
        if (! $this->layer) {
            return "erro";
        }
        $classe = $this->layer->getclass($classe);
        $estilo = $classe->getstyle($estilo);
        $e = ms_newStyleObj($classe, $estilo);
        $this->layer->removeMetaData("cache");
        return ($e);
    }

    /*
     * function: sobeEstilo
     *
     *
     * Sobe um estilo na ordem de desenho de uma classe.
     *
     * parameters:
     * $classe - &Iacute;ndice da classe.
     * $estilo - &Iacute;ndice do estilo de uma classe que ser&aacute; clonado.
     */
    function sobeEstilo($classe, $estilo)
    {
        if (! $this->layer) {
            return "erro";
        }
        $classe = $this->layer->getclass($classe);
        $classe->movestyleup($estilo);
        $this->layer->removeMetaData("cache");
        return true;
    }

    /*
     * function: desceEstilo
     *
     * Desce um estilo na ordem de desenho de uma classe.
     *
     * parameters:
     * $classe - &Iacute;ndice da classe.
     *
     * $estilo - &Iacute;ndice do estilo de uma classe que ser&aacute; clonado.
     */
    function desceEstilo($classe, $estilo)
    {
        if (! $this->layer) {
            return "erro";
        }
        $classe = $this->layer->getclass($classe);
        $classe->movestyledown($estilo);
        $this->layer->removeMetaData("cache");
        return true;
    }

    /*
     * function: listaSimbolos
     *
     * Retorna uma lista de s&iacute;mbolos clic&aacute;veis no formato HTML.
     *
     * Para cada tipo de simbologia deve haver um arquivo .map com as defini&ccedil;&otilde;es b&aacute;sicas.
     *
     * Todos os s&iacute;mbolos do arquivo symbols/simbolos ser&atilde;o retornados como imagens.
     *
     * parameters:
     *
     * $tipo - Tipo de representa&ccedil;&atilde;o do s&iacute;mbolo, 0 pontos, 1 linhas e 2 pol&iacute;gonos.
     *
     * $dir_tmp - Diret&oacute;rio tempor&aacute;rio do mapserver.
     *
     * $imgdir - Diret&oacute;rio tempor&aacute;rio das imagens.
     *
     * $onclick - Fun&ccedil;&atilde;o que ser&aacute; inclu&iacute;da no HTML no evento onclick sobre o s&iacute;mbolo
     *
     * $tamanho - Tamanho (size) do s&iacute;mbolo
     *
     * $forca {boolean} - forca a exclusao dos simbolos atualmente em cache
     *
     * return:
     *
     * String no formato HTML com as imagens dos s&iacute;mbolos
     */
    function listaSimbolos($tipo, $dir_tmp, $imgdir, $onclick, $tamanho = 8, $width = 1, $forca = false)
    {
        $versao = versao();
        $versao = $versao["principal"];
        // error_reporting(0);
        if ($tipo == 3) {
            $tipo = 2;
        } // tipo raster
        if ($imgdir == "") {
            $dir = $dir_tmp;
        } else {
            $dir = $dir_tmp . "/" . $imgdir;
        }
        if ($forca == true) {
            unlink($dir . "/simbolos" . $tipo . ".inc");
        }
        $ins = "";
        // pega imagens que podem ser usadas como simbolos
        if ($tipo == 0) {
            if (! isset($locaplic)) {
                include (dirname(__FILE__) . "/../ms_configura.php");
            }
            // veja esse codigo tambem em ferramentas/uploadsimbolo/exec.php
            $pasta = $locaplic . "/temas";
            $url = "../temas";
            if ($customDir != "interface") {
                $teste = $locaplic . "/" . $customDir;
                if (file_exists($teste)) {
                    $pasta = $teste;
                    $url = "../" . $customDir;
                }
                $teste = $locaplic . "/" . $customDir . "/images";
                if (file_exists($teste)) {
                    $pasta = $teste;
                    $url = "../" . $customDir . "/images";
                }
                $teste = $locaplic . "/" . $customDir . "/imagens";
                if (file_exists($teste)) {
                    $pasta = $teste;
                    $url = "../" . $customDir . "/imagens";
                }
            }
            if (file_exists($pasta)) {
                $lista = listaArquivos($pasta, true, array(
                    "png",
                    "PNG"
                ));
                // var_dump($lista);exit;
                $n = count($lista["nomes"]);
                for ($i = 0; $i < $n; $i ++) {
                    $ins .= "<img src='" . $url . "/" . $lista["nomes"][$i] . "' style='max-width: 80px;cursor:pointer;border: 5px solid #FFFFFF' title=" . $pasta . "/" . $lista["nomes"][$i] . " onclick='" . $onclick . "'>";
                }
            }
        }
        if (! file_exists($dir . "/simbolos" . $tipo . ".inc")) {
            $f = fopen($dir . "/simbolos" . $tipo . ".inc", "w");
            if ($tipo == 2) {
                $t = "simpolv" . $versao . ".map";
            }
            if ($tipo == 0) {
                $t = "simptv" . $versao . ".map";
            }
            if ($tipo == 1) {
                $t = "simlinv" . $versao . ".map";
                $tamanho = $tamanho / 4;
            }
            if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')) {
                $mapatemp = ms_newMapObj($this->localaplicacao . "\\aplicmap\\" . $t);
            } else {
                $mapatemp = ms_newMapObj($this->localaplicacao . "/aplicmap/" . $t);
            }
            $l = $mapatemp->getlayer(0);

            if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')) {
                $novoss = dirname($this->mapa->symbolsetfilename) . "\\" . basename($mapatemp->symbolsetfilename);
            } else {
                $novoss = dirname($this->mapa->symbolsetfilename) . "/" . basename($mapatemp->symbolsetfilename);
            }

            $this->mapa->setsymbolset($novoss);

            $ns = $this->mapa->getnumsymbols();
            $inis = 0;

            // na versao 7 nao tem o simbolo 0
            if ($this->v >= 7) {
                $inis = 1;
                // se for versao 7 inclui um primeiro simbolo com valor 0 e imagem
                $oSymbol = $this->mapa->getSymbolObjectById(1);
                $adiciona = ms_newLayerObj($this->mapa, $l);
                $nomel = $l->name;
                $tematemp = $this->mapa->getlayerbyname($nomel);
                $c = $tematemp->getClass(0);
                $e = $c->getstyle(0);
                $e->set("size", 1);
                $e->set("width", 1);
                $ico = $c->createLegendIcon(40, 40);
                $nimg = $ico->saveWebImage();
                $pat = $this->mapa->web->imageurl;
                $ins .= "<img src='" . $nimg . "' style='cursor:pointer;border: 5px solid #FFFFFF' title='0' onclick='" . $onclick . "'>";
            }
            for ($i = $inis; $i < $ns; ++ $i) {
                $oSymbol = $this->mapa->getSymbolObjectById($i);
                $nomes = $oSymbol->name;
                if ($nomes == "") {
                    $nomes = $i;
                }
                $adiciona = ms_newLayerObj($this->mapa, $l);
                $nomel = $l->name;
                $tematemp = $this->mapa->getlayerbyname($nomel);
                $c = $tematemp->getClass(0);
                $e = $c->getstyle(0);
                $e->set("symbolname", $nomes);
                $e->set("size", $tamanho);
                $e->set("width", $width);
                $ico = $c->createLegendIcon(40, 40);
                $nimg = $ico->saveWebImage();
                $pat = $this->mapa->web->imageurl;
                $ins .= "<img src='" . $nimg . "' style='cursor:pointer;border: 5px solid #FFFFFF' title=" . $nomes . " onclick='" . $onclick . "'>";
            }
            fwrite($f, "<?php \$res = \"" . $ins . "\";?>");
            fclose($f);
            // copy ($dir."/simbolos".$tipo.".inc",$dir_tmp."/comum/simbolos".$tipo.".inc");
            return $ins;
        } else {
            $res = "";
            include_once $dir . "/simbolos" . $tipo . ".inc";
            return $res;
        }
    }

    /*
     * function: pegaParametros
     *
     * Retorna uma lista com par&acirc;metros sobre cada estilo de uma classe.
     *
     * parameters:
     * $classe - &Iacute;ndice da classe.
     *
     * return:
     * string com o
     * tipo do layer,id do estilo,outlinecolor,backgroundcolor,color,symbolname,size,symbolscaledenom,maxsize,minsize|
     */
    function pegaParametros($classe)
    {
        if (! $this->layer) {
            return "erro";
        }
        $tipoLayer = $this->layer->type;
        $classe = $this->layer->getclass($classe);
        $numestilos = $classe->numstyles;
        for ($i = 0; $i < $numestilos; ++ $i) {
            $linha = array();
            $estilo = $classe->getstyle($i);
            $linha[] = $i;
            $linha[] = corRGB($estilo->outlinecolor);
            $linha[] = corRGB($estilo->backgroundcolor);
            $linha[] = corRGB($estilo->color);
            $linha[] = $estilo->symbolname;
            if ($estilo->getbinding(MS_STYLE_BINDING_SIZE)) {
                $linha[] = $estilo->getbinding(MS_STYLE_BINDING_SIZE);
            } else {
                $linha[] = $estilo->size;
            }
            $linha[] = $estilo->opacity;
            if ($this->v >= 6) {
                $linha[] = $estilo->width;
                $s = $estilo->symbol;
                $linha[] = implode(" ", $s->getPatternArray);
                $linha[] = $estilo->angle;
            } else {
                $linha[] = "";
                $linha[] = "";
            }
            $linha[] = $this->layer->symbolscaledenom;
            $linha[] = $estilo->minsize;
            $linha[] = $estilo->maxsize;
            $linha[] = $estilo->offsetx;
            $linha[] = $estilo->offsety;
            $linhas[] = $tipoLayer . "#" . implode("#", $linha);
        }
        // retorna tipo do layer,id do estilo,outlinecolor,backgroundcolor,color,symbolname,size,symbolscaledenom
        return implode("|", $linhas);
    }

    /*
     * function: aplicaParametro
     *
     * Aplica um par&acirc;metro em um estilo de uma classe.
     *
     * parameters:
     *
     * $classe - &Iacute;ndice da classe.
     *
     * $estilo - &Iacute;ndice do estilo que ser&aacute; alterado.
     *
     * $outlinecolor - Cor do contorno.
     *
     * $backgroundcolor - Cor do fundo.
     *
     * $color - Cor da frente.
     *
     * $symbolname - Nome do s&iacute;mbolo.
     *
     * $size - Tamanho que ser&aacute; aplicado ao s&iacute;mbolo.
     *
     * $opacidade - Opacidade
     */
    function aplicaParametro($classe, $estilo, $outlinecolor, $backgroundcolor, $color, $symbolname, $size, $opacidade, $width, $pattern, $angle, $minsize = 0, $maxsize = 500, $offsetx = 0, $offsety = 0)
    {
        if (! $this->layer) {
            return "erro";
        }
        if (! empty($pattern)) {
            $pattern = str_replace(",", " ", $pattern);
        }
        $classe = $this->layer->getclass($classe);
        // isso &eacute; necess&aacute;rio pq o mapserver n&atilde;o consegue apagar o nome de um estilo
        if (isset($symbolname) && ($symbolname == "" || $symbolname == "0")) {
            $classe->deletestyle($estilo);
            $estilo = ms_newStyleObj($classe);
        } else {
            $estilo = $classe->getstyle($estilo);
        }
        if (isset($outlinecolor)) {
            $cor = $estilo->outlinecolor;
            $nc = explode(",", $outlinecolor);
            $cor->setRGB($nc[0], $nc[1], $nc[2]);
        }
        if (isset($backgroundcolor)) {
            $cor = $estilo->backgroundcolor;
            $nc = explode(",", $backgroundcolor);
            $cor->setRGB($nc[0], $nc[1], $nc[2]);
        }
        if (isset($color)) {
            $cor = $estilo->color;
            $nc = explode(",", $color);
            $cor->setRGB($nc[0], $nc[1], $nc[2]);
        }
        if ((isset($symbolname)) && ($symbolname != "")) {
            if (is_numeric($symbolname)) {
                $estilo->set("symbol", $symbolname);
            } else {
                $estilo->set("symbolname", $symbolname);
            }
        }
        if ((isset($size)) && ($size != "-1")) {
            if (is_numeric($size)) {
                $estilo->removebinding(MS_STYLE_BINDING_SIZE);
                $estilo->set("size", $size);
            } else {
                $estilo->setbinding(MS_STYLE_BINDING_SIZE, $size);
            }
        }
        if ((isset($width)) && ($width != "-1") && ($this->v >= 6)) {
            $estilo->set("width", $width);
        }
        if ((isset($pattern)) && ($pattern != "-1") && ($this->v >= 6) && ($pattern != "")) {
            $estilo->updatefromstring("STYLE PATTERN " . $pattern . " END");
        }
        if (isset($opacidade)) {
            $estilo->set("opacity", $opacidade);
        }
        if (isset($angle)) {
            $estilo->set("angle", $angle);
        }
        $estilo->set("minsize", $minsize);
        $estilo->set("maxsize", $maxsize);
        $estilo->set("offsetx", $offsetx);
        $estilo->set("offsety", $offsety);
        if ($this->layer->getmetadata("sld") != "") {
            $sld = $this->layer->getmetadata("sld");
            $this->reSLD($this->arquivo, $this->nome, $sld);
        }
        $this->layer->setMetaData("cache", "");
        return true;
    }

    /*
     * function: pegaParametrosLegImg
     *
     * Pega os par&acirc;metros da legenda embebida no mapa.
     *
     * return:
     *
     * array - "imagecolor"=>$imagecolor,"transparent"=>transparent,"position"=>$position,"status"=>$status,"outlinecolor"=>$outlinecolor,"keyspacingy"=>$keyspacingy,"keyspacingx"=>$keyspacingx,"keysizey"=>$keysizey,"keysizex"=>$keysizex,"heigt"=>$height,"width"=>$width
     *
     */
    function pegaParametrosLegImg()
    {
        // error_reporting(0);
        $legenda = $this->mapa->legend;
        $height = $legenda->height;
        $width = $legenda->width;
        $keysizex = $legenda->keysizex;
        $keysizey = $legenda->keysizey;
        $keyspacingx = $legenda->keyspacingx;
        $keyspacingy = $legenda->keyspacingy;
        $outlinecolor = corRGB($legenda->outlinecolor); // Color of outline of box, -1 for no outline
        $status = $legenda->status; // MS_ON, MS_OFF, MS_EMBED
        $position = $legenda->position;
        if ($position < 99) {
            $position = "10" . $position;
        }
        $transparent = 100;
        $imagecolor = corRGB($legenda->imagecolor);
        $label = $legenda->label;
        $font = $label->font;
        if ($font == MS_BITMAP) {
            $l = $label->size;
            if ($l == MS_TINY) {
                $t = 5;
            }
            if ($l == MS_SMALL) {
                $t = 7;
            }
            if ($l == MS_MEDIUM) {
                $t = 10;
            }
            if ($l == MS_LARGE) {
                $t = 12;
            }
            if ($l == MS_GIANT) {
                $t = 14;
            }
            $labelsize = $t;
        } else
            $labelsize = $label->size;

        $tipofonte = $label->type;
        return (array(
            "tipofonte" => $tipofonte,
            "font" => $font,
            "imagecolor" => $imagecolor,
            "transparent" => transparent,
            "position" => $position,
            "status" => $status,
            "outlinecolor" => $outlinecolor,
            "keyspacingy" => $keyspacingy,
            "keyspacingx" => $keyspacingx,
            "keysizey" => $keysizey,
            "keysizex" => $keysizex,
            "height" => $height,
            "width" => $width,
            "labelsize" => $labelsize
        ));
    }

    /**
     * $parameters = array("font"=>"", "imagecolor"=>"", "position"=>"", "status"=>"", "outlinecolor"=>"", "keyspacingy"=>"", "keyspacingx"=>"", "keysizey"=>"", "keysizex"=>"", "labelsize"=>""
     */
    function aplicaParametrosLegImg($parameters = array("font"=>"", "imagecolor"=>"", "position"=>"", "status"=>"", "outlinecolor"=>"", "keyspacingy"=>"", "keyspacingx"=>"", "keysizey"=>"", "keysizex"=>"", "height"=>"", "width"=>"", "labelsize"=>""))
    {
        $legenda = $this->mapa->legend;
        // $legenda->set("height", $parameters["height"]);
        // $legenda->set("width", $parameters["width"]);
        $legenda->set("keysizex", $parameters["keysizex"]);
        $legenda->set("keysizey", $parameters["keysizey"]);
        $legenda->set("keyspacingx", $parameters["keyspacingx"]);
        $legenda->set("keyspacingy", $parameters["keyspacingy"]);
        $corres = $legenda->outlinecolor;
        $cor = explode(",", $parameters["outlinecolor"]);
        $corres->setRGB($cor[0], $cor[1], $cor[2]);

        if ($parameters["status"] == 3) {
            $legenda->set("status", MS_EMBED);
        } else {
            $legenda->set("status", MS_OFF);
        }
        $verifica = $legenda->position;
        if ($verifica < 100) {
            if ($parameters["position"] > 99) {
                $parameters["position"] = 3;
            }
        }
        $legenda->set("position", $parameters["position"]);

        $corres = $legenda->imagecolor;
        $cor = explode(",", $parameters["imagecolor"]);
        $corres->setRGB($cor[0], $cor[1], $cor[2]);
        $label = $legenda->label;
        if ($parameters["font"] != "bitmap") {
            $label->updatefromstring("LABEL TYPE TRUETYPE END");
            $label->set("font", $parameters["font"]);
            $label->set("size", $parameters["labelsize"]);
        } else {
            $label->updatefromstring("LABEL TYPE BITMAP END");
            $t = MS_TINY;
            if ($parameters["labelsize"] > 5) {
                $t = MS_TINY;
            }
            if ($parameters["labelsize"] >= 7) {
                $t = MS_SMALL;
            }
            if ($parameters["labelsize"] >= 10) {
                $t = MS_MEDIUM;
            }
            if ($parameters["labelsize"] >= 12) {
                $t = MS_LARGE;
            }
            if ($parameters["labelsize"] >= 14) {
                $t = MS_GIANT;
            }
            $label->set("size", $t);
        }
        return true;
    }

    /*
     * Function: reSLD
     *
     * Gera o SLD de um tema WMS.
     *
     * Parametros:
     *
     * $map_file {string} - arquivo map_file
     *
     * $tema {string} - c�digo do tema
     *
     * $sld {string} - arquivo onde o sld ser&aacute; gravado
     */
    function reSLD($map_file, $tema, $sld)
    {
        $map = ms_newMapObj($map_file);
        $layer = $map->getlayerbyname($tema);
        $layer->set("name", $layer->getmetadata("nomeoriginal"));
        $tiporep = $layer->getmetadata("tipooriginal");
        $layer->set("type", MS_LAYER_POLYGON);
        if ($tiporep == "linear") {
            $layer->set("type", MS_LAYER_LINE);
        }
        if ($tiporep == "pontual") {
            $layer->set("type", MS_LAYER_POINT);
        }
        $sldf = $layer->generateSLD();
        if (file_exists($sld)) {
            unlink($sld);
        }
        $fp = fopen($sld, "a");
        fputs($fp, $sldf);
        fclose($fp);
    }

    function aplicaTodasClasses($parametro, $valor)
    {
        if (! $this->layer) {
            return "erro";
        }
        $numc = $this->layer->numclasses;
        for ($c = 0; $c < $numc; $c ++) {
            $classe = $this->layer->getclass($c);
            $estilo = $classe->getstyle(0);
            switch ($parametro) {
                case "pattern":
                    if (! empty($pattern)) {
                        $pattern = str_replace(",", " ", $valor);
                        if ($this->v >= 6) {
                            $estilo->updatefromstring("STYLE PATTERN " . $valor . " END");
                        }
                    }
                    continue;
                case "symbolname":
                    if ($parametro == "" || $parametro == "0") {
                        $classe->deletestyle($estilo);
                        $estilo = ms_newStyleObj($classe);
                    } else {
                        if (is_numeric($valor)) {
                            $estilo->set("symbol", $valor);
                        } else {
                            $estilo->set("symbolname", $valor);
                        }
                    }
                    continue;
                case "outlinecolor":
                    $cor = $estilo->outlinecolor;
                    $nc = explode(",", $valor);
                    $cor->setRGB($nc[0], $nc[1], $nc[2]);
                    continue;
                case "backgroundcolor":
                    $cor = $estilo->backgroundcolor;
                    $nc = explode(",", $valor);
                    $cor->setRGB($nc[0], $nc[1], $nc[2]);
                    continue;
                case "color":
                    $cor = $estilo->color;
                    $nc = explode(",", $valor);
                    $cor->setRGB($nc[0], $nc[1], $nc[2]);
                    continue;
                case "size":
                    if (is_numeric($valor)) {
                        $estilo->removebinding(MS_STYLE_BINDING_SIZE);
                        $estilo->set("size", $valor);
                    } else {
                        $estilo->setbinding(MS_STYLE_BINDING_SIZE, $valor);
                    }
                    continue;
                case "width":
                    $estilo->set("width", $valor);
                    continue;
                case "offsetx":
                    $estilo->set("offsetx", $valor);
                    continue;
                case "offsety":
                    $estilo->set("offsety", $valor);
                    continue;
                case "opacity":
                    $estilo->set("opacity", $valor);
                    continue;
                case "angle":
                    $estilo->set("angle", $valor);
                    continue;
            }
        }
        $this->layer->setMetaData("cache", "");
        return true;
    }

    function converte($texto)
    {
        if (function_exists("mb_convert_encoding")) {
            if (! mb_detect_encoding($texto, "UTF-8", true)) {
                $texto = mb_convert_encoding($texto, "UTF-8", "ISO-8859-1");
            }
        }
        return $texto;
    }
}
?>
