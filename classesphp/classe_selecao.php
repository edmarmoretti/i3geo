<?php
/*
Title: classe_selecao.php

Seleção de elementos de um tema.

Adiciona, remove, etc.

Licenca:

GPL2


i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
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
	
	Nome do arquivo de seleção (.qy)
	*/
	public $qyfile;
	/*
	Variavel: $projO
	
	Objeto projection original do mapa. Obtido apenas na interface Googlemaps
	*/
	public $projO;
	/*
	Variavel: $v
	
	Versão atual do Mapserver (primeiro dígito)
	*/
	public $v;
/*
Function: __construct

Cria um objeto Selecao 

O tipo de interface usada pelo mapa é obtido do metadata "interface". Se for a interface Googlemaps, é feita a alteração temporária da projeção do mapa.

parameters:

$map_file - Endereço do mapfile no servidor.

$tema - nome do tema

$ext - extensão geográfica do mapa
*/

	function __construct($map_file,$tema="",$ext="")
	{
  		if(file_exists($locaplic."/funcoes_gerais.php"))
  		include_once($locaplic."/funcoes_gerais.php");
  		else
  		include_once("funcoes_gerais.php");
		$this->v = versao();
		$this->v = $this->v["principal"];
		$this->qyfile = str_replace(".map",".qy",$map_file);
  		if($tema != "")
		{$this->qyfileTema = dirname($map_file)."/".$tema.".php";}
		else
		{$this->qyfileTema = "";}
		$this->mapa = ms_newMapObj($map_file);
  		$this->arquivo = $map_file;
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
			$this->mapa->setProjection("init=epsg:4618,a=6378137,b=6378137");
		}		
	}
/*
function: salva

Salva o mapfile atual 
*/	
 	function salva()
 	{
	  	if (connection_aborted()){exit();}
	  	if($this->mapa->getmetadata("interface") == "googlemaps")
		{$this->mapa->setProjection($this->projO);}		
	  	$this->mapa->save($this->arquivo);
	}
/*
function: nSel

Retorna o número de elementos selecionados 
*/	
	function nSel(){
		return $this->layer->getNumresults();
	}
