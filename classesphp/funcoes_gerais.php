<?php

/*
 * Title: funcoes_gerais.php
 *
 * Cont&eacute;m um conjunto de fun&ccedil;&otilde;es que s&atilde;o compartilhadas por outros programas PHP utilizados pelo i3Geo.
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
 * i3geo/classesphp/funcoes_gerais.php
 */
/*
 * Section: cor
 */
/*
 * Function: corRGB
 *
 * Obt&eacute;m os valores em RGB de um objeto cor do Mapscript.
 *
 * Parametro:
 *
 * $cor {objeto} - objeto cor do mapscript.
 *
 * Retorno:
 *
 * {string} - Cor em RGB separados por v&iacute;rgula.
 */
function corRGB($cor)
{
    $r = $cor->red;
    $g = $cor->green;
    $b = $cor->blue;
    return ($r . "," . $g . "," . $b);
}

/*
 * Function: corE
 *
 * Aplica uma cor a um elemento de um objeto label de um layer.
 *
 * Parametro:
 *
 * $label {objeto} - Objeto do tipo label.
 *
 * $cor {string} - RGB separado por espacos, se for um array, aplica diretamente ao objeto cor.
 *
 * $elemento {string} - Nome do elemento que receber&aacute; a cor.
 *
 * $sombrax { n pixels) - utilizado apena quando se define a cor da sombra de labels
 *
 * $sombray { n pixels) - utilizado apena quando se define a cor da sombra de labels
 */
function corE($label, $cor, $elemento, $sombrax = 1, $sombray = 1)
{
    $versao = versao();
    $versao = $versao["principal"];
    if (is_string($cor)) {
        $cor = str_replace(",", " ", $cor);
        if (count(explode(" ", $cor)) == 3) {
            if ($versao > 5 && in_array(strtolower($elemento), array(
                "backgroundcolor",
                "backgroundshadowcolor"
            ))) {
                // na 601 n&atilde;o funciona
                return;
                $e = new styleObj($label);
                $e->setGeomTransform("labelpoly");
                $corres = $e->color;
                if (strtolower($elemento) == "backgroundshadowcolor") {
                    $e->set("offsetx", $sombrax);
                    $e->set("offsety", $sombray);
                }
            } else {
                $corres = $label->$elemento;
            }
            $cori = explode(" ", $cor);
            $corres->setRGB($cori[0], $cori[1], $cori[2]);
        }
    } else {
        $corres->setRGB($cor->red, $cor->green, $cor->blue);
    }
}

/*
 * Function: colorHex
 *
 * Aloca uma cor a um objeto imagem (GD).
 *
 * A origem &eacute; uma cor definida em hexadecimal.
 *
 * Parametro:
 *
 * $img {objeto} - objeto imagem
 *
 * $HexColorString {string} - cor hexadecimal
 */
function colorHex($img, $HexColorString)
{
    $R = hexdec(substr($HexColorString, 0, 2));
    $G = hexdec(substr($HexColorString, 2, 2));
    $B = hexdec(substr($HexColorString, 4, 2));
    return ImageColorAllocate($img, $R, $G, $B);
}

/*
 * Function: colorRGB
 *
 * Aloca uma cor a um objeto imagem (GD).
 *
 * A origem &eacute; uma cor definida em rgb.
 *
 * Parametros:
 *
 * $img {objeto} - objeto imagem
 *
 * $ColorString {string} - cor r,g,b
 */
function colorRGB($img, $ColorString)
{
    $cor = explode(",", $ColorString);
    $R = $cor[0];
    $G = $cor[1];
    $B = $cor[2];
    return ImageColorAllocate($img, $R, $G, $B);
}

/*
 * Function: colorRGBshadow
 *
 * Aloca uma cor de sombra a um objeto imagem (GD).
 *
 * A origem &eacute; uma cor definida em rgb.
 *
 * Parametros:
 *
 * $img {objeto} - objeto imagem
 *
 * $ColorString {string} - cor r,g,b
 */
function colorRGBshadow($img, $ColorString, $mork)
{
    $cor = explode(",", $ColorString);
    $R = $cor[0];
    $G = $cor[1];
    $B = $cor[2];
    if ($mork) {
        ($R > 99) ? $R -= 100 : $R = 0;
        ($G > 99) ? $G -= 100 : $G = 0;
        ($B > 99) ? $B -= 100 : $B = 0;
    } else {
        ($R < 220) ? $R += 35 : $R = 255;
        ($G < 220) ? $G += 35 : $G = 255;
        ($B < 220) ? $B += 35 : $B = 255;
    }
    return ImageColorAllocate($img, $R, $G, $B);
}

/*
 * Function: colorHexshadow
 *
 * Aloca uma cor de sombra a um objeto imagem (GD).
 *
 * A origem &eacute; uma cor definida em hexadecimal.
 *
 * Parametros:
 *
 * $img {objeto} - objeto imagem
 *
 * $ColorString {string} - cor hexadecimal
 */
function colorHexshadow($img, $HexColorString, $mork)
{
    $R = hexdec(substr($HexColorString, 0, 2));
    $G = hexdec(substr($HexColorString, 2, 2));
    $B = hexdec(substr($HexColorString, 4, 2));
    if ($mork) {
        ($R > 99) ? $R -= 100 : $R = 0;
        ($G > 99) ? $G -= 100 : $G = 0;
        ($B > 99) ? $B -= 100 : $B = 0;
    } else {
        ($R < 220) ? $R += 35 : $R = 255;
        ($G < 220) ? $G += 35 : $G = 255;
        ($B < 220) ? $B += 35 : $B = 255;
    }
    return ImageColorAllocate($img, $R, $G, $B);
}

/*
 * Function: RGB2hex
 *
 * Converte uma cor rgb em hex.
 *
 * Parametro:
 *
 * $rgb {string} - cor RGB
 *
 * Retorno:
 *
 * {string}
 */
function RGB2hex($rgb)
{
    $r = str_pad(dechex($rgb[0]), 2, '0', STR_PAD_LEFT);
    $g = str_pad(dechex($rgb[1]), 2, '0', STR_PAD_LEFT);
    $b = str_pad(dechex($rgb[2]), 2, '0', STR_PAD_LEFT);
    return ($r . $g . $b);
}

/*
 * Section: arquivos
 */
/*
 * Function: nomeRandomico
 *
 * Gera um nome rand&ocirc;mico.
 *
 * Parametro:
 *
 * $n {numeric} - N&uacute;mero de d&iacute;gitos.
 *
 * Retorno:
 *
 * {string}
 */
function nomeRandomico($n = 10)
{
    $nomes = "";
    $a = 'azertyuiopqsdfghjklmwxcvbnABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $max = 51;
    for ($i = 0; $i < $n; ++ $i) {
        $nomes .= $a{mt_rand(0, $max)};
    }
    return $nomes;
}

/*
 * Function: listaEpsg
 *
 * L&ecirc; o arquivo com os c�digos de proje&ccedil;&atilde;o epsg e retorna um array com os dados.
 *
 * O arquivo lido &eacute; "../ferramentas/epsg.txt"
 *
 * Retorno:
 *
 * {start code}
 * array(
 * array(
 * "codigo"=>,
 * "nome"=>,
 * "def"=>
 * )
 * )
 * {end}
 */
function listaEpsg()
{
    $abre = fopen("../ferramentas/epsg.txt", "r");
    while (! feof($abre)) {
        $buffer = fgets($abre);
        $linhas[] = $buffer;
    }
    fclose($abre);
    $cl = count($linhas);
    for ($i = 0; $i < $cl; $i = $i + 2) {
        $n = $linhas[$i];
        $n = str_replace("#", "", $n);
        $n = str_replace("\n", "", $n);
        $d = $linhas[$i + 1];
        $d = str_replace("\n", "", $d);
        $temp = explode(">", $d);
        $d = $temp[1];
        $c = $temp[0];
        $d = str_replace("<", "", $d);
        $c = str_replace("<", "", $c);
        $n = mb_convert_encoding($n, "UTF-8", "ISO-8859-1");
        $lista[] = array(
            "codigo" => $c,
            "nome" => $n,
            "def" => $d
        );
    }
    return $lista;
}

/*
 * Function: copiaSeguranca
 *
 * Cria c�pia de seguran&ccedil;a do map_file.
 *
 * Salva o mapfile atual incluindo no nome, a string "seguranca".
 *
 * Parametro:
 *
 * $map_file {string} - Arquivo map file.
 *
 */
function copiaSeguranca($map_file)
{
    include (dirname(__FILE__) . "/../ms_configura.php");
    restauraCon($map_file, $postgis_mapa);
    if (file_exists($map_file)) {
        if ($objMapa = @ms_newMapObj($map_file)) {
            $nmf = str_replace(".map", "seguranca.map", $map_file);
            $objMapa->save($nmf);
        } else {
            $nmf = str_replace(".map", "seguranca.map", $map_file);
            if (file_exists($nmf)) {
                if ($objMapa = @ms_newMapObj($nmf)) {
                    $objMapa->save($map_file);
                }
            } else {
                $nmf = str_replace(".map", "reinc.map", $map_file);
                if ($objMapa = @ms_newMapObj($nmf)) {
                    $objMapa->save($nmf);
                }
            }
        }
    } else {
        $map_file = str_replace(".map", "", $map_file) . ".map";
        copy((str_replace(".map", "seguranca.map", $map_file)), $map_file);
    }
}

/*
 * Function: listaDiretorios
 *
 * Retorna lista de diret&oacute;rios.
 *
 * parameters:
 *
 * $diretorio {string} - Raiz onde ser&aacute; feita a busca.
 *
 * Retorno:
 *
 * {array}
 */
function listaDiretorios($diretorio)
{
    if (is_dir($diretorio)) {
        $dirs = array();
        $d = dir($diretorio);
        while (($nd = $d->read()) != FALSE) {
            if ($nd != "." && $nd != "..") {
                $ext = explode(".", $nd);
                if (count($ext) == 1)
                    $dirs[] = $nd;
            }
        }
        return $dirs;
    } else {
        return "erro";
    }
}

/*
 * Function: listaArquivos
 *
 * Retorna lista de arquivos.
 *
 * Parametro:
 *
 * $diretorio {string} - Raiz onde ser&aacute; feita a busca.
 *
 * $seguro - {boolean} lista apenas arquivos de dados geograficos e imagens
 *
 * Retorno:
 *
 * {array}
 */
function listaArquivos($diretorio, $seguro = false, $permitido = array("png","PNG","jpg","JPG","tif","tiff","TIF","TIFF","shp","SHP","img"))
{
    $docroot = $_SERVER["DOCUMENT_ROOT"];
    if (! is_dir($diretorio)) {
        $diretorio = "../" . $diretorio;
    }
    if (is_dir($diretorio)) {
        $dirs = array();
        $arqs = array();
        $nomes = array();
        $urls = array();
        $exts = array();
        $d = dir($diretorio);
        while (($nd = $d->read()) != FALSE) {
            if ($nd != "." && $nd != "..") {
                $ext = explode(".", $nd);
                if (count($ext) == 2) {
                    if ($seguro == true) {
                        $buscar = $ext[1];
                        $permitido = array(
                            "tif",
                            "tiff",
                            "TIF",
                            "TIFF",
                            "shp",
                            "SHP",
                            "img"
                        );
                        if (in_array($buscar, $permitido)) {
                            $arqs[] = $nd;
                            $nomes[] = basename($nd);
                            $exts[] = $ext[1];
                            $url = "";

                            if (strpos($diretorio, $docroot) === true || strpos($diretorio, $docroot) === 0) {
                                $url = str_replace($docroot, "", $diretorio . "/" . $nd);
                            }
                            $urls[] = $url;
                        }
                    } else {
                        $arqs[] = $nd;
                        $nomes[] = basename($nd);
                        $urls = "";
                        $exts[] = $ext[1];
                    }
                }
                if (count($ext) == 1 && is_dir($diretorio . "/" . $nd)) {
                    $dirs[] = $nd;
                }
            }
        }
        sort($dirs);
        return array(
            "diretorios" => $dirs,
            "arquivos" => $arqs,
            "nomes" => $nomes,
            "urls" => $urls,
            "extensoes" => $exts
        );
    } else {
        return "erro";
    }
}

/*
 * Function: echoimg
 *
 * Envia para o navegador uma imagem. Utilizado na tag IMG em arquivos HTML
 */
function echoimg($arquivo, $tipo)
{
    echo header("Content-type: image/png \n\n");
    header('Content-Length: ' . filesize($arquivo));
    readfile(str_replace(".png", "", $arquivo) . ".png");
    exit();
}

/*
 * Function: gravaDados
 *
 * Grava as linhas de um array em um arquivo.
 *
 * Parametros:
 *
 * $dados {array} - Dados que ser&atilde;o gravados.
 *
 * $arq {string} - Nome do arquivo que ser&aacute; gravado
 */
function gravaDados($dados, $arq)
{
    $fp = fopen($arq, "w");
    if ($fp != false) {
        foreach ($dados as $dado) {
            fwrite($fp, $dado . "\n");
        }
        fclose($fp);
    }
}

