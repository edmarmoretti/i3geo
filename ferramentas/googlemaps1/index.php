<?php
include("../../ms_configura.php");
include("../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
?>
<html>
<head>
<script type="text/javascript" src="http://maps.google.com/maps/api/js?key=<?php echo $googleApiKey; ?>"></script>
<script src="../../pacotes/cpaint/cpaint2.inc.compressed.js" type="text/javascript"></script>
<script src="index.js" type="text/javascript"></script>

</head>
<body onload="inicializa();">
	<div id="mapa" style="width: 440px; height: 340px"></div>
</body>
</html>
