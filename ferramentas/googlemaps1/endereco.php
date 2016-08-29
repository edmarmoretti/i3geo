<?php
include_once (dirname(__FILE__)."/../../classesphp/sani_request.php");
include(dirname(__FILE__)."/../../ms_configura.php");
include(dirname(__FILE__)."/../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
$_GET = array_merge($_GET,$_POST);
$x = $_GET["x"];
$y = $_GET["y"];

?>
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<link rel="stylesheet" type="text/css" href="../../css/i3geo_ferramentas6.css">

<script type="text/javascript" src="http://maps.google.com/maps?file=api&amp;v=2&amp;sensor=false&amp;key=<?php echo $googleApiKey; ?>"></script>
<script type="text/javascript">
function inicializa()
{
	var p2 = <?php echo $x;?>;
	var p1 = <?php echo $y;?>;
	ponto = new GLatLng(p1,p2)
		 geocoder = new GClientGeocoder();
		 var pt1 = function(response)
		 {
		if (!response || response.Status.code != 200) {
				 var ins = "N&atilde;o foi poss&iacute;vel encontrar o endere&ccedil;o. Status Code:" + response.Status.code;
		} else {
			place = response.Placemark[0];
				 var ins = '<b>orig latlng:</b>' + response.name + '<br/>'
				 ins += '<b>latlng:</b>' + place.Point.coordinates[0] + "," + place.Point.coordinates[1] + '<br>'
				 ins += '<b>Status Code:</b>' + response.Status.code + '<br>'
					ins += '<b>Status Request:</b>' + response.Status.request + '<br>'
					ins += '<b>Address:</b>' + place.address + '<br>'
					ins += '<b>Accuracy:</b>' + place.AddressDetails.Accuracy + '<br>'
					ins += '<b>Country code:</b> ' + place.AddressDetails.Country.CountryNameCode;
				ins += '<br><br>O endere&ccedil;o obtido &eacute; aproximado. Mais detalhes em <a href="http://nicogoeminne.googlepages.com/documentation.html" >Google</a>'
		}
		document.getElementById("mapa").innerHTML = ins
		}
		 geocoder.getLocations(ponto, pt1);
}
</script>
	</head>
	<body onload="inicializa()">
		<div id="mapa"></div>
		</body>
</html>