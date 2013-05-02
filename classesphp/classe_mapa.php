<?php
/*
Title: classe_mapa.php

Manipula&ccedil;&atilde;o do mapa. Altera tamanho, lista temas, etc.

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
Voc&ecirc; deve ter recebido uma cópia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/classesphp/classe_mapa.php
*/
/*
Classe: Mapa
*/
class Mapa
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
	public $arquivo;
	/*
	Variavel: $layers

	Objetos layers
	*/
	public $layers;
	/*
	Variavel: $qyfile

	Nome do arquivo de sele&ccedil;&atilde;o (.qy)
	*/
	public $qyfile;
	/*
	Variavel: $v

	Vers&atilde;o atual do Mapserver (primeiro d&iacute;gito)
	*/
	public $v;
/*
Function: __construct

Cria um objeto mapa

parameters:

$map_file - Endere&ccedil;o do mapfile no servidor.
*/
	function __construct($map_file,$locaplic="")
	{
  		error_reporting(0);
  		if (!function_exists('ms_newMapObj')) {return false;}
  		if(file_exists($locaplic."/funcoes_gerais.php"))
  		include_once($locaplic."/funcoes_gerais.php");
  		else
  		include_once("funcoes_gerais.php");
		$this->v = versao();
		$this->v = $this->v["principal"];
		$this->qyfile = str_replace(".map",".qy",$map_file);
  		$this->locaplic = $locaplic;
  		if(!file_exists($map_file))
  		{return $this->arquivo = false;}
  		if(!@ms_newMapObj($map_file))
  		{return $this->mapa = false;}
		$this->mapa = @ms_newMapObj($map_file);
		$this->arquivo = $map_file;
		$c = $this->mapa->numlayers;
		for ($i=0;$i < $c;++$i){
			$l = $this->mapa->getlayer($i);
			$this->layers[] = $l;
			$this->nomes[] = $l->name;
		}
	}
/*
Method: salva

Salva o mapfile atual
*/
 	function salva()
 	{
	  	if(connection_aborted()){exit();}
	  	$this->mapa->save($this->arquivo);
	}
/*
Method: listaTemasBuscaRapida

Elabora uma lista de temas e seus respectivos itens para uso no m&eacute;todo buscaRegistros da classe classe_atributos

<Atributos->buscaRegistros>

A lista cont&eacute;m apenas os temas que est&atilde;o vis&iacute;veis e que possuem o metadata "itembuscarapida"

Retorno:

{string} - Lista de busca no formato item;tema,item;tema
*/
	function listaTemasBuscaRapida(){
		$lista = array();
		foreach($this->layers as $l)
		{
			$metadata = $l->getmetadata("itembuscarapida");
			if($metadata != "")
			{$lista[] = $metadata.";".$l->name;}
		}
		return implode(",",$lista);
	}
/*
Method: mudaoutputformat

Muda o OUTPUTFORMAT

Parametro:

tipo {string} - OUTPUTFORMAT que ser&aacute; aplicado. deve existir no mapfile b&aacute;sico que iniciou o i3Geo
*/
 	function mudaoutputformat($tipo)
 	{
		foreach($this->layers as $l)
		{$l->setMetaData("cache","");}
		return $this->mapa->selectOutputFormat($tipo);
	}
/*
Method: pegaMensagens

Pega as mensagens do metadata "mensagem" existentes nos layers do mapa atual

Return:

{String}
*/
	function pegaMensagens()
	{
		$mensagem = "";
		foreach($this->layers as $l)
		{
			if($l->status == MS_DEFAULT)
			{$mensagem .= $l->getmetadata("mensagem");}
		}
		if (function_exists("mb_convert_encoding"))
		{$mensagem = mb_convert_encoding($mensagem,"UTF-8","ISO-8859-1");}
		return ($mensagem);
	}

/*
Method: gravaImagemCorpo (depreciado)

Grava a imagem do mapa atual
*/
	function gravaImagemCorpo()
	{
	 	$imgo = $this->mapa->draw();
		$nome = ($imgo->imagepath).nomeRandomico().".png";
		$imgo->saveImage($nome);
		$nome = ($imgo->imageurl).basename($nome);
		//$imgo->free();
		return ($nome);
	}
/*
Method: parametrosTemas

Pega os parametros dos layers do mapa.

return:

string - javascript com os parametros
*/
	function parametrosTemas()
	{
		$temas = array();
		$existesel = false;
		$dir = dirname($this->arquivo);
		//$qy = file_exists($this->qyfile);
		foreach($this->layers as $l)
		{$l->set("template","none.htm");}
		foreach ($this->layers as $oLayer)
		{
			$sel = "nao";
			$nSel = 0;
			$arqS = $dir."/".$oLayer->name.".php";
			if(file_exists($arqS)){
				$sel = "sim";
				$existesel = true;
				$handle = fopen ($arqS, "r");
				$conteudo = fread ($handle, filesize ($arqS));
				fclose ($handle);
				$nSel = count(unserialize($conteudo));
			}
			$escondido = $oLayer->getmetadata("escondido");
			if($escondido == "")
			{$escondido = "nao";}
			if ( (strtoupper($oLayer->getmetadata("tema")) != "NAO") )
			{
				$escala = $oLayer->getmetadata("escala");
				if ($escala == ""){$escala = 0;}
				$down = $oLayer->getmetadata("download");
				//
				//verifica se o layer &eacute; do tipo features
				//
				$f = "nao";
				if (($oLayer->data == "") && ($oLayer->connection == ""))
				{$f = "sim";}
				$ct = $oLayer->connectiontype;
				//
				//verifica se o tema tem wfs
				//
				$wfs = $oLayer->getmetadata("wfs");
				//
				//verifica se o tema utiliza SLD
				//
				$usasld = "nao";
				if($oLayer->getmetadata("wms_sld_body") !== "" || $oLayer->getmetadata("wms_sld_url") !== "")
				{$usasld = "sim";}
				//
				//verifica se o tema pode receber a opera&ccedil;&atilde;o de zoom para o tema
				//
				if (($ct != 1) && ($oLayer->getmetadata("extensao") == ""))
				{
					$zoomtema = "nao";
					$exttema = "";
				}
				else
				{
					$zoomtema = "sim";
					$exttema = $oLayer->getmetadata("extensao");
				}
				//
				//verifica se existe restri&ccedil;&atilde;o de escala
				//
				$contextoescala = "nao";
				if(($oLayer->minscaledenom > 0) || ($oLayer->maxscaledenom > 0))
				{$contextoescala = "sim";}
				//
				//verifica se o usu&aacute;rio pode editar o SQL em DATA
				//
				$editorsql = "nao";
				if($ct == 3 || $ct == 4 || $ct == 6 || $ct == 8)
				{
					if (strtoupper($oLayer->getmetadata("editorsql")) != "NAO")
					{$editorsql = "sim";}
				}
				//
				//verifica se o tema pode ser utilizado para gerar gr&aacute;ficos de linha do tempo
				//
				$ltempo = "nao";
				if($oLayer->getmetadata("ltempoformatodata") !== "")
				{$ltempo = "sim";}
				//
				//verifica se o tema faz cache automatico
				//
				$cache = "nao";
				if(strtoupper($oLayer->getmetadata("cache")) == "SIM")
				{$cache = "sim";}
				//
				//verifica se o tema receber&aacute; efeito de transi&ccedil;&atilde;o de zoom
				//
				$transitioneffect = "sim";
				if($oLayer->getmetadata("transitioneffect") == "NAO")
				{$transitioneffect = "nao";}
				//
				$permitecomentario = "nao";
				if($oLayer->getmetadata("nomeoriginal") != "" && strtoupper($oLayer->getmetadata("permitecomentario")) != "NAO")
				{$permitecomentario = "sim";}
				$aplicaextensao = "nao";
				if(strtoupper($oLayer->getmetadata("aplicaextensao")) == "SIM")
				{$aplicaextensao = "sim";}
				$wmsurl = "";
				$wmsformat = "";
				$wmssrs = "";
				$wmstile = "";
				if($ct == 7 && strtoupper($oLayer->getmetadata("cache")) != "SIM"){
					$wmsurl = ($oLayer->connection)."&layers=".($oLayer->getmetadata("wms_name"))."&style=".($oLayer->getmetadata("wms_style"));
					$wmsformat = $oLayer->getmetadata("wms_format");
					$wmssrs = $oLayer->getmetadata("wms_srs");
					$wmstile = $oLayer->getmetadata("wms_tile");
					$wmsname = $oLayer->getmetadata("wms_name");
					if($wmstile == 1){
						$wmsurl = ($oLayer->connection);
					}
				}
				$tiles = "";
				if($oLayer->labelitem != "")
				{$tiles = "nao";}
				$temas[] = array(
					"name"=>($oLayer->name),
					"nomeoriginal"=>($oLayer->getmetadata("nomeoriginal")),
					"status"=>($oLayer->status),
					"tema"=>(mb_convert_encoding(($oLayer->getmetadata("tema")),"UTF-8","ISO-8859-1")),
					"transparency"=>($oLayer->opacity),
					"type"=>($oLayer->type),
					"sel"=>$sel,
					"nsel"=>$nSel,
					"escala"=>$escala,
					"download"=>$down,
					"features"=>$f,
					"connectiontype"=>$ct,
					"zoomtema"=>$zoomtema,
					"contextoescala"=>$contextoescala,
					"etiquetas"=>($oLayer->getmetadata("TIP")),
					"identifica"=>($oLayer->getmetadata("IDENTIFICA")),
					"editorsql"=>$editorsql,
					"linhadotempo"=>$ltempo,
					"escondido"=>strtolower($escondido),
					"iconetema"=>($oLayer->getmetadata("iconetema")),
					"classe"=>($oLayer->getmetadata("classe")),
					"permitecomentario"=>$permitecomentario,
					"exttema"=>$exttema,
					"aplicaextensao"=>$aplicaextensao,
					"transitioneffect"=>$transitioneffect,
					"wmsurl"=>$wmsurl,
					"wmsname"=>$wmsname,
					"wmsformat"=>$wmsformat,
					"wmssrs"=>$wmssrs,
					"wmstile"=>$wmstile,
					"tiles"=>$tiles,
					"temporizador"=>($oLayer->getmetadata("temporizador")),
					"permiteogc"=>($oLayer->getmetadata("permiteogc")),
					"itembuscarapida"=>($oLayer->getmetadata("itembuscarapida")),
					"usasld"=>$usasld,
					"cache"=>$cache
				);
			}
		}
		//apaga o arquivo qy se n&atilde;o for necess&aacute;rio
		//if (!$existesel && $qy)
		//{unlink($this->qyfile);}
		$temas = array_reverse($temas);
		return $temas;
	}
