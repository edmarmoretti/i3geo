<?php

/*
 * Title: classe_alteraclasse.php
 *
 * Manipula&ccedil;&atilde;o de classes e estilos de um layer
 *
 * Licenca:
 *
 * GPL2
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
 * i3geo/classesphp/classe_alteraclasse.php
 */
/*
 * Classe: Alteraclasse
 *
 * Opera&ccedil;&otilde;es que alteram as classes da legenda de um tema existente no mapa.
 * As modifica&ccedil;&otilde;es permitem contruir novas legendas para cada tema.
 */
class Alteraclasse
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
     * Function: __construct
     *
     * Cria um objeto Alteraclasse
     *
     * Parametros:
     *
     * $map_file - Endere&ccedil;o do mapfile no servidor.
     *
     * $tema - nome do tema
     */
    function __construct($map_file, $tema = "", $locaplic = "", $ext = "")
    {
        include (dirname(__FILE__) . "/../ms_configura.php");
        $this->postgis_mapa = $postgis_mapa;

        include_once (dirname(__FILE__) . "/funcoes_gerais.php");

        $this->locaplic = $locaplic;

        $this->mapa = ms_newMapObj($map_file);
        substituiConObj($this->mapa, $postgis_mapa);

        $this->arquivo = str_replace(".map", "", $map_file) . ".map";
        $this->layer = "";
        if ($tema != "" && @$this->mapa->getlayerbyname($tema)) {
            $this->layer = $this->mapa->getlayerbyname($tema);
        }
        $this->nome = $tema;
        if ($ext && $ext != "") {
            $e = explode(" ", $ext);
            $extatual = $this->mapa->extent;
            $extatual->setextent((min($e[0], $e[2])), (min($e[1], $e[3])), (max($e[0], $e[2])), (max($e[1], $e[3])));
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
        restauraConObj($this->mapa, $this->postgis_mapa);
        $this->mapa->save($this->arquivo);
    }

    /*
     * Function: aplicacoresrgb
     *
     * Aplica cores nas classes atuais conforme uma lista de cores em RGB
     *
     * Parametro:
     *
     * cores {array} - array com a lista de valores RGB
     */
    function aplicacoresrgb($cores)
    {
        if (! $this->layer) {
            return "erro";
        }
        $numclasses = $this->layer->numclasses;
        if ($numclasses > 0) {
            for ($i = 0; $i < $numclasses; ++ $i) {
                $classe = $this->layer->getClass($i);
                $estilo = $classe->getstyle(0);
                if ($cores[$i]) {
                    $cor = explode(",", $cores[$i]);
                    $ncor = $estilo->color;
                    $ncor->setrgb($cor[0], $cor[1], $cor[2]);
                }
            }
        }
        $this->layer->setMetaData("cache", "");
        return true;
    }

    /*
     * function: simbolounico
     *
     * Elimina as classes existentes em um objeto layer mantendo apenas a primeira classe.
     * Todos os elementos passar&atilde;o a ser desenhados conforme essa primeira classe, uma vez que a express&atilde;o de defini&ccedil;&atilde;o da classe passa a ser vazia.
     */
    function simbolounico()
    {
        if (! $this->layer) {
            return "erro";
        }
        $numclasses = $this->layer->numclasses;
        if ($numclasses > 0) {
            // elimina a express&atilde;o da primeira classe
            $classe0 = $this->layer->getClass(0);
            // echo "<pre>";var_dump($classe0);exit;
            $classe0->setexpression("");
            $classe0->set("name", " ");
            // apaga todas as classes menos a primeira
            for ($i = 1; $i < $numclasses; ++ $i) {
                $classe = $this->layer->getClass($i);
                $classe->set("status", MS_DELETE);
            }
        } else {
            $classe = ms_newClassObj($this->layer);
            $novoestilo = ms_newStyleObj($classe);
            if ($this->layer->type == 0) {
                $novoestilo->set("symbolname", "ponto");
                $novoestilo->set("size", "6");
            }
            $cor = $novoestilo->color;
            $cor->setRGB(255, 100, 100);
        }
        $this->layer->setMetaData("cache", "");
        return true;
    }

    /*
     * function: alteraclasses
     *
     * Altera as classes existentes em um objeto layer conforme a lista de &iacute;ndices, nomes e express&otilde;es definidas nos par&acirc;metros passados como argumentos.
     *
     * Parametros:
     *
     * $ids - lista de ids, separados por v&iacute;rgula, que identificam as classes no layer
     *
     * $nomes - lista com os novos nomes
     *
     * $exps - lista com as novas express&otilde;es
     *
     * $base64 sim|nao indica se as strings estao codificadas em base64
     *
     * $minScales - lista com valores para minscaledenom
     *
     * $maxScales - lista com valores para maxscaledenom
     */
    function alteraclasses($ids, $nomes, $exps, $base64 = "nao", $minScales = "", $maxScales = "",$separador=";")
    {
        if ($base64 == "sim") {
            //$ids = base64_decode($ids);
            $nomes = base64_decode($nomes);
            $exps = base64_decode($exps);
        }
        // prepara os arrays com os valores
        $ids = explode($separador, $ids);
        $minScales = explode($separador, $minScales);
        $maxScales = explode($separador, $maxScales);

        $nomes = $this->converteTexto($nomes);
        $nomes = explode($separador, $nomes);
        $exps = mb_convert_encoding($exps, "ISO-8859-1", "UTF-8");
        $exps = explode($separador, $exps);
        // pega os layers existentes no array ids e armazena no array t
        $c = count($ids);
        for ($i = 0; $i < $c; ++ $i) {
            $tx = explode("-", $ids[$i]);
            $t[] = $tx[0];
        }
        // elimina nomes de layers duplicados
        $t = array_unique($t);
        // elimina as classes existentes atualmente em cada layer
        foreach ($t as $tema) {
            $layer = $this->mapa->getlayerbyname($tema);
            $layer->setmetadata("cache", "");
            $nc = $layer->numclasses;
            if ($nc > 0) {
                for ($i = 0; $i < $nc; ++ $i) {
                    $class = $layer->getclass($i);
                    $class->set("status", MS_DELETE);
                }
            }
        }
        // acrescenta as classes definidas
        $c = count($ids);
        for ($i = 0; $i < $c; ++ $i) {
            $layerc = explode("-", $ids[$i]); // nome do layer &eacute; o indice 0 do array
            $layer = $this->mapa->getlayerbyname($layerc[0]);
            $layer->setMetaData("cache", "");
            $ncl = $layer->numclasses;
            if ($layerc[1] < $ncl) {
                $classe = $layer->getclass($layerc[1]);
                $classe->set("status", MS_DEFAULT);
                $classe->set("name", $nomes[$i]);
                $e = $exps[$i];
                $e = str_replace("\\", "'", $e);
                $e = str_replace('"', "'", $e);
                $e = str_replace("''", "'", $e);
                $e = str_replace("##", "'", $e);
                $classe->setexpression($e);
                if ($minScales[$i]) {
                    if ($minScales[$i] == 0 || $minScales[$i] == "") {
                        $minScales[$i] = - 1;
                    }
                    $classe->set("minscaledenom", $minScales[$i]);
                }
                if ($maxScales[$i]) {
                    if ($maxScales[$i] == 0 || $maxScales[$i] == "") {
                        $maxScales[$i] = - 1;
                    }
                    $classe->set("maxscaledenom", $maxScales[$i]);
                }
            }
        }
        return true;
    }

    /*
     * function: intervalosiguais
     *
     * Cria classes em um objeto layer com intervalos iguais baseando-se em um item num&eacute;rico na tabela de atributos com um n&uacute;mero de classes fixos.
     *
     * Parametros:
     *
     * $item - item da tabela de atributos
     *
     * $nclasses - n&uacute;mero de classes
     *
     * $ignorar - valor que ser&aacute; ignorado na listagem final
     */
    function intervalosiguais($item, $nclasses, $ignorar)
    {
        if (! $this->layer) {
            return "erro";
        }
        $valores = $this->pegaValores($this->mapa, $this->layer, $item, true, $ignorar);
        if (count($valores) > 0) {
            // calcula o menor valor e o maior valor
            $min = min($valores);
            $max = max($valores);
            $intervalo = ($max - $min) / $nclasses;
            $numclassesatual = $this->layer->numclasses;
            // apaga todas as classes existentes
            $classetemp = $this->layer->getClass(0);
            $estilotemp = $classetemp->getStyle(0);
            for ($i = 0; $i < $numclassesatual; ++ $i) {
                $classe = $this->layer->getClass($i);
                $classe->set("status", MS_DELETE);
            }
            // adiciona as classes novas
            $intatual = $min;
            for ($i = 0; $i < $nclasses; ++ $i) {
                if ($i == $nclasses - 1) {
                    $expressao = "(([" . $item . "]>=" . $intatual . ")and([" . $item . "]<=" . ($intatual + $intervalo) . "))";
                } else {
                    $expressao = "(([" . $item . "]>=" . $intatual . ")and([" . $item . "]<" . ($intatual + $intervalo) . "))";
                }
                $nomeclasse = ">= " . $intatual . " e < que " . ($intatual + $intervalo);
                $intatual = $intatual + $intervalo;
                $classe = ms_newClassObj($this->layer);
                $novoestilo = ms_newStyleObj($classe);
                if ($this->layer->type == 0) {
                    $novoestilo->set("symbolname", "ponto");
                    $novoestilo->set("size", "6");
                }
                $ncor = $novoestilo->color;
                $ncor->setrgb((mt_rand(0, 255)), (mt_rand(0, 255)), (mt_rand(0, 255)));
                $ncor = $novoestilo->outlinecolor;
                $ncor->setrgb(255, 255, 255);
                $classe->setexpression($expressao);
                $classe->set("name", $nomeclasse);
                $classe->set("title", ($this->layer->name) . "+" . $i);
            }
            $this->layer->setMetaData("cache", "");
            return true;
        } else {
            return false;
        }
    }

    /*
     * function: metade
     *
     * Classifica os dados em duas classes, a primeira concentra os registros que somados correspondem &agrave; primeira metade do total e a segunda classe corresponde &agrave; segunda metade
     *
     * Parametros:
     *
     * $item - item da tabela de atributos
     *
     * $itemid - item que identifica unicamente cada registro
     *
     * $ignorar - valor que ser&aacute; ignorado na listagem final
     */
    function metade($item, $itemid, $ignorar)
    {
        if (! $this->layer) {
            return "erro";
        }
        // cria um array contendo o id como chave e o valor
        $valores = $this->pegaValores($this->mapa, $this->layer, $item, true, $ignorar);
        $ids = $this->pegaValores($this->mapa, $this->layer, $itemid, false, $ignorar);
        $lista = array();
        for ($i = 0; $i < count($valores); ++ $i) {
            $lista[$ids[$i]] = $valores[$i];
        }

        if (count($lista) > 0) {
            asort($lista);
            // $valores = array_unique($valores);
            $numValues = count($lista);
            // soma os valores
            $total = array_sum($lista);
            // metade
            $metade = $total / 2;
            // separa os dados em dois conjuntos
            $metadeInf = array();
            $metadeSup = array();
            $IdNumerico = true;
            $soma = 0;
            $somaInf = 0;
            $somaSup = 0;
            $maxMetade1 = 0;
            foreach ($lista as $k => $v) {
                $soma = $soma + $v;
                if ($soma < $metade) {
                    $metadeInf[] = $k;
                    $somaInf = $soma;
                    $maxMetade1 = $v;
                } else {
                    $metadeSup[] = $k;
                    $somaSup = $somaSup + $v;
                }
            }
            $percInf = ($somaInf * 100) / $total;
            $percSup = ($somaSup * 100) / $total;

            $numclassesatual = $this->layer->numclasses;
            // apaga todas as classes existentes
            $classetemp = $this->layer->getClass(0);
            $estilotemp = $classetemp->getStyle(0);
            for ($i = 0; $i < $numclassesatual; ++ $i) {
                $classe = $this->layer->getClass($i);
                $classe->set("status", MS_DELETE);
            }
            // adiciona as classes novas
            $expressao = "('[" . $itemid . "]'in'" . implode(",", $metadeInf) . "')";
            $nomeclasse = "Tot " . $somaInf . ' (' . round($percInf, 2) . '%) Max: ' . $maxMetade1;
            $classe = ms_newClassObj($this->layer);
            $novoestilo = ms_newStyleObj($classe);
            if ($this->layer->type == 0) {
                $novoestilo->set("symbolname", "ponto");
                $novoestilo->set("size", "6");
            }
            $ncor = $novoestilo->color;
            $ncor->setrgb(246, 183, 134);
            $ncor = $novoestilo->outlinecolor;
            $ncor->setrgb(255, 255, 255);
            $classe->setexpression($expressao);
            $classe->set("name", $nomeclasse);

            $expressao = "('[" . $itemid . "]'in'" . implode(",", $metadeSup) . "')";
            $nomeclasse = "Tot " . $somaSup . ' (' . round($percSup, 2) . '%) ';
            $classe = ms_newClassObj($this->layer);
            $novoestilo = ms_newStyleObj($classe);
            if ($this->layer->type == 0) {
                $novoestilo->set("symbolname", "ponto");
                $novoestilo->set("size", "6");
            }
            $ncor = $novoestilo->color;
            $ncor->setrgb(210, 111, 111);
            $ncor = $novoestilo->outlinecolor;
            $ncor->setrgb(255, 255, 255);
            $classe->setexpression($expressao);
            $classe->set("name", $nomeclasse);

            $this->layer->setMetaData("cache", "");
            return true;
        } else {
            return false;
        }
    }

    /*
     * function: classemedia
     *
     * Classifica os dados em duas classes, a primeira concentra os registros que est&atilde;o abaixo da m&eacute;dia e a segunda aqueles que s&atilde;o iguais ou superiores a m&eacute;dia
     *
     * Parametros:
     *
     * $item - item da tabela de atributos
     *
     * $ignorar - valor que ser&aacute; ignorado na listagem final
     */
    function classemedia($item, $ignorar)
    {
        if (! $this->layer) {
            return "erro";
        }
        $valores = $this->pegaValores($this->mapa, $this->layer, $item, false, $ignorar);

        if (count($valores) > 0) {
            $media = array_sum($valores) / count($valores);

            $numclassesatual = $this->layer->numclasses;
            // apaga todas as classes existentes
            $classetemp = $this->layer->getClass(0);
            $estilotemp = $classetemp->getStyle(0);
            for ($i = 0; $i < $numclassesatual; ++ $i) {
                $classe = $this->layer->getClass($i);
                $classe->set("status", MS_DELETE);
            }
            // adiciona as classes novas
            $expressao = "([" . $item . "]<" . $media . ")";
            $nomeclasse = "< media " . $media;
            $classe = ms_newClassObj($this->layer);

            $novoestilo = ms_newStyleObj($classe);
            if ($this->layer->type == 0) {
                $novoestilo->set("symbolname", "ponto");
                $novoestilo->set("size", "6");
            }
            $ncor = $novoestilo->color;
            $ncor->setrgb(200, 183, 134);
            $ncor = $novoestilo->outlinecolor;
            $ncor->setrgb(255, 255, 255);
            $classe->setexpression($expressao);
            $classe->set("name", $nomeclasse);

            $expressao = "([" . $item . "]>=" . $media . ")";
            $nomeclasse = ">= media " . $media;
            $classe = ms_newClassObj($this->layer);

            $novoestilo = ms_newStyleObj($classe);
            if ($this->layer->type == 0) {
                $novoestilo->set("symbolname", "ponto");
                $novoestilo->set("size", "6");
            }
            $ncor = $novoestilo->color;
            $ncor->setrgb(210, 100, 100);
            $ncor = $novoestilo->outlinecolor;
            $ncor->setrgb(255, 255, 255);
            $classe->setexpression($expressao);
            $classe->set("name", $nomeclasse);

            $this->layer->setMetaData("cache", "");
            return true;
        } else {
            return false;
        }
    }

    /*
     * function: quantil
     *
     * Cria classes em um objeto layer com intervalos baseados no calculo de quantil
     *
     * Parametros:
     *
     * $item - item da tabela de atributos
     *
     * $nclasses - n&uacute;mero de classes
     *
     * $ignorar - valor que ser&aacute; ignorado na listagem final
     */
    function quantil($item, $nclasses, $ignorar)
    {
        if (! $this->layer) {
            return "erro";
        }
        $valores = $this->pegaValores($this->mapa, $this->layer, $item, true, $ignorar);
        if (count($valores) > 0) {
            // rotina obtida do pacote TME
            sort($valores);
            // $valores = array_unique($valores);
            $numValues = count($valores);
            $classNum = $numValues / $nclasses; // Number in each class
            for ($i = 0; $i < $nclasses; $i ++) {
                $position = (int) ($classNum * $i);
                $classBreaks[] = $valores[$position];
            }
            $classBreaks[] = $valores[$numValues - 1]; // Last class break = biggest value
                                                       // echo "<pre>";var_dump($classBreaks);exit;
            $numclassesatual = $this->layer->numclasses;
            // apaga todas as classes existentes
            $classetemp = $this->layer->getClass(0);
            $estilotemp = $classetemp->getStyle(0);
            for ($i = 0; $i < $numclassesatual; ++ $i) {
                $classe = $this->layer->getClass($i);
                $classe->set("status", MS_DELETE);
            }
            // adiciona as classes novas
            for ($i = 0; $i < $nclasses; ++ $i) {
                $expressao = "(([" . $item . "]>" . $classBreaks[$i] . ")and([" . $item . "]<=" . $classBreaks[$i + 1] . "))";
                $nomeclasse = "> " . $classBreaks[$i] . " e <= que " . ($classBreaks[$i + 1]);
                if ($i == 0) {
                    $expressao = "([" . $item . "]<=" . $classBreaks[$i + 1] . ")";
                    $nomeclasse = "<= que " . ($classBreaks[$i + 1]);
                }
                if ($i == ($nclasses - 1)) {
                    $expressao = "([" . $item . "] >=" . $classBreaks[$i] . ")";
                    $nomeclasse = ">= que " . ($classBreaks[$i]);
                }
                $classe = ms_newClassObj($this->layer);
                $novoestilo = ms_newStyleObj($classe);
                if ($this->layer->type == 0) {
                    $novoestilo->set("symbolname", "ponto");
                    $novoestilo->set("size", "6");
                }
                $ncor = $novoestilo->color;
                $ncor->setrgb((mt_rand(0, 255)), (mt_rand(0, 255)), (mt_rand(0, 255)));
                $ncor = $novoestilo->outlinecolor;
                $ncor->setrgb(255, 255, 255);
                $classe->setexpression($expressao);
                $classe->set("name", $nomeclasse);
                // $classe->set("title",($this->layer->name)."+".$i);
            }
            $this->layer->setMetaData("cache", "");
            return ("ok");
        } else {
            return ("erro. Nenhum valor numerico no item");
        }
    }

    /*
     * function: quebrasnaturais
     *
     * Cria classes em um objeto layer com intervalos baseados no calculo de quebras naturais
     *
     * Parametros:
     *
     * $item - item da tabela de atributos
     *
     * $nclasses - n&uacute;mero de classes
     *
     * $ignorar - valor que ser&aacute; ignorado na listagem final
     */
    function quebrasnaturais($item, $nclasses, $ignorar)
    {
        if (! $this->layer) {
            return "erro";
        }
        $valores = $this->pegaValores($this->mapa, $this->layer, $item, true, $ignorar);
        if (count($valores) > 0) {
            include (dirname(__FILE__) . "/../pacotes/jenks-master/jenks.php");
            $classBreaks = getJenksClasses($nclasses, $valores);
            // echo "<pre>";var_dump($classBreaks);exit;
            $numclassesatual = $this->layer->numclasses;
            // apaga todas as classes existentes
            $classetemp = $this->layer->getClass(0);
            $estilotemp = $classetemp->getStyle(0);
            for ($i = 0; $i < $numclassesatual; ++ $i) {
                $classe = $this->layer->getClass($i);
                $classe->set("status", MS_DELETE);
            }
            // adiciona as classes novas
            for ($i = 0; $i < $nclasses; ++ $i) {
                $expressao = "(([" . $item . "]>" . $classBreaks[$i] . ")and([" . $item . "]<=" . $classBreaks[$i + 1] . "))";
                $nomeclasse = "> " . $classBreaks[$i] . " e <= que " . ($classBreaks[$i + 1]);
                if ($i == 0) {
                    $expressao = "([" . $item . "]<=" . $classBreaks[$i + 1] . ")";
                    $nomeclasse = "<= que " . ($classBreaks[$i + 1]);
                }
                if ($i == ($nclasses - 1)) {
                    $expressao = "([" . $item . "] >=" . $classBreaks[$i] . ")";
                    $nomeclasse = ">= que " . ($classBreaks[$i]);
                }
                $classe = ms_newClassObj($this->layer);
                $novoestilo = ms_newStyleObj($classe);
                if ($this->layer->type == 0) {
                    $novoestilo->set("symbolname", "ponto");
                    $novoestilo->set("size", "6");
                }
                $ncor = $novoestilo->color;
                $ncor->setrgb((mt_rand(0, 255)), (mt_rand(0, 255)), (mt_rand(0, 255)));
                $ncor = $novoestilo->outlinecolor;
                $ncor->setrgb(255, 255, 255);
                $classe->setexpression($expressao);
                $classe->set("name", $nomeclasse);
                // $classe->set("title",($this->layer->name)."+".$i);
            }
            $this->layer->setMetaData("cache", "");
            return true;
        } else {
            return false;
        }
    }

    /*
     * function: quartis
     *
     * Cria classes em um objeto layer com intervalos em quartis baseando-se em um item num&eacute;rico na tabela de atributos com um n&uacute;mero de classes fixos.
     *
     * Parametros:
     *
     * $item - Item da tabela de atributos utilizado para gerar as classes.
     *
     * $ignorar - valor que ser&aacute; ignorado na listagem final
     *
     * $tipoLegenda - tipo de texto que ser&aacute; inclu&iacute;do no nome de cada classe completo|simples|minimo
     *
     * Include:
     * <classe_estatistica.php>
     */
    function quartis($item, $ignorar = "", $tipoLegenda = "minimo")
    {
        if (! $this->layer) {
            return "erro";
        }

        $valores = $this->pegaValores($this->mapa, $this->layer, $item, true, $ignorar);
        if (count($valores) > 0) {
            if (file_exists($this->locaplic . "/classe_estatistica.php"))
                include_once ($this->locaplic . "/classe_estatistica.php");
            else
                include_once ("classe_estatistica.php");
            $estat = new estatistica();
            $estat->calcula($valores);
            $calc = $estat->resultado;
            $numclassesatual = $this->layer->numclasses;
            // apaga todas as classes existentes
            $classetemp = $this->layer->getClass(0);
            for ($i = 0; $i < $numclassesatual; ++ $i) {
                $classe = $this->layer->getClass($i);
                $classe->set("status", MS_DELETE);
            }
            // adiciona as classes novas
            $expressao[] = "([" . $item . "]<=" . ($calc["quartil1"]) . ")";
            $expressao[] = "(([" . $item . "]>" . ($calc["quartil1"]) . ")and([" . $item . "]<=" . ($calc["quartil2"]) . "))";
            if ($calc["quartil3"] != 0) {
                $expressao[] = "(([" . $item . "]>" . ($calc["quartil2"]) . ")and([" . $item . "]<=" . ($calc["quartil3"]) . "))";
                $expressao[] = "([" . $item . "]>" . ($calc["quartil3"]) . ")";
            }
            $nomes[] = "<= " . ($calc["quartil1"]);
            $nomes[] = "> " . ($calc["quartil1"]) . " e <= " . ($calc["quartil2"]);
            if ($calc["quartil3"] != 0) {
                $nomes[] = "> " . ($calc["quartil2"]) . " e <= " . ($calc["quartil3"]);
                $nomes[] = "> " . ($calc["quartil3"]);
            }
            $vcor = array(
                250,
                230,
                150,
                0
            );
            for ($i = 0; $i < count($nomes); ++ $i) {
                $classe = ms_newClassObj($this->layer);
                $novoestilo = ms_newStyleObj($classe);
                if ($this->layer->type == 0) {
                    $novoestilo->set("symbolname", "ponto");
                    $novoestilo->set("size", "6");
                }
                $classe->setexpression($expressao[$i]);
                if ($tipoLegenda == "completo") {
                    $nomeClasse = "Quartil " . ($i + 1) . " " . $expressao[$i];
                }
                if ($tipoLegenda == "simples") {
                    $nomeClasse = "Quartil " . ($i + 1) . " " . $nomes[$i];
                }
                if ($tipoLegenda == "minimo" || $tipoLegenda == "") {
                    $nomeClasse = $nomes[$i];
                }

                $classe->set("name", $nomeClasse);
                $ncor = $novoestilo->color;
                $ncor->setrgb(255, $vcor[$i], $vcor[$i]);
                $ncor = $novoestilo->outlinecolor;
                $ncor->setrgb(255, 255, 255);
            }
            $this->layer->setMetaData("cache", "");
            return true;
        } else {
            return false;
        }
    }

    /*
     * function: valorunico
     *
     * Cria classes em um objeto layer baseando-se em um item na tabela de atributos.
     *
     * Para cada ocorr&ecirc;ncia de um valor &eacute; acrescentada uma classe.
     *
     * Parametros:
     *
     * $item - Item da tabela de atributos utilizado para gerar as classes.
     *
     * $ignorar - valor que ser&aacute; ignorado na listagem final
     *
     * $itemNome - item que ser&aacute; usado para definir os nomes das classes (por default ser&aacute; igual a $item)
     */
    function valorunico($item, $ignorar, $itemNome = "")
    {
        if (! $this->layer) {
            return "erro";
        }
        if ($itemNome == "" || $ignorar != "") {
            $itemNome = $item;
        }
        if ($item == $itemNome) {
            $vs = $this->pegaValores($this->mapa, $this->layer, $item, false, $ignorar,true);
            for ($i = 0; $i < count($vs); ++ $i) {
                $temp[$vs[$i]] = $vs[$i];
            }
        } else {
            $vs = $this->pegaValores($this->mapa, $this->layer, array($item,$itemNome), false, $ignorar,true);
            for ($i = 0; $i < count($vs); ++ $i) {
                $temp[$vs[$i][0]] = $vs[$i][1];
            }
        }
        $valores = array_keys($temp);
        $nomes = array();
        foreach ($temp as $t) {
            $nomes[] = $t;
        }
        $nclassexist = $this->layer->numclasses;
        if ($nclassexist > count($valores)) {
            $nclassexist = count($valores);
        }
        if ($this->layer->numclasses == 0) {
            $temp = ms_newClassObj($this->layer);
            ms_newStyleObj($temp);
        }
        // cria classes
        $classes = array();
        $classpadrao = $this->layer->getClass(0);
        for ($i = 0; $i < $nclassexist; ++ $i) {
            $classes[$i] = $this->layer->getClass($i);
        }
        $c = $this->layer->numclasses;
        for ($i = 0; $i < $c; ++ $i) // apaga classes atuais
        {
            $cl = $this->layer->getClass($i);
            $cl->set("status", MS_DELETE);
        }
        $c = count($valores);
        for ($i = 0; $i < $c; ++ $i) {
            $classes[$i] = ms_newClassObj($this->layer);
            $newstyle = ms_newStyleObj($classes[$i]);
        }
        for ($i = 0; $i < $c; ++ $i) {
            $e = "('[" . $item . "]'eq'" . $valores[$i] . "')";
            $ca = $classes[$i];
            $ca->setexpression($e);
            $texto = $this->converteTexto($nomes[$i]);
            $ca->set("name", $texto);
            $estilo = $classes[$i]->getStyle(0);
            $ncor = $estilo->color;
            $ncor->setrgb((mt_rand(0, 255)), (mt_rand(0, 255)), (mt_rand(0, 255)));
            $ncor = $estilo->outlinecolor;
            $ncor->setrgb(255, 255, 255);
            if ($this->layer->type == 0) // tipo ponto
{
                $estilo->set("symbolname", "ponto");
                $estilo->set("size", 6);
            }
            // $c->set("title",$tema."+".$i);
        }
        $this->layer->setMetaData("cache", "");
        return true;
    }

    /*
     * function: adicionaclasse
     *
     * Adiciona uma nova classe em um objeto layer
     *
     * A nova classe ser&aacute; uma c�pia da classe 0.
     */
    function adicionaclasse()
    {
        if (! $this->layer) {
            return "erro";
        }
        $classe = $this->layer->getclass(0);
        $c = ms_newClassObj($this->layer, $classe);
        $this->layer->setMetaData("cache", "");
        return true;
    }

    /*
     * function: sobeclasse
     *
     * Sobe uma classe na ordem de desenho
     *
     * Parametro:
     *
     * $idclasse {numerico} - id da classe (&iacute;ndice)
     */
    function sobeclasse($idclasse)
    {
        if (! $this->layer) {
            return "erro";
        }
        $this->layer->moveclassup($idclasse);
        return true;
    }

    /*
     * function: desceclasse
     *
     * Desce uma classe na ordem de desenho
     *
     * Parametro:
     *
     * $idclasse {numerico} - id da classe (&iacute;ndice)
     */
    function desceclasse($idclasse)
    {
        if (! $this->layer) {
            return "erro";
        }
        $this->layer->moveclassdown($idclasse);
        return true;
    }

    /*
     * function: adicionaopacidade
     *
     * Adiciona opacidade vari&aacute;vel de 0 a 100 conforme o n&uacute;mero de classes
     *
     */
    function adicionaopacidade()
    {
        // error_reporting(0);
        if (! $this->layer) {
            return false;
        }
        $numclasses = $this->layer->numclasses;
        $n = intval(100 / $numclasses);
        for ($i = 0; $i < $numclasses; ++ $i) {
            $classe = $this->layer->getclass($i);
            $numestilos = $classe->numstyles;
            $o = ($i * $n) + 5;
            for ($j = 0; $j < $numestilos; ++ $j) {
                $estilo = $classe->getstyle($j);
                $estilo->set("opacity", $o);
            }
        }
        $this->layer->setMetaData("cache", "");
        return true;
    }

    /*
     * function: alteracor
     *
     * Aplica uma nova cor aos estilos de uma classe
     *
     * Parametros:
     *
     * $idclasse {numerico} - id da classe (&iacute;ndice)
     *
     * $cor {string} - cor rgb
     */
    function alteracor($idclasse, $cor, $w=35, $h=25)
    {
        // error_reporting(0);
        if (! $this->layer) {
            return "erro";
        }
        $numclasses = $this->layer->numclasses;
        $cor = str_replace(" ", ",", $cor);
        $cor = explode(",", $cor);
        $classe = $this->layer->getclass($idclasse);
        $numestilos = $classe->numstyles;
        for ($j = 0; $j < $numestilos; ++ $j) {
            $estilo = $classe->getstyle($j);
            $ncor = $estilo->color;
            $ncoroutline = $estilo->outlinecolor;
            if ($ncor->red < 0) {
                $ncoroutline->setrgb($cor[0], $cor[1], $cor[2]);
            } else {
                $ncor->setrgb($cor[0], $cor[1], $cor[2]);
            }
        }
        $this->layer->setMetaData("cache", "");
        $imagem = $classe->createLegendIcon($w, $h)->saveWebImage();
        return ($imagem);
    }

    /*
     * function: alterageometria
     *
     * Altera a geometria de representa&ccedil;&atilde;o de todos os estilos de todas as classes de um layer
     *
     * Parametro:
     *
     * $tipo {string} - tipo de representa&ccedil;&atilde;o
     */
    function alterageometria($tipo)
    {
        // error_reporting(0);
        if (! $this->layer) {
            return "erro";
        }
        $numclasses = $this->layer->numclasses;
        for ($i = 0; $i < $numclasses; ++ $i) {
            $classe = $this->layer->getclass($i);
            $numestilos = $classe->numstyles;
            for ($j = 0; $j < $numestilos; ++ $j) {
                $estilo = $classe->getstyle($j);
                $s = "STYLE geomtransform '$tipo' END";
                $estilo->updateFromString($s);
                $estilo->set("size",10);
                if($tipo == "" || $tipo == "bbox"){
                    $estilo->updateFromString("symbol 0");
                } else {
                    $estilo->set("symbolname","ponto");
                }
            }
        }
        return true;
    }

    /*
     * function: alteraCoresClasses
     *
     * Altera as cores das classes existentes em um objeto layer gerando uma paleta de cores de acordo com um valor inicial e final.
     *
     * Parametros:
     *
     * $cori - cor inicial.
     *
     * $corf - cor final.
     *
     * Include:
     * <class.palette.php>
     */
    function alteraCoresClasses($cori, $corf)
    {
        if (! $this->layer) {
            return "erro";
        }
        if (file_exists($this->locaplic . "/class.palette.php"))
            include_once ($this->locaplic . "/class.palette.php");
        else
            include_once ("class.palette.php");

        $cori = RGB2hex(explode(",", $cori));
        $corf = RGB2hex(explode(",", $corf));
        $numclasses = $this->layer->numclasses;
        $myPalette = new palette(array(
            $cori,
            $corf
        ), ($numclasses + 1));
        $cores = $myPalette->colorRGB;
        for ($i = 0; $i < $numclasses; ++ $i) {
            $classe = $this->layer->getclass($i);
            $estilo = $classe->getstyle(0);
            $corpaleta = $cores[$i];
            if ($this->layer->type == MS_LAYER_LINE) {
                $cor = $estilo->outlinecolor;
                $cor->setrgb($corpaleta[0], $corpaleta[1], $corpaleta[2]);
            }
            $cor = $estilo->color;
            $cor->setrgb($corpaleta[0], $corpaleta[1], $corpaleta[2]);
        }
        $this->layer->setMetaData("cache", "");

        return true;
    }

    /*
     * function: inverteCoresClasses
     *
     * Inverte as cores da legenda de um tema.
     */
    function inverteCoresClasses()
    {
        if (! $this->layer) {
            return "erro";
        }
        $numclasses = $this->layer->numclasses;
        $cor = array();
        for ($i = 0; $i < $numclasses; ++ $i) {
            $classe = $this->layer->getclass($i);
            $estilo = $classe->getstyle(0);
            $c = $estilo->color;
            $cor[] = array(
                "r" => ($c->red),
                "g" => ($c->green),
                "b" => ($c->blue)
            );
        }
        $cor = array_reverse($cor);
        for ($i = 0; $i < $numclasses; ++ $i) {
            $classe = $this->layer->getclass($i);
            $c = $cor[$i];
            $estilo = $classe->getstyle(0);
            $ncor = $estilo->color;
            $ncor->setrgb($c["r"], $c["g"], $c["b"]);
        }
        $this->layer->setMetaData("cache", "");
        return true;
    }

    /*
     * function: calculaTamanhoClasses
     *
     * Calcula o tamanho dos estilos das classes, alterando o tamanho do s&iacute;mbolo.
     */
    function calculaTamanhoClasses($size=5)
    {
        if (! $this->layer) {
            return "erro";
        }
        $numclasses = $this->layer->numclasses;
        for ($i = 0; $i < $numclasses; ++ $i) {
            $classe = $this->layer->getclass($i);
            $estilo = $classe->getstyle(0);

            if ($estilo->symbolname == "") {
                if ($this->layer->type == MS_LAYER_LINE) {
                    //$estilo->set("symbolname", "linha");
                    $estilo->set("width", ($i + $size));
                }
                if ($this->layer->type == MS_LAYER_POINT) {
                    $estilo->set("symbolname", "ponto");
                    $estilo->set("size", ($i + $size));
                }
                if ($this->layer->type == MS_LAYER_POLYGON) {
                    $estilo->set("symbolname", "p4");
                    $estilo->set("size", ($i + $size));
                }
            }
        }
        $this->layer->setMetaData("cache", "");
        return true;
    }

    /*
     * function: ordenaClasses
     *
     * Ordena as classes pelo nome
     */
    function ordenaClasses()
    {
        if (! $this->layer) {
            return "erro";
        }
        $numclasses = $this->layer->numclasses;
        if ($numclasses == 1) {
            return ("ok");
        }
        // pega o nome das classes
        $nomes = array();
        for ($i = 0; $i < $numclasses; $i ++) {
            $classe = $this->layer->getclass($i);
            $nomes[$classe->name] = $classe->convertToString();
        }
        ksort($nomes);
        $indice = 0;
        foreach ($nomes as $n) {
            $classe = $this->layer->getclass($indice);
            $classe->updatefromstring($n);
            $indice ++;
        }
        $this->layer->setMetaData("cache", "");
        return true;
    }

    /*
     * function: statusClasse
     *
     * Inverte o status a uma classe desligando ou desligando, conforme o status atual.
     *
     * Parametros:
     *
     * $classe - id da classe
     *
     */
    function statusClasse($classe)
    {
        //
        // na vers&atilde;o 6 do Mapserver as classes n&atilde;o obedecem o OFF ou ON em arquivos RASTER. Foi necess&aacute;rio contornar o problema usando um metadata
        //
        if (! $this->layer) {
            return "erro";
        }
        $cl = $this->layer->getclass($classe);
        $status = $cl->status;
        //echo $status;
        if ($status == MS_OFF) {
            $cl->set("status", MS_ON);
            if ($this->layer->type == 3) {
                $e = $cl->getstyle(0);
                $e->set("opacity", 100);
            }
        } else {
            $cl->set("status", MS_OFF);
            if ($this->layer->type == 3) {
                $e = $cl->getstyle(0);
                $e->set("opacity", 0);
            }
        }
        $this->layer->setMetaData("cache", "");
        return ("ok");
    }

    /*
     * Function: pegaValores
     *
     * Pega os valores de um item de um tema.
     *
     * Parametros:
     *
     * $layer {objeto} - Layer que ser&aacute; processado.
     *
     * $item {string} - Item que ser&aacute; processado.
     *
     * $numerico {boleano} - O item e numerico (true ou false).
     *
     * $ignorar {string} - valor que ser&aacute; ignorado na listagem final
     *
     * Retorno:
     *
     * {array}
     */
    function pegaValores($mapa, $layer, $item, $numerico = false, $ignorar = "",$unico=false)
    {
        $layer->set("template", "none.htm");
        // $layer->setfilter("");
        $versao = versao();
        $versao = $versao["principal"];
        $ignorararray = explode(",", $ignorar);
        if (@$layer->queryByrect($mapa->extent) == MS_SUCCESS) {
            if ($layer->type == MS_LAYER_RASTER) {
                if ($item == "pixel") {
                    $item = "value_0";
                }
            }
            $sopen = $layer->open();
            if ($sopen == MS_FAILURE) {
                return "erro";
            }
            $res_count = $layer->getNumresults();
            $valitem = array();
            for ($i = 0; $i < $res_count; ++ $i) {
                if ($versao >= 6) {
                    $shape = $layer->getShape($layer->getResult($i));
                } else {
                    $result = $layer->getResult($i);
                    $shp_index = $result->shapeindex;
                    $shape = $layer->getfeature($shp_index, - 1);
                }
                if(is_array($item)){
                    $valite = array();
                    foreach($item as $ite){
                        $valite[] = $this->retornaValorShape($shape,$ite,$numerico,$ignorararray);
                    }
                    if($unico == true){
                        if(!in_array($valite,$valitem)){
                            $valitem[] = $valite;
                        }
                    }
                    else {
                        $valitem[] = $valite;
                    }
                } else {
                    $valite = $this->retornaValorShape($shape,$item,$numerico,$ignorararray);
                    if($valite != false){
                        if($unico == true){
                            if(!in_array($valite,$valitem)){
                                $valitem[] = $valite;
                            }
                        }
                        else {
                            $valitem[] = $valite;
                        }
                    }
                }
            }
            $fechou = $layer->close();
        }
        $layer->close();
        return ($valitem);
    }
    function retornaValorShape($shape,$item,$numerico,$ignorararray){
        $v = trim($shape->values[$item]);
        $valor = "";
        if ($numerico) {
            if (is_numeric($v)) {
                if (count($ignorararray) == 0) {
                    $valor = $v;
                } else {
                    if (! in_array($v, $ignorararray)) {
                        $valor = $v;
                    } else {
                        $valor = false;
                    }
                }
            }
        } else {
            if (count($ignorararray) == 0) {
                $valor = $v;
            } else {
                if (! in_array($v, $ignorararray)) {
                    $valor = $v;
                } else {
                    $valor = false;
                }
            }
        }
        return $valor;
    }
    /*
     * Function: converteTexto
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
    function converteTexto($texto)
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