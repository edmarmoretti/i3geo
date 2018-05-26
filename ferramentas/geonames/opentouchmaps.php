<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<script type="text/javascript"  src='../../js/util.js' ></script>
<script type="text/javascript"  src='../../js/social.js' ></script>
<style>
p {
color:#2F4632;
font-family:Verdana,Arial,Helvetica,sans-serif;
font-size:12px;
text-align:left;
}
</style>
</head>
<body style="background-color:white;margin:10px;text-align:left">
<?php
include_once (dirname(__FILE__)."/../../classesphp/sani_request.php");
include(dirname(__FILE__)."/../../ms_configura.php");
include(dirname(__FILE__)."/../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
$d = "http://www.opentouchmap.org/?lat=".$_GET["y"]."&lon=".$_GET["x"]."&zoom=12%20lat:".$_GET["y"]."%20lon:".$_GET["x"];
echo "<p>O c&oacute;digo de barras abaixo pode ser lido por dispositivos m&oacute;veis, como os celulares ou pdas.";
echo "<p>Se o seu dispositivo possuir o software adequado, fotografe o c&oacute;digo para abrir o navegador de internet ou clique no link.";
echo "<p><a href='$d' >$d</a><br>";
echo "<img src='../../pacotes/qrcode/php/qr_img.php?d=$d' />";
?>
<div id=i3GEOcompartilhar style="text-align:left;border-top:1px solid rgb(250,250,250);padding-top:1px" ></div>
<script>
i3GEO.social.compartilhar("i3GEOcompartilhar","<?php echo $d;?>","<?php echo $d;?>","","../..");
</script>
</body>