<?php
error_reporting(0);
define(I3GEO,true);
include("validaacesso.php");

?>
<html>
<head>
<meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>
<script type='text/javascript' src='rgbcolor.js'></script>
<script type='text/javascript' src='canvg.js'></script>
<script type='text/javascript' src='canvas2image.js'></script>
<script type='text/javascript' src='base64.js'></script>
</head>
<body>
<div id=canvas ></div>
</body>
<script>
function render(svg, w, h) {
	document.createElement('canvas')
	var c = document.createElement('canvas');
	c.id = "svgcancas";
	c.width = w || 500;
	c.height = h || 500;
	document.getElementById('canvas').innerHTML = '';
	document.getElementById('canvas').appendChild(c);
	if (typeof FlashCanvas != "undefined") {
		FlashCanvas.initElement(c);
	}
	canvg(c, svg, { renderCallback: function () {
		oCanvas = document.getElementById("svgcancas");
		Canvas2Image.saveAsPNG(oCanvas,false,w,h);
	}});
}
render('<?php echo $_POST["svg"];?>',<?php echo (int) $_GET["w"];?>,<?php echo (int) $_GET["h"];?>);
</script>
</html>