/*
Method: redesenhaCorpo

Redesenha o mapa e retorna as vari&aacute;veis necess&aacute;rias para montar o mapa.

Parametros:

$tipoimagem - filtro que ser&aacute; aplicado na imagem (opcional).

Return:

string - parametros do corpo do mapa

Include:
<classe_imagem.php>
*/
	function redesenhaCorpo($tipoimagem,$utilizacgi,$locmapserv)
	{
		ms_ResetErrorList();
		if(file_exists($this->locaplic."/classe_imagem.php"))
  		include_once($this->locaplic."/classe_imagem.php");
  		else
  		include_once("classe_imagem.php");
		$nomer = "";
		$qy = file_exists($this->qyfile);
		if($qy)
		{
			foreach($this->layers as $l)
			{
				$l->set("template","none.htm");
				carregaquery2($this->arquivo,$l,$this->mapa);
			}
		}
		$legenda = $this->mapa->legend;
		//
		//prepara a legenda para incluir no mapa, preenchendo os nomes das classes que podem estar em branco
		//isso ocorre quando o layer tem só uma classe
		//
		if ($legenda->status == MS_EMBED)
		{
			foreach ($this->layers as $layer)
			{
				if (($layer->data != "") && (strtoupper($layer->getmetadata("escondido")) != "SIM") && (strtoupper($layer->getmetadata("tema")) != "NAO"))
				{
					if ($layer->numclasses > 0)
					{
						$classe = $layer->getclass(0);
						if (($classe->name == "") || ($classe->name == " "))
						{$classe->set("name",$layer->getmetadata("tema"));}
					}
				}
			}
		}
		$nome = nomeRandomico();
		//
		//gera a imagem do mapa
		//se estiver sendo utilizado o cgi para desenhar a imagem
		//&eacute; necess&aacute;rio criar uma imagem vazia para capturar o nome que ser&aacute; retornado
		//
		if (isset($utilizacgi) && strtolower($utilizacgi) == "sim" && $tipoimagem=="nenhum" && !$qy)
		{
			foreach($this->layers as $l)
			{$l->set("status",MS_OFF);}
			$imgo = @$this->mapa->draw();
		}
		else
		{
			//if($tipoimagem != "nenhum")
			//{
				$of = $this->mapa->outputformat;
				$of->set("imagemode",MS_IMAGEMODE_RGB);
			//}
			if (!$qy)
			{$imgo = @$this->mapa->draw();}
			else
			{$imgo = @$this->mapa->drawQuery();}
			$mensagemErro = "";
			$error = ms_GetErrorObj();
			while($error && $error->code != MS_NOERR)
			{
				//printf("<br>Error in %s: %s<br>\n", $error->routine, $error->message);
				$mensagemErro .= $error->routine." ".$error->message;
				$error = $error->next();
			}
			ms_ResetErrorList();
			$mensagemErro = str_replace("'"," ",$mensagemErro);
			$mensagemErro = str_replace(":"," ",$mensagemErro);
			$mensagemErro = str_replace("\n"," ",$mensagemErro);
			$nomer = ($imgo->imagepath)."mapa".$nome.".png";
			$imgo->saveImage($nomer);

			//
			//aplica o filtro de imagem se estiver definido em $tipoimagem
			//
			if($tipoimagem !== "nenhum"){
				$tiposImagem = explode(" ",$tipoimagem);
				foreach ($tiposImagem as $tipoimagem){
					$m = new Imagem($nomer);
					if ($tipoimagem == "cinza")
					{imagepng($m->cinzaNormal(),str_replace("\\","/",$nomer));}
					if ($tipoimagem == "sepiaclara")
					{imagepng($m->sepiaClara(),str_replace("\\","/",$nomer));}
					if ($tipoimagem == "sepianormal")
					{imagepng($m->sepiaNormal(),str_replace("\\","/",$nomer));}
					if ($tipoimagem == "negativo")
					{imagepng($m->negativo(),str_replace("\\","/",$nomer));}
					if ($tipoimagem == "detectaBordas")
					{imagepng($m->detectaBordas(),str_replace("\\","/",$nomer));}
					if ($tipoimagem == "embassa")
					{imagepng($m->embassa(),str_replace("\\","/",$nomer));}
					if ($tipoimagem == "gaussian_blur")
					{imagepng($m->gaussian_blur(),str_replace("\\","/",$nomer));}
					if ($tipoimagem == "selective_blur")
					{imagepng($m->selective_blur(),str_replace("\\","/",$nomer));}
					if ($tipoimagem == "mean_removal")
					{imagepng($m->mean_removal(),str_replace("\\","/",$nomer));}
					if ($tipoimagem == "pixelate")
					{imagepng($m->pixelate(),str_replace("\\","/",$nomer));}
				}
			}
			$nomer = ($imgo->imageurl).basename($nomer);
		}
		if ($imgo == ""){return "erro";}
		$e = $this->mapa->extent;
		$ext = $e->minx." ".$e->miny." ".$e->maxx." ".$e->maxy;
		if (isset($utilizacgi) && strtolower($utilizacgi) == "sim" && !$qy)
		{
			$nomer = $locmapserv."?map=".$this->arquivo."&mode=map&".nomeRandomico();
		}
		$res["mapscale"] = $this->mapa->scaledenom;
		$res["mapres"] = $this->mapa->resolution;
		$res["pixelsize"] = $this->mapa->cellsize;
		$res["mapexten"] = $ext;
		$res["mapimagem"] = $nomer;
		$res["w"] = $imgo->width;
		$res["h"] = $imgo->height;
		$res["mappath"] = $imgo->imagepath;
		$res["mapurl"] = $imgo->imageurl;
		$res["erro"] = $mensagemErro;
		return $res;
	}
