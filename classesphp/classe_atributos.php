<?php

/*
 * Title: classe_atributos
 *
 * Processa a tabela de atributos de um tema.
 *
 * Lista valores, consulta, etc.
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
 * Voc&ecirc; deve ter recebido uma copia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a
 * Free Software Foundation, Inc., no endere&ccedil;o
 * 59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 *
 * Arquivo:
 *
 * i3geo/classesphp/classe_atributos.php
 */
/*
 * Classe: Atributos
 *
 */
class Atributos
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
    protected $layer;

    /*
     * Variavel: $nome
     *
     * Nome do layer
     */
    protected $nome;

    /*
     * Variavel: $qyfile
     *
     * Nome do arquivo de sele&ccedil;&atilde;o (.qy)
     */
    public $qyfile;

    /*
     * Variavel: $projO
     *
     * Objeto projection original do mapa. Obtido apenas na interface Googlemaps
     */
    public $projO;

    /*
     * Variavel: $v
     *
     * Vers&atilde;o atual do Mapserver (primeiro d&iacute;gito)
     */
    public $v;

    /*
     * Function: __construct
     *
     * Cria um objeto Atributos.
     *
     * O tipo de interface usada pelo mapa &eacute; obtido do metadata "interface". Se for a interface Googlemaps, &eacute; feita a altera&ccedil;&atilde;o tempor&aacute;ria da proje&ccedil;&atilde;o do mapa.
     *
     * parameters:
     *
     * $map_file - Endere&ccedil;o do mapfile no servidor ou objeto mapObj.
     *
     * $tema - nome do tema
     *
     * $locaplic - (opcional) endere&ccedil;o do i3geo
     *
     * $ext - (opcional) extens&atilde;o geogr&aacute;fica que ser&aacute; aplicada ao mapa
     */
    function __construct($map_file = "", $tema = "", $locaplic = "", $ext = "")
    {
        include (dirname(__FILE__) . "/../ms_configura.php");
        $this->postgis_mapa = $postgis_mapa;

        if (! function_exists('ms_newMapObj')) {
            return false;
        }
        if (file_exists($locaplic . "/funcoes_gerais.php"))
            include_once ($locaplic . "/funcoes_gerais.php");
        else
            include_once ("funcoes_gerais.php");

        $this->v = versao();
        $this->v = $this->v["principal"];
        include_once($locaplic . "/classesphp/classe_vermultilayer.php");
        if ($map_file != "") {

            $this->locaplic = $locaplic;
            if (is_string($map_file)) {
                $this->mapa = ms_newMapObj($map_file);
                $this->arquivo = str_replace(".map", "", $map_file) . ".map";
                $this->qyfile = str_replace(".map", ".qy", $map_file);
            } else {
                $this->mapa = $map_file;
                $this->arquivo = "";
            }
            substituiConObj($this->mapa, $postgis_mapa);

            if ($tema != "" && @$this->mapa->getlayerbyname($tema)) {
                $this->layer = $this->mapa->getlayerbyname($tema);
                $this->nome = $tema;
            }
            if ($ext && $ext != "") {
                $e = explode(" ", $ext);
                $extatual = $this->mapa->extent;
                $extatual->setextent((min($e[0], $e[2])), (min($e[1], $e[3])), (max($e[0], $e[2])), (max($e[1], $e[3])));
            }
            if ($this->mapa->getmetadata("interface") == "googlemaps") {
                $this->projO = $this->mapa->getProjection();
                $this->mapa->setProjection(pegaProjecaoDefault("proj4"));
            }
        }
    }

    /*
     * function: salva
     *
     * Salva o mapfile atual
     *
     */
    function salva()
    {
        if ($this->mapa->getmetadata("interface") == "googlemaps") {
            $this->mapa->setProjection($this->projO);
        }
        restauraConObj($this->mapa, $this->postgis_mapa);
        if ($this->arquivo != "") {
            $this->mapa->save($this->arquivo);
        }
    }

    /*
     * function: extensaoShape
     *
     * Pega a extens&atilde;o geogr&aacute;fica de um objeto shape.
     *
     * parameters:
     * Objeto shape
     *
     * return:
     * xmin ymin xmax ymax separados por espa&ccedil;o.
     */
    function extensaoShape($shape)
    {
        if (! $this->layer) {
            return "erro";
        }
        $prjMapa = $this->mapa->getProjection();
        $prjTema = $this->layer->getProjection();
        $ret = $shape->bounds;
        //
        // verifica se o retangulo est&aacute; ou n&atilde;o em coordenadas geogr&aacute;ficas
        //
        if ($ret->minx > 180 || $ret->minx < - 180) {
            // reprojeta o retangulo
            if (($prjTema != "") && ($prjMapa != $prjTema)) {
                $projInObj = ms_newprojectionobj($prjTema);
                $projOutObj = ms_newprojectionobj($prjMapa);
                $ret->project($projInObj, $projOutObj);
            }
        }
        $ext = $ret->minx . " " . $ret->miny . " " . $ret->maxx . " " . $ret->maxy;
        if (($shape->type == MS_SHP_POINT) || ($shape->type == 0)) {
            $minx = $ret->minx;
            $minx = $minx - 0.03;
            $maxx = $ret->maxx;
            $maxx = $maxx + 0.03;
            $miny = $ret->miny;
            $miny = $miny - 0.03;
            $maxy = $ret->maxy;
            $maxy = $maxy + 0.03;
            $ext = $minx . " " . $miny . " " . $maxx . " " . $maxy;
        }
        return $ext;
    }

    /*
     * function - extensaoRegistro
     *
     * Pega a extens&atilde;o geogr&aacute;fica de um registro na tabela de atributos de um tema.
     *
     * parameters:
     * $registro - &Iacute;ndice do registro que ser&aacute; consultado.
     */
    function extensaoRegistro($registro)
    {
        if (! $this->layer) {
            return "erro";
        }
        // error_reporting(0);
        $this->layer->set("template", "none.htm");
        // $this->layer->setfilter("");
        $ext = "";
        // procura o registro e pega a extens&atilde;o geogr&aacute;fica
        if ($this->v >= 6) {
            $this->layer->open();
            $shape = $this->layer->getShape(new resultObj($registro));
            // $shape = $this->layer->getShape($this->layer->getResult($registro));
        } else {
            if (@$this->layer->open() == MS_SUCCESS) {

                if (@$this->layer->queryByrect($this->mapa->extent) == MS_SUCCESS) {
                    $this->layer->open();
                    $shape = $this->layer->getfeature($registro, - 1);
                    $fechou = $this->layer->close();
                }
            }
        }

        $ext = $this->extensaoShape($shape);
        return ($ext);
    }

    /*
     * function: listaItens
     *
     * Lista os itens de um tema.
     */
    function listaItens()
    {
        // verifica se o tema &eacute; um grupo e cria um array com a lista de temas
        $vermultilayer = new vermultilayer();
        $vermultilayer->verifica($this->arquivo, $this->nome);
        if ($vermultilayer->resultado == 1) { // o tema e multi layer
            $l = $vermultilayer->temasvisiveis;
        } else {
            $l[] = $this->nome;
        }
        // pega os itens de cada layer
        $lista = array();
        foreach ($l as $tema) {
            $layer = $this->mapa->getlayerbyname($tema);
            $layer->set("template", "none.htm");
            // pega o nome correto do tema
            $nometmp = pegaNome($layer, "UTF-8");
            $nomestemas[] = $nometmp;
            if ($layer->data != "" || $layer->connectiontype == 7) {
                $items = pegaItens($layer, $this->mapa);
                // pega os alias
                if ($this->layer->getmetadata("itensdesc") != "") {
                    $alias = array();
                    $aliasdesc = explode(",", $this->layer->getmetadata("itensdesc"));
                    $aliasitens = explode(",", $this->layer->getmetadata("itens"));
                    $aliasc = array_combine($aliasitens, $aliasdesc);
                    if (strtoupper($this->layer->getmetadata("convcaracter")) == "NAO") {
                        $convC = false;
                    } else {
                        $convC = true;
                    }
                    foreach ($items as $i) {
                        if (isset($aliasc[$i])) {
                            if ($convC) {
                                $alias[$i] = $this->converte($aliasc[$i]);
                            } else {
                                $alias[$i] = $aliasc[$i];
                            }
                        } else {
                            $alias[$i] = $i;
                        }
                    }
                }
                foreach ($items as $item) {
                    if ($alias[$item]) {
                        $a = $alias[$item];
                    } else {
                        $a = "";
                    }
                    $lista[] = array(
                        "item" => $item,
                        "nome" => $nometmp,
                        "tema" => $tema,
                        "alias" => $a
                    );
                }
            }
        }
        return (array(
            "valores" => $lista,
            "temas" => $l,
            "nomes" => $nomestemas
        ));
    }

    /*
     * function: itensTexto
     *
     * Pega todos os valores dos itens de uma tabela de um tema.
     *
     * parameters:
     * $tipo - Tipo de busca brasil|null
     */
    function itensTexto($tipo)
    {
        if (! $this->layer) {
            return "erro";
        }
        if ($tipo == "brasil") {
            $this->mapa = extPadrao($this->mapa);
        }
        $this->layer->set("template", "none.htm");
        // $this->layer->setfilter("");
        // le o arquivo de query se existir e checa se existe sele&ccedil;&atilde;o para o tema
        $items = pegaItens($this->layer, $this->mapa);

        $shapes = retornaShapesSelecionados($this->layer, $this->arquivo, $this->mapa);
        if (count($shapes) == 0) {
            $shapes = retornaShapesMapext($this->layer, $this->mapa);
        }
        $registros[] = array();
        if (strtoupper($this->layer->getmetadata("convcaracter")) == "NAO") {
            $convC = false;
        } else {
            $convC = true;
        }
        foreach ($shapes as $shape) {
            $valitem = array();
            foreach ($items as $item) {
                $v = trim($shape->values[$item]);
                if ($convC == true) {
                    $v = $this->converte($v);
                }
                $valitem[] = $v;
            }
            $registros[] = implode(";", $valitem);
        }
        $fechou = $this->layer->close();
        return (array(
            "itens" => implode(";", $items),
            "valores" => $registros
        ));
    }

    /*
     * function: listaRegistros
     *
     * Pega todos os valores dos itens de uma tabela de um tema.
     *
     * O range de busca pode ser limitado.
     *
     * parameters:
     *
     * $itemtema - (opcional) se for definido, apenas um item sera retornado
     *
     * $tipo - Tipo de abrang&ecirc;ncia espacial (brasil ou mapa).
     *
     * $unico - Lista valores &uacute;nicos (sim ou vazio).
     *
     * $inicio - Inicia do registro.
     *
     * $fim - Termina no registro.
     *
     * $tipolista - Indica se ser&atilde;o mostrados todos os registros ou apenas os selecionados (tudo|selecionados)
     *
     * $dadosDaClasse - sim|nao Indica se ser&atilde;o obtidos os dados que descrevem a classe do layer que cont&eacute;m o registro
     */
    function listaRegistros($itemtema, $tipo, $unico, $inicio, $fim, $tipolista, $dadosDaClasse = "nao")
    {
        // error_reporting(0);
        if (! $this->layer) {
            return "erro";
        }
        if ($this->v < 6) {
            $dadosDaClasse = "nao";
        }
        $resultadoFinal = array();
        if ((! isset($tipolista)) || ($tipolista == "")) {
            $tipolista = "tudo";
        }
        if (empty($inicio)) {
            $inicio = 0;
        }
        if (empty($fim)) {
            $fim = "";
        }
        // se tipo for igual a brasil, define a extens&atilde;o geogr&aacute;fica total
        if ($tipo == "brasil") {
            $this->mapa = extPadrao($this->mapa);
        }
        $this->layer->set("template", "none.htm");
        // $this->layer->setfilter("");
        if ($this->layer->data == "") {
            return "erro. O tema n&atilde;o tem tabela";
        }
        // pega os valores
        if ((! isset($itemtema)) || ($itemtema == "")) {
            $items = pegaItens($this->layer, $this->mapa);
        } else {
            $items[] = $itemtema;
        }
        // pega os alias definidos no metadata itensdesc
        if ($this->layer->getmetadata("itensdesc") != "") {
            $alias = array();
            $aliasdesc = explode(",", $this->layer->getmetadata("itensdesc"));
            $aliasitens = explode(",", $this->layer->getmetadata("itens"));
            $aliasc = array_combine($aliasitens, $aliasdesc);
            if (strtoupper($this->layer->getmetadata("convcaracter")) == "NAO") {
                $convC = false;
            } else {
                $convC = true;
            }
            foreach ($items as $i) {
                if (isset($aliasc[$i])) {
                    if ($convC) {
                        $alias[] = $this->converte($aliasc[$i]);
                    } else {
                        $alias[] = $aliasc[$i];
                    }
                } else {
                    $alias[] = $i;
                }
            }
        } else {
            $alias = $items;
        }
        $shapes = retornaShapesSelecionados($this->layer, $this->arquivo, $this->mapa, true);
        // error_reporting(E_ALL);
        $res_count = count($shapes);
        $resultadoFinal[] = array(
            "totalSelecionados" => $res_count,
            "itens" => $items,
            "alias" => $alias
        );
        $registros = array();
        // lista apenas os selecionados
        if (strtoupper($this->layer->getmetadata("convcaracter")) == "NAO") {
            $convC = false;
        } else {
            $convC = true;
        }
        if ($tipolista == "selecionados") {
            $chk = "CHECKED";
            // cria um novo array apenas para funcionar no contador
            $s = array();
            foreach ($shapes as $shape) {
                $s[] = $shape;
            }
            if ($fim != "") {
                if (($res_count >= $fim) && ($fim < $res_count)) {
                    $res_count = $fim;
                }
            }
            for ($i = $inicio; $i < $res_count; ++ $i) {
                $valitem = array();
                $shape = $s[$i];
                $indx = $shape->index;
                foreach ($items as $item) {
                    $valori = trim($shape->values[$item]);
                    if ($convC == true) {
                        $valori = $this->converte($valori);
                    }
                    $valitem[] = array(
                        "item" => $item,
                        "valor" => $valori
                    );
                }
                $classe = "";
                if ($dadosDaClasse == "sim") {
                    $indice = @$this->layer->getClassIndex($shape);
                    if ($indice >= 0) {
                        $classei = @$this->layer->getclass($indice);
                        $nome = $classei->name;
                        if ($convC == true && $nome != "") {
                            $nome = $this->converte($nome);
                        }
                        $classe = array(
                            "indice" => $indice,
                            "nome" => $nome
                        );
                    }
                }
                $ext = $this->extensaoShape($shape);
                $registros[] = array(
                    "indice" => $indx,
                    "valores" => $valitem,
                    "status" => $chk,
                    "classe" => $classe,
                    "ext" => $ext
                );
            }
            $resultadoFinal[] = array(
                "registros" => $registros
            );
        }
        if ($tipolista == "tudo") {
            $shp_atual = $shapes;
            $chk = "";
            if (@$this->layer->queryByrect($this->mapa->extent) == MS_SUCCESS) {
                $res_count = $this->layer->getNumresults();
                $totalGeral = $res_count;
                if ($fim != "") {
                    if (($res_count >= $fim) && ($fim < $res_count)) {
                        $res_count = $fim;
                    }
                }
                $sopen = $this->layer->open();
                if ($sopen == MS_FAILURE) {
                    return "erro";
                }
                $valoresunicos = array();
                for ($i = $inicio; $i < $res_count; ++ $i) {
                    $valitem = array();
                    if ($this->v >= 6) {
                        $shape = $this->layer->getShape($this->layer->getResult($i));
                        $indx = $shape->index;
                    } else {
                        $result = $this->layer->getResult($i);
                        $indx = $result->shapeindex;
                        $shape = $this->layer->getfeature($indx, - 1);
                    }
                    foreach ($items as $item) {
                        $valori = "";
                        if (@$shape->values[$item]) {
                            $valori = ($shape->values[$item]);
                        }
                        if ($convC == true) {
                            $valori = $this->converte($valori);
                        }
                        if ($unico == "sim") {
                            if (! in_array($valori, $valoresunicos)) {
                                $valitem[] = array(
                                    "item" => $item,
                                    "valor" => $valori
                                );
                            }
                            $valoresunicos[] = $valori;
                        } else {
                            $valitem[] = array(
                                "item" => $item,
                                "valor" => $valori
                            );
                        }
                    }
                    // if (in_array($shp_index,$shp_atual))
                    if (isset($shp_atual[$indx])) {
                        $chk = "CHECKED";
                    }
                    $classe = "";
                    if ($dadosDaClasse == "sim" && $unico != "sim") {
                        $indice = $this->layer->getClassIndex($shape);
                        if ($indice >= 0) {
                            $nome = $this->layer->getclass($indice)->name;
                        } else {
                            $nome = "";
                        }
                        if ($convC == true && $nome != "") {
                            $nome = $this->converte($nome);
                        }
                        $classe = array(
                            "indice" => $indice,
                            "nome" => $nome
                        );
                    }
                    if (count($valitem) > 0) {
                        $ext = $this->extensaoShape($shape);
                        // echo "<br>".$indx;
                        $registros[] = array(
                            "indice" => $indx,
                            "valores" => $valitem,
                            "status" => $chk,
                            "classe" => $classe,
                            "ext" => $ext
                        );
                    }
                    $chk = "";
                }
                $this->layer->close();
            }
            $resultadoFinal[] = array(
                "totalGeral" => $totalGeral,
                "registros" => $registros
            );
        }
        return ($resultadoFinal);
    }

    /*
     * function: listaUnicoRapida
     *
     * Obtem uma lista unica de registros de uma coluna
     *
     * parameters:
     *
     * $item
     *
     */
    function listaUnicoRapida($item)
    {
        // error_reporting(0);
        if (! $this->layer) {
            return "erro";
        }
        $this->layer->set("template", "none.htm");
        $filtro = $this->layer->getfilterstring();
        $this->layer->setfilter("");
        if (strtoupper($this->layer->getmetadata("convcaracter")) == "NAO") {
            $convC = false;
        } else {
            $convC = true;
        }
        if (@$this->layer->queryByrect($this->mapa->extent) == MS_SUCCESS) {
            $res_count = $this->layer->getNumresults();
            $sopen = $this->layer->open();
            if ($sopen == MS_FAILURE) {
                return "erro";
            }
            $valoresunicos = array();
            for ($i = 0; $i < $res_count; ++ $i) {
                if ($this->v >= 6) {
                    $shape = $this->layer->getShape($this->layer->getResult($i));
                    $indx = $shape->index;
                } else {
                    $result = $this->layer->getResult($i);
                    $indx = $result->shapeindex;
                    $shape = $this->layer->getfeature($indx, - 1);
                }
                $valori = "";
                if (@$shape->values[$item]) {
                    $valori = ($shape->values[$item]);
                }
                if ($convC == true) {
                    $valori = $this->converte($valori);
                }
                $valoresunicos[] = $valori;
            }
            $this->layer->close();
        }
        $valoresunicos = array_unique($valoresunicos);
        sort($valoresunicos);
        $this->layer->setfilter($filtro);
        return ($valoresunicos);
    }

    /*
     * function: listaRegistrosXY
     *
     * Pega o XY de cada registro e valores de itens especificos
     *
     * parameters:
     *
     * $items - lista de itens separado por ","
     *
     * $tipo - Tipo de abrang&ecirc;ncia espacial (brasil ou mapa).
     *
     * $tipolista - Indica se ser&atilde;o mostrados todos os registros ou apenas os selecionados (tudo|selecionados)
     *
     */
    function listaRegistrosXY($items, $tipo, $tipolista)
    {
        error_reporting(0);
        if (! $this->layer) {
            return "erro";
        }
        $resultadoFinal = array();
        if ((! isset($tipolista)) || ($tipolista == "")) {
            $tipolista = "tudo";
        }
        // se tipo for igual a brasil, define a extens&atilde;o geogr&aacute;fica total
        if ($tipo == "brasil") {
            $this->mapa = extPadrao($this->mapa);
        }
        $this->layer->set("template", "none.htm");
        // $this->layer->setfilter("");
        if ($this->layer->data == "") {
            return "erro. O tema n&atilde;o tem tabela";
        }
        $items = str_replace(" ", ",", $items);
        $items = explode(",", $items);
        $registros = array();
        if ($tipolista == "selecionados") {
            $shapes = retornaShapesSelecionados($this->layer, $this->arquivo, $this->mapa);
            $res_count = count($shapes);
            for ($i = 0; $i < $res_count; ++ $i) {
                $valitem = array();
                $shape = $shapes[$i];
                $indx = $shape->index;
                foreach ($items as $item) {
                    $valori = trim($shape->values[$item]);
                    $valitem[] = array(
                        "item" => $item,
                        "valor" => $valori
                    );
                }
                $c = $shape->getCentroid();
                $registros[] = array(
                    "indice" => $indx,
                    "valores" => $valitem,
                    "x" => $c->x,
                    "y" => $c->y
                );
            }
        }
        if ($tipolista == "tudo") {
            if (@$this->layer->queryByrect($this->mapa->extent) == MS_SUCCESS) {
                $res_count = $this->layer->getNumresults();
                $sopen = $this->layer->open();
                for ($i = 0; $i < $res_count; ++ $i) {
                    $valitem = array();
                    if ($this->v >= 6) {
                        $shape = $this->layer->getShape($this->layer->getResult($i));
                        $indx = $shape->index;
                    } else {
                        $result = $this->layer->getResult($i);
                        $indx = $result->shapeindex;
                        $shape = $this->layer->getfeature($indx, - 1);
                    }
                    foreach ($items as $item) {
                        $valori = trim($shape->values[$item]);
                        $valitem[] = array(
                            "item" => $item,
                            "valor" => $valori
                        );
                    }
                    $c = $shape->getCentroid();
                    $registros[] = array(
                        "indice" => $indx,
                        "valores" => $valitem,
                        "x" => $c->x,
                        "y" => $c->y
                    );
                }
                $this->layer->close();
            }
        }
        return ($registros);
    }

    /*
     * function: buscaRegistros
     *
     * Procura valores em uma tabela que aderem a uma palavra de busca.
     *
     * parameters:
     *
     * $palavra - Palavra que ser&aacute; procurada.
     *
     * $lista - Lista de busca no formato item;tema,item;tema.
     *
     * $tipo - Tipo de busca exata|qualquer.
     *
     * $onde - Tipo de abrang&ecirc;ncia espacial (brasil ou mapa)
     */
    function buscaRegistros($palavra, $lista, $tipo, $onde)
    {
        // error_reporting(0);
        $resultado = array();
        if ($onde == "mapa") {
            $this->mapa = extPadrao($this->mapa);
        }
        $ptvs = explode("|", $lista);
        // monta a lista de temas que serao utilizados
        foreach ($ptvs as $p) {
            $pp = explode(",", $p);
            $temas[] = $pp[1];
        }
        $temas = array_unique($temas);
        // monta a lista de itens por tema
        foreach ($temas as $tema) {
            $temp = array();
            foreach ($ptvs as $p) {
                $pp = explode(",", $p);
                if ($pp[1] == $tema) {
                    $temp[] = $pp[0];
                }
                $temasi[$tema] = $temp;
            }
        }
        $encontrado = "nao";
        $palavra = trim($palavra);
        foreach ($temas as $tema) {
            $registros = array();
            $items = $temasi[$tema];
            $l = $this->mapa->getlayerbyname($tema);
            $this->layer = $l;
            $l->set("template", "none.htm");
            if ($l->data == "") {
                return "Erro. O tema n&atilde;o tem tabela";
            }
            if (strtoupper($l->getmetadata("convcaracter")) == "NAO") {
                $convC = false;
            } else {
                $convC = true;
            }
            $filtro = $l->getfilterstring();
            if ($filtro != "") {
                // $l->setfilter("");
            }
            $sopen = $l->open();
            if ($sopen == MS_FAILURE) {
                return "erro";
            }
            $l->close();
            $ret = $this->mapa->extent;
            $fr = array();
            if (@$l->queryByrect($ret) == MS_SUCCESS) {
                $l->open();
                $res_count = $l->getNumresults();
                $palavra = $this->remove_accents(strtolower($palavra));
                for ($i = 0; $i < $res_count; ++ $i) {
                    $valitem = array();
                    if ($this->v >= 6) {
                        $shape = $l->getShape($l->getResult($i));
                        $indx = $shape->index;
                    } else {
                        $result = $l->getResult($i);
                        $indx = $result->shapeindex;
                        $shape = $l->getfeature($indx, - 1);
                    }
                    $novoreg = array();
                    $r = array();
                    foreach ($items as $item) {
                        $v = trim($shape->values[$item]);
                        $nv = $this->remove_accents(strtolower($v));
                        // echo $v." - ".$nv."<br>";
                        if ($tipo == "exata") {
                            if ($nv == $palavra) {
                                if ($convC == true) {
                                    $v = $this->converte($v);
                                }
                                $r[] = array(
                                    "item" => $item,
                                    "valor" => $v
                                );
                                $encontrado = "sim";
                            }
                        } else {
                            if (stristr($nv, $palavra)) {
                                if ($convC == true) {
                                    $v = $this->converte($v);
                                }
                                $r[] = array(
                                    "item" => $item,
                                    "valor" => $v
                                );
                                $encontrado = "sim";
                            }
                        }
                    }
                    if ($encontrado == "sim") {
                        $ret = $this->extensaoShape($shape, $l);
                        /*
                         * if (($prjTema != "") && ($prjMapa != $prjTema)){
                         * $ret->project($projInObj, $projOutObj);
                         * }
                         */
                        $novoreg["box"] = $ret;
                        $novoreg["valores"] = $r;
                        $encontrado = "nao";
                        $fr[] = $novoreg;
                    }
                }
                $resultado[] = array(
                    "tema" => $tema,
                    "resultado" => $fr
                );
            }
        }
        return ($resultado);
    }

    /*
     * function: estatDescritivas
     *
     * Calcula estat&iacute;sticas b&aacute;sicas de uma tabela de um tema.
     *
     * parameters:
     * $item - Item que ser&aacute; calculado.
     *
     * $exclui - Valor que n&atilde;o ser&aacute; cosiderado.
     *
     * Include:
     * <classe_estatistica.php>
     */
    function estatDescritivas($item, $exclui)
    {
        if (! $this->layer) {
            return "erro";
        }
        $this->layer->set("template", "none.htm");
        $items = pegaItens($this->layer, $this->mapa);
        $valores = array();
        $filtro = $this->layer->getfilterstring();
        if ($filtro != "") {
            // $this->layer->setfilter("");
        }
        // le o arquivo de query se existir e checa se existe sele&ccedil;&atilde;o para o tema
        $shapes = retornaShapesSelecionados($this->layer, $this->arquivo, $this->mapa);
        if (count($shapes) == 0) {
            $shapes = retornaShapesMapext($this->layer, $this->mapa);
        }
        // pega os valores
        foreach ($shapes as $shape) {
            $v = $shape->values[$item];
            $valores[] = $v;
        }
        // $fechou = $this->layer->close();
        $valoresn = array();
        // verifica se a lista de valores contem numeros e exclusao
        foreach ($valores as $valor) {
            if (is_numeric($valor)) {
                if ($exclui != "") {
                    if ($valor != $exclui) {
                        $valoresn[] = $valor;
                    }
                } else {
                    $valoresn[] = $valor;
                }
            }
        }
        if (count($valoresn) == 0) {
            return ("erro. Nenhum valor valido");
        }
        // faz os calculos
        if (file_exists($this->locaplic . "/classe_estatistica.php"))
            include_once ($this->locaplic . "/classe_estatistica.php");
        else
            include_once ("classe_estatistica.php");
        $estat = new estatistica();
        $resultado = $estat->calcula($valoresn);
        $resultado = $estat->resultado;
        $indice = $estat->indice;
        if ($resultado['min'] == "") {
            return ("erro. Nenhum valor valido");
        }
        $chaves = array_keys($indice);
        return (array(
            "indices" => $chaves,
            "variaveis" => $indice,
            "valores" => $resultado
        ));
    }

    /*
     * function: identifica
     *
     * Identifica elementos no mapa.
     *
     * parameters:
     *
     * $opcao - Opcao tip|tema|ligados|todos|lista.
     *
     * $xy - coordenada x e y separadas por virgulao.
     *
     * $resolucao - Resolucao de busca.
     *
     * $ext - (opcional) Extens&atilde;o geogr&aacute;fica que ser&aacute; aplicada ao mapa antes da opera&ccedil;&atilde;o de query (xmin ymin xmax ymax)
     *
     * $listaDeTemas - (opcional) Lista com os c�digos dos temas que ser&atilde;o identificados - vale apenas se $opcao = lista
     *
     * $wkt - (opcional) {boolean} inclui ou n&atilde;o o valor do wkt da geometria
     */
    function identifica($opcao, $xy, $resolucao, $ext = "", $listaDeTemas = "", $wkt = "nao")
    {
        if ($opcao != "tema" && $opcao != "tip") {
            if ($listaDeTemas != "") {
                $listaDeTemas = str_replace(" ", ",", $listaDeTemas);
                $temas = explode(",", $listaDeTemas);
            } else {
                $temas = $this->mapa->getalllayernames();
            }
            foreach ($temas as $tem) {
                $vermultilayer = new vermultilayer();
                $vermultilayer->verifica($this->arquivo, $tem);
                if ($vermultilayer->resultado == 1) {
                    foreach (($vermultilayer->temasvisiveis) as $tv) {
                        $l = $this->mapa->getlayerbyname($tv);
                        if ($l->getmetadata("identifica") != "nao") {
                            $listatemas[] = $tv;
                        }
                    }
                } else {
                    $l = $this->mapa->getlayerbyname($tem);
                    if ((strtolower($l->getmetadata("escondido")) != "sim") && ($l->getmetadata("identifica") != "nao")) {
                        $listatemas[] = $tem;
                    }
                }
            }
            $listatemas = array_unique($listatemas);
        }
        $xyarray = explode(",", $xy);
        $resultados = array();
        // pesquisa um tema
        if ($opcao == "tema") {
            $listatemas = array();
            $vermultilayer = new vermultilayer();
            $vermultilayer->verifica($this->arquivo, $this->nome);
            // o tema e multi layer
            if ($vermultilayer->resultado == 1) {
                $listatemp = $vermultilayer->temasvisiveis;
            } else {
                $listatemp[] = $this->nome;
            }
            foreach ($listatemp as $t) {
                $layerteste = $this->mapa->getlayerbyname($t);
                $mclasse = strtoupper($layerteste->getmetadata("CLASSE"));
                $mtema = strtoupper($layerteste->getmetadata("TEMA"));
                $gr = $layerteste->group;
                if ((! (($mclasse == "NAO") && ($mtema == "NAO"))) || ($gr != "")) {
                    if (($layerteste->data != "") && ($layerteste->connectiontype != MS_WMS) || ($layerteste->tileindex != "")) {
                        $listatemas[] = $t;
                    }
                    if ($layerteste->connectiontype == MS_OGR) {
                        $listatemas[] = $t;
                    }
                }
            }
            $layerteste = $this->layer;
            if ($layerteste->connectiontype == MS_WMS) {
                $listatemas = array();
                $listatemas[] = $this->nome;
            }
            foreach ($listatemas as $tema) {
                $resultados[$tema] = $this->identificaQBP($tema, $xyarray[0], $xyarray[1], "", $resolucao, "", "", false, $ext, $wkt, true);
            }
        }
        // pesquisa todos os temas acrescentados no mapa
        if ($opcao == "todos") {
            foreach ($listatemas as $tema) {
                $resultados[$tema] = $this->identificaQBP($tema, $xyarray[0], $xyarray[1], "", $resolucao, "", "", false, $ext, $wkt);
            }
        }
        // pesquisa apenas os temas visiveis
        if ($opcao == "ligados" || $opcao == "lista") {
            if ($opcao == "ligados") {
                $novalista = array();
                foreach ($listatemas as $tema) {
                    $l = $this->mapa->getlayerbyname($tema);
                    if ($l->status == MS_DEFAULT) {
                        $novalista[] = $tema;
                    }
                    $listatemas = $novalista;
                }
            }
            foreach ($listatemas as $tema) {
                $l = $this->mapa->getlayerbyname($tema);
                $resultados[$tema] = $this->identificaQBP($tema, $xyarray[0], $xyarray[1], "", $resolucao, "", "", false, $ext, $wkt);
            }
        }
        // pesquisa apenas os temas com tip
        if ($opcao == "tip") {
            $ltemp = array();
            $numlayers = $this->mapa->numlayers;
            for ($i = 0; $i < $numlayers; ++ $i) {
                $tl = $this->mapa->getlayer($i);
                $tema = $tl->name;
                $itemtip = $tl->getmetadata("TIP");
                if ($itemtip != "") {
                    if ($tl->status == MS_DEFAULT || $listaDeTemas != "") {
                        $r = $this->identificaQBP($tema, $xyarray[0], $xyarray[1], "", $resolucao, $itemtip, "", true, $ext, $wkt);
                        $resultados[$tema] = array(
                            "todosItens" => $r["itensLayer"],
                            "tips" => $itemtip,
                            "dados" => $r["resultado"]
                        );
                        $ltemp[] = $tema;
                    }
                }
            }
            $listatemas = $ltemp;
        }
        if (count($resultados) > 0) {
            $res = $this->retornaI2($listatemas, $resultados, $this->mapa, $xy);
            return ($res);
        } else {
            return ("");
        }
    }

    /*
     * function: retornaI2
     *
     * Processa o resultado da identifica&ccedil;&atilde;o de um elemento compondo um array de strings formatadas.
     *
     * parameters:
     *
     * $listatemas - Lista de temas
     *
     * $resultados - Resultados de cada tema.
     *
     * $map - Objeto Map.
     */
    function retornaI2($listatemas, $resultados, $map, $xy)
    {
        $final = array();
        foreach ($listatemas as $tema) {
            // para dados que sao oriundos do METAESTAT
            $editavel = "";
            $colunaidunico = "";
            $id_medida_variavel = "";
            //
            $layer = $map->getlayerbyname($tema);
            $nometmp = $tema;
            if (strtoupper($layer->getMetaData("TEMA")) != "NAO") {
                $nometmp = $layer->getMetaData("TEMA");
            } else if ($layer->getMetaData("ALTTEMA") != "") {
                $nometmp = $layer->getMetaData("ALTTEMA");
            }
            $nometmp = $this->converte($nometmp);
            // identificador que marca o tipo de dados que podem ser salvos
            $tiposalva = "";
            // verifica se e editavel
            if ($layer->getmetadata("EDITAVEL") == "SIM") {
                // verifica login
                session_write_close();
                session_name("i3GeoLogin");
                if (! empty($_COOKIE["i3geocodigologin"])) {
                    session_id($_COOKIE["i3geocodigologin"]);
                    session_start();
                    // verifica usuario
                    if ($_SESSION["usuario"] == $_COOKIE["i3geousuariologin"]) {
                        // verifica se e administrador
                        foreach ($_SESSION["papeis"] as $p) {
                            if ($p == 1) {
                                $editavel = "sim";
                            }
                        }
                        // verifica operacao
                        if (! empty($_SESSION["operacoes"]["admin/metaestat/geral"])) {
                            $editavel = "sim";
                        }
                        if ($editavel == "sim") {

                            $editavel = "nao";
                            $id_medida_variavel = $layer->getMetaData("METAESTAT_ID_MEDIDA_VARIAVEL");
                            $colunaidunico = $layer->getMetaData("COLUNAIDUNICO");

                            if ($id_medida_variavel != "" || $codigo_tipo_regiao != "") {
                                include_once (dirname(__FILE__) . "/classe_metaestatinfo.php");
                                $m = new MetaestatInfo();
                                if ($id_medida_variavel != "") {
                                    $medidaVariavel = $m->listaMedidaVariavel("", $id_medida_variavel);
                                    $editavel = $medidaVariavel["colunavalor"];
                                    $tiposalva = "medida_variavel";
                                }
                                if ($codigo_tipo_regiao != "") {
                                    $regiao = $m->listaTipoRegiao($codigo_tipo_regiao);
                                    // todas as colunas podem ser alteradas
                                    $editavel = "todos";
                                    $tiposalva = "regiao";
                                }
                            }
                            // verifica se os parametros de edicao estao disponiveis, pois podem ter sido definidos pelo sistema de administracao
                            if ($layer->getMetaData("ESQUEMATABELAEDITAVEL") != "" && $layer->getMetaData("TABELAEDITAVEL") != "" && $layer->getMetaData("COLUNAIDUNICO") != "") {
                                $editavel = "todos";
                                $tiposalva = "regiao";
                            }
                        }
                    }
                }
            }
            $codigo_tipo_regiao = $layer->getMetaData("METAESTAT_CODIGO_TIPO_REGIAO");
            $funcoesjs = json_decode($this->converte($layer->getMetaData("FUNCOESJS")));
            $final[] = array(
                "funcoesjs" => $funcoesjs,
                "xy" => $xy,
                "tema" => $tema,
                "tiposalva" => $tiposalva,
                "nome" => $nometmp,
                "resultado" => $resultados[$tema],
                "editavel" => $editavel,
                "colunaidunico" => $colunaidunico,
                "id_medida_variavel" => $id_medida_variavel,
                "codigo_tipo_regiao" => $codigo_tipo_regiao
            );
        }
        return $final;
    }

    /*
     * function: retornaI
     *
     * Depreciado na vers&atilde;o 4.2
     *
     * Processa o resultado da identifica&ccedil;&atilde;o de um elemento compondo um array de strings formatadas.
     *
     * parameters:
     * $listatemas - Lista de temas
     *
     * $resultados - Resultados de cada tema.
     *
     * $map - Objeto Map.
     */
    function retornaI($listatemas, $resultados, $map)
    {
        $final = "";
        foreach ($listatemas as $tema) {
            $layer = $map->getlayerbyname($tema);
            // pega o nome correto do tema
            $nometmp = $tema;
            if (strtoupper($layer->getMetaData("TEMA")) != "NAO") {
                $nometmp = $layer->getMetaData("TEMA");
            } else if ($layer->getMetaData("ALTTEMA") != "") {
                $nometmp = $layer->getMetaData("ALTTEMA");
            }
            $final = $final . "!" . $nometmp;
            $final = trim($final, "!");
            $rs = $resultados[$tema];
            $final = $final . "@";
            foreach ($rs as $r) {
                $final = $final . "*";
                if ($r != " ") {
                    foreach ($r as $f) {
                        $final = $final . $f;
                    }
                }
            }
        }
        return $final;
    }
    /*
     * function: identificaQBP
     *
     *
     * Identifica um elemento utilizando querybypoint.
     *
     * parameters:
     *
     * $tema - Tema que ser&aacute; identificado (se for vazio, ser&aacute; utilizado o objeto mapa definido no construtor da classe)
     *
     * $x - Coordenada X.
     *
     * $y - Coordenada Y.
     *
     * $map_file - Arquivo map file (se for vazio, ser&aacute; utilizado o objeto mapa definido no construtor da classe).
     *
     * $resolucao - Resolu&ccedil;&atilde;o de busca.
     *
     * $item - Item &uacute;nico que ser&aacute; identificado.
     *
     * $tiporetorno - Tipo de retorno dos dados. Se for vazio, o retorno &eacute; formatado como string, se for shape, retorna o objeto shape, googlerelevo retorna no padr&atilde;o da API do google para relevo
     *
     * $etip {booblean} - indica se a solicita&ccedil;&atilde;o &eacute; para obten&ccedil;&atilde;o dos dados do tipo etiqueta
     */
    function identificaQBP($tema = "", $x = 0, $y = 0, $map_file = "", $resolucao = 0, $item = "", $tiporetorno = "", $etip = false, $ext = "", $wkt = "nao", $todosItens = false)
    {
        if ($map_file == "") {
            $mapa = $this->mapa;
            $map_file = $this->arquivo;
        } else {
            $mapa = ms_newMapObj($map_file);
        }
        if ($ext != "") {
            $extmapa = $mapa->extent;
            $e = explode(" ", $ext);
            $extmapa->setextent((min($e[0], $e[2])), (min($e[1], $e[3])), (max($e[0], $e[2])), (max($e[1], $e[3])));
        }
        if ($tema == "") {
            $layer = $this->layer;
        } else {
            $layer = $mapa->getLayerByName($tema);
        }
        $layer->set("status", MS_DEFAULT);
        $layer->set("template", "none.htm");
        $pt = ms_newPointObj();
        $pt->setXY($x, $y);
        if (strtoupper($layer->getmetadata("convcaracter")) == "NAO") {
            $convC = false;
        } else {
            $convC = true;
        }
        // se o usuario estiver logado e o tema for editavel, a lista de itens
        // nao usa os alias para permitir a edicao dos dados
        if (! empty($_COOKIE["i3geocodigologin"]) && $layer->getmetadata("EDITAVEL") == "SIM") {
            $itens = "";
            $itensdesc = "";
            $lks = "";
            $itemimg = "";
            $locimg = "";
        } else {
            $itens = $layer->getmetadata("ITENS"); // itens
            $itensdesc = $layer->getmetadata("ITENSDESC"); // descri&ccedil;&atilde;o dos itens
            $lks = $layer->getmetadata("ITENSLINK"); // link dos itens
            $itemimg = $layer->getmetadata("ITEMIMG"); // indica um item que ser&aacute; utilizado para colocar um &iacute;cone
            $locimg = $layer->getmetadata("IMGLOC"); // indica o local onde est&atilde;o os &iacute;cones
        }
        $tips = $layer->getmetadata("TIP");
        $itensLayer = pegaItens($layer, $mapa);
        $nitens = count($itensLayer);
        if ($itens == "") {
            $itens = $itensLayer;
        } else {
            $itens = explode(",", $itens);
        }
        if ($itensdesc == "") {
            $itensdesc = $itens;
        } else {
            $itensdesc = explode(",", $itensdesc);
        }
        if ($lks == "") {
            $lks = array_fill(0, count($itens), '');
        } else {
            $lks = explode(",", $lks);
        }
        if ($itemimg == "") {
            $itemimg = array_fill(0, count($itens), '');
        } else {
            $itemimg = explode(",", $itemimg);
        }
        if ($locimg == "") {
            $locimg = array_fill(0, count($itens), '');
        } else {
            $locimg = explode(",", $locimg);
        }
        if($tips == "allitens"){
            $tips = implode(",",$itens);
        }
        $tips = str_replace(" ", ",", $tips);
        $tips = explode(",", $tips);

        // o retorno deve ser do tipo TIP
        if ($etip == true || $todosItens = true) {
            $itensMetadata = $itens;
            $temp = array_combine($itens, $itensdesc);
            $templ = array_combine($itens, $lks);
            $tempimg = array_combine($itens, $itemimg);
            $temploc = array_combine($itens, $locimg);
            $itensdesc = array();
            $itens = array();
            $lks = array();
            $itemimg = array();
            $locimg = array();
            foreach ($itensLayer as $t) {
                if (in_array($t, $itensMetadata)) {
                    $itens[] = $t;
                    if ($temp[$t] != "") {
                        $itensdesc[] = $temp[$t];
                    } else {
                        $itensdesc[] = $t;
                    }
                    if ($templ[$t] != "") {
                        $lks[] = $templ[$t];
                    } else {
                        $lks[] = "";
                    }
                    if ($tempimg[$t] != "") {
                        $itemimg[] = $tempimg[$t];
                    } else {
                        $itemimg[] = "";
                    }
                    if ($temploc[$t] != "") {
                        $locimg[] = $temploc[$t];
                    } else {
                        $locimg[] = "";
                    }
                }
            }
        }

        //
        // opera&ccedil;&atilde;o especial para o caso de wms
        //
        $resultado = array();
        if ($layer->connectiontype == MS_WMS) {
            $wkt = "nao";
            $layer->set("toleranceunits", MS_PIXELS);
            $layer->set("tolerance", $resolucao);
            $mapa = desligatemas($mapa);
            $mapa = desligamargem($mapa);
            $imgo = $mapa->draw();
            $ptimg = xy2imagem($map_file, array(
                $x,
                $y
            ), $mapa);
            // $formatoinfo = "MIME";
            $formatosinfo = $layer->getmetadata("formatosinfo");
            $formatosinfohtml = false;
            if ($formatosinfo != "") {
                $formatosinfo = explode(",", $formatosinfo);
                if ($formatosinfo[0] != "") {
                    $formatoinfo = $formatosinfo[0];
                }
                foreach ($formatosinfo as $f) {
                    if (strtoupper($f) == "TEXT/PLAIN") {
                        $formatoinfo = "text/plain";
                    }
                    if (strtoupper($f) == "TEXT/HTML") {
                        $formatosinfohtml = true;
                    }
                }
            } else {
                $formatoinfo = $layer->getmetadata("wms_feature_info_type");
                if ($formatoinfo == "") {
                    $formatoinfo = $layer->getmetadata("wms_feature_info_mime_type");
                }
                if ($formatoinfo == "") {
                    $formatoinfo = "text/plain";
                }
            }
            $res = $layer->getWMSFeatureInfoURL($ptimg->x, $ptimg->y, 50, $formatoinfo);
            $res = str_replace("INFOFORMAT", "INFO_FORMAT", $res);
            $res2 = $layer->getWMSFeatureInfoURL($ptimg->x, $ptimg->y, 50, "text/html");
            $res2 = str_replace("INFOFORMAT", "INFO_FORMAT", $res2);
            $registros = array();
            if (strtoupper($formatoinfo) != "TEXT/HTML" && strtoupper($formatoinfo) != "MIME") {
                $resposta = file($res);//retorna cada linha da chamada wms
                $firstitem = "";
                foreach ($resposta as $r) {
                    //verifica se a linha contem dados
                    $t = explode("=", $r);
                    if (count($t) > 1) {
                        $v = str_replace("\\n", "", $t[1]);
                        $v = str_replace("\\r", "", $v);
                        if (trim($v) != "") {
                            $va = trim($v);
                            if ($convC == true) {
                                $va = $this->converte($va);
                            }
                            if ($firstitem == trim($t[0])) {
                                $firstitem = "";
                                $resultado[] = $registros;
                                $registros = array();
                            }
                            if($firstitem == ""){
                                $firstitem = trim($t[0]);
                            }

                            $etiqueta = "nao";
                            if (in_array(trim($t[0]), $tips)) {
                                $etiqueta = "sim";
                            }
                            $d = array(
                                "alias" => trim($t[0]),
                                "item" => trim($t[0]),
                                "valor" => trim($va,"'"),
                                "link" => "",
                                "img" => "",
                                "tip" => $etiqueta
                            );
                            if ($etip == false){
                                $registros[] = $d;
                            } else {
                                $registros[trim($t[0])] = $d;
                            }
                        }
                    }
                }
                $resultado[] = $registros;
                // caso esri
                if (count($resultado) > 0 && $resultado[0] == "") {
                    $resposta = file($res);
                    $cabecalho = str_replace('"   "', '"|"', $resposta[0]);
                    $cabecalho = explode("|", $cabecalho);

                    $linha = str_replace('"  "', '"|"', $resposta[1]);
                    $linha = explode("|", $linha);
                    for ($i = 0; $i < count($cabecalho); ++ $i) {
                        if ($convC == true) {
                            $va = $this->converte($linha[$i]);
                        } else {
                            $va = $linha[$i];
                        }
                        $etiqueta = "nao";
                        if (in_array(trim($t[0]), $tips)) {
                            $etiqueta = "sim";
                        }
                        $d = array(
                            "alias" => $cabecalho[$i],
                            "item" => $cabecalho[$i],
                            "valor" => $va,
                            "link" => "",
                            "img" => "",
                            "tip" => $etiqueta
                        );
                        if ($etip == false){
                            $registros[] = $d;
                        } else {
                            $registros[$cabecalho[$i]] = $d;
                        }
                    }
                    $resultado[] = $registros;
                }
            }
            /*
            $id = nomeRandomico();
            if ($formatosinfohtml == true) {
                $d = array(
                    "alias" => "",
                    "valor" => "<iframe width=250px id='" . $id . "' name='" . $id . "' src='" . $res2 . "'></iframe>",
                    "link" => "",
                    "img" => "",
                    "tip" => "nao",
                    "item" => "iframe"
                );
                if ($etip == false){
                    $resultados[] = $d;
                } else {
                    $resultados["iframe"] = $d;
                }
            }
            if ($res != "") {
                $d = array(
                    "alias" => "Link WMS",
                    "valor" => "getfeatureinfo " . $formatoinfo,
                    "link" => $res,
                    "img" => "",
                    "idIframe" => $id,
                    "tip" => "nao",
                    "item" => "LinkWms1"
                );
                if ($etip == false){
                    $resultados[] = $d;
                } else {
                    $resultados["LinkWms1"] = $d;
                }
            }
            if ($res2 != "") {
                $d = array(
                    "alias" => "Link WMS",
                    "valor" => "getfeatureinfo padr&atilde;o do servi&ccedil;o",
                    "link" => $res2,
                    "img" => "",
                    "idIframe" => $id,
                    "tip" => "nao",
                    "item" => "LinkWms2"
                );
                if ($etip == false){
                    $resultados[] = $d;
                } else {
                    $resultados["LinkWms2"] = $d;
                }
            }
            if ($res == "" && $res2 == "") {
                $d = array(
                    "alias" => "Ocorreu um erro",
                    "valor" => "",
                    "link" => "",
                    "img" => "",
                    "tip" => "nao",
                    "item" => "erro"
                );
                if ($etip == false){
                    $resultados[] = $d;
                } else {
                    $resultados["erro"] = $d;
                }
            }

            $resultado[] = $registros;
            */
        }
        else {
            if ($layer->type == MS_LAYER_RASTER) {
                $wkt = "nao";
                $layer->set("toleranceunits", MS_PIXELS);
                $layer->set("tolerance", $resolucao);
                $ident = @$layer->queryByPoint($pt, 0, 0); // 0.01);
            }
            if (($layer->type == MS_LAYER_POINT) || ($layer->type == MS_LAYER_LINE) || ($layer->type == MS_LAYER_CHART)) {
                $layer->set("toleranceunits", MS_PIXELS);
                $layer->set("tolerance", $resolucao);
                $ident = @$layer->queryByPoint($pt, 1, - 1); // 0.01);
            }
            if ($layer->type == MS_LAYER_POLYGON) {
                $layer->set("toleranceunits", MS_PIXELS);
                $layer->set("tolerance", $resolucao);
                $ident = @$layer->queryByPoint($pt, 1, - 1);
            }
            if ($ident == MS_SUCCESS) {
                // $ident = @$layer->queryByPoint($pt, 1, -1);
                // verifica se o layer e editavel no sistema METAESTAT
                $editavel = "nao";
                //
                $sopen = $layer->open();
                $res_count = $layer->getNumresults();
                if (strtoupper($layer->getmetadata("convcaracter")) == "NAO") {
                    $convC = false;
                } else {
                    $convC = true;
                }
                if ($sopen == MS_FAILURE) {
                    return "erro";
                }
                for ($i = 0; $i < $res_count; ++ $i) {
                    $valori = array();
                    if ($this->v >= 6) {
                        $shape = $layer->getShape($layer->getResult($i));
                    } else {
                        $result = $layer->getResult($i);
                        $shp_index = $result->shapeindex;
                        $shape = $layer->getfeature($shp_index, - 1);
                    }
                    $conta = 0;
                    // var_dump($itens);exit;
                    if ($tiporetorno == "shape" || $tiporetorno == "googlerelevo") {
                        if ($tiporetorno == "shape") {
                            $resultado[] = $shape;
                        }
                        if ($tiporetorno == "googlerelevo") {
                            $lin = $shape->line(0);
                            $p = $lin->point(0);
                            $resultado = array(
                                "elevation" => $shape->values[$item],
                                "location" => array(
                                    "lat" => $p->x,
                                    "lng" => $p->y
                                )
                            );
                        }
                    } else {
                        if ($etip == false && $item != "") {
                            $resultado[] = $shape->values[$item];
                        } else {
                            // var_dump($itens);exit;
                            foreach ($itens as $it) {
                                $val = $shape->values[$it];
                                if ($convC == true) {
                                    $val = $this->converte($val);
                                }
                                $link = $lks[$conta];
                                foreach ($itens as $t) {
                                    $valtemp = $shape->values[$t];
                                    $busca = '[' . $t . ']';
                                    $link = str_replace($busca, $valtemp, $link);
                                }
                                $img = "";
                                if ($locimg[$conta] != "" && $itemimg[$conta] != "") {
                                    $img = "<img src='" . $locimg[$conta] . "//" . $shape->values[$itemimg[$conta]] . "' //>";
                                } else {
                                    if ($itemimg[$conta] != "") {
                                        $img = "<img src='" . $shape->values[$itemimg[$conta]] . "' //>";
                                    }
                                }
                                // indica se o item &eacute; tbm uma etiqueta
                                $etiqueta = "nao";
                                if (in_array($it, $tips)) {
                                    $etiqueta = "sim";
                                }
                                $arraytemp = array(
                                    "item" => $it,
                                    "alias" => $this->converte($itensdesc[$conta]),
                                    "valor" => $val,
                                    "link" => $link,
                                    "img" => $img,
                                    "tip" => $etiqueta
                                    // "wkt"=>$wkt
                                );
                                if ($etip == false) {
                                    $valori[] = $arraytemp;
                                } else {
                                    $valori[$it] = $arraytemp;
                                }
                                $conta = $conta + 1;
                            }

                            if ($wkt == "sim" && strtolower($layer->getmetadata("wkttip")) == "sim") {
                                $arraytemp = array(
                                    "alias" => "wkt",
                                    "valor" => $shape->towkt(),
                                    "link" => "",
                                    "img" => "",
                                    "tip" => ""
                                );
                                $valori["wkt"] = $arraytemp;
                            }
                            $resultado[] = $valori;
                        }
                    }
                }
                $layer->close();
            } else {
                $resultado[] = " ";
            }
        }
        if ($etip == true) {
            return array(
                "resultado" => $resultado,
                "itensLayer" => $itensLayer
            );
        } else {
            return $resultado;
        }
    }
    /*
     * Function: converte
     *
     * Converte uma string de ISO-8859-1 para UTF-8
     *
     * Parametro:
     *
     * $texto - string que ser&aacute; convertida
     *
     * Return:
     *
     * {string}
     */
    function converte($texto)
    {
        if (function_exists("mb_convert_encoding")) {
            if (! mb_detect_encoding($texto, "UTF-8", true)) {
                $texto = mb_convert_encoding($texto, "UTF-8", "ISO-8859-1");
            }
        }
        return $texto;
    }

    function remove_accents($string)
    {
        if (! preg_match('/[\x80-\xff]/', $string))
            return $string;
        if ($this->seems_utf8($string)) {
            $chars = array(
                // Decompositions for Latin-1 Supplement
                chr(195) . chr(128) => 'A',
                chr(195) . chr(129) => 'A',
                chr(195) . chr(130) => 'A',
                chr(195) . chr(131) => 'A',
                chr(195) . chr(132) => 'A',
                chr(195) . chr(133) => 'A',
                chr(195) . chr(135) => 'C',
                chr(195) . chr(136) => 'E',
                chr(195) . chr(137) => 'E',
                chr(195) . chr(138) => 'E',
                chr(195) . chr(139) => 'E',
                chr(195) . chr(140) => 'I',
                chr(195) . chr(141) => 'I',
                chr(195) . chr(142) => 'I',
                chr(195) . chr(143) => 'I',
                chr(195) . chr(145) => 'N',
                chr(195) . chr(146) => 'O',
                chr(195) . chr(147) => 'O',
                chr(195) . chr(148) => 'O',
                chr(195) . chr(149) => 'O',
                chr(195) . chr(150) => 'O',
                chr(195) . chr(153) => 'U',
                chr(195) . chr(154) => 'U',
                chr(195) . chr(155) => 'U',
                chr(195) . chr(156) => 'U',
                chr(195) . chr(157) => 'Y',
                chr(195) . chr(159) => 's',
                chr(195) . chr(160) => 'a',
                chr(195) . chr(161) => 'a',
                chr(195) . chr(162) => 'a',
                chr(195) . chr(163) => 'a',
                chr(195) . chr(164) => 'a',
                chr(195) . chr(165) => 'a',
                chr(195) . chr(167) => 'c',
                chr(195) . chr(168) => 'e',
                chr(195) . chr(169) => 'e',
                chr(195) . chr(170) => 'e',
                chr(195) . chr(171) => 'e',
                chr(195) . chr(172) => 'i',
                chr(195) . chr(173) => 'i',
                chr(195) . chr(174) => 'i',
                chr(195) . chr(175) => 'i',
                chr(195) . chr(177) => 'n',
                chr(195) . chr(178) => 'o',
                chr(195) . chr(179) => 'o',
                chr(195) . chr(180) => 'o',
                chr(195) . chr(181) => 'o',
                chr(195) . chr(182) => 'o',
                chr(195) . chr(182) => 'o',
                chr(195) . chr(185) => 'u',
                chr(195) . chr(186) => 'u',
                chr(195) . chr(187) => 'u',
                chr(195) . chr(188) => 'u',
                chr(195) . chr(189) => 'y',
                chr(195) . chr(191) => 'y',
                // Decompositions for Latin Extended-A
                chr(196) . chr(128) => 'A',
                chr(196) . chr(129) => 'a',
                chr(196) . chr(130) => 'A',
                chr(196) . chr(131) => 'a',
                chr(196) . chr(132) => 'A',
                chr(196) . chr(133) => 'a',
                chr(196) . chr(134) => 'C',
                chr(196) . chr(135) => 'c',
                chr(196) . chr(136) => 'C',
                chr(196) . chr(137) => 'c',
                chr(196) . chr(138) => 'C',
                chr(196) . chr(139) => 'c',
                chr(196) . chr(140) => 'C',
                chr(196) . chr(141) => 'c',
                chr(196) . chr(142) => 'D',
                chr(196) . chr(143) => 'd',
                chr(196) . chr(144) => 'D',
                chr(196) . chr(145) => 'd',
                chr(196) . chr(146) => 'E',
                chr(196) . chr(147) => 'e',
                chr(196) . chr(148) => 'E',
                chr(196) . chr(149) => 'e',
                chr(196) . chr(150) => 'E',
                chr(196) . chr(151) => 'e',
                chr(196) . chr(152) => 'E',
                chr(196) . chr(153) => 'e',
                chr(196) . chr(154) => 'E',
                chr(196) . chr(155) => 'e',
                chr(196) . chr(156) => 'G',
                chr(196) . chr(157) => 'g',
                chr(196) . chr(158) => 'G',
                chr(196) . chr(159) => 'g',
                chr(196) . chr(160) => 'G',
                chr(196) . chr(161) => 'g',
                chr(196) . chr(162) => 'G',
                chr(196) . chr(163) => 'g',
                chr(196) . chr(164) => 'H',
                chr(196) . chr(165) => 'h',
                chr(196) . chr(166) => 'H',
                chr(196) . chr(167) => 'h',
                chr(196) . chr(168) => 'I',
                chr(196) . chr(169) => 'i',
                chr(196) . chr(170) => 'I',
                chr(196) . chr(171) => 'i',
                chr(196) . chr(172) => 'I',
                chr(196) . chr(173) => 'i',
                chr(196) . chr(174) => 'I',
                chr(196) . chr(175) => 'i',
                chr(196) . chr(176) => 'I',
                chr(196) . chr(177) => 'i',
                chr(196) . chr(178) => 'IJ',
                chr(196) . chr(179) => 'ij',
                chr(196) . chr(180) => 'J',
                chr(196) . chr(181) => 'j',
                chr(196) . chr(182) => 'K',
                chr(196) . chr(183) => 'k',
                chr(196) . chr(184) => 'k',
                chr(196) . chr(185) => 'L',
                chr(196) . chr(186) => 'l',
                chr(196) . chr(187) => 'L',
                chr(196) . chr(188) => 'l',
                chr(196) . chr(189) => 'L',
                chr(196) . chr(190) => 'l',
                chr(196) . chr(191) => 'L',
                chr(197) . chr(128) => 'l',
                chr(197) . chr(129) => 'L',
                chr(197) . chr(130) => 'l',
                chr(197) . chr(131) => 'N',
                chr(197) . chr(132) => 'n',
                chr(197) . chr(133) => 'N',
                chr(197) . chr(134) => 'n',
                chr(197) . chr(135) => 'N',
                chr(197) . chr(136) => 'n',
                chr(197) . chr(137) => 'N',
                chr(197) . chr(138) => 'n',
                chr(197) . chr(139) => 'N',
                chr(197) . chr(140) => 'O',
                chr(197) . chr(141) => 'o',
                chr(197) . chr(142) => 'O',
                chr(197) . chr(143) => 'o',
                chr(197) . chr(144) => 'O',
                chr(197) . chr(145) => 'o',
                chr(197) . chr(146) => 'OE',
                chr(197) . chr(147) => 'oe',
                chr(197) . chr(148) => 'R',
                chr(197) . chr(149) => 'r',
                chr(197) . chr(150) => 'R',
                chr(197) . chr(151) => 'r',
                chr(197) . chr(152) => 'R',
                chr(197) . chr(153) => 'r',
                chr(197) . chr(154) => 'S',
                chr(197) . chr(155) => 's',
                chr(197) . chr(156) => 'S',
                chr(197) . chr(157) => 's',
                chr(197) . chr(158) => 'S',
                chr(197) . chr(159) => 's',
                chr(197) . chr(160) => 'S',
                chr(197) . chr(161) => 's',
                chr(197) . chr(162) => 'T',
                chr(197) . chr(163) => 't',
                chr(197) . chr(164) => 'T',
                chr(197) . chr(165) => 't',
                chr(197) . chr(166) => 'T',
                chr(197) . chr(167) => 't',
                chr(197) . chr(168) => 'U',
                chr(197) . chr(169) => 'u',
                chr(197) . chr(170) => 'U',
                chr(197) . chr(171) => 'u',
                chr(197) . chr(172) => 'U',
                chr(197) . chr(173) => 'u',
                chr(197) . chr(174) => 'U',
                chr(197) . chr(175) => 'u',
                chr(197) . chr(176) => 'U',
                chr(197) . chr(177) => 'u',
                chr(197) . chr(178) => 'U',
                chr(197) . chr(179) => 'u',
                chr(197) . chr(180) => 'W',
                chr(197) . chr(181) => 'w',
                chr(197) . chr(182) => 'Y',
                chr(197) . chr(183) => 'y',
                chr(197) . chr(184) => 'Y',
                chr(197) . chr(185) => 'Z',
                chr(197) . chr(186) => 'z',
                chr(197) . chr(187) => 'Z',
                chr(197) . chr(188) => 'z',
                chr(197) . chr(189) => 'Z',
                chr(197) . chr(190) => 'z',
                chr(197) . chr(191) => 's',
                // Euro Sign
                chr(226) . chr(130) . chr(172) => 'E',
                // GBP (Pound) Sign
                chr(194) . chr(163) => ''
            );
            $string = strtr($string, $chars);
        } else {
            // Assume ISO-8859-1 if not UTF-8
            $chars['in'] = chr(128) . chr(131) . chr(138) . chr(142) . chr(154) . chr(158) . chr(159) . chr(162) . chr(165) . chr(181) . chr(192) . chr(193) . chr(194) . chr(195) . chr(196) . chr(197) . chr(199) . chr(200) . chr(201) . chr(202) . chr(203) . chr(204) . chr(205) . chr(206) . chr(207) . chr(209) . chr(210) . chr(211) . chr(212) . chr(213) . chr(214) . chr(216) . chr(217) . chr(218) . chr(219) . chr(220) . chr(221) . chr(224) . chr(225) . chr(226) . chr(227) . chr(228) . chr(229) . chr(231) . chr(232) . chr(233) . chr(234) . chr(235) . chr(236) . chr(237) . chr(238) . chr(239) . chr(241) . chr(242) . chr(243) . chr(244) . chr(245) . chr(246) . chr(248) . chr(249) . chr(250) . chr(251) . chr(252) . chr(253) . chr(255);
            $chars['out'] = "EfSZszYcYuAAAAAACEEEEIIIINOOOOOOUUUUYaaaaaaceeeeiiiinoooooouuuuyy";
            $string = strtr($string, $chars['in'], $chars['out']);
            $double_chars['in'] = array(
                chr(140),
                chr(156),
                chr(198),
                chr(208),
                chr(222),
                chr(223),
                chr(230),
                chr(240),
                chr(254)
            );
            $double_chars['out'] = array(
                'OE',
                'oe',
                'AE',
                'DH',
                'TH',
                'ss',
                'ae',
                'dh',
                'th'
            );
            $string = str_replace($double_chars['in'], $double_chars['out'], $string);
        }
        return $string;
    }

    function seems_utf8($Str)
    { // by bmorel at ssi dot fr
        $length = strlen($Str);
        for ($i = 0; $i < $length; $i ++) {
            if (ord($Str[$i]) < 0x80)
                continue; // 0bbbbbbb
            elseif ((ord($Str[$i]) & 0xE0) == 0xC0)
                $n = 1; // 110bbbbb
            elseif ((ord($Str[$i]) & 0xF0) == 0xE0)
                $n = 2; // 1110bbbb
            elseif ((ord($Str[$i]) & 0xF8) == 0xF0)
                $n = 3; // 11110bbb
            elseif ((ord($Str[$i]) & 0xFC) == 0xF8)
                $n = 4; // 111110bb
            elseif ((ord($Str[$i]) & 0xFE) == 0xFC)
                $n = 5; // 1111110b
            else
                return false; // Does not match any model
            for ($j = 0; $j < $n; $j ++) { // n bytes matching 10bbbbbb follow ?
                if ((++ $i == $length) || ((ord($Str[$i]) & 0xC0) != 0x80))
                    return false;
            }
        }
        return true;
    }
}
?>