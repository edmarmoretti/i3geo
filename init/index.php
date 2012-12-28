<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/strict.dtd">

<html>
<head>
<meta name="url" content="http://www.softwarepublico.gov.br" />
<meta name="description" content="i3Geo" />
<meta name="keywords" content="i3geo mapa geoprocessamento" />
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php
$cache_expire = 1;
header("Pragma: public");
header("Cache-Control: max-age=".$cache_expire);
header('Expires: ' . gmdate('D, d M Y H:i:s', time()+$cache_expire) . ' GMT');
include("../ms_configura.php");
?>

<script type="text/javascript" src="../classesjs/i3geo.js"></script>
<script type="text/javascript" src="dicionario.js"></script>
<style>
body {
	margin: 0.5 cm auto;
	padding-top: 12px;
	COLOR: #2F4632;
	text-align: center;
	font-size: 0.6cm;
	font-family: Verdana, Arial, Helvetica, sans-serif;
	background: rgb(250, 250, 250);
}

.r {
	border: 1px solid #F0F0F0;
	border-radius: 5px 5px 5px 5px;
	box-shadow: rgb(136, 136, 136) 0 8px 10px 0;
	float: left;
	height: 150px;
	margin: 10px 10px 10px auto;
	padding: 5px;
	width: 200px;
	background: white;
	vertical-align: middle;
	font-size: 0.4cm;
	position: relative;
	display:block;
	text-align:center;
}
table{
	width: 100%;
}
td {
	font-size: 0.4cm;
	text-align:center;
	height: 150px;
}

h1 {
	font-size: 0.6cm;
	text-align: left;
	margin: 25px;
}

