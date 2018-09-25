<?php

/*
 * Title: classe_toponimia.php
 *
 * Processa a topon&iacute;mia de um tema.
 *
 * Adiciona, remove, altera, etc.
 *
 * Cria camadas com a topon&iacute;mia e gerencia o status das etiquetas mostradas no mapa.
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
 * i3geo/classesphp/classe_toponimia.php
 */
/*
 * Classe: Toponimia
 */
class Toponimia
{

    /*
     * Variavel: $mapa
     *
     * Objeto mapa
     */
    protected $mapa;

    /*
     * Variavel: $map_file
     *
     * Arquivo map file
     */
    protected $map_file;

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
     * Variavel: $v
     *
     * Vers&atilde;o atual do Mapserver (primeiro d&iacute;gito)
     */
    public $v;

    /*
     * Variavel: $vi
     *
     * Vers&atilde;o atual do Mapserver (valor inteiro)
     *
     * Returns the MapServer version number (x.y.z) as an integer (x*10000 + y*100 + z). (New in v5.0) e.g. V5.4.3 would return 50403
     */
    public $vi;

    /*
     * function __construct
     *
     * Cria um objeto map e seta a variavel tema
     *
     * parameters:
     * $map_file - Endere&ccedil;o do mapfile no servidor.
     *
     * $tema - nome do tema que ser&aacute; processado
     */
    function __construct($map_file, $tema = "", $locaplic = "")
    {
        include (dirname(__FILE__) . "/../ms_configura.php");
        $this->postgis_mapa = $postgis_mapa;

        if (file_exists($locaplic . "/funcoes_gerais.php"))
            include_once ($locaplic . "/funcoes_gerais.php");
        else
            include_once ("funcoes_gerais.php");

        $this->v = versao();
        $this->vi = $this->v["inteiro"];
        $this->v = $this->v["principal"];

        $this->mapa = ms_newMapObj($map_file);
        substituiConObj($this->mapa, $postgis_mapa);

        $this->arquivo = str_replace(".map", "", $map_file) . ".map";
        if ($tema != "" && @$this->mapa->getlayerbyname($tema))
            $this->layer = $this->mapa->getlayerbyname($tema);
        $this->nome = $tema;
    }

    /*
     * function: salva
     *
     * Salva o mapfile atual
     */
    function salva()
    {
        restauraConObj($this->mapa, $this->postgis_mapa);
        $this->mapa->save($this->arquivo);
    }