/*
Method: redesenhaEntorno (depreciado)

Redesenha o entorno do mapa (depreciado).

Redesenha as partes norte, sul, leste e oeste do mapa e retorna as vari&aacute;veis necess&aacute;rias para montar o mapa.

Return:

string - javascript com as vari&aacute;veis para redesenho do mapa
*/
	function redesenhaEntorno()
	{
		$nomes = nomeRandomico();
		$this->mapa->prepareimage();
		$e = $this->mapa->extent;
		$w = $this->mapa->width;
		$h = $this->mapa->height;
		$s = $this->mapa->scaledenom;
		$this->mapa = desligamargem($this->mapa);
		$pt = ms_newPointObj();
		//desenha o leste
		$pt->setXY($w + ($w/2), $h/2);
		$this->mapa->zoompoint(0,$pt,$w,$h,$e);
		$nomeL = gravaImagemMapa($this->mapa);
		//desenha o oeste
		$pt->setXY(0 - ($w / 2), $h/2);
		$this->mapa->zoomscale($s*2,$pt,$w,$h,$e);
		$nomeO = gravaImagemMapa();
		//desenha o norte
		$pt->setXY($w / 2, 0 - $h);
		$this->mapa->zoomscale($s*2,$pt,$w,$h,$e);
		$nomeN = gravaImagemMapa();
		//desenha o sul
		$pt->setXY($w / 2, $h * 2);
		$this->mapa->zoomscale($s * 2,$pt,$w,$h,$e);
		$nomeS = gravaImagemMapa();
		return "var imagens=['".$nomeL["url"]."','".$nomeO["url"]."','".$nomeN["url"]."','".$nomeS["url"]."'];";
	}
/*
Method: ativalegenda

Ativa/desativa legenda, incluindo ou n&atilde;o no corpo do mapa.
*/
	function ativalegenda()
	{
		$legenda = $this->mapa->legend;
		$legenda->status == MS_EMBED ? $legenda->set("status",MS_OFF) : $legenda->set("status",MS_EMBED) ;
		return "ok";
	}
/*
Method: ativalogo

Ativa/desativa logomarca.

A logomarca &eacute; mostrada no canto superior direito da imagem do mapa.
No mapfile padr&atilde;o (geral1.map), o layer "copyright" &eacute; utilizado para incluir a logomarca.
Essa fun&ccedil;&atilde;o liga ou desliga esse layer, manipulando a propriedade "status".

*/
	function ativalogo()
	{
		$layer = $this->mapa->getlayerbyname("copyright");
		if ($layer != "")
		{
			$layer->status == MS_DEFAULT ? $layer->set("status",MS_OFF) : $layer->set("status",MS_DEFAULT);
		}
		return "ok";
	}
/*
Method: listaTemasLocais

Lista os temas locais de um mapa.

Lista os temas existentes no mapfile atual, que utilizam como fonte de dados shape file, e que est&atilde;o armazenados no diretório tempor&aacute;rio do mapa.
Os arquivos shape file existentes no diretório tempor&aacute;rio do mapa s&atilde;o pass&iacute;veis de edi&ccedil;&atilde;o.
Obs.: Toda vez que um tema local &eacute; criado pelo I3Geo, o METADATA "TEMALOCAL" &eacute; marcado como "sim".

Parameter:

$tipo - tipo de layer que ser&aacute; considerado. Default &eacute; 0.
*/
	function listaTemasLocais($tipo=0)
	{
		$final = array(); //resultado final
		//verifica se o tema &eacute; local
		$layers = array();
		foreach ($this->layers as $layer)
		{
			if (($layer->getMetaData("TEMALOCAL") != "") && ($layer->type == $tipo))
			{
				$final[] = array("tema"=>$layer->name,"nome"=>(pegaNome($layer,"UTF-8")));
			}
		}
		return $final;
	}
/*
Method: listaTemas

Lista os temas de um mapa.

Obs.: o "METADATA" "ESCONDIDO", quando presente no tema e diferente de vazio, indica que o tema &eacute; do
tipo escondido, ou seja, n&atilde;o deve ser listado pelo I3Geo em combos ou listagens. Por isso,
layers desse tipo s&atilde;o ignorados por essa fun&ccedil;&atilde;o.

Parameter:

$opcao Situa&ccedil;&atilde;o desejada do tema (ligados ou todos).

Return:

Array com os temas e seus nomes

Properties:

tema

nome
*/
	function listaTemas($opcao)
	{
		$final = array();
		if ($opcao == "ligados")
		{
			foreach ($this->layers as $layer)
			{
				if (($layer->isvisible()) && ($layer->status == MS_DEFAULT) && ($layer->getmetadata("ESCONDIDO") == ""))
				{
					$ident = $layer->getmetadata("IDENTIFICA");
					$final[] = array("tema"=>$layer->name,"nome"=>(pegaNome($layer,"UTF-8")),"identifica"=>$ident);
				}
			}
		}
		else
		{
			foreach ($this->layers as $layer)
			{
			 	if ($layer->getmetadata("ESCONDIDO") == "")
				{$final[] = array("tema"=>$layer->name,"nome"=>(pegaNome($layer,"UTF-8")));}
			}
		}
		return $final;
	}
/*
Method: listaTemasTipo

Lista os temas, vis&iacute;veis, de um determinado tipo de fei&ccedil;&atilde;o de um mapa.

Obs.: o "METADATA" "ESCONDIDO", quando presente no tema e diferente de vazio, indica que o tema &eacute; do
tipo escondido, ou seja, n&atilde;o deve ser listado pelo I3Geo em combos ou listagens. Por isso,
layers desse tipo s&atilde;o ignorados por essa fun&ccedil;&atilde;o.

Parametros:

$tipo Tipo de tema (pode ser mais de um) ponto,poligono,linha,raster

Return:

Array com os temas e seus nomes

Properties:

tema

nome

*/
	function listaTemasTipo($tipo,$selecao="nao")
	{
		if (($selecao=="sim") && (file_exists($this->qyfile)))
		{$this->mapa->loadquery($this->qyfile);}
		$layers = array();
		foreach($this->layers as $layer)
		{
			if (($layer->isvisible()) && ($layer->getmetadata("ESCONDIDO") == ""))
			{$layers[] = $layer;}
		}
		$final = array();
		//substitui os tipos pelo código usado no mapserver
		$tipo = str_ireplace("ponto","0",$tipo);
		$tipo = str_ireplace("poligono","2",$tipo);
		$tipo = str_ireplace("linha","1",$tipo);
		$tipo = str_ireplace("raster","3",$tipo);
		$tipos = explode(",",$tipo);
		//pega os layers apenas dos tipos indicados e monta a string com os nomes corretos
		foreach ($layers as $layer)
		{
			if (!(array_search(($layer->type),$tipos) === FALSE))
			{
				if($selecao == "sim")
				{
					$res_count = $layer->getNumresults();
					if ($res_count > 0)
					{$final[] = array("tema"=>$layer->name,"nome"=>(pegaNome($layer,"UTF-8")));}
				}
				else
				{$final[] = array("tema"=>$layer->name,"nome"=>(pegaNome($layer,"UTF-8")));}
			}
		}
		return $final;
	}
/*
Method: listaTemasComSel

Lista os temas de um mapa que possuem elementos selecionados.

Obs.: o "METADATA" "ESCONDIDO", quando presente no tema e diferente de vazio, indica que o tema &eacute; do
tipo escondido, ou seja, n&atilde;o deve ser listado pelo I3Geo em combos ou listagens. Por isso,
layers desse tipo s&atilde;o ignorados por essa fun&ccedil;&atilde;o.

Return:

Array com os temas e seus nomes

Properties:

tema

nome

*/
	function listaTemasComSel()
	{
		$layers = array();
		$final = array();
		if (file_exists($this->qyfile))
		{
			foreach($this->layers as $layer)
			{
				if ($layer->getmetadata("ESCONDIDO") == "")
				{$layers[] = $layer;}
			}
			$this->mapa->loadquery($this->qyfile);
			foreach ($layers as $layer)
			{
				//verifica se o tema tem selecao
				$layer->set("template","none.htm");
				$res_count = $layer->getNumresults();
				if ($res_count > 0)
				{
				 	$nometmp = pegaNome($layer,"UTF-8");
					$final[] = array("tema"=>$layer->name,"nome"=>$nometmp);
				}
			}
		}
		return $final;
	}
