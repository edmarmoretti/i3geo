<?php
/**
 * DESLIGACACHE (opcional) {sim|nao} - forca a nao usar o cache de imagens qd
 * definido como "sim", do contr&aacute;rio, o uso ou n&atilde;o do cache
 * ser&aacute; definido automaticamente
 */
include_once(dirname(__FILE__)."/../ms_configura.php");
include_once(dirname(__FILE__)."/../classesphp/sani_request.php");
include_once(dirname(__FILE__)."/../classesphp/carrega_ext.php");
include_once(dirname(__FILE__)."/../classesphp/funcoes_gerais.php");
//error_reporting(0);
//variaveis utilizadas
$parurl = array_merge($_GET,$_POST);
$desligacache = $parurl["desligacache"];
$opacidade = $parurl["opacidade"];
$nocache = $parurl["nocache"];
$restauramapa = $parurl["restauramapa"];
$mapext = $parurl["mapext"];
$temas = $parurl["temas"];
$layers = $parurl["layers"];
$layerDefault = $parurl["layerDefault"];

$altura = $parurl["altura"];
$largura = $parurl["largura"];
$controles = $parurl["controles"];
$botoes = $parurl["botoes"];
$fundo = $parurl["fundo"];
$visiveis = $parurl["visiveis"];
$servidor = $parurl["servidor"];
$kml = $parurl["kml"];
$numzoomlevels = $parurl["numzoomlevels"];
$minresolution = $parurl["minresolution"];
$maxextent = $parurl["maxextent"];

$pontos = $parurl["pontos"];
$marca = $parurl["marca"];
$tiles = $parurl["tiles"];
$incluilayergrafico = $parurl["incluilayergrafico"];
$ativalayerswicther = $parurl["ativalayerswicther"];
$ativarodadomouse = $parurl["ativarodadomouse"];
$legendahtml = $parurl["legendahtml"];
$nocache = $parurl["nocache"];

