<?php
/*
Title: classe_escala.php

Manipula&ccedil;&atilde;o da escala.

Cria escala grafica, edita caracter&iacute;sticas, etc.

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

i3geo/classesphp/classe_escala.php
*/
/*
Classe: Escala
*/
class Escala
{
	/*
	Variavel: $mapa
	
	Objeto mapa
	*/
	protected $mapa;
	/*
	Variavel: $arquivo
	
	Arquivo map file
	*/
	protected $arquivo;
	/*
	Variavel: $nomeImagem
	
	Nome da imagem criada
	*/
	protected $nomeImagem;

	
/*
function: __construct

Cria um objeto Escala 

parameters:
$map_file - Endere&ccedil;o do mapfile no servidor. 
*/
	function __construct($map_file,$nomeImagem="",$locaplic="")
	{
  		//error_reporting(E_ALL);
  		if(file_exists($locaplic."/funcoes_gerais.php"))
  		include_once($locaplic."/funcoes_gerais.php");
  		else
  		include_once("funcoes_gerais.php");
  		$this->locaplic = $locaplic;
  		$this->mapa = ms_newMapObj($map_file);
  		$this->arquivo = $map_file;
  		if ($nomeImagem == "")
  		{$this->nomeImagem = nomeRandomico();}
	}
/*
function: salva

Salva o mapfile atual
 
*/	
 	function salva()
 	{
	  	if (connection_aborted()){exit();}
	  	$this->mapa->save($this->arquivo);
	}

/*
function: retornaBarraEscala

Gera barra de escala.

Retorna uma string com sintaxe em javaScript com o nome da imagem e demais par&acirc;metros.

return:
string com vari&aacute;veis javascript.
*/
	function retornaBarraEscala()
	{
		$objImagem = $this->mapa->drawscalebar();
		if($objImagem->imagepath == "")
		{echo "Erro IMAGEPATH vazio";exit;}		
		$nomer = ($objImagem->imagepath)."sca".$this->nomeImagem.".png";
		$objImagem->saveImage($nomer);
		$nomer = ($objImagem->imageurl).basename($nomer);
		return ("var scaimagem='".$nomer."';var scawidth=".$objImagem->width.";var scaheight=".$objImagem->height.";var scapath='".$objImagem->imagepath."';var scaurl='".$objImagem->imageurl."'");
	}
/*
function: parametrosBarraEscala

Pega os par&acirc;metros da barra de escala.

return:
string javascript com os parametros.
*/
	function parametrosBarraEscala()
	{
		$eb = $this->mapa->scalebar;
		$cor = $eb->color;
		$fcor = $cor->red.",".$cor->green.",".$cor->blue;
		$cor = $eb->backgroundcolor;
		$bcor = $cor->red.",".$cor->green.",".$cor->blue;
		$cor = $eb->outlinecolor;
		$ocor = $cor->red.",".$cor->green.",".$cor->blue;
		return("var w=".$eb->width.";var h=".$eb->height.";var estilo=".$eb->style.";var intervalos=".$eb->intervals.";var unidade=".$eb->units.";var cor='".$fcor."';var bcor='".$bcor."';var ocor='".$fcor."'");
	}
/*
function: mudaEscalaGrafica

Muda os par&acirc;metros da barra de escala.

parameters:
$w - integer Largura.

$h - integer Altura.

$estilo - estilo

$intervalos - N&uacute;mero de intervalos.

$unidade - Tipo de unidade de medida.

$cor - Cor RGB separado por v&iacute;rgulas.

$bcor - Cor do fundo RGB separado por v&iacute;rgulas.

$ocor - Cor do contorno RGB separado por v&iacute;rgulas.
*/
	function mudaEscalaGrafica($w,$h,$estilo,$intervalos,$unidade,$cor,$bcor,$ocor)
	{
		$eb = $this->mapa->scalebar;
		$eb->set("width",$w);
		$eb->set("height",$h);
		if ($estilo != 2)
		{$eb->set("style",$estilo);}
		$eb->set("intervals",$intervalos);
		$eb->set("units",$unidade);
		$corn = $eb->color;
		$n = explode(",",$cor);
		$corn->setrgb($n[0],$n[1],$n[2]);
		$cornb = $eb->backgroundcolor;
		$n = explode(",",$bcor);
		$cornb->setrgb($n[0],$n[1],$n[2]);
		$corno = $eb->outlinecolor;
		$n = explode(",",$ocor);
		$corno->setrgb($n[0],$n[1],$n[2]);
		//desabilita a escala
		if ($estilo == 2)
		{$eb->set("status",MS_OFF);}
		else 
		{$eb->set("status",MS_EMBED);}
		$this->salva();
		return("ok");
}
/*
function: testaescalagrafica

Testa os par&acirc;metros da barra de escala.

Gera uma imagem da escala sem alterar o mapa

parameters:
$w - integer Largura.

$h - integer Altura.

$estilo - estilo

$intervalos - N&uacute;mero de intervalos.

$unidade - Tipo de unidade de medida.

$cor - Cor RGB separado por v&iacute;rgulas.

$bcor - Cor do fundo RGB separado por v&iacute;rgulas.

$ocor - Cor do contorno RGB separado por v&iacute;rgulas.

return:

string com o endere&ccedil;o da imagem criada
*/
	function testaescalagrafica($w,$h,$estilo,$intervalos,$unidade,$cor,$bcor,$ocor)
	{
		$eb = $this->mapa->scalebar;
		$eb->set("width",$w);
		$eb->set("height",$h);
		if ($estilo != 2)
		{$eb->set("style",$estilo);}
		$eb->set("intervals",$intervalos);
		$eb->set("units",$unidade);
		$corn = $eb->color;
		$n = explode(",",$cor);
		$corn->setrgb($n[0],$n[1],$n[2]);
		$cornb = $eb->backgroundcolor;
		$n = explode(",",$bcor);
		$cornb->setrgb($n[0],$n[1],$n[2]);
		$corno = $eb->outlinecolor;
		$n = explode(",",$ocor);
		$corno->setrgb($n[0],$n[1],$n[2]);
		$objImagem = $this->mapa->drawscalebar();
		$nomer = ($objImagem->imagepath)."sca".$this->nomeImagem.".png";
		$objImagem->saveImage($nomer);
		$nomer = ($objImagem->imageurl).basename($nomer);
		return ($nomer);
	}
}
?>