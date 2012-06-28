<?php
/*
Title: classe_toponimia.php

Processa a topon&iacute;mia de um tema.

Adiciona, remove, altera, etc.

Cria camadas com a topon&iacute;mia e gerencia o status das etiquetas mostradas no mapa.

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

i3geo/classesphp/classe_toponimia.php
*/
/*
Classe: Toponimia
*/

class Toponimia
{
	/*
	Variavel: $mapa
	
	Objeto mapa
	*/
	protected $mapa;
	/*
	Variavel: $map_file
	
	Arquivo map file
	*/
	protected $map_file;
	/*
	Variavel: $layer
	
	Objeto layer
	*/
	protected $layer;
	/*
	Variavel: $nome
	
	Nome do layer
	*/
	protected $nome;
/*
function __construct

Cria um objeto map e seta a variavel tema 

parameters:
$map_file - Endere&ccedil;o do mapfile no servidor. 

$tema - nome do tema que ser&aacute; processado
*/
	function __construct($map_file,$tema="",$locaplic="")
	{
  		//error_reporting(E_ALL);
  		if(file_exists($locaplic."/funcoes_gerais.php"))
  		include_once($locaplic."/funcoes_gerais.php");
  		else
  		include_once("funcoes_gerais.php");
		$this->v = versao();
		$this->v = $this->v["principal"];		
  		$this->mapa = ms_newMapObj($map_file);
  		$this->arquivo = $map_file;
  		if($tema != "" && @$this->mapa->getlayerbyname($tema))
 		$this->layer = $this->mapa->getlayerbyname($tema);
  		$this->nome = $tema;
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
function: criaToponimia

Cria a topon&iacute;mia de um tema

parameter:

$item Item que ser&aacute; utilizado.

$position Posi&ccedil;&atilde;o da &acirc;ncora do texto.

$partials Corta texto nas bordas do mapa.

$offsetx Deslocamento em X.

$offsety Deslocamento em Y.

$minfeaturesize Tamanho m&iacute;nimo que o texto deve ter.

$mindistance Dist&acirc;ncia m&iacute;nima entre os textos.

$force For&ccedil;a colis&atilde;o.

$shadowcolor Cor da sombra.

$shadowsizex Tamanho em X da sombra.

$shadowsizey Tamanho em Y da sombra.

$outlinecolor Cor do contorno.

$cor Cor do texto.

$sombray Deslocamento Y da sombra.

$sombrax Deslocamento X da sombra.

$sombra string Inclui sombra.

$fundo Cor do fundo.

$angulo &Acirc;ngulo do texto.

$tamanho Tamanho do texto.

$fonte Fonte.

$tipo Tipo teste|

$wrap

$novotema sim|nao Cria um novo tema ou n&atilde;o, nesse &uacute;ltimo caso, a topon&iacute;mia &eacute; inserida em todas as classes

Retorno:

{string} - código do layer criado
*/
	function criaToponimia($item,$position,$partials,$offsetx,$offsety,$minfeaturesize,$mindistance,$force,$shadowcolor,$shadowsizex,$shadowsizey,$outlinecolor,$cor,$sombray,$sombrax,$sombra,$fundo,$angulo,$tamanho,$fonte,$tipo,$wrap,$novotema="sim")
	{
		error_reporting(E_ALL);
		if(!$this->layer){return "erro";}
		if (!isset($tipo)){$tipo = "";}
		if ($item != "") //o layer nao tem tabela mas tem toponimia
		{
			if($novotema == "sim"){
				$nome = pegaNome($this->layer);
				$novolayer = ms_newLayerObj($this->mapa, $this->layer);
				$nomer = nomeRandomico();
				$novolayer->set("name",$nomer);
				$novolayer->set("group","");
				$novolayer->set("type",MS_LAYER_ANNOTATION);
				$nclasses = $novolayer->numclasses;
				for ($i=0; $i < $nclasses; ++$i)
				{
					$c = $novolayer->getclass($i);
					$c->set("status",MS_DELETE);
				}
				$novac = ms_newClassObj($novolayer);
				$novolayer->set("status",MS_DEFAULT);
				$novolayer->setmetadata("tema","texto de ".$nome);
			}
			else{
				$nomer = $this->layer->name;
				$novolayer = $this->mapa->getlayerbyname($nomer);
			}
			$novolayer->setmetadata("cache","");
			$novolayer->set("labelitem",$item);
			$this->layer = $novolayer;
		}
		else
		{
			//$novac = $this->layer->getclass(0);
			$nomer = $this->layer->name;
		}
		$nclasses = $this->layer->numclasses;
		for ($i=0; $i < $nclasses; ++$i){
			$novac = $this->layer->getclass($i);
			$label = $novac->label;
			if($wrap != "")
			{
				$label->set("maxlength",1);
				$s = $novac->getTextString;
				$s = "CLASS LABEL WRAP '$wrap' END END";
				$novac->updateFromString($s);
			}
			$label = $novac->label;
			if ($fonte != "bitmap")
			{
				$label->set("type",MS_TRUETYPE);
				$label->set("font",$fonte);
				$label->set("size",$tamanho);
			}
			else
			{
				$label->set("type",MS_BITMAP);
				//$label->set("font",$fonte);
				$t = MS_TINY;
				if ($tamanho > 5 ){$t = MS_TINY;}
				if ($tamanho >= 7 ){$t = MS_SMALL;}
				if ($tamanho >= 10 ){$t = MS_MEDIUM;}
				if ($tamanho >= 12 ){$t = MS_LARGE;}
				if ($tamanho >= 14 ){$t = MS_GIANT;}
				$label->set("size",$t);
			}
			if($angulo > 0){
				$label->set("angle",$angulo);
			}
			if($angulo == "AUTO")
			{$label->updatefromstring("LABEL ANGLE AUTO END");}
			if (strtoupper($angulo) == "CURVO" || strtoupper($angulo) == "FOLLOW")
			{
				$label->updatefromstring("LABEL ANGLE FOLLOW END");
			}
			corE($label,$cor,"color");	
			corE($label,$fundo,"backgroundcolor");
			corE($label,$sombra,"backgroundshadowcolor",$sombrax,$sombray);
			//$label->set("backgroundshadowsizex",$sombrax);
			//$label->set("backgroundshadowsizey",$sombray);
			corE($label,$outlinecolor,"outlinecolor");
			corE($label,$shadowcolor,"shadowcolor");
			$label->set("shadowsizex",$shadowsizex);
			$label->set("shadowsizey",$shadowsizey);
			$label->set("force",$force);
			$label->set("mindistance",$mindistance);
			$label->set("minfeaturesize",$minfeaturesize);
			$label->set("offsetx",$offsetx);
			$label->set("offsety",$offsety);
			$label->set("partials",$partials);
			$p = array("MS_AUTO"=>MS_AUTO,"MS_UL"=>MS_UL,"MS_LR"=>MS_LR,"MS_UR"=>MS_UR,"MS_LL"=>MS_LL,"MS_CR"=>MS_CR,"MS_CL"=>MS_CL,"MS_UC"=>MS_UC,"MS_LC"=>MS_LC,"MS_CC"=>MS_CC);
			$label->set("position",$p[$position]);
		}
		if ($tipo == "teste"){
	 		$i = gravaImagemMapa($this->mapa);
			return ($i["url"]);
		}
		else
		{return($nomer);}
	}
	/*
function: ativaEtiquetas

ativa a inclus&atilde;o de etiquetas em um tema

parameter:
$item Lista de Itens separados por v&iacute;rgula que ser&atilde;o utilizados.	
*/
	function ativaEtiquetas($item)
	{
		if(!$this->layer){return "erro";}
		$this->layer->setmetadata("IDENTIFICA","");
		$this->layer->setmetadata("TIP",$item);
		return("ok");
	}
/*
function: removeEtiquetas

remove a inclus&atilde;o de etiquetas em um tema.

*/
	function removeEtiquetas()
	{
		if(!$this->layer){return "erro";}
		$this->layer->setmetadata("TIP","");
		return("ok");
	}
}
?>