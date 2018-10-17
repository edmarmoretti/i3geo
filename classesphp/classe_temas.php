<?php
/*
Title: classe_temas.php

Manipula&ccedil;&atilde;o de temas.

Adiciona, remove, muda ordem, etc.

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
	public $mapa;
	/*
	 Variavel: $tema

	 String
	 */
	public $tema;
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

	Temas do grupo que s&atilde;o vis&iacute;veis em fun&ccedil;&atilde;o da escala
	*/
	protected $visiveis;
	/*
	Variavel: $indices

	Indices dos layers do grupo
	*/
	protected $indices;
	/*
	Variavel: $qyfile

	Nome do arquivo de sele&ccedil;&atilde;o (.qy)
	*/
	public $qyfile;
	public $qyfileTema;
	/*
	Variavel: $v

	Vers&atilde;o atual do Mapserver (primeiro d&iacute;gito)
	*/
	public $v;
	/*
	Variavel: $vi

	Vers&atilde;o atual do Mapserver (valor inteiro)

	Returns the MapServer version number (x.y.z) as an integer (x*10000 + y*100 + z). (New in v5.0) e.g. V5.4.3 would return 50403
	*/
	public $vi;

/*
function __construct

Cria um objeto map e seta a variavel tema

parameters:
$map_file - Endere&ccedil;o do mapfile no servidor.

$tema - nome do tema que ser&aacute; processado. (Pode ser uma lista separada por ',' mas s� funciona nas fun&ccedil;&otilde;es que trabalham sobre os &iacute;ndices dos layers)

$locaplic - (opcional) endere&ccedil;o do i3geo

$ext - (opcional) extens&atilde;o geogr&aacute;fica que ser&aacute; aplicada ao mapa
*/
	function __construct($map_file,$tema=null,$locaplic="",$ext="")
	{
		//error_reporting(0);
		include(dirname(__FILE__)."/../ms_configura.php");
		$this->postgis_mapa = $postgis_mapa;
		if($map_file != ""){
			$map_file = str_replace(".map","",$map_file).".map";
			$this->qyfile = str_replace(".map",".qy",$map_file);
			$this->qyfileTema = dirname($map_file)."/".$tema."_qy.map";
			$this->arquivo = $map_file;
		}

		if(file_exists($locaplic."/funcoes_gerais.php")){
			include_once($locaplic."/funcoes_gerais.php");
			include_once($locaplic."/classe_vermultilayer.php");
		}
		else {
			include_once("funcoes_gerais.php");
			include_once("classe_vermultilayer.php");
		}

		$this->tema = $tema;
		$this->v = versao();
		$this->vi = $this->v["inteiro"];
		$this->v = $this->v["principal"];

		$this->locaplic = $locaplic;
		if($map_file != "" && file_exists($map_file))
		{
			$this->mapa = ms_newMapObj($map_file);
			substituiConObj($this->mapa,$postgis_mapa);
			$this->arquivo = $map_file;
			if($tema != "")
			{
				$listaTemas = str_replace(" ",",",$tema);
				$listaTemas = explode(",",$tema);
				foreach ($listaTemas as $tema){
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
			if($ext && $ext != ""){
				$e = explode(" ",$ext);
				$extatual = $this->mapa->extent;
				$extatual->setextent((min($e[0],$e[2])),(min($e[1],$e[3])),(max($e[0],$e[2])),(max($e[1],$e[3])));
			}
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
function: pegaMetadata

Pega os metadata do tema

parameter:

*/
	function pegaMetadata(){
		if(!$this->layer){return "erro";}
		$buscar = array("METAESTAT","METAESTAT_ID_MEDIDA_VARIAVEL");
		$meta = array();
		foreach($buscar as $b){
			$meta[$b] = $this->layer->getmetadata($b);
		}
		return array(
			$this->layer->name => $meta
		);
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
		{
			$this->layer->setprocessing($processo);
			$this->layer->setMetaData("cache","");
		}

		return true;
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

Gera a imagem desenhando apenas um tema na resolu&ccedil;&atilde;o atual.
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

Temas poligonais s&atilde;o transformados em lineares, e lineares em poligonais.
A mudan&ccedil;a &eacute; feita apenas na representa&ccedil;&atilde;o do layer.
*/
	function alteraRepresentacao(){
		$retorno = true;
		foreach ($this->grupo as $l){
			$l = $this->mapa->getlayerbyname($l);
			if ($l->type == MS_LAYER_LINE){
				$l->set("type",MS_LAYER_POLYGON);
			}
			elseif ($l->type == MS_LAYER_POLYGON){
				$l->set("type",MS_LAYER_LINE);
			}
			if (($l->type < 1) || ($l->type > 2)){
				$retorno = false;
			}
			if ($this->layer){
				$this->layer->setMetaData("cache","");
			}
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
		if (file_exists($this->qyfile))
		{unlink ($this->qyfile);}
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
		if (file_exists($this->qyfile))
		{unlink ($this->qyfile);}
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

lista - lista com a nova ordem para os temas. A lista cont&eacute;m os nomes dos temas separados por v&iacute;rgula.
*/
	function reordenatemas($lista){
		//error_log("kkkk-------".$lista);
		$nlayers = $this->mapa->numlayers;
		$lista = explode(",",$lista);
		$lista = array_reverse($lista);
		$novaordem = array();
		foreach ($lista as $l){
			for ($i=0;$i<$nlayers;++$i){
				$la = $this->mapa->getlayer($i);
				//$la->set("status",MS_DEFAULT);
				if(strtolower($la->getmetadata("escondido")) == "sim")	{
					if (!in_array($la->index,$novaordem)){
						$novaordem[] = $i;
						//error_log("-------xxx".$la->name);
					}
				}
				else{
					//$g = strtoupper($la->group);
					$n = strtoupper($la->name);
					//if ((strtoupper($l) == $n) || (strtoupper($l) == $g)){
					if (strtoupper($l) == $n){
						$novaordem[] = $i;
					}
				}
			}
		}
		//acrescenta os layers que ficaram de fora
		for ($i=0;$i<$nlayers;++$i){
			if (!in_array($i,$novaordem)){
				$novaordem[] = $i;
			}
		}
		$this->mapa->setlayersdrawingorder($novaordem);
		return "ok";
	}

/*
function: zoomTema

Zoom para um tema.

Calcula a extens&atilde;o geogr&aacute;fica de um tema e ajusta o mapa para essa extens&atilde;o.
*/
	function zoomTema()
	{
		if(!$this->layer){return "erro";}
		if($this->mapa->getmetadata("interface") == "googlemaps"){
			$projO = $this->mapa->getProjection();
			$this->mapa->setProjection(pegaProjecaoDefault("proj4"));
		}
		$prjMapa = "";
		$prjTema = "";
		if($this->layer->type != MS_LAYER_RASTER){
			$prjMapa = $this->mapa->getProjection();
			$prjTema = $this->layer->getProjection();
		}
		$extatual = $this->mapa->extent;
		$ret = $this->layer->getmetadata("extensao");
		//
		//necess&aacute;rio para evitar que em qualquer redesenho do mapa, seja aplicado o zoom para o tema marcado com aplicaextensao
		//
		$this->layer->setmetadata("aplicaextensao","");
		if($ret == "" && $this->layer->type == MS_LAYER_RASTER){
			$ret = "-75.233614607 -33.7515829981 -27.592958622 5.272156";
		}
		if ($ret == ""){
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
		else{
			$ret = explode(" ",$ret);
			$extatual->setextent($ret[0],$ret[1],$ret[2],$ret[3]);
			//echo "oi";exit;
		}
		if($this->mapa->getmetadata("interface") == "googlemaps"){
			$this->mapa->setProjection($projO);
		}
		return("ok");
	}
	/*
	 function: pegaFuncoesJs

	 Pega o valor do metadata FUNCOESJS
	 */
	function pegaFuncoesJs()
	{
	    if(!$this->layer){
	        return "erro";
	    }
	    $texto = $this->layer->getmetadata("FUNCOESJS");
	    //if ($texto != "" && !mb_detect_encoding($texto,"UTF-8",true)){
	    //    $texto = mb_convert_encoding($texto,"UTF-8","ISO-8859-1");
	    //}
	    return $texto;
	}
	/*
	 function: insereFuncoesJs

	 Insere o valor do metadata FUNCOESJS
	 */
	function insereFuncoesJs($texto)
	{
	    if(!$this->layer){
	        return false;
	    }
	    //if ($texto != "" && !mb_detect_encoding($texto,"UTF-8",true)){
	    //    $texto = mb_convert_encoding($texto,"UTF-8","ISO-8859-1");
	    //}
	    $this->layer->setmetadata("FUNCOESJS",$texto);
	    return true;
	}
	/*
	 function: limpaFuncoesJs

	 Limpa o valor do metadata FUNCOESJS
	 */
	function limpaFuncoesJs()
	{
	    if(!$this->layer){
	        return false;
	    }
	    $this->layer->setmetadata("FUNCOESJS","");
	    return true;
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
		$fil = $this->layer->getfilterstring();
		if ($fil == '"(null)"' || $fil == ''){
		    return "";
		}
		else{
		    return mb_convert_encoding($fil, "ISO-8859-1", "UTF-8");
		}
	}
/*
function: insereFiltro

Inclui um filtro no tema.

parameters:

$filtro - string com o filtro. As aspas simples devem ser substitu&iacute;das por |.

$testa - Testa o filtro e retorna uma imagem.
*/
	function insereFiltro($filtro,$testa="",$base64="nao")
	{
	    $this->selecaoLimpa();
		if($base64 == "sim"){
			//$filtro = base64_decode($filtro);
		}
		$filtro = str_ireplace("select ","",$filtro);
		$filtro = str_ireplace(" where ","",$filtro);
		$filtro = str_ireplace("update","",$filtro);
		$filtro = str_ireplace("delete","",$filtro);
		foreach($this->indices as $indice){
			$layer = $this->mapa->getlayer($indice);
			$items = pegaItens($layer);
			if(!$layer){
				return "erro";
			}
			$layer->setmetadata("cache","");
			$layer->set("template","none.htm");
			$fil = $layer->getFilterString();
			$filtro = str_replace("|","'",$filtro);
			/*
			if ($layer->connectiontype == MS_POSTGIS){
				$filtro = str_replace("'[","",$filtro);
				$filtro = str_replace("[","",$filtro);
				$filtro = str_replace("]'","",$filtro);
				$filtro = str_replace("]","",$filtro);
				$filtro = str_replace("("," ",$filtro);
				$filtro = str_replace(")"," ",$filtro);
			}
			*/
			if ($filtro != ""){
				//testa o filtro para resolver problemas de acentuacao
				if(mb_convert_encoding($filtro,"UTF-8","ISO-8859-1") != mb_convert_encoding($filtro,"ISO-8859-1","UTF-8")){
				    $filtro = str_replace("*","'",$filtro);
				    $teste = $layer->querybyattributes($items[0],$filtro,1);
				    if($teste != MS_SUCCESS){
						$teste = $this->layer->queryByAttributes($items[0], mb_convert_encoding($filtro,"ISO-8859-1","UTF-8"), 1);
						if($teste != MS_SUCCESS){
							$filtro =  mb_convert_encoding($filtro,"UTF-8","ISO-8859-1");
						} else {
						    $filtro = mb_convert_encoding($filtro,"ISO-8859-1","UTF-8");
						    $teste = $layer->querybyattributes($items[0],$filtro,1);
						    if($teste != MS_SUCCESS){
						        $filtro = "";
						    }
						}
					}
				} else {
					//testa a questao de ser string ou numero
					//$layer->setfilter($filtro);
				    $teste = $layer->querybyattributes($items[0],str_replace("*","'",$filtro),1);
				    if($teste != MS_SUCCESS){
				        $filtro = str_replace("*","",$filtro);
				    }
				    if($teste == MS_SUCCESS){
				        $filtro = str_replace("*","'",$filtro);
				    }
				}
			}
			$layer->setfilter($filtro);
			if ($testa == ""){
				$layer->setMetaData("cache","");
			} else {
				$layer->set("status",MS_DEFAULT);
			}
		}
		if ($testa != ""){
			$i = gravaImagemMapa($this->mapa);
			return ($i["url"]);
		}
		return true;
	}
/*
function: mudaTransparencia

Muda a transpar&ecirc;ncia do tema.

parameter:
$valor - Novo valor da transpar&ecirc;ncia
*/
	function mudaTransparencia($valor){
		foreach ($this->grupo as $lg){
			$ll = $this->mapa->getlayerbyname($lg);
			$ll->setmetaData("cache","");
			if($this->v == 4){
				$ll->set("transparency",$valor);
				return("ok");
			}
			if($this->v < 7){
				$ll->set("opacity",$valor);
				return("ok");
			}
			if($this->v >= 7){
				//$ll->composite->opacity = $valor;
				//$ll->set("opacity",$valor);
				$ll->updateFromString('LAYER COMPOSITE OPACITY '.$valor.'END END');
				/*
				$numclasses = $ll->numclasses;
				for($i=0;$i<$numclasses;++$i){
					$classe = $this->layer->getclass($i);
					$numestilos = $classe->numstyles;
					for($j=0;$j<$numestilos;++$j){
						$estilo = $classe->getstyle($j);
						$estilo->set("opacity",$valor);
					}
				}
				*/
				return("ok");
			}
		}
	}
	/*
	 function: mudaOffsite

	 Muda o offsite do tema.

	 parameter:
	 $valor - Novo valor separado por virgulas
	 */
	function mudaOffsite($valor){
		if($valor == -1 || $valor == "null" || empty($valor)){
			$valor = "-1,-1,-1";
		}
		$cor = $this->layer->offsite;
		$c = explode(",",$valor);
		if(count($c) < 3){
			$c = explode(" ",$valor);
		}
		$cor->setrgb($c[0],$c[1],$c[2]);
		$this->layer->setmetadata("cache","");
		return true;
	}
/*
function: inverteStatusLegenda

Muda o metadata CLASSE, invertendo seu valor

*/
	function inverteStatusLegenda()
	{
				//error_reporting(0);
		$valor = $this->layer->getmetadata("classe");
		if($valor == "" || strtolower($valor) == "sim")
		{$valor = "NAO";}
		else
		{$valor = "SIM";}
		foreach ($this->grupo as $lg)
		{
			$ll = $this->mapa->getlayerbyname($lg);
			$ll->setmetaData("classe",$valor);
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

		foreach ($this->grupo as $lg){
			$ll = $this->mapa->getlayerbyname($lg);
			$meta = $ll->getmetadata("tema");
			if (($meta != "") && ($meta != "NAO")){
				if (mb_detect_encoding ( $valor, 'UTF-8, ISO-8859-1' ) == "UTF-8") {
					$valor = utf8_decode ( $valor );
				}
				$ll->setmetadata("tema",$valor);
			}
		}
		return ("ok");
	}
	/*
	 function: contorno

	 Ativa ou desativa o contorno das classes.
	 */
	function contorno()	{
		$ll = $this->layer;
		$ll->setmetadata("cache","nao");
		$nclasses = $ll->numclasses;
		for ($i=0; $i < $nclasses; ++$i){
			$c = $ll->getclass($i);
			$e = $c->getstyle(0);
			$cor = $e->outlinecolor;
			if( $c->getmetadata("CORORIGINAL") == "" && $cor->red == -1){
				$cor->setrgb(255,255,255);
				$hex = $cor->red.",".$cor->green.",".$cor->blue;
				$c->setmetadata("CORORIGINAL",$hex);
			} else {
				$hex = $cor->red.",".$cor->green.",".$cor->blue;
				if( $c->getmetadata("CORORIGINAL") == ""){
					$c->setmetadata("CORORIGINAL",$hex);
				}
				if($e->outlinecolor->red == -1){
					$hex = explode(",",$c->getmetadata("CORORIGINAL"));
					$cor->setRgb($hex[0],$hex[1],$hex[2]);
				} else {
					$cor->setrgb(-1,-1,-1);
				}
			}
		}
		return ("ok");
	}
/*
function: copiaTema

Copia um tema

*/
	function copiaTema()
	{
		foreach ($this->grupo as $lg){
			$ll = $this->mapa->getlayerbyname($lg);
			$layer = ms_newLayerObj($this->mapa, $ll);
			$layer->setmetadata("nomeoriginal",$ll->getmetadata("nomeoriginal"));
			$meta = $layer->getmetadata("tema");
			if (($meta != "") && ($meta != "NAO")){
				$layer->setmetadata("tema","Copia de ".$meta);
			}
			$layer->setmetadata("cache","");
			$novoname = "copia".nomerandomico();
			$layer->set("name",$novoname);
			$layer->set("group","");
		}
		return ("ok");
	}
/*
function: insereFeature

Insere elemento gr&aacute;fico em um tema.

parameters:

$marca - nome do s&iacute;mbolo que ser&aacute; utilizado

$tipo - Tipo de elemento GRAFICOPIZZA|POLYGON|LINE|POINT|ANNOTATION|limpaponto.

$xy - Pares de coordenadas separadas por espa&ccedil;o.

$texto - Texto que ser&aacute; inserido, no caso do tipo ANNOTATION.

$position - Posi&ccedil;&atilde;o da &acirc;ncora do texto.

$partials - Corta texto nas bordas do mapa.

$offsetx - Deslocamento em X.

$offsety - Deslocamento em Y.

$minfeature - Tamanho m&iacute;nimo que o texto deve ter.

$mindistance - Dist&acirc;ncia m&iacute;nima entre os textos.

$force - For&ccedil;a colis&atilde;o.

$shadowcolor - Cor da sombra.

$shadowsizex - Tamanho em X da sombra.

$shadowsizey - Tamanho em Y da sombra.

$outlinecolor - Cor do contorno.

$cor - Cor do texto.

$sombray - Deslocamento Y da sombra.

$sombrax - Deslocamento X da sombra.

$sombra - Inclui sombra.

$fundo - Cor do fundo.

$angulo - &Acirc;ngulo do texto.

$tamanho - Tamanho do texto.

$fonte - Fonte

$wrap - caractere que indica quebra de linha

$wkt - boolean indicando se $xy e um WKT
*/
	function insereFeature($marca,$tipo,$xy,$texto,$position,$partials,$offsetx,$offsety,$minfeaturesize,$mindistance,$force,$shadowcolor,$shadowsizex,$shadowsizey,$outlinecolor,$cor,$sombray,$sombrax,$sombra,$fundo,$angulo,$tamanho,$fonte,$wrap,$wkt=false,$nomeTema="")
	{
		//verifica se ja existe um layer criado anteriormente com o mesmo nome e apaga se existir
		if ($tipo == "limpaponto")
		{
			if ($this->layer)
			{
				$this->layer->set("status",MS_DELETE);
				$this->layer->set("name","pindelete");
				$tipo = "POINT";
			}
		}
		if (!$this->layer)
		{
			$pinlayer = criaLayer($this->mapa,MS_LAYER_LINE,MS_DEFAULT,"Ins","SIM");
			$c = $pinlayer->getclass(0);
			$c->set("name","");
			$e = $c->getstyle(0);
			$e->set("size",1);
			$e->set("symbol","ponto");
			$core = $e->color;
			$core->setrgb(255,0,0);
			if(!isset($cor))
			{$cor = "255 0 0";}
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
					corE($e,$cor,"color");
					$pinlayer->setmetadata("tema","Pontos inseridos");
					$pinlayer->set("type",MS_LAYER_POINT);
				break;
				case "LINE":
					if (!isset($marca) || $marca == ""){$marca="linha";}
					if(!isset($tamanho)){$tamanho = 2;}
					$e->set("size",$tamanho);
					$e->set("symbol",$marca);
					if(isset($cor) && $cor != "")
					{corE($e,$cor,"color");}
					if(isset($texto) && $texto != "")
					{$pinlayer->setmetadata("TEMA",$texto);}
					else
					{$pinlayer->setmetadata("tema","Linhas inseridas");}
					$pinlayer->set("type",MS_LAYER_LINE);
				break;
				case "POLYGON":
					if (!isset($marca)){$marca="p9";}
					if(!isset($tamanho)){$tamanho = 5;}
					$e->set("size",$tamanho);
					$e->set("symbol",$marca);
					$pinlayer->setmetadata("tema","Poligonos inseridos");
					$pinlayer->set("type",MS_LAYER_POLYGON);
					$pinlayer->set("opacity","50");
				break;
				case "ANNOTATION":
					//$c->set("status",MS_DELETE);
					$pinlayer->setmetadata("TEMA",$texto);
					$pinlayer->setmetadata("tiles","nao");
					$pinlayer->set("type",MS_LAYER_POINT);
					//$pinlayer->set("opacity","100");
				break;
			}
		}
		switch ($tipo)
		{
			case "ANNOTATION":
				$shp = ms_newshapeobj(MS_SHAPE_POINT);
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
		if($wkt == false){
			$apt = explode(" ",$xy);
			$lin = ms_newlineobj();
			for ($i = 0;$i < count($apt); $i = $i + 2){
				$lin->addxy($apt[$i],$apt[$i + 1]);
			}
			$shp->add($lin);
		}
		else{
			$shp = ms_shapeObjFromWkt($xy);
		}
		if($texto != ""){
			$texto = str_replace("*","&",$texto);
			$texto = str_replace("|",";",$texto);
			$shp->set("text",$texto);
			//caso nao seja do tipo annotation
			if($pinlayer->numclasses == 1){
				$novac = $pinlayer->getclass(0);
			}
			else{
				$novac = ms_newclassobj($pinlayer);
			}
			$this->adicionaLabel($novac,$wrap,$fonte,$tamanho,$angulo,$fundo,$sombra,$cor,$outlinecolor,$shadowcolor,$shadowsizex,$shadowsizey,$force,$mindistance,$minfeaturesize,$offsetx,$offsety,$partials,$position,"");
		}

		$pinlayer->addfeature($shp);

		//verifica a projecao
		$c = $shp->getCentroid();
		if($c->x > -181 && $c->x < 181){
			$pinlayer->setprojection(pegaProjecaoDefault("proj4"));
			$extensao = ($c->x - 0.01)." ".($c->y - 0.01)." ".($c->x + 0.01)." ".($c->y + 0.01);
		}
		else{
			$pinlayer->setprojection($this->mapa->getProjection());
			$extensao = ($c->x - 50000)." ".($c->y - 50000)." ".($c->x + 50000)." ".($c->y + 50000);
		}
		$pinlayer->setmetadata("extensao",$extensao);
		if($nomeTema != ""){
		    $pinlayer->setmetadata("tema",$nomeTema);
		}

		return("ok");
	}
/*
function: capturaGeometrias

Captura as geometrias selecionadas e salva em um arquivo texto serializado (analise de geometrias).

parameters:
$dir_tmp - diret&oacute;rio tempor&aacute;rio do I3Geo

$imgdir - diret&oacute;rio tempor&aacute;rio das imagens do mapa atual

$nome - nome que ser&aacute; dado a geometria
*/
	function capturaGeometrias($dir_tmp,$imgdir,$nome="")
	{
		if(!$this->layer){return "erro";}
		$this->mapa->setsize(30,30);
		$ext = $this->mapa->extent;
		$sb = $this->mapa->scalebar;
		$sb->set("status",MS_OFF);
		$items = pegaItens($this->layer);
		$final["layer"] = pegaNome($this->layer,"UTF-8");
		$shapes = retornaShapesSelecionados($this->layer,$this->arquivo,$this->mapa);
		$registros = array();
		$i = 0;
		foreach($shapes as $shape)
		{
			$valitem = array();
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
			else{return "erro";}
			$i++;
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

Lista as geometrias arquivos com extens&atilde;o geo (an&aacute;lise de geometrias).

parameters:

$dir_tmp - diret&oacute;rio tempor&aacute;rio do I3Geo

$imgdir - diret&oacute;rio tempor&aacute;rio das imagens do mapa atual
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
			//var_dump($final);exit;
			$dados = array();
			foreach ($final["dados"] as $d){
				$dados[] = array("id"=>($d["id"]),"valores"=>($d["valores"]),"imagem"=>($d["imagem"]));
			}
			$resultado[] = array("arquivo"=>(basename($arquivo)),"layer"=>$final["layer"],"dados"=>$dados);
		}
		return($resultado);
	}
/*
function: removerGeometrias

Remove os arquivos correspondentes a determinadas geometrias (an&aacute;lise de geometrias).

parameters:
$dir_tmp - diret&oacute;rio tempor&aacute;rio do I3Geo

$imgdir - diret&oacute;rio tempor&aacute;rio das imagens do mapa atual

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

Gera um tema com gr&aacute;ficos em cada elemento.

parameters:

lista - lista de item e cores de cada parte do grafico

*/
	function graficotema($lista,$tamanho="50",$tipo="PIE",$outlinecolor="",$offset=0, $mesmoTema=false)
	{
		if(!$this->layer){return "erro";}
		$nome = pegaNome($this->layer);
		$novolayer = ms_newLayerObj($this->mapa, $this->layer);
		$nomer = nomeRandomico();
		$novolayer->set("name",$nomer);
		$novolayer->set("group","");
		$novolayer->setmetadata("cache","nao");
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
		if($mesmoTema == true){
			$this->layer->set("status",MS_DELETE);
			$novolayer->set("name",$this->layer->name);
			$novolayer->setmetadata("tema",$this->layer->getmetadata("tema"));
		}
		return true;
	}
/*
function: fonteTema

Retorna o link para a fonte do tema.

parameters:

tema - codigo do tema

*/
	function fonteTema($tema)
	{
		include_once($this->locaplic."/classesphp/xml.php");
		require($this->locaplic."/classesphp/classe_menutemas.php");
			$menutemas = new Menutemas("","","",$this->locaplic);
		$linkfonte = "erro";
		$tipo = "";
		$this->xml = "";
		foreach($menutemas->pegaListaDeMenus() as $menu)
		{
			if(!isset($menu["url"])){$menu["url"] = "";} //para efeitos de compatibilidade entre vers&otilde;es do i3geo
			$ondexml = $menu["arquivo"];
			if($menu["url"] != ""){$ondexml = $menu["url"];}
			$verificaXml = false;
			if($ondexml != "")
			{
				$verificaXml = simplexml_load_file($ondexml);
				if($verificaXml)
				$this->xml[] = $verificaXml;
			}
			else //pega o xml do sistema de administra&ccedil;&atilde;o
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

Calcula a extens&atilde;o geogr&aacute;fica dos elementos selecionados de um tema e ajusta o mapa para essa extens&atilde;o.
*/
	function zoomSel()
	{
		if(!$this->layer){return "erro";}
		if($this->mapa->getmetadata("interface") == "googlemaps"){
			$projO = $this->mapa->getProjection();
			$projecao = pegaProjecaoDefault("epsg");
			$this->mapa->setProjection("init=epsg:".$projecao);
		}
		$extatual = $this->mapa->extent;
		$prjMapa = $this->mapa->getProjection();
		$prjTema = $this->layer->getProjection();
		$shapes = retornaShapesSelecionados($this->layer,$this->arquivo,$this->mapa);
		$xmin = array();
		$xmax = array();
		$ymin = array();
		$ymax = array();
		foreach($shapes as $shape)
		{
			$bound = $shape->bounds;
			$xmin[] = $bound->minx;
			$xmax[] = $bound->maxx;
			$ymin[] = $bound->miny;
			$ymax[] = $bound->maxy;
		}
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
			if($this->mapa->getmetadata("interface") == "googlemaps")
		{$this->mapa->setProjection($projO);}
		return("ok");
	}
/*
function: sld

Retorna o SLD correspondente a legenda do tema.
*/
	function sld(){
		if(!$this->layer){
			//pega o arquivo na pasta temas pois pode ser que esteja tentando gerar o sld diretamente desse arquivo ja que layer nao foi definido
			$mapa = ms_newMapObj($this->locaplic."/temas/".$this->tema.".map");
			$this->layer = $mapa->getlayerbyname($this->tema);
		}
		$this->layer->set("status",MS_DEFAULT);
		if($this->layer->type != 3 && $this->layer->type != 4){
			$nclass = $this->layer->numclasses;
			for($j=0;$j<$nclass;$j++){
				$classe = $this->layer->getclass($j);
				if($classe->title === ""){
					$classe->title = $classe->name;
				}
			}
		}
		return $this->layer->generateSLD();
	}
/*
function: peganomelayer

Retorna o nome do layer e outros dados relacionados
*/
	function peganomelayer()
	{
		if(!$this->layer){return "erro";}
		$nomeoriginal = $this->layer->getmetadata("nomeoriginal");
		$nomearquivo = $this->locaplic."/temas/".$nomeoriginal;
		if(!file_exists($nomearquivo))
		{$nomearquivo = "";}
		return array("mapfile"=>$this->arquivo,"nomeoriginal"=>$nomeoriginal,"nomelayer"=>$this->layer->name,"nomearquivo"=>$nomearquivo);
	}
/*
function: pegadata

Retorna o valor do elemento DATA
*/
	function pegadata(){
		if(!$this->layer){
			return "erro";
		}
		$metadata = $this->layer->getmetadata("editorsql");
		if(strtolower($metadata) == "sim"){
			return $this->layer->data;
		}
		else{
			return "O layer n&atilde;o permite a alteracao do elemento DATA";
		}
	}
/*
function: alteradata

Altera o valor do elemento DATA
*/
	function alteradata($data,$removemeta="nao") {
		if(!$this->layer){return "erro";}
		$data = str_ireplace("delete","",$data);
		$data = str_ireplace("insert","",$data);
		$data = str_ireplace("update","",$data);
		$data = str_ireplace("create","",$data);
		$data = str_ireplace("alter","",$data);
		$metadata = $this->layer->getmetadata("editorsql");
		if(strtolower($metadata) == "sim"){
			$this->layer->set("data",$data);
			$this->layer->setMetaData("cache","");
			if($removemeta == "sim"){
				$this->layer->setMetaData("itens","");
				$this->layer->setMetaData("itensdesc","");
				$this->layer->setMetaData("itensimg","");
				$this->layer->setMetaData("tips","");
			}
			return $this->layer->data;
		}
		else{
			return "O layer n&atilde;o permite a alteracao do elemento DATA";
		}
	}
/*
function: adicionaLabel

Adiciona LABEL em uma classe de um tema
*/
	function adicionaLabel($novac,$wrap,$fonte,$tamanho,$angulo,$fundo,$sombra,$cor,$outlinecolor,$shadowcolor,$shadowsizex,$shadowsizey,$force,$mindistance,$minfeaturesize,$offsetx,$offsety,$partials,$position,$texto=""){
        if($this->vi >= 60300){
			while($novac->numlabels > 0){
				$novac->removeLabel(0);
			}
		}
		if($texto == ""){
			if($this->vi >= 60300){
				$indiceLabel = $novac->addLabel(new labelObj());
				$label = $novac->getLabel($indiceLabel);
			}
			else{
				$label = $novac->label;
			}
		}
		elseif ($this->vi >= 60300 && $novac->numlabels == 0){
			if($wrap != ""){
				$s = "CLASS LABEL WRAP '$wrap' TEXT '".$texto."' END END";
				$novac->updateFromString($s);
			}
			else{
				$s = "CLASS LABEL TEXT '".$texto."' END END";
				$novac->updateFromString($s);
			}
		}
		if($this->vi >= 60300){
			$label = $novac->getLabel(0);
		}
		else{
            $label = $novac->label;
            $novac->settext($texto);
		}
		if($wrap != ""){
			$label->set("maxlength",1);
		}
		if($fonte != "bitmap")
		{
			//para funcionar na versao 7 do mapserver
			$label->updateFromString("LABEL type truetype END");
			$label->set("font",$fonte);
			$label->set("size",$tamanho);
		}
		else
		{
			//para funcionar na versao 7 do mapserver
			$label->updateFromString("LABEL type bitmap END");
			$t = MS_TINY;
			if ($tamanho > 5 ){
				$t = MS_TINY;
			}
			if ($tamanho >= 7 ){
				$t = MS_SMALL;
			}
			if ($tamanho >= 10 ){
				$t = MS_MEDIUM;
			}
			if ($tamanho >= 12 ){
				$t = MS_LARGE;
			}
			if ($tamanho >= 14 ){
				$t = MS_GIANT;
			}
			$label->set("size",$t);
		}
		$label->set("angle",$angulo);
		corE($label,$fundo,"backgroundcolor");
		corE($label,$sombra,"backgroundshadowcolor",$sombrax,$sombray);
		corE($label,$cor,"color");
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
		if ($this->layer){
			$this->layer->setMetaData("cache","");
		}
		return true;
	}
	function removeLabel($iclasse){
        $classe = $this->layer->getclass($iclasse);
		if($this->vi >= 60300){
            while($classe->numlabels > 0){
                $classe->removeLabel(0);
            }
        } else {
            $label = $classe->label;
            $label->set("type",MS_TRUETYPE);
			$label->set("font","arial");
            $label->set("size",0);
            $label->removeBinding(0);
            $classe->settext($texto);
        }
		if ($this->layer){
			$this->layer->setMetaData("cache","");
		}
		return true;
	}
	function criaCluster ($group = "",$filter = "",$maxdistance=5,$region='rectangle',$buffer=0){
		if($group != ""){
			$group = "('[".$group."]')";
		}
		$cluster = $this->layer->cluster;

		$par = "BUFFER $buffer REGION $region MAXDISTANCE $maxdistance";
		if($group != ""){
			$par .= " GROUP ".$group;
		}
		if($filter != ""){
			$par .= " FILTER ".$filter;
		}
		$cluster->updateFromString("CLUSTER $par END");
		$this->layer->setMetaData("cache","");
		$this->layer->setMetadata("tiles","NAO");
		$this->layer->setMetadata("cortepixels",$buffer);
		//apaga as classes pois nao fazem mais sentido
		if($group == ""){
			$numclasses = $this->layer->numclasses;
			if ($numclasses > 0){
				for ($i=0; $i < $numclasses; ++$i)
				{
					$classe = $this->layer->getClass($i);
					$classe->set("status",MS_DELETE);
				}
			}
			$classe = ms_newClassObj($this->layer);
			$novoestilo = ms_newStyleObj($classe);
			$novoestilo->set("size",6);
			$novoestilo->set("symbolname","ponto");
			$cor = $novoestilo->color;
			$cor->setRGB(255,100,100);
		}
		return true;
	}
	function removeCluster(){
		$cluster = $this->layer->cluster;
		$this->layer->updatefromstring("LAYER CLUSTER END END");
		$this->layer->setMetaData("cache","");
		$this->layer->setMetadata("tiles","NAO");
		$this->layer->setMetadata("cortepixels",0);
		$numclasses = $this->layer->numclasses;
		if ($numclasses > 0){
			for ($i=0; $i < $numclasses; ++$i)
			{
				$classe = $this->layer->getClass($i);
				$numestilos = $classe->numstyles;
				for($j=0;$j<$numestilos;++$j){
					$estilo = $classe->getstyle($j);
					$estilo->removebinding(MS_STYLE_BINDING_SIZE);
				}
			}
		}
		return true;
	}
	function selecaoLimpa(){
		//apaga o arquivo do i3geo com os ids selecionados
		if(file_exists($this->qyfileTema)){
			unlink($this->qyfileTema);
		}
		//limpa de um tema
		if ($this->nome != ""){
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
}
?>
