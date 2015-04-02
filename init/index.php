<?php
/**
 * Pagina inicial do i3Geo
 * Voce pode utilizar o parametro customDir para indicar a pasta onde
 * as interfaces de mapa estao. Nesse caso, os links utilizarao esse parametro
 * Exemplo: localhost/i3geo/init/index.php?customDir=minhaPasta
 *
 * minhaPasta deve estar dentor da pasta i3geo.
 *
 * Se dentro da pasta $customDir existir um arquivo chamado index.php sera feito o include
 * na pagina.
 */
/**
 * Cria as pastas temporarias que o i3Geo precisa, caso nao existam
 */
include(dirname(__FILE__)."/../ms_configura.php");
if(!empty($_GET["customDir"])){
	$customDir = strip_tags($_GET["customDir"]);
}
else if(empty($customDir)){
	$customDir = "interface";
}
if(!file_exists($dir_tmp)){
	@mkdir ($dir_tmp,0777);
}
if(file_exists($dir_tmp)){
	@mkdir($dir_tmp."/comum",0777);
	@mkdir($dir_tmp."/saiku-datasources",0777);
	chmod($dir_tmp."/saiku-datasources",0777);
	@mkdir($dir_tmp."/cache",0777);
	chmod($dir_tmp."/cache",0777);
	@mkdir($dir_tmp."/cache/googlemaps",0777);
	chmod($dir_tmp."/cache/googlemaps",0777);
}
if(file_exists($locaplic."/".$customDir."/index.php")){
	include($locaplic."/".$customDir."/index.php");
}
?>
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
?>
<script type="text/javascript" src="../classesjs/i3geo.js"></script>
<script type="text/javascript" src="dicionario.js"></script>
<link rel="stylesheet" type="text/css" href="../admin/html/admin.css">

<style>
body {
	padding-top: 0px;
	COLOR: #2F4632;
	text-align: center;
	font-size: 0.6cm;
	font-family: Verdana, Arial, Helvetica, sans-serif;
	background-color: rgb(250,250,250);
	maergin: auto;
}

.r {
	border: 1px solid #F0F0F0;
	border-radius: 5px 5px 5px 5px;
	box-shadow: 1px 1px 1px 1px lightgray;
	float: left;
	height: 150px;
	margin: 0px 25px 20px auto;
	padding: 5px;
	width: 200px;
	background: white;
	vertical-align: middle;
	font-size: 0.4cm;
	position: relative;
	display: block;
	text-align: center;
	z-index: 2;
}

table {
	width: 100%;
}

td {
	font-size: 0.4cm;
	text-align: center;
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
	position: absolute;
	left: 0.2cm;
	z-index: 10;
}

a {
	margin: 0px auto;
	text-decoration: none;
	font-size: 14px;
}
.borda {
    background-color: #990000;
    padding: 5px 0px 5px 0px;
    text-align: left;
    width: 100%;
}
</style>
</head>
<body class=" yui-skin-sam ">
		<div class="borda">
			<div id="bandeiras"></div>
			<div><a href="http://www.softwarepublico.gov.br" target="_blank" style="color:white;"><b>i3Geo</b></a></div>
		</div>

			<div id="conteudo" style="position: relative; top: -10px; margin:auto;max-width:1000px;left: 10px;">
				<div style="margin-top: 5px;">
					<?php
					if($i3geomaster[0]["usuario"] == "admin" && $i3geomaster[0]["senha"] == "admin" ){
						echo "<p style='font-size:14px;color:red;margin-top:20px;'><script>document.write($"."trad(19,g_traducao_init));</script>";
					}
					?>
					<br>
					<div id="botoes" style=""></div>

					<div class="r"><table><tbody><tr><td>
					<script type="text/javascript" src="http://www.openhub.net/p/150688/widgets/project_users.js?style=gray"></script>
					</td></tr></tbody></table></div>
				</div>
				<div style="float: left">
					<a href="#" class="r" style="width: 230px; height: 380px;">
						<table>
							<tr>
								<td><a class="twitter-timeline" href="https://twitter.com/i3geo" data-widget-id="288061915689787392" width="220" height="350">Tweets @i3Geo</a> <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
								</td>
							</tr>
						</table>
					</a> <a href="#" class="r" style="width: 230px; height: 380px;">
						<table>
							<tr>
								<td><a class="twitter-timeline" href="https://twitter.com/search?q=@i3geo" data-widget-id="288053202174222336" width="220" height="350">Tweets #i3Geo</a> <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
								</td>
							</tr>
						</table>
					</a>
					<a href="#" class="r" style="width: 345px; height: 220px;">
						<table>
							<tr>
								<td>
								<script type="text/javascript" src="http://www.openhub.net/p/150688/widgets/project_basic_stats.js"></script>
								</td>
							</tr>
						</table>
					</a>
				</div>
			</div>

