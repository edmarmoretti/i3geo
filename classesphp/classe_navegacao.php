<?php
/*
Title: classe_navegacao.php

Opera&ccedil;&otilde;es de navega&ccedil;&atilde;o que alteram a abrang&ecirc;ncia do mapa.

Altera&ccedil;&atilde;o de escala, deslocamento, etc.

Os par&acirc;metros locaplic e sid s&atilde;o geralmente opcionais. Quando for necess&aacute;rio escap&aacute;-los, utilize &quot;&quot;.

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
Voc&ecirc; deve ter recebido uma c�pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/classesphp/classe_navegacao.php
*/
/*
Classe: Navegacao
*/
class Navegacao
{
	/*
	Variavel: $mapa

	Objeto mapa
	*/
	public $mapa;
	/*
	Variavel: $arquivo

	Arquivo map file
	*/
	protected $arquivo;

/*
function: __construct

Cria um objeto avegacao

parameters:
$map_file - string $map_file Endere&ccedil;o do mapfile no servidor.
*/
	function __construct($map_file,$locaplic="")
	{
		include(dirname(__FILE__)."/../ms_configura.php");
  		$this->postgis_mapa = $postgis_mapa;

  		if(file_exists($locaplic."/funcoes_gerais.php"))
  		include_once($locaplic."/funcoes_gerais.php");
  		else
  		include_once("funcoes_gerais.php");

  		$this->mapa = ms_newMapObj($map_file);
  		substituiConObj($this->mapa,$postgis_mapa);
  		$this->arquivo = str_replace(".map","",$map_file).".map";
	}
/*
function: salva

Salva o mapfile atual
*/
 	function salva()
 	{
 		restauraConObj($this->mapa,$this->postgis_mapa);
 		$this->mapa->save($this->arquivo);
	}
/*
function: gravaImagemCorpo (depreciado)

Grava a imagem do mapa atual

return:
string - nome da imagem gravada
*/
	function gravaImagemCorpo()
	{
	 	$imgo = $this->mapa->draw();
		$nome = ($imgo->imagepath).nomeRandomico().".png";
		$salva = $imgo->saveImage($nome);
		if ($salva != -1)
		{return ($imgo->imageurl).basename($nome);}
		else
		{return "erro";}
	}
/*
function: afasta

Afasta a visualiza&ccedil;&atilde;o de um mapa (zoom out)

O centro do mapa permanece inalterado, mudando-se apenas a escala.

parameter:
$nivel - nivel de zoom
*/
	function afasta($nivel)
	{
		$this->mapa->preparequery();
		$pt = ms_newPointObj();
		if ($pt->setXY(($this->mapa->width) / 2, ($this->mapa->height) / 2) != -1)
		{$this->mapa->zoompoint(($nivel * -1),$pt,($this->mapa->width),($this->mapa->height),$this->mapa->extent);}
		return("ok");
	}
/*
function: aproxima

Aproxima a visualiza&ccedil;&atilde;o de um mapa (zoom in)

O centro do mapa permanece inalterado, mudando-se apenas a escala.

paremeter:
$nivel - integer N&iacute;vel de zoom.
*/
	function aproxima($nivel)
	{
		$this->mapa->preparequery();
		$pt = ms_newPointObj();
		if ($pt->setXY(($this->mapa->width) / 2, ($this->mapa->height) / 2) != -1)
		{$this->mapa->zoompoint($nivel,$pt,($this->mapa->width),($this->mapa->height),$this->mapa->extent);}
		return("ok");
	}
/*
function: desabilitaRASTER

Desliga o status das camadas raster

*/
	function desabilitaRASTER()
	{
		$c = $this->mapa->numlayers;
		for ($i=0;$i < $c;++$i)
		{
			$layer = $this->mapa->getlayer($i);
	 		if ($layer->type == MS_LAYER_RASTER)
	 		{$layer->set("status",MS_OFF);}
	 	}
	}
/*
function: aplicaResolucao

Aplica uma resolu&ccedil;&atilde;o nova ao mapa atual

Utilizado para gerar imagens ampliadas do mapa atual

parameter:

$resolucao - Resolu&ccedil;&atilde;o a ser aplicada

$ext - extens&atilde;o geogr&aacute;fica que ser&aacute; aplicada ao mapa
*/
	function aplicaResolucao($resolucao,$ext="")
	{
		if($ext && $ext != ""){
			$e = explode(" ",$ext);
			$extatual = $this->mapa->extent;
			$extatual->setextent((min($e[0],$e[2])),(min($e[1],$e[3])),(max($e[0],$e[2])),(max($e[1],$e[3])));
		}
		$this->mapa->setsize(($this->mapa->width) * $resolucao,($this->mapa->height) * $resolucao);
	}
/*
function: pan

Desloca a visualiza&ccedil;&atilde;o de um mapa (pan).

parameters:
$x - Valor de x em coordenadas de imagem.

$y - Valor de y em coordenadas de imagem.

$escala - Valor da escala (utilizado quando o clique &eacute; feito sobre o mapa de refer&ecirc;ncia).

$tipo - ref| Indica se o ponto foi clicado no mapa ou no mapa de refer&ecirc;ncia
*/
	function pan($x,$y,$escala,$tipo)
	{
		$this->mapa->preparequery();
		$r = $this->mapa;
		if ($tipo == "ref")
		{$r = $this->mapa->reference;}
		$pt = ms_newPointObj();
		$pt->setXY($x , $y);
		if ($escala!="") //no caso de mudar em funcao do mapa de referencia
		{$this->mapa->zoomscale($escala,$pt,($r->width),($r->height),($r->extent));}
		else
		{$this->mapa->zoompoint(1,$pt,($this->mapa->width),($this->mapa->height),($this->mapa->extent));}
		return ("ok");
	}
/*
function: mudaExtensao

Muda a extens&atilde;o geogr&aacute;fica do mapa.

parameter:
$ext -  Extens&atilde;o geogr&aacute;fica a ser aplicada com valores separados por virgula ou espa&ccedil;os.
*/
	function mudaExtensao($ext)
	{
		$e = explode(" ",$ext);
		if (count($e) != 4){$e = explode(",",$ext);}
		if (count($e) != 4){exit;}
		$extatual = $this->mapa->extent;
		if (($e[0] == $e[2]) && ($e[1] == $e[3]))
		{
			$e[0] = $e[0] - 0.0001;
			$e[2] = $e[2] + 0.0001;
			$e[1] = $e[1] - 0.0001;
			$e[3] = $e[3] + 0.0001;
		}
		$extatual->setextent((min($e[0],$e[2])),(min($e[1],$e[3])),(max($e[0],$e[2])),(max($e[1],$e[3])));
		return ("ok");
	}
/*
function: mudaEscala

Muda a escala do mapa.

parameter:
$escala - Escala a ser aplicada.
*/
	function mudaEscala($escala)
	{
		$pt = ms_newPointObj();
		$pt->setXY(($this->mapa->width) / 2, ($this->mapa->height) / 2);
		$this->mapa->zoomscale($escala,$pt,($this->mapa->width),($this->mapa->height),$this->mapa->extent);
		return("ok");
	}
/*
function: zoomPonto

Desloca o centro do mapa para um ponto espec&iacute;fico.

parameter:
$xy - XY com as coordenadas separado por espa&ccedil;o
*/
	function zoomPonto($xy)
	{
		$apt = explode(" ",$xy);
		$pt = ms_newPointObj();
		$e = $this->mapa->extent;
		$pt = xy2imagem($this->arquivo,$xy);
		$this->mapa->zoompoint(1,$pt,($this->mapa->width),($this->mapa->height),$e);
	}
}
?>