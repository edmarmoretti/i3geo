<?php
/*
Title: classe_shp.php

Manipulação de shapefile.

Licenca:

GPL2


I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

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

i3geo/classesphp/classe_shp.php
*/
/*
Classe: SHP
*/
class SHP
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
function: __construct

Cria um objeto map e seta a variavel tema 

parameters:

$map_file - Endereço do mapfile no servidor.

$tema - nome do tema

$ext - extensao geográfica que será aplicada ao mapa
*/
	function __construct($map_file,$tema="",$locaplic="",$ext="")
	{
  		//error_reporting(E_ALL);
  		$this->locaplic = $locaplic;
  		$this->mapa = ms_newMapObj($map_file);
  		$this->arquivo = $map_file;
  		$this->tema = $tema;
  		if($tema != "" && @$this->mapa->getlayerbyname($tema))
  		{
  			$this->layer = $this->mapa->getlayerbyname($tema);
  		}
  		$this->nome = $tema;
		if($ext && $ext != ""){
			$e = explode(" ",$ext);
			$extatual = $this->mapa->extent;
			$extatual->setextent((min($e[0],$e[2])),(min($e[1],$e[3])),(max($e[0],$e[2])),(max($e[1],$e[3])));
		}		
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
function: criaSHPvazio

Cria um shape file do tipo pontual vazio no diretório local

Parameter:

$tituloTema - título do novo tema

return:
Nome do tema criado.
*/
	function criaSHPvazio($tituloTema="")
	{
		$diretorio = dirname($this->arquivo);
		$novonomelayer = nomeRandomico();
		$nomeshp = $diretorio."/".$novonomelayer;
		$def[] = array("ID","C","50");
		if(!function_exists("dbase_create")){
			if(file_exists($this->locaplic."/pacotes/phpxbase/api_conversion.php"))
			{include_once($this->locaplic."/pacotes/phpxbase/api_conversion.php");}
			else	
			{include_once "../pacotes/phpxbase/api_conversion.php";}
			$db = xbase_create($nomeshp.".dbf", $def);
			xbase_close($db);
		}
		else
		{
			$db = dbase_create($nomeshp.".dbf", $def);
			dbase_close($db);
		}
		$tipol = MS_SHP_POINT;
		$l = criaLayer($this->mapa,MS_LAYER_POINT,MS_DEFAULT,"Ins","SIM");
		$novoshpf = ms_newShapefileObj($nomeshp, $tipol);
		$novoshpf->free();
		$novoshpf = ms_newShapefileObj($nomeshp.".shp", -2);
		$novoshpf->free();
		if($tituloTema == "")
		{$tituloTema = $novonomelayer." pontos";}
		$l->setmetadata("tema",$tituloTema);
		$l->setmetadata("TEMALOCAL","SIM");
		$l->setmetadata("DOWNLOAD","sim");
		$l->set("data",$nomeshp);
		$l->set("name",$novonomelayer);
		$classe = $l->getclass(0);
		$estilo = $classe->getstyle(0);
		$estilo->set("symbolname","ponto");
		$estilo->set("size",6);
		$cor = $estilo->color;
		$cor->setrgb(255,210,0);
		$cor = $estilo->outlinecolor;
		$cor->setrgb(255,0,0);
		return($novonomelayer);
	}
/*
function: insereSHP

Insere um ponto em um shape file no diretório local

parameters:
$xy - X e y do novo ponto, separados por espaços. Pode ser mais de um ponto.

$projecao - código epsg da projeção das coordenadas
*/
	function insereSHP($xy,$projecao,$item="",$valor="")
	{
		if(!$this->layer){return "erro";}
		if(file_exists($this->locaplic."/pacotes/phpxbase/api_conversion.php"))
		include_once($this->locaplic."/pacotes/phpxbase/api_conversion.php");
		else	
		include_once "../pacotes/phpxbase/api_conversion.php";
		$xy = explode(" ",$xy);
		$data = $this->layer->data;
		$data = explode(".shp",$data);
		$data = $data[0];
		$items = pegaItens($this->layer);
		$dbname = $data.".dbf";
		$db=xbase_open($dbname,2);
		for($i=0;$i<(count($xy) / 2);++$i)
		{
			$reg = array();
			foreach ($items as $ni)
			{
				//verifica se deve acrescentar o valor para um item, caso tenha sido definido
				if($ni == $item)
				$reg[] = $valor;
				else
				$reg[] = "-";
			}
			xbase_add_record($db,$reg);
		}
		xbase_close($db);
		if (@$shapefileObj = ms_newShapefileObj($data,-2))
		{
			for($i=0;$i<(count($xy));$i=$i+2)
			{
				$poPoint = ms_newpointobj();
				$poPoint->setXY($xy[$i],$xy[$i+1]);
				if($projecao != "")
				{
					$projOutObj = ms_newprojectionobj("proj=latlong");
					$projInObj = ms_newprojectionobj("init=epsg:".$projecao);
					$poPoint->project($projInObj, $projOutObj);
				}
				$shapefileObj->addpoint($poPoint);
			}
			$shapefileObj->free();
			return("ok");
		}
		else
		{return("erro");}
	}
/*
function: insereSHPgrafico

Insere um ponto em um shape file, criado no diretório temporário, e adiciona ao mapa
atual. O layer adicionado é representado como um símbolo, construído a partir de uma
imagem temporária representando o gráfico criado.

parameters:

$x - Coordenada x.

$y - Coordenada Y.

$itens - Lista de itens

$imgurl - Endereço da imagem atual

$width - Largura do gráfico

$inclinacao - Inclinação do gráfico

$shadow_height - Tamanho da sombra do gráfico

Include:
<classe_atributos.php>, <graficopizza.php>
*/
	function insereSHPgrafico($x,$y,$itens,$width,$inclinacao,$shadow_height)
	{
		if(!isset($tipo)){$tipo = "pizza";}
		//nome do novo tema
		$temaedit = nomeRandomico();
		//pega os valores
		include_once($this->locaplic."/classesphp/classe_atributos.php");
		$m = new Atributos($this->arquivo,$this->tema);
		$shape = $m->identificaQBP($this->nome,$x,$y,$this->arquivo,0,"","shape");
		if ((is_array($shape)) && ($shape[0] == " "))
		{
			return("erro.Nenhum valor encontrado");
		}
		else
		{
			$itens = explode("*",$itens);
			foreach ($itens as $i)
			{
				$ii = explode(",",$i);
				$v = $shape->values[$ii[0]];
				if (!is_numeric($v))
				{return("erro. Dados nao numericos.");}
				$valor[] = $v;
				$cor[] = $ii[1].",".$ii[2].",".$ii[3];
			}
			$data = implode("*",$valor);
			$cores = implode("*",$cor);
			if ($tipo == "pizza")
			{
				//gera a figura
				include_once($this->locaplic."/classesphp/graficopizza.php");
				$res = graficopizza($data,$width,$inclinacao,$shadow_height,$cores,$this->arquivo,$temaedit);
				$img = explode(",",$res);
			}
			//insere simbolo
			$nomes = nomeRandomico();
			$nId = ms_newsymbolobj($this->mapa, "foto");
			$oSymbol = $this->mapa->getsymbolobjectbyid($nId);
			$oSymbol->set("inmapfile", MS_TRUE);
			$oSymbol->set("type",MS_SYMBOL_PIXMAP);
			$oSymbol->setimagepath($img[0]);
			$oSymbol->set("name",$nomes);
			$pinlayer = criaLayer($this->mapa,MS_LAYER_POINT,MS_DEFAULT,"Gráfico (".$temaedit.")","SIM");
			$c = $pinlayer->getclass(0);
			$e = $c->getstyle(0);
			$pinlayer->set("name",$temaedit);
			$c->set("name","");
			if(!isset($tamanho)){$tamanho = 50;}
			$e->set("size",$tamanho);
			$e->set("symbolname",$nomes);
			$pinlayer->set("opacity",MS_GD_ALPHA);
			$shp = ms_newshapeobj(MS_SHAPE_POINT);
			$lin = ms_newlineobj();
			$lin->addxy($x,$y);
			$shp->add($lin);
			$pinlayer->addfeature($shp);
			$this->salva();
			return("ok");
		}
	}
/*
function: listaPontosShape

Lista as coordenadas dos pontos de um shapefile

return:
string - xy
*/
	function listaPontosShape()
	{
		if(!$this->layer){return "erro";}		
		$sopen = $this->layer->open();
		if($sopen == MS_FAILURE){return "erro";}
		$prjMapa = $this->mapa->getProjection();
		$prjTema = $this->layer->getProjection();
		$ret = $this->mapa->extent;
		if (($prjTema != "") && ($prjMapa != $prjTema))
		{
			$projOutObj = ms_newprojectionobj($prjTema);
			$projInObj = ms_newprojectionobj($prjMapa);
			$ret->project($projInObj, $projOutObj);
		}
		$this->layer->whichShapes($ret);
		$xy = array();
		while ($shape = $this->layer->nextShape())
		{
			$lin = $shape->line(0);
			$pt = $lin->point(0);
			$xy[] = array("x"=>$pt->x,"y"=>$pt->y);
		}
		$this->layer->close();
		return $xy;
	}
/*
function: ultimoXY

Obtém as coordenadas xy do último ponto existente no layer. O último ponto é considerado entre aqueles que estão visíveis no mapa atual

return:
array("layerprj"=>$xylayer,"mapprj"=>$xymapa)
*/
	function ultimoXY()
	{
		if(!$this->layer){return "erro";}
		$this->layer->queryByrect($this->mapa->extent);
		$res_count = $this->layer->getNumresults();
		$sopen = $this->layer->open();
		if($sopen == MS_FAILURE){return "erro";}
		$xy = array();

		$result = $this->layer->getResult($res_count - 1);
		$shp_index  = $result->shapeindex;
		$shape = $this->layer->getfeature($shp_index,-1);
		$lin = $shape->line(0);
		$pt = $lin->point(0);
		$this->layer->close();
		$xylayer = array("x"=>$pt->x,"y"=>$pt->y);
		$prjMapa = $this->mapa->getProjection();
		$prjTema = $this->layer->getProjection();
		if (($prjTema != "") && ($prjMapa != $prjTema))
		{
			$projInObj = ms_newprojectionobj($prjTema);
			$projOutObj = ms_newprojectionobj($prjMapa);
			$pt->project($projInObj, $projOutObj);
			$xymapa = array("x"=>$pt->x,"y"=>$pt->y);
		}
		else
		{$xymapa = $xylayer;}	
		return array("layerprj"=>$xylayer,"mapprj"=>$xymapa);
	}

/*
function: shpPT2shp

Cria um tema linear ou poligonal com base em pontos de um tema pontual.

parameters:
$locaplic - Localização do I3geo

$para - linha|poligono
*/
	function shpPT2shp($locaplic,$para)
	{
		if(!$this->layer){return "erro";}
		$this->layer->set("template","none.htm");
		$diretorio = dirname($this->arquivo);
		$tipol = MS_SHP_ARC;
		$tipos = MS_SHAPE_LINE;
		if ($para == "poligono")
		{
	 		$tipol = MS_SHP_POLYGON;
	 		$tipos = MS_SHAPE_POLYGON;
		}
		$novonomelayer = nomeRandomico();
		$nomeshp = $diretorio."/".$novonomelayer;
		$items = pegaItens($this->layer);
		// cria o dbf
		$def = array();
		foreach ($items as $ni)
		{
			$temp = strtoupper($ni);
			$def[] = array($temp,"C","254");
		}
		//para manipular dbf
		if(!function_exists("dbase_create"))
		{
			if(file_exists($this->locaplic."/pacotes/phpxbase/api_conversion.php"))
			{include_once($this->locaplic."/pacotes/phpxbase/api_conversion.php");}
			else	
			{include_once "../pacotes/phpxbase/api_conversion.php";}
			$db = xbase_create($nomeshp.".dbf", $def);
		}
		else
		{$db = dbase_create($nomeshp.".dbf", $def);}
		$dbname = $nomeshp.".dbf";
		$reg = array();
		$novoshpf = ms_newShapefileObj($nomeshp.".shp", $tipol);
		$this->layer->open();
		
		$prjMapa = $this->mapa->getProjection();
		$prjTema = $this->layer->getProjection();
		
		$ret = $this->mapa->extent;
		if (($prjTema != "") && ($prjMapa != $prjTema))
		{
			$projOutObj = ms_newprojectionobj($prjTema);
			$projInObj = ms_newprojectionobj($prjMapa);
			$ret->project($projInObj, $projOutObj);
		}
		$this->layer->whichShapes($ret);
		$linha = ms_newLineObj();
		$pponto = "";
		$pontos = array();
		while ($shape = $this->layer->nextShape())
		{
			$lin = $shape->line(0);
			$pt = $lin->point(0);
			if($pponto == "")
			{$pponto = $pt;}
			if (($prjTema != "") && ($prjMapa != $prjTema))
			{$pt->project($projInObj, $projOutObj);}
			$pontos[] = $pt->x;
			$pontos[] = $pt->y;
		}
		$pontos = implode(" ",$pontos);
		$pontos = xy2wkt($pontos);
		if ($para == "poligono")
		{$shape = ms_shapeObjFromWkt($pontos["poligono"]);}
		else
		{$shape = ms_shapeObjFromWkt($pontos["linha"]);}
		foreach ($items as $ni)
		{$reg[] = "-";}
		$novoshpf->addShape($shape);
		if(!function_exists("dbase_create"))
		{
			xbase_add_record($db,$reg);
			xbase_close($db);
		}
		else
		{
			dbase_add_record($db,$reg);
			dbase_close($db);			
		}
		$novoshpf->free();
		$this->layer->close();
		//cria o novo layer
		$layer = criaLayer($this->mapa,MS_LAYER_LINE,MS_DEFAULT,"",$metaClasse="SIM");
		$layer->set("data",$nomeshp);
		$layer->setmetadata("tema",$novonomelayer." (linear)");
		$layer->setmetadata("download","sim");
		$layer->setmetadata("temalocal","sim");
		$classe = $layer->getclass(0);
		$estilo = $classe->getstyle(0);
		$estilo->set("symbolname","linha");
		if ($para == "poligono")
		{
			$layer->set("type",MS_LAYER_POLYGON);
			$layer->set("opacity","50");
			$layer->setmetadata("tema",$novonomelayer." (poligonal)");
		}
		return("ok");
	}
}
?>