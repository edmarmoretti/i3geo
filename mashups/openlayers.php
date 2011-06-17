<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/html"); ?>
<?php
include_once("../classesphp/pega_variaveis.php");
include_once("../classesphp/carrega_ext.php");
error_reporting(0);
//
//imprime na tela a ajuda ao usuário
//
if(!isset($temas))
{ajuda();}
if(!isset($largura))
{$largura = 400;}
if(!isset($altura))
{$altura = 400;}
//
//define quais controles serão mostrados no mapa
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
//define quais botoes serão mostrados no mapa
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
	$botoes = "{".implode(",",$objBotoes)."}";
}

//
//define a lista de layers do tipo baselayers
//$fundo é um array com a lista dos nomes possíveis ou passados pela url
//cada um deve ser definido em openlayers.js.php
//
if(isset($fundo) && $fundo != ""){
	$fundo = str_replace(","," ",$fundo);
	$fundo = explode(" ",$fundo);
}
//
//define quais os layers que comporão o mapa
//

if($temas != "")
{
	$temas = str_replace(" ",",",$temas);
	$temas = strtolower($temas);
	$temas = explode(",",$temas);
	$layers = array();
	$objOpenLayers = array();
	if(isset($servidor) && $servidor != "../ogc.php"){
		$layers = $temas;
		foreach($temas as $tema){
			$objOpenLayers[] = 'new OpenLayers.Layer.WMS( "'.$tema.'", "'.$servidor.'?tema='.$tema.'&",{layers:"'.$tema.'",transparent: "true", format: "image/png"},{isBaseLayer:false})';
		}
	}
	else{
		foreach($temas as $tema){
			if(file_exists("../temas/".$tema.".map")){
				$maptemp = @ms_newMapObj("../temas/".$tema.".map");
				for($i=0;$i<($maptemp->numlayers);++$i)
				{
					$layern = $maptemp->getLayer($i);
					$layers[] = $layern->name;
				}
				$ebase = "false";
				if(isset($fundo) && in_array($tema,$fundo))
				{$ebase = "true";}
				$objOpenLayers[] = 'new OpenLayers.Layer.WMS( "'.($layern->getmetadata("tema")).'", "../ogc.php?tema='.$tema.'&",{layers:"'.implode(",",$layers).'",transparent: "true", format: "image/png"},{isBaseLayer:'.$ebase.'})';
			}
			else
			{echo $tema." não foi encontrado.<br>";}
			$layers = array();
		}
	}
}

function ajuda(){
	echo "
<pre><b>
Mashup OpenLayers
Parâmetros:
	servidor - endereco do servidor OGC utilizado. Por default é ../ogc.php o que força o uso do i3geo local
	temas - lista com os temas (mapfiles) do i3Geo que serão incluídos no mapa
	numzoomlevels - número de níveis de zoom, default=6
	maxextent - extensão geográfica do mapa (xmin,ymin,xmax,ymax)
	largura - lagura do mapa em pixels
	altura - altura do mapa em pixels
	pontos - lista de coordenadas x e y que serão incluídas como marcas no mapa
	marca - nome do arquivo que contém a imagem que será utilizada para mostrar as coordenadas	
	
	fundo - lista com os nomes, separados por ',' dos layers que serão usados como fundo para o mapa. Se não for definido,
			será usado o default. O primeiro da lista será o fundo ativo. Se na lista de temas de fundo estiver algum
			tema incluido com o parametro 'temas', esses serão incluídos como temas de fundo.
			Os seguintes fundos podem usados nessa lista:
			
			ol_mma - base cartográfica do Brasil
			ol_wms - base mundial da Meta Carta
			jpl_wms - mosaico de imagens de satélite
			osm_wms - base do open Street Map
			top_wms - toponímia do servidor do MMA usado no mapa de referência
			est_wms - estados do Brasil
			
	controles - lista com os nomes dos controles que serão adicionados ao mapa. Se não for definido, todos os controles serão adicionados
		navigation
		panzoombar 
		layerswitcher 
		scaleline 
		mouseposition
		overviewmap 
		keyboarddefaults
	botoes - lista com os nomes dos botoes que serão adicionados ao mapa. Se não for definido, todos os botões serão adicionados
		pan
		zoombox
		zoomtot
		distancia
		area
		identifica
		ponto
		linha
		poligono
		edita
		uniao
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

	Para ver a lista de códigos de temas, que podem ser utilizados no parâmetro 'temas', acesse: 
	<a href='../ogc.php?lista=temas' >lista de temas</a>. Os códigos são mostrados em vermelho.

	Exemplo:

	&lt;iframe height='400px' src='http://mapas.mma.gov.br/i3geo/mashups/openlayers.php?temas=bioma&amp;altura=350&amp;largura=350' style='border: 0px solid white;' width='400px'&gt;&lt;/iframe&gt;

	";	
	exit;
}
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<link rel="stylesheet" type="text/css" href="../pacotes/yui270/build/fonts/fonts-min.css" />
<link rel="stylesheet" type="text/css" href="../pacotes/yui270/build/container/assets/skins/sam/container.css" />
<script type="text/javascript" src="../pacotes/yui270/build/yahoo-dom-event/yahoo-dom-event.js"></script>
<script type="text/javascript" src="../pacotes/yui270/build/dragdrop/dragdrop-min.js"></script>
<script type="text/javascript" src="../pacotes/yui270/build/container/container-min.js"></script>
<script type="text/javascript" src="../classesjs/compactados/classe_calculo_compacto.js"></script>
<script type="text/javascript" src="../pacotes/openlayers/OpenLayers.js.php"></script>
<script type="text/javascript" src="openlayers.js.php"></script>
<link rel="stylesheet" href="theme/default/style.css" type="text/css" />
<link rel="stylesheet" href="openlayers.css" type="text/css" />
<style>
.yui-skin-sam .container-minimiza {
	background:transparent url(../pacotes/yui270/build/assets/skins/sam/sprite.png) no-repeat scroll 0 -450px;
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
<div id=i3geoMapa style="width:<?php echo $largura;?>px;height:<?php echo $altura;?>px;"></div>
<div id=i3geoSelTemaAtivo style="height:15em;z-index:3000" class=" yui-skin-sam"></div>
<script>
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
i3GEO.editorOL.marca = "<?php
	if(isset($marca)){echo $marca;}
	else
	{echo "../pacotes/openlayers/img/marker-gold.png";}
?>";
<?php if(isset($fundo)){
	echo "i3GEO.editorOL.fundo = '".implode(",",$fundo)."';";
}
?>
<?php if(isset($controles)){
	echo "i3GEO.editorOL.controle = [".implode(",",$objControles)."];";
}
?>
<?php if(isset($numzoomlevels)){
	echo "i3GEO.editorOL.numzoom = ".$numzoomlevels.";";
}
?>
<?php if(isset($maxextent)){
	echo "i3GEO.editorOL.maxext = new OpenLayers.Bounds(".$maxextent.");";
}
?>
i3GEO.editorOL.mapa = new OpenLayers.Map('i3geoMapa',{controls:[]})
i3GEO.editorOL.inicia();
</script>
</body>
</html>
<?php if(extension_loaded('zlib')){ob_end_flush();}?>