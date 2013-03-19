<?php
include_once("../ms_configura.php");
include_once("../classesphp/pega_variaveis.php");
include_once("../classesphp/carrega_ext.php");
error_reporting(0);
//
//recupera um mapa salvo no banco de administracao
//
if(!empty($restauramapa)){
	include(dirname(__FILE__)."/../admin/php/conexao.php");
	if(!empty($esquemaadmin)){
		$esquemaadmin = str_replace(".","",$esquemaadmin).".";
	}
	$q = $dbh->query("select * from ".$esquemaadmin."i3geoadmin_mapas where id_mapa=$restauramapa ",PDO::FETCH_ASSOC);
	$mapasalvo = $q->fetchAll();
	$mapasalvo = $mapasalvo[0];
	if(strtoupper($mapasalvo["publicado"]) != "NAO"){
		$xbase = $dir_tmp."/".nomeRandomicoM().".map";
		$baseh = fopen($xbase,'w');
		$s = fwrite($baseh,base64_decode($mapasalvo["mapfile"]));
		fclose($baseh);
	}
	$dbh = null;
	$dbhw = null;
	$m = ms_newMapObj($xbase);
	$w = $m->web;
	$w->set("imagepath",dirname($w->imagepath)."/");
	$w->set("imageurl",dirname($w->imageurl)."/");
	//apaga algumas camadas
	$l = $m->getlayerbyname("rosadosventos");
	if($l != ""){
		$l->set("status",MS_DELETE);
	}
	$l = $m->getlayerbyname("copyright");
	if($l != ""){
		$l->set("status",MS_DELETE);
	}
	$m->save($xbase);
	$fundo = $xbase;
	$temas = $xbase;
}
//
//imprime na tela a ajuda ao usu&aacute;rio
//
if(!isset($temas))
{ajuda();}
//problema na vers&atilde;o 211 do OpenLayers. Tamanho em % n&atilde;o &eacute; aceito
//if(!isset($largura))
//{$largura = 500;}
if(isset($largura) && !isset($altura))
{$altura = $largura;}
if(isset($altura) && !isset($largura))
{$largura = $altura;}
//
//define quais controles ser&atilde;o mostrados no mapa
//
$objControles = array();
if(isset($controles)){
	$controles = str_replace(" ",",",$controles);
	$controles = strtolower($controles);
	$controles = explode(",",$controles);
	if(in_array("navigation",$controles))
	{$objControles[] = "new OpenLayers.Control.Navigation()";}
	if(in_array("panzoombar",$controles))
	{$objControles[] = "new OpenLayers.Control.PanZoomBar()";}
	if(in_array("layerswitcher",$controles))
	{$objControles[] = "new OpenLayers.Control.LayerSwitcher({'ascending':false})";}
	if(in_array("scaleline",$controles))
	{$objControles[] = "new OpenLayers.Control.ScaleLine()";}
	if(in_array("mouseposition",$controles))
	{$objControles[] = "new OpenLayers.Control.MousePosition({'separator':' '})";}
	if(in_array("overviewmap",$controles))
	{$objControles[] = "new OpenLayers.Control.OverviewMap()";}
	if(in_array("keyboarddefaults",$controles))
	{$objControles[] = "new OpenLayers.Control.KeyboardDefaults()";}
}
//
//define quais botoes ser&atilde;o mostrados no mapa
//
$objBotoes = array();
if(isset($botoes)){
	$botoes = str_replace(" ",",",$botoes);
	$botoes = strtolower($botoes);
	$botoes = explode(",",$botoes);
	if(in_array("pan",$botoes))
	{$objBotoes[] = "'pan':true";}
	if(in_array("zoombox",$botoes))
	{$objBotoes[] = "'zoombox':true";}
	if(in_array("zoomtot",$botoes))
	{$objBotoes[] = "'zoomtot':true";}
	if(in_array("legenda",$botoes))
	{$objBotoes[] = "'legenda':true";}
	if(in_array("distancia",$botoes))
	{$objBotoes[] = "'distancia':true";}
	if(in_array("area",$botoes))
	{$objBotoes[] = "'area':true";}
	if(in_array("identifica",$botoes))
	{$objBotoes[] = "'identifica':true";}
	if(in_array("linha",$botoes))
	{$objBotoes[] = "'linha':true";}
	if(in_array("ponto",$botoes))
	{$objBotoes[] = "'ponto':true";}
	if(in_array("poligono",$botoes))
	{$objBotoes[] = "'poligono':true";}
	if(in_array("edita",$botoes))
	{$objBotoes[] = "'edita':true";}
	if(in_array("listag",$botoes))
	{$objBotoes[] = "'listag':true";}
	if(in_array("corta",$botoes))
	{$objBotoes[] = "'corta':true";}
	if(in_array("apaga",$botoes))
	{$objBotoes[] = "'apaga':true";}
	if(in_array("procura",$botoes))
	{$objBotoes[] = "'procura':true";}
	if(in_array("salva",$botoes))
	{$objBotoes[] = "'salva':true";}
	if(in_array("ajuda",$botoes))
	{$objBotoes[] = "'ajuda':true";}
	if(in_array("fecha",$botoes))
	{$objBotoes[] = "'fecha':true";}
	if(in_array("tools",$botoes))
	{$objBotoes[] = "'tools':true";}
	if(in_array("undo",$botoes))
	{$objBotoes[] = "'undo':true";}
	if(in_array("propriedades",$botoes))
	{$objBotoes[] = "'propriedades':true";}
	if(in_array("frente",$botoes))
	{$objBotoes[] = "'frente':true";}
	if(in_array("texto",$botoes))
	{$objBotoes[] = "'texto':true";}
	$botoes = "{".implode(",",$objBotoes)."}";
}