/*
 * Function: listaTrueType
 *
 * Lista as fontes true type.
 *
 * L&ecirc; o arquivo fontes.txt existente no diret&oacute;rio symbols da instala&ccedil;&atilde;o do I3Geo.
 * O resultado &eacute; gravado em um arquivo tempor&aacute;rio para include, o que torna mais r&aacute;pida a carga futura.
 * O arquivo para include armazena a vari&aacute;vel res que cont&eacute;m a lista de fontes separadas por v&iacute;rgula.
 *
 * Parametros:
 *
 * $cp {CAPAINT} - Objeto CPAINT.
 *
 * $locaplic {string} - Localiza&ccedil;&atilde;o da aplica&ccedil;&atilde;o no servidor.
 *
 * $imgdir {string} - Diret&oacute;rio das imagens.
 *
 * $dir_tmp {string} - Diret&oacute;rio tempor&aacute;rio.
 *
 * Retorno:
 *
 * {string}
 */
function listaTrueType()
{
    global $locaplic, $imgdir, $dir_tmp;
    if (! file_exists($dir_tmp . "/comum/truetype.inc")) {
        $arq = $locaplic . "/symbols/fontes.txt";
        $h = fopen($arq, "r");
        while ($i = fscanf($h, "%s\t%s\t")) {
            list ($f, $g) = $i;
            $nome[] = $f;
        }
        $res = implode(",", $nome);
        $f = fopen($dir_tmp . "/" . $imgdir . "/truetype.inc", 'w');
        fwrite($f, "<?php \$res = '" . $res . "';?>");
        fclose($f);
        copy($dir_tmp . "/" . $imgdir . "/truetype.inc", $dir_tmp . "/comum/truetype.inc");
    } else {
        include ($dir_tmp . "/comum/truetype.inc");
    }
    return ($res);
}

/*
 * Section: mapa
 */
/*
 * Function: substituiCon
 *
 * Substitu&iacute; a string de conex&atilde;o com o banco postgis pela string definida na inicializa&ccedil;&atilde;o (ms_configura.php)
 *
 * Parametros:
 *
 * $map_file {string} - arquivo mapfile
 *
 * $postgis_mapa {array} - lista de strings de conex&atilde;o com o banco
 *
 * Retorno:
 *
 * {boleano}
 */
function substituiCon($map_file, $postgis_mapa)
{
    // error_reporting(0);
    return;
    if (! empty($postgis_mapa) && (file_exists($map_file))) {
        if (! @ms_newMapObj($map_file)) {
            return false;
        }
        $objMap = ms_newMapObj($map_file);
        $numlayers = $objMap->numlayers;
        for ($i = 0; $i < $numlayers; ++ $i) {
            $layer = $objMap->getlayer($i);
            if ($layer->connectiontype == MS_POSTGIS) {
                $lcon = $layer->connection;
                if (($lcon == " ") || ($lcon == "") || (in_array($lcon, array_keys($postgis_mapa)))) {
                    //
                    // o metadata CONEXAOORIGINAL guarda o valor original para posterior substitui&ccedil;&atilde;o
                    //
                    if (($lcon == " ") || ($lcon == "")) {
                        $layer->set("connection", $postgis_mapa);
                        $layer->setmetadata("CONEXAOORIGINAL", $lcon);
                    } else {
                        $layer->set("connection", $postgis_mapa[$lcon]);
                        $layer->setmetadata("CONEXAOORIGINAL", $lcon);
                    }
                }
            }
        }
        $objMap->save($map_file);
    }
    return true;
}

function substituiConObj($objMap, $postgis_mapa)
{
    // error_reporting(0);
    if (! empty($postgis_mapa) && is_object($objMap) == true) {
        $numlayers = $objMap->numlayers;
        for ($i = 0; $i < $numlayers; ++ $i) {
            $layer = $objMap->getlayer($i);
            if ($layer->connectiontype == MS_POSTGIS) {
                $lcon = $layer->connection;
                if (($lcon == " ") || ($lcon == "") || (in_array($lcon, array_keys($postgis_mapa)))) {
                    //
                    // o metadata CONEXAOORIGINAL guarda o valor original para posterior substitui&ccedil;&atilde;o
                    //
                    if (($lcon == " ") || ($lcon == "")) {
                        $layer->set("connection", $postgis_mapa);
                        $layer->setmetadata("CONEXAOORIGINAL", $lcon);
                    } else {
                        $layer->set("connection", $postgis_mapa[$lcon]);
                        $layer->setmetadata("CONEXAOORIGINAL", $lcon);
                    }
                }
            }
        }
    }
}

/*
 * Function: restauraCon
 *
 * Esconde a string de conex&atilde;o com o banco, caso necess&aacute;rio
 *
 * Parametros:
 *
 * $map_file {string} - arquivo mapfile
 *
 * $postgis_mapa {string} - lista de conex&atilde;o com o banco
 */
function restauraCon($map_file, $postgis_mapa)
{
    if (! @ms_newMapObj($map_file)) {
        return;
    }
    if (! empty($postgis_mapa)) {
        $objMap = ms_newMapObj($map_file);
        $numlayers = $objMap->numlayers;
        for ($i = 0; $i < $numlayers; ++ $i) {
            $layer = $objMap->getlayer($i);
            if ($layer->connectiontype == MS_POSTGIS) {
                if (! is_array($postgis_mapa) && $layer->connection == $postgis_mapa) {
                    $layer->set("connection", " ");
                }
                if ($layer->getmetadata("conexaooriginal") != "") {
                    $layer->set("connection", $layer->getmetadata("conexaooriginal"));
                }
            }
        }
        $objMap->save($map_file);
    }
}
/*
 * Function: restauraConObj
 *
 * Esconde a string de conex&atilde;o com o banco, caso necess&aacute;rio
 *
 * Parametros:
 *
 * $map_file {string} - arquivo mapfile
 *
 * $postgis_mapa {string} - lista de conex&atilde;o com o banco
 */
function restauraConObj($objMap, $postgis_mapa)
{
    if (! empty($postgis_mapa)) {
        $numlayers = $objMap->numlayers;
        for ($i = 0; $i < $numlayers; ++ $i) {
            $layer = $objMap->getlayer($i);
            if ($layer->connectiontype == MS_POSTGIS) {
                if (! is_array($postgis_mapa) && $layer->connection == $postgis_mapa) {
                    $layer->set("connection", " ");
                }
                if ($layer->getmetadata("conexaooriginal") != "") {
                    $layer->set("connection", $layer->getmetadata("conexaooriginal"));
                }
            }
        }
    }
}

/*
 * Function: retornaReferencia
 *
 * Retorna uma string com as variaveis de um novo mapa de referencia.
 *
 * Globais:
 *
 * $nomeImagem {string} - Nome da imagem do corpo do mapa.
 *
 * $objMapa {objeto} - Objeto map.
 *
 * $utilizacgi {string} - indica se o mapserver CGI est&aacute; em uso
 *
 * $locmapserv {string} - localliza&ccedil;&atilde;o do mapserver CGI
 *
 * $map_file {string} - mapfile que ser&aacute; processado
 *
 * Parametros:
 *
 * $ext {string} - (opcional) extens&atilde;o geogr&aacute;fica do mapa
 *
 * Retorno:
 *
 * string contendo vari&aacute;veis no formato javascript
 */
function retornaReferencia($ext = "")
{
    global $nomeImagem, $objMapa, $utilizacgi, $locmapserv, $map_file;
    if ($ext && $ext != "") {
        $e = explode(" ", $ext);
        $extatual = $objMapa->extent;
        $extatual->setextent((min($e[0], $e[2])), (min($e[1], $e[3])), (max($e[0], $e[2])), (max($e[1], $e[3])));
    }
    //
    // pega a extensao original caso ela tenha sido registrada no modo dinamico
    //
    $original = $objMapa->getmetadata("referenciaextentoriginal");
    $ref = $objMapa->reference;
    $c = $ref->color;
    $c->setrgb(- 1, - 1, - 1);
    $c = $ref->outlinecolor;
    $c->setrgb(- 1, - 1, - 1);
    $em = $ref->extent;
    if ($original != "") {
        $original = explode(" ", $original);
        $em->set("minx", $original[0]);
        $em->set("miny", $original[1]);
        $em->set("maxx", $original[2]);
        $em->set("maxy", $original[3]);
        // $objMapa->setmetadata("referenciaextentoriginal","");
    }
    // $objMapa->save($map_file);
    $objMapa->preparequery();
    $objImagem = $objMapa->drawreferencemap();
    $nomer = ($objImagem->imagepath) . "ref" . $nomeImagem . ".png";
    $objImagem->saveImage($nomer);
    $nomer = ($objImagem->imageurl) . basename($nomer);
    $d = (abs($em->maxx - $em->minx)) / ($objImagem->width);
    $s = "g_celularef = " . $d . ";";
    $s .= "var extentref = '" . $em->minx . " " . $em->miny . " " . $em->maxx . " " . $em->maxy . "';";
    $s .= "var refimagem='" . $nomer . "';var refwidth=" . $objImagem->width . ";var refheight=" . $objImagem->height . ";var refpath='" . $objImagem->imagepath . "';var refurl='" . $objImagem->imageurl . "'";
    return ($s);
}

/*
 * Function: retornaReferenciaDinamica
 *
 * Retorna uma string com as variaveis de um novo mapa de referencia gerado de forma dinamica.
 *
 * O mapa de refer&ecirc;ncia &eacute; baseado no mapfile aplicmap/referenciadinamica.map ou no mapa atual
 *
 * Globais:
 *
 * $nomeImagem {string} - Nome da imagem do corpo do mapa.
 *
 * $objMapa {objeto} - Objeto map.
 *
 * $utilizacgi {string} - indica se o mapserver CGI est&aacute; em uso
 *
 * $locmapserv {string} - localliza&ccedil;&atilde;o do mapserver CGI
 *
 * $map_file {string} - mapfile que ser&aacute; processado
 *
 * $locaplic {string} - onde o i3geo est&aacute; instalado
 *
 * $zoom - fator de zoom
 *
 * $tipo - tipo de refer&ecirc;ncia dinamico|mapa
 *
 * $interface - interface do mapa atual openlayers|googlemaps|googleearth
 *
 * Parametros:
 *
 * $ext {string} - (opcional) extens&atilde;o geogr&aacute;fica do mapa
 *
 * $w {numeric} - (opcional) largura da imagem
 *
 * $h {numeric} - (opcional) altura da imagem
 *
 * Retorno:
 *
 * String contendo vari&aacute;veis no formato javascript
 */
function retornaReferenciaDinamica($ext = "", $w = "", $h = "", $zoom = -3, $tipo = "mapa")
{
    global $nomeImagem, $map_file, $utilizacgi, $locmapserv, $locaplic, $interface, $postgis_mapa;
    //
    // adiciona o tema com o web service com o mapa mundi
    //
    $objMapa = ms_newMapObj($map_file);
    substituiConObj($objMapa, $postgis_mapa);
    $i = $objMapa->getmetadata("interface");
    if ($i == "") {
        $i = $interface;
    }
    if ($i == "googlemaps") {
        $objMapa->setProjection(pegaProjecaoDefault("proj4"));
    }
    if ($ext && $ext != "") {
        $e = explode(" ", $ext);
        $extatual = $objMapa->extent;
        $extatual->setextent((min($e[0], $e[2])), (min($e[1], $e[3])), (max($e[0], $e[2])), (max($e[1], $e[3])));
    }
    $numlayers = $objMapa->numlayers;
    for ($i = 0; $i < $numlayers; ++ $i) {
        $layer = $objMapa->getlayer($i);
        if ($tipo != "mapa")
            $layer->set("status", MS_OFF);
    }
    $maptemp = ms_newMapObj($locaplic . "/aplicmap/referenciadinamica.map");
    $nomeLayerRef = "";
    if ($tipo != "mapa") {
        $layern = $maptemp->getlayerbyname("refdin");
        ms_newLayerObj($objMapa, $layern);
    }

    //$layern = $maptemp->getlayerbyname("refdinrect");
    //ms_newLayerObj($objMapa, $layern);

    $r = $objMapa->reference;
    if ($w == "") {
        $w = $r->width;
    }
    if ($h == "") {
        $h = $r->height;
    }
    $emt = $objMapa->extent;
    $em = ms_newRectObj();
    $em->set("minx", $emt->minx);
    $em->set("miny", $emt->miny);
    $em->set("maxx", $emt->maxx);
    $em->set("maxy", $emt->maxy);
    $objMapa->setsize($w, $h);
    $scalebar = $objMapa->scalebar;
    $scalebar->set("status", MS_OFF);
    $leg = $objMapa->legend;
    $leg->set("status", MS_OFF);
    $objMapa->preparequery();
    $pt = ms_newPointObj();
    $pt->setXY(($w / 2), ($h / 2));
    $objMapa->zoompoint($zoom, $pt, $w, $h, $objMapa->extent);
    $objImagem = $objMapa->draw();
    //$em->draw($objMapa, ($objMapa->getlayerbyname("refdinrect")), $objImagem, 0, "");
    $nomer = ($objImagem->imagepath) . "ref" . $nomeImagem . ".png";
    $objImagem->saveImage($nomer);
    $nomer = ($objImagem->imageurl) . basename($nomer);
    $s = "var refimagem='" . $nomer . "';var refwidth=" . $w . ";var refheight=" . $h . ";var refpath='" . $objImagem->imagepath . "';var refurl='" . $objImagem->imageurl . "'";
    $mapa = ms_newMapObj($map_file);
    if ($i == "googlemaps") {
        $mapa->setProjection(pegaProjecaoDefault("proj4"));
    }
    $ref = $mapa->reference;
    $r = $ref->extent;
    //
    // guarda a extensao original para quando o modo din&acirc;mico parar
    //
    $original = $mapa->getmetadata("referenciaextentoriginal");
    if ($original == "") {
        $original = $r->minx . " " . $r->miny . " " . $r->maxx . " " . $r->maxy;
        $mapa->setmetadata("referenciaextentoriginal", $original);
    }
    $s .= ";var extentref = '" . $emt->minx . " " . $emt->miny . " " . $emt->maxx . " " . $emt->maxy . "';";
    $d = (abs($emt->maxx - $emt->minx)) / ($w);
    $s .= "g_celularef = " . $d . ";";
    $emt = $objMapa->extent;
    $r->set("minx", $emt->minx);
    $r->set("miny", $emt->miny);
    $r->set("maxx", $emt->maxx);
    $r->set("maxy", $emt->maxy);
    // $mapa->save($map_file);
    return ($s);
}

