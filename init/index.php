<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<meta name="url" content="http://www.softwarepublico.gov.br" />
<meta name="description" content="i3Geo" />
<meta name="keywords" content="i3geo mapa geoprocessamento" />
<meta name="charset" content="ISO-8859-1" />
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<meta name="revisit-after" content="1" />
<?php
$cache_expire = 1;
header("Pragma: public");
header("Cache-Control: max-age=".$cache_expire);
header('Expires: ' . gmdate('D, d M Y H:i:s', time()+$cache_expire) . ' GMT');
include("../ms_configura.php");
if($i3geomaster[0]["usuario"] == "admin" && $i3geomaster[0]["senha"] == "admin" ){
	echo "<p style='font-size:14px;color:red'>ATEN&Ccedil;&Atilde;O!!! Sua seguran&ccedil;a esta vulner&aacute;vel: edite o arquivo i3geo/ms_configura.php e altere o login e senha da vari&aacute;vel i3geomaster";
}
?>

<script type="text/javascript" src="../classesjs/i3geo.js"></script>
<script type="text/javascript" src="dicionario.js"></script>
<style>
body {
	margin: 0.5 cm;
	padding-top:12px;
	COLOR: #2F4632;
	text-align: center;
	font-size: 0.6cm;
	font-family: Verdana, Arial, Helvetica, sans-serif;
	width:900px;
	background: rgb(250,250,250);
}
.r {
    border: 1px solid #F0F0F0;
    border-radius: 5px 5px 5px 5px;
    box-shadow: 0 8px 10px 0 #888888;
    float: left;
    height: 160px;
    margin: 25px;
    padding: 10px;
    width: 220px;
	background: white;
	vertical-align:middle;
	font-size: 0.4cm;
}
td {
	font-size: 0.4cm;
}
h1{
	font-size: 0.6cm;
	text-align:left;
	margin: 25px;
}
#bandeiras
{width:80px;text-align:left;}
</style>
<script type="text/javascript">
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-32162671-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
</script>

</head>
<body style="background-color: white;">
<div id="bandeiras" ></div>
	<a href="remover.php" ><table class="r">
		<tr>
			<td><img src="../imagens/oxygen/22x22/dialog-close" /><br><script>document.write($trad(1,g_traducao_init));</script></script></a></td>
		</tr>
	</table></a>

	<a href="testei3geo" ><table class="r">
		<tr>
			<td><img src="../imagens/i3geo1.png" /><br>Servidor
					de testes do i3Geo</a></td>
		</tr>
	</table></a>
</body>
<script>
i3GEO.configura.locaplic = "..";
i3GEO.idioma.IDSELETOR = "bandeiras";
i3GEO.idioma.mostraSeletor();
</script>
</html>
