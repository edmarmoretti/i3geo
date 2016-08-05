<?php 
include (dirname(__FILE__)."/../../classesphp/sani_request.php");
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>Twitter</title>
		<!-- Dependencies -->
		<script src="http://yui.yahooapis.com/2.9.0/build/yahoo/yahoo-min.js"></script>
		<!-- Source File -->
		<script src="http://yui.yahooapis.com/2.9.0/build/cookie/cookie-min.js"></script>
		<script src="https://maps.google.com/maps/api/js?sensor=false" type="text/javascript"></script>

	</head>
	<body style='font-family: helvetica;' >
		<div style="z-index:10;width:250px;position:absolute;top:10px;left:100px;text-align:left;">
			<form><input id="palavra" type="text" value='<?php echo $_GET["q"];?>' style="width:150px;"/><input type="button" value="Localizar" onclick="atualiza();"/></form>
		</div>
		<div id="map" style="width:500px;height:500px"></div>
		<script src="index.js" type="text/javascript"></script>
		<script>
			inicia('<?php echo $_GET["q"];?>');
		</script>
	</body>
</html>