/*
 * Function: testaMapa
 *
 * Testa se um mapa est&aacute; &iacute;ntegro.
 *
 * Se o mapfile apresentar problemas, a copia de seguran&ccedil;a &eacute; restaurada.
 *
 * Parametro:
 *
 * $map_file {string} - Arquivo map file.
 *
 * $postgis_mapa {array} - lista de strings de conex&atilde;o com o banco de dados definida em ms_configura.php
 *
 * Retorno:
 *
 * {string} - erro|ok
 */
function testaMapa($map_file, $postgis_mapa)
{
    substituiCon($map_file, $postgis_mapa);
    $objMapa = ms_newMapObj($map_file);
    substituiConObj($objMapa, $postgis_mapa);
    ms_ResetErrorList();
    $img = $objMapa->draw();
    $erros = "";
    $error = ms_GetErrorObj();
    while ($error && $error->code != MS_NOERR) {
        $erros .= $error->routine;
        $error = $error->next();
    }
    $error = ms_GetErrorObj();
    if ($error->code != MS_NOERR) {
        $nmf = str_replace(".map", "seguranca.map", $map_file);
        $objMapa = ms_newMapObj($nmf);
        $objMapa->save($map_file);
        $erros = str_replace("\n", "", $erros);
        $erros = str_replace("\"", "", $erros);
        $erros = str_replace("'", "", $erros);
        $erros = str_replace(":", " ", $erros);
        $erros = str_replace("...", " ", $erros);
        $erros = str_replace("(", " ", $erros);
        $erros = str_replace(")", " ", $erros);
        $erros = str_replace("*", " ", $erros);
        $erros = str_replace("/", " ", $erros);
        $erros = htmlentities($erros);
        return $erros;
    } else {
        return "ok";
    }
}

/*
 * Function: desligamargem
 *
 * Desliga o mapa de refer&ecirc;ncia e a barra de escala de um mapa.
 *
 * Parametro:
 *
 * $objmapa {objeto} - Objeto map.
 *
 * Retorno:
 *
 * Objeto map alterado.
 */
function desligamargem($objmapa)
{
    $ref = $objmapa->reference;
    $ref->set("status", MS_OFF);
    $sca = $objmapa->scalebar;
    $sca->set("status", MS_OFF);
    return $objmapa;
}

/*
 * Function: desligaTemas (depreciado na versao 4.7)
 *
 * Desliga todos os temas de um mapa.
 *
 * Parametro:
 *
 * $objMapa {objeto} - Objeto map.
 *
 * Retorno:
 *
 * Objeto map alterado.
 */
function desligaTemas($objMapa)
{
    $numlayers = $objMapa->numlayers;
    for ($i = 0; $i < $numlayers; ++ $i) {
        $layer = $objMapa->getlayer($i);
        $layer->set("status", MS_OFF);
    }
    return $objMapa;
}

/*
 * Function: extPadrao
 *
 * Aplica o valor da extensao geogr&aacute;fica padrao a um objeto map.
 *
 * Parametro:
 *
 * $oMap {objeto} - objeto mapa
 */
function extPadrao($oMap)
{
    $ext = "-160 -70 160 70";
    $extform = explode(" ", $ext);
    $extatual = $oMap->extent;
    $xmin = min($extform[0], $extform[2]);
    $xmax = max($extform[0], $extform[2]);
    $ymin = min($extform[1], $extform[3]);
    $ymax = max($extform[1], $extform[3]);
    $extatual->setextent($xmin, $ymin, $xmax, $ymax);
    return $oMap;
}

/*
 * Function: gravaImagemMapa
 *
 * Grava a imagem do mapa atual
 *
 * Parametro:
 *
 * $mapa - objeto mapa ou arquivo mapfile
 *
 * Retorno:
 *
 * {array} - array("url"=>,"arquivo"=>) ou falso se ocorrer erro
 *
 */
function gravaImagemMapa($mapa)
{
    if (is_string($mapa)) {
        $mapa = ms_newMapObj($mapa);
    }

    include (dirname(__FILE__) . "/../ms_configura.php");
    substituiConObj($mapa, $postgis_mapa);

    $imgo = @$mapa->draw();
    if (! $imgo) {
        return array(
            "url" => "",
            "arquivo" => ""
        );
    }
    $nome = ($imgo->imagepath) . nomeRandomico() . ".png";
    $salva = $imgo->saveImage($nome);
    if ($salva != - 1) {
        $retorno = array(
            "url" => ($imgo->imageurl) . basename($nome),
            "arquivo" => $nome
        );
        // $imgo->free();
    } else {
        $retorno = false;
    }
    return $retorno;
}

/*
 * Section: atributos
 */
/*
 * Function: pegaItens
 *
 * Pega os itens da tabela de atributos de um tema.
 *
 * Parametro:
 *
 * $layer {objeto} - objeto layer
 *
 * Retorno:
 *
 * {array}
 */
function pegaItens($layer, $mapa = "")
{
    //
    // no caso de WMS ou WFS
    //
    if ($layer->connectiontype == 7) {
        $url = $layer->connection;
        $temp = explode("?", $url);
        if (count($temp) == 1) {
            $url .= "?";
        }
        $url = $url . "&SERVICE=wfs&VERSION=1.1.0&REQUEST=DescribeFeatureType&TYPENAME=" . $layer->getmetadata("wms_name");
        // $url = "http://ogi.state.ok.us/geoserver/wfs?VERSION=1.1.0&REQUEST=DescribeFeatureType&TYPENAME=okcounties";
        $xml = simplexml_load_file($url);
        if ($xml == false) {
            return array();
        }
        $dom = new DOMDocument();
        $dom->loadXML($xml->asxml());
        $items = array();
        $sequences = $dom->getElementsByTagName("sequence");

        foreach ($sequences as $sq) {
            $services = $sq->getElementsByTagName("element");
            foreach ($services as $s) {
                $items[] = $s->getAttribute("name");
            }
        }
    } else {
        if ($layer->type == MS_LAYER_RASTER && $mapa != "") {
            $pt = ms_newPointObj();
            $pt->setXY($mapa->extent->minx + (($mapa->extent->maxx - $mapa->extent->minx) / 2), $mapa->extent->miny + (($mapa->extent->maxy - $mapa->extent->miny) / 2));
            $layer->queryByPoint($pt, 0, 0);
        }
        $sopen = $layer->open();
        if ($sopen != MS_FAILURE) {
            $items = $layer->getItems();
        } else {
            $items = array();
        }
        if ($layer->type == MS_LAYER_RASTER) {
            $items[] = "pixel";
        }
        $layer->close();
    }
    return $items;
}

/*
 * Function: buscaRapida
 *
 * Acessa um web service RPC de busca de nomes e retorna os resultados.
 *
 * Parametros:
 *
 * $servico {string} - Endereco do web service.
 *
 * $palavra {string} - palavra de busca
 *
 * Retorno:
 *
 * {array} | "erro"
 */
function buscaRapida($servico, $palavra)
{
    // error_reporting(0);
    if (! function_exists('preg_match')) {
        include_once (dirname(__FILE__) . '/../pacotes/SOAPdepreciado/nusoap.php');
        new Xsoapclient($servico . "?wsdl", "wsdl");
    } else {
        include_once (dirname(__FILE__) . '/../pacotes/SOAP/nusoap.php');
        $soapclient = new nusoap_client($servico);
    }
    $vv = "erro";
    $vv = $soapclient->call("procurar", array(
        "palavra" => $palavra,
        "tipoBusca" => "qualquer"
    ));
    if ($vv == "") {
        $vv = "erro";
    }
    return ($vv);
}

/*
 * Section: coordenadas
 */
/*
 * Function: ip2geo
 *
 * Localiza a coordenada geogr&aacute;fica de um endere&ccedil;o IP.
 *
 * Essa fun&ccedil;&atilde;o baseia-se no pacote geoIP, que deve estar instalado em pacotes/geoip.
 *
 * Parametros:
 *
 * $ip {string} - N&uacute;mero do IP.
 *
 * Retorno:
 *
 * {array}
 */
function ip2geo($ip, $locaplic = "..")
{
    // $ip="200.252.111.1";
    $resultado = array();
    if (file_exists($locaplic . "/pacotes/geoip/geoipcity.inc")) {
        include_once ($locaplic . "/pacotes/geoip/geoipcity.inc");
        include_once ($locaplic . "/pacotes/geoip/geoipregionvars.php");
        $gi = geoip_open($locaplic . "/pacotes/geoip/GeoLiteCity.dat", GEOIP_STANDARD);
        $record = geoip_record_by_addr($gi, $ip);
        $resultado["country_code"] = $record->country_code . " " . $record->country_code3 . " " . $record->country_name;
        $resultado["region"] = $record->region . " " . $GEOIP_REGION_NAME[$record->country_code][$record->region];
        $resultado["city"] = $record->city;
        $resultado["postal_code"] = $record->postal_code;
        $resultado["latitude"] = $record->latitude;
        $resultado["longitude"] = $record->longitude;
        $resultado["dma_code"] = $record->dma_code;
        $resultado["area_code"] = $record->area_code;
        $resultado["ip"] = $ip;
        geoip_close($gi);
    }
    return ($resultado);
}

/*
 * Function: xy2imagem
 *
 * Converte coordenadas geograficas em coordenadas de imagem e retorna um ponto.
 *
 * Parametros:
 *
 * $map_file {string} - Arquivo map file.
 *
 * $xy {string | array} - XY com as coordenadas (separado por espa&ccedil;o no caso de string)
 *
 * $mapa objeto mapa (usado ao inves do nome do arquivo qd for o caso)
 *
 * Retorno:
 *
 * {mapscript point}
 */
function xy2imagem($map_file, $xy, $map = "")
{
    if (! is_array($xy)) {
        $xy = explode(" ", $xy);
    }
    $pt = ms_newPointObj();
    include (dirname(__FILE__) . "/../ms_configura.php");
    if ($map == "") {
        $map = ms_newMapObj($map_file);
        substituiConObj($map, $postgis_mapa);
        $map = desligatemas($map);
        $map = desligamargem($map);
        $imgo = $map->draw();
    }
    $e = $map->extent;
    $vx = ($e->minx * - 1) - ($xy[0] * - 1);
    $vy = ($xy[1] * - 1) + ($e->maxy * 1);
    $c = $map->cellsize;
    $x = $vx / $c;
    $y = $vy / $c;
    $pt->setXY($x, $y);
    return $pt;
}

/*
 * Function: imagem2xy
 *
 * Converte coordenadas de imagem em coordenadas geogr&aacute;ficas.
 *
 * Parametros:
 *
 * $map_file {string} - Arquivo map file.
 *
 * $xy {array | string} - XY com as coordenadas (separado por espa&ccedil;o no caso de string)
 *
 * Retorno:
 *
 * {array}
 */
function imagem2xy($map_file, $xy)
{
    include (dirname(__FILE__) . "/../ms_configura.php");
    if (! is_array($xy)) {
        $xy = explode(" ", $xy);
    }
    $map = ms_newMapObj($map_file);
    substituiConObj($map, $postgis_mapa);
    $map = desligatemas($map);
    $map = desligamargem($map);
    $imgo = $map->draw();
    $e = $map->extent;
    $c = $map->cellsize;
    $x = ($e->minx) + $xy[0] * $c;
    $y = ($e->maxy) - $xy[1] * $c;
    return array(
        $x,
        $y
    );
}

/*
 * Function: xy2wkt
 *
 * Converte coordenadas para wkt.
 *
 * Parametro:
 *
 * $xy {string} - Lista de pares de coordenadas xy separadas por espa&ccedil;o.
 *
 * Retorno:
 *
 * {start code}
 * array(
 * "ponto"=>,
 * "linha"=>,
 * "poligono"=>
 * )
 * {end}
 */