/*
Method: mudaQS

Muda o tamanho do query map.

Essa fun&ccedil;&atilde;o &eacute; executada na inicializa&ccedil;&atilde;o do mapa ou quando o mapa tem suas dimens&otilde;es alteradas.
A fun&ccedil;&atilde;o de altera&ccedil;&atilde;o dos par&acirc;metros do query map original do PHPMapscript, n&atilde;o funciona corretamente.

Parametros:

$w - Largura.

$h - Altura.
*/
	function mudaQS($w,$h)
	{
		//le o map file
		$abre = fopen($this->arquivo, "r");
		while (!feof($abre))
		{
			$buffer = fgets($abre);
			$maparray[] = $buffer;
		}
		fclose($abre);
		$novoarray = array();
		$conta = 0;
		$pega = "nao";
		//procura a string "querymap"
		foreach ($maparray as $e)
		{
			$testa = explode("QUERYMAP",$e);
			if (count($testa) > 1)
			{$pega = "sim";}
			else
			{$pega = "nao";}
			$testa = explode("SIZE",$e);
			if ((count($testa) > 1) && ($pega == "sim"))
			{
				$e = "SIZE ".$w." ".$h;
				$pega = "nao";
			}
			$novoarray[] = $e;
		}
		//salva o mapfile
		$abre = fopen($this->arquivo, "wt");
		foreach($novoarray as $linha)
		{$escreve = fwrite ($abre,$linha);}
		$fecha = fclose ($abre);
	}
/*
Method: corQM

Muda a cor do query map.

Muda a cor utilizada para mostrar os elementos selecionados de um tema ou retorna a cor atual

Parameter:

$cor - RGB separado por v&iacute;rgula. Se a cor for vazia, retorna a cor atual.

*/
	function corQM($cor)
	{
		$c = $this->mapa->querymap->color;
		if ($cor != "")
		{
			$cores = explode(",",$cor);
			$c->setrgb($cores[0],$cores[1],$cores[2]);
			$retorno = "ok";
		}
		else
		{
			$retorno = $c->red.",".$c->green.",".$c->blue;
		}
		return ($retorno);
	}
/*
Method: corfundo

Muda a cor do fundo do mapa.

Parameter:

$cor - RGB separado por v&iacute;rgula. Se a cor for vazia, retorna a cor atual.

*/
	function corfundo($cor)
	{
		$c = $this->mapa->imagecolor;
		if ($cor != "")
		{
			$cores = explode(",",$cor);
			$c->setrgb($cores[0],$cores[1],$cores[2]);
			$retorno = "ok";
			$this->mapa->setmetadata("cache","");
		}
		else
		{$retorno = $c->red.",".$c->green.",".$c->blue;}
		return ($retorno);
	}
/*
Method: gradeCoord

Gera uma grade de coordenadas

A grade &eacute; incluida no mapa como um novo layer.

Parameter:

$intervalo - intervalo entre as linhas da grade.

$corlinha - cor em RGB das linhas da grade

$larguralinha - largura das linhas da grade em pixel

$tipolinha - s&iacute;mbolo das linhas

$tamanhotexto - tamanho do texto

$cortexto - cor do texto

$incluitexto - sim|nao
*/
	function gradeCoord($intervalo,$corlinha="200,200,200",$larguralinha=1,$tipolinha="linha",$tamanhotexto=MS_TINY,$fonte="bitmap",$cortexto="0,0,0",$incluitexto="sim",$mascara="-1,-1,-1",$shadowcolor="-1,-1,-1",$shadowsizex=0,$shadowsizey=0)
	{
		//echo $corlinha;
		//if (file_exists($this->qyfile))
		//{unlink ($this->qyfile);}
		//tem erro na vers&atilde;o 6 do Mapserver. J&aacute; abri um ticket no trac da OSGEO
		$nlayer = criaLayer($this->mapa,MS_LAYER_LINE,MS_DEFAULT,"Grade de coordenadas","SIM");
		ms_newgridobj($nlayer);
		$nlayer->grid->set("labelformat", "DDMMSS");
		$nlayer->grid->set("maxinterval", $intervalo);
		$classe = $nlayer->getclass(0);
		$classe->set("name","");
		$estilo =$classe->getstyle(0);
		$estilo->set("maxsize",100);
		$estilo->set("minsize",1);
		$estilo->set("size",$larguralinha);
		$estilo->set("symbolname",$tipolinha);
		$cor = $estilo->color;
		$corlinha = explode(",",$corlinha);
		$cor->setrgb($corlinha[0],$corlinha[1],$corlinha[2]);
		if($incluitexto == "sim")
		{
			$label = $classe->label;
			$label->set("size",$tamanhotexto);
			$label->set("type",MS_BITMAP);
			if ($fonte != "bitmap")
			{
				$label->set("type",MS_TRUETYPE);
				$label->set("font",$fonte);
				$label->set("size",$tamanhotexto);
			}
			else
			{
				$label->set("type",MS_BITMAP);
				$t = MS_TINY;
				if ($tamanhotexto > 5 ){$t = MS_TINY;}
				if ($tamanhotexto >= 7 ){$t = MS_SMALL;}
				if ($tamanhotexto >= 10 ){$t = MS_MEDIUM;}
				if ($tamanhotexto >= 12 ){$t = MS_LARGE;}
				if ($tamanhotexto >= 14 ){$t = MS_GIANT;}
				$label->set("size",$t);
			}
			$label->set("buffer",0);
			$label->set("force",MS_FALSE);
			$label->set("partials",MS_FALSE);
			$label->set("position",MS_CC);
			$corl = $label->color;
			$cortexto = explode(",",$cortexto);
			$corl->setrgb($cortexto[0],$cortexto[1],$cortexto[2]);
			$label->set("offsetx",0);
			$label->set("offsety",0);
			if($mascara != "")
			corE($label,$mascara,"outlinecolor");
			if($shadowcolor != "")
			{
				corE($label,$shadowcolor,"shadowcolor");
				$label->set("shadowsizex",$shadowsizex);
				$label->set("shadowsizey",$shadowsizey);
			}
		}
		return ("ok");
	}