/*
function: selecaoPorPoligono

Seleciona os elementos de um tema baseado em um conjunto de pontos que formarão um polígono.

parameters:

$tipo - Tipo de operação adiciona|retira|inverte|limpa|novo

$xs - lista de coordenadas x separadas por virgula

$ys - lista de coordenadas y separadas por virgula
*/
	function selecaoPorPoligono($tipo,$xs,$ys)
	{
		if(!$this->layer){return "erro";}
		$this->layer->set("tolerance",0);
		if ($tipo == "novo")
		{
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
		/*
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
		//transforma os pontos em shape
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

$temao - Tema que será processado.

$tipo - Tipo de operação adiciona|retira|inverte|limpa|novo
*/
	function selecaoTema($temao,$tipo)
	{
		if(!$this->layer){return "erro";}
		$this->layer->set("tolerance",0);
		if ($tipo == "novo")
		{
			$this->selecaoLimpa();
			$tipo = "adiciona";
		}
		if ($tipo == "limpa")
		{return($this->selecaoLimpa());}
		if ($tipo == "inverte")
		{return($this->selecaoInverte());}
		$layero = $this->mapa->getlayerbyname($temao);
		if ($layero->type == MS_LAYER_LINE || $layero->type == 1)
		{return("erro. O tema de sobreposicao nao pode ser do tipo linear.");}
		$tipoLayer = $this->layer->type;
		$tipoLayero = $layero->type;
		$this->layer->set("template","none.htm");
		$layero->set("template","none.htm");
		/*
		if (file_exists($this->qyfile))
		{$this->mapa->loadquery($this->qyfile);}
		*/
		$indxlayer = $this->layer->index;
		$res_count = $this->layer->getNumresults();
		$res_counto = $layero->getNumresults();
		if ($res_counto == 0)
		{return false;}
		/*
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
		$i = $layero->index;
		$selecao = "";
		if (($selecao != "ok") && ($layero->data != ""))
		{
			$sopen = $layero->open();
			if($sopen == MS_FAILURE){return "erro";}
			$res_count = $layero->getNumresults();
			for ($i = 0; $i < $res_count; ++$i)
			{
				if($this->v == 6)
				{$sh = $layero->getShape($layero->getResult($i));}
				else{
					$result = $layero->getResult($i);
					$s  = $result->shapeindex;
					$sh = $layero->getfeature($s,-1);				
				}
				$tiposh = $sh->type;
				if ($tiposh == 2)
				{$ident = @$this->layer->querybyshape($sh);}
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
				if($this->v == 6)
				{$s = @$layero->getShape($layero->getResult($k));}
				else
				{$s = @$layero->getfeature($k,-1);}
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

Seleção simples por atributo. Não permite composição de atributos, porém, se valor for igual a vazio "",
a string existente em "operador" será incluida como está no filtro. Para que isso funcione, a string
deve estar no padrão utilizado pelo mapserver.

parameters:

$tipo - Tipo de operação adiciona|retira|inverte|limpa|novo

$item - Item que será consultado.

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
	
	Seleção por atributo. Permite composição de atributos.
	
	parameters:
	
	$filtro - Expressão de seleção
	
	$tipo - Tipo de operação adiciona|retira|inverte|limpa|novo
	*/	
	function selecaoAtributos2($filtro,$tipo)
	{
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
		
		$filtro = str_replace("|","'",$filtro);
		if ($this->layer->connectiontype == MS_POSTGIS)
		{
			$filtro = str_replace("'[","",$filtro);
			$filtro = str_replace("[","",$filtro);
			$filtro = str_replace("]'","",$filtro);
			$filtro = str_replace("]","",$filtro);
			$filtro = str_replace("("," ",$filtro);
			$filtro = str_replace(")"," ",$filtro);
		}
		$this->layer->querybyattributes($items[0],$filtro,1);
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
function: selecaoPT

Seleciona por ponto.

parameters:

$xy - X e Y separados por vírgula.

$tipo - Tipo de operação adiciona|retira|inverte|limpa|novo
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
			error_reporting(E_ALL);
			$projInObj = ms_newprojectionobj("proj=latlong");
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

Limpa a seleção do tema.
*/
	function selecaoLimpa()
	{
		//apaga o arquivo do i3geo com os ids selecionados
		if(file_exists($this->qyfileTema))
		{unlink($this->qyfileTema);}
		if ($this->nome != "") //limpa de um tema
		{
			if(!$this->layer){return "erro";}
			if (file_exists($this->qyfile))
			{
				$this->mapa->loadquery($this->qyfile);
				$indxlayer = $this->layer->index;
				$this->mapa->freequery($indxlayer);
				$this->mapa->savequery($this->qyfile);
			}
		}
		else //limpa de todos os temas
		{
			if (file_exists($this->qyfile))
			{unlink ($this->qyfile);}
		}
		return("ok");
	}

/*
function: selecaoInverte

Inverte seleção do tema.
*/
	function selecaoInverte()
	{
		if(!$this->layer){return "erro";}
		$items = pegaItens($this->layer);
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
		
		$this->layer->queryByrect($this->mapa->extent);
		$res_count = $this->layer->getNumresults();
		$shp_todos = array();
		for ($i = 0; $i < $res_count;++$i)
		{
			$rc = $this->layer->getResult($i);
			$shp_todos[] = $rc->shapeindex;
		}
		$shp = array_diff($shp_todos,$shp_atual);
		$this->mapa->freequery($indxlayer);
		foreach ($shp as $indx)
		{$this->mapa->querybyindex($indxlayer,-1,$indx,MS_TRUE);}
		$this->mapa->savequery($this->qyfile);
		$this->serializeQ($this->qyfileTema,$shp);
		return("ok");
	}
/*
function: selecaoAdiciona

Adiciona elementos na seleção do tema.

parameters:

$shpi - Indices dos registros novos.

$shp_atual - Indices dos elementos já selecionados.
*/
	function selecaoAdiciona($shpi,$shp_atual)
	{
		error_reporting(E_ALL);
		if(!$this->layer){return "erro";}
		$indxlayer = $this->layer->index;
		$shp = array_merge($shpi,$shp_atual);
		$shp = array_unique($shp);
		$this->mapa->freequery($indxlayer);
		foreach ($shp as $indx)
		{@$this->mapa->querybyindex($indxlayer,-1,$indx,MS_TRUE);}
		//echo $this->layer->getNumresults();
		$this->mapa->savequery($this->qyfile);
		$this->serializeQ($this->qyfileTema,$shp);
		return("ok");
	}
/*
function: selecaoRetira

Retira elementos na seleção do tema.

parameters:

$shpi - Indices dos registros que serão retirados.

$shp_atual - Indices dos elementos já selecionados.
*/
	function selecaoRetira($shpi,$shp_atual)
	{
		if(!$this->layer){return "erro";}
		$indxlayer = $this->layer->index;
		$this->mapa->freequery($indxlayer);
		$shp = array_diff($shp_atual,$shpi);
		$shp = array_unique($shp);
		$this->mapa->freequery($indxlayer);
		foreach ($shp as $indx)
		{$this->mapa->querybyindex($indxlayer,-1,$indx,MS_TRUE);}
		$this->mapa->savequery($this->qyfile);
		$this->serializeQ($this->qyfileTema,$shp);
		return("ok");
	}
/*
function: incluiSel

Inclui uma lista de ids na seleção do tema.

Salva o arquivo .qy adicionando os novos registros

parameters:

$ids - Ids separados por vírgula correspondendo aos registros.
*/
	function incluiSel($ids)
	{
		if(!$this->layer){return "erro";}
		if (file_exists($this->qyfile))
		{$this->mapa->loadquery($this->qyfile);}
		$ids = explode(",",$ids);
		$indxlayer = $this->layer->index;
		$ids = array_unique($ids);
		foreach ($ids as $i)
		{$this->mapa->queryByIndex($indxlayer, -1, $i);}
		$this->mapa->savequery($this->qyfile);
		$this->serializeQ($this->qyfileTema,$ids);
		return("ok");
	}
/*
function: selecao2tema

Exporta elementos selecionados de um tema em shape file e adiciona no mapa atual.

parameters:
$locaplic - localização do I3geo

$dir_tmp - localização do diretório temporário
*/
	function selecao2tema($locaplic,$dir_tmp)
	{
		if(!$this->layer){return "erro";}
		$this->layer->setfilter("");
		$nomeshp = criaSHP($this->nome,$this->arquivo,$locaplic,$dir_tmp);
		$novolayer = criaLayer($this->mapa,$this->layer->type,MS_DEFAULT,"Seleção de ".(pegaNome($this->layer))." (".$this->nome.")",$metaClasse="SIM");
		$novolayer->set("data",$nomeshp.".shp");
		$novolayer->set("name",basename($nomeshp));
		$down = "nao";
		$down = $this->layer->getmetadata("download");
		if ($down == ""){$down = "nao";}
		$novolayer->setmetadata("DOWNLOAD",$down);
		$tipo = $this->layer->type;
		if ($this->layer->getmetadata("TABELA") != '')
		{$novolayer->setmetadata("TABELA","NAO");}
		$novolayer->setmetadata("TEMALOCAL","SIM");
		$novolayer->setfilter("");
		return("ok");
	}
/*
function: selecaoEXT

Seleciona por extensão geográfica.

parameters:

$tipo - Tipo de operação adiciona|retira|inverte|limpa|novo
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

Seleciona por retângulo.

parameters:

$tipo - Tipo de operação adiciona|retira|inverte|limpa|novo

$ext - coordenadas separadas por espaços no estilo xmin ymin xmax ymax
*/
	function selecaoBOX($tipo,$ext)
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
		$temp = explode(" ",$ext);
		$rect = ms_newRectObj();
		$rect->set("minx",(min(array($temp[0],$temp[2]))));
		$rect->set("miny",(min(array($temp[1],$temp[3]))));
		$rect->set("maxx",(max(array($temp[0],$temp[2]))));
		$rect->set("maxy",(max(array($temp[1],$temp[3]))));
		$ident = $this->layer->queryByRect($rect);
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
function unserializeQ

Deserializa um arquivo.

Parametros:
$arquivo - arquivo que será processado
*/ 	 	
	function unserializeQ($arq)
	{
		$handle = fopen ($arq, "r");
		$conteudo = fread ($handle, filesize ($arq));
		fclose ($handle);
		return(unserialize($conteudo));
	}
/*
function serializeQ

Serializa um arquivo.

Parametros:
$arquivo - arquivo que será processado

$geos - array com os dados
*/ 	 	
	function serializeQ($arq,$geos)
	{
		if (file_exists($arq))
		{unlink($arq);}
		$fp = fopen($arq,"w");
		$r = serialize($geos);
		fwrite($fp,$r);
		fclose($fp);
	}	
}
?>