function xy2wkt($xy)
{
    $apt = explode(" ", $xy);
    $shppt = ms_newshapeobj(MS_SHAPE_POINT);
    $shplin = ms_newshapeobj(MS_SHAPE_LINE);
    $shppol = ms_newshapeobj(MS_SHAPE_POLYGON);
    $lin = ms_newlineobj();
    $capt = count($apt);
    for ($i = 0; $i < $capt; $i = $i + 2) {
        $lin->addxy($apt[$i], $apt[$i + 1]);
    }
    $shppt->add($lin);
    if (count($apt) < 4) {
        $lin->addxy($apt[0], $apt[1]);
        $apt[] = $apt[0];
        $apt[] = $apt[1];
    }
    $shplin->add($lin);
    if (count($apt) < 6) {
        $lin->addxy($apt[0], $apt[1]);
        $apt[] = $apt[0];
        $apt[] = $apt[1];
    }
    if ($apt[0] . " " . $apt[1] != ($apt[count($apt) - 2] . " " . $apt[count($apt) - 1])) {
        $lin->addxy($apt[0], $apt[1]);
    }
    $shppol->add($lin);
    return array(
        "ponto" => $shppt->toWkt(),
        "linha" => $shplin->toWkt(),
        "poligono" => $shppol->toWkt()
    );
}

/*
 * Function: geo2zonaUTM
 *
 * Calcula a zona utm de um meridiano
 *
 * Parametros:
 *
 * $x {numerico dd} - longitude
 *
 * Retorno:
 *
 * {numerico}
 *
 */
function geo2zonaUTM($x)
{
    $x = $x + 180;
    $x = $x / 6;
    return intval($x) + 1;
}

/*
 * Function: geo2utm
 *
 * Converte coordenadas geogr&aacute;ficas para UTM
 *
 * Parametros:
 *
 * $x {numerico dd} - longitude
 *
 * $y {numerico dd} - latitude
 *
 * $zona {numerico} - zona UTM
 *
 * Retorno:
 *
 * {start code}
 * array(
 * "x"=>,
 * "y"=>,
 * "zona"=>,
 * "datum"=>"SAD-69"
 * )
 * {end}
 */
function geo2utm($x, $y, $zona)
{
    $projInObj = ms_newprojectionobj("proj=longlat,ellps=WGS84,datum=WGS84,no_defs");
    if ($y < 0) {
        $ns = "south";
    } else {
        $ns = "north";
    }
    $projOutObj = ms_newprojectionobj("proj=utm,zone=$zona,$ns,ellps=GRS67,units=m,no_defs");
    $poPoint = ms_newpointobj();
    $poPoint->setXY($x, $y);
    $poPoint->project($projInObj, $projOutObj);
    return array(
        "x" => round($poPoint->x, 2),
        "y" => round($poPoint->y, 2),
        "zona" => $zona,
        "datum" => "SAD-69"
    );
}

/*
 * Section: web services
 */
/*
 * georssCanais (depreciado)
 *
 * Lista os canais de um GeoRss.
 *
 * Parametros:
 * $servico - Endere&ccedil;o do RSS.
 *
 * $map_file - Nome do arquivo map file. Inclua o caminho completo no servidor.
 *
 * $dir_tmp - Diret&oacute;rio onde o arquivo ser&aacute; criado.
 *
 * $locaplic - Localiza&ccedil;&atilde;o do I3geo
 */
function georssCanais($servico)
{
    $xml = simplexml_load_file($servico);
    // var_dump($xml);
    $resultado = [];
    foreach ($xml->channel as $c) {
        $resultado[] = array(
            "title" => (ixml($c, "title")),
            "link" => (ixml($c, "link")),
            "description" => (ixml($c, "description")),
            "category" => (ixml($c, "category"))
        );
    }
    // var_dump($resultado);
    return $resultado;
}

/*
 * Section: tema
 */
/*
 * Function: pegaNome
 *
 * Retorna o nome correto de um layer verificando os elementos METADATA TEMA e ALTTEMA
 *
 * Parametros:
 *
 * $layer {objeto} - Objeto layer
 *
 * $enc {string} - C�digo de p&aacute;gina para convers&atilde;o de caracteres
 *
 * Retorno:
 *
 * {string}
 */
function pegaNome($layer, $enc = "AUTO")
{
    $nometmp = $layer->name;
    if (strtoupper($layer->getMetaData("TEMA")) != "NAO") {
        $nometmp = $layer->getMetaData("TEMA");
    } else if ($layer->getMetaData("ALTTEMA") != "") {
        $nometmp = $layer->getMetaData("ALTTEMA");
    }
    if (function_exists("mb_convert_encoding")) {
        $nometmp = mb_convert_encoding($nometmp, $enc, "ISO-8859-1");
    }
    return $nometmp;
}

/*
 * Function: criaLayer
 *
 * Cria um objeto layer
 *
 * Parametros:
 *
 * $oMapa {objeto} - objeto mapa
 *
 * $ms_tipo {MS_LAYER} - tipo de layer
 *
 * $ms_status [MS_STATUS} - status de visibilidade
 *
 * $metaTema {string} - nome do tema que ser&aacute; inclu&iacute;do no metadata TEMA
 *
 * $metaClasse {string} - SIM|NAO indica se a classe &eacute; vis&iacute;vel ou n&atilde;o na legenda
 *
 * $reposiciona {boolean} - reordena ou n&atilde;o o novo layer
 *
 * Retorno:
 *
 * {layer}
 */
function criaLayer($oMapa, $ms_tipo, $ms_status, $metaTema, $metaClasse = "SIM", $reposiciona = true)
{
    $versao = versao();
    $versao = $versao["principal"];
    $l = ms_newLayerObj($oMapa);
    $l->set("type", $ms_tipo);
    $l->set("name", nomeRandomico());
    $l->setmetadata("tema", $metaTema);
    $l->setmetadata("classe", $metaClasse);
    $l->set("status", $ms_status);
    $l->set("template", "none.htm");
    // evita problemas no modo tile
    if ($versao > 5) {
        $l->setprocessing("LABEL_NO_CLIP=True");
        $l->setprocessing("POLYLINE_NO_CLIP=True");
    }
    $classe = ms_newClassObj($l);
    $classe->set("name", "");
    $estilo = ms_newStyleObj($classe);
    $cor = $estilo->color;
    $cor->setrgb(31, 165, 165);
    $coro = $estilo->outlinecolor;
    $coro->setrgb(0, 0, 0);
    if ($ms_tipo == MS_LAYER_POINT) {
        $estilo->set("size", 4);
        $estilo->set("symbolname", "ponto");
    }
    // reposiciona o layer na pilha
    if ($reposiciona == true) {
        $ltipo = $l->type;
        if (($ltipo == 2) || ($ltipo == 3)) {
            $indicel = $l->index;
            $numlayers = $oMapa->numlayers;
            $nummove = 0;
            for ($i = $numlayers - 1; $i > 0; $i --) {
                $layerAbaixo = $oMapa->getlayer($i);
                $tipo = $layerAbaixo->type;
                if (($tipo != 2) && ($tipo != 3)) {
                    $nummove ++;
                }
            }
            if ($nummove > 2) {
                for ($i = 0; $i <= ($nummove - 3); ++ $i) {
                    $oMapa->movelayerup($indicel);
                }
            }
        }
    }
    return $l;
}

/*
 * Function: criaSHP
 *
 * Cria um arquivo shape file de um tema.
 *
 * Parametros:
 *
 * $tema {string} - Tema que ser&aacute; processado.
 *
 * $map_file {string} - Nome do arquivo map file. Inclua o caminho completo no servidor.
 *
 * $locaplic {string} - Diret&oacute;rio onde est&aacute; a aplica&ccedil;&atilde;o no servidor.
 *
 * $dir_tmp {string} - Diret&oacute;rio tempor&aacute;rio
 *
 * $nomeRand {boleano} - Gera um nome randomico para o shapefile (TRUE) ou utiliza o nome do tema (FALSE)
 *
 * $prj {string} - String que sera gravada no arquivo prj
 *
 * $projetaToMap {boolean} - Projeta os shapes para a projecao do mapa
 *
 * $shapesSel - (opcional) array com os shapes
 *
 * Retorno:
 *
 * {string} - nome do arquivo criado ou false se ocorrer erro
 */
function criaSHP($tema, $map_file, $locaplic, $dir_tmp, $nomeRand = TRUE, $prj = "", $projetaToMap = true, $shapesSel = false)
{
    include (dirname(__FILE__) . "/../ms_configura.php");
    $versao = versao();
    $versao = $versao["principal"];
    // para manipular dbf
    if (file_exists($locaplic . "/pacotes/phpxbase/api_conversion.php")) {
        include_once ($locaplic . "/pacotes/phpxbase/api_conversion.php");
    } else {
        include_once dirname(__FILE__) . "/../pacotes/phpxbase/api_conversion.php";
    }
    $map = @ms_newMapObj($map_file);
    $nameMapfile = $map->name;
    substituiConObj($map, $postgis_mapa);

    $layer = $map->getlayerbyname($tema);

    // e necessario abrir ou nao vai projetar
    $layer->open();
    $prjMapa = $map->getProjection();
    $prjTema = $layer->getProjection();
    if ($prjTema != "") {
        $projInObj = new projectionObj($prjTema);
        $projOutObj = new projectionObj($prjMapa);
    } else {
        $projInObj = "";
        $projOutObj = "";
        $projetaToMap = false;
    }
    $layer->set("template", "none.htm");
    $diretorio = dirname($dir_tmp);
    $tipol = MS_SHP_POINT;
    if ($layer->type == MS_LAYER_LINE) {
        $tipol = MS_SHP_ARC;
    }
    if ($layer->type == MS_LAYER_POLYGON) {
        $tipol = MS_SHP_POLYGON;
    }
    if ($nomeRand == true) {
        $novonomelayer = $tema . "_" . nomeRandomico(5);
    } else {
        $novonomelayer = $tema;
    }
    $novonomelayer = str_replace(".", "-", $novonomelayer);
    $nomeshp = $dir_tmp . "/" . $nameMapfile . "_" . $novonomelayer;

    if (file_exists($nomeshp . ".shp")) {
        return $nomeshp;
    }

    $novoshpf = ms_newShapefileObj($nomeshp, $tipol);

    // se for do tipo features
    $data = $layer->data;
    $resultadoFinal = true;
    if ($data == "") {
        $def[] = array(
            "ID",
            "C",
            "50"
        );
        $reg[] = 0;
        if (! function_exists("dbase_create")) {
            $db = xbase_create($nomeshp . ".dbf", $def);
            xbase_add_record($db, $reg);
            xbase_close($db);
        } else {
            $db = dbase_create($nomeshp . ".dbf", $def);
            dbase_add_record($db, $reg);
            dbase_close($db);
        }
        if ($versao >= 6) {
            $shape = $layer->getshape(new resultObj(0));
        } else {
            $s = $layer->getfeature(0, - 1);
            $result = $layer->getResult(0);
            $shpi = $result->shapeindex;
            $shape = $layer->getfeature($shpi, - 1);
        }
        $novoshpf = ms_newShapefileObj($nomeshp . ".shp", - 2);
        $novoshpf->addShape($shape);
        $resultadoFinal = true;
    } else {
        if ($shapesSel == false) {
            $shapesSel = retornaShapesSelecionados($layer, $map_file, $map, false);
        }
        $items = pegaItens($layer);
        // cria o dbf
        $def = array();
        $cni = 0;
        foreach ($items as $ni) {
            $temp = strtoupper($ni);
            $temp = substr($temp, 0, 8) . $cni;
            //
            // nao tem como descobrir o tamanho e tipo do campo
            //
            $def[] = array(
                $temp,
                "C",
                "254"
            );
            $cni = $cni + 1;
        }
        if (! function_exists("dbase_create")) {
            $db = xbase_create($nomeshp . ".dbf", $def);
        } else {
            $db = dbase_create($nomeshp . ".dbf", $def);
        }
        $dbname = $nomeshp . ".dbf";
        $reg = array();
        $novoshpf = ms_newShapefileObj($nomeshp . ".shp", - 2);

        $res_count = count($shapesSel);
        if ($res_count > 0) {
            for ($i = 0; $i < $res_count; ++ $i) {
                $shape = $shapesSel[$i];
                if ($projetaToMap == true) {
                    $shape->project($projInObj, $projOutObj);
                }
                foreach ($items as $ni) {
                    $vreg = $shape->values[$ni];
                    if (strlen($vreg) > 255) {
                        $vreg = substr($vreg, 0, 255);
                    }
                    $reg[] = $vreg;
                }
                $novoshpf->addShape($shape);
                if (! function_exists("dbase_create"))
                    xbase_add_record($db, $reg);
                else
                    dbase_add_record($db, $reg);
                $reg = array();
            }
            if (! function_exists("dbase_create"))
                xbase_close($db);
            else
                dbase_close($db);
            //
            // verifica a quantidade de registros no final
            //
            if (function_exists("dbase_open"))
                $db = dbase_open($nomeshp . ".dbf", 0);
            else
                $db = xbase_open($nomeshp . ".dbf", 0);

            if (function_exists("dbase_numrecords"))
                $record_numbers = dbase_numrecords($db);
            else
                $record_numbers = xbase_numrecords($db);

            if (function_exists("dbase_close"))
                dbase_close($db);
            else
                xbase_close($db);
            if ($record_numbers != $res_count) {
                if (file_exists($nomeshp . ".dbf")) {
                    unlink($nomeshp . ".dbf");
                }
                if (file_exists($nomeshp . ".shp")) {
                    unlink($nomeshp . ".shp");
                }
                if (file_exists($nomeshp . ".shx")) {
                    unlink($nomeshp . ".shx");
                }
                if (file_exists($nomeshp . ".prj")) {
                    unlink($nomeshp . ".prj");
                }
                $resultadoFinal = false;
            }
        } else {
            $resultadoFinal = false;
        }
    }
    if ($resultadoFinal == false) {
        return false;
    } else {
        // gera o arquivo prj
        if ($prj != "") {
            gravaDados(array(
                $prj
            ), $nomeshp . ".prj");
        }        // se prj for vazio mas existir o arquivo prj original e a projecao do shape nao estiver ativa
        // copia o arquivo prj original se existir
        elseif ($projetaToMap == false) {
            $nomePrjOriginal = str_replace(".shp", ".prj", $layer->data);
            $nomeDestino = $nomeshp . ".prj";
            if (file_exists($nomePrjOriginal) && ! file_exists($nomeDestino)) {
                copy($nomePrjOriginal, $nomeDestino);
            }
        }
        return $nomeshp;
    }
}