/*
Method: adicionaTema

Acrescenta um novo tema em um arquivo map file.

O tema deve estar inclu&iacute;do em um arquivo .map localizado no diretório "temas".
Ao ser adicionado, todos os layers do arquivo indicado ser&atilde;o acrescentados.
Os layers que formam grupos tamb&eacute;m s&atilde;o processados, tendo seus nomes alterados de acordo.
Cada novo layer receber&aacute; um novo nome, definido de forma aleatória.
Os nomes dos temas podem conter o caminho completo do mapfile.
O nome original do LAYER (NAME) sera armazenado no metadata nomeoriginal
O nome do tema (mapfile) original sera armazenado no metadata arquivotemaoriginal

Parametros:

$temas - string Lista separada por v&iacute;rgulas, dos arquivos que ser&atilde;o abertos para pegar os novos layers. N&atilde;o inclua a extens&atilde;o ".map".

$locaplic - string Diretório onde fica a aplica&ccedil;&atilde;o.

$random - indica se os nomes dos novos layers ser&atilde;o modificados ou nao
*/
	function adicionaTema($temas,$locaplic,$random="sim")
	{
		//limpa selecao
		$temas = explode(",",$temas);
		$zoomlayer = "";
		foreach ($temas as $nome){
			$this->adicionaAcesso($nome,$locaplic);
			$nomemap = "";
			//
			//verifica se o tema &eacute; um arquivo php
			//
			$extensao = ".map";
			if ((file_exists($locaplic."/temas/".$nome.".php")) || (file_exists($nome.".php"))){
				$extensao = ".php";
			}
			if ((file_exists($locaplic."/temas/".$nome.".gvp")) || (file_exists($nome.".gvp"))){
				$extensao = ".gvp";
			}
			if($extensao == ".php"){
				include_once($locaplic."/temas/".$nome.".php");
				if(function_exists($nome)){
					eval($nome."(\$this->mapa);");
				}
			}
			if($extensao == ".gvp"){
				if (file_exists($locaplic."/temas/".$nome.".gvp")){
					$nomemap = $locaplic."/temas/".$nome.".gvp";
				}
				if (file_exists($nome)){
					$nomemap = $nome;
				}
				if (file_exists($nome.".gvp")){
					$nomemap = $nome.".gvp";
				}
				if ($nomemap != ""){
					include_once($locaplic."/pacotes/gvsig/gvsig2mapfile/class.gvsig2mapfile.php");
					$gm = new gvsig2mapfile($nomemap);
					$gvsigview = $gm->getViewsNames();
					foreach($gvsigview as $gv){
						$dataView = $gm->getViewData($gv);
						$adicionar = array();
						foreach($dataView["layerNames"] as $t){
							if(!in_array($t,$this->nomes)){
								$adicionar[] = $t;
							}
						}
						$this->mapa = $gm->addLayers($this->mapa,$gv,$adicionar);
					}
					foreach($adicionar as $nome){
						$l = $this->mapa->getlayerbyname($nome);
						//reposiciona o layer se for o caso
						if ($l->group == ""){
							$ltipo = $l->type;
							if (($ltipo == 2) || ($ltipo == 3)){//poligono = 2
								$indicel = $l->index;
								$numlayers = $this->mapa->numlayers;
								$nummove = 0;
								for ($i = $numlayers-1;$i > 0;$i--){
									$layerAbaixo = $this->mapa->getlayer($i);
									$tipo = $layerAbaixo->type;
									if (($tipo != 2) && ($tipo != 3)){
										$nummove++;
									}
								}
								for ($i=0;$i<($nummove);++$i){
									$indicel = $l->index;
									$this->mapa->movelayerup($indicel);
								}
							}
						}
					}
				}
			}
			if($extensao == ".map"){
				if (file_exists($locaplic."/temas/".$nome.".map")){
					$nomemap = $locaplic."/temas/".$nome.".map";
				}
				if (file_exists($nome)){
					$nomemap = $nome;
				}
				if (file_exists($nome.".map")){
					$nomemap = $nome.".map";
				}
				if ($nomemap != ""){
					$nmap = ms_newMapObj($nomemap);
					$novosnomes = $nmap->getAllLayerNames();
					//define nomes unicos para os temas
					foreach ($novosnomes as $n){
						if(!@$this->mapa->getlayerbyname($n)){
							$random = "nao";
						}
						$random == "sim" ? $nomeunico[$n] = nomeRandomico() : $nomeunico[$n] = $n;
					}
					//altera os temas para incluir o nome unico
					//include_once($locaplic."/classesphp/funcoes_gerais.php");
					foreach ($novosnomes as $n){
						$nlayer = $nmap->getlayerbyname($n);
						//para impedir erros na legenda
						if($nlayer->getmetadata("classe") == ""){
							$nlayer->setmetadata("classe","");
						}
						autoClasses($nlayer,$this->mapa);
						$nlayer->set("status",MS_DEFAULT);
						$nNome = str_replace(".map","",basename($nomemap));
						$nlayer->setmetadata("arquivotemaoriginal",$nNome);
						$nlayer->setmetadata("nomeoriginal",$nlayer->name);
						$nlayer->set("name",$nomeunico[$n]);
						//altera o nome do grupo se existir
						if ($nlayer->group != " " && $nlayer->group != "" ){
							$lr = $nlayer->group;
							if($nomeunico[$lr])
							$nlayer->set("group",$nomeunico[$lr]);
						}
						//
						//verifica se &eacute; um WMS e se existem classes definidas
						//se existirem as classes, &eacute; criado um SLD para ser aplicado ao layer
						//O SLD só funciona se CLASSITEM estiver definido
						//
						if($nlayer->classitem != "" && $nlayer->connectiontype == 7 && $nlayer->numclasses > 0 && $nlayer->getmetadata("wms_sld_body") == ""){
							$tipotemp = $nlayer->type;
							$tiporep = $nlayer->getmetadata("tipooriginal");
							$nlayer->set("type",MS_LAYER_POLYGON);
							if ($tiporep == "linear"){
								$nlayer->set("type",MS_LAYER_LINE);
							}
							if ($tiporep == "pontual"){
								$nlayer->set("type",MS_LAYER_POINT);
							}
							$sld = $nlayer->generateSLD();
							if($sld != "")
							$nlayer->setmetadata("wms_sld_body",str_replace('"',"'",$sld));
							$nlayer->set("type",$tipotemp);
						}
						ms_newLayerObj($this->mapa, $nlayer);
						$l = $this->mapa->getlayerbyname($nlayer->name);
						//reposiciona o layer se for o caso
						if ($l->group == ""){
							$ltipo = $l->type;
							if (($ltipo == 2) || ($ltipo == 3)){//poligono = 2
								$indicel = $l->index;
								$numlayers = $this->mapa->numlayers;
								$nummove = 0;
								for ($i = $numlayers-1;$i > 0;$i--){
									$layerAbaixo = $this->mapa->getlayer($i);
									$tipo = $layerAbaixo->type;
									if($tipo == 2 && ($layerAbaixo->getclass(0)->getstyle(0)->color->red == -1)) {
										$tipo = 0;
									}
									if (($tipo != 2) && ($tipo != 3)){
										$nummove++;
									}
								}
								for ($i=0;$i<($nummove);++$i){
									$indicel = $l->index;
									$this->mapa->movelayerup($indicel);
								}
							}
						}
					}
				}
			}
		}
		return(true);
	}
/*
Method: excluiTemas

Exclui temas de um mapa.

O arquivo de sele&ccedil;&atilde;o (.qy) &eacute; apagado do diretório tempor&aacute;rio.

Parameter:

$temas - lista separada por v&iacute;rgula dos temas que ser&atilde;o exclu&iacute;dos.
*/
	function excluiTemas($temas)
	{
		if (file_exists($this->qyfile))
		{unlink($this->qyfile);}
		$temas = explode(",",$temas);
		foreach ($temas as $nome)
		{
			if ($layer = @$this->mapa->getlayerbyname($nome))
			{
				$grupo = $layer->group;
				$layer->set("status",MS_DELETE);
				$lgs = $this->mapa->getLayersIndexByGroup($grupo);
				if($lgs && $grupo != "")
				{
					foreach ($lgs as $lg)
					{
						$ll = $this->mapa->getlayer($lg);
						$ll->set("status",MS_DELETE);
					}
				}
				$lgs = $this->mapa->getLayersIndexByGroup($nome);
				if ($lgs)
				{
					foreach ($lgs as $lg)
					{
						$ll = $this->mapa->getlayer($lg);
						$ll->set("status",MS_DELETE);
					}
				}
			}
		}
		return("ok");
	}
/*
Method: ligaDesligaTemas

Liga desliga temas.

Torna temas vis&iacute;veis ou n&atilde;o no mapa alterando seu status.

Parametros:

$ligar - lista separada por v&iacute;rgula dos temas que ser&atilde;o ligados.

$desligar - lista separada por v&iacute;rgula dos temas que ser&atilde;o desligados. Se for igual a todos, todos os layers ser&atilde;o desligados.

$adicionar - sim|nao for&ccedil;a a adi&ccedil;&atilde;o de um tema se ele n&atilde;o existir no mapfile atual
*/
	function ligaDesligaTemas($ligar,$desligar,$adicionar="nao")
	{
		if(strTolower($adicionar) == "sim")
		{
			$teste = explode(",",$ligar);
			$adicionar = array();
			$verificar = array();
			foreach($this->layers as $layerE)
			{
				$verificar[] = $layerE->getmetadata("nomeoriginal");
				$verificar[] = $layerE->name;
			}
			foreach($teste as $t)
			{
				if(!in_array($t,$verificar)){$adicionar[] = $t;}
			}
			if(count($adicionar > 0))
			{
				$this->adicionaTema(implode(",",$adicionar),$this->locaplic,$random="sim");
				$this->salva();
				$this->mapa = ms_newMapObj($this->arquivo);
				$c = $this->mapa->numlayers;
				for ($i=0;$i < $c;++$i)
				{$this->layers[] = $this->mapa->getlayer($i);}
			}
		}
		if($desligar == "todos")
		{
			$desligar = $this->mapa->getalllayernames();
			$desligar = implode(",",$desligar);
		}
		if ($ligar != "")
		{
			$listal = explode(",",$ligar);
			foreach ($listal as $layer)
			{
				$ls = array();
				$vermultilayer = new vermultilayer();
				$vermultilayer->verifica($this->arquivo,$layer);
				if ($vermultilayer->resultado == 1) // o tema e multi layer
				{$ls = $vermultilayer->temas;}
				$ls[] = $layer;
				foreach ($ls as $l)
				{
					$l = $this->mapa->getlayerbyname($l);
					if($l)
					$l->set("status",2);
				}
			}
		}
		if ($desligar != "")
		{
			$listad = explode(",",$desligar);
			foreach ($listad as $layer)
			{
				$ls = array();
				$vermultilayer = new vermultilayer();
				$vermultilayer->verifica($this->arquivo,$layer);
				if ($vermultilayer->resultado == 1) // o tema e multi layer
				{$ls = $vermultilayer->temas;}
				else
				{$ls[] = $layer;}
				foreach ($ls as $l)
				{
					$l = $this->mapa->getlayerbyname($l);
					if($l)
					$l->set("status",0);
				}
			}
		}
		return("ok");
	}
