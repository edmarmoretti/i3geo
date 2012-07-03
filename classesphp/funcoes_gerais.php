<?php
/*
Title: funcoes_gerais.php

Cont&eacute;m um conjunto de fun&ccedil;&otilde;es que s&atilde;o compartilhadas por outros programas PHP utilizados pelo i3Geo.

Licenca:

GPL2


i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma cópia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/classesphp/funcoes_gerais.php
*/
/*
Section: Imagens
*/
/*
Function: classesRasterI

Gera par&acirc;metros para classifica&ccedil;&atilde;o de imagens.

Gera a express&atilde;o e as cores para uso em classes com intervalos iguais para representa&ccedil;&atilde;o de imagens raster.

Parametros:

$minvalor {numeric} - Menor valor existente na s&eacute;rie

$maxvalor {numeric} - Maior valor

$nclasses {numeric} - N&uacute;mero de classes

$cores {array} - Cores. Array de array de cores cores[0] = array(r,g,b)

Retorno:

(start code)
array(
	array(
		"nomeclasse"=>,
		"expressao"=>,
		"cores"=>
	)
)
(end)
*/
//error_reporting(0);
function classesRasterI($minvalor,$maxvalor,$nclasses,$cores)
{
	$resultado = array();
	$intervalo = intval(250 / $nclasses);
	$trans = 250 / ($maxvalor - $minvalor);
	$intervalo = (($maxvalor*$trans) - ($minvalor*$trans)) / $nclasses;
	$conta = 0;
	for ($i=0; $i < $nclasses; ++$i)
	{
		$expressao = "([pixel]>=".$conta." and [pixel]<".($conta+$intervalo).")";
		$nomeclasse = ">= ".($conta/$trans)." e < que ".(($conta + $intervalo)/$trans);
		$resultado[] = array("nomeclasse"=>$nomeclasse,"expressao"=>$expressao,"cores"=>$cores[$i]);
		$conta = $conta + $intervalo;
	}
	return $resultado;
}
/*
Function: fusaoGrafico

Faz a fusao de uma imagem com outra grafico+imagem.

Globais:

$imagem {objeto} - imagem base, caso $map_file for ""

$grafico {objeto} - imagem do grafico

$dir_tmp {string} - diretorio onde estao as imagens

$cp {CPAINT} - Objeto CPAINT

$map_file [string} - arquivo mapfile que ser&aacute; utilizado para gerar a imagem base. Se for "", ser&aacute; utilizado a imagem definida em $imagem

Retorno:

{string} - endere&ccedil;o da imagem criada

*/
function fusaoGrafico()
{
	global $imagem,$grafico,$dir_tmp,$map_file;
	include_once("classe_imagem.php");
	if($map_file != "")
	{
		$mapa = ms_newMapObj($map_file);
		$imgo = $mapa->draw();
		$nome = ($imgo->imagepath).nomeRandomico().".png";
		$imgo->saveImage($nome);
		$imagem = ($imgo->imageurl).basename($nome);
		//$imgo->free();
	}
	$m = new Imagem(dirname($dir_tmp).$imagem);
	$i = $m->fundeIm(dirname($dir_tmp).$grafico);
	imagepng($i,dirname($dir_tmp).$imagem);
	return ($imagem);
}
/*
Section: R
*/
/*
Function: executaR

Executa comandos do R.

Parametros:

$rcode {array} - Código que ser&aacute; executado.

$dir_tmp {string} - Diretório tempor&aacute;rio onde ficar&atilde;o os arquivos para processamento.

$R_path {string} - Execut&aacute;vel do R.

$gfile_name {string} - nome da imagem que ser&aacute; criada

Retorno:

{string} - nome do arquivo com o código R que foi executado
*/
function executaR($rcode,$dir_tmp,$R_path,$gfile_name="")
{
	$R_options = "--slave --no-save";
	$r_name = nomeRandomico(20);
	$r_input = $dir_tmp."/".$r_name.".R";
	$r_output = $dir_tmp."/".$r_name.".Rout";
	gravaDados($rcode,$r_input);
	$command = $R_path." $R_options < $r_input > $r_output";
	$result = "";
	$error = "";
	$exec_result = exec($command,$result,$error);
	//corta a imagem final
	//include_once("classe_imagem.php");
	//$m = new Imagem($dir_tmp."/".$gfile_name.".png");
	//$i = $m->cortaBorda();
	//imagepng($i,$dir_tmp."/".$gfile_name.".png");
	return($r_input);
}
/*
Function: criaImagemR

Cria uma imagem png a partir de dados armazenados em disco.

Utilizado para gerar uma imagem com base nos resultados de comandos R.

O nome da imagem criada ser&aacute; o mesmo nome de $nomearq, por&eacute;m com extens&atilde;o .png

Parametros:

$nomearq {string} - Nome do arquivo no servidor que ser&aacute; utilizado para gerar a imagem.

Retorno:

{array($minpixel,$maxpixel)} - tamanho da imagem gerada.
*/
function criaImagemR($nomearq)
{
	if (!file_exists($nomearq."img"))
	{return "erro";}
	//pega os parametros
	$abre = fopen($nomearq."h", "r");
	while (!feof($abre))
	{
		$buffer = fgets($abre);
		$pararray[] = $buffer;
	}
	fclose($abre);
	$xsize = $pararray[0];
	$ysize = $pararray[1];
	$xdim = $pararray[2];
	$ydim = $pararray[3];
	$wh = explode(" ",$pararray[4]);
	// pega os valores dos pixels
	$abre = fopen($nomearq."img", "r");
	$buffer = fgets($abre);
	fclose($abre);
	$pixelimg = explode(" ",$buffer);
	$minpixel = min($pixelimg);
	$maxpixel = max($pixelimg);
	$trans = 250 / ($maxpixel - $minpixel);
	$img = imagecreatetruecolor($wh[0],$wh[1]);
	$celula = 0;
	for ($x = 0; $x < $wh[0]; $x++)
	{
		for ($y = ($wh[1] - 1); $y >= 0; $y--)
		{
			$cor = imagecolorresolve($img,$pixelimg[$celula] * $trans, $pixelimg[$celula] * $trans, $pixelimg[$celula] * $trans);
			imagesetpixel($img, $x, $y,$cor);
			$celula = $celula + 1;
		}
	}
	Imagepng($img,$nomearq.".png");
	ImageDestroy($nomearq.".png");
	$dadosw[] = trim($xsize);
	$dadosw[] = 0;
	$dadosw[] = 0;
	$dadosw[] = trim($ysize * -1);
	$temp = explode(" ",$xdim);
	$dadosw[] = trim($temp[0]);
	$temp = explode(" ",$ydim);
	$dadosw[] = trim($temp[1]);
	$fp = fopen($nomearq.".wld","w");
	foreach ($dadosw as $dado)
	{
		fwrite($fp,$dado."\n");
	}
	fclose($fp);
	$retorno = array($minpixel,$maxpixel);
	return $retorno;
}
/*
Section: cor
*/
/*
Function: corRGB

Obt&eacute;m os valores em RGB de um objeto cor do Mapscript.

Parametro:

$cor {objeto} - objeto cor do mapscript.

Retorno:

{string} - Cor em RGB separados por v&iacute;rgula.
*/
function corRGB($cor)
{
	$r = $cor->red;
	$g = $cor->green;
	$b = $cor->blue;
	return($r.",".$g.",".$b);
}
/*
Function: corE

Aplica uma cor a um elemento de um objeto label de um layer.

Parametro:

$label {objeto} - Objeto do tipo label.

$cor {string} - RGB separado por espacos, se for um array, aplica diretamente ao objeto cor.

$elemento {string} - Nome do elemento que receber&aacute; a cor.

$sombrax { n pixels) - utilizado apena quando se define a cor da sombra de labels

$sombray { n pixels) - utilizado apena quando se define a cor da sombra de labels
*/
function corE($label,$cor,$elemento,$sombrax=1,$sombray=1)
{
	$versao = versao();
	$versao = $versao["principal"];
	if (is_string($cor))
	{
		$cor = str_replace(","," ",$cor);
		if (count(explode(" ",$cor)) == 3)
		{
			if($versao > 5 && in_array(strtolower($elemento),array("backgroundcolor","backgroundshadowcolor"))){
				//na 601 n&atilde;o funciona
				return;
				$e = new styleObj($label);
				$e->setGeomTransform("labelpoly");
				$corres = $e->color;
				if(strtolower($elemento) == "backgroundshadowcolor"){
					$e->set("offsetx",$sombrax);
					$e->set("offsety",$sombray);
				}
			}
			else
			{$corres = $label->$elemento;}
			$cori = explode(",",$cor);
			$corres->setRGB($cori[0],$cori[1],$cori[2]);
		}
	}
	else
	{$corres->setRGB($cor->red,$cor->green,$cor->blue);}
}
/*
Function: colorHex

Aloca uma cor a um objeto imagem (GD).

A origem &eacute; uma cor definida em hexadecimal.

Parametro:

$img {objeto} - objeto imagem

$HexColorString {string} - cor hexadecimal
*/
function colorHex($img, $HexColorString)
{
	$R = hexdec(substr($HexColorString, 0, 2));
	$G = hexdec(substr($HexColorString, 2, 2));
	$B = hexdec(substr($HexColorString, 4, 2));
	return ImageColorAllocate($img, $R, $G, $B);
}
/*
Function: colorRGB

Aloca uma cor a um objeto imagem (GD).

A origem &eacute; uma cor definida em rgb.

Parametros:

$img {objeto} - objeto imagem

$ColorString {string} - cor r,g,b
*/
function colorRGB($img, $ColorString)
{
	$cor = explode(",",$ColorString);
	$R = $cor[0];
	$G = $cor[1];
	$B = $cor[2];
	return ImageColorAllocate($img, $R, $G, $B);
}
/*
Function: colorRGBshadow

Aloca uma cor de sombra a um objeto imagem (GD).

A origem &eacute; uma cor definida em rgb.

Parametros:

$img {objeto} - objeto imagem

$ColorString {string} - cor r,g,b
*/
function colorRGBshadow($img, $ColorString, $mork)
{
	$cor = explode(",",$ColorString);
	$R = $cor[0];
	$G = $cor[1];
	$B = $cor[2];
	if ($mork)
	{
		($R > 99) ? $R -= 100 : $R = 0;
		($G > 99) ? $G -= 100 : $G = 0;
		($B > 99) ? $B -= 100 : $B = 0;
	}
	else
	{
		($R < 220) ? $R += 35 : $R = 255;
		($G < 220) ? $G += 35 : $G = 255;
		($B < 220) ? $B += 35 : $B = 255;
	}
	return ImageColorAllocate($img, $R, $G, $B);
}
/*
Function: colorHexshadow

Aloca uma cor de sombra a um objeto imagem (GD).

A origem &eacute; uma cor definida em hexadecimal.

Parametros:

$img {objeto} - objeto imagem

$ColorString {string} - cor hexadecimal
*/
function colorHexshadow($img, $HexColorString, $mork)
{
	$R = hexdec(substr($HexColorString, 0, 2));
	$G = hexdec(substr($HexColorString, 2, 2));
	$B = hexdec(substr($HexColorString, 4, 2));
	if ($mork)
	{
		($R > 99) ? $R -= 100 : $R = 0;
		($G > 99) ? $G -= 100 : $G = 0;
		($B > 99) ? $B -= 100 : $B = 0;
	}
	else
	{
		($R < 220) ? $R += 35 : $R = 255;
		($G < 220) ? $G += 35 : $G = 255;
		($B < 220) ? $B += 35 : $B = 255;
	}
	return ImageColorAllocate($img, $R, $G, $B);
}
/*
Function: RGB2hex

Converte uma cor rgb em hex.

Parametro:

$rgb {string} - cor RGB

Retorno:

{string}
*/
function RGB2hex($rgb)
{
    $r = str_pad(dechex($rgb[0]), 2, '0', STR_PAD_LEFT);
    $g = str_pad(dechex($rgb[1]), 2, '0', STR_PAD_LEFT);
    $b = str_pad(dechex($rgb[2]), 2, '0', STR_PAD_LEFT);
    return($r . $g . $b);
}
/*
Section: arquivos
*/
/*
Function: nomeRandomico

Gera um nome rand&ocirc;mico.

Parametro:

$n {numeric} - N&uacute;mero de d&iacute;gitos.

Retorno:

{string}
*/
function nomeRandomico($n=10)
{
	$nomes = "";
	$a = 'azertyuiopqsdfghjklmwxcvbnABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$max = 51;
	for($i=0; $i < $n; ++$i)
	{$nomes .= $a{mt_rand(0, $max)};}
	return $nomes;
}
/*
Function: listaEpsg

L&ecirc; o arquivo com os códigos de proje&ccedil;&atilde;o epsg e retorna um array com os dados.

O arquivo lido &eacute; "../ferramentas/epsg.txt"

Retorno:

{start code}
array(
	array(
		"codigo"=>,
		"nome"=>,
		"def"=>
	)
)
{end}
*/
function listaEpsg()
{
	$abre = fopen("../ferramentas/epsg.txt", "r");
	while (!feof($abre))
	{
		$buffer = fgets($abre);
		$linhas[] = $buffer;
	}
	fclose($abre);
	$cl = count($linhas);
	for ($i=0;$i < $cl;$i=$i+2)
	{
		$n = $linhas[$i];
		$n = str_replace("#","",$n);
		$n = str_replace("\n","",$n);
		$d = $linhas[$i+1];
		$d = str_replace("\n","",$d);
		$temp = explode(">",$d);
		$d = $temp[1];
		$c = $temp[0];
		$d = str_replace("<","",$d);
		$c = str_replace("<","",$c);
		$n = mb_convert_encoding($n,"UTF-8","ISO-8859-1");
		$lista[] = array("codigo"=>$c,"nome"=>$n,"def"=>$d);
	}
	return $lista;
}
/*
Function: copiaSeguranca

Cria cópia de seguran&ccedil;a do map_file.

Salva o mapfile atual incluindo no nome, a string "seguranca".

Parametro:

$map_file {string} - Arquivo map file.

*/
function copiaSeguranca($map_file)
{
	if (file_exists($map_file))
	{
		if ($objMapa = @ms_newMapObj($map_file))
		{
			$nmf = str_replace(".map","seguranca.map",$map_file);
			$objMapa->save($nmf);
		}
		else
		{
			$nmf = str_replace(".map","seguranca.map",$map_file);
			if(file_exists($nmf))
			{
				if ($objMapa = @ms_newMapObj($nmf))
				{$objMapa->save($map_file);}
			}
			else
			{
				$nmf = str_replace(".map","reinc.map",$map_file);
				if ($objMapa = @ms_newMapObj($nmf))
				{$objMapa->save($nmf);}
			}
		}
	}
	else
	{
		copy((str_replace(".map","seguranca.map",$map_file)),$map_file);
	}
}
/*
Function: listaDiretorios

Retorna lista de diretórios.

parameters:

$diretorio {string} - Raiz onde ser&aacute; feita a busca.

Retorno:

{array}
*/
function listaDiretorios($diretorio)
{
	if (is_dir($diretorio))
	{
		$dirs = array();
		$d = dir($diretorio);
		while (($nd = $d->read()) != FALSE)
		{
			if ($nd != "." && $nd != "..")
			{
				$ext = explode(".",$nd);
				if (count($ext)==1)
				$dirs[] = $nd;
			}
		}
		return $dirs;
	}
	else
	{return "erro";}
}
/*
Function: listaArquivos

Retorna lista de arquivos.

Parametro:

$diretorio {string} - Raiz onde ser&aacute; feita a busca.

Retorno:

{array}
*/
function listaArquivos($diretorio)
{
	if (!is_dir($diretorio))
	{
		$diretorio = "../".$diretorio;
	}
	if (is_dir($diretorio))
	{
		$dirs = array();
		$arqs = array();
		$d = dir($diretorio);
		while (($nd = $d->read()) != FALSE)
		{
			if ($nd != "." && $nd != "..")
			{
				$ext = explode(".",$nd);
				if (count($ext)>1)
				{$arqs[] = $nd;}
				if (count($ext)==1)
				{$dirs[] = $nd;}
			}
		}
		return array("diretorios"=>$dirs,"arquivos"=>$arqs);
	}
	else
	{return "erro";}
}
/*
Function: gravaDados

Grava as linhas de um array em um arquivo.

Parametros:

$dados {array} - Dados que ser&atilde;o gravados.

$arq {string} - Nome do arquivo que ser&aacute; gravado
*/
function gravaDados($dados,$arq)
{
	$fp = fopen($arq,"w");
	foreach ($dados as $dado)
	{
		fwrite($fp,$dado."\n");
	}
	fclose($fp);
}
/*
Function: listaTrueType

Lista as fontes true type.

L&ecirc; o arquivo fontes.txt existente no diretório symbols da instala&ccedil;&atilde;o do I3Geo.
O resultado &eacute; gravado em um arquivo tempor&aacute;rio para include, o que torna mais r&aacute;pida a carga futura.
O arquivo para include armazena a vari&aacute;vel res que cont&eacute;m a lista de fontes separadas por v&iacute;rgula.

Parametros:

$cp {CAPAINT} - Objeto CPAINT.

$locaplic {string} - Localiza&ccedil;&atilde;o da aplica&ccedil;&atilde;o no servidor.

$imgdir {string} - Diretório das imagens.

$dir_tmp {string} - Diretório tempor&aacute;rio.

Retorno:

{string}
*/
function listaTrueType()
{
	global $locaplic,$imgdir,$dir_tmp;
	if (!file_exists($dir_tmp."/comum/truetype.inc"))
	{
		$arq = $locaplic."/symbols/fontes.txt";
		$h = fopen ($arq,"r");
		while ($i = fscanf ($h, "%s\t%s\t"))
		{
			list ($f,$g) = $i;
			$nome[] = $f;
		}
		$res = implode(",",$nome);
		$f = fopen($dir_tmp."/".$imgdir."/truetype.inc",'w');
		fwrite($f,"<?php \$res = '".$res."';?>");
		fclose($f);
		copy($dir_tmp."/".$imgdir."/truetype.inc",$dir_tmp."/comum/truetype.inc");
	}
	else
	{include ($dir_tmp."/comum/truetype.inc");}
	return($res);
}
/*
Section: mapa
*/
/*
Function: substituiCon

Substitu&iacute; a string de conex&atilde;o com o banco postgis pela string definida na inicializa&ccedil;&atilde;o (ms_configura.php)

Parametros:

$map_file {string} - arquivo mapfile

$postgis_mapa {array} - lista de strings de conex&atilde;o com o banco

Retorno:

{boleano}
*/
function substituiCon($map_file,$postgis_mapa)
{
	error_reporting(0);
	if (!empty($postgis_mapa) && (file_exists($map_file)))
	{
		if(!@ms_newMapObj($map_file)){return false;}
		$objMap = ms_newMapObj($map_file);
		$numlayers = $objMap->numlayers;
		for ($i=0;$i < $numlayers;++$i)
		{
			$layer = $objMap->getlayer($i);
			if ($layer->connectiontype == MS_POSTGIS)
			{
				$lcon = $layer->connection;
				if (($lcon == " ") || ($lcon == "") || (in_array($lcon,array_keys($postgis_mapa))))
				{
					//
					//o metadata CONEXAOORIGINAL guarda o valor original para posterior substitui&ccedil;&atilde;o
					//
					if(($lcon == " ") || ($lcon == ""))
					{
						$layer->set("connection",$postgis_mapa);
						$layer->setmetadata("CONEXAOORIGINAL",$lcon);
					}
					else
					{
						$layer->set("connection",$postgis_mapa[$lcon]);
						$layer->setmetadata("CONEXAOORIGINAL",$lcon);
					}
				}
			}
		}
		$objMap->save($map_file);
	}
	return true;
}
/*
Function: restauraCon

Esconde a string de conex&atilde;o com o banco, caso necess&aacute;rio

Parametros:

$map_file {string} - arquivo mapfile

$postgis_mapa {string} - lista de conex&atilde;o com o banco
*/
function restauraCon($map_file,$postgis_mapa)
{
	if(!@ms_newMapObj($map_file)){return;}
	if (!empty($postgis_mapa))
	{
		$objMap = ms_newMapObj($map_file);
		$numlayers = $objMap->numlayers;
		for ($i=0;$i < $numlayers;++$i)
		{
			$layer = $objMap->getlayer($i);
			if ($layer->connectiontype == MS_POSTGIS)
			{
				if (!is_array($postgis_mapa) && $layer->connection == $postgis_mapa)
				{$layer->set("connection"," ");}
				if($layer->getmetadata("conexaooriginal") != "")
				{$layer->set("connection",$layer->getmetadata("conexaooriginal"));}
			}
		}
		$objMap->save($map_file);
	}
}
/*
Function: retornaReferencia

Retorna uma string com as variaveis de um novo mapa de referencia.

Globais:

$nomeImagem {string} - Nome da imagem do corpo do mapa.

$objMapa {objeto} - Objeto map.

$utilizacgi {string} - indica se o mapserver CGI est&aacute; em uso

$locmapserv	{string} - localliza&ccedil;&atilde;o do mapserver CGI

$map_file {string} - mapfile que ser&aacute; processado

Parametros:

$ext {string} - (opcional) extens&atilde;o geogr&aacute;fica do mapa

Retorno:

string contendo vari&aacute;veis no formato javascript
*/
function retornaReferencia($ext="")
{
	global $nomeImagem,$objMapa,$utilizacgi,$locmapserv,$map_file;
	if($ext && $ext != ""){
		$e = explode(" ",$ext);
		$extatual = $objMapa->extent;
		$extatual->setextent((min($e[0],$e[2])),(min($e[1],$e[3])),(max($e[0],$e[2])),(max($e[1],$e[3])));
	}
	//
	//pega a extensao original caso ela tenha sido registrada no modo dinamico
	//
	$original = $objMapa->getmetadata("referenciaextentoriginal");
	$ref = $objMapa->reference;
	$c = $ref->color;
	$c->setrgb(-1,-1,-1);
	$c = $ref->outlinecolor;
	$c->setrgb(-1,-1,-1);
	$em = $ref->extent;
	if($original != "")
	{
		$original = explode(" ",$original);
		$em->set("minx",$original[0]);
		$em->set("miny",$original[1]);
		$em->set("maxx",$original[2]);
		$em->set("maxy",$original[3]);
		//$objMapa->setmetadata("referenciaextentoriginal","");
	}
	//$objMapa->save($map_file);
	$objMapa->preparequery();
	$objImagem = $objMapa->drawreferencemap();
	$nomer = ($objImagem->imagepath)."ref".$nomeImagem.".png";
	$objImagem->saveImage($nomer);
	$nomer = ($objImagem->imageurl).basename($nomer);
	$d = (abs($em->maxx - $em->minx)) / ($objImagem->width);
	$s = "g_celularef = ".$d.";";
	$s .= "var extentref = '".$em->minx." ".$em->miny." ".$em->maxx." ".$em->maxy."';";
	$s .=  "var refimagem='".$nomer."';var refwidth=".$objImagem->width.";var refheight=".$objImagem->height.";var refpath='".$objImagem->imagepath."';var refurl='".$objImagem->imageurl."'";
	return($s);
}
/*
Function: retornaReferenciaDinamica

Retorna uma string com as variaveis de um novo mapa de referencia gerado de forma dinamica.

O mapa de refer&ecirc;ncia &eacute; baseado no mapfile aplicmap/referenciadinamica.map ou no mapa atual

Globais:

$nomeImagem {string} - Nome da imagem do corpo do mapa.

$objMapa {objeto} - Objeto map.

$utilizacgi {string} - indica se o mapserver CGI est&aacute; em uso

$locmapserv	{string} - localliza&ccedil;&atilde;o do mapserver CGI

$map_file {string} - mapfile que ser&aacute; processado

$locaplic {string} - onde o i3geo est&aacute; instalado

$zoom - fator de zoom

$tipo - tipo de refer&ecirc;ncia dinamico|mapa

$interface - interface do mapa atual openlayers|googlemaps|googleearth

Parametros:

$ext {string} - (opcional) extens&atilde;o geogr&aacute;fica do mapa

Retorno:

String contendo vari&aacute;veis no formato javascript
*/
function retornaReferenciaDinamica($ext="")
{
	global $nomeImagem,$map_file,$utilizacgi,$locmapserv,$locaplic,$zoom,$tipo,$interface;
	//
	//adiciona o tema com o web service com o mapa mundi
	//
	$objMapa = ms_newMapObj($map_file);
	if($interface == "googlemaps")
	{$objMapa->setProjection("init=epsg:4618,a=6378137,b=6378137");}
	if($ext && $ext != ""){
		$e = explode(" ",$ext);
		$extatual = $objMapa->extent;
		$extatual->setextent((min($e[0],$e[2])),(min($e[1],$e[3])),(max($e[0],$e[2])),(max($e[1],$e[3])));
	}
	$numlayers = $objMapa->numlayers;
	for ($i=0;$i < $numlayers;++$i)
	{
		$layer = $objMapa->getlayer($i);
		if($tipo != "mapa")
		$layer->set("status",MS_OFF);
	}
	$maptemp = ms_newMapObj($locaplic."/aplicmap/referenciadinamica.map");
	$nomeLayerRef = "";
	if($tipo != "mapa")
	{
		$layern = $maptemp->getlayerbyname("refdin");
		ms_newLayerObj($objMapa, $layern);
	}
	$layern = $maptemp->getlayerbyname("refdinrect");
	ms_newLayerObj($objMapa, $layern);

	$r = $objMapa->reference;
	$w = $r->width;
	$h = $r->height;
	$emt = $objMapa->extent;
	$em = ms_newRectObj();
	$em->set("minx",$emt->minx);
	$em->set("miny",$emt->miny);
	$em->set("maxx",$emt->maxx);
	$em->set("maxy",$emt->maxy);
	$objMapa->setsize($w,$h);
	$scalebar = $objMapa->scalebar;
	$scalebar->set("status",MS_OFF);
	$leg = $objMapa->legend;
	$leg->set("status",MS_OFF);
	$objMapa->preparequery();
	$pt = ms_newPointObj();
	$pt->setXY(($w/2),($h/2));
	$objMapa->zoompoint($zoom, $pt,$w,$h,$objMapa->extent);
	$objImagem = $objMapa->draw();
	$em->draw($objMapa, ($objMapa->getlayerbyname("refdinrect")), $objImagem,0,"");
	$nomer = ($objImagem->imagepath)."ref".$nomeImagem.".png";
	$objImagem->saveImage($nomer);
	$nomer = ($objImagem->imageurl).basename($nomer);
	$s =  "var refimagem='".$nomer."';var refwidth=".$objImagem->width.";var refheight=".$objImagem->height.";var refpath='".$objImagem->imagepath."';var refurl='".$objImagem->imageurl."'";
	$mapa = ms_newMapObj($map_file);
	if($interface == "googlemaps")
	{$mapa->setProjection("init=epsg:4618");}
	$ref = $mapa->reference;
	$r = $ref->extent;
	//
	//guarda a extensao original para quando o modo din&acirc;mico parar
	//
	$original = $mapa->getmetadata("referenciaextentoriginal");
	if($original == "")
	{
		$original = $r->minx." ".$r->miny." ".$r->maxx." ".$r->maxy;
		$mapa->setmetadata("referenciaextentoriginal",$original);
	}
	$s .= ";var extentref = '".$emt->minx." ".$emt->miny." ".$emt->maxx." ".$emt->maxy."';";
	$d = (abs($emt->maxx - $emt->minx)) / ($objImagem->width);
	$s .= "g_celularef = ".$d.";";
	$emt = $objMapa->extent;
	$r->set("minx",$emt->minx);
	$r->set("miny",$emt->miny);
	$r->set("maxx",$emt->maxx);
	$r->set("maxy",$emt->maxy);
	//$mapa->save($map_file);
	return($s);
}
/*
Function: testaMapa

Testa se um mapa est&aacute; &iacute;ntegro.

Se o mapfile apresentar problemas, a cópia de seguran&ccedil;a &eacute; restaurada.

Parametro:

$map_file {string} - Arquivo map file.

$postgis_mapa {array} - lista de strings de conex&atilde;o com o banco de dados definida em ms_configura.php

Retorno:

{string} - erro|ok
*/
function testaMapa($map_file,$postgis_mapa)
{
	substituiCon($map_file,$postgis_mapa);
	$objMapa = ms_newMapObj($map_file);
	ms_ResetErrorList();
	$img = $objMapa->draw();
	$erros = "";
	$error = ms_GetErrorObj();
	while($error && $error->code != MS_NOERR)
	{
		$erros .= $error->routine;
		$error = $error->next();
	}
	$error = ms_GetErrorObj();
	if ($error->code != MS_NOERR)
	{
		$nmf = str_replace(".map","seguranca.map",$map_file);
		$objMapa = ms_newMapObj($nmf);
		$objMapa->save($map_file);
		$erros = str_replace("\n","",$erros);
		$erros = str_replace("\"","",$erros);
		$erros = str_replace("'","",$erros);
		$erros = str_replace(":"," ",$erros);
		$erros = str_replace("..."," ",$erros);
		$erros = str_replace("("," ",$erros);
		$erros = str_replace(")"," ",$erros);
		$erros = str_replace("*"," ",$erros);
		$erros = str_replace("/"," ",$erros);
		$erros = htmlentities($erros);
		return $erros;
	}
	else
	{return "ok";}
}
/*
Function: desligamargem

Desliga o mapa de refer&ecirc;ncia e a barra de escala de um mapa.

Parametro:

$objmapa {objeto} - Objeto map.

Retorno:

Objeto map alterado.
*/
function desligamargem($objmapa)
{
	$ref = $objmapa->reference;
	$ref->set("status",MS_OFF);
	$sca = $objmapa->scalebar;
	$sca->set("status",MS_OFF);
	return $objmapa;
}
/*
Function: desligaTemas

Desliga todos os temas de um mapa.

Parametro:

$objMapa {objeto} - Objeto map.

Retorno:

Objeto map alterado.
*/
function desligaTemas($objMapa)
{
	$numlayers = $objMapa->numlayers;
	for ($i=0;$i < $numlayers;++$i)
	{
		$layer = $objMapa->getlayer($i);
		$layer->set("status",MS_OFF);
	}
	return $objMapa;
}
/*
Function: extPadrao

Aplica o valor da extensao geogr&aacute;fica padrao a um objeto map.

Parametro:

$oMap {objeto} - objeto mapa
*/
function extPadrao($oMap)
{
	$ext = "-160 -70 160 70";
	$extform = explode(" ",$ext);
	$extatual = $oMap->extent;
	$xmin = min($extform[0],$extform[2]);
	$xmax = max($extform[0],$extform[2]);
	$ymin = min($extform[1],$extform[3]);
	$ymax = max($extform[1],$extform[3]);
	$extatual->setextent($xmin,$ymin,$xmax,$ymax);
	return $oMap;
}
/*
Function: gravaImagemMapa

Grava a imagem do mapa atual

Parametro:

$mapa - objeto mapa ou arquivo mapfile

Retorno:

{array} - array("url"=>,"arquivo"=>) ou falso se ocorrer erro

*/
function gravaImagemMapa($mapa)
{
 	if(is_string($mapa))
 	{$mapa = ms_newMapObj($mapa);}
 	$imgo = @$mapa->draw();
	if(!$imgo)
	{
		return array("url"=>"","arquivo"=>"");
	}
	$nome = ($imgo->imagepath).nomeRandomico().".png";
	$salva = $imgo->saveImage($nome);
	if ($salva != -1)
	{
		$retorno = array("url"=>($imgo->imageurl).basename($nome),"arquivo"=>$nome);
		//$imgo->free();
	}
	else
	{$retorno = false;}
	return $retorno;
}
/*
Section: atributos
*/
/*
Function: pegaValores

Pega os valores de um item de um tema.

Parametros:

$layer {objeto} - Layer que ser&aacute; processado.

$item {string} - Item que ser&aacute; processado.

$numerico {boleano} - O item e numerico (true ou false).

$ignorar {string} - valor que ser&aacute; ignorado na listagem final

Retorno:

{array}
*/
function pegaValores($mapa,$layer,$item,$numerico=false,$ignorar="")
{
	$layer->set("template","none.htm");
	$layer->setfilter("");
	$versao = versao();
	$versao = $versao["principal"];
	$ignorararray = explode(",",$ignorar);
	if (@$layer->queryByrect($mapa->extent) == MS_SUCCESS)
	{
		$sopen = $layer->open();
		if($sopen == MS_FAILURE){
			return "erro";
		}
		$res_count = $layer->getNumresults();
		$valitem = array();
		for ($i=0;$i<$res_count;++$i)
		{
			if($versao == 6)
			{
				$shape = $layer->getShape($layer->getResult($i));
			}
			else{
				$result = $layer->getResult($i);
				$shp_index  = $result->shapeindex;
				$shape = $layer->getfeature($shp_index,-1);
			}
			$v = trim($shape->values[$item]);
			if ($numerico)
			{
				if (is_numeric($v))
				{
					if ($ignorar == "")
					{
						$valitem[] = $v;
					}
					else
					{
						//if ($v != $ignorar)
						if(!in_array($v,$ignorararray))
						{
							$valitem[] = $v;
						}
					}
				}
			}
			else
			{
				if ($ignorar == "")
				{
					$valitem[] = $v;
				}
				else
				{
					if(!in_array($v,$ignorararray))
					{
						$valitem[] = $v;
					}
				}
			}
		}
		$fechou = $layer->close();
	}
	$layer->close();
	return ($valitem);
}
/*
Function: pegaValoresM

Pega os valores de m&uacute;ltiplos itens de um tema.

Se for passado apenas um item, o array de retorno ser&aacute; unidimensional.

Parametros:

$layer {objeto} - Layer que ser&aacute; processado.

$itens {array} - Itens que ser&atilde;o processados.

$exclui {string} - O registro n&atilde;o ser&aacute; considerado se um dos valores for igual a esse valor.

$selecionados {string} - sim|nao Utiliza apenas os selecionados ou todos

$chaves {boolean} - inclui ou n&atilde;o os nomes dos itens como chave no array resultante

$centroide {boolean} - captura ou n&atilde;o o WKT com o centroide do elemento

Retorno:

{array}
*/
function pegaValoresM($mapa,$layer,$itens,$exclui="nulo",$selecionados="nao",$chaves=false,$centroide=false)
{
	$versao = versao();
	$versao = $versao["principal"];
	$prjMapa = $mapa->getProjection();
	$prjTema = $layer->getProjection();
	$layer->set("template","none.htm");
	$layer->setfilter("");

	$indicesel = array();
	//pega os valores dos indices dos elementos selecionados para comparacao posterior
	if ($selecionados == "sim")
	{
		$sopen = $layer->open();
		if($sopen == MS_FAILURE){return "erro";}
		$res_count = $layer->getNumresults();
		for ($i = 0; $i < $res_count; ++$i)
		{
			$result = $layer->getResult($i);
			$indicesel[] = $result->shapeindex;
		}
		$layer->close();
	}
	$valores = array();
	$nclasses = $layer->numclasses;
	if (@$layer->queryByrect($mapa->extent) == MS_SUCCESS)
	{
		//$layer->draw();
		$sopen = $layer->open();
		if($sopen == MS_FAILURE){return "erro";}
		$res_count = $layer->getNumresults();

		for ($i=0;$i<$res_count;++$i)
		{
			if($versao == 6){
				$shape = $layer->getShape($layer->getResult($i));
				$shp_index = $shape->index;
			}
			else{
				$result = $layer->getResult($i);
				$shp_index  = $result->shapeindex;
				$shape = $layer->getfeature($shp_index,-1);
			}
			if (($selecionados == "sim") && (array_search($shp_index,$indicesel) === FALSE))
			{continue;}
			$considera = "sim";
			//verifica se no registro deve ser considerado
			if ($exclui != "nulo")
			{
				foreach ($itens as $item)
				{if($shape->values[$item] == $exclui){$considera = "nao";}}
			}
			//pega os valores
			$v = array();
			if ($considera == "sim")
			{
				foreach ($itens as $item){
					if($chaves == false)
					{$v[] = $shape->values[$item];}
					else
					{$v[$item] = $shape->values[$item];}
				}
				if($centroide == true){
					$c = $shape->getCentroid();
					if (($prjTema != "") && ($prjMapa != $prjTema))
					{
						$projOutObj = ms_newprojectionobj($prjTema);
						$projInObj = ms_newprojectionobj($prjMapa);
						$c->project($projInObj, $projOutObj);
					}
					$v["centroide"] = "POINT(".$c->x." ".$c->y.")";
				}
				if($nclasses > 0){
					$classe = $layer->getclass($shape->classindex);
					$cor = $classe->getstyle(0)->color;
					$v["cores"] = $cor->red." ".$cor->green." ".$cor->blue;
				}
				if (count($v) == 1)
				{$valores[] = $v[0];}
				else
				{$valores[] = $v;}
			}
		}
		$layer->close();
	}
	return ($valores);
}
/*
Function: agrupaValores

Agrupa os valores de um array por um m&eacute;todo de c&aacute;lculo.

No caso de soma e m&eacute;dia, ser&aacute; considerado apenas um item e uma chave.

Parametros:

$lista {array} - Lista com os arrays contendo os dados que ser&atilde;o processados.

$indiceChave {string} - &Iacute;ndice do array da lista que ser&aacute; considerado como a chave do array.

$indiceValor {string} - &Iacute;ndice do array da lista que ser&aacute; considerado como o valor.

$tipo {string} - Tipo de processamento soma|media|contagem|nenhum.

Retorno:

{array}
*/
function agrupaValores($lista,$indiceChave,$indiceValor,$tipo)
{
	$valores = null;
	foreach ($lista as $linha)
	{
		$c = $linha[$indiceChave];
		$v = $linha[$indiceValor];
		if ($tipo == "conta")
		{
			if(@$valores[$c])
			$valores[$c] = $valores[$c] + 1;
			else
			$valores[$c] = 1;
		}
		if (($tipo == "soma"))
		{
			if (($v != "") && (is_numeric($v)))
			{
				if(@$valores[$c])
				$valores[$c] = $valores[$c] + $v;
				else
				$valores[$c] = $v;
			}
		}
		if ($tipo == "media")
		{
			if (($v != "") && (is_numeric($v)))
			{
				if(@$soma[$c])
				$soma[$c] = $soma[$c] + $v;
				else
				$soma[$c] = $v;

				if(@$conta[$c])
				$conta[$c] = $conta[$c] + 1;
				else
				$conta[$c] = 1;
			}
		}
		if ($tipo == "nenhum")
		{
			//if (($v != "") && (is_numeric($v)))
			//{
				$valoresn[] = $v;
			//}
			$valores = $valoresn;
		}
	}
	if ($tipo == "media")
	{
		$chaves = array_keys($conta);
		foreach ($chaves as $c)
		{
			$valores[$c] = $soma[$c] / $conta[$c];
		}
	}
	return ($valores);
}
/*
Function: pegaItens

Pega os itens da tabela de atributos de um tema.

Parametro:

$layer {objeto} - objeto layer

Retorno:

{array}
*/
function pegaItens($layer,$mapa="")
{
	//
	//no caso de WMS ou WFS
	//
	if($layer->connectiontype == 7){
		$url = $layer->connection;
		$temp = explode("?",$url);
		if(count($temp) == 1)
		{$url .= "?";}
		$url = $url."&SERVICE=wfs&VERSION=1.1.0&REQUEST=DescribeFeatureType&TYPENAME=".$layer->getmetadata("wms_name");
		//$url = "http://ogi.state.ok.us/geoserver/wfs?VERSION=1.1.0&REQUEST=DescribeFeatureType&TYPENAME=okcounties";
		$xml = simplexml_load_file($url);
		if($xml == false)
		{return array();}
		$dom = new DOMDocument();
		$dom->loadXML($xml->asxml());
		$items = array();
		$sequences = $dom->getElementsByTagName("sequence");

		foreach ($sequences as $sq){
			$services = $sq->getElementsByTagName("element");
			foreach ($services as $s){
				$items[] = $s->getAttribute("name");
			}
		}
	}
	else{
		if($layer->type == MS_LAYER_RASTER && $mapa != ""){
			$pt = ms_newPointObj();
			$pt->setXY($mapa->extent->minx + (($mapa->extent->maxx - $mapa->extent->minx) / 2) ,$mapa->extent->miny + (($mapa->extent->maxy - $mapa->extent->miny) / 2));
			$layer->queryByPoint($pt,0,0);
		}
		$sopen = $layer->open();
		if($sopen != MS_FAILURE)
		{$items = $layer->getItems();}
		else
		{$items = array();}
		if($layer->type == MS_LAYER_RASTER)
		{$items[] = "pixel";}
		$layer->close();
	}
	return $items;
}
/*
Function: buscaRapida

Acessa um web service RPC de busca de nomes e retorna os resultados.

Parametros:

$servico {string} - Endereco do web service.

$palavra {string} - palavra de busca

Retorno:

{array} | "erro"
*/
function buscaRapida($servico,$palavra)
{
	//error_reporting(E_ALL);
	if(!function_exists('preg_match'))
	{
		include_once('../pacotes/SOAPdepreciado/nusoap.php');
		new Xsoapclient($servico."?wsdl","wsdl");
	}
	else
	{
		include_once('../pacotes/SOAP/nusoap.php');
		$soapclient = new nusoap_client($servico);
	}
//echo $soapclient->getDebug();
//exit;
	$vv = "erro";
	$vv = $soapclient->call("procurar",array("palavra"=>$palavra,"tipoBusca"=>"qualquer"));
	if($vv == ""){$vv = "erro";}
	return ($vv);
}
/*
Section: coordenadas
*/
/*
Function: ip2geo

Localiza a coordenada geogr&aacute;fica de um endere&ccedil;o IP.

Essa fun&ccedil;&atilde;o baseia-se no pacote geoIP, que deve estar instalado em pacotes/geoip.

Parametros:

$ip {string} - N&uacute;mero do IP.

Retorno:

{array}
*/
function ip2geo($ip,$locaplic="..")
{
	//$ip="200.252.111.1";
	$resultado = array();
	if (file_exists($locaplic."/pacotes/geoip/geoipcity.inc"))
	{
		include_once($locaplic."/pacotes/geoip/geoipcity.inc");
		include_once($locaplic."/pacotes/geoip/geoipregionvars.php");
		$gi = geoip_open($locaplic."/pacotes/geoip/GeoLiteCity.dat",GEOIP_STANDARD);
		$record = geoip_record_by_addr($gi,$ip);
		$resultado["country_code"] = $record->country_code . " " . $record->country_code3 . " " . $record->country_name;
		$resultado["region"] = $record->region . " " . $GEOIP_REGION_NAME[$record->country_code][$record->region];
		$resultado["city"] = $record->city;
		$resultado["postal_code"] =  $record->postal_code;
		$resultado["latitude"] =  $record->latitude;
		$resultado["longitude"] =  $record->longitude;
		$resultado["dma_code"] =  $record->dma_code;
		$resultado["area_code"] =  $record->area_code;
		$resultado["ip"] =  $ip;
		geoip_close($gi);
	}
	return($resultado);
}
/*
Function: xy2imagem

Converte coordenadas geograficas em coordenadas de imagem e retorna um ponto.

Parametros:

$map_file {string} - Arquivo map file.

$xy {string | array} - XY com as coordenadas (separado por espa&ccedil;o no caso de string)

Retorno:

{mapscript point}
*/
function xy2imagem($map_file,$xy)
{
	if (!is_array($xy))
	{$xy = explode(" ",$xy);}
	$pt = ms_newPointObj();
	$map = ms_newMapObj($map_file);
	$map = desligatemas($map);
	$map = desligamargem($map);
	$imgo = $map->draw();
	$e = $map->extent;
	$vx = ($e->minx * -1) - ($xy[0] * -1);
	$vy = ($xy[1] * -1) + ($e->maxy * 1);
	$c = $map->cellsize;
	$x = $vx / $c;
	$y = $vy / $c;
	$pt->setXY($x , $y);
	return $pt;
}
/*
Function: imagem2xy

Converte coordenadas de imagem em coordenadas geogr&aacute;ficas.

Parametros:

$map_file {string} - Arquivo map file.

$xy {array | string} - XY com as coordenadas (separado por espa&ccedil;o no caso de string)

Retorno:

{array}
*/
function imagem2xy($map_file,$xy)
{
	if (!is_array($xy))
	{$xy = explode(" ",$xy);}
	$map = ms_newMapObj($map_file);
	$map = desligatemas($map);
	$map = desligamargem($map);
	$imgo = $map->draw();
	$e = $map->extent;
	$c = $map->cellsize;
	$x = ($e->minx) + $xy[0] * $c;
	$y = ($e->maxy) - $xy[1] * $c;
	return array($x,$y);
}

