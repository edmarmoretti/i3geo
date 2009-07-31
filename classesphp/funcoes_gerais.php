<?php
/*
Title: funcoes_gerais.php

Contém um conjunto de funções que são compartilhadas por outros programas do I3Geo.

Licenca:

GPL2


I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;
tanto a versão 2 da Licença.
Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/classesphp/funcoes_gerais.php
*/
/*
Section: Imagens
*/
/*
function: classesRasterI

Gera parâmetros para classificação de imagens.

Gera a expressão e as cores para uso em classes com intervalos iguais para representação de imagens raster.

Parametros:

minvalor - Menor valor existente na série

maxvalor - Maior valor

nclasses - Número de classes

cores - Cores. Array de array de cores cores[0] = array(r,g,b)

return:

array - array("nomeclasse"=>$nomeclasse,"expressao"=>$expressao,"cores"=>$cores[$i])
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
function: fusaoGrafico

Faz a fusao de uma imagem com outra grafico+imagem.

parameters:

imagem - imagem do mapa

grafico - imagem do grafico

dir_tmp - diretorio onde estao as imagens

cp - Objeto CPAINT

Return:

Objeto cpaint com o nome da nova imagem criada.

Include:
<classe_imagem.php>
*/
function fusaoGrafico()
{
	global $imagem,$grafico,$dir_tmp,$cp,$map_file;
	include_once("classe_imagem.php");
	if($map_file != "")
	{
		$mapa = ms_newMapObj($map_file);
		$imgo = $mapa->draw();
		$nome = ($imgo->imagepath).nomeRandomico().".png";
		$imgo->saveImage($nome);
		$imagem = ($imgo->imageurl).basename($nome);
		$imgo->free();
	}
	$m = new Imagem(dirname($dir_tmp).$imagem);
	$i = $m->fundeIm(dirname($dir_tmp).$grafico);
	imagepng($i,dirname($dir_tmp).$imagem);
	$cp->set_data($imagem);
}
/*
Section: R
*/
/*
function: executaR

Executa comandos do R.

parameters:

$rcode - Código que será executado.

$dir_tmp - Diretório temporário onde ficarão os arquivos para processamento.

$R_path - Executável do R.

$gfile_name - nome da imagem que será criada

Include:
<classe_imagem.php>
*/
function executaR($rcode,$dir_tmp,$R_path,$gfile_name)
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
function: criaImagemR

Cria uma imagem png a partir de dados armazenados em disco.

Utilizado para gerar uma imagem com base nos resultados de comandos R.

parameters:

$nomearq - Nome do arquivo no servidor que será utilizado para gerar a imagem.
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
function: corRGB

Obtém os valores em RGB de um objeto cor do Mapscript.

parameter:

$cor - objeto cor do mapscript.

