<?php
/*
Title: Pizza

Gera uma imagem com o gráfico de pizza.
É utilizado pelo I3Geo na inclusão de gráficos diretamente no mapa.

About: Licença

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

File: i3geo/classesphp/graficopizza.php

19/6/2007
*/
/*
function: graficopizza

Gera uma imagem em disco de um gráfico de pizza.

Os dados são passados como parâmetros.

parameters:
$data - dados separados como no exemplo "10*9*11*10"

$width - tamanho da imagem

$inclinacao - inclinacao da pizza

$shadow_height - profundidade da sombra

$cores - cores separadas como no exemplo "200,40,30*100,200,50*0,255,0*255,0,0"

$imgurl - url do servidor para chamar a imagem

$map_file - arquivo mapfile

$temaedit - tema que recebera o grafico

Include:
<funcoes_gerais.php>
*/
function graficopizza($data,$width,$inclinacao,$shadow_height,$cores,$imgurl,$map_file,$temaedit)
{
	////////////////////////////////////////////////////////////////
	// PHP script made by Rasmus Petersen - http://www.peters1.dk //
	////////////////////////////////////////////////////////////////
	include_once("funcoes_gerais.php");
	//<img src="http://www.domain.dk/piechart.php?data=10*9*11*10&label=Denmark*Germany*USA*Sweden" />
	$show_label = false; // true = show label, false = don't show label.
	$show_percent = false; // true = show percentage, false = don't show percentage.
	$show_text = true; // true = show text, false = don't show text.
	$show_parts = false; // true = show parts, false = don't show parts.
	$label_form = 'square'; // 'square' or 'round' label.
	if(!isset($width)){$width = 50;}
	if(!isset($inclinacao)){$inclinacao = 1.5;}
	if(!isset($shadow_height)){$shadow_height = 10;};
	$background_color = 'FFFFFF'; // background-color of the chart...
	$text_color = '000000'; // text-color.
	$colors = array('003366', 'CCD6E0', '7F99B2','F7EFC6', 'C6BE8C', 'CC6600','990000','520000','BFBFC1','808080'); // colors of the slices.
	$colorsp = explode("*",$cores); //cores das fatias
	//$shadow_height = 16; // Height on shadown.
	$shadow_dark = true; // true = darker shadow, false = lighter shadow...
	// DON'T CHANGE ANYTHING BELOW THIS LINE...
	$height = $width/$inclinacao;
	$data = explode('*',$data);
	$img = ImageCreateTrueColor($width,$height+ceil($shadow_height));
	imagetruecolortopalette($img, false, 256); // convert
	$white = imagecolorresolve($img, 255, 255, 255); // resolve given palette entry
	imagecolortransparent($img, $white);
	ImageFill($img, 0, 0, $white);
	foreach ($colorsp as $colorkode)
	{
		$fill_color[] = colorRGB($img, $colorkode);
		$shadow_color[] = colorRGBshadow($img, $colorkode, $shadow_dark);
	}
	$centerX = round($width/2);
	$centerY = round($height/2);
	$diameterX = $width-4;
	$diameterY = $height-4;
	$data_sum = array_sum($data);
	$start = 270;
	$value_counter = 0;
	$value = 0;
	$cd = count($data);
	for ($i = 0; $i < $cd; ++$i)
	{
		$value += $data[$i];
		$end = ceil(($value/$data_sum)*360) + 270;
		$slice[] = array($start, $end, $shadow_color[$value_counter % count($shadow_color)], $fill_color[$value_counter % count($fill_color)]);
		$start = $end;
		$value_counter++;
	}
	for ($i=$centerY+$shadow_height; $i>$centerY; $i--)
	{
		for ($j = 0; $j < count($slice); $j++)
		{
			ImageFilledArc($img, $centerX, $i, $diameterX, $diameterY, $slice[$j][0], $slice[$j][1], $slice[$j][2], IMG_ARC_PIE);
		}
	}
	for ($j = 0; $j < count($slice); $j++)
	{
		ImageFilledArc($img, $centerX, $centerY, $diameterX, $diameterY, $slice[$j][0], $slice[$j][1], $slice[$j][3], IMG_ARC_PIE);
	}
	$nome = nomeRandomico(20).".png";
	$nomefisico = dirname($map_file)."/".$nome;
	$nomeurl = $imgurl.$nome;
	Imagepng($img,$nomefisico);
	ImageDestroy($img);
	return ($nomefisico.",".$nomeurl);
}
?>