</body>
<script>
botoesIni = [];
botoesIni.push({
	"img":"start-here.png",
	"href":"../testainstal.php",
	"titulo":$trad(2,g_traducao_init)
	},{
	"img":"applications-development-web.png",
	"href":"../admin",
	"titulo":$trad(3,g_traducao_init)
	},{
	"img":"openlayers.png",
	"href":"../<?php echo $customDir; ?>/black_ol.htm",
	"titulo":$trad(4,g_traducao_init)
	},{
	"img":"openlayersdebug.png",
	"href":"../<?php echo $customDir; ?>/openlayersdebug.htm",
	"titulo":$trad(5,g_traducao_init)
	},{
		"img":"osm.png",
		"href":"../<?php echo $customDir; ?>/black_osm.htm",
		"titulo":$trad(23,g_traducao_init)
	},{
	"img":"mashup.png",
	"href":"../mashups",
	"titulo":$trad(18,g_traducao_init) + "<br><a href='../mashups/osm.php?temas=&largura=800&altura=500' target=_blank >OSM</a>" + " - <a href='../mashups/openlayers.php?temas=&largura=800&altura=500' target=_blank >OpenLayers</a>"
	},{
	"img":"googlemaps.png",
	"href":"../<?php echo $customDir; ?>/black_gm.phtml",
	"titulo":$trad(6,g_traducao_init)
	},{
	"img":"googlemaps_noite.png",
	"href":"../<?php echo $customDir; ?>/googlemaps_noite.phtml",
	"titulo":$trad(22,g_traducao_init)
	},{
	"img":"googleearth.png",
	"href":"../<?php echo $customDir; ?>/googleearth.phtml",
	"titulo":$trad(7,g_traducao_init)
	},{
	"img":"cartogramas.png",
	"href":"../<?php echo $customDir; ?>/black_carto_ol.htm",
	"titulo":$trad(8,g_traducao_init)
	},{
	"img":"editor.png",
	"href":"../ferramentas/metaestat/editorlimites.php",
	"titulo":$trad(9,g_traducao_init)
	},{
	"img":"svn-update.png",
	"href":"../datadownload.htm",
	"titulo":$trad(10,g_traducao_init)
	},{
	"img":"ogc_logo.jpg",
	"href":"../ogc.htm",
	"titulo":$trad(11,g_traducao_init)
	},{
	"img":"application-vnd-google-earth-kml.png",
	"href":"../kml.php",
	"titulo":$trad(12,g_traducao_init)
	},{
	"img":"../imagens/saiku_free_small.png",
	"href":"../ferramentas/saiku/esquemaxml.php?locaplic="+window.location.href.replace("/init/index.php",""),
	"titulo":$trad(25,g_traducao_init),
	"subtitulo": " <a style='cursor:pointer;' target=_blank src='https://medium.com/innovative-business-intelligence/so-people-who-land-on-our-community-download-page-will-notice-a-subtle-difference-when-they-click-1b61aca316c5' >"+$trad(29,g_traducao_init)+"</a>",
	},{
	"img":"../imagens/gvsig.jpg",
	"href":"../pacotes/gvsig/gvsig2mapfile/upload.htm",
	"titulo":$trad(26,g_traducao_init)
	},{
	"img":"insert-link.png",
	"href":"../geradordelinks.htm",
	"titulo":$trad(13,g_traducao_init)
	},{
	"img":"atlas.png",
	"href":"../atlas",
	"titulo":$trad(27,g_traducao_init)
	},{
	"img":"folder-image.png",
	"href":"../exemplos",
	"titulo":$trad(14,g_traducao_init)
	},{
	"img":"accessories-dictionary.png",
	"href":"../documentacao/manual-i3geo-6_0-pt.pdf",
	"titulo":$trad(15,g_traducao_init)
	},{
	"img":"accessories-dictionary.png",
	"href":"../documentacao/manual-admin-i3geo-6_0-pt.pdf",
	"titulo":$trad(21,g_traducao_init)
	},{
	"img":"accessories-dictionary.png",
	"href":"../guia_de_migracao.txt",
	"titulo":$trad(17,g_traducao_init)
	},{
	"img":"accessories-dictionary.png",
	"href":"../documentacao",
	"titulo":$trad(24,g_traducao_init)
	},{
	"img":"accessories-dictionary.png",
	"href":"http://moodle.gvsig-training.com/course/view.php?id=11",
	"titulo":$trad(28,g_traducao_init)
	},{
	"img":"tools-report-bug.png",
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
	var ins = [],i,n = botoesIni.length,texto;
	for(i=0;i<n;i++){
		texto = '<div class="r" ><table ><tr><td><a target=_blank href="'+botoesIni[i].href+'" ><img src="'+botoesIni[i].img+'" /><br><br>'+botoesIni[i].titulo+'</a>';
		if(botoesIni[i].subtitulo){
			texto += botoesIni[i].subtitulo;
		}
		texto += '</td></tr></table></div>';
		ins.push(texto);
	}
	$i("botoes").innerHTML = ins.join("");
	$i("conteudo").style.height = i3GEO.util.getScrollHeight() + "px";
}

</script>
</html>
