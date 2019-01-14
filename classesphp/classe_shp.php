<?php
/*
Title: classe_shp.php

Manipula&ccedil;&atilde;o de shapefile.

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
	Variavel: $dbaseExiste

	Indica se a biblioteca dbase est&aacute; carregada
	*/
	protected $dbaseExiste;
	/*
	Variavel: $v

	Vers&atilde;o atual do Mapserver (primeiro d&iacute;gito)
	*/
	public $v;

/*
function: __construct

Cria um objeto map e seta a variavel tema

parameters:

$map_file - Endere&ccedil;o do mapfile no servidor.

$tema - nome do tema

$ext - extensao geogr&aacute;fica que ser&aacute; aplicada ao mapa
*/
	function __construct($map_file="",$tema="",$locaplic="",$ext=""){
		if (!function_exists('ms_newMapObj')){return false;}
		if($locaplic == ""){
			include (dirname(__FILE__)."/../ms_configura.php");
		}
		if(!function_exists("corRGB")){
			include_once(dirname(__FILE__)."/funcoes_gerais.php");
		}
		include(dirname(__FILE__)."/../ms_configura.php");
  		$this->postgis_mapa = $postgis_mapa;

		$this->v = versao();
		$this->v = $this->v["principal"];
		$this->dbaseExiste = false;
		if(function_exists("dbase_create"))
		{$this->dbaseExiste = true;}
		$this->locaplic = $locaplic;

		if($map_file != ""){
			$this->mapa = ms_newMapObj($map_file);
			substituiConObj($this->mapa,$postgis_mapa);

			$this->arquivo = str_replace(".map","",$map_file).".map";
			$this->tema = $tema;
			if($tema != "" && @$this->mapa->getlayerbyname($tema)){
				$this->layer = $this->mapa->getlayerbyname($tema);
			}
			$this->nome = $tema;
			if($ext && $ext != ""){
				$e = explode(" ",$ext);
				$extatual = $this->mapa->extent;
				$extatual->setextent((min($e[0],$e[2])),(min($e[1],$e[3])),(max($e[0],$e[2])),(max($e[1],$e[3])));
			}
		}
		else{
			$this->mapa = "";
			$this->arquivo = $dir_tmp."/".nomeRandomico();
		}
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
function: criaSHPvazio

Cria um shape file do tipo pontual vazio no diret&oacute;rio local

Parameter:

$tituloTema - (opcional) titulo do novo tema

$nomeshp - (opcional) nome do arquivo que sera criado

$def - (opcional) array com as definicoes das colunas que serao criadas no DBF

$tipol - (opcional) tipo de shape conforme as constantes definidas no Mapserver MS_SHP_

return:

Nome do tema criado.
*/
	function criaSHPvazio($tituloTema="",$nomeshp="",$def="",$tipol=""){
		$novonomelayer = nomeRandomico();
		if($nomeshp == ""){
			$diretorio = dirname($this->arquivo);
			$nomeshp = $diretorio."/".$novonomelayer;
		}
		if($def == ""){
			$def[] = array("ID","C","50");
		}
		if($tipol == ""){
			$tipol = MS_SHP_POINT;
		}
		if($this->dbaseExiste == false){
			include_once (dirname(__FILE__)."/../pacotes/phpxbase/api_conversion.php");
			$db = xbase_create($nomeshp.".dbf", $def);
			xbase_close($db);
		}
		else{
			$db = dbase_create($nomeshp.".dbf", $def);
			dbase_close($db);
		}
		$novoshpf = ms_newShapefileObj($nomeshp, MS_SHP_POINT);
		$novoshpf = ms_newShapefileObj($nomeshp.".shp", -2);

		if($this->mapa != ""){
			if($tituloTema == "")
			{$tituloTema = $novonomelayer." pontos";}
			$l = criaLayer($this->mapa,MS_LAYER_POINT,MS_DEFAULT,"Ins","SIM");
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
		else{
			return ($nomeshp);
		}
	}
/*
function: insereSHP

Insere um ponto em um shape file no diret&oacute;rio local

parameters:
$xy - X e y do novo ponto, separados por espa&ccedil;os. Pode ser mais de um ponto.

$projecao - codigo epsg da proje&ccedil;&atilde;o das coordenadas
*/
	function insereSHP($xy,$projecao,$item="",$valor="")
	{
		if(!$this->layer){return "erro";}
		if($this->dbaseExiste == false){
			include_once dirname(__FILE__)."/../pacotes/phpxbase/api_conversion.php";
		}

		$xy = explode(" ",$xy);
		$data = $this->layer->data;
		$data = explode(".shp",$data);
		$data = $data[0];

		$items = pegaItens($this->layer);
		$dbname = $data.".dbf";

		if($this->dbaseExiste == false){
			$db=xbase_open($dbname,2);
		}
		else{
			$db=dbase_open($dbname,2);
		}
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
			if($this->dbaseExiste == false)
			xbase_add_record($db,$reg);
			else
			dbase_add_record($db,$reg);
		}
		if($this->dbaseExiste == false)
		xbase_close($db);
		else
		dbase_close($db);
		if (@$shapefileObj = ms_newShapefileObj($data,-2))
		{
			for($i=0;$i<(count($xy));$i=$i+2)
			{
				$poPoint = ms_newpointobj();
				$poPoint->setXY($xy[$i],$xy[$i+1]);
				if($projecao != "")
				{
					//$projOutObj = ms_newprojectionobj("proj=longlat,ellps=WGS84,datum=WGS84,no_defs");
					$pmap = pegaProjecaoDefault("proj4");
					$projOutObj = ms_newprojectionobj($pmap);
					$projInObj = ms_newprojectionobj("init=epsg:".$projecao);
					$poPoint->project($projInObj, $projOutObj);
				}
				$shapefileObj->addpoint($poPoint);
			}
			return("ok");
		}
		else
		{return("erro");}
	}
/*
function: insereSHPgrafico

Insere um ponto em um shape file, criado no diret&oacute;rio tempor&aacute;rio, e adiciona ao mapa
atual. O layer adicionado &eacute; representado como um s&iacute;mbolo, constru&iacute;do a partir de uma
imagem tempor&aacute;ria representando o gr&aacute;fico criado.

parameters:

$x - Coordenada x.

$y - Coordenada Y.

$itens - Lista de itens

$imgurl - Endere&ccedil;o da imagem atual

$width - Largura do gr&aacute;fico

$inclinacao - Inclina&ccedil;&atilde;o do gr&aacute;fico

$shadow_height - Tamanho da sombra do gr&aacute;fico

Include:
<classe_atributos.php>, <graficopizza.php>
*/
	function insereSHPgrafico($x,$y,$itens,$width,$inclinacao,$shadow_height,$ext="")
	{
		if(!isset($tipo)){$tipo = "pizza";}
		//nome do novo tema
		$temaedit = nomeRandomico();
		//pega os valores
		include_once($this->locaplic."/classesphp/classe_atributos.php");
		$m = new Atributos($this->arquivo,$this->tema);
		$shape = $m->identificaQBP2($this->nome,$x,$y,$this->arquivo,0,"","shape",false,$ext);
		if ((is_array($shape)) && ($shape[0] == " ")){
			return("erro.Nenhum valor encontrado");
		}
		else{
			$shape = $shape[0];
			$itens = explode("*",$itens);
			foreach ($itens as $i){
				$ii = explode(",",$i);
				$v = $shape->values[$ii[0]];
				if (!is_numeric($v))
				{return("erro. Dados nao numericos.");}
				$valor[] = $v;
				$cor[] = $ii[1].",".$ii[2].",".$ii[3];
			}

			$data = implode("*",$valor);
			$cores = implode("*",$cor);
			if ($tipo == "pizza"){
				//gera a figura
				include_once($this->locaplic."/classesphp/graficopizza.php");
				$res = graficopizza($data,$width,$inclinacao,$shadow_height,$cores,$this->arquivo,$temaedit);
				$img = explode(",",$res);
			}
			//insere simbolo
			$nomes = nomeRandomico();
			$nId = ms_newsymbolobj($this->mapa, $img[0]);
			$oSymbol = $this->mapa->getsymbolobjectbyid($nId);
			$oSymbol->set("inmapfile", MS_TRUE);
			$oSymbol->set("type",MS_SYMBOL_PIXMAP);
			$oSymbol->setimagepath($img[0]);
			$oSymbol->set("name",$nomes);
			$pinlayer = criaLayer($this->mapa,MS_LAYER_POINT,MS_DEFAULT,"Gr&aacute;fico (".$temaedit.")","SIM");

			$c = $pinlayer->getclass(0);
			$e = $c->getstyle(0);
			$pinlayer->set("name",$temaedit);
			$c->set("name","");
			if(!isset($tamanho)){
			    $tamanho = 50;
			}
			$e->set("size",$tamanho);
			$e->set("symbolname",$nomes);

			foreach ($itens as $i){
			    $ii = explode(",",$i);
			    $classe = ms_newClassObj($pinlayer);
			    $novoestilo = ms_newStyleObj($classe);
			    $novoestilo->set("symbolname", "ponto");
			    $novoestilo->set("size", "20");
			    $cor = $novoestilo->color;
			    $cor->setRGB($ii[1], $ii[2], $ii[3]);
			    $classe->set("name",$ii[0]);
			}
			$shp = ms_newshapeobj(MS_SHAPE_POINT);
			$lin = ms_newlineobj();
			$lin->addxy($x,$y);
			$shp->add($lin);
			$pinlayer->addfeature($shp);
			$this->salva();
			return(true);
		}
	}
/*
function: listaPontosShape

Lista as coordenadas dos pontos de um layer

Funciona apenas com elementos do tipo ponto

return:

array - xy
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
function: listaPontosShapeSel

Lista as coordenadas dos elementos selecionados de um layer

Funciona com elementos pontuais ou lineares

return:

array - xy
*/
	function listaPontosShapeSel()
	{
		//error_reporting(0);
		if(!$this->layer){return "erro";}
		$this->layer->set("template","none.htm");
		//$this->layer->setfilter("");
		$shapes = retornaShapesSelecionados($this->layer,$this->arquivo,$this->mapa);
		$xy = array();
		foreach($shapes as $shape)
		{
			$nlinhas = $shape->numlines;
			for($j = 0;$j < $nlinhas; ++$j){
				$lin = $shape->line($j);
				$npontos = $lin->numpoints;
				for($k = 0;$k < $npontos; ++$k){
					$pt = $lin->point($k);
					$xy[] = array("x"=>$pt->x,"y"=>$pt->y);
				}
			}
		}
		$fechou = $this->layer->close();
		return $xy;
	}
/*
function: ultimoXY

Obt&eacute;m as coordenadas xy do &uacute;ltimo ponto existente no layer. O &uacute;ltimo ponto &eacute; considerado entre aqueles que est&atilde;o vis&iacute;veis no mapa atual

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
		if($this->v >= 6)
		{$shape = $this->layer->getShape($this->layer->getshape(new resultObj($res_count - 1)));}
		else{
			$result = $this->layer->getResult($res_count - 1);
			$shp_index  = $result->shapeindex;
			$shape = $this->layer->getfeature($shp_index,-1);
		}
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

$locaplic - Localiza&ccedil;&atilde;o do I3geo

$para - linha|poligono
*/
	function shpPT2shp($locaplic,$para)
	{
		if(!$this->layer){return "erro";}
		$this->layer->set("template","none.htm");
		$diretorio = dirname($this->arquivo);
		$tipol = MS_SHP_ARC;
		//$tipos = MS_SHAPE_LINE;
		if ($para == "poligono")
		{
			$tipol = MS_SHP_POLYGON;
			//$tipos = MS_SHAPE_POLYGON;
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
		if($this->dbaseExiste == false)
		{
			include_once dirname(__FILE__)."/../pacotes/phpxbase/api_conversion.php";
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
		if($this->dbaseExiste == false)
		{
			xbase_add_record($db,$reg);
			xbase_close($db);
		}
		else
		{
			dbase_add_record($db,$reg);
			dbase_close($db);
		}
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
			$layer->set("opacity",50);
			$layer->setmetadata("tema",$novonomelayer." (poligonal)");
		}
		return("ok");
	}
}
?>