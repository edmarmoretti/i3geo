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
	margin: 0.2cm;
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
	margin: 10px 25px 10px auto;
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
	<div id="conteudo" style="background-color: white; background-image: url(../imagens/i3geo1bw.jpg);">
	<div>
		<?php
		if($i3geomaster[0]["usuario"] == "admin" && $i3geomaster[0]["senha"] == "admin" ){
			echo "<p style='font-size:14px;color:red'><script>document.write($"."trad(19,g_traducao_init));</script>";
		}
		?>
		<div id="bandeiras"></div>
		<div id="botoes" ></div>
	</div>
	<div style="float:left" >
			<a href="#" class="r" style="width: 230px; height: 380px"><table>
				<tr>
					<td>
					<a class="twitter-timeline"  href="https://twitter.com/i3geo" data-widget-id="288061915689787392" width="220" height="350">Tweets @i3Geo</a>
<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
					</td>
				</tr>
			</table> </a>
			<a href="#" class="r" style="width: 230px; height: 380px"><table>
				<tr>
					<td><a class="twitter-timeline"
						href="https://twitter.com/search?q=@i3geo"
						data-widget-id="288053202174222336" width="220" height="350">Tweets #i3Geo</a>
						<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
					</td>
				</tr>
			</table> </a>
	</div>
	</div>
</body>
<script>
botoesIni = [];
botoesIni.push({
	"img":"../imagens/oxygen/22x22/application-vnd.scribus.png",
	"href":"../testainstal.php",
	"titulo":$trad(2,g_traducao_init)
	},{
	"img":"../imagens/oxygen/22x22/preferences-system.png",
	"href":"../admin",
	"titulo":$trad(3,g_traducao_init)
	},{
	"img":"openlayers.png",
	"href":"../interface/openlayers.htm",
	"titulo":$trad(4,g_traducao_init)
	},{
	"img":"openlayersdebug.png",
	"href":"../interface/openlayersdebug.htm",
	"titulo":$trad(5,g_traducao_init)
	},{
	"img":"mashup.png",
	"href":"../mashups",
	"titulo":$trad(18,g_traducao_init)
	},{
	"img":"googlemaps.png",
	"href":"../interface/googlemaps.phtml",
	"titulo":$trad(6,g_traducao_init)
	},{
	"img":"googleearth.png",
	"href":"../interface/googleearth.phtml",
	"titulo":$trad(7,g_traducao_init)
	},{
	"img":"cartogramas.png",
	"href":"../interface/carto_ol.htm",
	"titulo":$trad(8,g_traducao_init)
	},{
	"img":"editor.png",
	"href":"../ferramentas/metaestat/editorlimites.php",
	"titulo":$trad(9,g_traducao_init)
	},{
	"img":"../imagens/oxygen/22x22/download.png",
	"href":"../datadownload.htm",
	"titulo":$trad(10,g_traducao_init)
	},{
	"img":"../imagens/oxygen/22x22/internet-web-browser.png",
	"href":"../ogc.htm",
	"titulo":$trad(11,g_traducao_init)
	},{
	"img":"../imagens/oxygen/22x22/internet-web-browser.png",
	"href":"../kml.php",
	"titulo":$trad(12,g_traducao_init)
	},{
	"img":"../imagens/oxygen/22x22/preferences-web-browser-shortcuts.png",
	"href":"../geradordelinks.htm",
	"titulo":$trad(13,g_traducao_init)
	},{
	"img":"../imagens/oxygen/22x22/help-contents.png",
	"href":"../exemplos",
	"titulo":$trad(14,g_traducao_init)
	},{
	"img":"../imagens/oxygen/22x22/help-contents.png",
	"href":"../documentacao/manual-i3geo-4_7-pt.pdf",
	"titulo":$trad(15,g_traducao_init)
	},{
	"img":"../imagens/oxygen/22x22/help-contents.png",
	"href":"../guia_de_migracao.txt",
	"titulo":$trad(17,g_traducao_init)
	},{
	"img":"../imagens/oxygen/22x22/kbugbuster.png",
	"href":"http://svn.softwarepublico.gov.br/trac/i3geo",
	"titulo":$trad(16,g_traducao_init)
	}
);
mostraBotoes();

i3GEO.configura.locaplic = "..";
i3GEO.idioma.IDSELETOR = "bandeiras";
i3GEO.idioma.mostraSeletor();
i3GEO.barraDeBotoes.ATIVA = false;
function mostraBotoes(){
	var ins = [],i,n = botoesIni.length,l,local = [],texto;
	for(i=0;i<n;i++){
		if(botoesIni[i].href === ""){
			texto = '<span class="r"><table ><tr><td><img src="'+botoesIni[i].img+'" /><br>'+botoesIni[i].titulo+'</a></td></tr></table></span>'
		}
		else{
			texto = '<a target=_blank href="'+botoesIni[i].href+'" class="r"><table ><tr><td><img src="'+botoesIni[i].img+'" /><br>'+botoesIni[i].titulo+'</a></td></tr></table></a>';
		}
		ins.push(texto);
	}
	$i("botoes").innerHTML = ins.join("");
	$i("conteudo").style.height = i3GEO.util.getScrollHeight() + "px";
}

</script>
</html>