/*
 * Function: downloadTema (depreciado)
 *
 * Utilize downloadTema2
 */
function downloadTema($map_file, $tema, $locaplic, $dir_tmp, $postgis_mapa)
{
    $resultado = downloadTema2($map_file, $tema, $locaplic, $dir_tmp, $postgis_mapa);
    return $resultado["arquivos"];
}

/*
 * Function: downloadTema2
 *
 * Faz o download dos dados de um tema.
 *
 * Parametros:
 *
 * $map_file {string} - Nome do arquivo map file. Inclua o caminho completo no servidor.
 *
 * $tema {string} - Tema que ser&aacute; processado.
 *
 * $locaplic {string} - Diret&oacute;rio da aplica&ccedil;&atilde;o.
 *
 * $dir_tmp {string} - Diret&oacute;rio tempor&aacute;rio
 *
 * $postgis_mapa - variavel definida em ms_configura.php
 *
 * Retorno:
 *
 * {array} com o nome do diret&oacute;rio e nome do arquivo
 *
 * Include:
 * <ms_configura.php>
 */
function downloadTema2($map_file, $tema, $locaplic, $dir_tmp, $postgis_mapa)
{
    ini_set("max_execution_time", "1800");
    ini_set('memory_limit', '5000M');
    if (file_exists($locaplic . "/ms_configura.php")) {
        include ($locaplic . "/ms_configura.php");
    } else {
        include (dirname(__FILE__) . "/../ms_configura.php");
    }
    // para zipar o shapefile
    include (dirname(__FILE__) . "/../pacotes/kmlmapserver/classes/zip.class.php");
    $versao = versao();
    $versao = $versao["principal"];
    $dataArquivos = array();
    //
    // cria o arquivo mapfile, caso ele n&atilde;o exista, que servir&aacute; de base para obten&ccedil;&atilde;o dos dados
    //
    $nomeRand = true;
    $projecao = pegaProjecaoDefault();
    if (($map_file == "") || (! file_exists($map_file))) { // a funcao foi chamada do aplicativo datadownload
        if ($base == "" or ! isset($base)) {
            $base = "";
            if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')) {
                $base = $locaplic . "/aplicmap/geral1windowsv" . $versao . ".map";
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
                    $base = $locaplic . "/aplicmap/geral1v" . $versao . ".map";
                }
            }
        } else {
            if (! file_exists($base)) {
                $base = $locaplic . "/aplicmap/" . $base;
            }
        }
        $map_tmp = ms_newMapObj($base);

        $map_file = $dir_tmp . "/downloadTema2" . nomerandomico(20) . ".map";
        $map_tmp->setProjection($projecao["proj4"]);
        $map_tmp->save($map_file);
        $nomeRand = false;
    }
    //
    // verifica se o tema existe no mapfile
    // se n&atilde;o existir, tenta inserir com base no mapfile existente no diret&oacute;rio temas
    // o tema pode existir se a fun&ccedil;&atilde;o estiver sendo chamada da &aacute;rvore de temas de um mapa j&aacute; aberto
    //
    $temasdir = $locaplic . "/temas";
    $map = ms_newMapObj($map_file);
    $rectextent = $map->extent;
    $extensao = ".map";
    // se o layer nao existir no mapfile, pega da pasta i3geo/temas e adiciona em $map
    if (@$map->getlayerbyname($tema) == "") {
        // tema pode ser o nome de um arquivo mapfile
        if (file_exists($tema . ".map")) {
            $maptemp = ms_newMapObj($tema . ".map");
            $tema = basename($tema);
        } else {
            $maptemp = ms_newMapObj($temasdir . "/" . $tema . ".map");
        }
        $ll = $maptemp->getlayer(0);
        if($ll->getmetadata("permitedownload") != "nao"){
            ms_newLayerObj($map, $ll);
        }
    } else {
        // remove o metadata com um nome de arquivo opcional, pois a fun&ccedil;&atilde;o de download pode estar sendo executada da &aacute;rvore de camadas
        $teste = $map->getlayerbyname($tema);
        $teste->setmetadata("arquivodownload", "");
    }
    $map_file = str_replace(".map","",$map_file).nomerandomico(5).".map";
    $map->save($map_file);
    validaAcessoTemas($map_file);
    $map = ms_newMapObj($map_file);
    substituiConObj($map, $postgis_mapa);
    $nameMapfile = $map->name;
    $radtmp = dirname($dir_tmp);
    $nomezip = $dir_tmp . "/" . $nameMapfile . "_" . $tema;
    $qyfile = str_replace(".map", "_qy.map", $map_file);
    if(file_exists($qyfile)){
        $nomezip = $nomezip . nomerandomico(5);
    }
    if(file_exists($nomezip.".zip")){
        return array(
            "tema" => $tema,
            "mapfile" => "",
            "mapfileurl" => "",
            "arquivos" => "",
            "nreg" => "",
            "datas" => "",
            "shape-zip" => $nomezip.".zip"
        );
    }
    $l = $map->getlayerbyname($tema);
    //
    // se existir um arquivo j&aacute; pronto, definido no metadata arquivodownload, ir&aacute; ser utilizado
    //
    $meta = $l->getmetadata("arquivodownload");
    if ($meta != "") {
        $meta = str_replace(".zip", "", $meta) . ".zip";
        if (file_exists($meta)) {
            if (! file_exists($nomecopia)) {
                copy($meta, $nomezip.".zip");
            }
        }
        return array(
            "tema" => $tema,
            "mapfile" => "",
            "mapfileurl" => "",
            "arquivos" => "",
            "nreg" => "",
            "datas" => "",
            "shape-zip" => $nomezip.".zip"
        );
    }
    $ziper = new zipfile();
    $zipar = array();
    $novonomelayer = $tema;
    // usa o NAME do mapfile para nao gerar arquivos com o mesmo nome em instalacoes multiplas do i3geo
    $nomeshp = $dir_tmp . "/" . $nameMapfile . "_" . $tema;
    if (file_exists($nomeshp . ".dbf")) {
        //
        // verifica se o arquivo est&aacute; vazio ou n&atilde;o
        // se estiver, apaga o arquivo
        //
        $verificaDBF = verificaDBF($nomeshp . ".dbf");
        if ($verificaDBF == false) {
            unlink($nomeshp . ".dbf");
            unlink($nomeshp . ".shp");
            unlink($nomeshp . ".shx");
            unlink($nomeshp . ".prj");
            unlink($nomeshp . ".zip");
        }
    }
    $dados = $l->data;
    //
    // se for imagem, copia o arquivo
    //
    if ($l->type == MS_LAYER_RASTER) {
        if (file_exists($dados)) {
            $dir = dirname($dados);
            $arq = explode(".", basename($dados))[0];
            $nomecopia = $dir_tmp . "/" . $nameMapfile . "_" . $arq;
            $exts = array(
                "jpg",
                "jpw",
                "tif",
                "tifw",
                "tfw",
                "png",
                "pngw",
                "jpgw",
                "wld",
                "img"
            );
            foreach ($exts as $ext) {
                if (file_exists($dir . "/" . $arq . "." . $ext)) {
                    $zipar[] = $dir . "/" . $arq . "." . $ext;
                }
            }
        } else {
            return "erro";
        }
    } else { // se for vetorial, extrai o arquivo
          //
          // verifica se existe selecao, caso contrario, faz a selecao baseada na extensao
          // do mapfile
          //
        include (dirname(__FILE__) . "/../classesphp/classe_selecao.php");
        $sel = new Selecao($map_file, $tema);
        // carrega a query para ver se o layer possui selecao ou nao
        $numSel = 0;
        $nomeRand = true;
        if (file_exists($sel->qyfile)) {
            $map->loadquery($sel->qyfile);
            $numSel = $l->getNumresults();
            $nomeshp = criaSHP($tema, $map_file, $locaplic, $dir_tmp, $nomeRand, $projecao["prj"]);
        }
        //
        // se nao existir selecao seleciona por box
        // o box vem do mapfile original
        //

        if (! file_exists($sel->qyfile)) {
            $box = $rectextent->minx . " " . $rectextent->miny . " " . $rectextent->maxx . " " . $rectextent->maxy;
            $shapesSel = $sel->selecaoBOX("novo", $box, true);
            // reaproveita arquivo anterior
            $nomeRand = false;
            $nomeshp = criaSHP($tema, $map_file, $locaplic, $dir_tmp, $nomeRand, $projecao["prj"], true, $shapesSel);
        }
        // remove o arquivo de selecao se ele foi criado apenas para pegar todos os elementos
        if ($nomeRand == false) {
            $sel->selecaoLimpa();
        }
        if ($nomeshp == false) {
            return array(
                "arquivos" => "<span style=color:red >Ocorreu um erro, tente novamente",
                "nreg" => 0
            );
        }
        $pre = str_replace($radtmp . "/", "", $nomeshp);
        $zipar[] = $nomeshp . ".shp";
        $zipar[] = $nomeshp . ".shx";
        $zipar[] = $nomeshp . ".dbf";
        $zipar[] = $nomeshp . ".prj";
    }
    foreach($zipar as $z) {
        $ext = explode(".",$z)[1];
        $ziper->addFile(file_get_contents($z), $tema . "." . $ext);
    }
    $fp = fopen($nomeshp . ".zip", "wb");
    fwrite($fp, $ziper->file());
    fclose($fp);

    return array(
        "tema" => $tema,
        "mapfile" => "",
        "mapfileurl" => "",
        "arquivos" => [],
        "nreg" => "",
        "datas" => [],
        "shape-zip" => $nomeshp . ".zip"
    );
}

/*
 * Function: verificaDBF
 *
 * Verifica se um arquivo dbf est&aacute; ou n&atilde;o vazio
 *
 * Parametros:
 *
 * $arq {string} - nome do arquivo dbf
 *
 * Return:
 *
 * {boolean} - true indica que n&atilde;o est&aacute; vazio
 */
function verificaDBF($arq)
{
    if (function_exists("dbase_open"))
        $db = dbase_open($arq, 0);
    else {
        include_once (dirname(__FILE__) . "/../pacotes/phpxbase/api_conversion.php");
        $db = xbase_open($arq, 0);
    }
    // nas vers&otilde;es novas do PHP open retorna vazio, n&atilde;o d&aacute; pra verificar
    // if ($db) {
    if (function_exists("dbase_numrecords")) {
        $record_numbers = dbase_numrecords($db);
        dbase_close($db);
    } else {
        $record_numbers = xbase_numrecords($db);
        xbase_close($db);
    }
    if ($record_numbers > 0) {
        return true;
    } else {
        return false;
    }
    // }
    // else {return false;}
}

/*
 * Section: Outros
 */
/*
 * Function: calculaAreaPixel
 *
 * Calcula a &aacute;rea em m2 de um pixel do mapa
 *
 * O c&aacute;lculo &eacute; feito projetando-se o mapa atual para a proje&ccedil;&atilde;o polic&ocirc;nica
 *
 * Parametros:
 *
 * $map_file {string} - arquivo do mapa
 *
 * $celsize {numerico} - tamanho do pixel em d&eacute;cimos de grau
 *
 * Retorno:
 *
 * {Numerico} - &aacute;rea em metros quadrados
 */
function calculaAreaPixel($map_file, $celsize)
{
    $mapa = ms_newMapObj($map_file);
    $rect = $mapa->extent;
    $projInObj = ms_newprojectionobj("proj=longlat,ellps=WGS84,datum=WGS84,no_defs");
    $projOutObj = ms_newprojectionobj("proj=poly,ellps=GRS67,lat_0=0,lon_0=" . $rect->minx . ",x_0=5000000,y_0=10000000");
    $y = $rect->maxy - ((($rect->maxy) - ($rect->miny)) / 2);
    $x = $rect->maxx - ((($rect->maxx) - ($rect->minx)) / 2);
    $shape = ms_newShapeObj(MS_SHAPE_POLYGON);
    $linha = ms_newLineObj();
    $linha->addXY($x, $y);
    $linha->addXY(($x + $celsize), $y);
    $linha->addXY(($x + $celsize), ($y - $celsize));
    $linha->addXY($x, ($y - $celsize));
    $linha->addXY($x, $y);
    $shape->add($linha);
    $shape->project($projInObj, $projOutObj);
    $s = $shape->towkt();
    $shape = ms_shapeObjFromWkt($s);
    $area = $shape->getArea();
    return $area;
}

