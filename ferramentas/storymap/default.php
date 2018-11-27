<?php
include (dirname(__FILE__)."/../../classesphp/sani_request.php");
include("../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),"",false);
//exemplo: http://localhost/i3geo/ferramentas/storymap/default.php?tema=_lreal&layers=_lbiomashp _llocali
//temas do i3geo podem ser incluidos em &layers separados por espacos
if(empty($_GET["tema"])){
	echo "&tema nao definido";
	exit;
}
if(!file_exists(dirname(__FILE__)."/../../temas/".$_GET["tema"].".map")){
	echo "&tema nao existe";
	exit;
}
$map_type = "stamen:toner-lite";
if($_GET["layers"] != ""){
	$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
	$url = strtolower($protocolo[0])."://".$_SERVER['HTTP_HOST'].":". $_SERVER['SERVER_PORT'];
	$url .= str_replace("/ferramentas/storymap/default.php","",$_SERVER["PHP_SELF"]);
	$map_type = $url."/ogc.php?tema=".strip_tags($_GET["layers"])."&DESLIGACACHE=&Z={z}&X={x}&Y={y}";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<title>StoryMapJS</title>
<meta charset="utf-8">
<meta name="description" content="TimelineJS Embed">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-touch-fullscreen" content="yes">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<!-- CSS-->
<link rel="stylesheet" href="../../pacotes/knightlab/StoryMapJS/compiled/css/storymap.css?v1">
<!--FONT-->
<link rel="stylesheet" href="../../pacotes/knightlab/StoryMapJS/compiled/css/fonts/font.unicaone-vollkorn.css?v1">
<style>
html, body {
	height: 100%;
	width: 100%;
	padding: 0px;
	margin: 0px;
}
.vco-map-line{
	display: none
}
</style>

</head>
<body>
	<div id="storymap"></div>
	<!-- JavaScript-->
	<script src="../../pacotes/knightlab/StoryMapJS/compiled/js/storymap.js"></script>
	<script>
	//http://localhost/ogc.php?tema=_llocali&DESLIGACACHE=&tms=/_llocali/{z}/{x}/{y}.png
	VCO.Language = {
	    name: "Portugu&ecirc;s",
	    lang: "pt",
	    messages: {
	        loading: "carregando",
	        wikipedia: "da Wikipedia, a enciclop&eacute;dia livre",
			start: "Explore"
	    },
	    buttons: {
	        map_overview:      "vista geral do mapa",
			overview:          "vista geral",
	        backtostart:       "voltar ao come&ccedil;o",
	        collapse_toggle:   "ocultar o mapa",
	        uncollapse_toggle: "mostrar o mapa"
	    }
	};

	var storymap = new VCO.StoryMap('storymap', '../../json.php?tema=<?php echo strip_tags($_GET["tema"]);?>&format=storymap&', {
		"map_type": "<?php echo $map_type;?>",
		"show_lines": false
	});
	window.onresize = function(event) {
		storymap.updateDisplay();
	}
</script>
</body>
</html>
