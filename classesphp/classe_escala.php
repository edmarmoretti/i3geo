<?php

/*
 * Title: classe_escala.php
 *
 * Manipula&ccedil;&atilde;o da escala.
 *
 * Cria escala grafica, edita caracter&iacute;sticas, etc.
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
 * i3geo/classesphp/classe_escala.php
 */
/*
 * Classe: Escala
 */
class Escala
{

    /*
     * Variavel: $mapa
     *
     * Objeto mapa
     */
    protected $mapa;

    /*
     * Variavel: $arquivo
     *
     * Arquivo map file
     */
    protected $arquivo;

    /*
     * Variavel: $nomeImagem
     *
     * Nome da imagem criada
     */
    protected $nomeImagem;

    /*
     * function: __construct
     *
     * Cria um objeto Escala
     *
     * parameters:
     * $map_file - Endere&ccedil;o do mapfile no servidor.
     */
    function __construct($map_file, $nomeImagem = "", $locaplic = "", $mapexten = "")
    {
        include (dirname(__FILE__) . "/../ms_configura.php");
        $this->postgis_mapa = $postgis_mapa;

        if (file_exists($locaplic . "/funcoes_gerais.php"))
            include_once ($locaplic . "/funcoes_gerais.php");
        else
            include_once ("funcoes_gerais.php");

        $this->locaplic = $locaplic;
        $this->mapa = ms_newMapObj($map_file);
        substituiConObj($this->mapa, $postgis_mapa);
        $this->arquivo = str_replace(".map", "", $map_file) . ".map";
        if ($nomeImagem == "") {
            $this->nomeImagem = nomeRandomico();
        }
        if ($mapexten != "") {
            $ext = explode(" ", $mapexten);
            $extatual = $this->mapa->extent;
            $extatual->setextent($ext[0], $ext[1], $ext[2], $ext[3]);
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
     * function: retornaBarraEscala
     *
     * Gera barra de escala.
     *
     * Retorna uma string com sintaxe em javaScript com o nome da imagem e demais par&acirc;metros.
     *
     * return:
     * string com vari&aacute;veis javascript.
     */
    function retornaBarraEscala()
    {
        $this->mapa->preparequery();
        $objImagem = $this->mapa->drawscalebar();
        if ($objImagem->imagepath == "") {
            echo "Erro IMAGEPATH vazio";
            exit();
        }
        $nomer = ($objImagem->imagepath) . "sca" . $this->nomeImagem . ".png";
        $objImagem->saveImage($nomer);
        $nomer = ($objImagem->imageurl) . basename($nomer);
        return (array(
            "scaimagem" => $nomer,
            "scawidth" => $objImagem->width,
            "scaheight" => $objImagem->height,
            "scapath" => $objImagem->imagepath,
            "scaurl" => $objImagem->imageurl
        ));
    }

    /*
     * function: parametrosBarraEscala
     *
     * Pega os par&acirc;metros da barra de escala.
     *
     * return:
     * string javascript com os parametros.
     */
    function parametrosBarraEscala()
    {
        $eb = $this->mapa->scalebar;
        $cor = $eb->color;
        $fcor = $cor->red . "," . $cor->green . "," . $cor->blue;
        $cor = $eb->backgroundcolor;
        $bcor = $cor->red . "," . $cor->green . "," . $cor->blue;
        $cor = $eb->outlinecolor;
        $ocor = $cor->red . "," . $cor->green . "," . $cor->blue;
        return (array(
            "color" => $fcor,
            "backgroundcolor" => $bcor,
            "outlinecolor" => $ocor,
            "status" => $eb->status,
            "width" => $eb->width,
            "height" => $eb->height,
            "style" => $eb->style,
            "intervals" => $eb->intervals,
            "units" => $eb->units
        ));
    }

    /*
     * array("color"=>"","backgroundcolor"=>"","outlinecolor"=>"","status"=>"","width"=>"","height"=>"","style"=>"","intervals"=>"","units"=>"")
     */
    function mudaEscalaGrafica($parameters = array("color"=>"","backgroundcolor"=>"","outlinecolor"=>"","status"=>"","width"=>"","height"=>"","style"=>"","intervals"=>"","units"=>""))
    {
        $eb = $this->mapa->scalebar;
        $eb->set("width", $parameters["width"]);
        $eb->set("height", $parameters["height"]);
        if ($parameters["style"] != 2) {
            $eb->set("style", $parameters["style"]);
        }
        $eb->set("intervals", $parameters["intervals"]);
        $eb->set("units", $parameters["units"]);
        $corn = $eb->color;
        $n = explode(",", $parameters["color"]);
        $corn->setrgb($n[0], $n[1], $n[2]);
        $cornb = $eb->backgroundcolor;
        $n = explode(",", $parameters["backgroundcolor"]);
        $cornb->setrgb($n[0], $n[1], $n[2]);
        $corno = $eb->outlinecolor;
        $n = explode(",", $parameters["outlinecolor"]);
        $corno->setrgb($n[0], $n[1], $n[2]);
        // desabilita a escala
        if ($parameters["style"] == 2) {
            $eb->set("status", MS_OFF);
        } else {
            $eb->set("status", MS_EMBED);
        }
        if ($parameters["status"] == 3) {
            $eb->set("status", MS_EMBED);
        } // MS_ON, MS_OFF, MS_EMBED
        else {
            $eb->set("status", MS_OFF);
        }
        $this->salva();
        return ("ok");
    }

    /*
     * array("color"=>"","backgroundcolor"=>"","outlinecolor"=>"","status"=>"","width"=>"","height"=>"","style"=>"","intervals"=>"","units"=>"")
     */
    function testaescalagrafica($parameters = array("color"=>"","backgroundcolor"=>"","outlinecolor"=>"","status"=>"","width"=>"","height"=>"","style"=>"","intervals"=>"","units"=>""))
    {
        $eb = $this->mapa->scalebar;
        $eb->set("width", $parameters["width"]);
        $eb->set("height", $parameters["height"]);
        if ($parameters["style"] != 2) {
            $eb->set("style", $parameters["style"]);
        }
        $eb->set("intervals", $parameters["intervals"]);
        $eb->set("units", $parameters["units"]);
        $corn = $eb->color;
        $n = explode(",", $parameters["color"]);
        $corn->setrgb($n[0], $n[1], $n[2]);
        $cornb = $eb->backgroundcolor;
        $n = explode(",", $parameters["backgroundcolor"]);
        $cornb->setrgb($n[0], $n[1], $n[2]);
        $corno = $eb->outlinecolor;
        $n = explode(",", $parameters["outlinecolor"]);
        $corno->setrgb($n[0], $n[1], $n[2]);
        // desabilita a escala
        if ($parameters["style"] == 2) {
            $eb->set("status", MS_OFF);
        } else {
            $eb->set("status", MS_EMBED);
        }
        if ($parameters["status"] == 3) {
            $eb->set("status", MS_EMBED);
        } // MS_ON, MS_OFF, MS_EMBED
        else {
            $eb->set("status", MS_OFF);
        }
        $objImagem = $this->mapa->drawscalebar();
        $nomer = ($objImagem->imagepath) . "sca" . $this->nomeImagem . ".png";
        $objImagem->saveImage($nomer);
        $nomer = ($objImagem->imageurl) . basename($nomer);
        return ($nomer);
    }
}
?>