/*
 * Function: pegaIPcliente
 *
 * Pega o IP do cliente
 *
 * Retorno:
 *
 * {string}
 */
function pegaIPcliente()
{
    $ipaddress = '';
    if (getenv('HTTP_CLIENT_IP'))
        $ipaddress = getenv('HTTP_CLIENT_IP');
    else if (getenv('HTTP_X_FORWARDED_FOR'))
        $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
    else if (getenv('HTTP_X_FORWARDED'))
        $ipaddress = getenv('HTTP_X_FORWARDED');
    else if (getenv('HTTP_FORWARDED_FOR'))
        $ipaddress = getenv('HTTP_FORWARDED_FOR');
    else if (getenv('HTTP_FORWARDED'))
        $ipaddress = getenv('HTTP_FORWARDED');
    else if (getenv('REMOTE_ADDR'))
        $ipaddress = getenv('REMOTE_ADDR');
    else
        $ipaddress = 'UNKNOWN';

    return $ipaddress;
}

/*
 * Function: pegaIPcliente2
 *
 * Pega o IP do cliente sem REMOTE_ADDR
 *
 * Retorno:
 *
 * {string}
 */
function pegaIPcliente2()
{
    $ip = "UNKNOWN";
    if (getenv("HTTP_X_FORWARDED_FOR"))
        $ip = getenv("HTTP_X_FORWARDED_FOR");
    else if (getenv("REMOTE_ADDR"))
        $ip = getenv("REMOTE_ADDR");
    else
        $ip = "UNKNOWN";
    return $ip;
}

/*
 * Function: versao
 *
 * Retorna a vers&atilde;o do Mapserver.
 *
 * Retorno:
 *
 * {array} - array("completa"=>,"principal"=>)
 */
function versao()
{
    $v = "5.0.0";
    $vs = explode(" ", ms_GetVersion());
    $cvs = count($vs);
    for ($i = 0; $i < $cvs; ++ $i) {
        if (trim(strtolower($vs[$i])) == "version") {
            $v = $vs[$i + 1];
        }
    }
    $versao["completa"] = $v;
    $v = explode(".", $v);
    $versao["principal"] = $v[0];
    $versao["inteiro"] = ms_GetVersionInt();
    return $versao;
}

/*
 * Function: iXml
 *
 * Retorna o valor de um elemento xml
 *
 * Parameter:
 *
 * $no - objeto representando o elemento xml
 *
 * $nome - nome do elemento
 */
function ixml($no, $nome)
{
    return mb_convert_encoding($no->$nome, "HTML-ENTITIES", "auto");
}

/*
 * Function: autoClasses
 *
 * Gera as classes do layer com base em valores definidos na tabela de atributos.
 *
 * Os par&acirc;metros para montagem das classes s&atilde;o definidos em metadados do layer.
 *
 * Parametros:
 *
 * $nlayer {objeto} - objeto layer que ser&aacute; processado
 *
 * $mapa {objeto} - objeto mapa que ser&aacute; processado
 *
 * Retorno:
 *
 * {objeto} layer modificado
 */
function autoClasses(&$nlayer, $mapa, $locaplic = null)
{
    if ($nlayer->getmetadata("classesitem") != "") {
        $postgis_mapa = "";
        $substituicon = "nao";
        include (dirname(__FILE__) . "/../ms_configura.php");
        if ($nlayer->connectiontype == MS_POSTGIS) {
            if ($nlayer->connection == " ") {
                $nlayer->set("connection", $postgis_mapa);
                $substituicon = "sim";
            }
        }
        //
        // gera classes automaticamente (temas vetoriais)

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
                $rgb = getRGBpallete($rule, $value);
                $style->color->setRGB($rgb[0], $rgb[1], $rgb[2]);
            }
        }
    }
    return;
}

function getRGBpallete($rule, $value)
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

function fg_seems_utf8($Str) { # by bmorel at ssi dot fr
    $length = strlen($Str);
    for ($i = 0; $i < $length; $i++) {
        if (ord($Str[$i]) < 0x80) continue; # 0bbbbbbb
        elseif ((ord($Str[$i]) & 0xE0) == 0xC0) $n = 1; # 110bbbbb
        elseif ((ord($Str[$i]) & 0xF0) == 0xE0) $n = 2; # 1110bbbb
        elseif ((ord($Str[$i]) & 0xF8) == 0xF0) $n = 3; # 11110bbb
        elseif ((ord($Str[$i]) & 0xFC) == 0xF8) $n = 4; # 111110bb
        elseif ((ord($Str[$i]) & 0xFE) == 0xFC) $n = 5; # 1111110b
        else return false; # Does not match any model
        for ($j = 0; $j < $n; $j++) { # n bytes matching 10bbbbbb follow ?
            if ((++$i == $length) || ((ord($Str[$i]) & 0xC0) != 0x80))
                return false;
        }
    }
    return true;
}
function removeAcentos($string){
    if (!preg_match('/[\x80-\xff]/', $string)){
        return $string;
    }
    if (fg_seems_utf8($string)) {
        $chars = array(
            // Decompositions for Latin-1 Supplement
            chr(195).chr(128) => 'A', chr(195).chr(129) => 'A',
            chr(195).chr(130) => 'A', chr(195).chr(131) => 'A',
            chr(195).chr(132) => 'A', chr(195).chr(133) => 'A',
            chr(195).chr(135) => 'C', chr(195).chr(136) => 'E',
            chr(195).chr(137) => 'E', chr(195).chr(138) => 'E',
            chr(195).chr(139) => 'E', chr(195).chr(140) => 'I',
            chr(195).chr(141) => 'I', chr(195).chr(142) => 'I',
            chr(195).chr(143) => 'I', chr(195).chr(145) => 'N',
            chr(195).chr(146) => 'O', chr(195).chr(147) => 'O',
            chr(195).chr(148) => 'O', chr(195).chr(149) => 'O',
            chr(195).chr(150) => 'O', chr(195).chr(153) => 'U',
            chr(195).chr(154) => 'U', chr(195).chr(155) => 'U',
            chr(195).chr(156) => 'U', chr(195).chr(157) => 'Y',
            chr(195).chr(159) => 's', chr(195).chr(160) => 'a',
            chr(195).chr(161) => 'a', chr(195).chr(162) => 'a',
            chr(195).chr(163) => 'a', chr(195).chr(164) => 'a',
            chr(195).chr(165) => 'a', chr(195).chr(167) => 'c',
            chr(195).chr(168) => 'e', chr(195).chr(169) => 'e',
            chr(195).chr(170) => 'e', chr(195).chr(171) => 'e',
            chr(195).chr(172) => 'i', chr(195).chr(173) => 'i',
            chr(195).chr(174) => 'i', chr(195).chr(175) => 'i',
            chr(195).chr(177) => 'n', chr(195).chr(178) => 'o',
            chr(195).chr(179) => 'o', chr(195).chr(180) => 'o',
            chr(195).chr(181) => 'o', chr(195).chr(182) => 'o',
            chr(195).chr(182) => 'o', chr(195).chr(185) => 'u',
            chr(195).chr(186) => 'u', chr(195).chr(187) => 'u',
            chr(195).chr(188) => 'u', chr(195).chr(189) => 'y',
            chr(195).chr(191) => 'y',
            // Decompositions for Latin Extended-A
            chr(196).chr(128) => 'A', chr(196).chr(129) => 'a',
            chr(196).chr(130) => 'A', chr(196).chr(131) => 'a',
            chr(196).chr(132) => 'A', chr(196).chr(133) => 'a',
            chr(196).chr(134) => 'C', chr(196).chr(135) => 'c',
            chr(196).chr(136) => 'C', chr(196).chr(137) => 'c',
            chr(196).chr(138) => 'C', chr(196).chr(139) => 'c',
            chr(196).chr(140) => 'C', chr(196).chr(141) => 'c',
            chr(196).chr(142) => 'D', chr(196).chr(143) => 'd',
            chr(196).chr(144) => 'D', chr(196).chr(145) => 'd',
            chr(196).chr(146) => 'E', chr(196).chr(147) => 'e',
            chr(196).chr(148) => 'E', chr(196).chr(149) => 'e',
            chr(196).chr(150) => 'E', chr(196).chr(151) => 'e',
            chr(196).chr(152) => 'E', chr(196).chr(153) => 'e',
            chr(196).chr(154) => 'E', chr(196).chr(155) => 'e',
            chr(196).chr(156) => 'G', chr(196).chr(157) => 'g',
            chr(196).chr(158) => 'G', chr(196).chr(159) => 'g',
            chr(196).chr(160) => 'G', chr(196).chr(161) => 'g',
            chr(196).chr(162) => 'G', chr(196).chr(163) => 'g',
            chr(196).chr(164) => 'H', chr(196).chr(165) => 'h',
            chr(196).chr(166) => 'H', chr(196).chr(167) => 'h',
            chr(196).chr(168) => 'I', chr(196).chr(169) => 'i',
            chr(196).chr(170) => 'I', chr(196).chr(171) => 'i',
            chr(196).chr(172) => 'I', chr(196).chr(173) => 'i',
            chr(196).chr(174) => 'I', chr(196).chr(175) => 'i',
            chr(196).chr(176) => 'I', chr(196).chr(177) => 'i',
            chr(196).chr(178) => 'IJ',chr(196).chr(179) => 'ij',
            chr(196).chr(180) => 'J', chr(196).chr(181) => 'j',
            chr(196).chr(182) => 'K', chr(196).chr(183) => 'k',
            chr(196).chr(184) => 'k', chr(196).chr(185) => 'L',
            chr(196).chr(186) => 'l', chr(196).chr(187) => 'L',
            chr(196).chr(188) => 'l', chr(196).chr(189) => 'L',
            chr(196).chr(190) => 'l', chr(196).chr(191) => 'L',
            chr(197).chr(128) => 'l', chr(197).chr(129) => 'L',
            chr(197).chr(130) => 'l', chr(197).chr(131) => 'N',
            chr(197).chr(132) => 'n', chr(197).chr(133) => 'N',
            chr(197).chr(134) => 'n', chr(197).chr(135) => 'N',
            chr(197).chr(136) => 'n', chr(197).chr(137) => 'N',
            chr(197).chr(138) => 'n', chr(197).chr(139) => 'N',
            chr(197).chr(140) => 'O', chr(197).chr(141) => 'o',
            chr(197).chr(142) => 'O', chr(197).chr(143) => 'o',
            chr(197).chr(144) => 'O', chr(197).chr(145) => 'o',
            chr(197).chr(146) => 'OE',chr(197).chr(147) => 'oe',
            chr(197).chr(148) => 'R',chr(197).chr(149) => 'r',
            chr(197).chr(150) => 'R',chr(197).chr(151) => 'r',
            chr(197).chr(152) => 'R',chr(197).chr(153) => 'r',
            chr(197).chr(154) => 'S',chr(197).chr(155) => 's',
            chr(197).chr(156) => 'S',chr(197).chr(157) => 's',
            chr(197).chr(158) => 'S',chr(197).chr(159) => 's',
            chr(197).chr(160) => 'S', chr(197).chr(161) => 's',
            chr(197).chr(162) => 'T', chr(197).chr(163) => 't',
            chr(197).chr(164) => 'T', chr(197).chr(165) => 't',
            chr(197).chr(166) => 'T', chr(197).chr(167) => 't',
            chr(197).chr(168) => 'U', chr(197).chr(169) => 'u',
            chr(197).chr(170) => 'U', chr(197).chr(171) => 'u',
            chr(197).chr(172) => 'U', chr(197).chr(173) => 'u',
            chr(197).chr(174) => 'U', chr(197).chr(175) => 'u',
            chr(197).chr(176) => 'U', chr(197).chr(177) => 'u',
            chr(197).chr(178) => 'U', chr(197).chr(179) => 'u',
            chr(197).chr(180) => 'W', chr(197).chr(181) => 'w',
            chr(197).chr(182) => 'Y', chr(197).chr(183) => 'y',
            chr(197).chr(184) => 'Y', chr(197).chr(185) => 'Z',
            chr(197).chr(186) => 'z', chr(197).chr(187) => 'Z',
            chr(197).chr(188) => 'z', chr(197).chr(189) => 'Z',
            chr(197).chr(190) => 'z', chr(197).chr(191) => 's',
            // Euro Sign
            chr(226).chr(130).chr(172) => 'E',
            // GBP (Pound) Sign
            chr(194).chr(163) => '');
        $string = strtr($string, $chars);
    } else {
        // Assume ISO-8859-1 if not UTF-8
        $chars['in'] = chr(128).chr(131).chr(138).chr(142).chr(154).chr(158)
        .chr(159).chr(162).chr(165).chr(181).chr(192).chr(193).chr(194)
        .chr(195).chr(196).chr(197).chr(199).chr(200).chr(201).chr(202)
        .chr(203).chr(204).chr(205).chr(206).chr(207).chr(209).chr(210)
        .chr(211).chr(212).chr(213).chr(214).chr(216).chr(217).chr(218)
        .chr(219).chr(220).chr(221).chr(224).chr(225).chr(226).chr(227)
        .chr(228).chr(229).chr(231).chr(232).chr(233).chr(234).chr(235)
        .chr(236).chr(237).chr(238).chr(239).chr(241).chr(242).chr(243)
        .chr(244).chr(245).chr(246).chr(248).chr(249).chr(250).chr(251)
        .chr(252).chr(253).chr(255);
        $chars['out'] = "EfSZszYcYuAAAAAACEEEEIIIINOOOOOOUUUUYaaaaaaceeeeiiiinoooooouuuuyy";
        $string = strtr($string, $chars['in'], $chars['out']);
        $double_chars['in'] = array(chr(140), chr(156), chr(198), chr(208), chr(222), chr(223), chr(230), chr(240), chr(254));
        $double_chars['out'] = array('OE', 'oe', 'AE', 'DH', 'TH', 'ss', 'ae', 'dh', 'th');
        $string = str_replace($double_chars['in'], $double_chars['out'], $string);
    }
    return $string;
}

