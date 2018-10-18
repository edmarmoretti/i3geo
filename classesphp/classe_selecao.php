<?php
/*
Title: classe_selecao.php

Sele&ccedil;&atilde;o de elementos de um tema.

Adiciona, remove, etc.

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
Voc&ecirc; deve ter recebido uma copia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/classesphp/classe_selecao.php
*/
/*
Classe: Selecao
*/
class Selecao
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
	Variavel: $qyfile

	Nome do arquivo de sele&ccedil;&atilde;o (.qy)
	*/
	public $qyfile;
	/*
	Variavel: $projO

	Objeto projection original do mapa. Obtido apenas na interface Googlemaps
	*/
	public $projO;
	/*
	Variavel: $v

	Vers&atilde;o atual do Mapserver (primeiro d&iacute;gito)
	*/
	public $v;
/*
Function: __construct

Cria um objeto Selecao

O tipo de interface usada pelo mapa &eacute; obtido do metadata "interface". Se for a interface Googlemaps, &eacute; feita a altera&ccedil;&atilde;o tempor&aacute;ria da proje&ccedil;&atilde;o do mapa.

parameters:

$map_file - Endere&ccedil;o do mapfile no servidor.

$tema - nome do tema

$ext - extens&atilde;o geogr&aacute;fica do mapa
*/

	function __construct($map_file,$tema="",$ext="")
	{
  		include_once(dirname(__FILE__)."/funcoes_gerais.php");
  		include(dirname(__FILE__)."/../ms_configura.php");
  		$this->postgis_mapa = $postgis_mapa;
		$this->v = versao();
		$this->v = $this->v["principal"];
		$this->qyfile = str_replace(".map","_qy.map",$map_file);
  		if($tema != ""){
  			$this->qyfileTema = dirname($map_file)."/".$tema."_qy.map";
  		}
		else{
			$this->qyfileTema = "";
		}

		$this->mapa = ms_newMapObj($map_file);
		substituiConObj($this->mapa,$postgis_mapa);

  		$this->arquivo = str_replace(".map","",$map_file).".map";
  		if($tema != "" && @$this->mapa->getlayerbyname($tema))
 		$this->layer = $this->mapa->getlayerbyname($tema);

  		$this->nome = $tema;
		$c = $this->mapa->numlayers;
		for ($i=0;$i < $c;++$i)
		{
			$l = $this->mapa->getlayer($i);
			$l->set("template","none.htm");
		}
		if($ext && $ext != ""){
			$e = explode(" ",$ext);
			$extatual = $this->mapa->extent;
			$extatual->setextent((min($e[0],$e[2])),(min($e[1],$e[3])),(max($e[0],$e[2])),(max($e[1],$e[3])));
		}
		if($this->mapa->getmetadata("interface") == "googlemaps"){
			$this->projO = $this->mapa->getProjection();
			$this->mapa->setProjection(pegaProjecaoDefault("proj4"));
		}
	}
/*
function: salva

Salva o mapfile atual
*/
 	function salva(){
	  	if($this->mapa->getmetadata("interface") == "googlemaps"){
	  		$this->mapa->setProjection($this->projO);
	  	}
	  	restauraConObj($this->mapa,$this->postgis_mapa);
	  	$this->mapa->save($this->arquivo);
	}
/*
function: nSel

Retorna o n&uacute;mero de elementos selecionados
*/
	function nSel(){
		return $this->layer->getNumresults();
	}