/*
Function: xy2wkt

Converte coordenadas para wkt.

Parametro:

$xy {string} - Lista de pares de coordenadas xy separadas por espa&ccedil;o.

Retorno:

{start code}
array(
	"ponto"=>,
	"linha"=>,
	"poligono"=>
)
{end}
*/
function xy2wkt($xy)
{
	$apt = explode(" ",$xy);
	$shppt = ms_newshapeobj(MS_SHAPE_POINT);
	$shplin = ms_newshapeobj(MS_SHAPE_LINE);
	$shppol = ms_newshapeobj(MS_SHAPE_POLYGON);
	$lin = ms_newlineobj();
	$capt = count($apt);
	for ($i = 0;$i < $capt; $i = $i + 2)
	{$lin->addxy($apt[$i],$apt[$i + 1]);}
	$shppt->add($lin);
	if (count($apt) < 4)
	{
		$lin->addxy($apt[0],$apt[1]);
		$apt[] = $apt[0];
		$apt[] = $apt[1];
	}
	$shplin->add($lin);
	if (count($apt) < 6)
	{
		$lin->addxy($apt[0],$apt[1]);
		$apt[] = $apt[0];
		$apt[] = $apt[1];
	}
	if ($apt[0]." ".$apt[1] != ($apt[count($apt)-2]." ".$apt[count($apt)-1]))
	{$lin->addxy($apt[0],$apt[1]);}
	$shppol->add($lin);
	return array("ponto"=>$shppt->toWkt(),"linha"=>$shplin->toWkt(),"poligono"=>$shppol->toWkt());
}
/*
Function: geo2zonaUTM

Calcula a zona utm de um meridiano

Parametros:

$x {numerico dd} - longitude

Retorno:

{numerico}

*/
function geo2zonaUTM($x)
{
	$x = $x + 180;
	$x = $x / 6;
	return intval($x) + 1;
}
/*
Function: geo2utm

Converte coordenadas geogr&aacute;ficas para UTM

Parametros:

$x {numerico dd} - longitude

$y {numerico dd} - latitude

$zona {numerico} - zona UTM

Retorno:

{start code}
array(
	"x"=>,
	"y"=>,
	"zona"=>,
	"datum"=>"SAD-69"
)
{end}
*/
function geo2utm($x,$y,$zona)
{
	$projInObj = ms_newprojectionobj("proj=latlong");
	if($y < 0){$ns = "south";}
	else
	{$ns = "north";}
	$projOutObj = ms_newprojectionobj("proj=utm,zone=$zona,$ns,ellps=GRS67,units=m,no_defs");
	$poPoint = ms_newpointobj();
	$poPoint->setXY($x, $y);
	$poPoint->project($projInObj, $projOutObj);
	return array("x"=>round($poPoint->x,2),"y"=>round($poPoint->y,2),"zona"=>$zona,"datum"=>"SAD-69");
}
/*
Section: web services
*/
/*
Function: reSLD

Gera o SLD de um tema WMS.

Parametros:

$map_file {string} - arquivo map_file

$tema {string} - código do tema

$sld {string} - arquivo onde o sld ser&aacute; gravado
*/
function reSLD($map_file,$tema,$sld)
{
	$map = ms_newMapObj($map_file);
	$layer = $map->getlayerbyname($tema);
	$layer->set("name",$layer->getmetadata("nomeoriginal"));
	$tiporep = $layer->getmetadata("tipooriginal");
	$layer->set("type",MS_LAYER_POLYGON);
	if ($tiporep == "linear")
	{$layer->set("type",MS_LAYER_LINE);}
	if ($tiporep == "pontual")
	{$layer->set("type",MS_LAYER_POINT);}
	$sldf = $layer->generateSLD();
	if (file_exists($sld))
	{unlink($sld);}
	$fp = fopen($sld, "a");
	fputs( $fp, $sldf );
	fclose($fp);
}
/*
georssCanais (depreciado)

Lista os canais de um GeoRss.

Parametros:
$servico - Endere&ccedil;o do RSS.

$map_file - Nome do arquivo map file. Inclua o caminho completo no servidor.

$dir_tmp - Diretório onde o arquivo ser&aacute; criado.

$locaplic - Localiza&ccedil;&atilde;o do I3geo
*/
function georssCanais($servico,$map_file,$dir_tmp,$locaplic)
{
	$xml = simplexml_load_file($servico);
	//var_dump($xml);
	foreach($xml->channel as $c)
	{
		$resultado[] = array("title"=>(ixml($c,"title")),"link"=>(ixml($c,"link")),"description"=>(ixml($c,"description")),"category"=>(ixml($c,"category")));
	}
	//var_dump($resultado);
	return $resultado;
}