//
//define a lista de layers do tipo baselayers
//$fundo &eacute; um array com a lista dos nomes poss&iacute;veis ou passados pela url
//cada um deve ser definido em openlayers.js.php
//
if(isset($fundo) && $fundo != ""){
	$fundo = str_replace(","," ",$fundo);
	$fundo = explode(" ",$fundo);
}

//
//define quais os layers que compor&atilde;o o mapa
//
if(isset($temas)){
	$objOpenLayers = array();
}
if($temas != ""){
	$temas = str_replace(" ",",",$temas);
	//$temas = strtolower($temas);
	$temas = explode(",",$temas);
	if(!isset($visiveis))
	{$visiveis = $temas;}
	else{
		$visiveis = str_replace(" ",",",$visiveis);
		//$visiveis = strtolower($visiveis);
		$visiveis = explode(",",$visiveis);
	}
	$objOpenLayers = array();
	if(isset($servidor) && $servidor != "../ogc.php"){
		$layers = $temas;
		foreach($temas as $tema){
			$nomeLayer = str_replace(".map","",basename($tema));
			$nomeLayer = str_replace(".php","",$nomeLayer);
			$objOpenLayers[] = 'new OpenLayers.Layer.WMS( "'.$tema.'", "'.$servidor.'?tema='.$tema.'&",{layers:"'.$nomeLayer.'",transparent: "true", format: "image/png"},{isBaseLayer:false})';
		}
	}
	else{
		foreach($temas as $tema){
			if(file_exists($locaplic."/temas/".$tema.".gvp")){
				include_once($locaplic."/pacotes/gvsig/gvsig2mapfile/class.gvsig2mapfile.php");
				$gm = new gvsig2mapfile($locaplic."/temas/".$tema.".gvp");
				$gvsigview = $gm->getViewsNames();
				$objOpenLayers[] = 'new OpenLayers.Layer.WMS( "'.$gvsigview[0].'", "../ogc.php?tema='.$tema.'&",{layers:"'.$tema.'",transparent: "true", format: "image/png"},{singleTile:false,visibility:true,isBaseLayer:false})';
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
				}
				if($nomeMap != ""){
					$layers = array();
					$maptemp = @ms_newMapObj($nomeMap);
					if($maptemp){
						for($i=0;$i<($maptemp->numlayers);++$i)	{
							$layern = $maptemp->getLayer($i);
							$layers[] = $layern->name;
						}
						$nomeLayer = implode(",",$layers);
						$tituloLayer = $layern->getmetadata("tema");
						$ebase = "false";
						if(isset($fundo) && $fundo != ""){
							if(in_array($tema,$fundo)){
								$ebase = "true";
							}
						}
						$visivel = "false";
						if(in_array($tema,$visiveis))
						{$visivel = "true";}
						$objOpenLayers[] = 'new OpenLayers.Layer.WMS( "'.$tituloLayer.'", "../ogc.php?tema='.$tema.'&",{layers:"'.$nomeLayer.'",transparent: "true", format: "image/png"},{singleTile:true,visibility:'.$visivel.',isBaseLayer:'.$ebase.'})';
					}
				}
				else
				{echo $tema." n&atilde;o foi encontrado.<br>";}
			}
		}
	}
}
function nomeRandomicoM($n=10){
	$nomes = "";
	$a = 'azertyuiopqsdfghjklmwxcvbnABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$max = 51;
	for($i=0; $i < $n; ++$i)
	{$nomes .= $a{mt_rand(0, $max)};}
	return $nomes;
}
function ajuda(){
	echo "
<pre><b>
Mashup OpenLayers
Par&acirc;metros:
	restauramapa - id do mapa armazenado no sistema de administracao e que ser&aacute; restaurado para ser aberto novamente (veja em i3geo/admin/html/mapas.html)
	kml - lista de endere&ccedil;os (url) de um arquivos kml que ser&atilde;o adicionados ao mapa. Separado por ','
	servidor - por default &eacute; ../ogc.php o que for&ccedil;a o uso do i3geo local. Esse &eacute; o programa que ser&aacute; utilizado em conjunto com a lista definida no par&acirc;metro 'temas'
	temas - lista com os temas (mapfiles) do i3Geo que ser&atilde;o inclu&iacute;dos no mapa. Pode ser inclu&iacute;do um arquivo mapfile que esteja fora da pasta i3geo/temas. Nesse caso, deve-se definir o caminho completo do arquivo e tamb&eacute;m o par&acirc;metro &layers
	visiveis - lista de temas (mesmos nomes do par&acirc;metro temas) que iniciar&atilde;o como vis&iacute;veis no mapa. Se n&atilde;o for definido, todos os temas ser&atilde;o vis&iacute;veis.
	numzoomlevels - n&uacute;mero de n&iacute;veis de zoom, default=6
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

	Para ver a lista de códigos de temas, que podem ser utilizados no par&acirc;metro 'temas', acesse:
	<a href='../ogc.php?lista=temas' >lista de temas</a>. Os códigos s&atilde;o mostrados em vermelho.

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

<!--
<link rel="stylesheet" type="text/css" href="../pacotes/yui290/build/fonts/fonts-min.css" />
<link rel="stylesheet" type="text/css" href="../pacotes/yui290/build/container/assets/skins/sam/container.css" />
<script type="text/javascript" src="../pacotes/yui290/build/yahoo-dom-event/yahoo-dom-event.js"></script>
<script type="text/javascript" src="../pacotes/yui290/build/dragdrop/dragdrop-min.js"></script>
<script type="text/javascript" src="../pacotes/yui290/build/container/container-min.js"></script>
<script type="text/javascript" src="../classesjs/compactados/classe_calculo_compacto.js"></script>
<script type="text/javascript" src="../pacotes/openlayers/OpenLayers211.js"></script>
<script type="text/javascript" src="openlayers.js"></script>

-->
<script type="text/javascript" src="openlayers_compacto.js.php"></script>
<script type="text/javascript" src="../classesjs/compactados/classe_util_compacto.js"></script>
<link rel="stylesheet" href="openlayers_compacto.css" type="text/css" />

<!--
<link rel="stylesheet" href="theme/default/style.css" type="text/css" />
<link rel="stylesheet" href="openlayers.css" type="text/css" />
-->
<style>
.yui-skin-sam .container-minimiza {
	background:transparent url(../pacotes/yui290/build/assets/skins/sam/sprite.png) no-repeat scroll 0 -450px;
	cursor:pointer;
	height:15px;
	position:absolute;
	right:30px;
	top:1px;
	width:25px;
	z-index:2001;
	opacity:.8;
	filter:alpha(opacity=80);
}
</style>
</head>
<body class=" yui-skin-sam">
<?php
if(isset($largura) && $largura != "")
{echo '<div id=i3geoMapa style="width:'.$largura.'px;height:'.$altura.'px;"></div>';}
else
{echo '<div id=i3geoMapa style="width:0;height:0"></div>';}

?>
<div id=i3geoSelTemaAtivo style="height:15em;z-index:3000;display:none" class=" yui-skin-sam"></div>
<script>
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
<?php
if(isset($fundo) && $fundo != ""){
	echo "i3GEO.editorOL.fundo = '".implode(",",$fundo)."';";
}

if(isset($controles)){
	echo "i3GEO.editorOL.controles = [".implode(",",$objControles)."];";
}
if(isset($numzoomlevels)){
	echo "i3GEO.editorOL.numzoom = ".$numzoomlevels.";";
}
if(isset($maxextent)){
	$maxextent = str_replace(" ",",",$maxextent);
	echo "i3GEO.editorOL.maxext = new OpenLayers.Bounds(".$maxextent.");";
}
else
{echo "i3GEO.editorOL.maxext = new OpenLayers.Bounds(-76.5125927,-39.3925675209,-29.5851853,9.49014852081);";}
if(isset($mapext)){
	$mapext = str_replace(" ",",",$mapext);
	echo "i3GEO.editorOL.mapext = new OpenLayers.Bounds(".$mapext.");";
}
if(empty($fundo)){
	//echo "i3GEO.editorOL.mapa.allOverlays = true;";
}
?>
i3GEO.editorOL.mapa = new OpenLayers.Map(
	'i3geoMapa',
	{
		controls:[],
		resolutions:[0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125,0.000021457672119140625]
	}
);
i3GEO.editorOL.inicia();
</script>
</body>
</html>