/*
function: selecaoPorPoligono

Seleciona os elementos de um tema baseado em um conjunto de pontos que formar&atilde;o um pol&iacute;gono.

parameters:

$tipo - Tipo de opera&ccedil;&atilde;o adiciona|retira|inverte|limpa|novo

$xs - lista de coordenadas x separadas por virgula

$ys - lista de coordenadas y separadas por virgula

$wkt - string wkt opcional ao uso de xs e ys

$buffer - buffer que ser� aplicado
*/
	function selecaoPorPoligono($tipo,$xs="",$ys="",$wkt="",$buffer=0){
		if(!$this->layer){return "erro";}
		$this->layer->set("tolerance",0);
		if ($tipo == "novo"){
			$this->selecaoLimpa();
			$tipo = "adiciona";
		}
		if ($tipo == "limpa")
		{return($this->selecaoLimpa());}
		if ($tipo == "inverte")
		{return($this->selecaoInverte());}
		$tipoLayer = $this->layer->type;
		if (file_exists($this->qyfile))
		{$this->mapa->loadquery($this->qyfile);}
		$indxlayer = $this->layer->index;
		$res_count = $this->layer->getNumresults();
		$shp_atual = array();
		if($this->qyfileTema != "" && file_exists($this->qyfileTema))
		{$shp_atual = $this->unserializeQ($this->qyfileTema);}

		$shpi = array();
		//transforma os pontos em shape
		if($wkt != ""){
			$s = ms_shapeObjFromWkt($wkt);
		}
		else{
			$s = ms_newShapeObj(MS_SHAPE_POLYGON);
			$linha = ms_newLineObj();
			$xs = explode(",",$xs);
			$ys = explode(",",$ys);
			for($i=0;$i<(count($xs));++$i)
			{
				$linha->addxy($xs[$i],$ys[$i]);
			}
			$linha->addxy($xs[0],$ys[0]);
			$s->add($linha);
		}
		if($buffer > 0){
			$s = $this->bufferShape($s,$buffer);
		}
		$this->layer->querybyshape($s);
		$res_count = $this->layer->getNumresults();
		for ($i = 0; $i < $res_count; ++$i)
		{
			$result = $this->layer->getResult($i);
			$shpi[]  = $result->shapeindex;
		}
		$this->layer->set("status",MS_DEFAULT);
		if (($tipo == "adiciona") && (count($shpi) > 0))
		{return($this->selecaoAdiciona($shpi,$shp_atual));}
		if (($tipo == "retira") && (count ($shp_atual) > 0))
		{return($this->selecaoRetira($shpi,$shp_atual));}
		return("Nada selecionado.");
	}
