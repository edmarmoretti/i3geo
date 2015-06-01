<?php 
	if(empty($_GET["tema"])){
		echo "&tema nao definido";
		exit;
	}
	if(!file_exists(dirname(__FILE__)."/../../temas/".$_GET["tema"])){
		echo "&tema nao existe";
		exit;
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
<!--link(rel='stylesheet', href='css/fonts/font.pt.css?v1')-->
<!--link(rel='stylesheet', href='css/fonts/font.abril-droidsans.css?v1')-->
<!--link(rel='stylesheet', href='css/fonts/font.amatic-andika.css?v1')-->
<!--link(rel='stylesheet', href='css/fonts/font.bitter-raleway.css?v1')-->
<!--link(rel='stylesheet', href='css/fonts/font.clicker-garamond.css?v1')-->
<!--link(rel='stylesheet', href='css/fonts/font.roboto-megrim.css?v1')-->
<link rel="stylesheet" href="../../pacotes/knightlab/StoryMapJS/compiled/css/fonts/font.unicaone-vollkorn.css?v1">
<!--link(rel='stylesheet', href='css/fonts/font.playfair-faunaone.css?v1')-->
<!--link(rel='stylesheet', href='css/fonts/font.playfair.css?v1')-->
<!--link(rel='stylesheet', href='css/fonts/font.pt.css?v1')-->
<!--link(rel='stylesheet', href='css/fonts/font.dancing-ledger.css?v1')-->
<!--link(rel='stylesheet', href='css/fonts/font.fjalla-average.css?v1')-->
<!--link(rel='stylesheet', href='css/fonts/font.georgia-helvetica.css?v1')-->
<!--link(rel='stylesheet', href='css/fonts/font.knightlab.css?v1')-->
<!--link(rel='stylesheet', href='css/fonts/font.lustria-lato.css?v1')-->
<!--link(rel='stylesheet', href='css/fonts/font.medula-lato.css?v1')-->
<!--link(rel='stylesheet', href='css/fonts/font.abril-droidsans.css?v1')-->
<!--link(rel='stylesheet', href='css/fonts/font.oldstandard.css?v1')-->
<!--link(rel='stylesheet', href='css/fonts/font.rufina-sintony.css?v1')-->
<!--link(rel='stylesheet', href='css/fonts/font.opensans-gentiumbook.css?v1')-->
<!--link(rel='stylesheet', href='css/fonts/font.ubuntu.css?v1')-->
<!--link(rel='stylesheet', href='css/fonts/font.default.css?v1')-->
<!-- Style-->
<style>
html, body {
	height: 100%;
	width: 100%;
	padding: 0px;
	margin: 0px;
}
</style>

</head>
<body>
	<div id="storymap"></div>
	<!-- JavaScript-->
	<script src="../../pacotes/knightlab/StoryMapJS/compiled/js/storymap.js"></script>
	<script>
	var storymap = new VCO.StoryMap('storymap', '../../json.php?tema=<?php echo strip_tags($_GET["tema"]);?>&format=storymap&', {
		show_lines: false
	});
	window.onresize = function(event) {
		storymap.updateDisplay();
	}
</script>
</body>
</html>
