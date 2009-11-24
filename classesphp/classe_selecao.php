<?php
/*
Title: classe_selecao.php

Seleção de elementos de um tema.

Adiciona, remove, etc.

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
	protected $mapa;
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
Function: __construct

Cria um objeto Selecao 

parameters:

$map_file - Endereço do mapfile no servidor.

$tema - nome do tema
*/

	function __construct($map_file,$tema="")
	{
  		//error_reporting(E_ALL);
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
function: selecaoPorPoligono

Seleciona os elementos de um tema baseado em um conjunto de pontos que formarão um polígono.

parameters:

$tipo - Tipo de operação adiciona|retira|inverte|limpa

$xs - lista de coordenadas x separadas por virgula

$ys - lista de coordenadas y separadas por virgula
*/
	function selecaoPorPoligono($tipo,$xs,$ys)
	{
		if(!$this->layer){return "erro";}
		$this->layer->set("tolerance",0);
		if ($tipo == "limpa")
		{return($this->selecaoLimpa());}
		if ($tipo == "inverte")
		{return($this->selecaoInverte());}
		$tipoLayer = $this->layer->type;
		$this->layer->set("template","none.htm");
		if (file_exists(($this->arquivo)."qy"))
		{$this->mapa->loadquery(($this->arquivo)."qy");}
		$indxlayer = $this->layer->index;
		$res_count = $this->layer->getNumresults();
		$shp_atual = array();
		for ($i = 0; $i < $res_count;++$i)
		{
			$rc = $this->layer->getResult($i);
			$shp_atual[] = $rc->shapeindex;
		}
		$this->mapa->freequery($indxlayer);
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

$tipo - Tipo de operação adiciona|retira|inverte|limpa
*/
	function selecaoTema($temao,$tipo)
	{
		if(!$this->layer){return "erro";}
		$this->layer->set("tolerance",0);
		if ($tipo == "limpa")
		{return($this->selecaoLimpa());}
		if ($tipo == "inverte")
		{return($this->selecaoInverte());}
		$layero = $this->mapa->getlayerbyname($temao);
		if ($layero->type == MS_LAYER_LINE)
		{return("erro. O tema de sobreposicao nao pode ser do tipo linear.");}
		$tipoLayer = $this->layer->type;
		$tipoLayero = $layero->type;
		$this->layer->set("template","none.htm");
		$layero->set("template","none.htm");
		if (file_exists(($this->arquivo)."qy"))
		{$this->mapa->loadquery(($this->arquivo)."qy");}
		$indxlayer = $this->layer->index;
		$res_count = $this->layer->getNumresults();
		$res_counto = $layero->getNumresults();
		if ($res_counto == 0)
		{return("erro. O tema de sobreposicao nao possui selecao.");}
		$shp_atual = array();
		for ($i = 0; $i < $res_count;++$i)
		{
			$rc = $this->layer->getResult($i);
			$shp_atual[] = $rc->shapeindex;
		}
		$this->mapa->freequery($indxlayer);
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
				$result = $layero->getResult($i);
				$s  = $result->shapeindex;
				$sh = $layero->getShape(-1,$s);
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
				if (@$layero->getshape(-1,$k))
				{
					$s = $layero->getshape(-1,$k);
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

Seleciona por atributo.

parameters:
$tipo - Tipo de operação adiciona|retira|inverte|limpa

$item - Item que será consultado.

$operador - Operador.

$valor - Valor.
*/
	function selecaoAtributos($tipo,$item,$operador,$valor)
	{
		if ($tipo == "limpa")
		{return($this->selecaoLimpa());}
		if ($tipo == "inverte")
		{return($this->selecaoInverte());}
		if(!$this->layer){return "erro";}
		$operador = explode(",",$operador);
		$operador = $operador[1];
		$this->layer->set("template","none.htm");
		$indxlayer = $this->layer->index;
		if (file_exists(($this->arquivo)."qy"))
		{$this->mapa->loadquery(($this->arquivo)."qy");}
		$res_count = $this->layer->getNumresults();
		$shp_atual = array();
		for ($i = 0; $i < $res_count;++$i)
		{
			$rc = $this->layer->getResult($i);
			$shp_atual[] = $rc->shapeindex;
		}
		$this->mapa->freequery($indxlayer);
		$shpi = array();
		if($this->layer->connectiontype == MS_POSTGIS)
		{$this->layer->querybyattributes($item,$item." ".$operador." '".$valor."' ",1);}
		else
		{		
			if(!is_numeric($valor))
			{$this->layer->querybyattributes($item,'("['.$item.']"'.$operador.'"'.$valor.'")',1);}
			else
			{$this->layer->querybyattributes($item,'(['.$item.']'.$operador.' '.$valor.' )',1);}
		}
		$res_count = $this->layer->getNumresults();
		//echo '("['.$item.']"'.$operador.'"'.$valor.'")';
		//echo $res_count;
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

$tipo - Tipo de operação adiciona|retira|inverte|limpa
*/
	function selecaoPT($xy,$tipo,$tolerancia)
	{
		if ($tipo == "limpa")
		{return ($this->selecaoLimpa());}
		if ($tipo == "inverte")
		{return ($this->selecaoInverte());}
		if(!$this->layer){return "erro";}
		$this->layer->set("template","none.htm");
		if (file_exists(($this->arquivo)."qy"))
		{$this->mapa->loadquery(($this->arquivo)."qy");}
		$indxlayer = $this->layer->index;
		$res_count = $this->layer->getNumresults();
		$shp_atual = array();
		for ($i = 0; $i < $res_count;++$i)
		{
			$rc = $this->layer->getResult($i);
			$shp_atual[] = $rc->shapeindex;
		}
		$this->mapa->freequery($indxlayer);
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
			$rect = $pt->bounds;
			$projInObj = ms_newprojectionobj("proj=latlong");
			$projOutObj = ms_newprojectionobj("proj=poly,ellps=GRS67,lat_0=0,lon_0=".$rect->minx.",x_0=5000000,y_0=10000000");
			$poPoint = ms_newpointobj();
			$poPoint->setXY($rect->minx, $rect->miny);
			$dd1 = ms_newpointobj();
			$dd1->setXY($rect->minx, $rect->miny);
			$poPoint->project($projInObj, $projOutObj);
			$dd2 = ms_newpointobj();
			$dd2->setXY(($poPoint->x + $tolerancia), $poPoint->y);
			$dd2->project($projOutObj,$projInObj);
			$d = $dd1->distanceToPoint($dd2);
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
		if ($this->nome != "") //limpa de um tema
		{
			if(!$this->layer){return "erro";}
			if (file_exists(($this->arquivo)."qy"))
			{$this->mapa->loadquery(($this->arquivo)."qy");}
			$indxlayer = $this->layer->index;
			$this->mapa->freequery($indxlayer);
			$this->mapa->savequery(($this->arquivo)."qy");
		}
		else //limpa de todos os temas
		{
			if (file_exists(($this->arquivo)."qy"))
			{unlink (($this->arquivo)."qy");}
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
		$this->layer->set("template","none.htm");
		if (file_exists(($this->arquivo)."qy"))
		{$this->mapa->loadquery(($this->arquivo)."qy");}
		$indxlayer = $this->layer->index;
		$items = pegaItens($this->layer);
		$res_count = $this->layer->getNumresults();
		$shp_atual = array();
		for ($i = 0; $i < $res_count;++$i)
		{
			$rc = $this->layer->getResult($i);
			$shp_atual[] = $rc->shapeindex;
		}
		$this->mapa->freequery($indxlayer);
		//$qstring = "/.*/";
		//if($this->layer->connectiontype == MS_POSTGIS)
		//{$qstring = $items[0].' ~* \'^.\'  ';}
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
		$this->mapa->savequery(($this->arquivo)."qy");
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
		if(!$this->layer){return "erro";}
		$this->layer->set("template","none.htm");
		$indxlayer = $this->layer->index;
		$shp = array_merge($shpi,$shp_atual);
		$shp = array_unique($shp);
		$this->mapa->freequery($indxlayer);
		foreach ($shp as $indx)
		{@$this->mapa->querybyindex($indxlayer,-1,$indx,MS_TRUE);}
		$this->mapa->savequery(($this->arquivo)."qy");
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
		$this->layer->set("template","none.htm");
		$indxlayer = $this->layer->index;
		$this->mapa->freequery($indxlayer);
		$shp = array_diff($shp_atual,$shpi);
		$shp = array_unique($shp);
		$this->mapa->freequery($indxlayer);
		foreach ($shp as $indx)
		{$this->mapa->querybyindex($indxlayer,-1,$indx,MS_TRUE);}
		$this->mapa->savequery(($this->arquivo)."qy");
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
		$this->layer->set("template","none.htm");
		if (file_exists(($this->arquivo)."qy"))
		{$this->mapa->loadquery(($this->arquivo)."qy");}
		$ids = explode(",",$ids);
		$indxlayer = $this->layer->index;
		$ids = array_unique($ids);
		foreach ($ids as $i)
		{$this->mapa->queryByIndex($indxlayer, -1, $i);}
		$this->mapa->savequery(($this->arquivo)."qy");
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
		$this->layer->set("template","none.htm");
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

$tipo - Tipo de operação adiciona|retira|inverte|limpa
*/
	function selecaoEXT($tipo)
	{
		if(!$this->layer){return "erro";}
		$this->layer->set("tolerance",0);
		if ($tipo == "limpa")
		{return ($this->selecaoLimpa());}
		if ($tipo == "inverte")
		{return ($this->selecaoInverte());}
		$this->layer->set("template","none.htm");
		if (file_exists(($this->arquivo)."qy"))
		{$this->mapa->loadquery(($this->arquivo)."qy");}
		$indxlayer = $this->layer->index;
		$res_count = $this->layer->getNumresults();
		$shp_atual = array();
		for ($i = 0; $i < $res_count;++$i)
		{
			$rc = $this->layer->getResult($i);
			$shp_atual[] = $rc->shapeindex;
		}
		$this->mapa->freequery($indxlayer);
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

$tipo - Tipo de operação adiciona|retira|inverte|limpa

$ext - coordenadas separadas por espaços no estilo xmin ymin xmax ymax
*/
	function selecaoBOX($tipo,$ext)
	{
		if(!$this->layer){return "erro";}
		$this->layer->set("tolerance",0);
		if ($tipo == "limpa")
		{return ($this->selecaoLimpa());}
		if ($tipo == "inverte")
		{return ($this->selecaoInverte());}
		$this->layer->set("template","none.htm");
		if (file_exists(($this->arquivo)."qy"))
		{$this->mapa->loadquery(($this->arquivo)."qy");}
		$indxlayer = $this->layer->index;
		$res_count = $this->layer->getNumresults();
		$shp_atual = array();
		for ($i = 0; $i < $res_count;++$i)
		{
			$rc = $this->layer->getResult($i);
			$shp_atual[] = $rc->shapeindex;
		}
		$this->mapa->freequery($indxlayer);
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

}
?>