/*
function: selecaoTema

Seleciona os elementos de um tema baseado nos elementos selecionados em outro.

parameters:

$temao - Tema que ser&aacute; processado.

$tipo - Tipo de opera&ccedil;&atilde;o adiciona|retira|inverte|limpa|novo

$buffer - Opcional
*/
	function selecaoTema($temao,$tipo,$buffer=0){
		if(!$this->layer){return "erro";}
		$this->layer->set("tolerance",0);
		if ($tipo == "novo"){
			$this->selecaoLimpa();
			$tipo = "adiciona";
		}
		if ($tipo == "limpa"){
			return($this->selecaoLimpa());
		}
		if ($tipo == "inverte"){
			return($this->selecaoInverte());
		}
		$layero = $this->mapa->getlayerbyname($temao);
		if ($layero->type == MS_LAYER_LINE || $layero->type == 1){
			return("erro. O tema de sobreposicao nao pode ser do tipo linear.");
		}
		$tipoLayer = $this->layer->type;
		$tipoLayero = $layero->type;
		$this->layer->set("template","none.htm");
		$layero->set("template","none.htm");
		//if (file_exists($this->qyfile))
		//{$this->mapa->loadquery($this->qyfile);}
		$indxlayer = $this->layer->index;
		carregaquery2($this->arquivo,$layero,$this->mapa);
		$res_count = $this->layer->getNumresults();
		$res_counto = $layero->getNumresults();
		if ($res_counto == 0){
			return false;
		}
		$shp_atual = array();
		if($this->qyfileTema != "" && file_exists($this->qyfileTema)){
			$shp_atual = $this->unserializeQ($this->qyfileTema);
		}
		$shpi = array();
		$i = $layero->index;
		$selecao = "";
		if ($layero->data != ""){
			$sopen = $layero->open();
			if($sopen == MS_FAILURE){return "erro";}
			$res_count = $layero->getNumresults();
			for ($i = 0; $i < $res_count; ++$i)
			{
				if($this->v >= 6)
				{$sh = $layero->getShape($layero->getResult($i));}
				else{
					$result = $layero->getResult($i);
					$s  = $result->shapeindex;
					$sh = $layero->getfeature($s,-1);
				}
				if($buffer > 0){
					$sh = $this->bufferShape($sh,$buffer);
				}
				$tiposh = $sh->type;
				if ($tiposh == 2){
					$ident = @$this->layer->querybyshape($sh);
				}
				if ($tiposh == 0)
				{
					$lin = $sh->line(0);
					$npt = $lin->numpoints;
					if ($npt == 1)
					{
						$ptlin = $lin->point(0);
						$ident = $this->layer->queryByPoint($ptlin, 1, 0);
					}
					if ($npt > 1)
					{
					 	for ($k = 0; $k < $npt; $k++)
					 	{
					 	 	$ptlin = $lin->point($k);
				 		 	$s = $this->layer->queryByPoint($ptlin, 1, 0);
							if ($s != 1)
							{
								$res_countl = $this->layer->getNumresults();
								for ($kk = 0; $kk < $res_countl; $kk++)
								{
									$result = $this->layer->getResult($kk);
									$shpi[]  = $result->shapeindex;
								}
							}
				 		}
						$ident = 1;
					}
				}
				if ($ident != 1)
				{
					$res_countl = $this->layer->getNumresults();
					for ($ii = 0; $ii < $res_countl; $ii++)
					{
						$result = $this->layer->getResult($ii);
						$shpi[]  = $result->shapeindex;
					}
				}
			}
			$layero->close();
			if (count($shpi)>0){$selecao = "ok";}
		}
		if (($selecao != "ok") && ($layero->data == ""))
		{
			$layero->queryByRect($this->mapa->extent);
			$sopen = $layero->open();
			if($sopen == MS_FAILURE){return "erro";}
			$conta = $layero->getNumresults();
			for ($k = 0; $k < $conta; $k++)
			{
				if($this->v >= 6)
				{$s = @$layero->getShape($layero->getResult($k));}
				else
				{$s = @$layero->getfeature($k,-1);}
				if($buffer > 0){
					$s = $this->bufferShape($s,$buffer);
				}
				if($s){
					if ($s->type == 2)
					{
						$this->layer->querybyshape($s);
						$res_count = $this->layer->getNumresults();
						for ($i = 0; $i < $res_count; ++$i)
						{
							$result = $this->layer->getResult($i);
							$shpi[]  = $result->shapeindex;
						}
					}
					else
					{
						$lin = $s->line(0);
						$npt = $lin->numpoints;
						for ($c = 0; $c < $npt; $c++)
						{
							$pt = $lin->point($c);
							$this->layer->set("tolerance",0);
							$this->layer->set("toleranceunits",6);
							if (($this->layer->type == MS_POINT) || ($this->layer->type == MS_LINE))
							{
								$this->layer->set("tolerance",5);
								$ident = $this->layer->queryByPoint($pt, 1, 0);
							}
							else
							{$ident = $this->layer->queryByPoint($pt, 1, 0);}
							if ($ident != 1)
							{
								$res_countl = $this->layer->getNumresults();
								for ($ii = 0; $ii < $res_countl; $ii++)
								{
								$result = $this->layer->getResult($ii);
									if ($result->shapeindex != "")
									{$shpi[] = $result->shapeindex;}
								}
							}
						}
					}
				}
			}
			$layero->close();
		}
		if (($tipo == "adiciona") && (count($shpi) > 0))
		{return($this->selecaoAdiciona($shpi,$shp_atual));}
		if (($tipo == "retira") && (count ($shp_atual) > 0))
		{return($this->selecaoRetira($shpi,$shp_atual));}
	}