/*
Method: adicionatemawms

Acrescenta um novo tema em um arquivo map file tendo como fonte um WMS.

Parametros:

$tema - Tema que ser&aacute; adicionado.
$servico - Endere&ccedil;o do web service.
$nome - Nome do tema para a legenda.
$proj - Lista das proje&ccedil;&otilde;es suportadas separadas por v&iacute;rgula.
$formato - Lista dos formatos de imagem separadas por v&iacute;rgula.
$locaplic - Diretório onde fica a aplica&ccedil;&atilde;o.
$tipo - Tipo de representa&ccedil;&atilde;o poligonal|linear|pontual.
$versao - Vers&atilde;o do getcapabilities
$nomecamada - nome da camada do WMS
$dir_tmp - diretório tempor&aacute;rio do I3Geo
$imgdir - diretório tempor&aacute;rio das imagens
$imgurl - url do imgdir
$tiporep - tipo de representa&ccedil;&atilde;o das fei&ccedil;&otilde;es do mapa. Quando definido, &eacute; criado um sld para ser aplicado ao layer. poligonal|linear|pontual
$suportasld - Suporta SLD sim|nao.
$formatosinfo - lista de formatos da requisi&ccedil;&atilde;o de atributos para a fun&ccedil;&atilde;o getfeatureinfo (default text/plain)
$time - espec&iacute;fico para WMS-T (par&acirc;mentro wms_time)
$tile - indica se o WMS e do tipo TILE ou nao (0 ou 1)
Include:
<wmswfs.php>
*/
	function adicionatemawms($tema,$servico,$nome,$proj,$formato,$locaplic,$tipo="",$versao,$nomecamada,$dir_tmp,$imgdir,$imgurl,$tiporep,$suportasld,$formatosinfo="text/plain",$time="",$tile=0)
	{
		//echo $tile;exit;
		if(file_exists($this->locaplic."/classesphp/wmswfs.php"))
		include_once($this->locaplic."/classesphp/wmswfs.php");
		else
		include_once("wmswfs.php");
		//limpa selecao
		if (file_exists($this->qyfile))
		{unlink ($this->qyfile);}
		$layer = ms_newLayerObj($this->mapa);
		$layer->set("status",MS_DEFAULT);
		if($nomecamada == "default")
		$nomecamada = $tema;
		$layer->setmetadata("CLASSE","SIM");
		$layer->setmetadata("TEXTO","NAO");
		$layer->setmetadata("tema",$nomecamada);
		$layer->setmetadata("nomeoriginal",$tema); //nome original do layer no web service
		$layer->setmetadata("tipooriginal",$tiporep);
		if ($tiporep != "")
		{
			$layer->set("type",MS_LAYER_POLYGON);
			if ($tiporep == "linear")
			{
				$layer->set("type",MS_LAYER_LINE);
				$classe = ms_newClassObj($layer);
				$estilo = ms_newStyleObj($classe);
				$cor = $estilo->color;
				$cor->setRGB(-1,-1,-1);
			}
			if ($tiporep == "pontual")
			{$layer->set("type",MS_LAYER_POINT);}
			$sld = $layer->generateSLD();
			$fp = fopen($dir_tmp."/".$imgdir."/".$layer->name."sld.xml", "a");
			fputs( $fp, $sld );
			fclose($fp);
		}
		$layer->set("name",nomeRandomico());
		$layer->set("type",MS_LAYER_RASTER);
		$layer->set("connection",$servico);

		if(ms_GetVersionInt() > 50201)
		{$layer->setconnectiontype(MS_WMS);}
		else
		{$layer->set("connectiontype",MS_WMS);}

		$epsg = "EPSG:4618";
		$e4291 = "nao";
		$ecrs = "nao";
		$pos = str_replace(" ",",",$proj);
		$pos = explode(",",$pos);
		if (count($pos) > 1)
		{
			foreach ($pos as $p)
			{
				$p = explode(":",$p);
				if ($p[1] == "4326")
				{$epsg = "EPSG:4326";}
				if ($p[1] == "4618")
				{$epsg = "EPSG:4618";$e4291="sim";}
				if ($p[1] == "84")
				{$ecrs = "CRS:84";$ecrs = "sim";}
			}
		}
		else {$epsg = $proj;}
		if ($e4291 == "sim"){$epsg = "EPSG:4618";}
		if ($ecrs == "sim"){$epsg = $ecrs;}
		$epsg = trim($epsg);
		$layer->setmetadata("wms_srs",$epsg);
		$layer->setmetadata("wms_crs",$epsg);
		$layer->setmetadata("wms_name",$tema);
		$layer->setmetadata("wms_server_version",$versao);
		$layer->setmetadata("wms_formatlist",$formato);
		$layer->setmetadata("formatosinfo",$formatosinfo);
		$layer->setmetadata("wms_exceptions_format","application/vnd.ogc.se_xml");
		$layer->setmetadata("wms_style",$nome);
		$layer->setmetadata("wms_connectiontimeout","30");
		$layer->setmetadata("wms_force_separate_request","1");
		//esse parametro e especifico do i3geo. Se for 1 indica um servico do tipo tile
		$layer->setmetadata("wms_tile",$tile);
		if($time != "")
		$layer->setmetadata("wms_time",$time);
		//pega o tipo de formato de imagem que deve ser requisitado
		//a prefer&ecirc;ncia &eacute; png, mas se n&atilde;o for poss&iacute;vel, pega o primeiro da lista de formatos
		//dispon&iacute;veis no formato
		if (stristr($formato,"png"))
		{$im = "image/png";}
		else
		{
			$im = explode(",",$formato);
			$im = $im[0];
		}
		if (($tiporep != "") && ($suportasld == "sim"))
		{
			$layer->setmetadata("wms_sld_url",$imgurl.$layer->name."sld.xml");
			$layer->setmetadata("sld",$dir_tmp."/".$imgdir."/".$layer->name."sld.xml");
		}
		else
		{
			$urllegenda = $servico."&service=wms&request=getlegendgraphic&version=".$versao."&service=wms&layer=".$tema."&format=".$im;
			$layer->setmetadata("legendawms",$urllegenda);
		}
		$layer->setmetadata("wms_format",$im);
		$layer->setmetadata("wfs","nao");
		$layer->setmetadata("wfs","nao");
		$c = $layer->offsite;
		$c->setrgb(255,255,255);
		$of = $this->mapa->outputformat;
		//$of->set("imagemode",MS_IMAGEMODE_RGB);
		$this->salva();
	}
/*
Method: converteWS

Transforma o mapa atual em um web service.

O novo map file &eacute; armazenado no mesmo diretório do map file original.

Parametros:

$locaplic - localiza&ccedil;&atilde;o do i3Geo

$h - host name

Return:

Endere&ccedil;o do WMS
*/
	function converteWS($locaplic,$h)
	{
		//$nomews = str_replace(".map","ws.map",$this->arquivo);
		$nomeurl = "/ogc.php?tema=".$this->arquivo;
		/*
		$w = $this->mapa->web;
		$w->set("template","");
		//adiciona os parametros no nivel do mapa
		$this->mapa->setmetadata("wms_title","I3Geo");
		$this->mapa->setmetadata("wms_onlineresource","http://".$h.$nomeurl);
		$this->mapa->setmetadata("wms_srs","EPSG:4291");
		$this->mapa->setmetadata("ows_enable_request","*");
		//$this->mapa->setmetadata("wms_getcontext_enabled","1");
		foreach ($this->layers as $layer)
		{
			$n = pegaNome($layer);
			$layer->setmetadata("wms_title",$n);
			$layer->setmetadata("wms_name",$n);
			$layer->setmetadata("wms_srs","EPSG:4291 EPSG:4326");
			//$layer->setmetadata("wms_getcontext_enabled","1");
			$layer->setmetadata("WMS_INCLUDE_ITEMS","all");
			//$layer->setmetadata("wms_onlineresource","http://".$h.$nomeurl);
			$layer->set("status","ON");
			$layer->set("template","none.htm");
			$layer->setmetadata("gml_include_items","all");
			$layer->set("dump",MS_TRUE);
			$c = $layer->getclass(0);
			if ($c->name == "")
			{$c->name = " ";}
		}
		$eb = $this->mapa->scalebar;
		$eb->set("status",MS_OFF);
		$this->mapa->save($nomews);
		*/
		return($nomeurl);
	}
