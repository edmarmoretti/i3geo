<?php
include("../../ms_configura.php");
$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
$url = $protocolo[0]."://".$_SERVER['HTTP_HOST']."/".basename($locaplic)."/admin/hiperbolica.php";
?>
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<title>Arvore Hiperbolica</title>
</head>
<STYLE TYPE="text/css">
table {
    width:100%;
    text-align: left;
}

body,ul,td {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 12px;
}
th {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 13px;
}

a:link {font-family: Arial, Helvetica, sans-serif;	font-size: 12px; font-style: normal; color: #005151;text-decoration: none;}
div#divArvore {
	position:absolute;
	left:0px;
	top:0px;
	width:1024px;
	height: 450px;
	overflow:auto;
}
</STYLE>
<body leftmargin="0" topmargin="0">
	<div id="divArvore">
		<applet code="tree.HTApplet.class" archive="tree4.jar" width="100%" height="100%" MAYSCRIPT="true">
		    <param name="htfile"  value="">
		    <param name="xmlfile" value="<?php echo $url;?>">
		    <param name="xmltipo" value="verbete">
		    <param name="htbackcoloredit" value="0xFF00FF">
		    <param name="htbackcolor" value="0xFFFFFF">
		    <param name="htlinkcolor" value="0x000000">
		    <param name="htsearchcolor" value="0xFF0000">
		    <param name="hthintcolor"  value="0xFFFFD9">
		    <param name="colornode" value="0xFFFACD">
		    <param name="colortextnode" value="0x000000">
		    <param name="colorrelationnode" value="0xE6E6FA">
		    <param name="colortextrelationnode" value="0x00FF00">
		    <param name="htbordertype" value="rounded">
		    <param name="htfont" value="arial" >
		    <param name="htfontsize" value="11">
		    <param name="htopenwindow" value="self"> 
   		    <param name="funcaoJS" value="SelecionaTema"> 
		</applet> 
	</div>
</body>
</body>
</html>