/*
function: selecaoAtributos

Sele&ccedil;&atilde;o simples por atributo. N&atilde;o permite composi&ccedil;&atilde;o de atributos, por&eacute;m, se valor for igual a vazio "",
a string existente em "operador" ser&aacute; incluida como est&aacute; no filtro. Para que isso funcione, a string
deve estar no padr&atilde;o utilizado pelo mapserver.

parameters:

$tipo - Tipo de opera&ccedil;&atilde;o adiciona|retira|inverte|limpa|novo

$item - Item que ser&aacute; consultado.

$operador - Operador.

$valor - Valor.
*/
	function selecaoAtributos($tipo,$item,$operador,$valor)
	{
		if ($tipo == "novo")
		{
			$this->selecaoLimpa();
			$tipo = "adiciona";
		}
		if ($tipo == "limpa")
		{return($this->selecaoLimpa());}
		if ($tipo == "inverte")
		{return($this->selecaoInverte());}
		if(!$this->layer){return "erro";}
		if($valor != "")
		{
			$operador = explode(",",$operador);
			$operador = $operador[1];
		}
		$this->layer->set("template","none.htm");
		$indxlayer = $this->layer->index;
		/*
		if (file_exists($this->qyfile))
		{$this->mapa->loadquery($this->qyfile);}
		$res_count = $this->layer->getNumresults();
		$shp_atual = array();
		for ($i = 0; $i < $res_count;++$i)
		{
			$rc = $this->layer->getResult($i);
			$shp_atual[] = $rc->shapeindex;
		}
		$this->mapa->freequery($indxlayer);
		*/
		$shp_atual = array();
		if($this->qyfileTema != "" && file_exists($this->qyfileTema))
		{$shp_atual = $this->unserializeQ($this->qyfileTema);}

		$shpi = array();
		if($this->layer->connectiontype == MS_POSTGIS)
		{
			if($valor != "")
			{$this->layer->querybyattributes($item,$item." ".$operador." '".$valor."' ",1);}
			else
			{$this->layer->querybyattributes($item,$operador,1);}
		}
		else
		{
			if($valor != "")
			{
				if(!is_numeric($valor))
				{$this->layer->querybyattributes($item,'("['.$item.']"'.$operador.'"'.$valor.'")',1);}
				else
				{$this->layer->querybyattributes($item,'(['.$item.']'.$operador.' '.$valor.' )',1);}
			}
			else
			{
				$this->layer->querybyattributes($item,$operador,1);
			}
		}
		$res_count = $this->layer->getNumresults();
		$shpi = array();
		for ($i = 0; $i < $res_count; ++$i)
		{
			$result = $this->layer->getResult($i);
			$shpi[]  = $result->shapeindex;
		}
		if ($tipo == "adiciona")
		{return($this->selecaoAdiciona($shpi,$shp_atual));}
		if ($tipo == "retira")
		{return($this->selecaoRetira($shpi,$shp_atual));}
		return("ok");
	}
	/*
	function: selecaoAtributos2

	Sele&ccedil;&atilde;o por atributo. Permite composi&ccedil;&atilde;o de atributos.

	parameters:

	$filtro - Express&atilde;o de sele&ccedil;&atilde;o

	$tipo - Tipo de opera&ccedil;&atilde;o adiciona|retira|inverte|limpa|novo
	*/
	function selecaoAtributos2($filtro,$tipo){
		$items = pegaItens($this->layer);
		if ($tipo == "novo")
		{
			$this->selecaoLimpa();
			$tipo = "adiciona";
		}
		if ($tipo == "limpa")
		{return($this->selecaoLimpa());}
		if ($tipo == "inverte")
		{return($this->selecaoInverte());}
		if(!$this->layer){return "erro";}
		$this->layer->set("template","none.htm");
		$indxlayer = $this->layer->index;
		$shp_atual = array();
		if($this->qyfileTema != "" && file_exists($this->qyfileTema))
		{$shp_atual = $this->unserializeQ($this->qyfileTema);}

		$shpi = array();

		$filtro = str_replace("|","'",$filtro);

		if ($this->layer->connectiontype == MS_POSTGIS && $this->v < 7)	{
			$filtro = str_replace("'[","",$filtro);
			$filtro = str_replace("[","",$filtro);
			$filtro = str_replace("]'","",$filtro);
			$filtro = str_replace("]","",$filtro);
			$filtro = str_replace("("," ",$filtro);
			$filtro = str_replace(")"," ",$filtro);
		}

		$teste = $this->layer->querybyattributes($items[0],$filtro,1);
		if($teste != MS_SUCCESS){
			$teste = $this->layer->queryByAttributes($items[0], mb_convert_encoding($filtro,"ISO-8859-1","UTF-8"), 1);
		}
		if($teste != MS_SUCCESS){
			$teste = $this->layer->queryByAttributes($items[0], mb_convert_encoding($filtro,"UTF-8","ISO-8859-1"), 1);
		}
		$res_count = $this->layer->getNumresults();
		$shpi = array();
		for ($i = 0; $i < $res_count; ++$i){
			$result = $this->layer->getResult($i);
			$shpi[]  = $result->shapeindex;
		}
		if ($tipo == "adiciona"){
			return($this->selecaoAdiciona($shpi,$shp_atual));
		}
		if ($tipo == "retira"){
			return($this->selecaoRetira($shpi,$shp_atual));
		}
		return("ok");
	}