/*
 * Function: array2json
 *
 * Converte um array em uma string no formato JSON. Utiliza as fun&ccedil;&otilde;es nativas do PHP para gerar o objeto.
 *
 * Parametro:
 *
 * $a {array}
 *
 * $cpaint {boolean} - se for true &eacute; acrescentado o elemento "data" como chave no array, mantendo a compatibilidade da resposta com o CPAINT
 *
 * Retorno:
 *
 * {JSON}
 */
function array2json($a, $cpaint = true)
{
    if ($cpaint == true) {
        $a = array(
            "data" => $a
        );
    }
    return json_encode($a);
}

/*
 * Function: json2array
 *
 * Converte uma string JSON em um objeto PHP
 *
 * $a {string}
 *
 * Retorno:
 *
 * {objeto}
 */
function json2array($a)
{
    return json_decode($a);
}

/*
 * Function: echojson
 *
 * Retorna para o navegador uma string (JSON) e para o processamento do PHP
 *
 * Parametro:
 *
 * $a {string}
 */
function echojson($a)
{
    if (ob_get_contents()) {
        ob_end_clean();
    }
    header("Content-type: text/html");
    echo $a;
    // if(extension_loaded('zlib'))
    // {ob_end_flush();}
    exit();
}

/*
 * Function: cpjson
 *
 * Converte um array em um objeto JSON e retorna para o navegador
 *
 * Parametro:
 *
 * $obj {array} - objeto que ser&aacute; convertido
 */
function cpjson($obj)
{
    if (ob_get_contents()) {
        ob_end_clean();
    }
    if (function_exists("json_encode")) {
        echojson(array2json($obj));
    } else {
        include_once (dirname(__FILE__) . "/../pacotes/cpaint/cpaint2.inc.php");
        $cp = new cpaint();
        $cp->set_data($obj);
        $cp->return_data();
        exit();
    }
}
function retornaJSONutf8($obj)
{
    include_once(dirname(__FILE__) . "/../pacotes/cpaint/JSON/json2.php");
    error_reporting(0);
    if (ob_get_contents()) {
        ob_end_clean();
    }
    $j = new Services_JSON();
    $texto = $j->encode($obj);
    if (!mb_detect_encoding($texto,"UTF-8",true)){
        $texto = utf8_encode($texto);
    }
    echo $texto;
    exit;
}
/*
 * Function: removeLinha
 *
 * Remove uma linha do mapfile baseado na compara&ccedil;&atilde;o de strings.
 *
 * Parametros:
 *
 * $texto
 *
 * $mapfile
 */
function removeLinha($texto, $mapfile)
{
    $abre = fopen($mapfile, "r");
    while (! feof($abre)) {
        $buffer = fgets($abre);
        $maparray[] = $buffer;
    }
    fclose($abre);
    $novoarray = array();
    foreach ($maparray as $e) {
        $remove = "nao";
        $testa = explode($texto, $e);
        if (count($testa) > 1) {
            $remove = "sim";
        }
        if ($remove == "nao") {
            $novoarray[] = $e;
        }
    }
    // salva o mapfile
    $abre = fopen($mapfile, "wt");
    foreach ($novoarray as $linha) {
        $escreve = fwrite($abre, $linha);
    }
    $fecha = fclose($abre);
}

//
// depreciado para incluir &$ para compatibilizar com PHP 5.x
// utilize carregaquery2
//
function carregaquery($mapfile, $objlayer, $objmapa)
{
    $qyfile = dirname($mapfile) . "/" . $objlayer->name . "_qy.map";
    if (file_exists($qyfile)) {
        $indxlayer = $objlayer->index;
        $handle = fopen($qyfile, "r");
        $conteudo = fread($handle, filesize($qyfile));
        fclose($handle);
        $shp = unserialize($conteudo);
        foreach ($shp as $indx) {
            $objmapa->querybyindex($indxlayer, - 1, $indx, MS_TRUE);
        }
        return "sim";
    }
    return "nao";
}

/*
 * Function: carregaquery2
 *
 * Le um arquivo PHP, serializado com a lista de &iacute;ndices de objetos SHAPE selecionados em um LAYER, e aplica ao LAYER a sele&ccedil;&atilde;o desses SHAPES usando querybyindex
 *
 * Aten&ccedil;&atilde;o: na vers&atilde;o 6 do Mapserver, n&atilde;o funciona com layers do tipo Postgis
 *
 * Parametros:
 *
 * $mapfile
 *
 * $objlayer
 *
 * $objmapa
 */
function carregaquery2($mapfile, &$objlayer, &$objmapa)
{
    $qyfile = dirname($mapfile) . "/" . $objlayer->name . "_qy.map";
    if (file_exists($qyfile)) {
        $indxlayer = $objlayer->index;
        $handle = fopen($qyfile, "r");
        $conteudo = fread($handle, filesize($qyfile));
        fclose($handle);
        $shp = unserialize($conteudo);
        foreach ($shp as $indx) {
            $objmapa->querybyindex($indxlayer, - 1, $indx, MS_TRUE);
        }
        return "sim";
    }
    return "nao";
}

/*
 * Function: verificaEditores (DEPRECIADO)
 *
 * Verifica se o usu&aacute;rio atual est&aacute; cadastrado como editor
 *
 * Parametros:
 *
 * editores - array com a lista de editores
 *
 * Return:
 *
 * {string} - sim|nao
 */
function verificaEditores($editores)
{
    return;
    if (strtolower($_SERVER['HTTP_HOST']) == "localhost" || strtolower($_SERVER['SERVER_NAME']) == "localhost") {
        return "sim";
    }
    $editor = "nao";
    if ($editores == "") {
        return $editor;
    }
    $ip = "UNKNOWN";
    if (getenv("HTTP_CLIENT_IP"))
        $ip = getenv("HTTP_CLIENT_IP");
    else if (getenv("HTTP_X_FORWARDED_FOR"))
        $ip = getenv("HTTP_X_FORWARDED_FOR");
    else if (getenv("REMOTE_ADDR"))
        $ip = getenv("REMOTE_ADDR");
    else
        $ip = "UNKNOWN";
    if (in_array($ip, $e)) {
        $editor = "sim";
    }
    return $editor;
}

/*
 * Function: verificaPapelUsuario
 *
 * Verifica se o usu&aacute;rio logado est&aacute; cadastrado em determinado papel.
 *
 * Os papeis sao cadastrados no sistema de login
 *
 * Parametros:
 *
 * papel - codigo do papel
 *
 * Return:
 *
 * {boolean}
 */
function verificaPapelUsuario($id_papel)
{
    include_once (dirname(__FILE__) . "/../admin/php/login.php");
    $r = verificaPapelSessao($id_papel);
    return $r;
}

/*
 * Function: sobeAnno
 *
 * Coloca todas as camadas do tipo ANNOTATION sobre as demais
 *
 * Parametros:
 *
 * $map_file - arquivo mapfile que ser&aacute; processado
 */
function sobeAnno($map_file)
{
    $mapa = ms_newMapObj($map_file);
    $numlayers = $mapa->numlayers;
    for ($i = 0; $i < $numlayers; ++ $i) {
        $layer = $mapa->getlayer($i);
        if ($layer->type == 4) {
            $temp = ms_newLayerObj($mapa, $layer);
            $layer->set("status", MS_DELETE);
        }
    }
    $mapa->save($map_file);
}

function retornaShapesMapext($objLayer, $objMapa)
{
    $objLayer->querybyrect($objMapa->extent);
    $objLayer->open();
    $shapes = array();
    $res_count = $objLayer->getNumresults();
    for ($i = 0; $i < $res_count; $i++){
        $shapes[] = $objLayer->getShape($objLayer->getResult($i));
    }
    $fechou = $objLayer->close();
    return $shapes;
}

function retornaShapesSelecionados($objLayer, $map_file, $objMapa, $indexado = false)
{
    $shapes = array();
    $qyfile = dirname($map_file) . "/" . $objLayer->name . "_qy.map";
    if (! file_exists($qyfile)) {
        return $shapes;
    }
    $handle = fopen($qyfile, "r");
    $conteudo = fread($handle, filesize($qyfile));
    fclose($handle);
    $listaDeIndices = unserialize($conteudo);
    if (count($listaDeIndices) == 0) {
        return $shapes;
    }

    $versao = versao();
    $versao = $versao["principal"];

    if ($objLayer->connectiontype != MS_POSTGIS) {
        // pega os shapes selecionados
        carregaquery2($map_file, $objLayer, $objMapa);

        $sopen = $objLayer->open();
        if ($sopen == MS_FAILURE) {
            return "erro";
        }
        $res_count = $objLayer->getNumresults();

        $centroides = array();
        $shapes = array();
        // pega um shape especifico
        for ($i = 0; $i < $res_count; ++ $i) {
            if ($versao >= 6) {
                $shape = $objLayer->getShape($objLayer->getResult($i));
                $shp_index = $shape->index;
            } else {
                $result = $objLayer->getResult($i);
                $shp_index = $result->shapeindex;
                $shape = $objLayer->getfeature($shp_index, - 1);
            }
            if ($indexado == true) {
                $shapes[$shp_index] = $shape;
            } else {
                $shapes[] = $shape;
            }
        }
        $fechou = $objLayer->close();
    } else {
        // var_dump($listaDeIndices);exit;
        $rect = ms_newRectObj();
        $rect->set("minx", - 180);
        $rect->set("miny", - 90);
        $rect->set("maxx", 180);
        $rect->set("maxy", 90);
        $status = $objLayer->open();
        $status = $objLayer->whichShapes($rect);
        while ($shape = $objLayer->nextShape()) {
            if (in_array($shape->index, $listaDeIndices)) {
                if ($indexado == true) {
                    $shapes[$shape->index] = $shape;
                } else {
                    $shapes[] = $shape;
                }
            }
        }
        $objLayer->close();
    }
    return $shapes;
}

/*
 * Function: validaAcessoTemas
 *
 * Remocao dos layers com restricoes de acesso registradas no sistema de controle de usuarios
 *
 * Remove os layers indevidos (considerando o usuario logado) de um mapfile com op��o de salvar ou nao o arquivo apos a remocao
 *
 * Parametros:
 *
 * $map_file - nome do arquivo mapfile, podendo ser um dos que existem em i3geo/temas desde que com o nome completo
 *
 * $salva - salva o mapfile com os layers removidos ou nao
 *
 * Retorno: boolean indicando se o mapfile contem layers indevidos
 */
function validaAcessoTemas($map_file, $salva = true)
{
    // error_reporting(E_ALL);
    $indevidos = listaLayersIndevidos($map_file);
    $existeIndevidos = false;
    if (count($indevidos) > 0) {
        $existeIndevidos = true;
        if (! is_object($map_file)) {
            $m = ms_newMapObj($map_file);
        } else {
            $m = $map_file;
            $salva = false;
        }
        foreach ($indevidos as $i) {
            $l = $m->getlayerbyname($i);
            $l->set("status", MS_DELETE);
        }
        // salva o mapfile
        if ($salva == true) {
            $m->save($map_file);
        }
    }
    return $existeIndevidos;
}

/*
 * Function: listaTemasRestritos
 *
 * Lista os temas que possuem restricao de acesso para apenas alguns grupos de usuarios
 *
 * O retorno e um array com a chave sendo o codigo do tema e o valor um array com a lista de ids de grupos que podem acessar
 */
function listaTemasRestritos()
{
    global $esquemaadmin;
    //nao usar include_once aqui
    include (dirname(__FILE__) . "/../classesphp/conexao.php");
   // error_reporting(E_ALL);
    $res = pegaDadosAdmin("select id_grupo,codigo_tema from " . $esquemaadmin . "i3geousr_grupotema as gt," . $esquemaadmin . "i3geoadmin_temas as te where gt.id_tema = te.id_tema",$dbh);
    $restritos = array();
    foreach ($res as $r) {
        if (in_array($r["codigo_tema"], $restritos)) {
            array_push($restritos[$r["codigo_tema"]], $r["id_grupo"]);
        } else {
            $restritos[$r["codigo_tema"]] = array(
                $r["id_grupo"]
            );
        }
    }
    return $restritos;
}