/*
Method: converteWMC

Transforma o mapa atual em um Web Map Context.

O novo map file &eacute; armazenado no mesmo diretório do map file original.

Parametros:

$locmapserv - localiza&ccedil;&atilde;o do CGI do mapserver

$h - host name

Return:

Endere&ccedil;o do WMC
*/
	function converteWMC($locmapserv,$h)
	{
		$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
		$protocolo = $protocolo[0];
		$protocolo1 = strtolower($protocolo) . '://'.$_SERVER['SERVER_NAME'];
		$protocolo = strtolower($protocolo) . '://'.$_SERVER['SERVER_NAME'] .":". $_SERVER['SERVER_PORT'];
		$urli3geo = str_replace("/classesphp/mapa_controle.php","",$protocolo.$_SERVER["PHP_SELF"]);

		$nomews = str_replace(".map","wmc.map",$this->arquivo);
		$nomeurl = $locmapserv."?map=".$nomews;
		$nomeogc = $urli3geo."/ogc.php?tema=".$nomews;
		$w = $this->mapa->web;
		$w->set("template","");
		// adiciona os parametros no nivel do mapa
		$this->mapa->setmetadata("wms_title","i3Geo");
		$this->mapa->setmetadata("wms_onlineresource","http://".$h.$nomeurl);
		$this->mapa->setmetadata("wms_srs","EPSG:4618");
		$this->mapa->setmetadata("wms_getcontext_enabled","1");
		foreach ($this->layers as $layer)
		{
			if($layer->connectiontype != 7 && $layer->connectiontype != 9){
				$n = pegaNome($layer);
				$layer->setmetadata("wms_title",$n);
				$codigo = $layer->getmetadata("nomeoriginal");
				if($codigo == "")
				{$codigo = $layer->name;}
				$layer->setmetadata("wms_server_version","1.0.0");
				$layer->setmetadata("wms_name",$codigo);
				//$layer->setmetadata("wms_srs","EPSG:4291 EPSG:4326");
				$layer->setmetadata("WMS_INCLUDE_ITEMS","all");
				$layer->setmetadata("wms_onlineresource",$nomeogc."&layer=".$layer->name);
				$layer->setmetadata("gml_include_items","all");
				$layer->setmetadata("wms_format","image/png");
				$layer->setmetadata("wms_formatlist","image/gif,image/png,image/png; mode=24bit,image/jpeg,image/wbmp,image/tiff");
				$layer->set("dump",MS_TRUE);
				$layer->set("status","ON");
				$layer->set("template","none.htm");
				$c = $layer->getclass(0);
				if ($c->name == "")
				{$c->name = " ";}
				if($layer->connectiontype != "WS_WMS" && $layer->getmetadata("permiteogc") == "" && $layer->getmetadata("TEMALOCAL") == ""){
					if(ms_GetVersionInt() > 50201)
					{$layer->setconnectiontype(MS_WMS);}
					else
					{$layer->set("connectiontype",MS_WMS);}
					$data = $urli3geo."/ogc.php?tema=".$codigo;
					$layer->set("connection",$data);
					$layer->set("data","");
					if(file_exists("../temas/".$codigo.".map"))
					{$layer->setmetadata("wms_onlineresource",$data);}
				}
			}
			else{
				$layer->setmetadata("wms_onlineresource",$layer->connection);
			}
		}
		$eb = $this->mapa->scalebar;
		$eb->set("status",MS_OFF);
		$this->mapa->save($nomews);
		return($nomeurl."&service=WMS&request=GetContext&version=1.1.0");
	}
/*
Method: adicionaTemaGeoJson

Adiciona um canal GeoRSS como um tema no mapa.

Parametros:

$servico - Endere&ccedil;o (url)  do GeoJson.
$dir_tmp - Diretório onde o arquivo ser&aacute; criado.
$locaplic - Localiza&ccedil;&atilde;o do I3geo

*/
	function adicionaTemaGeoJson($servico,$dir_tmp,$locaplic){
		$servico = str_replace("|","?",$servico);
		$servico = str_replace("#","&",$servico);
		$tipos = array("pontos","linhas","poligonos");
		foreach($tipos as $tipo){
			$novolayer = ms_newLayerObj($this->mapa);
			$novolayer->set("connection",$servico);
			if(ms_GetVersionInt() > 50201)
			{$novolayer->setconnectiontype(MS_OGR);}
			else
			{$novolayer->set("connectiontype",MS_OGR);}
			$nome = nomeRandomico(10)."geoJson";
			$novolayer->set("name",$nome.$tipo);
			$novolayer->setmetadata("TEMA","GeoJson ".$nome." ".$tipo);
			$novolayer->setmetadata("DOWNLOAD","SIM");
			$novolayer->setmetadata("CLASSE","SIM");
			if($tipo == "pontos")
			{$novolayer->set("type",MS_LAYER_POINT);}
			if($tipo == "linhas")
			{$novolayer->set("type",MS_LAYER_LINE);}
			if($tipo == "poligonos")
			{$novolayer->set("type",MS_LAYER_POLYGON);}
			$novolayer->set("type",$tipo);
			$novolayer->set("data","OGRGeoJSON");
			$novolayer->setfilter("");
			$classe = ms_newClassObj($novolayer);
			$classe->set("name","");
			$estilo = ms_newStyleObj($classe);
			if($tipo == "pontos")
			{
				$estilo->set("symbolname","ponto");
				$estilo->set("size",10);
			}
			$estilo->color->setrgb(200,50,0);
			$estilo->outlinecolor->setrgb(0,0,0);
			// le os itens
			$novolayer->set("status",MS_DEFAULT);
			$novolayer->set("template","none.htm");
		}
		return "ok";
	}