/*
function: selecaoPT

Seleciona por ponto.

parameters:

$xy - X e Y separados por v&iacute;rgula.

$tipo - Tipo de opera&ccedil;&atilde;o adiciona|retira|inverte|limpa|novo
*/
	function selecaoPT($xy,$tipo,$tolerancia)
	{
		if ($tipo == "novo")
		{
			$this->selecaoLimpa();
			$tipo = "adiciona";
		}
		if ($tipo == "limpa")
		{return ($this->selecaoLimpa());}
		if ($tipo == "inverte")
		{return ($this->selecaoInverte());}
		if(!$this->layer){return "erro";}
		$shp_atual = array();
		if($this->qyfileTema != "" && file_exists($this->qyfileTema))
		{$shp_atual = $this->unserializeQ($this->qyfileTema);}
		$shpi = array();
		$c = explode(" ",$xy);

		$pt = ms_newPointObj();
		$pt->setXY($c[0], $c[1]);
		if ($tolerancia == 0)
		{
			$this->layer->set("tolerance",0);
			$this->layer->set("toleranceunits",6);
			if (($this->layer->type == MS_LAYER_POINT) || ($this->layer->type == MS_LAYER_LINE))
			{
				$this->layer->set("tolerance",5);
				$ident = @$this->layer->queryByPoint($pt, 1, 0);
			}
			else
			{$ident = @$this->layer->queryByPoint($pt, 1, 0);}
		}
		else
		{
			//error_reporting(0);
			$projInObj = ms_newprojectionobj("proj=longlat,ellps=WGS84,datum=WGS84,no_defs");
			$projOutObj = ms_newprojectionobj("proj=poly,ellps=GRS67,lat_0=0,lon_0=".$pt->x.",x_0=5000000,y_0=10000000");

			$poPoint = ms_newpointobj();
			$poPoint->setXY($pt->x, $pt->y);
			//$dd1 = ms_newpointobj();
			//$dd1->setXY($rect->minx, $rect->miny);

			$poPoint->project($projInObj, $projOutObj);
			$dd2 = ms_newpointobj();
			$dd2->setXY(($poPoint->x + $tolerancia), $poPoint->y);
			$dd2->project($projOutObj,$projInObj);
			$d = $pt->distanceToPoint($dd2);
			if ($d < 0){$d = $d * -1;}
			//calcula a distancia 29100
			//gera o buffer
			$s = ms_newShapeObj(MS_SHAPE_POINT);
			$linha = ms_newLineObj();
			$linha->add($pt);
			$s->add($linha);
			$buffer = $s->buffer($d);
			$ident = @$this->layer->queryByShape($buffer);
		}
		if ($ident != 1)
		{
			$res_count = $this->layer->getNumresults();
			$shpi = array();
			for ($i = 0; $i < $res_count; ++$i)
			{
				$result = $this->layer->getResult($i);
				$shpi[]  = $result->shapeindex;
			}
		}
		if ($tipo == "adiciona")
		{return($this->selecaoAdiciona($shpi,$shp_atual));}
		if ($tipo == "retira")
		{return($this->selecaoRetira($shpi,$shp_atual));}
	}