    /*
     * function: criaToponimia
     *
     * Cria a topon&iacute;mia de um tema
     *
     * parameter:
     *
     * $item Item que ser&aacute; utilizado.
     *
     * $position Posi&ccedil;&atilde;o da &acirc;ncora do texto.
     *
     * $partials Corta texto nas bordas do mapa.
     *
     * $offsetx Deslocamento em X.
     *
     * $offsety Deslocamento em Y.
     *
     * $minfeaturesize Tamanho m&iacute;nimo que o texto deve ter.
     *
     * $mindistance Dist&acirc;ncia m&iacute;nima entre os textos.
     *
     * $force For&ccedil;a colis&atilde;o.
     *
     * $shadowcolor Cor da sombra.
     *
     * $shadowsizex Tamanho em X da sombra.
     *
     * $shadowsizey Tamanho em Y da sombra.
     *
     * $outlinecolor Cor do contorno.
     *
     * $cor Cor do texto.
     *
     * $sombray Deslocamento Y da sombra.
     *
     * $sombrax Deslocamento X da sombra.
     *
     * $sombra string Inclui sombra.
     *
     * $fundo Cor do fundo.
     *
     * $angulo &Acirc;ngulo do texto.
     *
     * $tamanho Tamanho do texto.
     *
     * $fonte Fonte.
     *
     * $tipo Tipo teste|
     *
     * $wrap
     *
     * $novotema sim|nao Cria um novo tema ou n&atilde;o, nesse &uacute;ltimo caso, a topon&iacute;mia &eacute; inserida em todas as classes
     *
     * Retorno:
     *
     * {string} - codigo do layer criado
     */
    function criaToponimia($item, $position, $partials, $offsetx, $offsety, $minfeaturesize, $mindistance, $force, $shadowcolor, $shadowsizex, $shadowsizey, $outlinecolor, $cor, $sombray, $sombrax, $sombra, $fundo, $angulo, $tamanho, $fonte, $tipo, $wrap, $novotema = "sim")
    {
        // error_reporting(0);
        if (! $this->layer) {
            return false;
        }
        $this->removeToponimia();

        if (! isset($tipo)) {
            $tipo = "";
        }
        if ($item != "") // o layer nao tem tabela mas tem toponimia
{
            if ($novotema == "sim") {
                $nome = pegaNome($this->layer);
                $novolayer = ms_newLayerObj($this->mapa, $this->layer);
                $nomer = nomeRandomico();
                $novolayer->set("name", $nomer);
                $novolayer->set("group", "");
                $novolayer->set("type", $this->layer->type);
                $nclasses = $novolayer->numclasses;
                for ($i = 0; $i < $nclasses; ++ $i) {
                    $c = $novolayer->getclass($i);
                    $c->set("status", MS_DELETE);
                }
                $novac = ms_newClassObj($novolayer);
                $novolayer->set("status", MS_DEFAULT);
                $novolayer->setmetadata("tema", "texto de " . $nome);
                $novolayer->setmetadata("tip", "");
                $novolayer->setmetadata("tiles", "nao");
                $novolayer->setmetadata("identifica", "nao");
                $novolayer->set("labelitem", $item);
            } else {
                $nomer = $this->layer->name;
                $novolayer = $this->mapa->getlayerbyname($nomer);
            }
            $novolayer->setmetadata("cache", "");
            $this->layer = $novolayer;
        } else {
            $nomer = $this->layer->name;
        }
        if (! ($this->vi >= 60200)) {
            $this->layer->set("labelitem", $item);
        }
        $nclasses = $this->layer->numclasses;
        for ($i = 0; $i < $nclasses; ++ $i) {
            $novac = $this->layer->getclass($i);
            if ($this->vi >= 60200) {
                $s = "CLASS LABEL TEXT '[" . $item . "]' END END";
                $novac->updateFromString($s);
                $label = $novac->getLabel($indiceLabel);
            } else {
                $label = $novac->label;
            }
            if ($wrap != "") {
                $label->set("maxlength", 1);
                $s = $novac->getTextString;
                $s = "CLASS LABEL WRAP '$wrap' END END";
                $novac->updateFromString($s);
            }
            if ($this->vi >= 60200) {
                $label = $novac->getLabel($indiceLabel);
            } else {
                $label = $novac->label;
            }
            if ($fonte != "bitmap") {
                // $label->set("type",MS_TRUETYPE);
                $label->updatefromstring("LABEL TYPE TRUETYPE END");
                $label->set("font", $fonte);
                $label->set("size", $tamanho);
            } else {
                // $label->set("type",MS_BITMAP);
                $label->updatefromstring("LABEL TYPE BITMAP END");
                // $label->set("font",$fonte);
                $t = MS_TINY;
                if ($tamanho > 5) {
                    $t = MS_TINY;
                }
                if ($tamanho >= 7) {
                    $t = MS_SMALL;
                }
                if ($tamanho >= 10) {
                    $t = MS_MEDIUM;
                }
                if ($tamanho >= 12) {
                    $t = MS_LARGE;
                }
                if ($tamanho >= 14) {
                    $t = MS_GIANT;
                }
                $label->set("size", $t);
            }
            if ($angulo > 0) {
                $label->set("angle", $angulo);
            }
            if ($angulo == "AUTO") {
                $label->updatefromstring("LABEL ANGLE AUTO END");
            }
            if (strtoupper($angulo) == "CURVO" || strtoupper($angulo) == "FOLLOW") {
                $label->updatefromstring("LABEL ANGLE FOLLOW END");
            }
            corE($label, $cor, "color");
            corE($label, $fundo, "backgroundcolor");
            corE($label, $sombra, "backgroundshadowcolor", $sombrax, $sombray);
            corE($label, $outlinecolor, "outlinecolor");
            corE($label, $shadowcolor, "shadowcolor");
            $label->set("shadowsizex", $shadowsizex);
            $label->set("shadowsizey", $shadowsizey);
            $label->set("force", $force);
            $label->set("mindistance", $mindistance);
            $label->set("minfeaturesize", $minfeaturesize);
            $label->set("offsetx", $offsetx);
            $label->set("offsety", $offsety);
            $label->set("partials", $partials);
            $p = array(
                "MS_AUTO" => MS_AUTO,
                "MS_UL" => MS_UL,
                "MS_LR" => MS_LR,
                "MS_UR" => MS_UR,
                "MS_LL" => MS_LL,
                "MS_CR" => MS_CR,
                "MS_CL" => MS_CL,
                "MS_UC" => MS_UC,
                "MS_LC" => MS_LC,
                "MS_CC" => MS_CC
            );
            $label->set("position", $p[$position]);
        }
        if ($tipo == "teste") {
            $this->layer->set("maxscaledenom", 0);
            $this->layer->set("minscaledenom", 0);
            $i = gravaImagemMapa($this->mapa);
            return ($i["url"]);
        } else {
            return true;
        }
    }