/*
Method: adicionaTemaGeoRSS

Adiciona um canal GeoRSS como um tema no mapa.

Parametros:

$servico - Endere&ccedil;o (url) do RSS.
$dir_tmp - Diretório onde o arquivo ser&aacute; criado.
$locaplic - Localiza&ccedil;&atilde;o do I3geo
$canal - Identificador do canal (ordem em que est&aacute; no RSS)
*/
	function adicionaTemaGeoRSS($servico,$dir_tmp,$locaplic,$canal)
	{
		$xml = simplexml_load_file($servico);
		$conta = 0;
		foreach($xml->channel as $c){
			if ($conta == $canal)
			{$canal = $c;}
		}
		$resultado = array();
		$tipog = "";
		foreach ($canal->item as $item){
			$env = array();
			//define o tipo
			if ($item->xpath('geo:lat'))
			{$tipog = "geo";}
			if ($item->xpath('georss:point'))
			{$tipog = "georsspoint";}
			if ($item->xpath('georss:where'))
			{$tipog = "envelope";}
			if ($tipog == "envelope"){
				foreach ($item->xpath('georss:where') as $w)
				{
					foreach ($w->xpath('gml:Envelope') as $e)
					{
						//$lc = $e->xpath('gml:lowerCorner');
						$lc = (string) $e->children('gml', TRUE)->lowerCorner;
						//$uc = $e->xpath('gml:upperCorner');
						$uc = (string) $e->children('gml', TRUE)->upperCorner;
						$lc = explode(" ",$lc);
						$uc = explode(" ",$uc);
						if (is_numeric($lc[0]))
						{
							$ymin = $lc[0];
							$ymax = $uc[0];
							$xmin = $lc[1];
							$xmax = $uc[1];
							if ($ymin !="")
							{$env = array($xmin,$ymin,$xmax,$ymax);}
						}
					}
				}
			}
			if ($tipog == "geo"){
				if ($item->xpath('geo:lon')){
					$x = (string) $item->children('geo', TRUE)->lon;
				}
				else{
					$x = (string) $item->children('geo', TRUE)->long;
				}
				//$y = $item->xpath('geo:lat');
				$y = (string) $item->children('geo', TRUE)->lat;
				$env = array($y,$x);

			}
			if ($tipog == "georsspoint")
			{
				//$temp = $item->xpath('georss:point');
				$temp = (string) $item->children('georss', TRUE)->point;
				$env = array( explode(" ",$temp) );
			}
			if (count($env) > 0){
				$resultado[] = array(ixml($item,"title"),ixml($item,"link"),ixml($item,"description"),ixml($item,"category"),$env);
			}
		}
		//cria o shapefile com os dados
		if (count($resultado) > 0){
			//para manipular dbf
			include_once (dirname(__FILE__)."/../pacotes/phpxbase/api_conversion.php");
			$diretorio = dirname($this->arquivo);
			$tipol = MS_SHP_POLYGON;
			if ($tipog == "georsspoint"){$tipol = MS_SHP_POINT;}
			if ($tipog == "geo"){$tipol = MS_SHP_POINT;}
			$novonomelayer = nomeRandomico(10)."georss";
			$nomeshp = $diretorio."/".$novonomelayer;
			$novoshpf = ms_newShapefileObj($nomeshp, $tipol);
			$def[] = array("TITULO","C","254");
			$def[] = array("LINK","C","254");
			$def[] = array("DESC","C","254");
			$def[] = array("CATEGORIA","C","254");
			if(!function_exists(dbase_create))
			{$db = xbase_create($nomeshp.".dbf", $def);xbase_close($db);}
			else
			{$db = dbase_create($nomeshp.".dbf", $def);dbase_close($db);}
			//acrescenta os pontos no novo shapefile
			$dbname = $nomeshp.".dbf";
			$db=xbase_open($dbname,2);
			$reg = array();
			$novoshpf = ms_newShapefileObj($nomeshp.".shp", -2);
			//acrescenta os shapes
			foreach ($resultado as $r){
				$pts = $r[4];
				if ($tipol == MS_SHP_POLYGON){
					$shp = ms_newShapeObj(MS_SHP_POLYGON);
					$linha = ms_newLineObj();
					$linha->addXY($pts[0],$pts[3]);
					$linha->addXY($pts[2],$pts[3]);
					$linha->addXY($pts[2],$pts[1]);
					$linha->addXY($pts[0],$pts[1]);
					$linha->addXY($pts[0],$pts[3]);
				}
				else{
					$shp = ms_newShapeObj(MS_SHP_POINT);
					$linha = ms_newLineObj();
					$linha->addXY($pts[1],$pts[0]);
				}
				$shp->add($linha);
				$novoshpf->addShape($shp);
				$reg = array($r[0],$r[1],$r[2],$r[3]);
				xbase_add_record($db,$reg);
				$reg = array();
			}
			xbase_close($db);
			if ($tipog == "georsspoint" || $tipog == "geo"){
				$tipol = MS_LAYER_POINT;
			}
			else{
				$tipol = MS_LAYER_POLYGON;
			}

			$layer = criaLayer($this->mapa,$tipol,MS_DEFAULT,"GeoRSS","SIM");
			$layer->set("data",$nomeshp.".shp");
			$layer->set("name",basename($nomeshp));
			$layer->setmetadata("DOWNLOAD","sim");
			$layer->setmetadata("TEMALOCAL","SIM");
			if($tipol == MS_LAYER_POLYGON)
			{
				$classe = $layer->getclass(0);
				$estilo = $classe->getstyle(0);
				$estilo->set("symbolname","p4");
				$estilo->set("size",5);
				$cor = $estilo->color;
				$cor->setrgb(255,0,0);
				$coro = $estilo->outlinecolor;
				$coro->setrgb(255,0,0);
			}
			//$layer->set("transparency",50);
			$layer->setmetadata("nomeoriginal",basename($nomeshp));
			//echo $tipol;
			return("ok");
		}
		return("erro");
	}
/*
Method: adicionaTemaSHP

Adiciona um tema a partir de um arquivo shape file armazenado no servidor de arquivos.

Parametros:
$arq - Nome do shape file.
*/
	function adicionaTemaSHP($arq)
	{
		if (file_exists($arq))
		{
			$s = ms_newShapefileObj($arq,-1);
			/*
			if($this->v == 6)
			{$shape = $s->getshape(new resultObj(0));}
			else
			{$shape = $s->getshape(0);}
			*/
			$shape = $s->getshape(0);
			$t = $shape->type;
			$tipo = MS_LAYER_POLYGON;
			if ($t == 0)
			{$tipo = MS_LAYER_POINT;}
			if ($t == 1)
			{$tipo = MS_LAYER_LINE;}
			$layer = criaLayer($this->mapa,$tipo,MS_DEFAULT,basename($arq),"SIM");
			$layer->set("data",$arq);
			$layer->set("name",basename($arq));
			$layer->setmetadata("DOWNLOAD","nao");
			$layer->setmetadata("TEMALOCAL","NAO");
			$layer->setmetadata("nomeoriginal",basename($arq));
		}
		return("ok");
	}
/*
Method: adicionaTemaIMG

Adiciona um tema a partir de um arquivo imagem armazenado no servidor de arquivos.

Parametros:
$arq - Nome do arquivo.
*/
	function adicionaTemaIMG($arq)
	{
		if (file_exists($arq))
		{
			$layer = criaLayer($this->mapa,MS_LAYER_RASTER,MS_DEFAULT,basename($arq),"SIM");
			$layer->set("data",$arq);
			$layer->set("name",basename($arq));
			$layer->setmetadata("DOWNLOAD","nao");
			$layer->setmetadata("TEMALOCAL","NAO");
		}
		return("ok");
	}
	function adicionaAcesso($codigo_tema,$locaplic)
	{
    	$resultado = array();
    	include("$locaplic/admin/php/conexao.php");
    	if(!empty($esquemaadmin)){
    		$esquemaadmin = $esquemaadmin.".";
    	}
    	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_acessostema (codigo_tema,nacessos,dia,mes,ano) VALUES ('$codigo_tema',1,".abs(date("d")).",".abs(date("m")).",".abs(date("Y")).")");
		$dbh = null;
    	$dbhw = null;
	}
	//
	//esta fun&ccedil;&atilde;o n&atilde;o est&aacute; concluida
	//n&atilde;o use
	//pois n&atilde;o funcionar&aacute;
	//
	function insereJOIN($string,$layername)
	{
		//le o map file
		$abre = fopen($this->arquivo, "r");
		while (!feof($abre))
		{
			$buffer = fgets($abre);
			$maparray[] = $buffer;
		}
		fclose($abre);
		$novoarray = array();
		$conta = 0;
		$pega = "nao";
		//procura a string "querymap"
		foreach ($maparray as $e)
		{
			$testa = explode("NAME",$e);
			if (count($testa) > 1)
			{$pega = "sim";}
			$testa = explode('"'.$layername.'"',$e);
			if ((count($testa) > 1) && ($pega == "sim"))
			{
				$novoarray[] = $string;
				$pega = "nao";
			}
			$novoarray[] = $e;
		}
		//salva o mapfile
		$abre = fopen($this->arquivo, "wt");
		foreach($novoarray as $linha)
		{$escreve = fwrite ($abre,$linha);}
		$fecha = fclose ($abre);
	}
/*
Method: converteInterfacePara

Converte o mapfile atual ajustando o funcionamento para uma interface espec&iacute;fica

Parametros:

$interface - googlemaps|openlayers
*/
	function converteInterfacePara($interface){
		if($interface == "openlayers"){
			$prefixo = "ol";
			$this->mapa->setProjection("+proj=longlat +ellps=GRS67 +no_defs");
		}
		else
		{$prefixo = "gm";}
		foreach($this->layers as $l){
			$opacidadeM = $l->getmetadata($prefixo."opacity");
			$statusM = $l->getmetadata($prefixo."status");
			if($opacidadeM == "")
			{$l->setmetadata($prefixo."opacity",100);}
			else
			{$l->set("opacity",$prefixo."opacity");}
			if($statusM != ""){
				if($statusM == "OFF")
				{$l->set("status",MS_OFF);}
				if($statusM == "DEFAULT")
				{$l->set("status",MS_DEFAULT);}
			}
			if($prefixo == "gm" && ($l->name == "mundo" || $l->name == "estados"))
			{$l->set("status",MS_OFF);}
			if($l->opacity == 0)
			{$l->set("opacity",100);}
		}
		$this->salva();
		return "ok";
	}
}
?>