/*
function: selecaoLimpa

Limpa a sele&ccedil;&atilde;o do tema.
*/
	function selecaoLimpa($apagaQyfile=false){
		//apaga o arquivo do i3geo com os ids selecionados
		if(file_exists($this->qyfileTema)){
			unlink($this->qyfileTema);
		}
		//limpa de um tema
		if ($this->nome != "" && $apagaQyfile == false){
			if(!$this->layer){
				return "erro";
			}
			if (file_exists($this->qyfile)){
				$this->mapa->loadquery($this->qyfile);
				$indxlayer = $this->layer->index;
				$this->mapa->freequery($indxlayer);
				$this->mapa->savequery($this->qyfile);
			}
		}
		elseif ($this->nome == ""){
			//limpa de todos os temas
			$c = $this->mapa->numlayers;
			for ($i=0;$i < $c;$i++){
				$l = $this->mapa->getlayer($i);
				$file = dirname($this->arquivo)."/".$l->name.".php";
				if (file_exists($file)){
					unlink ($file);
				}
				$file = dirname($this->arquivo)."/".$l->name."_qy.map";
				if (file_exists($file)){
					unlink ($file);
				}
			}
			if (file_exists($this->qyfile)){
				unlink ($this->qyfile);
			}
		}
		return("ok");
	}

/*
function: selecaoInverte

Inverte sele&ccedil;&atilde;o do tema.
*/
	function selecaoInverte(){
		if(!$this->layer){
			return "erro";
		}
		$shp_atual = array();
		if($this->qyfileTema != "" && file_exists($this->qyfileTema)){
			$shp_atual = $this->unserializeQ($this->qyfileTema);
		}
		//TODO utilizar atributos qd for postgis para melhorar a performance
		/*
		if($this->layer->connectiontype == MS_POSTGIS){
			$items = pegaItens($this->layer);
			$this->layer->querybyattributes($items[0],$items[0].' > 0 ',1);
			echo $this->layer->getNumresults();exit;
		}
		else {
			$this->layer->queryByrect($this->mapa->extent);
		}
		*/
		$this->layer->queryByrect($this->mapa->extent);
		$res_count = $this->layer->getNumresults();
		$shp_todos = array();
		for ($i = 0; $i < $res_count;++$i){
			$rc = $this->layer->getResult($i);
			$shp_todos[] = $rc->shapeindex;
		}
		$shp = array_diff($shp_todos,$shp_atual);
		$this->serializeQ($this->qyfileTema,$shp);
		return("ok");
	}
/*
function: selecaoAdiciona

Adiciona elementos na sele&ccedil;&atilde;o do tema.

parameters:

$shpi - Indices dos registros novos.

$shp_atual - Indices dos elementos j&aacute; selecionados.
*/
	function selecaoAdiciona($shpi,$shp_atual){
		//error_reporting(0);
		if(!$this->layer){
			return "erro";
		}
		$shp = array_merge($shpi,$shp_atual);
		$shp = array_unique($shp);
		$this->serializeQ($this->qyfileTema,$shp);
		return("ok");
	}
/*
function: selecaoRetira

Retira elementos na sele&ccedil;&atilde;o do tema.

parameters:

$shpi - Indices dos registros que ser&atilde;o retirados.

$shp_atual - Indices dos elementos j&aacute; selecionados.
*/
	function selecaoRetira($shpi,$shp_atual){
		if(!$this->layer){
			return "erro";
		}
		$shp = array_diff($shp_atual,$shpi);
		$shp = array_unique($shp);
		$this->serializeQ($this->qyfileTema,$shp);
		return("ok");
	}
/*
function: incluiSel

Inclui uma lista de ids na sele&ccedil;&atilde;o do tema.

Salva o arquivo .qy adicionando os novos registros

parameters:

$ids - Ids separados por v&iacute;rgula correspondendo aos registros.
*/
	function incluiSel($ids){
		if(!$this->layer){
			return "erro";
		}
		$ids = explode(",",$ids);
		$ids = array_unique($ids);
		$this->serializeQ($this->qyfileTema,$ids);
		return("ok");
	}