/*
Section: tema
*/
/*
Function: pegaNome

Retorna o nome correto de um layer verificando os elementos METADATA TEMA e ALTTEMA

Parametros:

$layer {objeto} - Objeto layer

$enc {string} - Código de p&aacute;gina para convers&atilde;o de caracteres

Retorno:

{string}
*/
function pegaNome($layer,$enc="AUTO")
{
	$nometmp = $layer->name;
	if (strtoupper($layer->getMetaData("TEMA")) != "NAO")
	{$nometmp = $layer->getMetaData("TEMA");}
	else if ($layer->getMetaData("ALTTEMA") != "")
	{$nometmp = $layer->getMetaData("ALTTEMA");}
	if (function_exists("mb_convert_encoding"))
	{
		$nometmp = mb_convert_encoding($nometmp,$enc,"ISO-8859-1");
	}
	return $nometmp;
}
/*
Function: criaLayer

Cria um objeto layer

Parametros:

$oMapa {objeto} - objeto mapa

$ms_tipo {MS_LAYER} - tipo de layer

$ms_status [MS_STATUS} - status de visibilidade

$metaTema {string} - nome do tema que ser&aacute; inclu&iacute;do no metadata TEMA

$metaClasse {string} - SIM|NAO indica se a classe &eacute; vis&iacute;vel ou n&atilde;o na legenda

$reposiciona {boolean} - reordena ou n&atilde;o o novo layer

Retorno:

{layer}
*/
function criaLayer($oMapa,$ms_tipo,$ms_status,$metaTema,$metaClasse="SIM",$reposiciona=true)
{
	$l = ms_newLayerObj($oMapa);
	$l->set("type",$ms_tipo);
	$l->set("name", nomeRandomico());
	$l->setmetadata("tema",$metaTema);
	$l->setmetadata("classe",$metaClasse);
	$l->set("status",$ms_status);
	$l->set("template","none.htm");
	$classe = ms_newClassObj($l);
	$classe->set("name","");
	$estilo = ms_newStyleObj($classe);
	$cor = $estilo->color;
	$cor->setrgb(0,255,255);
	$coro = $estilo->outlinecolor;
	$coro->setrgb(0,0,0);
	if ($ms_tipo == MS_LAYER_POINT)
	{
		$estilo->set( "size",4);
		$estilo->set("symbolname","ponto");
	}
	//reposiciona o layer na pilha
	if($reposiciona == true){
		$ltipo = $l->type;
		if (($ltipo == 2) || ($ltipo == 3))
		{
			$indicel = $l->index;
			$numlayers = $oMapa->numlayers;
			$nummove = 0;
			for ($i = $numlayers-1;$i > 0;$i--)
			{
				$layerAbaixo = $oMapa->getlayer($i);
				$tipo = $layerAbaixo->type;
				if (($tipo != 2) && ($tipo != 3))
				{$nummove++;}
			}
			if ($nummove > 2)
			{
				for ($i=0;$i<=($nummove - 3);++$i)
				{$oMapa->movelayerup($indicel);}
			}
		}
	}
	return $l;
}
/*
Function: criaSHP

Cria um arquivo shape file de um tema.

Parametros:

$tema {string} - Tema que ser&aacute; processado.

$map_file {string} - Nome do arquivo map file. Inclua o caminho completo no servidor.

$locaplic {string} - Diretório onde est&aacute; a aplica&ccedil;&atilde;o no servidor.

$dir_tmp {string} - Diretório tempor&aacute;rio

$nomeRand {boleano} - Gera um nome randomico para o shapefile (TRUE) ou utiliza o nome do tema (FALSE)

Retorno:

{string} - nome do arquivo criado ou false se ocorrer erro
*/
function criaSHP($tema,$map_file,$locaplic,$dir_tmp,$nomeRand=TRUE)
{
	$versao = versao();
	$versao = $versao["principal"];
	//para manipular dbf
	if(file_exists($locaplic."/pacotes/phpxbase/api_conversion.php"))
	include_once($locaplic."/pacotes/phpxbase/api_conversion.php");
	else
	include_once "../pacotes/phpxbase/api_conversion.php";
	$map = @ms_newMapObj($map_file);
	$layer = $map->getlayerbyname($tema);
	$layer->set("template","none.htm");
	$diretorio = dirname($dir_tmp);
	$tipol = MS_SHP_POINT;
	if ($layer->type == MS_LAYER_LINE){$tipol = MS_SHP_ARC;}
	if ($layer->type == MS_LAYER_POLYGON){$tipol = MS_SHP_POLYGON;}
	if ($nomeRand == true)
	{$novonomelayer = nomeRandomico(20);}
	else
	{$novonomelayer = $tema;}
	$nomeshp = $dir_tmp."/".$novonomelayer;
	if(file_exists($nomeshp.".shp"))
	{return $nomeshp;}
	$novoshpf = ms_newShapefileObj($nomeshp, $tipol);
	//se for do tipo features
	$data = $layer->data;
	$resultadoFinal = true;
	if ($data == "")
	{
		$def[] = array("ID","C","50");
		$reg[] = 0;
		if(!function_exists("dbase_create")){
			$db = xbase_create($nomeshp.".dbf", $def);
			xbase_add_record($db,$reg);
			xbase_close($db);
		}
		else{
			$db = dbase_create($nomeshp.".dbf", $def);
			dbase_add_record($db,$reg);
			dbase_close($db);
		}
		if($versao == 6)
		{$shape = $layer->getshape(new resultObj(0));}
		else{
			$s = $layer->getfeature(0,-1);
			$result = $layer->getResult(0);
			$shpi  = $result->shapeindex;
			$shape = $layer->getfeature($shpi,-1);
		}
		$novoshpf = ms_newShapefileObj($nomeshp.".shp", -2);
		$novoshpf->addShape($shape);
		$resultadoFinal = true;
	}
	else
	{
		$items = pegaItens($layer);
		// cria o dbf
		$def = array();
		$cni = 0;
		foreach ($items as $ni)
		{
			$temp = strtoupper($ni);
			$temp = substr($temp,0,8).$cni;
			//
			//nao tem como descobrir o tamanho e tipo do campo
			//
			$def[] = array($temp,"C","254");
			$cni = $cni + 1;
		}
		if(!function_exists("dbase_create"))
		{$db = xbase_create($nomeshp.".dbf", $def);}
		else
		{$db = dbase_create($nomeshp.".dbf", $def);}
		$dbname = $nomeshp.".dbf";
		$reg = array();
		$novoshpf = ms_newShapefileObj($nomeshp.".shp", -2);
		//le o arquivo de query se existir e checa se existe sele&ccedil;&atilde;o para o tema
		$existesel = carregaquery2($map_file,$layer,$map);
		if ($existesel == "nao")
		{@$layer->queryByrect($map->extent);}
		//pega cada registro
		$res_count = $layer->getNumresults();
		if ($res_count > 0)
		{
			$sopen = $layer->open();
			if($sopen == MS_FAILURE){return "erro";}
			for ($i = 0; $i < $res_count; ++$i)
			{
				if($versao == 6)
				{$shape = $layer->getShape($layer->getResult($i));}
				else{
					$result = $layer->getResult($i);
					$shp_index  = $result->shapeindex;
					$shape = $layer->getfeature($shp_index,-1);
				}
				foreach ($items as $ni)
				{
					$vreg = $shape->values[$ni];
					if(strlen($vreg) > 255){
					 $vreg = substr($vreg,0,255);
					}
					$reg[] = $vreg;
				}
				$novoshpf->addShape($shape);
				if(!function_exists("dbase_create"))
				xbase_add_record($db,$reg);
				else
				dbase_add_record($db,$reg);
				$reg = array();
			}
			if(!function_exists("dbase_create"))
			xbase_close($db);
			else
			dbase_close($db);
			$layer->close();
			//
			//verifica a quantidade de registros no final
			//
			if(function_exists("dbase_open"))
			$db = dbase_open($nomeshp.".dbf", 0);
			else
			$db = xbase_open($nomeshp.".dbf", 0);

			if(function_exists("dbase_numrecords"))
			$record_numbers = dbase_numrecords($db);
			else
			$record_numbers = xbase_numrecords($db);

			if(function_exists("dbase_close"))
			dbase_close($db);
			else
			xbase_close($db);
			if($record_numbers != $res_count){
				if(file_exists($nomeshp.".dbf"))
				{unlink($nomeshp.".dbf");}
				if(file_exists($nomeshp.".shp"))
				{unlink($nomeshp.".shp");}
				if(file_exists($nomeshp.".shx"))
				{unlink($nomeshp.".shx");}
				$resultadoFinal = false;
			}
		}
		else
		{$resultadoFinal = false;}
	}
	if($resultadoFinal == false)
	{return false;}
	else
	{return $nomeshp;}
}
/*
Function: downloadTema (depreciado)

Utilize downloadTema2
*/
function downloadTema($map_file,$tema,$locaplic,$dir_tmp,$postgis_mapa)
{
	$resultado = downloadTema2($map_file,$tema,$locaplic,$dir_tmp,$postgis_mapa);
	return $resultado["arquivos"];
}
/*
Function: downloadTema2

Faz o download dos dados de um tema.

Parametros:

$map_file {string} - Nome do arquivo map file. Inclua o caminho completo no servidor.

$tema {string} - Tema que ser&aacute; processado.

$locaplic {string} - Diretório da aplica&ccedil;&atilde;o.

$dir_tmp {string} - Diretório tempor&aacute;rio

$postgis_mapa - variavel definida em ms_configura.php

Retorno:

{array} com o nome do diretório e nome do arquivo

Include:
<ms_configura.php>
*/
function downloadTema2($map_file,$tema,$locaplic,$dir_tmp,$postgis_mapa)
{
	ini_set("max_execution_time","1800");
	if(file_exists($locaplic."/ms_configura.php"))
	include($locaplic."/ms_configura.php");
	else
	include("../ms_configura.php");
	$versao = versao();
	$versao = $versao["principal"];
	$dataArquivos = array();
	//
	//cria o arquivo mapfile, caso ele n&atilde;o exista, que servir&aacute; de base para obten&ccedil;&atilde;o dos dados
	//
	$nomeRand = true;
	//echo $versao;exit;
	if (($map_file == "") || (!@ms_newMapObj($map_file))) //a funcao foi chamada do aplicativo datadownload
	{
		if($base == "" or !isset($base)){
			$base = "";
			if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
			{$base = $locaplic."/aplicmap/geral1windowsv".$versao.".map";}
			else
			{
				if($base == "" && file_exists('/var/www/i3geo/aplicmap/geral1debianv'.$versao.'.map')){
					$base = "/var/www/i3geo/aplicmap/geral1debianv".$versao.".map";
				}
				if($f == "" && file_exists('/var/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
					$base = "/var/www/html/i3geo/aplicmap/geral1fedorav".$versao.".map";
				}
				if($f == "" && file_exists('/opt/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
					$base = "/opt/www/html/i3geo/aplicmap/geral1v".$versao.".map";
				}
				if($f == "")
				{$base = $locaplic."/aplicmap/geral1v".$versao.".map";}
			}
		}
		else{
			if(!file_exists($base))
			{$base = $locaplic."/aplicmap/".$base;}
		}
		$map_tmp = ms_newMapObj($base);
		$map_file = $dir_tmp."/".nomerandomico(20).".map";
		$map_tmp->save($map_file);
		$nomeRand = false;
	}
	//
	//verifica se o tema existe no mapfile
	//se n&atilde;o existir, tenta inserir com base no mapfile existente no diretório temas
	//o tema pode existir se a fun&ccedil;&atilde;o estiver sendo chamada da &aacute;rvore de temas de um mapa j&aacute; aberto
	//
	$temasdir = $locaplic."/temas";
	$map = ms_newMapObj($map_file);
	$rectextent = $map->extent;
	//
	//problema aqui
	//$tema pode ser diferente do nome do mapfile
	//
	$teste = @$map->getlayerbyname($tema);
	//caso o usuario tenha usado caixa alta no nome do layer
	if ($teste == "")
	{$teste = @$map->getlayerbyname(strtoupper($tema));}
	//se o layer n&atilde;o existir no mapfile, pega da pasta i3geo/temas e adiciona em $map
	if($teste == "")
	{
		$maptemp = ms_newMapObj($temasdir."/".$tema.".map");
		$temastemp = $maptemp->getalllayernames();
		foreach ($temastemp as $tt)
		{
			$ll = $maptemp->getlayerbyname($tt);
			$permite = $ll->getmetadata("permitedownload");
			if($permite != "nao")
			{ms_newLayerObj($map, $ll);}
		}
		$teste = @$map->getlayerbyname($tema);
		if ($teste == "")
		{
			$ll = $maptemp->getlayer(0);
			$permite = $ll->getmetadata("permitedownload");
			if($permite != "nao")
			{
				ms_newLayerObj($map, $ll);
				$tema = $ll->name;
			}
		}
	}
	else
	{
		//remove o metadata com um nome de arquivo opcional, pois a fun&ccedil;&atilde;o de download pode estar sendo executada da &aacute;rvore de camadas
		$teste = $map->getlayerbyname($tema);
		$teste->setmetadata("arquivodownload","");
	}
	//
	//salva o mapfile com um outro nome para evitar que o mapa atual, se estiver aberto, seja modificado
	//
	$map_file = str_replace(".map","tmp.map",$map_file);
	$map->save($map_file);
	substituiCon($map_file,$postgis_mapa);
	//$map_file agora contem os LAYERS necess&aacute;rios
	$map = ms_newMapObj($map_file);
	//
	//verifica se existe mais de um tema (grupo) montando o array com os temas
	//os grupos podem ter o nome do layer em GROUP ao inv&eacute;s de NAME
	//
	$multilayer = 0;
	$grupos = $map->getAllGroupNames();
	foreach ($grupos as $grupo)
	{
		if ($grupo == $tema)
		{$multilayer = 1;}
	}
	if ($multilayer == 1)
	{
		$temasnx = $map->getAllLayerNames();
		foreach ($temasnx as $l)
		{
			$gl = $map->getlayerbyname($l);
			$g = $gl->group;
			if (($g == $tema) || ($l == $tema))
			{$temas[] = $l;}
		}
	}
	if ($multilayer == 0)
	{$temas[] = $tema;}
	//$temas agora &eacute; um array com os NAMEs dos LAYERS que ser&atilde;o baixados
	$radtmp = dirname($dir_tmp);
	foreach ($temas as $tema)
	{
		$l = $map->getlayerbyname($tema);
		$novonomelayer = $tema;
		$nomeshp = $dir_tmp."/".$novonomelayer;
		if(file_exists($nomeshp.".dbf")){
			//
			//verifica se o arquivo est&aacute; vazio ou n&atilde;o
			//se estiver, apaga o arquivo
			//
			$verificaDBF = verificaDBF($nomeshp.".dbf");
			if($verificaDBF == false){
				unlink($nomeshp.".dbf");
				unlink($nomeshp.".shp");
				unlink($nomeshp.".shx");
			}
		}
		//
		//se existir um arquivo j&aacute; pronto, definido no metadata arquivodownload, ir&aacute; ser utilizado
		//
		$meta = $l->getmetadata("arquivodownload");
		if($meta != "")
		{
			//
			//se o arquivo n&atilde;o tiver sido copiado
			//
			$nomecopia = $dir_tmp."/".basename($meta);
			if(file_exists($meta))
			{
				if(!file_exists($nomecopia))
				{copy($meta,$nomecopia);}
			}
			$resultado[] = basename($dir_tmp)."/".basename($nomecopia);
		}
		else //se n&atilde;o existir arquivo definido
		{
			$dados = $l->data;
			//
			//se for imagem, copia o arquivo
			//
			if($l->type == MS_LAYER_RASTER)
			{
				if (file_exists($dados))
				{
					$dir = dirname($dados);
					$arq = explode(".",basename($dados));
					$nomecopia = $dir_tmp."/".$arq[0];
					$exts = array("jpg","jpw","tif","tifw","tfw","png","pngw","jpgw","wld","img");
					foreach($exts as $ext)
					{
						$copia = $nomecopia.".".$ext;
						if(!file_exists($copia) && file_exists($dir."/".$arq[0].".".$ext))
						{copy($dir."/".$arq[0].".".$ext,$copia);}
						if(file_exists($copia))
						$resultado[] = basename($dir_tmp)."/".basename($copia);
					}
				}
				else
				{return "erro";}
			}
			else //se for vetorial, extrai o arquivo
			{
				$nomeshp = criaSHP($tema,$map_file,$locaplic,$dir_tmp,$nomeRand);
				if($nomeshp == false)
				{return array("arquivos"=>"<span style=color:red >Ocorreu um erro, tente novamente","nreg"=>0);}

				$resultado[] = str_replace($radtmp."/","",$nomeshp).".shp";
				$dataArquivos[] = date ("F d Y H:i:s.",filemtime($nomeshp.".shp"));

				$resultado[] = str_replace($radtmp."/","",$nomeshp).".shx";
				$dataArquivos[] = date ("F d Y H:i:s.",filemtime($nomeshp.".shx"));

				$resultado[] = str_replace($radtmp."/","",$nomeshp).".dbf";
				$dataArquivos[] = date ("F d Y H:i:s.",filemtime($nomeshp.".dbf"));
			}
		}
	}
	$nreg = "";
	if(count($resultado) == 3){
		$arq = $radtmp."/".$resultado[2];
		if(function_exists("dbase_open")){
			$db = dbase_open($arq, 0);
			if($db){$nreg = dbase_numrecords($db);}
		}
		else{
			$db = xbase_open($arq, 0);
			if($db){$nreg = xbase_numrecords($db);}
		}
	}
	//
	//gera um mapfile para download
	//
	$nomemapfileurl = "";
	if(file_exists($temasdir."/".$tema.".map")){
		$maptemp = ms_newMapObj($temasdir."/".$tema.".map");
		$temas = $maptemp->getAllLayerNames();
		foreach ($temas as $l)
		{
			$gl = $maptemp->getlayerbyname($l);
			$gl->set("data","");
			$gl->set("connection","");
		}
		$nomemapfile = $dir_tmp."/".nomerandomico(20)."download.map";

		$ext = $maptemp->extent;
		$ext->setextent($rectextent->minx,$rectextent->miny,$rectextent->maxx,$rectextent->maxy);
		$maptemp->save($nomemapfile);
		$nomemapfileurl = str_replace($radtmp."/","",$nomemapfile);
	}
	return array("tema"=>$tema,"mapfile"=>$nomemapfile,"mapfileurl"=>$nomemapfileurl,"arquivos"=>implode(",",$resultado),"nreg"=>$nreg,"datas"=>$dataArquivos);
}

/*
Function: verificaDBF

Verifica se um arquivo dbf est&aacute; ou n&atilde;o vazio

Parametros:

$arq {string} - nome do arquivo dbf

Return:

{boolean} - true indica que n&atilde;o est&aacute; vazio
*/
function verificaDBF($arq){
	if(function_exists("dbase_open"))
		$db = dbase_open($arq, 0);
	else{
		if(file_exists("../../pacotes/phpxbase/api_conversion.php"))
		{include_once("../../pacotes/phpxbase/api_conversion.php");}
		else
		{include_once "../pacotes/phpxbase/api_conversion.php";}
		$db = xbase_open($arq, 0);
	}
	//nas vers&otilde;es novas do PHP open retorna vazio, n&atilde;o d&aacute; pra verificar
	//if ($db) {
		if(function_exists("dbase_numrecords")){
			$record_numbers = dbase_numrecords($db);
			dbase_close($db);
		}
		else{
			$record_numbers = xbase_numrecords($db);
			xbase_close($db);
		}
		if ($record_numbers > 0)
		{return true;}
		else
		{return false;}
	//}
	//else {return false;}
}
/*
Section: Outros
*/
/*
Function: calculaAreaPixel

Calcula a &aacute;rea em m2 de um pixel do mapa

O c&aacute;lculo &eacute; feito projetando-se o mapa atual para a proje&ccedil;&atilde;o polic&ocirc;nica

Parametros:

$map_file {string} - arquivo do mapa

$celsize {numerico} - tamanho do pixel em d&eacute;cimos de grau

Retorno:

{Numerico} - &aacute;rea em metros quadrados
*/
function calculaAreaPixel($map_file,$celsize)
{
	$mapa = ms_newMapObj($map_file);
	$rect = $mapa->extent;
	$projInObj = ms_newprojectionobj("proj=latlong");
	$projOutObj = ms_newprojectionobj("proj=poly,ellps=GRS67,lat_0=0,lon_0=".$rect->minx.",x_0=5000000,y_0=10000000");
	$y = $rect->maxy - ((($rect->maxy) - ($rect->miny)) / 2);
	$x = $rect->maxx - ((($rect->maxx) - ($rect->minx)) / 2);
	$shape = ms_newShapeObj(MS_SHAPE_POLYGON);
	$linha = ms_newLineObj();
	$linha->addXY($x,$y);
	$linha->addXY(($x+$celsize),$y);
	$linha->addXY(($x+$celsize),($y-$celsize));
	$linha->addXY($x,($y-$celsize));
	$linha->addXY($x,$y);
	$shape->add($linha);
	$shape->project($projInObj,$projOutObj);
	$s = $shape->towkt();
	$shape = ms_shapeObjFromWkt($s);
	$area = $shape->getArea();
	return $area;
}
/*
Function: pegaIPcliente

Pega o IP do cliente

Retorno:

{string}
*/
function pegaIPcliente()
{
	$ip = "UNKNOWN";
	if (getenv("HTTP_CLIENT_IP")) $ip = getenv("HTTP_CLIENT_IP");
	else if(getenv("HTTP_X_FORWARDED_FOR")) $ip = getenv("HTTP_X_FORWARDED_FOR");
	else if(getenv("REMOTE_ADDR")) $ip = getenv("REMOTE_ADDR");
	else $ip = "UNKNOWN";
	//$ip = "200.252.111.1";//teste
	return $ip;
}
/*
Function: pegaIPcliente2

Pega o IP do cliente sem REMOTE_ADDR

Retorno:

{string}
*/
function pegaIPcliente2()
{
	$ip = "UNKNOWN";
	if(getenv("HTTP_X_FORWARDED_FOR")) $ip = getenv("HTTP_X_FORWARDED_FOR");
	else if(getenv("REMOTE_ADDR")) $ip = getenv("REMOTE_ADDR");
	else $ip = "UNKNOWN";
	return $ip;
}
/*
Function: versao

Retorna a vers&atilde;o do Mapserver.

Retorno:

{array} - array("completa"=>,"principal"=>)
*/
function versao()
{
	$v = "5.0.0";
	$vs = explode(" ",ms_GetVersion());
	$cvs = count($vs);
	for ($i=0;$i<$cvs;++$i)
	{
		if(trim(strtolower($vs[$i])) == "version")
		{$v = $vs[$i+1];}
	}
	$versao["completa"] = $v;
	$v = explode(".",$v);
	$versao["principal"] = $v[0];
	return $versao;
}
/*
Function: iXml

Retorna o valor de um elemento xml

Parameter:

$no - objeto representando o elemento xml

$nome - nome do elemento
*/
function ixml($no,$nome)
{
	return mb_convert_encoding($no->$nome,"HTML-ENTITIES","auto");
}
/*
Function: autoClasses

Gera as classes do layer com base em valores definidos na tabela de atributos.

Os par&acirc;metros para montagem das classes s&atilde;o definidos em metadados do layer.

Parametros:

$nlayer {objeto} - objeto layer que ser&aacute; processado

$mapa {objeto} - objeto mapa que ser&aacute; processado

Retorno:

{objeto} layer modificado
*/
function autoClasses(&$nlayer,$mapa,$locaplic=null)
{
	$postgis_mapa = "";
	$substituicon = "nao";
	if(!isset($locaplic))
	{
		if(file_exists("ms_configura.php"))
		include("ms_configura.php");
		else
		include("../ms_configura.php");
	}
	else
	{include_once("$locaplic/ms_configura.php");}
	if ($nlayer->connectiontype == MS_POSTGIS)
	{
		if ($nlayer->connection == " ")
		{
			$nlayer->set("connection",$postgis_mapa);
			$substituicon = "sim";
		}
	}
	//
	//gera classes automaticamente (temas vetoriais)
	if($nlayer->getmetadata("classesitem") != "")
	{
		$itemnome = $nlayer->getmetadata("classesnome");
		$itemid = $nlayer->getmetadata("classesitem");
		$itemcor = $nlayer->getmetadata("classescor");
		$itemsimbolo = $nlayer->getmetadata("classesimbolo");
		$itemtamanho = $nlayer->getmetadata("classestamanho");
		$classeoriginal = $nlayer->getclass(0);
		//
		//pega a extensao geografica que devera ser utilizada
		//
		$prjMapa = $mapa->getProjection();
		$prjTema = $nlayer->getProjection();
		$ret = $nlayer->getmetadata("extensao");
		if ($ret == "")
		{
			$ret = $nlayer->getextent();
			//reprojeta o retangulo
			if (($prjTema != "") && ($prjMapa != $prjTema))
			{
				$projInObj = ms_newprojectionobj($prjTema);
				$projOutObj = ms_newprojectionobj($prjMapa);
				$ret->project($projInObj, $projOutObj);
			}
		}
		else
		{
			$temp = explode(" ",$ret);
			$ret = ms_newRectObj();
			$ret->setextent($temp[0],$temp[1],$temp[2],$temp[3]);
		}
		//
		$sopen = $nlayer->open();
		if($sopen == MS_FAILURE){return "erro";}

		$status = $nlayer->whichShapes($ret);
		$parametrosClasses = array();
		if ($status == 0)
		{
			while ($shape = $nlayer->nextShape())
			{
				$id = trim($shape->values[$itemid]);
				if (!$parametrosClasses[$id])
				{
					$nome = "";
					if($itemnome != "")
					$nome = trim($shape->values[$itemnome]);
					$cor = "";
					if($itemcor != "")
					$cor = explode(",",trim($shape->values[$itemcor]));
					if(count($cor) != 3)
					$cor = explode(" ",trim($shape->values[$itemcor]));
					$tamanho = "";
					if($itemtamanho != "")
					$tamanho = trim($shape->values[$itemtamanho]);
					$simbolo = "";
					if($itemsimbolo != "")
					$simbolo = trim($shape->values[$itemsimbolo]);
					$parametrosClasses[$id] = array("nome"=>$nome,"cor"=>$cor,"tamanho"=>$tamanho,"simbolo"=>$simbolo);
				}
			}
			$fechou = $nlayer->close();
			//echo "<pre>";var_dump($parametrosClasses);
			if (count($parametrosClasses) > 0)
			{
				$ids = array_keys($parametrosClasses);
				for($i=0;$i < count($parametrosClasses);++$i)
				{
					$p = $parametrosClasses[$ids[$i]];
					//echo "<pre>";var_dump($p);
					$nclasse = ms_newClassObj($nlayer,$classeoriginal);
					if($p["nome"] != "")
					$nclasse->set("name",$p["nome"]);
					$estilo = $nclasse->getstyle(0);
					if($p["cor"] != "")
					{
						$cor = $p["cor"];
						$ncor = $estilo->color;
						if($ncor == "")
						$ncor = $estilo->outlinecolor;
						$ncor->setrgb($cor[0],$cor[1],$cor[2]);
					}
					if($p["tamanho"] != "")
					$estilo->set("size",$p["tamanho"]);
					if($p["simbolo"] != "")
					$estilo->set("symbolname",$p["simbolo"]);
					$strE = "('[".$itemid."]'eq'".$ids[$i]."')";
					$nclasse->setexpression($strE);
				}
				$classeoriginal->set("status",MS_DELETE);
			}
		}
		if($substituicon == "sim"){$nlayer->set("connection"," ");}
	}
	$pf = $nlayer->getmetadata("palletefile");
	if($pf != "")
	{
		if(!file_exists($pf)){return;}
		$ps = $nlayer->getmetadata("palletesteps");
		if ($ps == "") $ps=8;
		//
		//pega os valores do arquivo
		//
		$rules = array();
		$abre = fopen($pf, "r");
		$paletteRules = array();
		while (!feof($abre))
		{
			$line = trim(fgets($abre));
			$pos = strpos($line, "#");
			if ($pos === false || $pos > 0)
			{
				$paletteEntry = explode(" ",$line);
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
		foreach($rules as $rule)
		{
			$delta = ceil(($rule["v1"]-$rule["v0"])/$ps);
			$legenda=true;
			for($value=$rule["v0"]; $value<$rule["v1"]; $value+=$delta)
			{
    			$class = ms_newClassObj($nlayer);
    			$style = ms_newStyleObj($class);
				if ($legenda)
				{
					$class->set(name,round($value,0));
					$legenda=true;
				}
				$expression="([pixel] > ".round($value,0)." AND [pixel] <= ".round($value+$delta,0).")";
				$class->setExpression($expression);
				$rgb=getRGBpallete($rule,$value);
				$style->color->setRGB($rgb[0],$rgb[1],$rgb[2]);
			}
		}
	}
	return;
}
function getRGBpallete($rule, $value){
	$escala=($value-$rule["v0"])/($rule["v1"]-$rule["v0"]);
	$r=$rule["r0"] + round(($rule["r1"]-$rule["r0"])*$escala, 0);
	$g=$rule["g0"] + round(($rule["g1"]-$rule["g0"])*$escala, 0);
	$b=$rule["b0"] + round(($rule["b1"]-$rule["b0"])*$escala, 0);
	return array($r,$g,$b);
}
/*
Function: removeAcentos

Remove os acentos de uma string

Parametro:

$var {string}

Retorno:

{string} palavra sem acento
*/
function removeAcentos($var)
{
	$a = array('À', '&Aacute;', '&Acirc;', '&Atilde;', 'Ä', 'Å', 'Æ',  '&Ccedil;', 'È', '&Eacute;', '&Ecirc;', 'Ë', 'Ì', '&Iacute;', 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', '&Ocirc;', '&Otilde;', 'Ö', 'Ø', 'Ù', '&Uacute;', 'Û', 'Ü', 'Ý', 'ß', 'à', '&aacute;', '&acirc;', '&atilde;', 'ä', 'å', 'æ',  '&ccedil;', 'è', '&eacute;', '&ecirc;', 'ë', 'ì', '&iacute;', 'î', 'ï', 'ñ', 'ò', 'ó', '&ocirc;', '&otilde;', 'ö', 'ø', 'ù', '&uacute;', 'û', 'ü', 'ý', 'ÿ', 'A', 'a', 'A', 'a', 'A', 'a', 'C', 'c', 'C', 'c', 'C', 'c', 'C', 'c', 'D', 'd', 'Ð', 'd', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'G', 'g', 'G', 'g', 'G', 'g', 'G', 'g', 'H', 'h', 'H', 'h', 'I', 'i', 'I', 'i', 'I', 'i', 'I', 'i', 'I', 'i', '?', '?',   'J', 'j', 'K', 'k', 'L', 'l', 'L', 'l', 'L', 'l', '?', '?', 'L', 'l', 'N', 'n', 'N', 'n', 'N', 'n', '?', 'O', 'o', 'O', 'o', 'O', 'o', 'Œ', 'œ',   'R', 'r', 'R', 'r', 'R', 'r', 'S', 's', 'S', 's', 'S', 's', 'Š', 'š', 'T', 't', 'T', 't', 'T', 't', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'W', 'w', 'Y', 'y', 'Ÿ', 'Z', 'z', 'Z', 'z', 'Ž', 'ž', '?', 'ƒ', 'O', 'o', 'U', 'u', 'A', 'a', 'I', 'i', 'O', 'o', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', '?', '?', '?', '?', '?', '?');
	$b = array('A', 'A', 'A', 'A', 'A', 'A', 'AE', 'C', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'D', 'N', 'O', 'O', 'O', 'O', 'O', 'O', 'U', 'U', 'U', 'U', 'Y', 's', 'a', 'a', 'a', 'a', 'a', 'a', 'ae', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'n', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'y', 'y', 'A', 'a', 'A', 'a', 'A', 'a', 'C', 'c', 'C', 'c', 'C', 'c', 'C', 'c', 'D', 'd', 'D', 'd', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'G', 'g', 'G', 'g', 'G', 'g', 'G', 'g', 'H', 'h', 'H', 'h', 'I', 'i', 'I', 'i', 'I', 'i', 'I', 'i', 'I', 'i', 'IJ', 'ij', 'J', 'j', 'K', 'k', 'L', 'l', 'L', 'l', 'L', 'l', 'L', 'l', 'L', 'l', 'N', 'n', 'N', 'n', 'N', 'n', 'n', 'O', 'o', 'O', 'o', 'O', 'o', 'OE', 'oe', 'R', 'r', 'R', 'r', 'R', 'r', 'S', 's', 'S', 's', 'S', 's', 'S', 's', 'T', 't', 'T', 't', 'T', 't', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'W', 'w', 'Y', 'y', 'Y', 'Z', 'z', 'Z', 'z', 'Z', 'z', 's', 'f', 'O', 'o', 'U', 'u', 'A', 'a', 'I', 'i', 'O', 'o', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'A', 'a', 'AE', 'ae', 'O', 'o');
	return str_replace($a, $b, $var);
}
/*
Function: criaDirMapa

Cria os diretórios tempor&aacute;rios para a aplica&ccedil;&atilde;o.

Parametro:

$dir_tmp {string} - Diretório tempor&aacute;rio (no servidor) utilizado pelo mapserver.

$$cachedir {string} - Diretório de cache tempor&aacute;rio definido no ms_configura.php

Retorno:

{boleano}
*/
function criaDirMapa($dir_tmp,$cachedir="")
{
	if(!file_exists($dir_tmp)){
		@mkdir ($dir_tmp,0777);
	}
	if(file_exists($dir_tmp))
	{
		$tmpdirname = nomeRandomico();
		$crdir = @mkdir ($dir_tmp."/".$tmpdirname,0777);
		$crdiri = @mkdir ($dir_tmp."/img".$tmpdirname,0777);
		$mapfile = $dir_tmp."/".$tmpdirname."/".$tmpdirname.".map";
		$tmpimgname = "img".$tmpdirname;
		@mkdir($dir_tmp."/comum",0777);
		if($cachedir == ""){
			@mkdir($dir_tmp."/cache",0777);
			@mkdir($dir_tmp."/cache/googlemaps",0777);
		}
		else{
			@mkdir($cachedir,0777);
			@mkdir($cachedir."/googlemaps",0777);
		}
		if(file_exists($dir_tmp."/".$tmpdirname))
		return array($mapfile,$tmpdirname,$tmpimgname);
		else
		{return false;}
	}
	else
	{return false;}
}
/*
Function: array2json

Converte um array em uma string no formato JSON. Utiliza as fun&ccedil;&otilde;es nativas do PHP para gerar o objeto.

Parametro:

$a {array}

$cpaint {boolean} - se for true &eacute; acrescentado o elemento "data" como chave no array, mantendo a compatibilidade da resposta com o CPAINT

Retorno:

{JSON}
*/
function array2json($a,$cpaint=true)
{
	if($cpaint == true)
	{$a = array("data"=>$a);}
	return json_encode($a);
}
/*
Function: json2array

Converte uma string JSON em um objeto PHP

$a {string}

Retorno:

{objeto}
*/
function json2array($a)
{
	return json_decode($a);
}
/*
Function: echojson

Retorna para o navegador uma string (JSON) e para o processamento do PHP

Parametro:

$a {string}
*/
function echojson($a)
{
	//ob_clean();
	error_reporting(0);
	ob_end_clean();
	if(extension_loaded('zlib'))
	{ob_start('ob_gzhandler');}
	header("Content-type: text/html");
	echo $a;
	if(extension_loaded('zlib'))
	{ob_end_flush();}
	exit;
}
/*
Function: cpjson

Converte um array em um objeto JSON e retorna para o navegador

Parametro:

$obj {array} - objeto que ser&aacute; convertido
*/
function cpjson($obj){
	if(function_exists("json_encode"))
	{
		echojson(array2json($obj));
	}
	else
	{
		include_once("../pacotes/cpaint/cpaint2.inc.php");
		$cp = new cpaint();
		$cp->set_data($obj);
		$cp->return_data();
	}
}
/*
Function: removeLinha

Remove uma linha do mapfile baseado na compara&ccedil;&atilde;o de strings.

Parametros:

$texto

$mapfile
*/
function removeLinha($texto,$mapfile)
{
	$abre = fopen($mapfile, "r");
	while (!feof($abre))
	{
		$buffer = fgets($abre);
		$maparray[] = $buffer;
	}
	fclose($abre);
	$novoarray = array();
	foreach ($maparray as $e)
	{
		$remove = "nao";
		$testa = explode($texto,$e);
		if (count($testa) > 1)
		{$remove = "sim";}
		if ($remove == "nao")
		{$novoarray[] = $e;}
	}
	//salva o mapfile
	$abre = fopen($mapfile, "wt");
	foreach($novoarray as $linha)
	{$escreve = fwrite ($abre,$linha);}
	$fecha = fclose ($abre);
}
//
//depreciado para incluir &$ para compatibilizar com PHP 5.x
//utilize carregaquery2
//
function carregaquery($mapfile,$objlayer,$objmapa)
{
	$qyfile = dirname($mapfile)."/".$objlayer->name.".php";
	if(file_exists($qyfile))
	{
		$indxlayer = $objlayer->index;
		$handle = fopen ($qyfile, "r");
		$conteudo = fread ($handle, filesize ($qyfile));
		fclose ($handle);
		$shp = unserialize($conteudo);
		foreach ($shp as $indx)
		{$objmapa->querybyindex($indxlayer,-1,$indx,MS_TRUE);}
		return "sim";
	}
	return "nao";
}
/*
Function: carregaquery2

Le um arquivo PHP, serializado com a lista de &iacute;ndices de objetos SHAPE selecionados em um LAYER, e aplica ao LAYER a sele&ccedil;&atilde;o desses SHAPES usando querybyindex

Aten&ccedil;&atilde;o: na vers&atilde;o 6 do Mapserver, n&atilde;o funciona com layers do tipo Postgis

Parametros:

$mapfile

$objlayer

$objmapa
*/
function carregaquery2($mapfile,&$objlayer,&$objmapa)
{
	$qyfile = dirname($mapfile)."/".$objlayer->name.".php";
	if(file_exists($qyfile))
	{
		$indxlayer = $objlayer->index;
		$handle = fopen ($qyfile, "r");
		$conteudo = fread ($handle, filesize ($qyfile));
		fclose ($handle);
		$shp = unserialize($conteudo);
		foreach ($shp as $indx)
		{$objmapa->querybyindex($indxlayer,-1,$indx,MS_TRUE);}
		return "sim";
	}
	return "nao";
}
/*
Function: verificaEditores

Verifica se o usu&aacute;rio atual est&aacute; cadastrado como editor

Parametros:

editores - array com a lista de editores

Return:

{string} - sim|nao
*/
function verificaEditores($editores)
{
	if (strtolower($_SERVER['HTTP_HOST']) == "localhost")
	{return "sim";}
	$editor = "nao";
	if($editores == ""){return $editor;}
	$ip = "UNKNOWN";
	if (getenv("HTTP_CLIENT_IP")) $ip = getenv("HTTP_CLIENT_IP");
	else if(getenv("HTTP_X_FORWARDED_FOR")) $ip = getenv("HTTP_X_FORWARDED_FOR");
	else if(getenv("REMOTE_ADDR")) $ip = getenv("REMOTE_ADDR");
	else $ip = "UNKNOWN";
	if(in_array($ip, $e)){
		$editor="sim";
	}
	return $editor;
}
/*
 Function: verificaPapelUsuario

Verifica se o usu&aacute;rio logado est&aacute; cadastrado em determinado papel.

Os papeis sao cadastrados no sistema de login

Parametros:

papel - codigo do papel

Return:

{boolean}
*/
function verificaPapelUsuario($id_papel)
{
	include_once(__DIR__."/../admin/php/login.php");
	$r = verificaPapelSessao($id_papel);
	return $r;
}
/*
Function: sobeAnno

Coloca todas as camadas do tipo ANNOTATION sobre as demais

Parametros:

$map_file - arquivo mapfile que ser&aacute; processado
*/
function sobeAnno($map_file){
	$mapa = ms_newMapObj($map_file);
	$numlayers = $mapa->numlayers;
	for ($i=0;$i<$numlayers;$i++){
		$layer = $mapa->getlayer($i);
		if($layer->type == 4){
			$temp = ms_newLayerObj($mapa,$layer);
			$layer->set("status",MS_DELETE);
		}
	}
	$mapa->save($map_file);
}
function retornaShapesMapext($objLayer,$objMapa){
	$shapes = array();
	$status = $objLayer->open();
	$status = $objLayer->whichShapes($objMapa->extent);
	while ($shape = $objLayer->nextShape())
	{$shapes[] = $shape;}
	$objLayer->close();
	return $shapes;
}
function retornaShapesSelecionados($objLayer,$map_file,$objMapa){
	$shapes = array();
	$qyfile = dirname($map_file)."/".$objLayer->name.".php";
	if(!file_exists($qyfile))
	{return $shapes;}
	$handle = fopen ($qyfile, "r");
	$conteudo = fread ($handle, filesize ($qyfile));
	fclose ($handle);
	$listaDeIndices = unserialize($conteudo);
	if(count($listaDeIndices) == 0)
	{return $shapes;}
	$versao = versao();
	$versao = $versao["principal"];
	if ($objLayer->connectiontype != MS_POSTGIS){
		//pega os shapes selecionados
		carregaquery2($map_file,$objLayer,$objMapa);
		$sopen = $objLayer->open();
		if($sopen == MS_FAILURE){return "erro";}
		$objLayer->open();
		$res_count = $objLayer->getNumresults();
		$centroides = array();
		$shapes = array();
		//pega um shape especifico
		for ($i = 0; $i < $res_count; ++$i)
		{
			if($versao == 6)
			{$shape = $objLayer->getShape($objLayer->getResult($i));}
			else{
				$result = $objLayer->getResult($i);
				$shp_index  = $result->shapeindex;
				$shape = $objLayer->getfeature($shp_index,-1);
			}
			$shapes[] = $shape;
		}
		$fechou = $objLayer->close();
	}
	else{
		$rect = ms_newRectObj();
		$rect->set("minx",-180);
		$rect->set("miny",-90);
		$rect->set("maxx",180);
		$rect->set("maxy",90);
		$status = $objLayer->open();
		$status = $objLayer->whichShapes($rect);
		while ($shape = $objLayer->nextShape())
		{
			if(in_array($shape->index,$listaDeIndices)){
				$shapes[] = $shape;
			}
		}
		$objLayer->close();
	}
	return $shapes;
}
/*
Function: permissoesarquivo

Retorna as permiss&otilde;es de um arquivo

Parametros:

$arquivo
*/
function permissoesarquivo($arquivo){
	$perms = fileperms($arquivo);

	if (($perms & 0xC000) == 0xC000) {
		// Socket
		$info = 's';
	} elseif (($perms & 0xA000) == 0xA000) {
		// Symbolic Link
		$info = 'l';
	} elseif (($perms & 0x8000) == 0x8000) {
		// Regular
		$info = '-';
	} elseif (($perms & 0x6000) == 0x6000) {
		// Block special
		$info = 'b';
	} elseif (($perms & 0x4000) == 0x4000) {
		// Directory
		$info = 'd';
	} elseif (($perms & 0x2000) == 0x2000) {
		// Character special
		$info = 'c';
	} elseif (($perms & 0x1000) == 0x1000) {
		// FIFO pipe
		$info = 'p';
	} else {
		// Unknown
		$info = 'u';
	}

	// Owner
	$info .= (($perms & 0x0100) ? 'r' : '-');
	$info .= (($perms & 0x0080) ? 'w' : '-');
	$info .= (($perms & 0x0040) ?
			(($perms & 0x0800) ? 's' : 'x' ) :
			(($perms & 0x0800) ? 'S' : '-'));

	// Group
	$info .= (($perms & 0x0020) ? 'r' : '-');
	$info .= (($perms & 0x0010) ? 'w' : '-');
	$info .= (($perms & 0x0008) ?
			(($perms & 0x0400) ? 's' : 'x' ) :
			(($perms & 0x0400) ? 'S' : '-'));

	// World
	$info .= (($perms & 0x0004) ? 'r' : '-');
	$info .= (($perms & 0x0002) ? 'w' : '-');
	$info .= (($perms & 0x0001) ?
			(($perms & 0x0200) ? 't' : 'x' ) :
			(($perms & 0x0200) ? 'T' : '-'));

	return $info;
}
?>