    function removeToponimia()
    {
        $nclasses = $this->layer->numclasses;
        if ($this->vi >= 60200) {
            for ($i = 0; $i < $nclasses; ++ $i) {
                $classe = $this->layer->getclass($i);
                while ($classe->numlabels > 0) {
                    $classe->removeLabel(0);
                }
            }
        }
        if ($this->layer) {
            $this->layer->setMetaData("cache", "");
        }
        return true;
    }

    /*
     * function: ativaEtiquetas
     *
     * ativa a inclus&atilde;o de etiquetas em um tema
     *
     * parameter:
     * $item Lista de Itens separados por v&iacute;rgula que ser&atilde;o utilizados.
     */
    function ativaEtiquetas($item)
    {
        if (! $this->layer) {
            return "erro";
        }
        $this->layer->setmetadata("IDENTIFICA", "");
        $this->layer->setmetadata("TIP", $item);
        return ("ok");
    }

    /*
     * function: pegaDadosEtiquetas
     *
     * ativa a inclus&atilde;o de etiquetas em um tema
     *
     * parameter:
     * $item Lista de Itens separados por v&iacute;rgula que ser&atilde;o utilizados.
     */
    function pegaDadosEtiquetas()
    {
        if (! $this->layer) {
            return "erro";
        }
        $itens = $this->layer->getmetadata("ITENS");
        $itens = explode(",", $itens);
        $itensdesc = mb_convert_encoding($this->layer->getmetadata("ITENSDESC"), "UTF-8", "ISO-8859-1");
        $itensdesc = explode(",", $itensdesc);
        $itenslink = $this->layer->getmetadata("ITENSLINK");
        $itenslink = explode(",", $itenslink);

        $tips = $this->layer->getmetadata("TIP");

        $res = array(
            "itens" => $itens,
            "itensdesc" => array_combine($itens, $itensdesc),
            "itenslink" => array_combine($itens, $itenslink),
            "tips" => explode(",", $tips),
            "itembuscarapida" => $this->layer->getmetadata("itembuscarapida"),
            "utfdata" => $this->layer->getmetadata("UTFDATA")
        );
        return ($res);
    }

    /*
     * function: removeEtiquetas
     *
     * remove a inclus&atilde;o de etiquetas em um tema.
     *
     */
    function removeEtiquetas()
    {
        if (! $this->layer) {
            return "erro";
        }
        $this->layer->setmetadata("TIP", "");
        $this->layer->setmetadata("UTFDATA", "");
        return ("ok");
    }
}
?>
