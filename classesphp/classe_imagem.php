<?php
/*
Title: classe_imagem.php

Manipula&ccedil;&atilde;o de imagens.

Licenca:

GPL2


i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

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

i3geo/classesphp/classe_imagem.php
*/
/*
Classe: Imagem

*/
class Imagem
{
	/*
	Variavel: $arquivoimg

	Arquivo de imagem
	*/
	protected $arquivoimg;
	/*
	Variavel: $img

	Objeto imagem
	*/
	protected $img;

/*
Function: __construct

Cria um objeto imagem

parameters:

$arquivo - Nome completo da imagem em disco.
*/
	function __construct($arquivo)
	{
  		//error_reporting(0);
  		if (file_exists($arquivo))
  		{
  			$this->arquivoimg = $arquivo;
  			$this->img = imagecreatefrompng($arquivo);
			imagealphablending($this->img, false);
			imagesavealpha($this->img, true);
  		}
  		else
  		{return null;}
	}
/*
function: fundeIm

Funde duas imagens

parameters:

$ims: arquivo com a imagem que ser&aacute; sobreposta a atual
*/
	function fundeIm($ims)
	{
  		if (file_exists($ims))
  		{$ims = imagecreatefrompng($ims);}
  		else
  		{return null;}
		$wdst = imagesx($this->img);
		$hdst = imagesy($this->img);
		$wsrc = imagesx($ims);
		$hsrc = imagesy($ims);
		$xdst = abs(($wdst - $wsrc) / 2);
		$ydst = abs(($hdst - $hsrc) / 2);
		$branco = imagecolorresolve($ims,255,255,255);
		imagecolortransparent($ims,$branco);
		imageSaveAlpha($ims, true);
		imagecopymerge($this->img,$ims,$xdst,$ydst,0,0,$wsrc,$hsrc,40);
		return($this->img);
	}
/*
function: cortaBorda

Corta as bordas da imagem baseando-se no primeiro pixel
*/
	function cortaBorda()
	{
		$sx = imagesx($this->img);
		$sy = imagesy($this->img);
		$corBase = imagecolorat($this->img, 0, 0);
		$linhai = 0;
		//pega a linha inicial
		for ($y = 0; $y < $sy; ++$y)
		{
			for ($x = 0; $x < $sx; ++$x)
			{
				if (imagecolorat($this->img, $x, $y) != $corBase)
				{$linhai = $y - 1;break;}
			}
			if ($linhai != 0){break;}
		}
		//pega a coluna inicial
		for ($x = 0; $x < $sx; ++$x)
		{
			for ($y = 0; $y < $sy; ++$y)
			{
				if (imagecolorat($this->img, $x, $y) != $corBase)
				{$colunai = $x - 1;break;}
			}
			if ($colunai != 0){break;}
		}
		//pega a linha final
		for ($y = $sy - 1; $y > 0; $y--)
		{
			for ($x = 0; $x < $sx; ++$x)
			{
				if (imagecolorat($this->img, $x, $y) != $corBase)
				{$linhaf = $y + 1;break;}
			}
			if ($linhaf != 0){break;}
		}
		//pega a coluna final
		for ($x = $sx - 1; $x > 0; $x--)
		{
			for ($y = 0; $y < $sy; ++$y)
			{
				if (imagecolorat($this->img, $x, $y) != $corBase)
				{$colunaf = $x + 15;break;}
			}
			if ($colunaf != 0){break;}
		}
		$ni = imagecreate($colunaf - $colunai,$linhaf - $linhai);
		imagecopy($ni,$this->img,0,0,$colunai,$linhai,$colunaf,$linhaf);
		return($ni);
	}
/*
function: cinzaNormal

Converte a imagem atual em tons de cinza

*/
	function cinzaNormal()
	{
		imagefilter($this->img, IMG_FILTER_GRAYSCALE);
		return $this->img;
	}
/*
function: sepiaClara

Converte para s&eacute;pia clara
*/
	function sepiaClara()
	{
		$sx = imagesx($this->img);
		$sy = imagesy($this->img);
		for ($x = 0; $x < $sx; ++$x)
		{
			for ($y = 0; $y < $sy; ++$y)
			{
				$rgb = imagecolorat($this->img, $x, $y);
				$n = min(255,abs((($rgb >> 16) & 0xFF) * .229 + (($rgb >> 8) & 0xFF) * .587 + ($rgb & 0xFF) * .114) + 20);
				$r = min(255,$n + 80);
				$g = min(255,$n + 43);
				$b = min(255,$n - 23);
				imagesetpixel($this->img, $x, $y, imagecolorallocate($this->img, $r, $g, $b));
			}
		}
		return $this->img;
	}
/*
function: sepiaNormal

Converte para s&eacute;pia normal
*/
	function sepiaNormal()
	{
		$sx = imagesx($this->img);
		$sy = imagesy($this->img);
		for ($x = 0; $x < $sx; ++$x)
		{
			for ($y = 0; $y < $sy; ++$y)
			{
				$rgb = imagecolorat($this->img, $x, $y);
				$n = min(255,abs((($rgb >> 16) & 0xFF) * .229 + (($rgb >> 8) & 0xFF) * .587 + ($rgb & 0xFF) * .114) + 3);
				$r = min(255,$n + 80);
				$g = min(255,$n + 43);
				$b = min(255,$n - 23);
				imagesetpixel($this->img, $x, $y, imagecolorallocate($this->img, $r, $g, $b));
			}
		}
		return $this->img;
	}
	function negativo()
	{
		imagefilter($this->img, IMG_FILTER_NEGATE);
		return $this->img;
	}
	function detectaBordas()
	{
		imagefilter($this->img, IMG_FILTER_EDGEDETECT);
		return $this->img;
	}
	function embassa()
	{
		imagefilter($this->img, IMG_FILTER_EMBOSS);
		return $this->img;
	}
	function gaussian_blur()
	{
		imagefilter($this->img, IMG_FILTER_GAUSSIAN_BLUR);
		return $this->img;
	}
	function selective_blur()
	{
		imagefilter($this->img, IMG_FILTER_SELECTIVE_BLUR);
		return $this->img;
	}
	function mean_removal()
	{
		imagefilter($this->img, IMG_FILTER_MEAN_REMOVAL);
		return $this->img;
	}
	function pixelate()
	{
		imagefilter($this->img, IMG_FILTER_PIXELATE,200,true);
		return $this->img;
	}
}
?>