#bandeiras {
	width: 80px;
	text-align: left;
}
a {
	margin: 0px auto;
	text-decoration:none;
}
</style>
</head>
<body style="background-color: white;">
	<div id="conteudo"
		style="background-color: white; background-image: url(../imagens/i3geo1bw.jpg);">
		<?php
		if($i3geomaster[0]["usuario"] == "admin" && $i3geomaster[0]["senha"] == "admin" ){
	echo "<p style='font-size:14px;color:red'>ATEN&Ccedil;&Atilde;O!!! Essa instala&ccedil;&atilde;o est&aacute; vulner&aacute;vel: edite o arquivo i3geo/ms_configura.php e altere o login e senha da vari&aacute;vel i3geomaster";
}
?>
		<div id="bandeiras"></div>

		<a target=_blank href="remover.php" class="r"><table >
				<tr>
					<td><img src="../imagens/oxygen/22x22/dialog-close.png" /><br> <script>document.write($trad(1,g_traducao_init));</script></a>
					</td>
				</tr>
			</table> </a>
			<a target=_blank href="../testainstal.php" class="r"><table >
				<tr>
					<td><img src="../imagens/oxygen/22x22/application-vnd.scribus.png" /><br>
						<script>document.write($trad(2,g_traducao_init));</script></a></td>
				</tr>
			</table> </a>
			<a target=_blank href="../admin" class="r"><table >
				<tr>
					<td><img src="../imagens/oxygen/22x22/preferences-system.png" /><br>
						<script>document.write($trad(3,g_traducao_init));</script></a></td>
				</tr>
			</table> </a>
			<a target=_blank href="../interface/openlayers.htm" class="r" style="box-shadow: 0 8px 10px 0 orange;"><table>
				<tr>
					<td><img src="../imagens/oxygen/22x22/openlayers.png" /><br> <script>document.write($trad(4,g_traducao_init));</script></a>
					</td>
				</tr>
			</table> </a>
			<a target=_blank href="../interface/openlayersdebug.htm" class="r" style="box-shadow: 0 8px 10px 0 orange;"><table>
				<tr>
					<td><img src="../imagens/oxygen/22x22/openlayers.png" /><br> <script>document.write($trad(5,g_traducao_init));</script></a>
					</td>
				</tr>
			</table> </a>
			<a target=_blank href="../mashups" class="r" style="box-shadow: 0 8px 10px 0 orange;"><table >
				<tr>
					<td><img src="../imagens/oxygen/22x22/openlayers.png" /><br> <script>document.write($trad(18,g_traducao_init));</script></a>
					</td>
				</tr>
			</table> </a>
			<a target=_blank href="../interface/googlemaps.phtml" class="r" style="box-shadow: 0 8px 10px 0 orange;"><table>
				<tr>
					<td><img src="../imagens/oxygen/22x22/googlemaps.png" /><br> <script>document.write($trad(6,g_traducao_init));</script></a>
					</td>
				</tr>
			</table> </a>
			<a target=_blank href="../interface/googleearth.phtml" class="r" style="box-shadow: 0 8px 10px 0 orange;"><table>
				<tr>
					<td><img src="../imagens/oxygen/22x22/googleearth.png" /><br> <script>document.write($trad(7,g_traducao_init));</script></a>
					</td>
				</tr>
			</table> </a>
			<a target=_blank href="../interface/carto_ol.htm" class="r" style="box-shadow: 0 8px 10px 0 orange;"><table >
				<tr>
					<td><img src="../imagens/oxygen/22x22/kspread.png" /><br> <script>document.write($trad(8,g_traducao_init));</script></a>
					</td>
				</tr>
			</table> </a>
			<a target=_blank href="../ferramentas/metaestat/editorlimites.php" class="r"><table>
				<tr>
					<td><img src="../imagens/oxygen/22x22/draw-freehand.png" /><br> <script>document.write($trad(9,g_traducao_init));</script></a>
					</td>
				</tr>
			</table> </a> 
			<a target=_blank href="../datadownload.htm" class="r"><table >
				<tr>
					<td><img src="../imagens/oxygen/22x22/download.png" /><br> <script>document.write($trad(10,g_traducao_init));</script></a>
					</td>
				</tr>
			</table> </a> 
			<a target=_blank href="../ogc.htm" class="r"><table >
				<tr>
					<td><img src="../imagens/oxygen/22x22/internet-web-browser.png" /><br>
						<script>document.write($trad(11,g_traducao_init));</script></a></td>
				</tr>
			</table> </a>
			<a target=_blank href="../kml.php" class="r"><table >
				<tr>
					<td><img src="../imagens/oxygen/22x22/internet-web-browser.png" /><br>
						<script>document.write($trad(12,g_traducao_init));</script></a></td>
				</tr>
			</table> </a>
			<a target=_blank href="../geradordelinks.htm" class="r"><table >
				<tr>
					<td><img
						src="../imagens/oxygen/22x22/preferences-web-browser-shortcuts.png" /><br>
						<script>document.write($trad(13,g_traducao_init));</script></a></td>
				</tr>
			</table> </a>
			<a target=_blank href="../exemplos" class="r"><table >
				<tr>
					<td><img src="../imagens/oxygen/22x22/help-contents.png" /><br> <script>document.write($trad(14,g_traducao_init));</script></a>
					</td>
				</tr>
			</table> </a>
			<a target=_blank href="../documentacao/manual-i3geo-4_7-pt.pdf" class="r"><table>
				<tr>
					<td><img src="../imagens/oxygen/22x22/help-contents.png" /><br> <script>document.write($trad(15,g_traducao_init));</script></a>
					</td>
				</tr>
			</table> </a>
			<a target=_blank href="../guia_de_migracao.txt" class="r"><table >
				<tr>
					<td><img src="../imagens/oxygen/22x22/help-contents.png" /><br> <script>document.write($trad(17,g_traducao_init));</script></a>
					</td>
				</tr>
			</table> </a>
			<a target=_blank href="http://svn.softwarepublico.gov.br/trac/i3geo" class="r"><table>
				<tr>
					<td><img src="../imagens/oxygen/22x22/kbugbuster.png" /><br> <script>document.write($trad(16,g_traducao_init));</script></a>
					</td>
				</tr>
			</table> </a>

	</div>
</body>
<script>
i3GEO.configura.locaplic = "..";
i3GEO.idioma.IDSELETOR = "bandeiras";
i3GEO.idioma.mostraSeletor();
$i("conteudo").style.height = i3GEO.util.getScrollHeight() + "px";
</script>
</html>