/*
function: selecao2tema

Exporta elementos selecionados de um tema em shape file e adiciona no mapa atual.

parameters:
$locaplic - localiza&ccedil;&atilde;o do I3geo

$dir_tmp - localiza&ccedil;&atilde;o do diret&oacute;rio tempor&aacute;rio
*/
	function selecao2tema($locaplic,$dir_tmp)
	{
		if(!$this->layer){return "erro";}
		error_reporting(0);
		$nomeshp = criaSHP($this->nome,$this->arquivo,$locaplic,$dir_tmp,true,"",false);
		$novolayer = criaLayer($this->mapa,$this->layer->type,MS_DEFAULT,"Sele&ccedil;&atilde;o de ".(pegaNome($this->layer))." (".$this->nome.")",$metaClasse="SIM");
		if($this->layer->getprojection() != ""){
			$novolayer->setprojection($this->layer->getprojection());
		}
		$novolayer->set("data",$nomeshp.".shp");
		$novolayer->set("name",basename($nomeshp));
		$down = "nao";
		$down = $this->layer->getmetadata("download");
		if ($down == ""){
			$down = "sim";
		}
		$novolayer->setmetadata("DOWNLOAD",$down);
		$tipo = $this->layer->type;
		if ($this->layer->getmetadata("TABELA") != ''){
			$novolayer->setmetadata("TABELA","NAO");
		}
		$novolayer->setmetadata("TEMALOCAL","SIM");
		$novolayer->setfilter("");
		return true;
	}
/*
function: selecaoEXT

Seleciona por extens&atilde;o geogr&aacute;fica.

parameters:

$tipo - Tipo de opera&ccedil;&atilde;o adiciona|retira|inverte|limpa|novo
*/
	function selecaoEXT($tipo)
	{
		if ($tipo == "novo")
		{
			$this->selecaoLimpa();
			$tipo = "adiciona";
		}
		if(!$this->layer){return "erro";}
		$this->layer->set("tolerance",0);
		if ($tipo == "limpa")
		{return ($this->selecaoLimpa());}
		if ($tipo == "inverte")
		{return ($this->selecaoInverte());}
		if (file_exists($this->qyfile))
		{$this->mapa->loadquery($this->qyfile);}
		$indxlayer = $this->layer->index;
		/*
		$res_count = $this->layer->getNumresults();
		$shp_atual = array();
		for ($i = 0; $i < $res_count;++$i)
		{
			$rc = $this->layer->getResult($i);
			$shp_atual[] = $rc->shapeindex;
		}
		$this->mapa->freequery($indxlayer);
		*/
		$shp_atual = array();
		if($this->qyfileTema != "" && file_exists($this->qyfileTema))
		{$shp_atual = $this->unserializeQ($this->qyfileTema);}

		$shpi = array();
		$rect = $this->mapa->extent;
		$ident = @$this->layer->queryByRect($rect);
		if ($ident != 1)
		{
			$res_count = $this->layer->getNumresults();
			$shpi = array();
			for ($i = 0; $i < $res_count; ++$i)
			{
				$result = $this->layer->getResult($i);
				$shpi[]  = $result->shapeindex;
			}
		}
		if ($tipo == "adiciona")
		{return($this->selecaoAdiciona($shpi,$shp_atual));}
		if ($tipo == "retira")
		{return($this->selecaoRetira($shpi,$shp_atual));}
	}