//cria as pastas temporarias caso nao existam
if (! file_exists ( $dir_tmp )) {
	@mkdir ( $dir_tmp, 0744 );
}
if (file_exists ( $dir_tmp )) {
	if (! file_exists ( $dir_tmp . "/comum" )) {
		@mkdir ( $dir_tmp . "/comum", 0744 );
	}
	if (! file_exists ( $dir_tmp . "/saiku-datasources" )) {
		@mkdir ( $dir_tmp . "/saiku-datasources", 0744 );
		chmod ( $dir_tmp . "/saiku-datasources", 0744 );
	}
	if (! file_exists ( $dir_tmp . "/cache" )) {
		@mkdir ( $dir_tmp . "/cache", 0744 );
		chmod ( $dir_tmp . "/cache", 0744 );
	}
	if (! file_exists ( $dir_tmp . "/cache/googlemaps" )) {
		@mkdir ( $dir_tmp . "/cache/googlemaps", 0744 );
		chmod ( $dir_tmp . "/cache/googlemaps", 0744 );
	}
}
if(!empty($desligacache)){
	$DESLIGACACHE = $desligacache;
}
if(empty($opacidade)){
	$opacidade = 1;
}
//
//verifica se em cada camada deve ser inserido um parametro aleatorio para evitar cache de imagem do lado do cliente
//
if($nocache == "sim"){
	$nocache = "a".mt_rand(0, 1000)."&";
}
else{
	$nocache = "";
}
//guarda os parametros das camadas que possuem plugins configurados
$temasPluginI3Geo = array();
//
// recupera um mapa salvo no banco de administracao
//
if(!empty($restauramapa)){
	$xbase = restauraMapaAdmin($restauramapa,$dir_tmp);
	validaAcessoTemas($xbase,true);
	$m = ms_newMapObj($xbase);
	$w = $m->web;
	$w->set("imagepath",dirname($w->imagepath)."/");
	$w->set("imageurl",dirname($w->imageurl)."/");
	// apaga algumas camadas
	$l = $m->getlayerbyname("rosadosventos");
	if($l != ""){
		$l->set("status",MS_DELETE);
	}
	$l = $m->getlayerbyname("copyright");
	if($l != ""){
		$l->set("status",MS_DELETE);
	}
	$m->save($xbase);
	$temas = $xbase;
	if (!isset($mapext)){
		$mapext = $m->extent->minx." ".$m->extent->miny." ".$m->extent->maxx." ".$m->extent->maxy;
	}
}
if(!isset($mapext)){
	$versao = versao();
	$versao = $versao["principal"];
	if(isset($base) && $base != ""){
		if(file_exists($base)){
			$f = $base;
		}
		else{
			$f = $locaplic."/aplicmap/".$base.".map";
		}
	}
	else
	{
		$f = "";
		if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')){
			$f = $locaplic."/aplicmap/geral1windowsv".$versao.".map";
		}
		else{
			if($f == "" && file_exists('/var/www/i3geo/aplicmap/geral1debianv'.$versao.'.map')){
				$f = "/var/www/i3geo/aplicmap/geral1debianv".$versao.".map";
			}
			if($f == "" && file_exists('/var/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
				$f = "/var/www/html/i3geo/aplicmap/geral1fedorav".$versao.".map";
			}
			if($f == "" && file_exists('/opt/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
				$f = "/opt/www/html/i3geo/aplicmap/geral1v".$versao.".map";
			}
			if($f == "")
			{
				$f = $locaplic."/aplicmap/geral1v".$versao.".map";
			}
		}
	}
	if(@ms_newMapObj($f)){
		$mapae = ms_newMapObj($f);
		$c = $mapae->extent;
		$mapext = $c->minx.",".$c->miny.",".$c->maxx.",".$c->maxy;
	}
}
//
// imprime na tela a ajuda ao usu&aacute;rio
//
if(!isset($temas) && isset($layers)){
	$temas = $layers;
}
if(!isset($temas)){
	ajuda();
}
// problema na vers&atilde;o 211 do OpenLayers. Tamanho em % n&atilde;o &eacute;
// aceito
// if(!isset($largura))
	// {$largura = 500;}
if(isset($largura) && !isset($altura)){
	$altura = $largura;
}
if(isset($altura) && !isset($largura)){
	$largura = $altura;
}
//
// define quais controles ser&atilde;o mostrados no mapa
//
$objControles = array();
if(isset($controles)){
	$controles = str_replace(" ",",",$controles);
	$controles = strtolower($controles);
	$controles = explode(",",$controles);
	if(in_array("navigation",$controles)){
		$objControles[] = "new OpenLayers.Control.Navigation()";
	}
	if(in_array("panzoombar",$controles)){
		$objControles[] = "new OpenLayers.Control.PanZoomBar()";
	}
	if(in_array("layerswitcher",$controles)){
		$objControles[] = "new OpenLayers.Control.LayerSwitcher({'ascending':false})";
	}
	if(in_array("scaleline",$controles)){
		$objControles[] = "new OpenLayers.Control.ScaleLine()";
	}
	if(in_array("mouseposition",$controles))
	{
		$objControles[] = "new OpenLayers.Control.MousePosition({'separator':' '})";
	}
	if(in_array("overviewmap",$controles)){
		$objControles[] = "new OpenLayers.Control.OverviewMap()";
	}
	if(in_array("keyboarddefaults",$controles)){
		$objControles[] = "new OpenLayers.Control.KeyboardDefaults()";
	}
}
//
// define quais botoes ser&atilde;o mostrados no mapa
//
$objBotoes = array();
if(isset($botoes)){
	$botoes = str_replace(" ",",",$botoes);
	$botoes = strtolower($botoes);
	$botoes = explode(",",$botoes);
	if(in_array("grid",$botoes)){
		$objBotoes[] = "'grid':true";
	}
	if(in_array("imprimir",$botoes)){
		$objBotoes[] = "'imprimir':true";
	}
	if(in_array("pan",$botoes)){
		$objBotoes[] = "'pan':true";
	}
	if(in_array("zoombox",$botoes)){
		$objBotoes[] = "'zoombox':true";
	}
	if(in_array("zoomtot",$botoes)){
		$objBotoes[] = "'zoomtot':true";
	}
	if(in_array("zoomout",$botoes)){
		$objBotoes[] = "'zoomout':true";
	}
	if(in_array("zoomin",$botoes))
	{
		$objBotoes[] = "'zoomin':true";
	}
	if(in_array("legenda",$botoes)){
		$objBotoes[] = "'legenda':true";
	}
	if(in_array("distancia",$botoes)){
		$objBotoes[] = "'distancia':true";
	}
	if(in_array("area",$botoes)){
		$objBotoes[] = "'area':true";
	}
	if(in_array("identifica",$botoes)){
		$objBotoes[] = "'identifica':true";
	}
	if(in_array("linha",$botoes)){
		$objBotoes[] = "'linha':true";
	}
	if(in_array("ponto",$botoes)){
		$objBotoes[] = "'ponto':true";
	}
	if(in_array("poligono",$botoes)){
		$objBotoes[] = "'poligono':true";
	}
	if(in_array("edita",$botoes)){
		$objBotoes[] = "'edita':true";
	}
	if(in_array("listag",$botoes)){
		$objBotoes[] = "'listag':true";
	}
	if(in_array("corta",$botoes)){
		$objBotoes[] = "'corta':true";
	}
	if(in_array("apaga",$botoes)){
		$objBotoes[] = "'apaga':true";
	}
	if(in_array("procura",$botoes)){
		$objBotoes[] = "'procura':true";
	}
	if(in_array("salva",$botoes)){
		$objBotoes[] = "'salva':true";
	}
	if(in_array("ajuda",$botoes)){
		$objBotoes[] = "'ajuda':true";
	}
	if(in_array("fecha",$botoes)){
		$objBotoes[] = "'fecha':true";
	}
	if(in_array("tools",$botoes)){
		$objBotoes[] = "'tools':true";
	}
	if(in_array("undo",$botoes)){
		$objBotoes[] = "'undo':true";
	}
	if(in_array("propriedades",$botoes)){
		$objBotoes[] = "'propriedades':true";
	}
	if(in_array("frente",$botoes)){
		$objBotoes[] = "'frente':true";
	}
	if(in_array("texto",$botoes)){
		$objBotoes[] = "'texto':true";
	}
	if(in_array("novaaba",$botoes)){
		$objBotoes[] = "'novaaba':true";
	}
	$botoes = "{".implode(",",$objBotoes)."}";
}

//
// define a lista de layers do tipo baselayers
// $fundo &eacute; um array com a lista dos nomes poss&iacute;veis ou passados
// pela url
// cada um deve ser definido em openlayers.js.php
//
if(isset($fundo) && $fundo != ""){
	$fundo = str_replace(","," ",$fundo);
	$fundo = explode(" ",$fundo);
}
//
// define quais os layers que compor&atilde;o o mapa
//
//$objOpenLayers guarda a string javascript que sera usada para criar os objetos
//layer do OpenLayers
if(isset($temas)){
	$objOpenLayers = array();
}
if($temas != ""){
	$temas = str_replace(" ",",",$temas);
	// $temas = strtolower($temas);
	$temas = explode(",",$temas);
	if(!isset($visiveis)){
		$visiveis = $temas;
	}
	else{
		$visiveis = str_replace(" ",",",$visiveis);
		$visiveis = explode(",",$visiveis);
	}
	$objOpenLayers = array();
	if(!isset($servidor)){
		$servidor = "../ogc.php";
	}
	//
	//lista de ferramentas
	//lista os nomes de metadados que contem os parametros das
	//ferramentas customizaveis e que seraco incluidas na propriedade do layer
	//
	$listaFerramentas = array("tme","storymap","animagif");
	$dadosTemas = pegaDadosAdminKey("SELECT codigo_tema,link_tema FROM __esq__i3geoadmin_temas WHERE codigo_tema IN('".implode($temas,',')."')","__esq__");
	foreach($temas as $tema){
		//
		//utilzado para obter os parametros de ferramentas especificas indicadas nos metadados do LAYER
		//
		$ferramentas = array();
		if(file_exists($locaplic."/temas/".$tema.".gvp")){
		}
		else{
			$nomeMap = "";
			if(file_exists($locaplic."/temas/".$tema.".map")){
				$nomeMap = $locaplic."/temas/".$tema.".map";
			}
			else{
				if(file_exists($tema)){
					$nomeMap = $tema;
				}
				else{
					// acontece caso o mapfile tenha sido gerado na pasta
					// temporaria por algum sistema
					if(file_exists($dir_tmp."/".$tema.".map")){
						$nomeMap = $dir_tmp."/".$tema.".map";
					}
				}
			}
			if($nomeMap != ""){
				$layersNomes = array();
				$layers = array();
				$maptemp = @ms_newMapObj($nomeMap);
				if($maptemp){
					$nlayers = $maptemp->numlayers;
					for($i=0;$i<($nlayers);++$i)	{
						$layern = $maptemp->getLayer($i);
						//
						//verifica se o layer contem ferramentas parametrizadas
						//
						foreach($listaFerramentas as $lf){
							$meta = $layern->getmetadata($lf);
							if($meta != ""){
								$ferramentas[] = "'".$lf."':".$meta;
							}
						}
						$ferramentas = '{'.implode(",",$ferramentas).'}';
						if($layern->getmetadata("PLUGINI3GEO") != ""){
							//obtem os dados necessarios para iniciar o plugin
							//os objetos layer (openLayers) sao criados apenas no final
							//do processo, pois necessitam usar javascript e nao apenas PHP
							$temasPluginI3Geo[] = array(
									"name"=>$layern->name,
									"tema"=>$layern->getmetadata("tema"),
									"plugin"=>$layern->getmetadata("PLUGINI3GEO"),
									"cache"=>strtoupper($layern->getmetadata("cache")),
									"transitioneffect"=>strtoupper($layern->getmetadata("transitioneffect")),
									"tiles"=>strtoupper($layern->getmetadata("tiles")),
									"posicaoLayer"=>count($objOpenLayers),
									"ferramentas"=>$ferramentas
							);
							$objOpenLayers[] = "";
						}
						else{
							$layersNomes[] = $layern->name;
							$layers[] = $layern;
						}
					}
					$nomeLayer = implode(",",$layersNomes);
					$tituloLayer = $layern->getmetadata("tema");
					$ebase = "false";
					if(isset($fundo) && $fundo != ""){
						if(in_array($tema,$fundo)){
							$ebase = "true";
						}
					}
					$visivel = "false";
					if(in_array($tema,$visiveis)){
						$visivel = "true";
					}
					if(strtolower($DESLIGACACHE) != "sim" && $nlayers == 1 && strtoupper($layern->getmetadata("cache")) == "SIM" && $layern->getmetadata("PLUGINI3GEO") == ""){
						//
						//obtem a fonte
						//
						$link_tema = $dadosTemas[$layern->name];
						$link_tema = $link_tema["link_tema"];
						if($layern->type != 2 && $layern->type != 3){
							$opacidade = 1;
						}
						//
						//verifica se deve aplicar filtro
						//
						$filtro = $_GET["map_layer_".$layern->name."_filter"];
						if(!empty($filtro)){
							$DESLIGACACHE = "sim";
							$nocache = "map_layer_".$layern->name."_filter=".$filtro."&".$nocache;
						}
						$teffect = 'transitionEffect: "resize",';
						if(strtoupper($layern->getmetadata("transitioneffect")) == "NAO"){
							$teffect = 'transitionEffect: null,';
						}
						// nesse caso o layer e adicionado como TMS
						// tms leva os parametros do TMS
						if($layern->getmetadata("extensao") == ""){
							$objOpenLayers[] = 'new OpenLayers.Layer.TMS("'.$tituloLayer.'", "'.$servidor.'?'.$nocache.'tema='.$tema.'&DESLIGACACHE='.$DESLIGACACHE.'",{'.$teffect.' tileOrigin: new OpenLayers.LonLat(-180, -90),opacity:'.$opacidade.',serviceVersion:"&tms=",visibility:'.$visivel.',isBaseLayer:'.$ebase.',layername:"'.$nomeLayer.'",type:"png", ferramentas :'.$ferramentas.',link_tema:"'.$link_tema.'"})';
						}
						else{
							$objOpenLayers[] = 'new OpenLayers.Layer.TMS("'.$tituloLayer.'", "'.$servidor.'?'.$nocache.'tema='.$tema.'&DESLIGACACHE='.$DESLIGACACHE.'",{'.$teffect.' tileOrigin: new OpenLayers.LonLat(-180, -90),maxExtent:['.str_replace(" ",",",$layern->getmetadata("extensao")).'],opacity:'.$opacidade.',serviceVersion:"&tms=",visibility:'.$visivel.',isBaseLayer:'.$ebase.',layername:"'.$nomeLayer.'",type:"png", ferramentas :'.$ferramentas.',link_tema:"'.$link_tema.'"})';
						}
						// cria um clone WMS para efeitos de getfeatureinfo
						$objOpenLayers[] = 'new OpenLayers.Layer.WMS( "'.$tituloLayer.'", "'.$servidor.'?'.$nocache.'tema='.$tema.'&DESLIGACACHE='.$DESLIGACACHE.'&",{cloneTMS:"'.$nomeLayer.'",layers:"'.$nomeLayer.'",transparent: "true", format: "image/png"},{displayInLayerSwitcher:false,transitionEffect : null,singleTile:true,visibility:false,isBaseLayer:false, ferramentas :'.$ferramentas.',link_tema:"'.$link_tema.'"})';
					}
					else{
						foreach($layers as $l){
							$singleTile = "false";
							if(strtoupper($l->getmetadata("TILES")) == "NAO"){
								$singleTile = "true";
							}
							$tituloLayer = $l->getmetadata("tema");
							$nomeLayer = $l->name;
							$link_tema = $dadosTemas[$nomeLayer];
							$link_tema = $link_tema["link_tema"];
							$visivel = "false";
							//if($l->status == MS_DEFAULT || in_array($tema,$visiveis)){
							if(in_array($tema,$visiveis)){
								$visivel = "true";
							}
							if($l->type != 2 && $l->type != 3){
								$opacidade = 1;
							}
							//
							//verifica se deve aplicar filtro
							//
							$filtro = $_GET["map_layer_".$l->name."_filter"];
							if(!empty($filtro)){
								$DESLIGACACHE = "sim";
								$nocache = "map_layer_".$l->name."_filter=".$filtro."&".$nocache;
							}
							$teffect = 'transitionEffect: "resize",';
							if(strtoupper($l->getmetadata("transitioneffect")) == "NAO"){
								$teffect = 'transitionEffect: null,';
							}
							if($tituloLayer != ""){
								$objOpenLayers[] = 'new OpenLayers.Layer.WMS( "'.$tituloLayer.'", "'.$servidor.'?'.$nocache.'tema='.$tema.'&DESLIGACACHE='.$DESLIGACACHE.'&",{opacity:'.$opacidade.',layers:"'.$nomeLayer.'",transparent: "true", format: "image/png"},{'.$teffect.' singleTile:'.$singleTile.',visibility:'.$visivel.',isBaseLayer:'.$ebase.', ferramentas :'.$ferramentas.',link_tema:"'.$link_tema.'"})';
							}
							else{
								$objOpenLayers[] = 'new OpenLayers.Layer.WMS( "'.$tituloLayer.'", "'.$servidor.'?'.$nocache.'tema='.$tema.'&DESLIGACACHE='.$DESLIGACACHE.'&",{opacity:'.$opacidade.',layers:"'.$nomeLayer.'",transparent: "true", format: "image/png"},{'.$teffect.' displayInLayerSwitcher:false,singleTile:'.$singleTile.',visibility:'.$visivel.',isBaseLayer:'.$ebase.', ferramentas :'.$ferramentas.',link_tema:"'.$link_tema.'"})';
							}
						}
					}
				}
			}
			else{
				echo $tema." n&atilde;o foi encontrado.<br>";
			}
		}
	}
}
function nomeRandomicoM($n=10){
	$nomes = "";
	$a = 'azertyuiopqsdfghjklmwxcvbnABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$max = 51;
	for($i=0; $i < $n; ++$i)
	{
		$nomes .= $a{mt_rand(0, $max)};
	}
	return $nomes;
}
function ajuda(){
	echo "
	<pre><b>
	Mashup OpenLayers
	Par&acirc;metros:
	restauramapa - id do mapa armazenado no sistema de administracao e que ser&aacute; restaurado para ser aberto novamente
	opacidade - opacidade (de 0 a 1) aplicada aos temas do tipo poligonal ou raster (default 1)
	kml - lista de endere&ccedil;os (url) de um arquivos kml que ser&atilde;o adicionados ao mapa. Separado por ','
	servidor - por default &eacute; ../ogc.php o que for&ccedil;a o uso do i3geo local. Esse &eacute; o programa que ser&aacute; utilizado em conjunto com a lista definida no par&acirc;metro 'temas'
	temas - lista com os temas (mapfiles) do i3Geo que ser&atilde;o inclu&iacute;dos no mapa. Pode ser inclu&iacute;do um arquivo mapfile que esteja fora da pasta i3geo/temas. Nesse caso, deve-se definir o caminho completo do arquivo e tamb&eacute;m o par&acirc;metro &layers
	visiveis - lista de temas (mesmos nomes do par&acirc;metro temas) que iniciar&atilde;o como vis&iacute;veis no mapa. Se n&atilde;o for definido, todos os temas ser&atilde;o vis&iacute;veis.
	numzoomlevels - n&uacute;mero de n&iacute;veis de zoom, default=12
	minresolution - resolu&ccedil;&atilde;o m&iacute;nima. Utilizada para definir o primeiro n&iacute;vel de zoom. Default=0.703125
	maxextent - extens&atilde;o geogr&aacute;fica m&aacute;xima do mapa (xmin,ymin,xmax,ymax)
	mapext - extens&atilde;o geogr&aacute;fica inicial do mapa (xmin,ymin,xmax,ymax)
	largura - lagura do mapa em pixels
	altura - altura do mapa em pixels
	pontos - lista de coordenadas x e y que ser&atilde;o inclu&iacute;das como marcas no mapa
	marca - nome do arquivo que cont&eacute;m a imagem que ser&aacute; utilizada para mostrar as coordenadas
	tiles (true|false) - indica se o modo tile ser&aacute; usado ou n&atilde;o (true por default). O modo tile pode tornar o mashup mais lento em algumas situa&ccedil;&otilde;es.
	incluilayergrafico (true|false) - indica se o layer que recebe elementos gr&aacute;ficos ser&aacute; adicionado ou n&atilde;o ao mapa
	ativalayerswicther (true|false) - inicia o mapa com a caixa de escolha das camadas (layerSwitcher) aberta ou n&atilde;o. Por default, inicia fechada
	ativarodadomouse (true|false) - ativa ou n&atilde;o o zoom com base na roda do mouse (default &eacute; true)
	legendahtml (true|false) - ativa ou n&atilde;o (default &eacute; false) a gera&ccedil;&atilde;o de legenda do tipo HTML no lugar de imagem png. Legendas HTML podem ser modificadas com base em CSS. A legenda &eacute; constru&iacute;da com o template i3geo/aplicmap/legendaOgc.html.
	desligacache (sim|nao) - desativa o uso do cache de imagens em disco do lado do servidor, for&ccedil;ando a renderiza&ccedil;&atilde;o dos tiles de cada camada em cada requisi&ccedil;&atilde;o
	nocache (sim) - evita o uso de imagens em cache existentes no navegador do usu&aacute;rio
	layerDefault (opcional) - layer que sera utilizado na ferramenta de identificacao. Quando especificado, nao sera mostrada a caixa para a escolha do layer

	Filtros

	filtros podem ser adicionados incluindo o parametro da seguinte forma: &map_layer_<nomedotema>_filter=

	Exemplo de filtro

	?map_layer__lbiomashp_filter=(('[CD_LEGENDA]'='CAATINGA'))

	no caso de camadas Postgis basta usar map_layer__lbiomashp_filter=cd_legenda='CAATINGA'

	fundo - lista com os nomes, separados por ',' dos layers que ser&atilde;o usados como fundo para o mapa. Se n&atilde;o for definido,
	ser&aacute; usado o default. O primeiro da lista ser&aacute; o fundo ativo. Se na lista de temas de fundo estiver algum
	tema incluido com o parametro 'temas', esses ser&atilde;o inclu&iacute;dos como temas de fundo.
	Quando for vazio, o ultimo layer sera considerado como o layer de fundo
	Os seguintes fundos podem usados nessa lista:

	e_oce - ESRI Ocean Basemap
	e_ims - ESRI Imagery World 2D
	e_wsm - ESRI World Street Map
	ol_mma - base cartogr&aacute;fica do Brasil
	ol_wms - base mundial da Meta Carta
	top_wms - topon&iacute;mia do servidor do MMA usado no mapa de refer&ecirc;ncia
	est_wms - estados do Brasil

	controles - lista com os nomes dos controles que ser&atilde;o adicionados ao mapa. Se n&atilde;o for definido, todos os controles ser&atilde;o adicionados
	navigation
	panzoombar
	layerswitcher
	scaleline
	mouseposition
	overviewmap
	keyboarddefaults
	botoes - lista com os nomes dos botoes que ser&atilde;o adicionados ao mapa. Se n&atilde;o for definido, todos os bot&otilde;es ser&atilde;o adicionados
	pan
	zoombox
	zoomtot
	zoomin
	zoomout
	distancia
	area
	identifica
	ponto
	linha
	poligono
	texto
	edita
	listag (lista geometrias)
	apaga
	captura
	procura
	frente
	propriedades
	tools
	undo
	salva
	ajuda
	fecha
	corta
	legenda
	novaaba
	grid
	imprimir

	Para ver a lista de c&oacute;digos de temas, que podem ser utilizados no par&acirc;metro 'temas', acesse:
	<a href='../ogc.php?lista=temas' >lista de temas</a>. Os c&oacute;digos s&atilde;o mostrados em vermelho.

	Exemplo:

	&lt;iframe height='400px' src='http://mapas.mma.gov.br/i3geo/mashups/openlayers.php?temas=bioma&amp;altura=350&amp;largura=350' style='border: 0px solid white;' width='400px'&gt;&lt;/iframe&gt;

	";
	exit;
}
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script type="text/javascript" src="openlayers_compacto.js.php"></script>
<?php
//carrega o script para layers do tipo plugin
if(count($temasPluginI3Geo) > 0){
	echo '<script type="text/javascript" src="../classesjs/classe_plugini3geo.js"></script>'."\n";
	//echo '<script type="text/javascript" src="../classesjs/compactados/classe_plugini3geo_compacto.js"></script>'."\n";
	echo '<script type="text/javascript" src="../pacotes/cpaint/cpaint2_compacto.inc.js"></script>'."\n";
}
?>
<link rel="stylesheet" href="openlayers_compacto.css" type="text/css" />

<style>
.yui-skin-sam .container-minimiza {
	background: transparent
		url(../pacotes/yui290/build/assets/skins/sam/sprite.png) no-repeat
		scroll 0 -450px;
	cursor: pointer;
	height: 15px;
	position: absolute;
	right: 30px;
	top: 1px;
	width: 25px;
	z-index: 2001;
	opacity: .8;
	filter: alpha(opacity = 80);
}

.pluginParametrossql {
	background-image: url("../imagens/gisicons/settings.png");
	background-size: 14px auto;
	cursor: pointer;
	position: relative;
	top: 3px;
	width: 14px;
}

.i3GEOiconeTme, .i3GEOiconeStorymap {
	background-size: 14px auto;
	cursor: pointer;
	position: relative;
	top: 2px;
	width: 14px;
	margin-right: 2px;
}

.ajuda_usuario {
	background-image: url(../imagens/external.png);
	background-position: 0px 0px;
	background-repeat: no-repeat;
	margin-left: 0;
	text-decoration: none;
	cursor: help;
	position: relative;
	top: 2px;
	font-size: 13px;
}
</style>
</head>
<body class=" yui-skin-sam">
	<?php
	if(isset($largura) && $largura != ""){
		echo '<div id=i3geoMapa style="width:'.$largura.'px;height:'.$altura.'px;"></div>';
	}
	else{
		echo '<div id=i3geoMapa style="width:0;height:0"></div>';
	}

	?>
	<div id=i3geoSelTemaAtivo style="height: 15em; z-index: 3000; display: none" class=" yui-skin-sam"></div>
	<script>
OpenLayers.ImgPath = "../pacotes/openlayers/img/";
OpenLayers.Lang.setCode("pt-BR");
var m = document.getElementById("i3geoMapa");
if(parseInt(m.style.width,10) === 0){
	var t = i3GEO.util.tamanhoBrowser();
	m.style.width = (t[0]-10)+"px";
	m.style.height = (t[1]-20)+"px";
}
i3GEO.editorOL.layersIniciais = [<?php
	if(isset($objOpenLayers) && $objOpenLayers != "")
	{echo implode(",",$objOpenLayers);}
	else
	{echo "''";}
?>];
<?php if(isset($botoes)){
	echo "i3GEO.editorOL.botoes = $botoes ;";
}
?>
i3GEO.editorOL.pontos = [<?php
	if(isset($pontos)){
		$pontos = str_replace(" ",",",$pontos);
		echo $pontos;
	}
?>];
i3GEO.editorOL.kml = [<?php
	if(isset($kml)){
		$kml = str_replace(" ",",",$kml);
		$kml = explode(",",$kml);
		echo "'".implode("','",$kml)."'";
	}
?>];
i3GEO.editorOL.marca = "<?php
	if(isset($marca)){echo $marca;}
	else
	{echo "../pacotes/openlayers/img/marker-gold.png";}
?>";
i3GEO.editorOL.tiles = "<?php
	if(isset($tiles)){echo $tiles;}
	else
	{echo "true";}
?>";
i3GEO.editorOL.incluilayergrafico = "<?php
	if(isset($incluilayergrafico)){echo $incluilayergrafico;}
	else
	{echo "true";}
?>";
i3GEO.editorOL.ativalayerswitcher = "<?php
	if(isset($ativalayerswitcher)){echo $ativalayerswitcher;}
	else
	{echo "false";}
?>";
i3GEO.editorOL.ativarodadomouse = "<?php
	if(isset($ativarodadomouse)){echo $ativarodadomouse;}
	else
	{echo "true";}
?>";

i3GEO.editorOL.legendahtml = "<?php
	if(isset($legendahtml)){echo $legendahtml;}
	else
	{echo "true";}
?>";

<?php
if(isset($layerDefault) && $layerDefault != ""){
	echo "i3GEO.editorOL.layerDefault = '".$layerDefault."';\n";
}
if(isset($fundo) && $fundo != ""){
	echo "i3GEO.editorOL.fundo = '".implode(",",$fundo)."';";
}

if(isset($controles)){
	echo "i3GEO.editorOL.controles = [".implode(",",$objControles)."];";
}
if(isset($numzoomlevels)){
	echo "i3GEO.editorOL.numzoom = ".$numzoomlevels.";";
}
if(isset($minresolution)){
	echo "i3GEO.editorOL.minresolution = ".$minresolution.";";
}
if(isset($maxextent)){
	$maxextent = str_replace(" ",",",$maxextent);
	echo "i3GEO.editorOL.maxext = new OpenLayers.Bounds(".$maxextent.");\n";
}
else{
	echo "i3GEO.editorOL.maxext = new OpenLayers.Bounds(-76.5125927,-39.3925675209,-29.5851853,9.49014852081);\n";
}
if(isset($mapext)){
	$mapext = str_replace(" ",",",$mapext);
	echo "i3GEO.editorOL.mapext = new OpenLayers.Bounds(".$mapext.");\n";
}
if(empty($fundo)){
	// echo "i3GEO.editorOL.mapa.allOverlays = true;";
}
?>
i3GEO.Interface = {openlayers:{googleLike:false}};
//evita que seja mostrada a opcao de salvar figura
i3GEO.editorOL.nomeFuncaoSalvar = "";
var temp = i3GEO.editorOL.minresolution,
	r = [ i3GEO.editorOL.minresolution ];
for (var j = 0; j < (i3GEO.editorOL.numzoom - 1); j++) {
	temp = temp / 2;
	r.push(temp);
}
i3GEO.editorOL.incluilayergrafico = true;
i3GEO.editorOL.mapa = new OpenLayers.Map(
	'i3geoMapa',
	{
		autoUpdateSize: false,
		controls:[],
		resolutions: r,
		minResolution: i3GEO.editorOL.minresolution
	}
);
if(i3GEO.configura.locaplic === ""){
	i3GEO.configura.locaplic = "../";
}
//faz a inclusao das camadas que possuem plugins
//veja o codigo PHP abaixo da funcao
//a variavel i3GEO.editorOL.layersIniciais ja contem a entrada para o layer
//mas vazia. Isso e necessario para incluir a camada na ordem correta
function adicionaPluginI3geo(camada,visivel,indice){
	if(!camada.cache){
		camada["cache"] = "NAO";
	}
	var n, i, l = i3GEO.pluginI3geo.layerMashup("openlayers",camada,"4326");
	n = l.length;
	for(i = 0; i < n; i++){

		if(l[i].displayInLayerSwitcher === true){
			l[i].setVisibility(visivel);
		}
		if(l[i] != true){
			i3GEO.editorOL.layersIniciais[indice] = l[i];
		}
	}
}
<?php
	//camadas plugin
	//cria o javascript que faz a inclusao das camadas
	//configuradas com plugins do i3geo
	//a variavel $temasPluginI3Geo e definida no inicio do PHP
	foreach ($temasPluginI3Geo as $t){
		//var_dump($temasPluginI3Geo);exit;
		//cria um objeto javascript para iniciar o plugin
		$camada = '{"ferramentas":'.$t["ferramentas"].',"tiles":"'.$t["tiles"].'","tema": "'.$t["tema"].'","name":"'.$t["name"].'","plugini3geo":'.$t["plugin"].',"cache":"'.$t["cache"].'","transitioneffect":"'.$t["transitioneffect"].'"}';
		echo "var camada = $camada;\n";
		//echo "i3GEO.pluginI3geo[camada.plugini3geo.plugin].openlayers.inicia(camada,i3GEO.editorOL.mapa);\n";
		$visivel = "false";
		if(in_array($t["name"],$visiveis)){
			$visivel = "true";
		}
		echo "adicionaPluginI3geo(camada,".$visivel.",".$t["posicaoLayer"].");\n";
	}
?>
i3GEO.editorOL.inicia();
</script>
</body>
</html>
