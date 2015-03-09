<?php
/*
 Title: classe_atributos

Processa a tabela de atributos de um tema.

Lista valores, consulta, etc.

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

	Cria um objeto Atributos.

	O tipo de interface usada pelo mapa &eacute; obtido do metadata "interface". Se for a interface Googlemaps, &eacute; feita a altera&ccedil;&atilde;o tempor&aacute;ria da proje&ccedil;&atilde;o do mapa.

	parameters:

	$map_file - Endere&ccedil;o do mapfile no servidor.

	$tema - nome do tema

	$locaplic - (opcional) endere&ccedil;o do i3geo

	$ext - (opcional) extens&atilde;o geogr&aacute;fica que ser&aacute; aplicada ao mapa
	*/
	function __construct($map_file="",$tema="",$locaplic="",$ext="")
	{
		error_reporting(0);
		if (!function_exists('ms_newMapObj')) {
			return false;
		}
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
				$this->mapa->setProjection("init=epsg:4618,a=6378137,b=6378137");
			}
		}
	}
	/*
	 function: salva

	Salva o mapfile atual

	*/
	function salva()
	{
		if (connection_aborted()){
			exit();
		}
		if($this->mapa->getmetadata("interface") == "googlemaps")
		{
			$this->mapa->setProjection($this->projO);
		}
		$this->mapa->save($this->arquivo);
	}

	/*
	 function: extensaoShape

	Pega a extens&atilde;o geogr&aacute;fica de um objeto shape.

	parameters:
	Objeto shape

	return:
	xmin ymin xmax ymax separados por espa&ccedil;o.
	*/
	function extensaoShape($shape)
	{
		if(!$this->layer){
			return "erro";
		}
		$prjMapa = $this->mapa->getProjection();
		$prjTema = $this->layer->getProjection();
		$ret = $shape->bounds;
		//
		//verifica se o retangulo est&aacute; ou n&atilde;o em coordenadas geogr&aacute;ficas
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

	Pega a extens&atilde;o geogr&aacute;fica de um registro na tabela de atributos de um tema.

	parameters:
	$registro - &Iacute;ndice do registro que ser&aacute; consultado.
	*/
	function extensaoRegistro($registro)
	{
		if(!$this->layer){
			return "erro";
		}
		//error_reporting(0);
		$this->layer->set("template","none.htm");
		//$this->layer->setfilter("");
		$ext = "";
		//procura o registro e pega a extens&atilde;o geogr&aacute;fica
		if($this->v == 6){
			$this->layer->open();
			$shape = $this->layer->getShape(new resultObj($registro));
			//$shape = $this->layer->getShape($this->layer->getResult($registro));
		}
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
		//verifica se o tema &eacute; um grupo e cria um array com a lista de temas
		$vermultilayer = new vermultilayer();
		$vermultilayer->verifica($this->arquivo,$this->nome);
		if ($vermultilayer->resultado == 1){ // o tema e multi layer
			$l = $vermultilayer->temasvisiveis;
		}
		else{
			$l[] = $this->nome;
		}
		//pega os itens de cada layer
		$lista = array();
		foreach ($l as $tema){
			$layer = $this->mapa->getlayerbyname($tema);
			$layer->set("template","none.htm");
			//pega o nome correto do tema
			$nometmp = pegaNome($layer,"UTF-8");
			$nomestemas[] = $nometmp;
			if($layer->data != "" || $layer->connectiontype == 7){
				$items = pegaItens($layer,$this->mapa);
				//pega os alias
				if($this->layer->getmetadata("itensdesc") != ""){
					$alias = array();
					$aliasdesc = explode(",",$this->layer->getmetadata("itensdesc"));
					$aliasitens = explode(",",$this->layer->getmetadata("itens"));
					$aliasc = array_combine($aliasitens,$aliasdesc);
					if(strtoupper($this->layer->getmetadata("convcaracter")) == "NAO"){
						$convC = false;
					}
					else{
						$convC = true;
					}
					foreach($items as $i){
						if($aliasc[$i]){
							if($convC){
								$alias[$i] = $this->converte($aliasc[$i]);
							}
							else{
								$alias[$i] = $aliasc[$i];
							}
						}
						else{
							$alias[$i] = $i;
						}
					}
				}
				foreach ($items as $item){
					if($alias[$item]){
						$a = $alias[$item];
					}
					else{
						$a = "";
					}
					$lista[] = array("item"=>$item,"nome"=>$nometmp,"tema"=>$tema,"alias"=>$a);
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
		if(!$this->layer){
			return "erro";
		}
		if ($tipo == "brasil")
		{
			$this->mapa = extPadrao($this->mapa);
		}
		$this->layer->set("template","none.htm");
		$this->layer->setfilter("");
		//le o arquivo de query se existir e checa se existe sele&ccedil;&atilde;o para o tema
		$items = pegaItens($this->layer,$this->mapa);

		$shapes = retornaShapesSelecionados($this->layer,$this->arquivo,$this->mapa);
		if(count($shapes) == 0){
			$shapes = retornaShapesMapext($this->layer,$this->mapa);
		}
		$registros[] = array();
		if(strtoupper($this->layer->getmetadata("convcaracter")) == "NAO")
		{
			$convC = false;
		}
		else
		{$convC = true;
		}
		foreach($shapes as $shape)
		{
			$valitem = array();
			foreach ($items as $item)
			{
				$v = trim($shape->values[$item]);
				if($convC == true)
				{
					$v = $this->converte($v);
				}
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

	$itemtema - (opcional) se for definido, apenas um item sera retornado

	$tipo - Tipo de abrang&ecirc;ncia espacial (brasil ou mapa).

	$unico - Lista valores &uacute;nicos (sim ou vazio).

	$inicio - Inicia do registro.

	$fim - Termina no registro.

	$tipolista - Indica se ser&atilde;o mostrados todos os registros ou apenas os selecionados (tudo|selecionados)

	$dadosDaClasse - sim|nao Indica se ser&atilde;o obtidos os dados que descrevem a classe do layer que cont&eacute;m o registro
	*/
	function listaRegistros($itemtema,$tipo,$unico,$inicio,$fim,$tipolista,$dadosDaClasse="nao")
	{
		error_reporting(0);
		if(!$this->layer){
			return "erro";
		}
		if($this->v < 6){
			$dadosDaClasse="nao";
		}
		$resultadoFinal = array();
		if ((!isset($tipolista)) || ($tipolista=="")){
			$tipolista = "tudo";
		}
		if (empty($inicio)){
			$inicio = 0;
		}
		if (empty($fim)){
			$fim = "";
		}
		//se tipo for igual a brasil, define a extens&atilde;o geogr&aacute;fica total
		if ($tipo == "brasil"){
			$this->mapa = extPadrao($this->mapa);
		}
		$this->layer->set("template","none.htm");
		$this->layer->setfilter("");
		if ($this->layer->data == ""){
			return "erro. O tema n&atilde;o tem tabela";
		}
		//pega os valores
		if ((!isset($itemtema)) || ($itemtema == "")){
			$items = pegaItens($this->layer,$this->mapa);
		}
		else{
			$items[] = $itemtema;
		}
		//pega os alias definidos no metadata itensdesc
		if($this->layer->getmetadata("itensdesc") != ""){
			$alias = array();
			$aliasdesc = explode(",",$this->layer->getmetadata("itensdesc"));
			$aliasitens = explode(",",$this->layer->getmetadata("itens"));
			$aliasc = array_combine($aliasitens,$aliasdesc);
			if(strtoupper($this->layer->getmetadata("convcaracter")) == "NAO"){
				$convC = false;
			}
			else{
				$convC = true;
			}
			foreach($items as $i){
				if($aliasc[$i]){
					if($convC){
						$alias[] = $this->converte($aliasc[$i]);
					}
					else{
						$alias[] = $aliasc[$i];
					}
				}
				else{
					$alias[] = $i;
				}
			}
		}
		else{
			$alias = $items;
		}
		$shapes = retornaShapesSelecionados($this->layer,$this->arquivo,$this->mapa,true);
		$res_count = count($shapes);
		$resultadoFinal[] = array("totalSelecionados"=>$res_count,"itens"=>$items,"alias"=>$alias);
		$registros = array();
		//lista apenas os selecionados
		if(strtoupper($this->layer->getmetadata("convcaracter")) == "NAO"){
			$convC = false;
		}
		else{
			$convC = true;
		}
		if ($tipolista == "selecionados"){
			$chk = "CHECKED";
			//cria um novo array apenas para funcionar no contador
			$s = array();
			foreach($shapes as $shape){
				$s[] = $shape;
			}
			if ($fim != ""){
				if (($res_count >= $fim) && ($fim < $res_count)){
					$res_count = $fim;
				}
			}
			for ($i = $inicio; $i < $res_count; ++$i){
				$valitem = array();
				$shape = $s[$i];
				$indx = $shape->index;
				foreach ($items as $item){
					$valori = trim($shape->values[$item]);
					if($convC == true){
						$valori = $this->converte($valori);
					}
					$valitem[] = array("item"=>$item,"valor"=>$valori);
				}
				$classe = "";
				if($dadosDaClasse == "sim"){
					$indice = $this->layer->getClassIndex($shape);
					$nome = $this->layer->getclass($indice)->name;
					$classe = array(
							"indice"=>$indice,
							"nome"=>$nome
					);
				}
				$ext = $this->extensaoShape($shape);
				$registros[] = array("indice"=>$indx,"valores"=>$valitem,"status"=>$chk,"classe"=>$classe,"ext"=>$ext);
			}
			$resultadoFinal[] = array("registros"=>$registros);
		}
		if ($tipolista == "tudo"){
			//ini_set('memory_limit', '500M');
			$shp_atual = $shapes;
			$chk = "";
			if (@$this->layer->queryByrect($this->mapa->extent) == MS_SUCCESS){
				$res_count = $this->layer->getNumresults();
				$totalGeral = $res_count;
				if ($fim != ""){
					if (($res_count >= $fim) && ($fim < $res_count)){
						$res_count = $fim;
					}
				}
				$sopen = $this->layer->open();
				if($sopen == MS_FAILURE){
					return "erro";
				}
				$valoresunicos = array();
				for ($i = $inicio; $i < $res_count; ++$i){
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

					foreach ($items as $item){
						$valori = "";
						if(@$shape->values[$item]){
							$valori = ($shape->values[$item]);
						}
						if($convC == true){
							$valori = $this->converte($valori);
						}
						if($unico == "sim"){
							if(!in_array($valori,$valoresunicos)){
								$valitem[] = array("item"=>$item,"valor"=>$valori);
							}
							$valoresunicos[] = $valori;
						}
						else{
							$valitem[] = array("item"=>$item,"valor"=>$valori);
						}
					}
					//if (in_array($shp_index,$shp_atual))
					if(isset($shp_atual[$indx])){
						$chk = "CHECKED";
					}
					$classe = "";
					if($dadosDaClasse == "sim" && $unico != "sim"){
						$indice = $this->layer->getClassIndex($shape);
						if($indice >= 0){
							$nome = $this->layer->getclass($indice)->name;
						}
						else{
							$nome = "";
						}
						$classe = array(
								"indice"=>$indice,
								"nome"=>$nome
						);
					}
					if(count($valitem) > 0){
						$ext = $this->extensaoShape($shape);
						//echo "<br>".$indx;
						$registros[] = array("indice"=>$indx,"valores"=>$valitem,"status"=>$chk,"classe"=>$classe,"ext"=>$ext);
					}
					$chk = "";
				}
				$this->layer->close();
			}
			$resultadoFinal[] = array("totalGeral"=>$totalGeral,"registros"=>$registros);
		}
		return($resultadoFinal);
	}
	/*
	 function: listaRegistrosXY

	Pega o XY de cada registro e valores de itens especificos

	parameters:

	$items - lista de itens separado por ","

	$tipo - Tipo de abrang&ecirc;ncia espacial (brasil ou mapa).

	$tipolista - Indica se ser&atilde;o mostrados todos os registros ou apenas os selecionados (tudo|selecionados)

	*/
	function listaRegistrosXY($items,$tipo,$tipolista)
	{
		error_reporting(0);
		if(!$this->layer){
			return "erro";
		}
		$resultadoFinal = array();
		if ((!isset($tipolista)) || ($tipolista=="")){
			$tipolista = "tudo";
		}
		//se tipo for igual a brasil, define a extens&atilde;o geogr&aacute;fica total
		if ($tipo == "brasil"){
			$this->mapa = extPadrao($this->mapa);
		}
		$this->layer->set("template","none.htm");
		$this->layer->setfilter("");
		if ($this->layer->data == ""){
			return "erro. O tema n&atilde;o tem tabela";
		}
		$items = str_replace(" ",",",$items);
		$items = explode(",",$items);
		$registros = array();
		if ($tipolista == "selecionados"){
			$shapes = retornaShapesSelecionados($this->layer,$this->arquivo,$this->mapa);
			$res_count = count($shapes);
			for ($i = 0; $i < $res_count; ++$i){
				$valitem = array();
				$shape = $shapes[$i];
				$indx = $shape->index;
				foreach ($items as $item){
					$valori = trim($shape->values[$item]);
					$valitem[] = array("item"=>$item,"valor"=>$valori);
				}
				$c = $shape->getCentroid();
				$registros[] = array("indice"=>$indx,"valores"=>$valitem,"x"=>$c->x,"y"=>$c->y);
			}
		}
		if ($tipolista == "tudo"){
			if (@$this->layer->queryByrect($this->mapa->extent) == MS_SUCCESS){
				$res_count = $this->layer->getNumresults();
				$sopen = $this->layer->open();
				for ($i = 0; $i < $res_count; ++$i){
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
					foreach ($items as $item){
						$valori = trim($shape->values[$item]);
						$valitem[] = array("item"=>$item,"valor"=>$valori);
					}
					$c = $shape->getCentroid();
					$registros[] = array("indice"=>$indx,"valores"=>$valitem,"x"=>$c->x,"y"=>$c->y);
				}
				$this->layer->close();
			}
		}
		return($registros);
	}
	/*
		function: buscaRegistros

	Procura valores em uma tabela que aderem a uma palavra de busca.

	parameters:

	$palavra - Palavra que ser&aacute; procurada.

	$lista - Lista de busca no formato item;tema,item;tema.

	$tipo - Tipo de busca exata|qualquer.

	$onde - Tipo de abrang&ecirc;ncia espacial (brasil ou mapa)
	*/
	function buscaRegistros($palavra,$lista,$tipo,$onde)
	{
		//error_reporting(0);
		$resultado = array();
		if ($onde == "mapa")
		{
			$this->mapa = extPadrao($this->mapa);
		}
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
				{
					$temp[] = $pp[0];
				}
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
			$l->set("template","none.htm");
			if ($l->data == "")
			{
				return "Erro. O tema n&atilde;o tem tabela";
			}
			if(strtoupper($l->getmetadata("convcaracter")) == "NAO")
			{
				$convC = false;
			}
			else
			{$convC = true;
			}
			$filtro = $l->getfilterstring();
			if ($filtro != ""){
				$l->setfilter("");
			}
			$b = "&Aacute;&Atilde;&Otilde;&Oacute;&Ocirc;&aacute;&atilde;&acirc;&agrave;&oacute;&otilde;&ocirc;&ograve;&uacute;&ucirc;&iacute;&ecirc;&eacute;&ccedil;";

			$trocas = "AAOOOaaaaoooouuieecAAOOOaaaaoooouuieecAAOOOaaaaoooouuieec";
			$buscas = b.(html_entity_decode($b,ENT_NOQUOTES,'UTF8')).(html_entity_decode($b,ENT_NOQUOTES,'ISO8859-1'));
			$sopen = $l->open();
			if($sopen == MS_FAILURE){
				return "erro";
			}
			$prjMapa = $this->mapa->getProjection();
			$prjTema = $l->getProjection();
			$ret = $this->mapa->extent;
			if (($prjTema != "") && ($prjMapa != $prjTema))
			{
				$projInObj = ms_newprojectionobj($prjTema);
				$projOutObj = ms_newprojectionobj($prjMapa);
				$status = $ret->project($projInObj, $projOutObj);
				if($status !== MS_SUCCESS){
					$ret = $this->mapa->extent;
				}
			}
			$fr = array();
			if (@$l->queryByrect($ret) == MS_SUCCESS)
			{
				$res_count = $l->getNumresults();
				for ($i = 0; $i < $res_count; ++$i)
				{
					$valitem = array();
					if($this->v == 6){
						$shape = $l->getShape($l->getResult($i));
						$indx = $shape->index;
					}
					else{
						$result = $l->getResult($i);
						$indx  = $result->shapeindex;
						$shape = $l->getfeature($indx,-1);
					}
					$novoreg = array();
					$r = array();
					foreach ($items as $item)
					{
						$v = trim($shape->values[$item]);
						if ($tipo == "exata")
						{
							if ($v == $palavra || (strtr($v,$buscas,$trocas) == strtr($palavra,$buscas,$trocas)))
							{
								if($convC == true)
								{
									$v = $this->converte($v);
								}
								$r[] = array("item" => $item,"valor" => $v);
								$encontrado = "sim";
							}
						}
						else
						{

							if (strtolower($v) == strtolower($palavra) || (stristr(strtr(strtolower($v),$buscas,$trocas),strtr(strtolower($palavra),$buscas,$trocas))))
							{
								if($convC == true){
									$v = $this->converte($v);
								}
								$r[] = array("item" => $item,"valor" => $v);
								$encontrado = "sim";
							}
						}
					}
					if ($encontrado == "sim")
					{
						$ret = $this->extensaoShape($shape,$l);
						if (($prjTema != "") && ($prjMapa != $prjTema))
						{
							$ret->project($projInObj, $projOutObj);
						}
						$novoreg["box"] = $ret;
						$novoreg["valores"] = $r;
						$encontrado = "nao";
						$fr[] = $novoreg;
					}
				}
				$resultado[] = array("tema"=>$tema,"resultado"=>$fr);
			}
			/*
			 $teste = $l->whichShapes($ret);
			if($teste){
			$fr = array();
			while ($shape = $l->nextShape())
			{
			$novoreg = array();
			$r = array();
			foreach ($items as $item)
			{
			$v = trim($shape->values[$item]);
			echo $v;
			if ($tipo == "exata")
			{
			if (strtr($v,$buscas,$trocas) == strtr($palavra,$buscas,$trocas))
			{
			if($convC == true)
			{$v = $this->converte($v);}
			$r[] = array("item" => $item,"valor" => $v);
			$encontrado = "sim";
			}
			}
			else
			{

			if (stristr(strtr($v,$buscas,$trocas),strtr($palavra,$buscas,$trocas)))
			{
			if($convC == true)
			{$v = $this->converte($v);}
			$r[] = array("item" => $item,"valor" => $v);
			$encontrado = "sim";
			}
			}
			}
			if ($encontrado == "sim")
			{
			$ret = $this->extensaoShape($shape,$l);
			if (($prjTema != "") && ($prjMapa != $prjTema))
			{$ret->project($projInObj, $projOutObj);}
			$novoreg["box"] = $ret;
			$novoreg["valores"] = $r;
			$encontrado = "nao";
			$fr[] = $novoreg;
			}
			}
			$resultado[] = array("tema"=>$tema,"resultado"=>$fr);
			$l->close();
			}
			*/
		}
		return($resultado);
	}
	/*
	 function: estatDescritivas

	Calcula estat&iacute;sticas b&aacute;sicas de uma tabela de um tema.

	parameters:
	$item - Item que ser&aacute; calculado.

	$exclui - Valor que n&atilde;o ser&aacute; cosiderado.

	Include:
	<classe_estatistica.php>
	*/
	function estatDescritivas($item,$exclui)
	{
		if(!$this->layer){
			return "erro";
		}
		$this->layer->set("template","none.htm");
		$items = pegaItens($this->layer,$this->mapa);
		$valores = array();
		$filtro = $this->layer->getfilterstring();
		if ($filtro != ""){
			$this->layer->setfilter("");
		}
		//le o arquivo de query se existir e checa se existe sele&ccedil;&atilde;o para o tema
		$shapes = retornaShapesSelecionados($this->layer,$this->arquivo,$this->mapa);
		if(count($shapes) == 0){
			$shapes = retornaShapesMapext($this->layer,$this->mapa);
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
					{
						$valoresn[] = $valor;
					}
				}
				else
				{$valoresn[] = $valor;
				}
			}
		}
		if (count($valoresn) == 0)
		{
			return("erro. Nenhum valor valido");
		}
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
		{
			return("erro. Nenhum valor valido");
		}
		$chaves = array_keys($indice);
		return(array("indices"=>$chaves,"variaveis"=>$indice,"valores"=>$resultado));
	}
	/*
	 identifica

	Depreciado na vers&atilde;o 4.2 (utilize "identifica2")

	Identifica elementos no mapa.

	parameters:
	$opcao - Opcao tip|tema|ligados|todos.

	$xy - coordenada x e y separadas por virgulao.

	$resolucao - Resolucao de busca.
	*/
	function identifica($opcao,$xy,$resolucao)
	{
		$numlayers = $mapa->numlayers;
		for ($i=0;$i < $numlayers;++$i)
		{
			$layer = $mapa->getlayer($i);
			$tem = $l->name;
			$vermultilayer = new vermultilayer();
			$vermultilayer->verifica($this->arquivo,$tem);
			if ($vermultilayer->resultado == 1) // o tema e multi layer
			{
				foreach (($vermultilayer->temasvisiveis) as $tv)
				{
					$l = $this->mapa->getlayerbyname($tv);
					if ($l->getmetadata("identifica") != "nao")
					{
						$listatemas[] = $tv;
					}
				}
			}
			else
			{
				if (($layer->getmetadata("escondido") == "") && ($layer->getmetadata("identifica") != "nao"))
				{
					$listatemas[] = $tem;
				}
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
			{$listatemp = $vermultilayer->temasvisiveis;
			}
			else
			{$listatemp[] = $this->nome;
			}
			foreach ($listatemp as $t)
			{
				$layerteste = $this->mapa->getlayerbyname($t);
				$mclasse = strtoupper($layerteste->getmetadata("CLASSE"));
				$mtema = strtoupper($layerteste->getmetadata("TEMA"));
				$gr = $layerteste->group;
				if ((!(($mclasse == "NAO") && ($mtema == "NAO"))) || ($gr != ""))
				{
					if (($layerteste->data != "") && ($layerteste->connectiontype != MS_WMS))
					{
						$listatemas[] = $t;
					}
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
		{return("");
		}
	}
	/*
	 function: identifica2

	Depreciado na vers&atilde;o 4.7 (utilize "identifica3")

	Identifica elementos no mapa.

	parameters:

	$opcao - Opcao tip|tema|ligados|todos|lista.

	$xy - coordenada x e y separadas por virgulao.

	$resolucao - Resolucao de busca.

	$ext - (opcional) Extens&atilde;o geogr&aacute;fica que ser&aacute; aplicada ao mapa antes da opera&ccedil;&atilde;o de query (xmin ymin xmax ymax)

	$listaDeTemas - (opcional) Lista com os c�digos dos temas que ser&atilde;o identificados - vale apenas se $opcao = lista

	$wkt - (opcional) {boolean} inclui ou n&atilde;o o valor do wkt da geometria
	*/
	function identifica2($opcao,$xy,$resolucao,$ext="",$listaDeTemas="",$wkt="nao")
	{
		if ($opcao != "tema" && $opcao != "tip"){
			if($listaDeTemas != "")
			{
				$listaDeTemas = str_replace(" ",",",$listaDeTemas);
				$temas = explode(",",$listaDeTemas);
			}
			else
			{$temas = $this->mapa->getalllayernames();
			}
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
						{
							$listatemas[] = $tv;
						}
					}
				}
				else
				{
					$l = $this->mapa->getlayerbyname($tem);
					if (($l->getmetadata("escondido") == "") && ($l->getmetadata("identifica") != "nao"))
					{
						$listatemas[] = $tem;
					}
				}
			}
			$listatemas = array_unique($listatemas);
		}
		$xyarray = explode(",",$xy);
		$resultados = array();
		//pesquisa um tema
		if ($opcao == "tema")
		{
			$listatemas = array();
			$vermultilayer = new vermultilayer();
			$vermultilayer->verifica($this->arquivo,$this->nome);
			if ($vermultilayer->resultado == 1) // o tema e multi layer
			{$listatemp = $vermultilayer->temasvisiveis;
			}
			else
			{$listatemp[] = $this->nome;
			}
			foreach ($listatemp as $t)
			{
				$layerteste = $this->mapa->getlayerbyname($t);
				$mclasse = strtoupper($layerteste->getmetadata("CLASSE"));
				$mtema = strtoupper($layerteste->getmetadata("TEMA"));
				$gr = $layerteste->group;
				if ((!(($mclasse == "NAO") && ($mtema == "NAO"))) || ($gr != ""))
				{
					if (($layerteste->data != "") && ($layerteste->connectiontype != MS_WMS) || ($layerteste->tileindex != ""))
					{
						$listatemas[] = $t;
					}
					if($layerteste->connectiontype == MS_OGR)
					{
						$listatemas[] = $t;
					}
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
				$resultados[$tema] = $this->identificaQBP2($tema,$xyarray[0],$xyarray[1],"",$resolucao,"","",false,$ext,$wkt);
			}
		}
		//pesquisa todos os temas acrescentados no mapa
		if ($opcao == "todos")
		{
			foreach ($listatemas as $tema)
			{
				$resultados[$tema] = $this->identificaQBP2($tema,$xyarray[0],$xyarray[1],"",$resolucao,"","",false,$ext,$wkt);
			}
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
					{
						$novalista[] = $tema;
					}
					$listatemas = $novalista;
				}
			}
			foreach ($listatemas as $tema)
			{
				$l = $this->mapa->getlayerbyname($tema);
				$resultados[$tema] = $this->identificaQBP2($tema,$xyarray[0],$xyarray[1],"",$resolucao,"","",false,$ext,$wkt);
			}
			//var_dump($resultados);
		}
		//pesquisa apenas os temas com tip
		if ($opcao == "tip")
		{
			$ltemp = array();
			$numlayers = $this->mapa->numlayers;
			for ($i=0;$i < $numlayers;++$i)
			{
				$tl = $this->mapa->getlayer($i);
				$tema = $tl->name;
				$itemtip = $tl->getmetadata("TIP");
				if ($itemtip != "")
				{
					if ($tl->status == MS_DEFAULT || $listaDeTemas != "")
					{
						$resultados[$tema] = array("tips"=>$itemtip,"dados"=>$this->identificaQBP2($tema,$xyarray[0],$xyarray[1],"",$resolucao,$itemtip,"",true,$ext,$wkt));
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
		{return("");
		}
	}
	/*
	 function: identifica3

	Identifica elementos no mapa.

	parameters:

	$opcao - Opcao tip|tema|ligados|todos|lista.

	$xy - coordenada x e y separadas por virgulao.

	$resolucao - Resolucao de busca.

	$ext - (opcional) Extens&atilde;o geogr&aacute;fica que ser&aacute; aplicada ao mapa antes da opera&ccedil;&atilde;o de query (xmin ymin xmax ymax)

	$listaDeTemas - (opcional) Lista com os c�digos dos temas que ser&atilde;o identificados - vale apenas se $opcao = lista

	$wkt - (opcional) {boolean} inclui ou n&atilde;o o valor do wkt da geometria
	*/
	function identifica3($opcao,$xy,$resolucao,$ext="",$listaDeTemas="",$wkt="nao")
	{
		if ($opcao != "tema" && $opcao != "tip"){
			if($listaDeTemas != ""){
				$listaDeTemas = str_replace(" ",",",$listaDeTemas);
				$temas = explode(",",$listaDeTemas);
			}
			else{
				$temas = $this->mapa->getalllayernames();
			}
			foreach ($temas as $tem){
				$vermultilayer = new vermultilayer();
				$vermultilayer->verifica($this->arquivo,$tem);
				if ($vermultilayer->resultado == 1) {
					foreach (($vermultilayer->temasvisiveis) as $tv){
						$l = $this->mapa->getlayerbyname($tv);
						if ($l->getmetadata("identifica") != "nao")	{
							$listatemas[] = $tv;
						}
					}
				}
				else{
					$l = $this->mapa->getlayerbyname($tem);
					if (($l->getmetadata("escondido") == "") && ($l->getmetadata("identifica") != "nao")){
						$listatemas[] = $tem;
					}
				}
			}
			$listatemas = array_unique($listatemas);
		}
		$xyarray = explode(",",$xy);
		$resultados = array();
		//pesquisa um tema
		if ($opcao == "tema"){
			$listatemas = array();
			$vermultilayer = new vermultilayer();
			$vermultilayer->verifica($this->arquivo,$this->nome);
			// o tema e multi layer
			if ($vermultilayer->resultado == 1){
				$listatemp = $vermultilayer->temasvisiveis;
			}
			else{
				$listatemp[] = $this->nome;
			}
			foreach ($listatemp as $t){
				$layerteste = $this->mapa->getlayerbyname($t);
				$mclasse = strtoupper($layerteste->getmetadata("CLASSE"));
				$mtema = strtoupper($layerteste->getmetadata("TEMA"));
				$gr = $layerteste->group;
				if ((!(($mclasse == "NAO") && ($mtema == "NAO"))) || ($gr != "")){
					if (($layerteste->data != "") && ($layerteste->connectiontype != MS_WMS) || ($layerteste->tileindex != "")){
						$listatemas[] = $t;
					}
					if($layerteste->connectiontype == MS_OGR){
						$listatemas[] = $t;
					}
				}
			}
			$layerteste = $this->layer;
			if ($layerteste->connectiontype == MS_WMS){
				$listatemas = array();
				$listatemas[] = $this->nome;
			}
			foreach ($listatemas as $tema){
				$resultados[$tema] = $this->identificaQBP3($tema,$xyarray[0],$xyarray[1],"",$resolucao,"","",false,$ext,$wkt);
			}
		}
		//pesquisa todos os temas acrescentados no mapa
		if ($opcao == "todos"){
			foreach ($listatemas as $tema){
				$resultados[$tema] = $this->identificaQBP3($tema,$xyarray[0],$xyarray[1],"",$resolucao,"","",false,$ext,$wkt);
			}
		}
		//pesquisa apenas os temas visiveis
		if ($opcao == "ligados" || $opcao == "lista"){
			if($opcao == "ligados"){
				$novalista = array();
				foreach ($listatemas as $tema){
					$l = $this->mapa->getlayerbyname($tema);
					if($l->status == MS_DEFAULT){
						$novalista[] = $tema;
					}
					$listatemas = $novalista;
				}
			}
			foreach ($listatemas as $tema){
				$l = $this->mapa->getlayerbyname($tema);
				$resultados[$tema] = $this->identificaQBP3($tema,$xyarray[0],$xyarray[1],"",$resolucao,"","",false,$ext,$wkt);
			}
			//var_dump($resultados);
		}
		//pesquisa apenas os temas com tip
		if ($opcao == "tip"){
			$ltemp = array();
			$numlayers = $this->mapa->numlayers;
			for ($i=0;$i < $numlayers;++$i)	{
				$tl = $this->mapa->getlayer($i);
				$tema = $tl->name;
				$itemtip = $tl->getmetadata("TIP");
				if ($itemtip != ""){
					if ($tl->status == MS_DEFAULT || $listaDeTemas != ""){
						$r = $this->identificaQBP3($tema,$xyarray[0],$xyarray[1],"",$resolucao,$itemtip,"",true,$ext,$wkt);
						$resultados[$tema] = array("todosItens"=>$r["itensLayer"],"tips"=>$itemtip,"dados"=>$r["resultado"]);
						$ltemp[] = $tema;
					}
				}
			}
			$listatemas = $ltemp;
		}
		if (count($resultados) > 0)	{
			$res = $this->retornaI2($listatemas,$resultados,$this->mapa);
			return($res);
		}
		else{
			return("");
		}
	}
	/*
	 function: retornaI2

	Processa o resultado da identifica&ccedil;&atilde;o de um elemento compondo um array de strings formatadas.

	parameters:

	$listatemas - Lista de temas

	$resultados - Resultados de cada tema.

	$map - Objeto Map.
	*/
	function retornaI2($listatemas,$resultados,$map)
	{
		$final = array();
		foreach ($listatemas as $tema){
			//para dados que sao oriundos do METAESTAT
			$editavel = "";
			$colunaidunico = "";
			$id_medida_variavel = "";
			//
			$layer = $map->getlayerbyname($tema);
			$nometmp = $tema;
			if (strtoupper($layer->getMetaData("TEMA")) != "NAO"){
				$nometmp = $layer->getMetaData("TEMA");
			}
			else if ($layer->getMetaData("ALTTEMA") != ""){
				$nometmp = $layer->getMetaData("ALTTEMA");
			}
			$nometmp = $this->converte($nometmp);
			//identificador que marca o tipo de dados que podem ser salvos
			$tiposalva = "";
			//verifica se e editavel
			if($layer->getmetadata("EDITAVEL") == "SIM"){
				//verifica login
				session_write_close();
				session_name("i3GeoLogin");
				if(!empty($_COOKIE["i3geocodigologin"])){
					session_id($_COOKIE["i3geocodigologin"]);
					session_start();
					//verifica usuario
					if($_SESSION["usuario"] == $_COOKIE["i3geousuariologin"]){
						//verifica se e administrador
						foreach($_SESSION["papeis"] as $p){
							if($p == 1){
								$editavel = "sim";
							}
						}
						//verifica operacao
						if(!empty($_SESSION["operacoes"]["admin/metaestat/geral"])){
							$editavel = "sim";
						}
						if($editavel == "sim"){

							$editavel = "nao";
							$id_medida_variavel = $layer->getMetaData("METAESTAT_ID_MEDIDA_VARIAVEL");
							$colunaidunico = $layer->getMetaData("COLUNAIDUNICO");


							if($id_medida_variavel != ""){
								include_once(dirname(__FILE__)."/../admin/php/classe_metaestat.php");
								$m = new Metaestat();
								$medidaVariavel = $m->listaMedidaVariavel("",$id_medida_variavel);
								$editavel = $medidaVariavel["colunavalor"];
								$tiposalva = "medida_variavel";
							}
							if($codigo_tipo_regiao != ""){
								include_once(dirname(__FILE__)."/../admin/php/classe_metaestat.php");
								$m = new Metaestat();
								$regiao = $m->listaTipoRegiao($codigo_tipo_regiao);
								//todas as colunas podem ser alteradas
								$editavel = "todos";
								$tiposalva = "regiao";
							}
							//verifica se os parametros de edicao estao disponiveis, pois podem ter sido definidos pelo sistema de administracao
							if($layer->getMetaData("ESQUEMATABELAEDITAVEL") != "" && $layer->getMetaData("TABELAEDITAVEL") != "" && $layer->getMetaData("COLUNAIDUNICO") != ""){
								$editavel = "todos";
								$tiposalva = "regiao";
							}
						}
					}
				}
			}
			$codigo_tipo_regiao = $layer->getMetaData("METAESTAT_CODIGO_TIPO_REGIAO");
			$final[] = array("tema"=>$tema,"tiposalva"=>$tiposalva,"nome"=>$nometmp,"resultado"=>$resultados[$tema],"editavel"=>$editavel,"colunaidunico"=>$colunaidunico,"id_medida_variavel"=>$id_medida_variavel,"codigo_tipo_regiao"=>$codigo_tipo_regiao);
		}
		return $final;
	}

	/*
	 function: retornaI

	Depreciado na vers&atilde;o 4.2

	Processa o resultado da identifica&ccedil;&atilde;o de um elemento compondo um array de strings formatadas.

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
			{
				$nometmp = $layer->getMetaData("TEMA");
			}
			else if ($layer->getMetaData("ALTTEMA") != "")
			{
				$nometmp = $layer->getMetaData("ALTTEMA");
			}
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
					{
						$final = $final . $f;
					}
				}
			}
		}
		return $final;
	}
	/*
	 function: identificaQBP

	Depreciado na vers&atilde;o 4.2

	Identifica um elemento utilizando querybypoint.

	parameters:

	$tema - Tema que ser&aacute; identificado

	$x - Coordenada X.

	$y - Coordenada Y.

	$map_file - Arquivo map file.

	$resolucao - Resolu&ccedil;&atilde;o de busca.

	$item - Item &uacute;nico que ser&aacute; identificado.

	$tiporetorno - Tipo de retorno dos dados. Se for vazio, o retorno &eacute; formatado como string, se for shape, retorna o objeto shape
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
		//opera&ccedil;&atilde;o especial para o caso de wms
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
				if ($formatosinfo[0] != ""){
					$formatoinfo = $formatosinfo[0];
				}
				foreach ($formatosinfo as $f)
				{
					if(strtoupper($f) == "TEXT/PLAIN")
					{
						$formatoinfo = "text/plain";
					}
				}

			}
			$srs = $layer->getmetadata("wms_srs");
			$srss = explode(" ",$srs);
			$srs = "EPSG:4326";
			foreach ($srss as $s)
			{
				if(strtoupper($s) == "EPSG:4618")
				{
					$srs = "EPSG:4618";
				}
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
			{$its = $item;
			}
			if ($its != "")
			{
				$descis = $layer->getmetadata("ITENSDESC"); // descri&ccedil;&atilde;o dos itens
				$descisarray = explode(",",$descis); // array com a descri&ccedil;&atilde;o dos itens
				$itsarray = explode(",",$its); // array com os nomes dos itens
				$lks = $layer->getmetadata("ITENSLINK"); // link dos itens
				$itemimg = $layer->getmetadata("ITEMIMG"); //indica um item que ser&aacute; utilizado para colocar um &iacute;cone
				$locimg = $layer->getmetadata("IMGLOC"); //indica o local onde est&atilde;o os &iacute;cones
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
			if($sopen == MS_FAILURE){
				return "erro";
			}
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
					if ($val == ""){
						$val = "-";
					}
					if(!@$lksarray[$conta]){
						$lksarray[$conta] = "";
					}
					if ($lksarray[$conta] == "") //descricao,valor,link
					{
						if(!@$descisarray[$conta]){
							$descisarray[$conta] = "";
						}
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
		{$resultado[] = " ";
		}
		return $resultado;
	}
	/*
	 function: identificaQBP2

	Depreciado na vers&atilde;o 4.2

	Identifica um elemento utilizando querybypoint.

	parameters:

	$tema - Tema que ser&aacute; identificado (se for vazio, ser&aacute; utilizado o objeto mapa definido no construtor da classe)

	$x - Coordenada X.

	$y - Coordenada Y.

	$map_file - Arquivo map file (se for vazio, ser&aacute; utilizado o objeto mapa definido no construtor da classe).

	$resolucao - Resolu&ccedil;&atilde;o de busca.

	$item - Item &uacute;nico que ser&aacute; identificado.

	$tiporetorno - Tipo de retorno dos dados. Se for vazio, o retorno &eacute; formatado como string, se for shape, retorna o objeto shape, googlerelevo retorna no padr&atilde;o da API do google para relevo

	$etip  {booblean} - indica se a solicita&ccedil;&atilde;o &eacute; para obten&ccedil;&atilde;o dos dados do tipo etiqueta
	*/
	function identificaQBP2($tema="",$x=0,$y=0,$map_file="",$resolucao=0,$item="",$tiporetorno="",$etip=false,$ext="",$wkt="nao")
	{
		if($map_file == "")
		{
			$mapa = $this->mapa;
			$map_file = $this->arquivo;
		}
		else
		{$mapa = ms_newMapObj($map_file);
		}

		if($ext != ""){
			$extmapa = $mapa->extent;
			$e = explode(" ",$ext);
			$extmapa->setextent((min($e[0],$e[2])),(min($e[1],$e[3])),(max($e[0],$e[2])),(max($e[1],$e[3])));
		}
		if($tema == "")
		{
			$layer = $this->layer;
		}
		else
		{$layer = $mapa->getLayerByName($tema);
		}
		$layer->set("status",MS_DEFAULT);
		$layer->set("template","none.htm");
		$pt = ms_newPointObj();
		$pt->setXY($x, $y);
		if(strtoupper($layer->getmetadata("convcaracter")) == "NAO")
		{
			$convC = false;
		}
		else
		{$convC = true;
		}
		//
		//opera&ccedil;&atilde;o especial para o caso de wms
		//
		if($layer->connectiontype == MS_WMS)
		{
			$wkt = "nao";
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
				if ($formatosinfo[0] != ""){
					$formatoinfo = $formatosinfo[0];
				}
				foreach ($formatosinfo as $f)
				{
					if(strtoupper($f) == "TEXT/PLAIN")
					{
						$formatoinfo = "text/plain";
					}
				}
			}
			else
			{
				$formatoinfo = $layer->getmetadata("wms_feature_info_type");
				if($formatoinfo == "")
				{
					$formatoinfo = $layer->getmetadata("wms_feature_info_mime_type");
				}
				if($formatoinfo == "")
				{
					$formatoinfo = "text/plain";
				}
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
						if($convC == true)
						{
							$va = $this->converte($va);
						}
						$n[] = array("alias"=>trim($t[0]),"valor"=>$va,"link"=>"","img"=>"");
					}
				}
				//caso esri
				if($n[0] == "")
				{
					//error_reporting(0);
					$resposta = file($res);
					$cabecalho = str_replace('"   "','"|"',$resposta[0]);
					$cabecalho = explode("|",$cabecalho);

					$linha = str_replace('"  "','"|"',$resposta[1]);
					$linha = explode("|",$linha);
					for($i=0;$i < count($cabecalho);++$i)
					{
						if($convC == true)
						{
							$va = $this->converte($linha[$i]);
						}
						else
						{$va = $linha[$i];
						}
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
		$itemimg = $layer->getmetadata("ITEMIMG"); //indica um item que ser&aacute; utilizado para colocar um &iacute;cone
		$locimg = $layer->getmetadata("IMGLOC"); //indica o local onde est&atilde;o os &iacute;cones
		$tips = $layer->getmetadata("TIP");
		$itensLayer = pegaItens($layer,$mapa);
		$nitens = count($itensLayer);
		if($itens == "")
		{
			$itens = $itensLayer;
		}
		else
		{$itens = explode(",",$itens);
		}

		if($itensdesc == "")
		{
			$itensdesc = $itensLayer;
		}//array_fill(0, $nitens-1,'');}
		else
		{$itensdesc = explode(",",$itensdesc);
		}

		if($lks == "")
		{
			$lks = array_fill(0, $nitens-1,'');
		}
		else
		{$lks = explode(",",$lks);
		}

		if($itemimg == "")
		{
			$itemimg = array_fill(0, $nitens-1,'');
		}
		else
		{$itemimg = explode(",",$itemimg);
		}

		if($locimg == "")
		{
			$locimg = array_fill(0, $nitens-1,'');
		}
		else
		{$locimg = explode(",",$locimg);
		}
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
				if($temp[$t] != ""){
					$itensdesc[] = $temp[$t];
				}else{$itensdesc[] = $t;
				}
				if($templ[$t] != ""){
					$lks[] = $templ[$t];
				}else{$lks[] = "";
				}
				if($tempimg[$t] != ""){
					$itemimg[] = $tempimg[$t];
				}else{$itemimg[] = "";
				}
				if($temploc[$t] != ""){
					$locimg[] = $temploc[$t];
				}else{$locimg[] = "";
				}
			}
		}
		if(($layer->connectiontype != MS_WMS) && ($layer->type == MS_LAYER_RASTER))
		{
			$wkt = "nao";
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
			if(strtoupper($layer->getmetadata("convcaracter")) == "NAO")
			{
				$convC = false;
			}
			else
			{$convC = true;
			}
			if($sopen == MS_FAILURE){
				return "erro";
			}
			for ($i = 0; $i < $res_count; ++$i)
			{
				$valori = array();
				if($this->v == 6)
				{
					$shape = $layer->getShape($layer->getResult($i));
				}
				else{
					$result = $layer->getResult($i);
					$shp_index  = $result->shapeindex;
					$shape = $layer->getfeature($shp_index,-1);
				}
				$conta = 0;
				//var_dump($itens);exit;
				if($tiporetorno == "shape" || $tiporetorno == "googlerelevo"){
					if($tiporetorno == "shape")
					{
						$resultado[] = $shape;
					}
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
					{
						$resultado[] = $shape->values[$item];
					}
					else{
						foreach ($itens as $it)
						{
							$val = $shape->values[$it];
							if($convC == true)
							{
								$val = $this->converte($val);
							}
							$link = $lks[$conta];
							foreach($itens as $t)
							{
								$valtemp = $shape->values[$t];
								$busca = '['.$t.']';
								$link = str_replace($busca,$valtemp,$link);
							}
							$img = "";
							if($locimg[$conta] != "" && $itemimg[$conta] != "")
							{
								$img = "<img src='".$locimg[$conta]."//".$shape->values[$itemimg[$conta]]."' //>";
							}
							else
								if($itemimg[$conta] != "")
								{
									$img = "<img src='".$shape->values[$itemimg[$conta]]."' //>";
								}
								//indica se o item &eacute; tbm uma etiqueta
								$etiqueta = "nao";
								if(in_array($it,$tips))
								{
									$etiqueta = "sim";
								}
								if($wkt == "sim"){
									$wkt = $shape->towkt();
								}
								$arraytemp = array(
										"alias"=>$this->converte($itensdesc[$conta]),
										"valor"=>$val,
										"link"=>$link,
										"img"=>$img,
										"tip"=>$etiqueta,
										"wkt"=>$wkt
								);
								if($etip==false)
								{
									$valori[] = $arraytemp;
								}
								else
								{$valori[$it] = $arraytemp;
								}
								$conta = $conta + 1;
						}
						$resultado[] = $valori;
					}
				}
			}
			$layer->close();
		}
		else
		{$resultado[] = " ";
		}
		return $resultado;
	}
	/*
	 function: identificaQBP3

	Depreciado na vers&atilde;o 4.2

	Identifica um elemento utilizando querybypoint.

	parameters:

	$tema - Tema que ser&aacute; identificado (se for vazio, ser&aacute; utilizado o objeto mapa definido no construtor da classe)

	$x - Coordenada X.

	$y - Coordenada Y.

	$map_file - Arquivo map file (se for vazio, ser&aacute; utilizado o objeto mapa definido no construtor da classe).

	$resolucao - Resolu&ccedil;&atilde;o de busca.

	$item - Item &uacute;nico que ser&aacute; identificado.

	$tiporetorno - Tipo de retorno dos dados. Se for vazio, o retorno &eacute; formatado como string, se for shape, retorna o objeto shape, googlerelevo retorna no padr&atilde;o da API do google para relevo

	$etip  {booblean} - indica se a solicita&ccedil;&atilde;o &eacute; para obten&ccedil;&atilde;o dos dados do tipo etiqueta
	*/
	function identificaQBP3($tema="",$x=0,$y=0,$map_file="",$resolucao=0,$item="",$tiporetorno="",$etip=false,$ext="",$wkt="nao"){
		if($map_file == ""){
			$mapa = $this->mapa;
			$map_file = $this->arquivo;
		}
		else{
			$mapa = ms_newMapObj($map_file);
		}
		if($ext != ""){
			$extmapa = $mapa->extent;
			$e = explode(" ",$ext);
			$extmapa->setextent((min($e[0],$e[2])),(min($e[1],$e[3])),(max($e[0],$e[2])),(max($e[1],$e[3])));
			//$mapa->save($this->arquivo);
		}
		if($tema == ""){
			$layer = $this->layer;
		}
		else{
			$layer = $mapa->getLayerByName($tema);
		}
		$layer->set("status",MS_DEFAULT);
		$layer->set("template","none.htm");
		$pt = ms_newPointObj();
		$pt->setXY($x, $y);
		if(strtoupper($layer->getmetadata("convcaracter")) == "NAO"){
			$convC = false;
		}
		else{
			$convC = true;
		}
		//
		//opera&ccedil;&atilde;o especial para o caso de wms
		//
		if($layer->connectiontype == MS_WMS){
			$wkt = "nao";
			$layer->set("toleranceunits",MS_PIXELS);
			$layer->set("tolerance",$resolucao);
			$mapa = desligatemas($mapa);
			$mapa = desligamargem($mapa);
			$imgo = $mapa->draw();
			$ptimg = xy2imagem($map_file,array($x,$y),$mapa);
			//$formatoinfo = "MIME";
			$formatosinfo = $layer->getmetadata("formatosinfo");
			if ($formatosinfo != ""){
				$formatosinfo = explode(",",$formatosinfo);
				if ($formatosinfo[0] != ""){
					$formatoinfo = $formatosinfo[0];
				}
				foreach ($formatosinfo as $f){
					if(strtoupper($f) == "TEXT/PLAIN"){
						$formatoinfo = "text/plain";
					}
				}
			}
			else{
				$formatoinfo = $layer->getmetadata("wms_feature_info_type");
				if($formatoinfo == ""){
					$formatoinfo = $layer->getmetadata("wms_feature_info_mime_type");
				}
				if($formatoinfo == ""){
					$formatoinfo = "text/plain";
				}
			}
			$res = $layer->getWMSFeatureInfoURL($ptimg->x, $ptimg->y, 1,$formatoinfo);
			$res = str_replace("INFOFORMAT","INFO_FORMAT",$res);
			$res2 = $layer->getWMSFeatureInfoURL($ptimg->x, $ptimg->y, 1,"MIME");
			$res2 = str_replace("INFOFORMAT","INFO_FORMAT",$res2);

			$resposta = file($res);
			//var_dump($resposta);exit;

			$n = array();
			if(strtoupper($formatoinfo) != "TEXT/HTML" && strtoupper($formatoinfo) != "MIME"){
				foreach($resposta as $r){
					$t = explode("=",$r);
					if(count($t) > 1){
						$v = str_replace("\\n","",$t[1]);
						$v = str_replace("\\r","",$v);
						if(trim($v) != ""){
							$va = trim($v);
							if($convC == true){
								$va = $this->converte($va);
							}
							$n[] = array("alias"=>trim($t[0]),"valor"=>$va,"link"=>"","img"=>"");
						}
					}
				}
				//caso esri
				if(count($n) > 0 && $n[0] == ""){
					//error_reporting(0);
					$resposta = file($res);
					$cabecalho = str_replace('"   "','"|"',$resposta[0]);
					$cabecalho = explode("|",$cabecalho);

					$linha = str_replace('"  "','"|"',$resposta[1]);
					$linha = explode("|",$linha);
					for($i=0;$i < count($cabecalho);++$i){
						if($convC == true){
							$va = $this->converte($linha[$i]);
						}
						else{
							$va = $linha[$i];
						}
						$n[] = array("alias"=>$cabecalho[$i],"valor"=>$va,"link"=>"","img"=>"");
					}
				}
			}
			//var_dump($n);exit;
			if(count($n) == 0){
				$formatoinfo = "MIME";
			}
			if(strtoupper($formatoinfo) == "TEXT/HTML" && $res != ""){
				$n[] = array("alias"=>"","valor"=>"<iframe width=250px src='".$res."'></iframe>","link"=>"","img"=>"");
			}
			if(strtoupper($formatoinfo) == "MIME" && $res2 != ""){
				$n[] = array("alias"=>"","valor"=>"<iframe width=250px src='".$res2."'></iframe>","link"=>"","img"=>"");
			}
			if($res != ""){
				$n[] = array("alias"=>"Link WMS","valor"=>"getfeatureinfo ".$formatoinfo,"link"=>$res,"img"=>"");
			}
			if($res2 != ""){
				$n[] = array("alias"=>"Link WMS","valor"=>"getfeatureinfo padr&atilde;o do servi&ccedil;o","link"=>$res2,"img"=>"");
			}
			if($res == "" && $res2 == ""){
				$n[] = array("alias"=>"Ocorreu um erro","valor"=>"","link"=>"","img"=>"");
			}
			return array($n);
		}
		//se o usuario estiver logado e o tema for editavel, a lista de itens
		//nao usa os alias para permitir a edicao dos dados
		if(!empty($_COOKIE["i3geocodigologin"]) && $layer->getmetadata("EDITAVEL") == "SIM"){
			$itens = "";
			$itensdesc = "";
			$lks = "";
			$itemimg = "";
			$locimg = "";
		}
		else{
			$itens = $layer->getmetadata("ITENS"); // itens
			$itensdesc = $layer->getmetadata("ITENSDESC"); // descri&ccedil;&atilde;o dos itens
			$lks = $layer->getmetadata("ITENSLINK"); // link dos itens
			$itemimg = $layer->getmetadata("ITEMIMG"); //indica um item que ser&aacute; utilizado para colocar um &iacute;cone
			$locimg = $layer->getmetadata("IMGLOC"); //indica o local onde est&atilde;o os &iacute;cones
		}
		$tips = $layer->getmetadata("TIP");
		$itensLayer = pegaItens($layer,$mapa);
		$nitens = count($itensLayer);
		if($itens == ""){
			$itens = $itensLayer;
		}
		else{
			$itens = explode(",",$itens);
		}

		if($itensdesc == ""){
			$itensdesc = $itensLayer;
		}//array_fill(0, $nitens-1,'');}
		else{
			$itensdesc = explode(",",$itensdesc);
		}

		if($lks == ""){
			$lks = array_fill(0, $nitens-1,'');
		}
		else{
			$lks = explode(",",$lks);
		}

		if($itemimg == ""){
			$itemimg = array_fill(0, $nitens-1,'');
		}
		else{
			$itemimg = explode(",",$itemimg);
		}

		if($locimg == ""){
			$locimg = array_fill(0, $nitens-1,'');
		}
		else{
			$locimg = explode(",",$locimg);
		}
		$tips = str_replace(" ",",",$tips);
		$tips = explode(",",$tips);
		//o retorno deve ser do tipo TIP
		if($etip == true){
			$temp = array_combine($itens,$itensdesc);
			$templ = array_combine($itens,$lks);
			$tempimg = array_combine($itens,$itemimg);
			$temploc = array_combine($itens,$locimg);
			$itensdesc = array();
			$itens = array();
			$lks = array();
			$itemimg = array();
			$locimg = array();
			//foreach($tips as $t){
			foreach($itensLayer as $t){
				$itens[] = $t;
				if($temp[$t] != ""){
					$itensdesc[] = $temp[$t];
				}
				else{
					$itensdesc[] = $t;
				}
				if($templ[$t] != ""){
					$lks[] = $templ[$t];
				}
				else{
					$lks[] = "";
				}
				if($tempimg[$t] != ""){
					$itemimg[] = $tempimg[$t];
				}
				else{
					$itemimg[] = "";
				}
				if($temploc[$t] != ""){
					$locimg[] = $temploc[$t];
				}
				else{
					$locimg[] = "";
				}
			}
		}
		if(($layer->connectiontype != MS_WMS) && ($layer->type == MS_LAYER_RASTER)){
			$wkt = "nao";
			$layer->set("toleranceunits",MS_PIXELS);
			$layer->set("tolerance",$resolucao);
			$ident = @$layer->queryByPoint($pt, 0, 0); //0.01);
		}
		if (($layer->type == MS_LAYER_POINT) || ($layer->type == MS_LAYER_LINE) || ($layer->type == MS_LAYER_CHART)){
			$layer->set("toleranceunits",MS_PIXELS);
			$layer->set("tolerance",$resolucao);
			$ident = @$layer->queryByPoint($pt, 1, -1); //0.01);
		}
		if ($layer->type == MS_LAYER_POLYGON){
			$layer->set("toleranceunits",MS_PIXELS);
			$layer->set("tolerance",$resolucao);
			$ident = @$layer->queryByPoint($pt, 1, -1);
		}

		if ($ident == MS_SUCCESS){
			//$ident = @$layer->queryByPoint($pt, 1, -1);
			//verifica se o layer e editavel no sistema METAESTAT
			$editavel = "nao";
			//
			$sopen = $layer->open();
			$res_count = $layer->getNumresults();
			if(strtoupper($layer->getmetadata("convcaracter")) == "NAO"){
				$convC = false;
			}
			else{
				$convC = true;
			}
			if($sopen == MS_FAILURE){
				return "erro";
			}
			for ($i = 0; $i < $res_count; ++$i)	{
				$valori = array();
				if($this->v == 6){
					$shape = $layer->getShape($layer->getResult($i));
				}
				else{
					$result = $layer->getResult($i);
					$shp_index  = $result->shapeindex;
					$shape = $layer->getfeature($shp_index,-1);
				}
				$conta = 0;
				//var_dump($itens);exit;
				if($tiporetorno == "shape" || $tiporetorno == "googlerelevo"){
					if($tiporetorno == "shape"){
						$resultado[] = $shape;
					}
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
					if($etip == false && $item != ""){
						$resultado[] = $shape->values[$item];
					}
					else{
						//var_dump($itens);exit;
						foreach ($itens as $it){
							$val = $shape->values[$it];
							if($convC == true){
								$val = $this->converte($val);
							}
							$link = $lks[$conta];
							foreach($itens as $t){
								$valtemp = $shape->values[$t];
								$busca = '['.$t.']';
								$link = str_replace($busca,$valtemp,$link);
							}
							$img = "";
							if($locimg[$conta] != "" && $itemimg[$conta] != "")	{
								$img = "<img src='".$locimg[$conta]."//".$shape->values[$itemimg[$conta]]."' //>";
							}
							else{
								if($itemimg[$conta] != ""){
									$img = "<img src='".$shape->values[$itemimg[$conta]]."' //>";
								}
							}
							//indica se o item &eacute; tbm uma etiqueta
							$etiqueta = "nao";
							if(in_array($it,$tips)){
								$etiqueta = "sim";
							}
							$arraytemp = array(
									"item"=>$it,
									"alias"=>$this->converte($itensdesc[$conta]),
									"valor"=>$val,
									"link"=>$link,
									"img"=>$img,
									"tip"=>$etiqueta
									//"wkt"=>$wkt
							);
							if($etip==false){
								$valori[] = $arraytemp;
							}
							else{
								$valori[$it] = $arraytemp;
							}
							$conta = $conta + 1;
						}
						if($wkt == "sim"){
							$arraytemp = array(
									"alias"=>"wkt",
									"valor"=>$shape->towkt(),
									"link"=>"",
									"img"=>"",
									"tip"=>""
							);
							$valori[] = $arraytemp;
						}
						$resultado[] = $valori;
					}
				}
			}
			$layer->close();
		}
		else{
			$resultado[] = " ";
		}
		if($etip == true){
			return array("resultado"=>$resultado,"itensLayer"=>$itensLayer);
		}
		else{
			return $resultado;
		}
	}
	/*
	 Function: converte

	Converte uma string de ISO-8859-1 para UTF-8

	Parametro:

	$texto - string que ser&aacute; convertida

	Return:

	{string}
	*/
	function converte($texto)
	{
		if (function_exists("mb_convert_encoding"))
		{
			if (!mb_detect_encoding($texto,"UTF-8",true))
			{
				$texto = mb_convert_encoding($texto,"UTF-8","ISO-8859-1");
			}
		}
		return $texto;
	}
}
?>