/*
function: selecaoBOX

Seleciona por ret&acirc;ngulo.

parameters:

$tipo - Tipo de opera&ccedil;&atilde;o adiciona|retira|inverte|limpa|novo

$ext - coordenadas separadas por espa&ccedil;os no estilo xmin ymin xmax ymax

$retornaShapes - retorna os shapes selecionados. Nesse caso, nao e gerado o arquivo em disco contendo a selecao
*/
	function selecaoBOX($tipo,$ext,$retornaShapes=false)	{
		if ($tipo == "novo"){
			$this->selecaoLimpa();
			$tipo = "adiciona";
		}

		if(!$this->layer){
			return "erro";
		}
		$this->layer->set("tolerance",0);
		if ($tipo == "limpa"){
			return ($this->selecaoLimpa());
		}
		if ($tipo == "inverte") {
			return ($this->selecaoInverte());
		}
		if (file_exists($this->qyfile))	{
			$this->mapa->loadquery($this->qyfile);
		}
		$indxlayer = $this->layer->index;
		$shp_atual = array();
		if($this->qyfileTema != "" && file_exists($this->qyfileTema)) {
			$shp_atual = $this->unserializeQ($this->qyfileTema);
		}

		$shpi = array();
		$temp = explode(" ",$ext);
		$rect = ms_newRectObj();

		$rect->set("minx",(min(array($temp[0],$temp[2]))));
		$rect->set("miny",(min(array($temp[1],$temp[3]))));
		$rect->set("maxx",(max(array($temp[0],$temp[2]))));
		$rect->set("maxy",(max(array($temp[1],$temp[3]))));
		$ident = $this->layer->queryByRect($rect);
		error_reporting(0);
		if ($ident != 1){
			$res_count = $this->layer->getNumresults();
			//echo $res_count;exit;325449
			$shpi = array();
			for ($i = 0; $i < $res_count; ++$i)	{
				$result = $this->layer->getResult($i);
				if($result != MS_FALSE){
					if($retornaShapes == false){
						$shpi[]  = $result->shapeindex;
					}
					else {
						if($this->v >= 6){
							$shpi[] = $this->layer->getshape($result);
						}
						else{
							$shpi[] = $this->layer->getfeature($result->shapeindex,-1);
						}
					}
				}
			}
		}
		if($retornaShapes == true){
			return $shpi;
		}
		if ($tipo == "adiciona"){
			return($this->selecaoAdiciona($shpi,$shp_atual));
		}
		if ($tipo == "retira"){
			return($this->selecaoRetira($shpi,$shp_atual));
		}
	}
/*
function unserializeQ

Deserializa um arquivo.

Parametros:
$arquivo - arquivo que ser&aacute; processado
*/
	function unserializeQ($arq)
	{
		$arq = str_replace("_qy.map","",$arq)."_qy.map";
		$handle = fopen ($arq, "r");
		$conteudo = fread ($handle, filesize ($arq));
		fclose ($handle);
		return(unserialize($conteudo));
	}
/*
function serializeQ

Serializa um arquivo.

Parametros:
$arquivo - arquivo que ser&aacute; processado

$geos - array com os dados
*/
	function serializeQ($arq,$geos)
	{
		$arq = str_replace("_qy.map","",$arq)."_qy.map";
		if (file_exists($arq)){
			unlink($arq);
		}
		$fp = fopen($arq,"w");
		$r = serialize($geos);
		fwrite($fp,$r);
		fclose($fp);
	}
	/*
	function projetaDistancia

	Projeta um valor de distancia em metros para dd

	Parametros:

	$shape - objeto usado para calcular o centro da projecao

	$distancia - distancia em metros
	*/
	function projetaDistancia($shape,$distancia){
		//error_reporting(0);
		$pt = $shape->getCentroid();
		$projInObj = ms_newprojectionobj("proj=longlat,ellps=WGS84,datum=WGS84,no_defs");
		$projOutObj = ms_newprojectionobj("proj=poly,ellps=GRS67,lat_0=0,lon_0=".$pt->x.",x_0=5000000,y_0=10000000");
		$poPoint = ms_newpointobj();
		$poPoint->setXY($pt->x, $pt->y);
		$poPoint->project($projInObj, $projOutObj);
		$dd2 = ms_newpointobj();
		$dd2->setXY(($poPoint->x + $distancia), $poPoint->y);
		$dd2->project($projOutObj,$projInObj);
		$d = $pt->distanceToPoint($dd2);
		if ($d < 0){$d = $d * -1;}
		return $d;
	}
	/*
	 function bufferShape

	Buffer de um shape em metros

	Parametros:

	$shape - objeto usado para calcular o centro da projecao

	$distancia - distancia em metros
	*/
	function bufferShape($shape,$distancia){
		$d = $this->projetaDistancia($shape,$distancia);
		$b = $shape->buffer($d);
		return $b;
	}
}
?>
