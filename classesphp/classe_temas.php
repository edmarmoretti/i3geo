<?php
/*
Title: Temas

Manipulação de temas.

Adiciona, remove, muda ordem, etc.

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

File: classe_temas.php

19/6/2007
*/
/*
Class: Temas
*/
class Temas
{
	/*
	Variable: $mapa
	
	Objeto mapa
	*/
	protected $mapa;
	/*
	Variable: $arquivo
	
	Arquivo map file
	*/
	protected $arquivo;
	/*
	Variable: $layer
	
	Objeto layer
	*/
	protected $layer;
	/*
	Variable: $nome
	
	Nome do layer
	*/
	protected $nome;
	/*
	Variable: $grupo
	
	Array com os temas do grupo, se houver
	*/
	protected $grupo;
	/*
	Variable: $visiveis
	
	Temas do grupo que são visíveis em função da escala
	*/
	protected $visiveis;
	/*
	Variable: $indices
	
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
	function __construct($map_file,$tema)
	{
  		$this->mapa = ms_newMapObj($map_file);
  		$this->arquivo = $map_file;
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
/*
function: salva

Salva o mapfile atual 
*/	
 	function salva()
 	{
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
		$n = $this->layer->num_processing;
		if ($n > 0)
		{$this->layer->clearProcessing();}
		$lista = str_replace('"',"",$lista);
		$lista = explode("|",$lista);
		foreach ($lista as $processo)
		{
			$this->layer->setprocessing($processo);
		}
		return("ok");
	}
/*
function: gravaImagemCorpo

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
		return $this->gravaImagemCorpo();
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
			if ($l->type == 1) //se for do tipo linear
			{$l->set("type",MS_LAYER_POLYGON);}
			elseif ($l->type == 2) //se for do tipo poligonal
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
			for ($i=0;$i<$mover;$i++)
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
			for ($i=0;$i<$mover;$i++)
			{$moveu = $this->mapa->moveLayerDown($indice);			}
		}
		if ($moveu == MS_TRUE)
		{return "ok";}
		else
		{return "erro. Nao foi possivel mover o tema";}
	}
/*
function: zoomTema

Zoom para um tema.

Calcula a extensão geográfica de um tema e ajusta o mapa para essa extensão.
*/
	function zoomTema()
	{
		$ret = $this->layer->getextent();
		$extatual = $this->mapa->extent;
		$extatual->setextent($ret->minx,$ret->miny,$ret->maxx,$ret->maxy);
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
            $v = explode(" ",ms_GetVersion());
			//corrige bug do mapserver
            if (($v[2] == "4.10.0") && ($this->layer->connectiontype == MS_POSTGIS))
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
	 		$imgo = $this->mapa->draw();
			$n = ($imgo->imagepath)."teste".nomeRandomico().".png";
			$imgo->saveImage($n);
			return ($imgo->imageurl).basename($n);
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
		foreach ($this->grupo as $lg)
		{
			$ll = $this->mapa->getlayerbyname($lg);
			$ll->set("transparency",$valor);
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
			if ($this->layer != "")
			{
				$this->layer->set("status",MS_DELETE);
				$this->layer->set("name","pindelete");
				$tipo = "POINT";
			}
		}
		//se o novo layer nao existir, cria um novo copiando o layer "pin" que ja deve existir no map file (no map file que iniciou a aplicacao)
		if ($this->layer == "")
		{
			$pinlayer = criaLayer($this->mapa,MS_LAYER_LINE,MS_DEFAULT,"Ins",$metaClasse="SIM");
			$c = $pinlayer->getclass(0);
			$c->set("name","");
			$e = $c->getstyle(0);
			$e->set("size",1);
			$e->set("symbol","ponto");
			$core = $e->color;
			$core->setrgb(255,0,0);
			if ($tipo == "GRAFICOPIZZA")
			{
				if(!isset($tamanho)){$tamanho = 5;}
				$e->set("size",$tamanho);
				$pinlayer->setmetadata("tema","Pontos inseridos");
				$pinlayer->set("type",MS_LAYER_POINT);
			}
			if ($tipo == "POINT")
			{
				if (!isset($marca)){$marca="marca";}
				if(!isset($tamanho)){$tamanho = 5;}
				$e->set("size",$tamanho);
				$e->set("symbolname",$marca);
				$pinlayer->setmetadata("tema","Pontos inseridos");
				$pinlayer->set("type",MS_LAYER_POINT);
			}
			if ($tipo == "LINE")
			{
				if (!isset($marca)){$marca="linha";}
				if(!isset($tamanho)){$tamanho = 2;}
				$e->set("size",$tamanho);
				$e->set("symbolname",$marca);
				$pinlayer->setmetadata("tema","Linhas inseridas");
				$pinlayer->set("type",MS_LAYER_LINE);
			}
			if ($tipo == "POLYGON")
			{
				if (!isset($marca)){$marca="p9";}
				if(!isset($tamanho)){$tamanho = 5;}
				$e->set("size",$tamanho);
				$e->set("symbolname",$marca);
				$pinlayer->setmetadata("tema","Poligonos inseridos");
				$pinlayer->set("type",MS_LAYER_POLYGON);
				$pinlayer->set("transparency","50");
			}
			if ($tipo == "ANNOTATION")
			{
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
			}
		}
		$apt = explode(" ",$xy);
		if ($tipo == "ANNOTATION")
		{
			$shp = ms_newshapeobj(MS_SHAPE_POINT);
			$texto = str_replace("*","&",$texto);
			$texto = str_replace("|",";",$texto);
			$shp->set("text",$texto);
		}
		if ($tipo == "POINT")
		{$shp = ms_newshapeobj(MS_SHAPE_POINT);}
		if ($tipo == "LINE")
		{$shp = ms_newshapeobj(MS_SHAPE_LINE);}
		if ($tipo == "POLYGON")
		{$shp = ms_newshapeobj(MS_SHAPE_POLYGON);}
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
*/
	function capturaGeometrias($dir_tmp,$imgdir)
	{
		if (file_exists($this->arquivo."qy"))
		{$this->mapa->loadquery(($this->arquivo)."qy");}
		$items = pegaItens($this->layer);
		$this->layer->open();
		$res_count = $this->layer->getNumresults();
		$final["layer"] = pegaNome($this->layer);
		$registros = array();
		for ($i = 0; $i < $res_count; $i++)
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
			{$registros[] = array("id"=>$i,"wkt"=>$wktgeo,"valores"=>$valitem);}
		}
		$fechou = $this->layer->close();
		if (count($registros) > 0)
		{
			$final["dados"] = $registros;
			//salva arquivo
			$arq = $dir_tmp."/".$imgdir."/geometria".nomerandomico(15).".geo";
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
		foreach (glob($dir_tmp."/".$imgdir."/*.geo") as $arquivo)
		{
			$handle = fopen ($arquivo, "r");
			$conteudo = fread ($handle, filesize ($arquivo));
			fclose ($handle);
			$final = unserialize($conteudo);
			//var_dump($final);
			$dados = array();
			foreach ($final["dados"] as $d)
			{$dados[] = array("id"=>($d["id"]),"valores"=>($d["valores"]));}
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
}
?>