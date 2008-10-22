<?php
/*
Title: classe_navegacao.php

Operações de navegação que alteram a abrangência do mapa.

Alteração de escala, deslocamento, etc.

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

File: i3geo/classesphp/classe_navegacao.php

19/6/2007
*/
/*
Class: Navegacao
*/
class Navegacao
{
	/*
	Variable: $mapa
	
	Objeto mapa
	*/
	public $mapa;
	/*
	Variable: $arquivo
	
	Arquivo map file
	*/
	protected $arquivo;
	
/*
function: __construct

Cria um objeto avegacao 

parameters:
$map_file - string $map_file Endereço do mapfile no servidor. 
*/  	
	function __construct($map_file,$locaplic="")
	{
  		//error_reporting(E_ALL);
  		if(file_exists($locaplic."/funcoes_gerais.php"))
  		include_once($locaplic."/funcoes_gerais.php");
  		else
  		include_once("funcoes_gerais.php");
  		$this->mapa = ms_newMapObj($map_file);
  		$this->arquivo = $map_file;
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

Afasta a visualização de um mapa (zoom out)

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
		$pt->free();
		return("ok");
	}
/*
function: aproxima

Aproxima a visualização de um mapa (zoom in)

O centro do mapa permanece inalterado, mudando-se apenas a escala.

paremeter:
$nivel - integer Nível de zoom.
*/	
	function aproxima($nivel)
	{
		$this->mapa->preparequery();
		$pt = ms_newPointObj();
		if ($pt->setXY(($this->mapa->width) / 2, ($this->mapa->height) / 2) != -1)
		{$this->mapa->zoompoint($nivel,$pt,($this->mapa->width),($this->mapa->height),$this->mapa->extent);}
		$pt->free();
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

Aplica uma resolução nova ao mapa atual

Utilizado para gerar imagens ampliadas do mapa atual

parameter:
$resolucao - Resolução a ser aplicada
*/
	function aplicaResolucao($resolucao)
	{
	 	$this->mapa->setsize(($this->mapa->width) * $resolucao,($this->mapa->height) * $resolucao);
	}
/*
function: pan

Desloca a visualização de um mapa (pan).

parameters:
$x - Valor de x em décimos de grau.

$y - Valor de y em décimos de grau.

$escala - Valor da escala (utilizado quando o clique é feito sobre o mapa de referência).

$tipo - ref| Indica se o ponto foi clicado no mapa ou no mapa de referência 
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
		$pt->free();
		return ("ok");
	}
/*
function: mudaExtensao

Muda a extensão geográfica do mapa.

parameter:
$ext -  Extensão geográfica a ser aplicada com valores separados por virgula ou espaços.
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
		$pt->free();
		return("ok");
	}
/*
function: zoomPonto

Desloca o centro do mapa para um ponto específico.

parameter:
$xy - XY com as coordenadas separado por espaço
*/
	function zoomPonto($xy)
	{
		$apt = explode(" ",$xy);
		$pt = ms_newPointObj();
		$e = $this->mapa->extent;
		$pt = xy2imagem($this->arquivo,$xy);
		$this->mapa->zoompoint(1,$pt,($this->mapa->width),($this->mapa->height),$e);
		$pt->free();
	}	
}
?>