return:
string - Cor em RGB separados por vírgula.
*/
function corRGB($cor)
{
	$r = $cor->red;
	$g = $cor->green;
	$b = $cor->blue;
	return($r.",".$g.",".$b);
}
/*
function: corE

Aplica uma cor a um elemento de um objeto label de um layer.

parameter:

label - Objeto do tipo label.

cor - RGB separado por espacos, se for um array, aplica diretamente ao objeto cor.

elemento - Nome do elemento que receberá a cor.
*/
function corE($label,$cor,$elemento)
{
	if (is_string($cor))
	{
		if (count(explode(" ",$cor)) == 3)
		{
			$corres = $label->$elemento;
			$cori = explode(" ",$cor);
			$corres->setRGB($cori[0],$cori[1],$cori[2]);
		}
		if (count(explode(",",$cor)) == 3)
		{
			$corres = $label->$elemento;
			$cori = explode(",",$cor);
			$corres->setRGB($cori[0],$cori[1],$cori[2]);
		}
	}
	else
	{$corres->setRGB($cor->red,$cor->green,$cor->blue);}
}
/*
function: colorHex

Aloca uma cor a um objeto imagem (GD).

A origem é uma cor definida em hexadecimal.

parameters:

$img - objeto imagem

$HexColorString - cor hexadecimal
*/
function colorHex($img, $HexColorString)
{
	$R = hexdec(substr($HexColorString, 0, 2));
	$G = hexdec(substr($HexColorString, 2, 2));
	$B = hexdec(substr($HexColorString, 4, 2));
	return ImageColorAllocate($img, $R, $G, $B);
}
/*
function: colorRGB

Aloca uma cor a um objeto imagem (GD).

A origem é uma cor definida em rgb.

parameter:
$img - objeto imagem

$ColorString - cor r,g,b
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
function: colorRGBshadow

Aloca uma cor de sombra a um objeto imagem (GD).

A origem é uma cor definida em rgb.

parameters:
$img - objeto imagem

$ColorString - cor r,g,b
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
function: colorHexshadow

Aloca uma cor de sombra a um objeto imagem (GD).

A origem é uma cor definida em hexadecimal.

parameters:
$img - objeto imagem

$ColorString - cor hexadecimal
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
function: RGB2hex

Converte uma cor rgb em hex.

parameters:
$rgb - cor RGB
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
function: nomeRandomico

Gera um nome randômico.

parameter:

Número de dígitos.

return:

string - Nome aleatório.
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
function: listaEpsg

Lê o arquivo com os códigos de projeção epsg e retorna um array com os dados.

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
function: copiaSeguranca

Cria cópia de segurança do map_file.

Salva o mapfile atual incluindo no nome, a string "seguranca".

parameter:

map_file - Arquivo map file.

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
function: listaDiretorios

Retorna lista de diretórios.

parameters:

$diretorio - Raiz onde será feita a busca.

return:

array com a lista de diretórios.
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

Parametros:

$diretorio - Raiz onde será feita a busca.

Return:

array com a lista de arquivos e diretórios.
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
function: gravaDados

Grava as linhas de um array em um arquivo.

parameters:
$dados - Dados que serão gravados.

$arq - Nome do arquivo que será gravado
*/
function gravaDados($dados,$arq)
{
	$fp = fopen($arq,"w");
	foreach ($dados as $dado)
	{
		fwrite($fp,$dado."\n");
	}
}
/*
function: listaTrueType

Lista as fontes true type.

Lê o arquivo fontes.txt existente no diretório symbols da instalação do I3Geo.
O resultado é gravado em um arquivo temporário para include, o que torna mais rápida a carga futura.
O arquivo para include armazena a variável res que contém a lista de fontes separadas por vírgula.

parameters:
$cp - Objeto CPAINT.

$locaplic - Localização da aplicação no servidor.

$imgdir - Diretório das imagens.

$dir_tmp - Diretório temporário.
*/
function listaTrueType()
{
	global $cp,$locaplic,$imgdir,$dir_tmp;
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
	$cp->set_data($res);
}
/*
Section: mapa
*/
/*
function: substituiCon

Substituí a string de conexão com o banco postgis pela string definida na inicialização (ms_configura.php)

Parametros:

map_file - arquivo mapfile

postgis_mapa - string de conexão com o banco
*/
function substituiCon($map_file,$postgis_mapa)
{
	if ((isset($postgis_mapa)) && (file_exists($map_file)))
	{
		if (($postgis_mapa != "") || ($postgis_mapa != " "))
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
						//o metadata CONEXAOORIGINAL guarda o valor original para posterior substituição
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
	}
	return true;
}
/*
function: restauraCon

Esconde a string de conexão com o banco, caso necessário

Parametros:

map_file - arquivo mapfile

postgis_mapa - string de conexão com o banco
*/
function restauraCon($map_file,$postgis_mapa)
{
	if(!@ms_newMapObj($map_file)){return;}
	if (isset($postgis_mapa) && $postgis_mapa != "")
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
function: retornaReferencia

Retorna uma string com as variaveis de um novo mapa de referencia.

parameter:

cp - Objeto CPAINT.

nomeImagem - Nome da imagem do corpo do mapa.

objMapa - Objeto map.

return:

Objeto cpaint com uma string contendo variáveis no formato javascript
*/
function retornaReferencia()
{
	global $cp,$nomeImagem,$objMapa,$utilizacgi,$locmapserv,$map_file;
	//
	//pega a extensao original caso ela tenha sido registrada no modo dinamico
	//
	$original = $objMapa->getmetadata("referenciaextentoriginal");
	$ref = $objMapa->reference;
	$em = $ref->extent;
	if($original != "")
	{
		$original = explode(" ",$original);
		$em->set("minx",$original[0]);
		$em->set("miny",$original[1]);
		$em->set("maxx",$original[2]);
		$em->set("maxy",$original[3]);
		$objMapa->setmetadata("referenciaextentoriginal","");
	}
	$objMapa->save($map_file);
	$objMapa->preparequery();
	$objImagem = $objMapa->drawreferencemap();
	$nomer = ($objImagem->imagepath)."ref".$nomeImagem.".png";
	$objImagem->saveImage($nomer);
	$nomer = ($objImagem->imageurl).basename($nomer);
	$d = (abs($em->maxx - $em->minx)) / ($objImagem->width);
	$s = "g_celularef = ".$d.";";
	$s .= "var extentref = '".$em->minx." ".$em->miny." ".$em->maxx." ".$em->maxy."';";
	$s .=  "var refimagem='".$nomer."';var refwidth=".$objImagem->width.";var refheight=".$objImagem->height.";var refpath='".$objImagem->imagepath."';var refurl='".$objImagem->imageurl."'";
	$cp->set_data($s);
}
/*
function: retornaReferenciaDinamica

Retorna uma string com as variaveis de um novo mapa de referencia gerado de forma dinamica.

O mapa de referência é baseado no mapfile aplicmap/referenciadinamica.map ou no mapa atual

parameter:

cp - Objeto CPAINT.

nomeImagem - Nome da imagem do corpo do mapa.

objMapa - Objeto map.

zoom - fator de zoom

tipo - tipo de referência dinamico|mapa

return:

Objeto cpaint com uma string contendo variáveis no formato javascript
*/
function retornaReferenciaDinamica()
{
	global $cp,$nomeImagem,$map_file,$utilizacgi,$locmapserv,$locaplic,$zoom,$tipo;
	//
	//adiciona o tema com o web service com o mapa mundi
	//
	$objMapa = ms_newMapObj($map_file);
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
	$ref = $mapa->reference;
	$r = $ref->extent;
	//
	//guarda a extensao original para quando o modo dinâmico parar
	//
	$original = $mapa->getmetadata("referenciaextentoriginal");
	if($original == "")
	{
		$original = $r->minx." ".$r->miny." ".$r->maxx." ".$r->maxy;
		$mapa->setmetadata("referenciaextentoriginal",$original);
	}
	$s .= ";var extentref = '".$r->minx." ".$r->miny." ".$r->maxx." ".$r->maxy."';";
	$d = (abs($r->maxx - $r->minx)) / ($objImagem->width);
	$s .= "g_celularef = ".$d.";";
	$emt = $objMapa->extent;
	$r->set("minx",$emt->minx);
	$r->set("miny",$emt->miny);
	$r->set("maxx",$emt->maxx);
	$r->set("maxy",$emt->maxy);
	$mapa->save($map_file);
	$cp->set_data($s);
}
/*
function: testaMapa

Testa se um mapa está íntegro.

Se o mapfile apresentar problemas, a cópia de segurança é restaurada.

parameter:

map_file - Arquivo map file.

postgis_mapa - string de conexão com o banco de dados definida em ms_configura.php
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
function: desligamargem

Desliga o mapa de referência e a barra de escala de um mapa.

parameter:

objmapa - Objeto map.

return:

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
function: desligaTemas

Desliga todos os temas de um mapa.

parameter:

objMapa - Objeto map.

return:

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
function: extPadrao

Aplica o valor da extensao geográfica padrao a um objeto map.

parameter:

$oMap - Mapa.
*/
function extPadrao($oMap)
{
	$ext = "-76.512593 -39.392568 -29.585185 9.490149";
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
function: gravaImagemMapa

Grava a imagem do mapa atual

Parametros:

$mapa - objeto mapa ou arquivo mapfile

Return:

array - array("url"=>,"arquivo"=>) ou falso se ocorrer erro

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
		$imgo->free();
	}
	else
	{$retorno = false;}
	return $retorno;
}	
/*
Section: atributos
*/
/*
function: pegaValores

Pega os valores de um item de um tema.

parameters:

$layer - Layer que será processado.

$item - Item que será processado.

$numerico - O item e numerico (true ou false).

$ignorar - valor que será ignorado na listagem final
*/
function pegaValores($mapa,$layer,$item,$numerico=false,$ignorar="")
{
	$layer->set("template","none.htm");
	$layer->setfilter("");
	if (@$layer->queryByrect($mapa->extent) == MS_SUCCESS)
	{
		$sopen = $layer->open();
		if($sopen == MS_FAILURE){return "erro";}
		$res_count = $layer->getNumresults();
		$valitem = array();
		for ($i=0;$i<$res_count;++$i)
		{
			$result = $layer->getResult($i);
			$shp_index  = $result->shapeindex;
			$shape = $layer->getshape(-1, $shp_index);
			$v = trim($shape->values[$item]);
			if ($numerico)
			{
				if (is_numeric($v))
				{
					if ($ignorar == "")
					{$valitem[] = $v;}
					else
					{
						if ($v != $ignorar)
						{$valitem[] = $v;}
					}
				}
			}
			else
			{
				if ($ignorar == "")
				{$valitem[] = $v;}
				else
				{
					if ($v != $ignorar)
					{$valitem[] = $v;}
				}				
			}
		}
		$fechou = $layer->close();
	}
	$layer->close();
	return ($valitem);
}
/*
function: pegaValoresM

Pega os valores de múltiplos itens de um tema.

Se for passado apenas um item, o array de retorno será unidimensional.

parameters:

$layer - Layer que será processado.

$itens - Itens que serão processados.

$exclui - O registro não será considerado se um dos valores for igual a esse valor.

$selecionados - Utiliza apenas os selecionados ou todos
*/
function pegaValoresM($mapa,$layer,$itens,$exclui="nulo",$selecionados="nao")
{
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
	if (@$layer->queryByrect($mapa->extent) == MS_SUCCESS)
	{
		$sopen = $layer->open();
		if($sopen == MS_FAILURE){return "erro";}

		$res_count = $layer->getNumresults();
		for ($i=0;$i<$res_count;++$i)
		{
			$result = $layer->getResult($i);
			$shp_index = $result->shapeindex;
			if (($selecionados == "sim") && (array_search($shp_index,$indicesel) === FALSE))
			{continue;}
			$considera = "sim";
			$shape = $layer->getshape(-1, $shp_index);
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
				foreach ($itens as $item)
				{$v[] = $shape->values[$item];}
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
function: agrupaValores

Agrupa os valores de um array por um método de cálculo.

No caso de soma e média, será considerado apenas um item e uma chave.

parameters:
$lista - Lista com os arrays contendo os dados que serão processados.

$indiceChave - Índice do array da lista que será considerado como a chave do array.

$indiceValor - Índice do array da lista que será considerado como o valor.

$tipo - Tipo de processamento soma|media|contagem|nenhum.
*/
function agrupaValores($lista,$indiceChave,$indiceValor,$tipo)
{
	foreach ($lista as $linha)
	{
		$c = $linha[$indiceChave];
		$v = $linha[$indiceValor];
		if ($tipo == "conta")
		{$valores[$c] = $valores[$c] + 1;}
		if (($tipo == "soma"))
		{
			if (($v != "") && (is_numeric($v)))
			{$valores[$c] = $valores[$c] + $v;}
		}
		if ($tipo == "media")
		{
			if (($v != "") && (is_numeric($v)))
			{
				$soma[$c] = $soma[$c] + $v;
				$conta[$c] = $conta[$c] + 1;
			}
		}
		if ($tipo == "nenhum")
		{
			if (($v != "") && (is_numeric($v)))
			{
				$valoresn[] = $v;
			}
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
function: pegaItens

Pega os itens de um tema e armazena em cache.

parameter:
$layer - objeto layer
*/
function pegaItens($layer)
{
	$sopen = $layer->open();
	if($sopen != MS_FAILURE)
	$items = $layer->getItems();
	else
	$items = array();
	return $items;
/*
	if ($layer->type != 3)
	{$layer->open();}
	$items = $layer->getItems();
	if ($layer->type != 3)
	{$layer->close();}
	return $items;
*/	
}
/*
function: buscaRapida

Acessa um web service RPC de busca de nomes e retorna os resultados.

parameters:

servico - Endereco do web service.

palavra - palavra de busca

return:

array com o resultado.
*/
function buscaRapida($servico,$palavra)
{
	include_once('../pacotes/SOAP/nusoap.php');
	//include_once("../pacotes/SOAP/easy_parser.inc");
	$soapclient = new Xsoapclient($servico."?wsdl","wsdl");
	$vv = "erro";
	if (@$p = $soapclient->getproxy())
	{
		$vv = $soapclient->call("procurar",array("palavra"=>$palavra,"tipoBusca"=>"qualquer"));
		if($vv == ""){$vv = "erro";}
		return ($vv);
	}
	else
	{return "erro";}
}
/*
Section: coordenadas
*/
/*
function: ip2geo

Localiza a coordenada geográfica de um endereço IP.

Essa função baseia-se no pacote geoIP, que deve estar instalado em pacotes/geoip.

parameters:

$ip - Número do IP.
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
function: xy2imagem

Converte coordenadas geograficas em coordenadas de imagem e retorna um ponto.

parameters:

$map_file - Arquivo map file.

$xy - XY com as coordenadas (separado por espaço no caso de string)
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
function: imagem2xy

Converte coordenadas de imagem em coordenadas geográficas.

parameters:

$map_file - Arquivo map file.

$xy - XY com as coordenadas (separado por espaço no caso de string)
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
function: xy2wkt

Converte coordenadas em wkt.

parameters:

$xy - Lista de pares de coordenadas xy separadas por espaço.
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
function: geo2zonaUTM

Calcula a zona utm de um par de coordenadas geográficas

Parametros:

$x - longitude

*/
function geo2zonaUTM($x)
{
	$x = $x + 180;
	$x = $x / 6;
	return intval($x) + 1;
}
/*
function: geo2utm

Converte coordenadas geográficas para UTM

parameters:

$x - longitude

$y - latitude

$zona - zona UTM
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
function: reSLD

Regera o SLD de um tema WMS.

parameters:

$map_file - arquivo map_file

$tema - código do tema

$sld - string sld
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
function: georssCanais (depreciado)

Lista os canais de um GeoRss.

parameters:
$servico - Endereço do RSS.

$map_file - Nome do arquivo map file. Inclua o caminho completo no servidor.

$dir_tmp - Diretório onde o arquivo será criado.

$locaplic - Localização do I3geo
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
function: pegaNome

Retorna o nome correto de um layer

parameters:
$layer - Objeto layer

$enc - Código de página para conversão de caracteres
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
function: criaLayer

Cria um objeto layer

parameters:
$oMapa - objeto mapa

$ms_tipo - tipo de layer

$ms_status - status de visibilidade

$metaTema - metadado com o nome do tema

$metaClasse - metadado indicando se a classe é visível ou não na legenda
*/
function criaLayer($oMapa,$ms_tipo,$ms_status,$metaTema,$metaClasse="SIM")
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
	return $l;
}
/*
function: criaSHP

Cria um arquivo shape file de um tema.

parameters:

$tema - Tema que será processado.

$map_file -Nome do arquivo map file. Inclua o caminho completo no servidor.

$locaplic - Diretório onde está a aplicação no servidor.

$dir_tmp - Diretório temporário

$nomeRand - Gera um nome randomico para o shapefile (TRUE) ou utiliza o nome do tema (FALSE)
*/
function criaSHP($tema,$map_file,$locaplic,$dir_tmp,$nomeRand=TRUE)
{
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
	if ($nomeRand)
	$novonomelayer = nomeRandomico(20);
	else
	$novonomelayer = $tema;
	$nomeshp = $dir_tmp."/".$novonomelayer;
	if(file_exists($nomeshp.".shp"))
	{return $nomeshp;}
	if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
	{$mapt = ms_newMapObj($locaplic."\\aplicmap\\novotema.map");}
	else
	{$mapt = ms_newMapObj($locaplic."/aplicmap/novotema.map");}
	$novoshpf = ms_newShapefileObj($nomeshp, $tipol);
	$novoshpf->free();
	//se for do tipo features
	$data = $layer->data;
	if ($data == "")
	{
		$def[] = array("ID","C","50");
		$db = xbase_create($nomeshp.".dbf", $def);
		$dbname = $nomeshp.".dbf";
		$reg[] = 0;
		xbase_add_record($db,$reg);
		xbase_close($db);
		$s = $layer->getshape(-1,0);
		$result = $layer->getResult(0);
		$shpi  = $result->shapeindex;
		$shape = $layer->getshape(-1, $shpi);
		$novoshpf = ms_newShapefileObj($nomeshp.".shp", -2);
		$novoshpf->addShape($shape);
		$novoshpf->free();
	}
	else
	{
		$items = pegaItens($layer);
		// cria o dbf
		$def = array();
		foreach ($items as $ni)
		{
			$temp = strtoupper($ni);
			$def[] = array($temp,"C","254");
		}
		$db = xbase_create($nomeshp.".dbf", $def);
		$dbname = $nomeshp.".dbf";
		$reg = array();
		$novoshpf = ms_newShapefileObj($nomeshp.".shp", -2);
		//le o arquivo de query se existir e checa se existe sele&ccedil;&atilde;o para o tema
		$existesel = "nao";
		if (file_exists($map_file."qy"))
		{$map->loadquery($map_file."qy");}
		if ($layer->getNumresults() > 0){$existesel = "sim";}
		if ($existesel == "nao")
		{
			@$layer->queryByrect($map->extent);
		}
		//pega cada registro
		$res_count = $layer->getNumresults();
		if ($res_count > 0)
		{
			$sopen = $layer->open();
			if($sopen == MS_FAILURE){return "erro";}

			for ($i = 0; $i < $res_count; ++$i)
			{
				$result = $layer->getResult($i);
				$shp_index  = $result->shapeindex;
				$shape = $layer->getshape(-1, $shp_index);
				foreach ($items as $ni)
				{
					$reg[] = $shape->values[$ni];
				}
				$novoshpf->addShape($shape);
				xbase_add_record($db,$reg);
				$reg = array();
			}
			xbase_close($db);
			$novoshpf->free();
			$layer->close();
		}
	}
	return $nomeshp;
}
/*
function: downloadTema

Faz o download dos dados de um tema.

parameters:

$map_file - Nome do arquivo map file. Inclua o caminho completo no servidor.

$tema - Tema que será processado.

$locaplic - Diretório da aplicação.

$dir_tmp - Diretório temporário

return:

Array com o nome do diretório e nome do arquivo

Include:
<ms_configura.php>
*/
function downloadTema($map_file,$tema,$locaplic,$dir_tmp)
{
	ini_set("max_execution_time","1800");
	if(file_exists($locaplic."/ms_configura.php"))
	include_once($locaplic."/ms_configura.php");
	else	
	include_once("../ms_configura.php");
	if (($map_file == "") || (!@ms_newMapObj($map_file))) //a funcao foi chamada do aplicativo datadownload
	{
		if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
		{$map_tmp = ms_newMapObj($locaplic."/aplicmap/geral1windows.map");}
		else
		{$map_tmp = ms_newMapObj($locaplic."/aplicmap/geral1.map");}
		$map_file = $dir_tmp."/".nomerandomico(20).".map";
		$map_tmp->save($map_file);
	}
	$temasdir = $locaplic."/temas";
	$map = ms_newMapObj($map_file);
	$teste = @$map->getlayerbyname($tema);
	if ($teste == "")
	{
		$maptemp = ms_newMapObj($temasdir."/".$tema.".map");
		$temastemp = $maptemp->getalllayernames();
		foreach ($temastemp as $tt)
		{
			$ll = $maptemp->getlayerbyname($tt);
			ms_newLayerObj($map, $ll);
		}
	}
	$teste = @$map->getlayerbyname($tema);
	if ($teste == "")
	{return "erro";}
	$map->save(str_replace(".map","tmp.map",$map_file));
	$map_file = str_replace(".map","tmp.map",$map_file);
	$map = ms_newMapObj($map_file);
	//verifica se existe mais de um tema (grupo) montando o array com os temas
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
	$radtmp = dirname($dir_tmp);
	foreach ($temas as $tema)
	{
		$l = $map->getlayerbyname($tema);
		$dados = $l->data;
		if($l->type == MS_LAYER_RASTER)
		{
			if (file_exists($dados))
			{
				$arq = basename($dados);
				$resultado[] = str_replace("/img","/",$map->web->imageurl).$arq;
				$arq = explode(".",$arq);
				$resultado[] = str_replace("/img","/",$map->web->imageurl).$arq[0].".wld";
			}
		}
		else
		{
			$sp = $map->shapepath;
			$arq = "";
			if (file_exists($dados))
			{$arq = $dados;}
			if (file_exists($dados.".shp"))
			{$arq = $dados.".shp";}
			if (file_exists($sp.$dados.".shp"))
			{$arq = $sp.$dados.".shp";}
			if (file_exists($sp.$dados))
			{$arq = $sp.$dados;}
			if ($arq != "")
			{
				$novonomelayer = $tema; //nomeRandomico(20);
				$nomeshp = $dir_tmp."/".$novonomelayer;
				$arq = explode(".shp",$arq);
				if(!file_exists($nomeshp.".shp"))
				{
					copy($arq[0].".shp",$nomeshp.".shp");
					copy($arq[0].".shx",$nomeshp.".shx");
					copy($arq[0].".dbf",$nomeshp.".dbf");
				}
				$resultado[] = str_replace($radtmp,"",$nomeshp);
			}
			else
			{
				$restemp = criaSHP($tema,$map_file,$locaplic,$dir_tmp,FALSE);
				$resultado[] = str_replace($radtmp,"",$restemp);
			}
		}
	}
	return(implode(",",$resultado));
}
/*
Section: Outros
*/
/*
function: calculaAreaPixel

Calcula a área em m2 de um pixel do mapa

O cálculo é feito projetando-se o mapa atual para a projeção policônica

Parametros:

map_file - arquivo do mapa

celsize - tamanho do pixel em décimos de grau

Return:

{Numeric} - área em metros quadrados
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
function: pegaIPcliente

Pega o IP do cliente
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
function: pegaIPcliente2

Pega o IP do cliente sem REMOTE_ADDR
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
function: versao

Retorna a versão do Mapserver.

Return:

array - array("completa"=>,"principal"=>)
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
function: iXml

Retorna o valor de um elemento xml

Parameter:

no - objeto representando o elemento xml

nome - nome do elemento
*/
function ixml($no,$nome)
{
	return mb_convert_encoding($no->$nome,"HTML-ENTITIES","auto");
}
/*
Function: autoClasses

Gera as classes do layer com base em valores definidos na tabela de atributos.

Os parâmetros para montagem das classes são definidos em metadados do layer.

Parametros:

nlayer - objeto layer que será processado

mapa - objeto mapa que será processado

Return:

Objeto layer modificado
*/
function autoClasses(&$nlayer,$mapa)
{
	$postgis_mapa = "";
	$substituicon = "nao";
	if(file_exists("ms_configura.php"))
	include_once("ms_configura.php");
	else
	include_once("../ms_configura.php");
	if ($nlayer->connectiontype == MS_POSTGIS)
	{
		if ($nlayer->connection == " ")
		{
			$nlayer->set("connection",$postgis_mapa);
			$substituicon = "sim";
		}
	}	
	if($nlayer->getmetadata("classesitem") == "")
	{return;}
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
	return;
}
/*
Function: removeAcentos

Remove os acentos de uma string

Parametros:

var - string

Return:

palavra sem acento
*/
function removeAcentos($var)
{
	$var = ereg_replace("[ÁÀÂÃ]","A",$var);
	$var = ereg_replace("[áàâãª]","a",$var);
	$var = ereg_replace("[ÉÈÊ]","E",$var);
	$var = ereg_replace("[éèê]","e",$var);
	$var = ereg_replace("[ÓÒÔÕ]","O",$var);
	$var = ereg_replace("[óòôõº]","o",$var);
	$var = ereg_replace("[ÚÙÛ]","U",$var);
	$var = ereg_replace("[úùû]","u",$var);
	$var = str_replace("Ç","C",$var);
	$var = str_replace("ç","c",$var);
	return $var;
}
/*
function: criaDirMapa

Cria os diretórios temporários para a aplicação.
parameters:

$dir_tmp - Diretório temporário (no servidor) utilizado pelo mapserver.
*/
function criaDirMapa($dir_tmp)
{
	if(file_exists($dir_tmp))
	{
		$tmpdirname = nomeRandomico();
		$crdir = @mkdir ($dir_tmp."/".$tmpdirname,0777);
		$crdiri = @mkdir ($dir_tmp."/img".$tmpdirname,0777);
		$mapfile = $dir_tmp."/".$tmpdirname."/".$tmpdirname.".map";
		$tmpimgname = "img".$tmpdirname;
		@mkdir($dir_tmp."/".comum,0777);
		if(file_exists($dir_tmp."/".$tmpdirname))
		return array($mapfile,$tmpdirname,$tmpimgname);
		else
		{return false;}
	}
	else
	{return false;}
}
?>