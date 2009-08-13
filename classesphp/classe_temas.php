<?php
/*
Title: classe_temas.php

Manipulação de temas.

Adiciona, remove, muda ordem, etc.

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

i3geo/classesphp/classe_temas.php
*/
/*
Classe: Temas
*/
class Temas
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
	Variavel: $grupo
	
	Array com os temas do grupo, se houver
	*/
	protected $grupo;
	/*
	Variavel: $visiveis
	
	Temas do grupo que são visíveis em função da escala
	*/
	protected $visiveis;
	/*
	Variavel: $indices
	
	Indices dos layers do grupo
	*/
	protected $indices;	 
/*
function __construct

Cria um objeto map e seta a variavel tema 

parameters:
$map_file - Endereço do mapfile no servidor. 

$tema - nome do tema que será processado
*/
	function __construct($map_file,$tema=null,$locaplic="")
	{
  		//error_reporting(E_ALL);
  		if(file_exists($locaplic."/funcoes_gerais.php"))
  		include_once($locaplic."/funcoes_gerais.php");
  		else
  		include_once("funcoes_gerais.php");
  		$this->locaplic = $locaplic;
  		$this->mapa = ms_newMapObj($map_file);
  		$this->arquivo = $map_file;
  		if($tema != "" && @$this->mapa->getlayerbyname($tema))
  		{
  			$this->layer = $this->mapa->getlayerbyname($tema);
  			$this->nome = $tema;
			$vermultilayer = new vermultilayer();
			$vermultilayer->verifica($map_file,$tema);
			if ($vermultilayer->resultado == 1) // o tema e multi layer
			{$ls = $vermultilayer->temas;}
			else
			{$ls[] = $tema;}
			$this->grupo = $ls;
			$this->visiveis = $vermultilayer->temasvisiveis;
			foreach ($ls as $l)
			{
				$t = $this->mapa->getlayerbyname($l);
				$this->indices[] = $t->index;
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
	  	$this->mapa->save($this->arquivo);
	}
/*
function: aplicaProcessos

Aplica processos em um tema do tipo imagem

parameter:
$lista - lista de processos separados por |
*/
	function aplicaProcessos($lista)
	{
		if(!$this->layer){return "erro";}
		if ($this->layer->num_processing > 0)
		{$this->layer->clearProcessing();}
		//$lista = str_replace('"',"",$lista);
		$lista = explode("|",$lista);
		foreach ($lista as $processo)
		{$this->layer->setprocessing($processo);}
		return("ok");
	}
/*
function: gravaImagemCorpo (depreciado)

Grava a imagem do mapa atual

return:
Nome da imagem gravada
*/
	function gravaImagemCorpo()
	{
	 	$imgo = $this->mapa->draw();
		$nome = ($imgo->imagepath).nomeRandomico().".png";
		$imgo->saveImage($nome);
		return ($imgo->imageurl).basename($nome);
	}
/*
function: geraDestaque

Gera uma imagem para destaque.

Gera a imagem desenhando apenas um tema na resolução atual.
*/
	function geraDestaque()
	{
		desligatemas($this->mapa);
		foreach ($this->grupo as $l)
		{
			$l = $this->mapa->getlayerbyname($l);
			$l->set("status",MS_DEFAULT);
		}
		$i = gravaImagemMapa($this->mapa);
		return $i["url"];
	}		
/*
function: alteraRepresentacao

Altera a representacao de um tema.

Temas poligonais são transformados em lineares, e lineares em poligonais.
A mudança é feita apenas na representação do layer.
*/
	function alteraRepresentacao()
	{
		$retorno = "ok";
		foreach ($this->grupo as $l)
		{
			$l = $this->mapa->getlayerbyname($l);
			if (($l->type == 1) || ($l->type == MS_LAYER_LINE)) //se for do tipo linear
			{$l->set("type",MS_LAYER_POLYGON);}
			elseif (($l->type == 2) || ($l->type == MS_LAYER_POLYGON)) //se for do tipo poligonal
			{$l->set("type",MS_LAYER_LINE);}
			if (($l->type < 1) || ($l->type > 2))
			{$retorno = "erro. O tipo desse tema nao pode ser alterado";}
		}
		return $retorno;
	}
/*
function: desceTema

Desce um tema na ordem de desenho.

Altera a ordem de armazenamento dos layers no mapfile.
*/
	function desceTema()
	{
		if (file_exists(($this->arquivo)."qy"))
		{unlink (($this->arquivo)."qy");}
		$nl = $this->mapa->numlayers;
		$mover = 1;
		$indice = $this->indices[0];
		if ($indice < $nl)
		{
			$conta = $indice - 1;
			$tmpl = $this->mapa->getlayer($conta);
			if (($tmpl->getmetadata("escondido") != ""))
			{
				$mover = $mover + 1;
				$conta = $conta - 1;
			}
			$tmpl = $this->mapa->getlayer($conta);
			if (($tmpl->group) <> "")
			{
				$gr = $tmpl->group;
				$conta = $conta - 1;
				$tmpl = $this->mapa->getlayer($conta);
				while($gr == $tmpl->group)
				{
					$mover= $mover + 1;
					$conta = $conta - 1;
					$tmpl = $this->mapa->getlayer($conta);
				}
			}
		}
		foreach ($this->indices as $indice)
		{
			for ($i=0;$i<$mover;++$i)
			{$moveu = $this->mapa->moveLayerUp($indice);}
		}
		if ($moveu == MS_TRUE)
		{return "ok";}
		else
		{return "erro. Nao foi possivel mover o tema";}
	}
/*
function: sobeTema

Sobe um tema na ordem de desenho.
Altera a ordem de armazenamento dos layers no mapfile.
*/
	function sobeTema()
	{
		if (file_exists(($this->arquivo)."qy"))
		{unlink (($this->arquivo)."qy");}
		$nl = $this->mapa->numlayers;
		$mover = 1;
		$indices = array_reverse($this->indices);
		$indice = $indices[0];
		if ($indice < ($nl - 1))
		{
			$conta = $indice + 1;
			$tmpl = $this->mapa->getlayer($conta);
			if (($tmpl->getmetadata("escondido") != ""))
			{
				$mover = $mover + 1;
				$conta = $conta + 1;
			}
			$tmpl = $this->mapa->getlayer($conta);
			if (($tmpl->group) <> "")
			{
				$gr = $tmpl->group;
				$conta = $conta + 1;
				$tmpl = $this->mapa->getlayer($conta);
				while($gr == $tmpl->group)
				{
					$mover= $mover + 1;
					$conta = $conta + 1;
					$tmpl = $this->mapa->getlayer($conta);
				}
			}
		}
		foreach ($indices as $indice)
		{
			for ($i=0;$i<$mover;++$i)
			{$moveu = $this->mapa->moveLayerDown($indice);}
		}
		if ($moveu == MS_TRUE)
		{return "ok";}
		else
		{return "erro. Nao foi possivel mover o tema";}
	}
/*
function: reordenatemas

Reordena os temas baseados em uma lista com a nova ordem.

Parametros:

lista - lista com a nova ordem para os temas. A lista contém os nomes dos temas separados por vírgula.
*/
	function reordenatemas($lista)
	{
		$nlayers = $this->mapa->numlayers;
		$lista = explode(",",$lista);
		$lista = array_reverse($lista);
		$novaordem = array();
		foreach ($lista as $l)
		{
			for ($i=0;$i<$nlayers;++$i)
			{
				$la = $this->mapa->getlayer($i);
				if($la->getmetadata("escondido") != "")
				{
					if (!in_array($la->index,$novaordem))
					$novaordem[] = $i;
				}
				else
				{
					$g = strtoupper($la->group);
					$n = strtoupper($la->name);
					if ((strtoupper($l) == $n) || (strtoupper($l) == $g))
					{$novaordem[] = $i;}
				}
			}
		}
		for ($i=0;$i<$nlayers;++$i)
		{
			if (!in_array($i,$novaordem))
			{$novaordem[] = $i;}
		}
		//echo "<pre>";
		//var_dump($novaordem);
		$this->mapa->setlayersdrawingorder($novaordem);
		return "ok";
	}

/*
function: zoomTema

Zoom para um tema.

Calcula a extensão geográfica de um tema e ajusta o mapa para essa extensão.
*/
	function zoomTema()
	{
		if(!$this->layer){return "erro";}
		$prjMapa = "";
		$prjTema = "";
		if($this->layer->type != MS_LAYER_RASTER)
		{
			$prjMapa = $this->mapa->getProjection();
			$prjTema = $this->layer->getProjection();
		}	
		$extatual = $this->mapa->extent;
		$ret = $this->layer->getmetadata("extensao");
		if($ret == "" && $this->layer->type == MS_LAYER_RASTER)
		{$ret = "-75.233614607 -33.7515829981 -27.592958622 5.272156";}
		if ($ret == "")
		{
			$ret = $this->layer->getextent();
			//reprojeta o retangulo
			if (($prjTema != "") && ($prjMapa != $prjTema))
			{
				$projInObj = ms_newprojectionobj($prjTema);
				$projOutObj = ms_newprojectionobj($prjMapa);
				$ret->project($projInObj, $projOutObj);
			}
			$extatual->setextent($ret->minx,$ret->miny,$ret->maxx,$ret->maxy);
		}
		else
		{
			$ret = explode(" ",$ret);
			$extatual->setextent($ret[0],$ret[1],$ret[2],$ret[3]);
		}
		return("ok");
	}
/*
function: pegaFiltro

Pega o filtro de um tema.

return:
string Filtro.
*/
	function pegaFiltro()
	{
		if(!$this->layer){return "erro";}
		$fil = $this->layer->getfilter();
		if ($this->layer->getfilter() == '"(null)"'){return " ";}
		if (function_exists("mb_convert_encoding"))
		{return (mb_convert_encoding($this->layer->getfilter(),"HTML-ENTITIES","auto"));}
		else
		{return ($this->layer->getfilter());}
	}
/*
function: insereFiltro

Inclui um filtro no tema.

parameters:

$filtro - string com o filtro. As aspas simples devem ser substituídas por |.

$testa - Testa o filtro e retorna uma imagem.
*/
	function insereFiltro($filtro,$testa="")
	{
		if(!$this->layer){return "erro";}
		$fil = $this->layer->getfilter();
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
        if ($filtro == "")       
        {$this->layer->setfilter($filtro);}
        else
        {
            $this->layer->setfilter($filtro);
            $v = versao();
			//corrige bug do mapserver
            if (($v["completa"] == "4.10.0") && ($this->layer->connectiontype == MS_POSTGIS))
            {$this->layer->setfilter("\"".$filtro."\"");}
        }        
		if ($testa == "")
		{
			$img = $this->mapa->prepareimage();
			if ($this->layer->draw($img) == 0)
			{return ("ok");}
			else
			{return ("erro. Problemas com o filtro."." ".$filtro);}
		}
		else
		{
	 		$i = gravaImagemMapa($this->mapa);
			return ($i["url"]);
		}
	}
/*
function: mudaTransparencia

Muda a transparência do tema.

parameter:
$valor - Novo valor da transparência
*/
	function mudaTransparencia($valor)
	{
        $v = versao();
		foreach ($this->grupo as $lg)
		{
			$ll = $this->mapa->getlayerbyname($lg);
			$v["principal"] == "4" ? $ll->set("transparency",$valor) : $ll->set("opacity",$valor);
		}
		return("ok");
	}
/*
function: mudaNome

Muda nome do tema.

paremeter:

$valor - Novo nome.
*/
	function mudaNome($valor)
	{
		$valor = str_replace("*","&",$valor);
		$valor = str_replace("|",";",$valor);
		$valor = html_entity_decode($valor);
		foreach ($this->grupo as $lg)
		{
			$ll = $this->mapa->getlayerbyname($lg);
			$meta = $ll->getmetadata("tema");
			if (($meta != "") && ($meta != "NAO"))
			{$ll->setmetadata("tema",$valor);}
		}
		return ("ok");
	}
/*
function: insereFeature

Insere elemento gráfico em um tema.

parameters:

$marca - nome do símbolo que será utilizado

$tipo - Tipo de elemento GRAFICOPIZZA|POLYGON|LINE|POINT|ANNOTATION|limpaponto.

$xy - Pares de coordenadas separadas por espaço.

$texto - Texto que será inserido, no caso do tipo ANNOTATION.

$position - Posição da âncora do texto.

$partials - Corta texto nas bordas do mapa.

$offsetx - Deslocamento em X.

$offsety - Deslocamento em Y.

$minfeature - Tamanho mínimo que o texto deve ter.

$mindistance - Distância mínima entre os textos.

$force - Força colisão.

$shadowcolor - Cor da sombra.

$shadowsizex - Tamanho em X da sombra.

$shadowsizey - Tamanho em Y da sombra.

$outlinecolor - Cor do contorno.

$cor - Cor do texto.

$sombray - Deslocamento Y da sombra.

$sombrax - Deslocamento X da sombra.

$sombra - Inclui sombra.

$fundo - Cor do fundo.

$angulo - Ângulo do texto.

$tamanho - Tamanho do texto.

$fonte - Fonte.
*/
	function insereFeature($marca,$tipo,$xy,$texto,$position,$partials,$offsetx,$offsety,$minfeaturesize,$mindistance,$force,$shadowcolor,$shadowsizex,$shadowsizey,$outlinecolor,$cor,$sombray,$sombrax,$sombra,$fundo,$angulo,$tamanho,$fonte)
	{
		//verifica se j'a existe um layer criado anteriormente com o mesmo nome e apaga se existir
		if ($tipo == "limpaponto")
		{
			if ($this->layer)
			{
				$this->layer->set("status",MS_DELETE);
				$this->layer->set("name","pindelete");
				$tipo = "POINT";
			}
		}
		//se o novo layer nao existir, cria um novo copiando o layer "pin" que ja deve existir no map file (no map file que iniciou a aplicacao)
		if (!$this->layer)
		{
			$pinlayer = criaLayer($this->mapa,MS_LAYER_LINE,MS_DEFAULT,"Ins",$metaClasse="SIM");
			$c = $pinlayer->getclass(0);
			$c->set("name","");
			$e = $c->getstyle(0);
			$e->set("size",1);
			$e->set("symbol","ponto");
			$core = $e->color;
			$core->setrgb(255,0,0);
			switch ($tipo)
			{
				case "GRAFICOPIZZA":
				if(!isset($tamanho)){$tamanho = 5;}
				$e->set("size",$tamanho);
				$pinlayer->setmetadata("tema","Pontos inseridos");
				$pinlayer->set("type",MS_LAYER_POINT);
				break;
				case "POINT";
				if ((!isset($marca)) || ($marca=="")){$marca="marca";}
				if(!isset($tamanho)){$tamanho = 5;}
				$e->set("size",$tamanho);
				$e->set("symbolname",$marca);
				$pinlayer->setmetadata("tema","Pontos inseridos");
				$pinlayer->set("type",MS_LAYER_POINT);
				break;
				case "LINE":
				if (!isset($marca)){$marca="linha";}
				if(!isset($tamanho)){$tamanho = 2;}
				$e->set("size",$tamanho);
				$e->set("symbolname",$marca);
				$pinlayer->setmetadata("tema","Linhas inseridas");
				$pinlayer->set("type",MS_LAYER_LINE);
				break;
				case "POLYGON":
				if (!isset($marca)){$marca="p9";}
				if(!isset($tamanho)){$tamanho = 5;}
				$e->set("size",$tamanho);
				$e->set("symbolname",$marca);
				$pinlayer->setmetadata("tema","Poligonos inseridos");
				$pinlayer->set("type",MS_LAYER_POLYGON);
				$pinlayer->set("transparency","50");
				break;
				case "ANNOTATION":
				$c->set("status",MS_DELETE);
				$novac = ms_newclassobj($pinlayer);
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
				$label->set("angle",$angulo);
				corE($label,$fundo,"backgroundcolor");
				corE($label,$sombra,"backgroundshadowcolor");
				corE($label,$cor,"color");
				$label->set("backgroundshadowsizex",$sombrax);
				$label->set("backgroundshadowsizey",$sombray);
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
				$pinlayer->setmetadata("TEMA",$texto);
				$pinlayer->set("type",MS_LAYER_ANNOTATION);
				$pinlayer->set("transparency","100");
				break;
			}
		}
		$apt = explode(" ",$xy);
		switch ($tipo)
		{
			case "ANNOTATION":
			$shp = ms_newshapeobj(MS_SHAPE_POINT);
			$texto = str_replace("*","&",$texto);
			$texto = str_replace("|",";",$texto);
			$shp->set("text",$texto);
			break;
			case "POINT":
			$shp = ms_newshapeobj(MS_SHAPE_POINT);
			break;
			case "LINE":
			$shp = ms_newshapeobj(MS_SHAPE_LINE);
			break;
			case "POLYGON":
			$shp = ms_newshapeobj(MS_SHAPE_POLYGON);
			break;
		}
		$lin = ms_newlineobj();
		for ($i = 0;$i < count($apt); $i = $i + 2)
		{$lin->addxy($apt[$i],$apt[$i + 1]);}
		$shp->add($lin);
		$pinlayer->addfeature($shp);
		$shp->free();
		return("ok");
	}
/*
function: capturaGeometrias

Captura as geometrias selecionadas e salva em um arquivo texto serializado (analise de geometrias).

parameters:
$dir_tmp - diretório temporário do I3Geo

$imgdir - diretório temporário das imagens do mapa atual

$nome - nome que será dado a geometria
*/
	function capturaGeometrias($dir_tmp,$imgdir,$nome="")
	{
		if(!$this->layer){return "erro";}
		$this->mapa->setsize(30,30);
		$ext = $this->mapa->extent;
		$sb = $this->mapa->scalebar;
		$sb->set("status",MS_OFF);
		if (file_exists($this->arquivo."qy"))
		{$this->mapa->loadquery(($this->arquivo)."qy");}
		$items = pegaItens($this->layer);
		$sopen = $this->layer->open();
		if($sopen == MS_FAILURE){return "erro";}

		$res_count = $this->layer->getNumresults();
		$final["layer"] = pegaNome($this->layer);
		$registros = array();
		for ($i = 0; $i < $res_count; ++$i)
		{
			$valitem = array();
			$result = $this->layer->getResult($i);
			$shp_index  = $result->shapeindex;
			$shape = $this->layer->getshape(-1, $shp_index);				
			foreach ($items as $item)
			{
				$v = trim($shape->values[$item]);
				if (function_exists("mb_convert_encoding"))
				{$v = mb_convert_encoding($v,"UTF-8","ISO-8859-1");}
				$valitem[] = array("item"=>$item,"valor"=>$v);
			}
			$wktgeo=$shape->toWkt();
			if ($wktgeo != "")
			{			
				$fechou = $this->layer->close();
				$bounds = $shape->bounds;
				//gera imagem
				$d = 0.01;
				//se for do tipo ponto, faz um deslocamento do extent
				if ($shape->type == 2)
				{$d = 0;}
				$ext->setextent(($bounds->minx) - $d,($bounds->miny) - $d,($bounds->maxx) + $d,($bounds->maxy) + $d);
				$im = gravaImagemMapa($this->mapa);
				$registros[] = array("id"=>$i,"wkt"=>$wktgeo,"valores"=>$valitem,"imagem"=>$im["url"]);
				$abriu = $this->layer->open();
			}
		}
		$fechou = $this->layer->close();
		if (count($registros) > 0)
		{
			$final["dados"] = $registros;
			//salva arquivo
			$nome == "" ? $nome = nomerandomico(15) : $nome = str_replace(" ","_",$nome);
			$arq = $dir_tmp."/".$imgdir."/".$nome."keo";
			if (file_exists($arq))
			{unlink($arq);}
			$fp = fopen($arq,"w");
			$r = serialize($final);
			fwrite($fp,$r);
			fclose($fp);
		}
		return("ok");
	}
/*
function: listaGeometrias

Lista as geometrias arquivos com extensão geo (análise de geometrias).

parameters:
$dir_tmp - diretório temporário do I3Geo

$imgdir - diretório temporário das imagens do mapa atual
*/
	function listaGeometrias($dir_tmp,$imgdir)
	{
		$resultado = array();
		foreach (glob($dir_tmp."/".$imgdir."/*keo") as $arquivo)
		{
			$handle = fopen ($arquivo, "r");
			$conteudo = fread ($handle, filesize ($arquivo));
			fclose ($handle);
			$final = unserialize($conteudo);
			//var_dump($final);
			$dados = array();
			foreach ($final["dados"] as $d)
			{$dados[] = array("id"=>($d["id"]),"valores"=>($d["valores"]),"imagem"=>($d["imagem"]));}
			$resultado[] = array("arquivo"=>(basename($arquivo)),"layer"=>$final["layer"],"dados"=>$dados);
		}
		return($resultado);
	}
/*
function: removerGeometrias

Remove os arquivos correspondentes a determinadas geometrias (análise de geometrias).

parameters:
$dir_tmp - diretório temporário do I3Geo

$imgdir - diretório temporário das imagens do mapa atual

$lista - lista com os nomes dos arquivos
*/
	function removerGeometrias($dir_tmp,$imgdir,$lista)
	{
		$lista = explode(",",$lista);
		foreach ($lista as $f)
		{
			if (file_exists($dir_tmp."/".$imgdir."/".$f))
			{unlink ($dir_tmp."/".$imgdir."/".$f);}
		}
		return("ok");
	}
/*
function: graficotema

Gera um tema com gráficos em cada elemento.

parameters:

lista - lista de item e cores de cada parte do grafico

*/
	function graficotema($lista,$tamanho="50",$tipo="PIE",$outlinecolor="",$offset=0)
	{
		if(!$this->layer){return "erro";}
		$nome = pegaNome($this->layer);
		$novolayer = ms_newLayerObj($this->mapa, $this->layer);
		$nomer = nomeRandomico();
		$novolayer->set("name",$nomer);
		$novolayer->set("group",$nomer);
		$novolayer->set("type",MS_LAYER_CHART);
		$novolayer->setprocessing("CHART_TYPE=$tipo");
		$novolayer->setprocessing("CHART_SIZE=$tamanho");
		$nclasses = $novolayer->numclasses;
		for ($i=0; $i < $nclasses; ++$i)
		{
			$c = $novolayer->getclass($i);
			$c->set("status",MS_DELETE);
		}
		$novolayer->set("status",MS_DEFAULT);
		$novolayer->setmetadata("tema","grafico de ".$nome);
		$lista = explode("*",$lista);
		foreach($lista as $l)
		{
			$ll = explode(",",$l);
			$novac = ms_newClassObj($novolayer);
			$novac->set("name",$ll[0]);
			$novoestilo = ms_newStyleObj($novac);
			$novoestilo->setBinding(MS_STYLE_BINDING_SIZE, $ll[0]);
			$cor = $novoestilo->color;
			$cor->setrgb($ll[1],$ll[2],$ll[3]);
			if($outlinecolor != "")
			{
				$o = explode(",",$outlinecolor);
				$corl = $novoestilo->outlinecolor;
				$corl->setrgb($o[0],$o[1],$o[2]);
			}
			if($tipo == "PIE")
			$novoestilo->set("offsetx",$offset);
		}
	}
/*
function: fonteTema

Retorna o link para a fonte do tema.

parameters:

tema - código do tema

*/
	function fonteTema($tema)
	{
		include_once($this->locaplic."/admin/php/xml.php");
		require($this->locaplic."/classesphp/classe_menutemas.php");
  		$menutemas = new Menutemas("","","",$this->locaplic);
		$linkfonte = "erro";
		$tipo = "";
		$this->xml = "";
		foreach($menutemas->pegaListaDeMenus() as $menu)
		{
			if(!isset($menu["url"])){$menu["url"] = "";} //para efeitos de compatibilidade entre versões do i3geo
			$ondexml = $menu["arquivo"];
			if($menu["url"] != ""){$ondexml = $menu["url"];}
			$verificaXml = false;
			if($ondexml != "")
			{
				$verificaXml = simplexml_load_file($ondexml);
				if($verificaXml)
				$this->xml[] = $verificaXml;
			}
			else //pega o xml do sistema de administração
			{
				$verificaXml = simplexml_load_string(geraXmlMenutemas(implode(" ",$this->perfil),$menu["idmenu"],$tipo,$this->locaplic));
				if($verificaXml)
				$this->xml[] = $verificaXml;
			}
			if(!$verificaXml)
			$this->xml[] = simplexml_load_string(geraXmlMenutemas(implode(" ",$this->perfil),$menu["idmenu"],$tipo,$this->locaplic));
		}
		foreach ($this->xml as $xml)
		{
			$subgrupo = array();
			foreach($xml->GRUPO as $grupo)
			{
					foreach($grupo->SGRUPO as $sgrupo)
					{
							foreach($sgrupo->TEMA as $t)
							{
									
									$link = ixml($t,"TLINK");
									$tid = ixml($t,"TID");
									if($tid == $tema)
									{$linkfonte = $link;}
							}
					}
			}
		}
		return ($linkfonte);
	}
/*
function: zoomSel

Zoom para os elementos selecionados de um tema.

Calcula a extensão geográfica dos elementos selecionados de um tema e ajusta o mapa para essa extensão.
*/
	function zoomSel()
	{
		if(!$this->layer){return "erro";}
		$extatual = $this->mapa->extent;
		$prjMapa = "";
		$prjTema = "";
		if (file_exists($this->arquivo."qy"))
		{$this->mapa->loadquery(($this->arquivo)."qy");}
		$sopen = $this->layer->open();
		if($sopen == MS_FAILURE){return "erro";}
		$res_count = $this->layer->getNumresults();
		if($res_count > 0)
		{
			$xmin = array();
			$xmax = array();
			$ymin = array();
			$ymax = array();
			for ($i = 0; $i < $res_count; ++$i)
			{
				$valitem = array();
				$result = $this->layer->getResult($i);
				$shp_index  = $result->shapeindex;
				$shape = $this->layer->getshape(-1, $shp_index);				
				$bound = $shape->bounds;
				$xmin[] = $bound->minx;
				$xmax[] = $bound->maxx;
				$ymin[] = $bound->miny;
				$ymax[] = $bound->maxy;
			}
			$this->layer->close();
			$ret = ms_newRectObj();
			$ret->set("minx",min($xmin));
			$ret->set("miny",min($ymin));
			$ret->set("maxx",max($xmax));
			$ret->set("maxy",max($ymax));
			if (($prjTema != "") && ($prjMapa != $prjTema))
			{
				$projInObj = ms_newprojectionobj($prjTema);
				$projOutObj = ms_newprojectionobj($prjMapa);
				$ret->project($projInObj, $projOutObj);
			}
			$extatual->setextent($ret->minx,$ret->miny,$ret->maxx,$ret->maxy);
		}
		return("ok");
	}
/*
function: sld

Retorna o SLD correspondente à legenda do tema.
*/
	function sld()
	{
		if(!$this->layer){return "erro";}
		return $this->layer->generateSLD();
	}
}
?>