<?php
/*
Parametros:

temas - lista com os temas (mapfiles) do i3Geo que serão incluídos no mapa

numzoomlevels - número de níveis de zoom, default=6

maxextent - extensão geográfica do mapa

controles - lista separada por "," com os nomes dos controles que serão adicionados ao mapa. Se não for definido, todos os controles serão adicionados.

botoes - lista com os nomes dos botoes que serão adicionados ao mapa. Se não for definido, todos os botões serão adicionados

servidor - endereco do servidor OGC utilizado. Por default é "../ogc.php" o que força o uso do i3geo local

largura - lagura do mapa em pixels

altura - altura do mapa em pixels
*/

include_once("../classesphp/pega_variaveis.php");
include_once("../classesphp/carrega_ext.php");
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
//define o nível de zoom
//
if(!isset ($numzoomlevels))
{$numzoomlevels = "6";}
//
//define a extensão geográfica que será aplicada
//
if(!isset($maxextent))
{$maxextent = "-76.5125927 -39.3925675209 -29.5851853 9.49014852081";}
$maxextent = str_replace(" ",",",$maxextent);
//
//define quais controles serão mostrados no mapa
//
$objControles = array();
if(!isset($controles)){
	$objControles[] = "new OpenLayers.Control.Navigation()";
	$objControles[] = "new OpenLayers.Control.PanZoomBar()";
	$objControles[] = "new OpenLayers.Control.LayerSwitcher({'ascending':false})";
	$objControles[] = "new OpenLayers.Control.ScaleLine()";
	$objControles[] = "new OpenLayers.Control.MousePosition({'separator':' '})";
	$objControles[] = "new OpenLayers.Control.OverviewMap()";
	$objControles[] = "new OpenLayers.Control.KeyboardDefaults()";
}
else{
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
if(!isset($botoes)){
	$objBotoes[] = "'pan':true";
	$objBotoes[] = "'zoombox':true";
	$objBotoes[] = "'zoomtot':true";
	$objBotoes[] = "'legenda':true";
	$objBotoes[] = "'distancia':true";
	$objBotoes[] = "'area':true";
	$objBotoes[] = "'identifica':true";
	$objBotoes[] = "'linha':true";
	$objBotoes[] = "'ponto':true";
	$objBotoes[] = "'poligono':true";
	$objBotoes[] = "'edita':true";
	$objBotoes[] = "'apaga':true";
	$objBotoes[] = "'procura':true";
	$objBotoes[] = "'salva':true";
}
else{
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
	{$objBotoes[] = "'procura':false";}
	if(in_array("salva",$botoes))
	{$objBotoes[] = "'salva':false";}
}
$botoes = "{".implode(",",$objBotoes)."}";
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
				$objOpenLayers[] = 'new OpenLayers.Layer.WMS( "'.($layern->getmetadata("tema")).'", "../ogc.php?tema='.$tema.'&",{layers:"'.implode(",",$layers).'",transparent: "true", format: "image/png"},{isBaseLayer:false})';
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
		apaga
		captura
		procura
		salva

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
<link rel="stylesheet" type="text/css" href="../pacotes/yui270/build/fonts/fonts-min.css" />
<link rel="stylesheet" type="text/css" href="../pacotes/yui270/build/container/assets/skins/sam/container.css" />
<script type="text/javascript" src="../pacotes/yui270/build/yahoo-dom-event/yahoo-dom-event.js"></script>
<script type="text/javascript" src="../pacotes/yui270/build/dragdrop/dragdrop-min.js"></script>
<script type="text/javascript" src="../pacotes/yui270/build/container/container-min.js"></script>
<script type="text/javascript" src="../classesjs/compactados/classe_calculo_compacto.js"></script>
<script type="text/javascript" src="../pacotes/openlayers/OpenLayers.js.php"></script>
<link rel="stylesheet" href="theme/default/style.css" type="text/css" />
<link rel="stylesheet" href="openlayers.css" type="text/css" />
</head>
<body class=" yui-skin-sam">
<div id=i3geoMapa style="width:<?php echo $largura;?>px;height:<?php echo $altura;?>px;"></div>
<div id=i3geoSelTemaAtivo style="height:15em;z-index:3000" class=" yui-skin-sam"></div>
<script type="text/javascript">
<?php include("openlayers.js.php"); ?>
i3GEOOL.inicia()
</script>
</body>
</html>