<?php
/*
Title: classe_atributos

Processa a tabela de atributos de um tema.

Lista valores, consulta, etc.

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

i3geo/classesphp/classe_atributos.php
*/
/*
Classe: Atributos

*/
class Atributos
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

Cria um objeto Atributos.

O tipo de interface usada pelo mapa é obtido do metadata "interface". Se for a interface Googlemaps, é feita a alteração temporária da projeção do mapa.

parameters:

$map_file - Endereço do mapfile no servidor.

$tema - nome do tema

$locaplic - (opcional) endereço do i3geo

$ext - (opcional) extensão geográfica que será aplicada ao mapa
*/
	function __construct($map_file="",$tema="",$locaplic="",$ext="")
	{
  		error_reporting(0);
  		if (!function_exists('ms_newMapObj')) {return false;}
  		if(file_exists($locaplic."/funcoes_gerais.php"))
  		include_once($locaplic."/funcoes_gerais.php");
  		else
  		include_once("funcoes_gerais.php");
		$this->v = versao();
		$this->v = $this->v["principal"];
		if($map_file != ""){
			$this->qyfile = str_replace(".map",".qy",$map_file);
			$this->locaplic = $locaplic;
			$this->mapa = ms_newMapObj($map_file);
			$this->arquivo = $map_file;
			if($tema != "" && @$this->mapa->getlayerbyname($tema))
			{
				$this->layer = $this->mapa->getlayerbyname($tema);
				$this->nome = $tema;
			}
			if($ext && $ext != ""){
				$e = explode(" ",$ext);
				$extatual = $this->mapa->extent;
				$extatual->setextent((min($e[0],$e[2])),(min($e[1],$e[3])),(max($e[0],$e[2])),(max($e[1],$e[3])));
			}
			if($this->mapa->getmetadata("interface") == "googlemaps"){
				$this->projO = $this->mapa->getProjection();
				$this->mapa->setProjection("init=epsg:4291,a=6378137,b=6378137");
			}			
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
function: extensaoShape

Pega a extensão geográfica de um objeto shape.

parameters:
Objeto shape

return:
xmin ymin xmax ymax separados por espaço.
*/
	function extensaoShape($shape)
	{
		if(!$this->layer){return "erro";}
		$prjMapa = $this->mapa->getProjection();
		$prjTema = $this->layer->getProjection();
		$ret = $shape->bounds;
		//
		//verifica se o retangulo está ou não em coordenadas geográficas
		//
		if($ret->minx > 180 ||  $ret->minx < -180)
		{
			//reprojeta o retangulo
			if (($prjTema != "") && ($prjMapa != $prjTema))
			{
				$projInObj = ms_newprojectionobj($prjTema);
				$projOutObj = ms_newprojectionobj($prjMapa);
				$ret->project($projInObj, $projOutObj);
			}		
		}
		$ext = $ret->minx." ".$ret->miny." ".$ret->maxx." ".$ret->maxy;
		if (($shape->type == MS_SHP_POINT) || ($shape->type == 0))
		{
			$minx = $ret->minx;
			$minx = $minx - 0.03;
			$maxx = $ret->maxx;
			$maxx = $maxx + 0.03;
			$miny = $ret->miny;
			$miny = $miny - 0.03;
			$maxy = $ret->maxy;
			$maxy = $maxy + 0.03;
			$ext = $minx." ".$miny." ".$maxx." ".$maxy;
		}
		return $ext;
	}
/*
function - extensaoRegistro

Pega a extensão geográfica de um registro na tabela de atributos de um tema.

parameters:
$registro - Índice do registro que será consultado.
*/
	function extensaoRegistro($registro)
	{
		if(!$this->layer){return "erro";}
		$this->layer->set("template","none.htm");
		$this->layer->setfilter("");
		$ext = "";
		//procura o registro e pega a extensão geográfica
		if($this->v == 6)
		{$shape = $this->layer->getShape(new resultObj($registro));}		
		else{
			if (@$this->layer->open() == MS_SUCCESS)
			{
				if (@$this->layer->queryByrect($this->mapa->extent) == MS_SUCCESS)
				{
					$this->layer->open();
					$shape = $this->layer->getfeature($registro,-1);
					$fechou = $this->layer->close();
				}
			}		
		}
		$ext = $this->extensaoShape($shape);
		return($ext);
	}
/*
function: listaItens

Lista os itens de um tema.
*/
	function listaItens()
	{
		//verifica se o tema é um grupo e cria um array com a lista de temas
		$vermultilayer = new vermultilayer();
		$vermultilayer->verifica($this->arquivo,$this->nome);
		if ($vermultilayer->resultado == 1) // o tema e multi layer
		{$l = $vermultilayer->temasvisiveis;}
		else
		{$l[] = $this->nome;}
		//pega os itens de cada layer
		$lista = array();
		foreach ($l as $tema)
		{
			$layer = $this->mapa->getlayerbyname($tema);
			//pega o nome correto do tema
			$nometmp = pegaNome($layer,"UTF-8");
			$nomestemas[] = $nometmp;
			if($layer->data != "" || $layer->connectiontype == 7)
			{
					$items = pegaItens($layer,$this->mapa);
					foreach ($items as $item)
					{
				 		$lista[] = array("item"=>$item,"nome"=>$nometmp,"tema"=>$tema);
					}
			}
		}
		return (array("valores"=>$lista,"temas"=>$l,"nomes"=>$nomestemas));
	}
/*
function: itensTexto

Pega todos os valores dos itens de uma tabela de um tema.

parameters:
$tipo - Tipo de busca brasil|null
*/
	function itensTexto($tipo)
	{
		if(!$this->layer){return "erro";}
		if ($tipo == "brasil")
		{$this->mapa = extPadrao($this->mapa);}
		$this->layer->set("template","none.htm");
		$this->layer->setfilter("");
		//le o arquivo de query se existir e checa se existe seleção para o tema
		$items = pegaItens($this->layer);
		
		$shapes = retornaShapesSelecionados($this->layer,$this->arquivo,$this->mapa);
		if(count($shapes) == 0){
			$shapes = retornaShapesMapext($this->layer,$this->mapa);
		}
		$registros[] = array();
		foreach($shapes as $shape)
		{
			$valitem = array();
			foreach ($items as $item)
			{
				$v = trim($shape->values[$item]);
				$v = $this->converte($v);
				$valitem[] = $v;
			}
			$registros[] = implode(";",$valitem);
		}
		$fechou = $this->layer->close();
		return(array("itens"=>implode(";",$items),"valores"=>$registros));
	}
/*
function: listaRegistros

Pega todos os valores dos itens de uma tabela de um tema.

O range de busca pode ser limitado.

parameters:

$itemtema - Tema que será processado.

$tipo - Tipo de abrangência espacial (brasil ou mapa).

$unico - Lista valores únicos (sim ou vazio).

$inicio - Inicia do registro.

$fim - Termina no registro.

$tipolista - Indica se serão mostrados todos os registros ou apenas os selecionados (tudo|selecionados)
*/
	function listaRegistros($itemtema,$tipo,$unico,$inicio,$fim,$tipolista)
	{
		if(!$this->layer){return "erro";}
		$resultadoFinal = array();
		if ((!isset($tipolista)) || ($tipolista=="")){$tipolista = "tudo";}
		if (!isset($inicio)){$inicio = 0;}
		if (!isset($fim)){$fim = "";}
		//se tipo for igual a brasil, define a extensão geográfica total
		if ($tipo == "brasil")
		{$this->mapa = extPadrao($this->mapa);}
		$this->layer->set("template","none.htm");
		$this->layer->setfilter("");
		if ($this->layer->data == "")
		{return "erro. O tema não tem tabela";}
		//pega os valores
		if ((!isset($itemtema)) || ($itemtema == ""))
		{$items = pegaItens($this->layer);}
		else
		{$items[] = $itemtema;}
		$resultadoFinal[] = array("itens"=>$items);
		$shapes = retornaShapesSelecionados($layerPt,$this->arquivo,$this->mapa);
		$res_count = count($shapes);
		$registros = array();
		//lista apenas os selecionados
		if ($tipolista == "selecionados")
		{
			$chk = "CHECKED";
			if ($fim != "")
			{
				if (($res_count >= $fim) && ($fim < $res_count))
				{$res_count = $fim;}		
			}
			for ($i = $inicio; $i < $res_count; ++$i)
			{
				$valitem = array();
				$shape = $shapes[$i];
				foreach ($items as $item)
				{
					$valori = trim($shape->values[$item]);
					$valori = $this->converte($valori);
					$valitem[] = array("item"=>$item,"valor"=>$valori);
				}
				$registros[] = array("indice"=>$indx,"valores"=>$valitem,"status"=>$chk);
			}
			$resultadoFinal[] = array("registros"=>$registros);	 	
		}
		if ($tipolista == "tudo")
		{
			//ini_set('memory_limit', '500M');
			$shp_atual = array();
			for ($i = 0; $i < $res_count;++$i)
			{
				$shp_atual[$i] = $shapes[$i];;
			}
			$chk = "";
			if (@$this->layer->queryByrect($this->mapa->extent) == MS_SUCCESS)
			{
				$res_count = $this->layer->getNumresults();
				if ($fim != "")
				{
					if (($res_count >= $fim) && ($fim < $res_count))
					{$res_count = $fim;}		
				}
				$sopen = $this->layer->open();
				if($sopen == MS_FAILURE){return "erro";}
				for ($i = $inicio; $i < $res_count; ++$i)
				{
					$valitem = array();
					if($this->v == 6){
						$shape = $this->layer->getShape($this->layer->getResult($i));
						$indx = $shape->index;
					}
					else{
						$result = $this->layer->getResult($i);
						$indx  = $result->shapeindex;
						$shape = $this->layer->getfeature($indx,-1);						
					}						
					foreach ($items as $item)
					{						
						$valori = "";
						if(@$shape->values[$item])
						{
							$valori = ($shape->values[$item]);
						}
						$valori = $this->converte($valori);
						$valitem[] = array("item"=>$item,"valor"=>$valori);
					}
					//if (in_array($shp_index,$shp_atual))
					if(isset($shp_atual[$indx]))
					{$chk = "CHECKED";}
					$registros[] = array("indice"=>$indx,"valores"=>$valitem,"status"=>$chk);
					$chk = "";
				}
				$this->layer->close();
			}
			$resultadoFinal[] = array("registros"=>$registros);
		}
		return($resultadoFinal);
	}
/*
function: buscaRegistros

Procura valores em uma tabela que aderem a uma palavra de busca.

parameters:

$palavra - Palavra que será procurada.

$lista - Lista de busca no formato item;tema,item;tema.

$tipo - Tipo de busca exata|qualquer.

$onde - Tipo de abrangência espacial (brasil ou mapa)
*/
	function buscaRegistros($palavra,$lista,$tipo,$onde)
	{
		//error_reporting(E_ALL);
		if ($onde == "mapa")
		{$this->mapa = extPadrao($this->mapa);}
		$ptvs = explode(",",$lista);
		//monta a lista de temas que serao utilizados
		foreach ($ptvs as $p)
		{
			$pp = explode(";",$p);
			$temas[] = $pp[1];
		}
		$temas = array_unique($temas);
		//monta a lista de itens por tema
		foreach ($temas as $tema)
		{
			$temp = array();
			foreach ($ptvs as $p)
			{
				$pp = explode(";",$p);
				if ($pp[1] == $tema)
				{$temp[] = $pp[0];}
				$temasi[$tema] = $temp;
			}
		}
		$encontrado = "nao";
		$palavra = trim($palavra);
		foreach ($temas as $tema)
		{
			$registros = array();
			$items = $temasi[$tema];
			$l = $this->mapa->getlayerbyname($tema);
			$this->layer = $l;
			if ($l->data == "")
			{return "Erro. O tema não tem tabela";}
			$filtro = $l->getfilterstring();
			if ($filtro != ""){$l->setfilter("");}
			$buscas = "ÁÃÓÕÔáàãâóòôõúûíéêç";
			$buscaUTF = $this->converte($buscas);
			$trocas = "AAOOOaaaaoooouuieecAAOOOaaaaoooouuieec";
			$buscas = $buscas.$buscaUTF;
			$sopen = $l->open();
			if($sopen == MS_FAILURE){return "erro";}
			$l->whichShapes($this->mapa->extent);
			$fr = array();
			while ($shape = $l->nextShape())
			{
				$novoreg = array();
				$r = array();
				foreach ($items as $item)
				{
					$v = trim($shape->values[$item]);
					if ($tipo == "exata")
					{
						if (strtr($v,$buscas,$trocas) == strtr($palavra,$buscas,$trocas))
						{
							$v = $this->converte($v);
							$r[] = array("item" => $item,"valor" => $v);
							$encontrado = "sim";
  						}
					}
					else
					{
						if (stristr(strtr($v,$buscas,$trocas),strtr($palavra,$buscas,$trocas)))
						{
							$v = $this->converte($v);
							$r[] = array("item" => $item,"valor" => $v);
							$encontrado = "sim";
						}
					}
				}
				if ($encontrado == "sim")
				{
					$novoreg["box"] = $this->extensaoShape($shape,$l);			
					$novoreg["valores"] = $r;
					$encontrado = "nao";
					$fr[] = $novoreg;
				}
			}
			$resultado[] = array("tema"=>$tema,"resultado"=>$fr);
			$l->close();
		}
		return($resultado);
	}
/*
function: estatDescritivas

Calcula estatísticas básicas de uma tabela de um tema.

parameters:
$item - Item que será calculado.

$exclui - Valor que não será cosiderado.

Include:
<classe_estatistica.php>
*/
	function estatDescritivas($item,$exclui)
	{
		if(!$this->layer){return "erro";}
		$this->layer->set("template","none.htm");
		$items = pegaItens($this->layer);
		$valores = array();
		$filtro = $this->layer->getfilterstring();
		if ($filtro != ""){$this->layer->setfilter("");}
		//le o arquivo de query se existir e checa se existe sele&ccedil;&atilde;o para o tema
		$shapes = retornaShapesSelecionados($layerPt,$this->arquivo,$this->mapa);
		if(count($shapes) == 0){
			$shapes = retornaShapesMapext($layerPt,$this->mapa);
		}		
		//pega os valores
		foreach($shapes as $shape)
		{
			$v = $shape->values[$item];
			$valores[] = $v;
		}
		$fechou = $this->layer->close();
		$valoresn = array();
		//verifica se a lista de valores contem numeros e exclusao
		foreach ($valores as $valor)
		{
			if (is_numeric($valor))
			{
				if ($exclui != "")
				{
					if ($valor != $exclui)
					{$valoresn[] = $valor;}
				}
				else
				{$valoresn[] = $valor;}
			}
		}
		if (count($valoresn) == 0)
		{return("erro. Nenhum valor valido");}
		//faz os calculos
		if(file_exists($this->locaplic."/classe_estatistica.php"))
		include_once($this->locaplic."/classe_estatistica.php");
		else	
		include_once("classe_estatistica.php");
		$estat = new estatistica();
		$resultado = $estat->calcula($valoresn);
		$resultado = $estat->resultado;
		$indice = $estat->indice;
		if ($resultado['min'] == "")
		{return("erro. Nenhum valor valido");}
		$chaves = array_keys($indice);
		return(array("indices"=>$chaves,"variaveis"=>$indice,"valores"=>$resultado));
	}
/*
function: identifica

Depreciado na versão 4.2 (utilize "identifica2")

Identifica elementos no mapa.

parameters:
$opcao - Opcao tip|tema|ligados|todos.

$xy - coordenada x e y separadas por virgulao.

$resolucao - Resolucao de busca.
*/
	function identifica($opcao,$xy,$resolucao)
	{
		$temas = $this->mapa->getalllayernames();
		foreach ($temas as $tem)
		{
			$vermultilayer = new vermultilayer();
			$vermultilayer->verifica($this->arquivo,$tem);
			if ($vermultilayer->resultado == 1) // o tema e multi layer
			{
				foreach (($vermultilayer->temasvisiveis) as $tv)
				{
					$l = $this->mapa->getlayerbyname($tv);
					if ($l->getmetadata("identifica") != "nao")
					{$listatemas[] = $tv;}
				}
			}
			else
			{
		 		$l = $this->mapa->getlayerbyname($tem);
				if (($l->getmetadata("escondido") == "") && ($l->getmetadata("identifica") != "nao"))
				{$listatemas[] = $tem;}
			}
		}
		$listatemas = array_unique($listatemas);
		$xyarray = explode(",",$xy);
		$resultados = array();
		//pesquisa um tema
		if ($opcao == "tema")
		{
			$listatemas = array();
			$vermultilayer = new vermultilayer();
			$vermultilayer->verifica($this->arquivo,$this->nome);
			if ($vermultilayer->resultado == 1) // o tema e multi layer
			{$listatemp = $vermultilayer->temasvisiveis;}
			else
			{$listatemp[] = $this->nome;}
			foreach ($listatemp as $t)
			{
				$layerteste = $this->mapa->getlayerbyname($t);
				$mclasse = strtoupper($layerteste->getmetadata("CLASSE"));
				$mtema = strtoupper($layerteste->getmetadata("TEMA"));
				$gr = $layerteste->group;
				if ((!(($mclasse == "NAO") && ($mtema == "NAO"))) || ($gr != ""))
				{
					if (($layerteste->data != "") && ($layerteste->connectiontype != MS_WMS))
					{$listatemas[] = $t;}
				}
			}
			$layerteste = $this->layer;
			if ($layerteste->connectiontype == MS_WMS)
			{
				$listatemas = array();
				$listatemas[] = $this->nome;
			}
			foreach ($listatemas as $tema)
			{
				$resultados[$tema] = $this->identificaQBP($tema,$xyarray[0],$xyarray[1],$this->arquivo,$resolucao);
			}
		}
		//pesquisa todos os temas acrescentados no mapa
		if ($opcao == "todos")
		{
			foreach ($listatemas as $tema)
			{
				$resultados[$tema] = $this->identificaQBP($tema,$xyarray[0],$xyarray[1],$this->arquivo,$resolucao);
			}
		}
		//pesquisa apenas os temas visiveis
		if ($opcao == "ligados")
		{
			$novalista = array();
			foreach ($listatemas as $tema)
			{
				$l = $this->mapa->getlayerbyname($tema);
				if($l->status == MS_DEFAULT)
				$novalista[] = $tema;
				$listatemas = $novalista;
			}
			foreach ($listatemas as $tema)
			{
				$l = $this->mapa->getlayerbyname($tema);
				$resultados[$tema] = $this->identificaQBP($tema,$xyarray[0],$xyarray[1],$this->arquivo,$resolucao);
			}
			//var_dump($resultados);
		}
		//pesquisa apenas os temas com tip
		if ($opcao == "tip")
		{
			$ltemp = array();
			foreach ($listatemas as $tema)
			{
				$tl = $this->mapa->getlayerbyname($tema);
				$itemtip = $tl->getmetadata("TIP");
				if ($itemtip != "")
				{
					if ($tl->status == MS_DEFAULT)
					{
						$resultados[$tema] = $this->identificaQBP($tema,$xyarray[0],$xyarray[1],$this->arquivo,$resolucao,$itemtip);
						$ltemp[] = $tema;
					}
				}
			}
			$listatemas = $ltemp;
		}
		if (count($resultados) > 0)
		{
			$res = $this->converte($this->retornaI($listatemas,$resultados,$this->mapa));
			return($res);
		}
		else
		{return("");}
	}
/*
function: identifica2

Identifica elementos no mapa.

parameters:

$opcao - Opcao tip|tema|ligados|todos|lista.

$xy - coordenada x e y separadas por virgulao.

$resolucao - Resolucao de busca.

$ext - (opcional) Extensão geográfica que será aplicada ao mapa antes da operação de query (xmin ymin xmax ymax)

$listaDeTemas - (opcional) Lista com os códigos dos temas que serão identificados - vale apenas se $opcao = lista
*/
	function identifica2($opcao,$xy,$resolucao,$ext="",$listaDeTemas="")
	{
		if($listaDeTemas != "")
		{
			$listaDeTemas = str_replace(" ",",",$listaDeTemas);
			$temas = explode(",",$listaDeTemas);
		}
		else
		{$temas = $this->mapa->getalllayernames();}
		foreach ($temas as $tem)
		{
			$vermultilayer = new vermultilayer();
			$vermultilayer->verifica($this->arquivo,$tem);
			if ($vermultilayer->resultado == 1) // o tema e multi layer
			{
				foreach (($vermultilayer->temasvisiveis) as $tv)
				{
					$l = $this->mapa->getlayerbyname($tv);
					if ($l->getmetadata("identifica") != "nao")
					{$listatemas[] = $tv;}
				}
			}
			else
			{
		 		$l = $this->mapa->getlayerbyname($tem);
				if (($l->getmetadata("escondido") == "") && ($l->getmetadata("identifica") != "nao"))
				{$listatemas[] = $tem;}
			}
		}
		$listatemas = array_unique($listatemas);
		$xyarray = explode(",",$xy);
		$resultados = array();
		//pesquisa um tema
		if ($opcao == "tema")
		{
			$listatemas = array();
			$vermultilayer = new vermultilayer();
			$vermultilayer->verifica($this->arquivo,$this->nome);
			if ($vermultilayer->resultado == 1) // o tema e multi layer
			{$listatemp = $vermultilayer->temasvisiveis;}
			else
			{$listatemp[] = $this->nome;}
			foreach ($listatemp as $t)
			{
				$layerteste = $this->mapa->getlayerbyname($t);
				$mclasse = strtoupper($layerteste->getmetadata("CLASSE"));
				$mtema = strtoupper($layerteste->getmetadata("TEMA"));
				$gr = $layerteste->group;
				if ((!(($mclasse == "NAO") && ($mtema == "NAO"))) || ($gr != ""))
				{
					if (($layerteste->data != "") && ($layerteste->connectiontype != MS_WMS) || ($layerteste->tileindex != ""))
					{$listatemas[] = $t;}
					if($layerteste->connectiontype == MS_OGR)
					{$listatemas[] = $t;}
				}
			}
			$layerteste = $this->layer;
			if ($layerteste->connectiontype == MS_WMS)
			{
				$listatemas = array();
				$listatemas[] = $this->nome;
			}
			foreach ($listatemas as $tema)
			{
				$resultados[$tema] = $this->identificaQBP2($tema,$xyarray[0],$xyarray[1],"",$resolucao,"","",false,$ext);
			}
		}
		//pesquisa todos os temas acrescentados no mapa
		if ($opcao == "todos")
		{
			foreach ($listatemas as $tema)
			{$resultados[$tema] = $this->identificaQBP2($tema,$xyarray[0],$xyarray[1],"",$resolucao,"","",false,$ext);}
		}
		//pesquisa apenas os temas visiveis
		if ($opcao == "ligados" || $opcao == "lista")
		{
			if($opcao == "ligados")
			{
				$novalista = array();
				foreach ($listatemas as $tema)
				{
					$l = $this->mapa->getlayerbyname($tema);
					if($l->status == MS_DEFAULT)
					{$novalista[] = $tema;}
					$listatemas = $novalista;
				}
			}
			foreach ($listatemas as $tema)
			{
				$l = $this->mapa->getlayerbyname($tema);
				$resultados[$tema] = $this->identificaQBP2($tema,$xyarray[0],$xyarray[1],"",$resolucao,"","",false,$ext);
			}
			//var_dump($resultados);
		}
		//pesquisa apenas os temas com tip
		if ($opcao == "tip")
		{
			$ltemp = array();
			foreach ($listatemas as $tema)
			{
				$tl = $this->mapa->getlayerbyname($tema);
				$itemtip = $tl->getmetadata("TIP");
				if ($itemtip != "")
				{
					if ($tl->status == MS_DEFAULT || $listaDeTemas != "")
					{
						$resultados[$tema] = array("tips"=>$itemtip,"dados"=>$this->identificaQBP2($tema,$xyarray[0],$xyarray[1],"",$resolucao,$itemtip,"",true,$ext));
						$ltemp[] = $tema;
					}
				}
			}
			$listatemas = $ltemp;
		}
		if (count($resultados) > 0)
		{
			$res = $this->retornaI2($listatemas,$resultados,$this->mapa);
			return($res);
		}
		else
		{return("");}
	}
	/*
	function: retornaI2

	Depreciado na versão 4.2

	Processa o resultado da identificação de um elemento compondo um array de strings formatadas.

	parameters:
	$listatemas - Lista de temas

	$resultados - Resultados de cada tema.

	$map - Objeto Map.
	*/
	function retornaI2($listatemas,$resultados,$map)
	{
		$final = array();
		foreach ($listatemas as $tema)
		{
			$layer = $map->getlayerbyname($tema);
			$nometmp = $tema;
			if (strtoupper($layer->getMetaData("TEMA")) != "NAO")
			{$nometmp = $layer->getMetaData("TEMA");}
			else if ($layer->getMetaData("ALTTEMA") != "")
			{$nometmp = $layer->getMetaData("ALTTEMA");}
			$nometmp = $this->converte($nometmp);
			$final[] = array("nome"=>$nometmp,"resultado"=>$resultados[$tema]);
		}
		return $final;
	}

	/*
	function: retornaI

	Depreciado na versão 4.2

	Processa o resultado da identificação de um elemento compondo um array de strings formatadas.

	parameters:
	$listatemas - Lista de temas

	$resultados - Resultados de cada tema.

	$map - Objeto Map.
	*/
	function retornaI($listatemas,$resultados,$map)
	{
		$final = "";
		foreach ($listatemas as $tema)
		{
			$layer = $map->getlayerbyname($tema);
			//pega o nome correto do tema
			$nometmp = $tema;
			if (strtoupper($layer->getMetaData("TEMA")) != "NAO")
			{$nometmp = $layer->getMetaData("TEMA");}
			else if ($layer->getMetaData("ALTTEMA") != "")
			{$nometmp = $layer->getMetaData("ALTTEMA");}
			$final = $final."!".$nometmp;
			$final = trim($final,"!");
			$rs = $resultados[$tema];
			$final = $final."@";
			foreach ($rs as $r)
			{
				$final = $final . "*";
				if ($r != " ")
				{
					foreach ($r as $f)
					{$final = $final . $f;}
				}
			}
		}
		return $final;
	}
	/*
	function: identificaQBP

	Depreciado na versão 4.2

	Identifica um elemento utilizando querybypoint.

	parameters:

	$tema - Tema que será identificado

	$x - Coordenada X.

	$y - Coordenada Y.

	$map_file - Arquivo map file.

	$resolucao - Resolução de busca.

	$item - Item único que será identificado.

	$tiporetorno - Tipo de retorno dos dados. Se for vazio, o retorno é formatado como string, se for shape, retorna o objeto shape 
	*/
	function identificaQBP($tema,$x,$y,$map_file,$resolucao,$item="",$tiporetorno="")
	{
		$mapa = ms_newMapObj($map_file);
		$layer = $mapa->getLayerByName($tema);
		$layer->set("status",MS_DEFAULT);
		$layer->set("template","none.htm");
		$pt = ms_newPointObj();
		$pt->setXY($x,$y);
		//
		//operação especial para o caso de wms
		//
		if($layer->connectiontype == MS_WMS)
		{
			$layer->set("toleranceunits",MS_PIXELS);
			$layer->set("tolerance",$resolucao);
			$ptimg = xy2imagem($map_file,array($x,$y));
			$mapa = desligatemas($mapa);
			$mapa = desligamargem($mapa);
			$imgo = $mapa->draw();
			//$res = $layer->getWMSFeatureInfoURL($ptimg->x, $ptimg->y, 1,"MIME");
			$resultado = array();
			$res = $layer->connection;
			$res .= "&request=getfeatureinfo&service=wms";
			$res .= "&version=1.1.0";//.($layer->getmetadata("wms_version"));
			$res .= "&QUERY_LAYERS=".($layer->getmetadata("wms_name"));
			$res .= "&LAYERS=".($layer->getmetadata("wms_name"));
			$bb = $mapa->extent;
			$res .= "&BBOX=".($bb->minx).",".($bb->miny).",".($bb->maxx).",".($bb->maxy);
			$res .= "&X=".round($ptimg->x);
			$res .= "&Y=".round($ptimg->y);
			$res .= "&WIDTH=".$mapa->width;
			$res .= "&HEIGHT=".$mapa->height;
			$formatoinfo = "text/plain";
			$formatosinfo = $layer->getmetadata("formatosinfo");
			if ($formatosinfo != "")
			{
				$formatosinfo = explode(",",$formatosinfo);
				if ($formatosinfo[0] != ""){$formatoinfo = $formatosinfo[0];}
				foreach ($formatosinfo as $f)
				{
					if(strtoupper($f) == "TEXT/PLAIN")
					{$formatoinfo = "text/plain";}
				}
						
			}
			$srs = $layer->getmetadata("wms_srs");
			$srss = explode(" ",$srs);
			$srs = "EPSG:4326";
			foreach ($srss as $s)
			{
				if(strtoupper($s) == "EPSG:4291")
				{$srs = "EPSG:4291";}
			}
			$res .= "&SRS=".$srs;
			$resposta = file($res."&FORMAT=".$formatoinfo);
			$resposta = str_ireplace('<?xml version="1.0" encoding="UTF-8"?>',"",$resposta);
			$resposta = str_ireplace('<?xml version="1.0" encoding="ISO-8859-1"?>',"",$resposta);
			$resposta = str_ireplace("<?xml version='1.0' encoding='ISO-8859-1'?>","",$resposta);
			$resposta = str_ireplace('<?xml',"",$resposta);
			$resposta = str_ireplace("<","zzzzzzzzzz",$resposta);
			$resposta = str_ireplace(">","zzzzzzzzzz",$resposta);
			if (stristr(implode(" ",$resposta),"msWMSLoadGetMapParams"))
			{
				$resposta = file($res);
				$resposta = str_ireplace('<?xml version="1.0" encoding="UTF-8"?>',"",$resposta);
				$resposta = str_ireplace('<?xml version="1.0" encoding="ISO-8859-1"?>',"",$resposta);
				$resposta = str_ireplace("<?xml version='1.0' encoding='ISO-8859-1'?>","",$resposta);
				$resposta = str_ireplace('<?xml',"",$resposta);
				$resposta = str_ireplace("<","zzzzzzzzzz",$resposta);
				$resposta = str_ireplace(">","zzzzzzzzzz",$resposta);
			}
			$resultado[] = $resposta;
			return $resultado;		
		}
		if(($layer->connectiontype != MS_WMS) && ($layer->type == MS_LAYER_RASTER))
		{
			$layer->set("toleranceunits",MS_PIXELS);
			$layer->set("tolerance",$resolucao);
			$ident = @$layer->queryByPoint($pt, 0, 0); //0.01);
		}
		if (($layer->type == MS_LAYER_POINT) || ($layer->type == MS_LAYER_LINE))
		{
			$layer->set("toleranceunits",MS_PIXELS);
			$layer->set("tolerance",$resolucao);
			$ident = @$layer->queryByPoint($pt, 1, 0); //0.01);
		}
		if ($layer->type == MS_LAYER_POLYGON)
		{
			$layer->set("toleranceunits",'MS_PIXEL');
			$layer->set("tolerance",1);
			$ident = @$layer->queryByPoint($pt, 1, 0);
		}
		if ($ident == MS_SUCCESS)
		{
			$its = $layer->getmetadata("ITENS"); // itens
			if ($item != "") //utilizado pela funcao tip
			{$its = $item;}
			if ($its != "")
			{
				$descis = $layer->getmetadata("ITENSDESC"); // descri&ccedil;&atilde;o dos itens
				$descisarray = explode(",",$descis); // array com a descri&ccedil;&atilde;o dos itens
				$itsarray = explode(",",$its); // array com os nomes dos itens
				$lks = $layer->getmetadata("ITENSLINK"); // link dos itens
				$itemimg = $layer->getmetadata("ITEMIMG"); //indica um item que será utilizado para colocar um ícone
				$locimg = $layer->getmetadata("IMGLOC"); //indica o local onde estão os ícones
				$lksarray = explode(",",$lks);
				if ($item != "") //utilizado pela funcao tip
				{
					$descis = $item;
					$descisarray = array();
					$descisarray[] = $item;
					$lksarray = array();
				}
			}
			else
			{
				if ($item != "") //utilizado pela funcao tip
				{
					$descisarray[] = $item;
					$lksarray = array();
				}
				else
				{
					$descisarray = pegaItens($layer);
					$itsarray = $descisarray;
					$lksarray = array();
				}
			}
			$res_count = $layer->getNumresults();
			$sopen = $layer->open();
			if($sopen == MS_FAILURE){return "erro";}
			for ($i = 0; $i < $res_count; ++$i)
			{
				$valori = array();
				$shape = $layer->getShape($layer->getResult($i));
				
				if ($tiporetorno == "shape")
				{
					$layer->close();
					return $shape;
				}
				if ($tiporetorno == "unico")
				{
					$layer->close();
					return $shape->values[$itsarray[0]];;
				}
				$conta = 0;
				foreach ($itsarray as $it)
				{
					$val = $shape->values[$it];
					if ($val == ""){$val = "-";}
					if(!@$lksarray[$conta]){$lksarray[$conta] = "";}
					if ($lksarray[$conta] == "") //descricao,valor,link
					{
						if(!@$descisarray[$conta]){$descisarray[$conta] = "";}
						$valori[] = $descisarray[$conta].":#".($val)."#"." ";
					}
					else
					{
						$nli = $descisarray[$conta].":#".$val."#".$lksarray[$conta];
						$itemstab = pegaItens($layer);
						foreach ($itemstab as $itab)
						{
							$busca = '['.$itab.']';
							$nli = str_replace($busca,$shape->values[$itab],$nli);
						}
						$valori[] = $nli;
					}
					if ((@$shape->values[$itemimg]) && ($itemimg != "")) //incluir icone
					{
						$valori[] = "<img src=..//".$locimg."//".$shape->values[$itemimg].".png //># # ";
					}
					$conta = $conta + 1;
				}
				$valori = implode("@##",$valori);
				$valori = explode("@",$valori);
				$resultado[] = $valori;
			}
			$layer->close();
		}
		else
		{$resultado[] = " ";}
		return $resultado;
	}
	/*
	function: identificaQBP2

	Identifica um elemento utilizando querybypoint.

	parameters:

	$tema - Tema que será identificado (se for vazio, será utilizado o objeto mapa definido no construtor da classe)

	$x - Coordenada X.

	$y - Coordenada Y.

	$map_file - Arquivo map file (se for vazio, será utilizado o objeto mapa definido no construtor da classe).

	$resolucao - Resolução de busca.

	$item - Item único que será identificado.

	$tiporetorno - Tipo de retorno dos dados. Se for vazio, o retorno é formatado como string, se for shape, retorna o objeto shape, googlerelevo retorna no padrão da API do google para relevo

	$etip  {booblean} - indica se a solicitação é para obtenção dos dados do tipo etiqueta
	*/
	function identificaQBP2($tema="",$x=0,$y=0,$map_file="",$resolucao=0,$item="",$tiporetorno="",$etip=false,$ext="")
	{
		if($map_file == "")
		{
			$mapa = $this->mapa;
			$map_file = $this->arquivo;
		}
		else
		{$mapa = ms_newMapObj($map_file);}

		if($ext != ""){
			$extmapa = $mapa->extent;
			$e = explode(" ",$ext);
			$extmapa->setextent((min($e[0],$e[2])),(min($e[1],$e[3])),(max($e[0],$e[2])),(max($e[1],$e[3])));
		}
		if($tema == "")
		{$layer = $this->layer;}
		else
		{$layer = $mapa->getLayerByName($tema);}
		$layer->set("status",MS_DEFAULT);
		$layer->set("template","none.htm");
		$pt = ms_newPointObj();
		$pt->setXY($x, $y);
		//
		//operação especial para o caso de wms
		//
		if($layer->connectiontype == MS_WMS)
		{
			$layer->set("toleranceunits",MS_PIXELS);
			$layer->set("tolerance",$resolucao);
			$ptimg = xy2imagem($map_file,array($x,$y));
			//var_dump($ptimg);exit;
			$mapa = desligatemas($mapa);
			$mapa = desligamargem($mapa);
			$imgo = $mapa->draw();
			//$formatoinfo = "MIME";
			$formatosinfo = $layer->getmetadata("formatosinfo");
			if ($formatosinfo != "")
			{
				$formatosinfo = explode(",",$formatosinfo);
				if ($formatosinfo[0] != ""){$formatoinfo = $formatosinfo[0];}
				foreach ($formatosinfo as $f)
				{
					if(strtoupper($f) == "TEXT/PLAIN")
					{$formatoinfo = "text/plain";}
				}						
			}
			else
			{
				$formatoinfo = $layer->getmetadata("wms_feature_info_type");
				if($formatoinfo == "")
				{$formatoinfo = $layer->getmetadata("wms_feature_info_mime_type");}
				if($formatoinfo == "")
				{$formatoinfo = "text/plain";}
			}
			$res = $layer->getWMSFeatureInfoURL($ptimg->x, $ptimg->y, 1,$formatoinfo);
			$res = str_replace("INFOFORMAT","INFO_FORMAT",$res);
			$res2 = $layer->getWMSFeatureInfoURL($ptimg->x, $ptimg->y, 1,"MIME");
			$res2 = str_replace("INFOFORMAT","INFO_FORMAT",$res2);
			
			$resposta = file($res);
			$n = array();
			if(strtoupper($formatoinfo) == "TEXT/HTML")
			{
				$n[] = array("alias"=>"","valor"=>"<iframe width=270px src='".$res."'></iframe>","link"=>"","img"=>"");
			}
			else
			{
				foreach($resposta as $r)
				{
					$t = explode("=",$r);
					$v = str_replace("\\n","",$t[1]);
					$v = str_replace("\\r","",$v);
					if(trim($v) != "")
					{
						$va = trim($v);
						$va = $this->converte($va);
						$n[] = array("alias"=>trim($t[0]),"valor"=>$va,"link"=>"","img"=>"");
					}
				}
				//caso esri
				if($n[0] == "")
				{
					//error_reporting(E_ALL);
					$resposta = file($res);
					$cabecalho = str_replace('"   "','"|"',$resposta[0]);
					$cabecalho = explode("|",$cabecalho);
					
					$linha = str_replace('"  "','"|"',$resposta[1]);
					$linha = explode("|",$linha);
					for($i=0;$i < count($cabecalho);++$i)
					{
						$va = $this->converte($linha[$i]);
						$n[] = array("alias"=>$cabecalho[$i],"valor"=>$va,"link"=>"","img"=>"");
					}
				}
			}
			$n[] = array("alias"=>"Link WMS","valor"=>"getfeatureinfo ".$formatoinfo,"link"=>$res,"img"=>"");
			$n[] = array("alias"=>"Link WMS","valor"=>"getfeatureinfo padr&atilde;o do servi&ccedil;o","link"=>$res2,"img"=>"");
			return array($n);
		}
		
		$itens = $layer->getmetadata("ITENS"); // itens
		$itensdesc = $layer->getmetadata("ITENSDESC"); // descri&ccedil;&atilde;o dos itens
		$lks = $layer->getmetadata("ITENSLINK"); // link dos itens
		$itemimg = $layer->getmetadata("ITEMIMG"); //indica um item que será utilizado para colocar um ícone
		$locimg = $layer->getmetadata("IMGLOC"); //indica o local onde estão os ícones
		$tips = $layer->getmetadata("TIP");
		$itensLayer = pegaItens($layer);
		$nitens = count($itensLayer);
		if($itens == "")
		{$itens = $itensLayer;}
		else
		{$itens = explode(",",$itens);}
		
		if($itensdesc == "")
		{$itensdesc = $itensLayer;}//array_fill(0, $nitens-1,'');}
		else
		{$itensdesc = explode(",",$itensdesc);}
		
		if($lks == "")
		{$lks = array_fill(0, $nitens-1,'');}
		else
		{$lks = explode(",",$lks);}
				
		if($itemimg == "")
		{$itemimg = array_fill(0, $nitens-1,'');}
		else
		{$itemimg = explode(",",$itemimg);}	
			
		if($locimg == "")
		{$locimg = array_fill(0, $nitens-1,'');}
		else
		{$locimg = explode(",",$locimg);}
		$tips = str_replace(" ",",",$tips);
		$tips = explode(",",$tips);
		//o retorno deve ser do tipo TIP
		if($etip == true)
		{
			$temp = array_combine($itens,$itensdesc);
			$templ = array_combine($itens,$lks);
			$tempimg = array_combine($itens,$itemimg);
			$temploc = array_combine($itens,$locimg);
			$itensdesc = array();
			$itens = array();
			$lks = array();
			$itemimg = array();
			$locimg = array();
			foreach($tips as $t)
			{
				$itens[] = $t;
				if($temp[$t] != ""){$itensdesc[] = $temp[$t];}else{$itensdesc[] = $t;}
				if($templ[$t] != ""){$lks[] = $templ[$t];}else{$lks[] = "";}
				if($tempimg[$t] != ""){$itemimg[] = $tempimg[$t];}else{$itemimg[] = "";}
				if($temploc[$t] != ""){$locimg[] = $temploc[$t];}else{$locimg[] = "";}
			}
		}
		if(($layer->connectiontype != MS_WMS) && ($layer->type == MS_LAYER_RASTER))
		{
			$layer->set("toleranceunits",MS_PIXELS);
			$layer->set("tolerance",$resolucao);
			$ident = @$layer->queryByPoint($pt, 0, 0); //0.01);	
		}
		if (($layer->type == MS_LAYER_POINT) || ($layer->type == MS_LAYER_LINE) || ($layer->type == MS_LAYER_CHART))
		{
			$layer->set("toleranceunits",MS_PIXELS);
			$layer->set("tolerance",$resolucao);
			$ident = @$layer->queryByPoint($pt, 1, -1); //0.01);
		}
		if ($layer->type == MS_LAYER_POLYGON)
		{
			$layer->set("toleranceunits",MS_PIXELS);
			$layer->set("tolerance",$resolucao);
			$ident = @$layer->queryByPoint($pt, 1, -1);
		}
		if ($ident == MS_SUCCESS)
		{
			$ident = @$layer->queryByPoint($pt, 1, -1);
			$sopen = $layer->open();
			$res_count = $layer->getNumresults();
			if($sopen == MS_FAILURE){return "erro";}
			for ($i = 0; $i < $res_count; ++$i)
			{
				$valori = array();
				if($this->v == 6)
				{$shape = $layer->getShape($layer->getResult($i));}
				else{
					$result = $layer->getResult($i);
					$shp_index  = $result->shapeindex;
					$shape = $layer->getfeature($shp_index,-1);								
				}
				$conta = 0;
				//var_dump($itens);exit;
				if($tiporetorno == "shape" || $tiporetorno == "googlerelevo"){
					if($tiporetorno == "shape")
					{$resultado[] = $shape;}
					if($tiporetorno == "googlerelevo"){
						$lin = $shape->line(0);
						$p = $lin->point(0);
						$resultado = array(
							"elevation"=>$shape->values[$item],
							"location"=>array(
								"lat"=>$p->x,
								"lng"=>$p->y
							)
						);
					}
				}
				else{
					if($etip == false && $item != "")
					{$resultado[] = $shape->values[$item];}
					else{
						foreach ($itens as $it)
						{
							$val = $shape->values[$it];
							$link = $lks[$conta];
							foreach($itens as $t)
							{
								$valtemp = $shape->values[$t];
								$busca = '['.$t.']';
								$link = str_replace($busca,$valtemp,$link);
							}
							$img = "";
							if($locimg[$conta] != "" && $itemimg[$conta] != "")
							{$img = "<img src='".$locimg[$conta]."//".$shape->values[$itemimg[$conta]]."' //>";}
							else
							if($itemimg[$conta] != "")
							{$img = "<img src='".$shape->values[$itemimg[$conta]]."' //>";}					
							//indica se o item é tbm uma etiqueta
							$etiqueta = "nao";
							if(in_array($it,$tips))
							{$etiqueta = "sim";}
							$arraytemp = array(
								"alias"=>$this->converte($itensdesc[$conta]),
								"valor"=>$this->converte($val),
								"link"=>$link,
								"img"=>$img,
								"tip"=>$etiqueta
							);
							if($etip==false)
							{$valori[] = $arraytemp;}
							else
							{$valori[$it] = $arraytemp;}
							$conta = $conta + 1;
						}
						$resultado[] = $valori;
					}
				}
			}
			$layer->close();
		}
		else
		{$resultado[] = " ";}
		//exit;
		return $resultado;
	}
	/*
	Function: converte
	
	Converte uma string de ISO-8859-1 para UTF-8
	
	Parametro:
	
	$texto - string que será convertida
	
	Return:
	
	{string}
	*/
	function converte($texto)
	{
		if (function_exists("mb_convert_encoding"))
		{
			if (!mb_detect_encoding($texto,"UTF-8",true))
			{$texto = mb_convert_encoding($texto,"UTF-8","ISO-8859-1");}
		}
		return $texto;
	}
}
?>