/*
 * Function: listaLayersIndevidos
 *
 * Lista os layers de um mapfile que sao restritos e que nao sao permitidos ao usuario logado
 */
function listaLayersIndevidos($map_file)
{
    // error_reporting(0);
    $indevidos = array();

    $restritos = listaTemasRestritos();
    if (count($restritos) > 0) {
        $gruposusr = listaGruposUsrLogin();
        if (! is_object($map_file)) {
            $m = ms_newMapObj($map_file);
        } else {
            $m = $map_file;
        }
        $c = $m->numlayers;
        for ($i = 0; $i < $c; ++ $i) {
            $layer = $m->getlayer($i);
            $meta = $layer->getmetadata("arquivotemaoriginal");
            // pode ser que o metadata nao esteja definido ainda
            if ($meta == "") {
                $meta = str_replace(".map", "", basename($map_file));
            }
            if ($meta != "") {
                if (in_array($meta, array_keys($restritos)) || in_array($layer->name, array_keys($restritos))) {
                    $indevido = true;
                    foreach ($gruposusr as $g) {
                        foreach ($restritos[$meta] as $r) {
                            if ($g == $r) {
                                $indevido = false;
                            }
                        }
                    }
                    if ($indevido == true) {
                        array_push($indevidos, $layer->name);
                    }
                }
            }
        }
    }
    return $indevidos;
}

/*
 * Function: listaTemasIndevidos
 *
 * Lista os temas que sao restritos e que nao sao permitidos ao usuario logado
 */
function listaTemasIndevidos()
{
    // error_reporting(0);
    $indevidos = array();
    $restritos = listaTemasRestritos();
    if (count($restritos) > 0) {
        $gruposusr = listaGruposUsrLogin();
        $c = count($gruposusr);
        reset($restritos);
        while (list ($key, $val) = each($restritos)) {
            // var_dump($val);var_dump($gruposusr);exit;
            if (array_search($gruposusr, $val) === true || $c == 0) {
                array_push($indevidos, $key);
            }
        }
    }
    return $indevidos;
}

/*
 * Function: listaGruposUsrLogin
 *
 * Lista os grupos ao qual pertence o usuario atualmente logado
 */
function listaGruposUsrLogin()
{
    // error_reporting(0);
    // echo $_COOKIE["i3geocodigologin"];exit;
    if (empty($_COOKIE["i3geocodigologin"])) {
        return array();
    }
    $nameatual = session_name();
    $idatual = session_id();
    session_write_close();
    session_name("i3GeoLogin");
    session_id($_COOKIE["i3geocodigologin"]);
    session_start();
    $res = $_SESSION["gruposusr"];
    session_write_close();
    session_name("$nameatual");
    session_id($idatual);
    session_start();
    return $res;
}

/*
 * Function: cloneInlineSymbol
 *
 * Importa os simbolos inline de um layer de um mapfile para outro mapfile
 *
 * @fixme
 * No caso de imagens, o nome do simbolo deve ser o mesmo do caminho da imagem (bug do mapserver)
 *
 * Parameters:
 *
 * layern - objeto layer que contem o simbolo original
 *
 * nmapa - objeto map que contem o layer layern
 *
 * mapa - objeto mapa destino do simbolo clonado
 */
function cloneInlineSymbol($layern, $nmapa, $mapa)
{
    $versao = versao();
    if ($versao["principal"] > 5) {
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
}

//
// recupera um mapfile armazenado no banco de dados de administracao
function restauraMapaAdmin($id_mapa, $dir_tmp)
{
    if (filter_var($id_mapa, FILTER_VALIDATE_INT) === false) {
        exit();
    }
    include (dirname(__FILE__) . "/conexao.php");
    if (! empty($esquemaadmin)) {
        $esquemaadmin = str_replace(".", "", $esquemaadmin) . ".";
    }
    $q = $dbh->query("select * from " . $esquemaadmin . "i3geoadmin_mapas where id_mapa=$id_mapa ", PDO::FETCH_ASSOC);
    $mapasalvo = $q->fetchAll();
    $dbh = null;
    $dbhw = null;
    $mapasalvo = $mapasalvo[0];
    //var_dump($mapasalvo);exit;
    $base = "";
    if (! isset($mapasalvo["publicado"])) {
        $mapasalvo["publicado"] = "";
    }
    if (strtoupper($mapasalvo["publicado"]) != "NAO") {
        $base = $dir_tmp . "/" . nomeRandomico() . "_restaurado.map";
        $baseh = fopen($base, 'w');
        $mapfile = $mapasalvo["mapfile"];
        // $registro = $mapasalvo["mapfile"];
        // verifica se existem parametros junto com o registro
        // $registro = explode(",",$registro);
        // $mapfile = $registro[0];
        // adapta para versoes novas do mapserver
        // verifica se esta em base 64 (versoes antigas)
        if (! preg_match('/MAP/', $mapfile)) {
            $mapfile = base64_decode($mapfile);
        } else {
            // substitui strings especiais
            $mapfile = str_replace("_!!_", '"', $mapfile);
            $mapfile = str_replace("_!_", "'", $mapfile);
        }
        $mapfile = str_ireplace("TYPE ANNOTATION", "TYPE POINT", $mapfile);
        $mapfile = str_replace(array(
            "<?",
            "?>"
        ), "", $mapfile);
        $s = fwrite($baseh, $mapfile);
        fclose($baseh);
        if (@ms_newMapObj($base)) {
            return $base;
        } else {
            unlink($base);
        }
    }
    return false;
}

//
// converte uma string de conexao do mapserver em um array com os componentes da conexao
//
function stringCon2Array($stringCon)
{
    $lista = explode(" ", $stringCon);
    $con = array();
    foreach ($lista as $l) {
        $teste = explode("=", $l);
        $con[trim($teste[0])] = trim($teste[1]);
    }
    $c = array(
        "dbname" => $con["dbname"],
        "host" => $con["host"],
        "port" => $con["port"],
        "user" => $con["user"],
        "password" => $con["password"]
    );
    return $c;
}

/*
 * Function: pegaDadosAdminKey
 *
 * Executa um sql de busca de dados no sistema de administracao do i3Geo
 *
 * O sql deve retornar valores unicos
 *
 * O resultado sera um array associativo, onde a prieira coluna do resultado sera a primeira coluna retornada
 *
 * exemplo
 *
 * pegaDadosAdmin("select * from __esq__.i3geoadmin_temas","__esq__")
 *
 * Parametros:
 *
 * sql {string} - sql que ser&Atilde;� executado
 *
 * subsEsquema {string} - sera substtuido em sql pelo esquema
 *
 * Retorno:
 *
 * Array originada de fetchAll
 */
function pegaDadosAdminKey($sql, $subsEsquema)
{
    // pegaDadosAdminKey("select codigo_tema,link_tema from __esq__i3geoadmin_temas","__esq__");
    $resultado = array();
    include (dirname(__FILE__) . "/conexao.php");
    $sql = str_replace($subsEsquema, $esquemaadmin, $sql);
    // error_reporting(0);
    $q = $dbh->query($sql, PDO::FETCH_ASSOC);
    if ($q) {
        $resultado = $q->fetchAll(PDO::FETCH_GROUP | PDO::FETCH_UNIQUE);
        $dbh = null;
        $dbhw = null;
        return $resultado;
    } else {
        $dbh = null;
        $dbhw = null;
        return array();
    }
}

/*
 * Function: pegaProjecaoDefault
 *
 * Retorna o array $i3GeoProjDefault definido em i3geo/ms_configura.php
 *
 * Se essa variavel nao existir, retorna o valor default baseado em EPSG:4326
 *
 * Parametros:
 *
 * tipo {string} - se for vazio retorna todos os elementos do array. Se nao for vazio, usa $tipo como
 * chave para retornar apenas o indice desejado (proj4, epsg, prj)
 *
 * Retorno:
 *
 * Array
 */
function pegaProjecaoDefault($tipo = "")
{
    global $i3GeoProjDefault;
    if (empty($i3GeoProjDefault) || ! isset($i3GeoProjDefault)) {
        include (dirname(__FILE__) . "/../ms_configura.php");
    }
    if (empty($i3GeoProjDefault) || ! isset($i3GeoProjDefault)) {
        $i3GeoProjDefault = array(
            'proj4' => '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ',
            'epsg' => '4326',
            'prj' => 'GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]]'
        );
    }
    if ($tipo == "") {
        return $i3GeoProjDefault;
    } else {
        return $i3GeoProjDefault[$tipo];
    }
}

/**
 * Verifica se uma string existe em um arquivo
 */
function fileContemString($arq, $s)
{
    if (! file_exists($arq)) {
        return false;
    }
    $handle = fopen($arq, 'r');
    $valid = false; // init as false
    while (! feof($handle)) {
        $buffer = fgets($handle);
        if (strpos($buffer, $s) !== false) {
            $valid = TRUE;
            break; // Once you find the string, you should break out the loop.
        }
    }
    fclose($handle);
    return $valid;
}

function i3GeoLog($txt, $dir_tmp = "")
{
    if (empty($dir_tmp)) {
        include (dirname(__FILE__) . "/../ms_configura.php");
    }
    $log = "Ip: " . $_SERVER['REMOTE_ADDR'] . ' - ' . date("F j, Y, g:i a") . PHP_EOL . $txt . PHP_EOL . "-------------------------" . PHP_EOL;
    file_put_contents($dir_tmp . '/.log_i3geo_' . date("j.n.Y"), $log, FILE_APPEND);
}

/**
 * valida o IP do usuario em uma lista branca
 */
function validaIpUsuario($lista)
{
    if ($lista == "") {
        return true;
    }
    $ip = pegaIPcliente();
    if (in_array($ip, $lista)) {
        return true;
    } else {
        return false;
    }
}

function checaLoginIp($lista)
{
    if (empty($lista)) {
        return;
    }
    $r = validaIpUsuario($lista);
    if ($r == false) {
        header("HTTP/1.1 403 Login nao permitido");
        exit();
    }
}

//
// corrige layers do tipo GRID
// bug do mapserver nao permite renderizar grids
// essa funcao corrige esse problema
//
function corrigeLayerGrid($layerOrigem, $layerDestino)
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

function corrigeLayerPath($l, $map)
{
    // apenas para shapefile
    if ($l->connectiontype == MS_SHAPEFILE) {
        // error_log($map->shapepath);
        if ($map->shapepath != "") {
            // o nome do arquivo pode conter .shp ou nao
            if (file_exists($map->shapepath . "/" . $l->data)) {
                $l->set("data", $map->shapepath . "/" . $l->data);
            }
            if (file_exists($map->shapepath . "/" . $l->data . ".shp")) {
                $l->set("data", $map->shapepath . "/" . $l->data . ".shp");
            }
            // error_log($l->data);
        }
    }
}
function pegaDadosAdmin($sql,$dbh=""){
    $resultado = array();
    //is_string para efeitos de compatibilidade
    if($dbh == "" || is_string($dbh)){
        include(dirname(__FILE__)."/../classesphp/conexao.php");
    }
    error_reporting(0);
    $q = $dbh->query($sql,PDO::FETCH_ASSOC);
    if($q){
        $resultado = $q->fetchAll();
        return $resultado;
    }
    else{
        throw new Exception("pegaDadosAdmin");
    }
}
/**
 * Groups an array by a given key.
 *
 * Groups an array into arrays by a given key, or set of keys, shared between all array members.
 *
 * Based on {@author Jake Zatecky}'s {@link https://github.com/jakezatecky/array_group_by array_group_by()} function.
 * This variant allows $key to be closures.
 *
 * @param array $array   The array to have grouping performed on.
 * @param mixed $key,... The key to group or split by. Can be a _string_,
 *                       an _integer_, a _float_, or a _callable_.
 *
 *                       If the key is a callback, it must return
 *                       a valid key from the array.
 *
 *                       If the key is _NULL_, the iterated element is skipped.
 *
 *                       ```
 *                       string|int callback ( mixed $item )
 *                       ```
 *
 * @return array|null Returns a multidimensional array or `null` if `$key` is invalid.
 */
function array_group_by(array $array, $key)
{
    if (!is_string($key) && !is_int($key) && !is_float($key) && !is_callable($key) ) {
        //trigger_error('array_group_by(): The key should be a string, an integer, or a callback', E_USER_ERROR);
        return null;
    }

    $func = (!is_string($key) && is_callable($key) ? $key : null);
    $_key = $key;

    // Load the new array, splitting by the target key
    $grouped = [];
    foreach ($array as $value) {
        $key = null;

        if (is_callable($func)) {
            $key = call_user_func($func, $value);
        } elseif (is_object($value) && isset($value->{$_key})) {
            $key = $value->{$_key};
        } elseif (isset($value[$_key])) {
            $key = $value[$_key];
        }

        if ($key === null) {
            continue;
        }

        $grouped[$key][] = $value;
    }

    // Recursively build a nested grouping if more parameters are supplied
    // Each grouped array value is grouped according to the next sequential key
    if (func_num_args() > 2) {
        $args = func_get_args();

        foreach ($grouped as $key => $value) {
            $params = array_merge([ $value ], array_slice($args, 2, func_num_args()));
            $grouped[$key] = call_user_func_array('array_group_by', $params);
        }
    }

    return $grouped;
}
?>
