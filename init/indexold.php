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
error_reporting(0);
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<title>i3Geo</title>
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
<script>
i3GEOF = [];
men = "";
<?php
include("dicionario.js");
include("../classesjs/compactados/dicionario_compacto.js");
include("../classesjs/compactados/classe_util_compacto.js");
include("../classesjs/compactados/classe_idioma_compacto.js");
include("../versao.php");
include("index.js");
if($i3geomaster[0]["usuario"] == "admin" && $i3geomaster[0]["senha"] == "admin" ){
	echo "men = $"."trad(19,g_traducao_init);";
}
?>
</script>

<style>
body {
	padding-top: 0px;
	COLOR: #2F4632;
	text-align: center;
	font-size: 0.6cm;
	font-family: Verdana, Arial, Helvetica, sans-serif;
	background-color: rgb(250, 250, 250);
	margin: auto;
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

.ri {
	left: 50%;
	position: absolute;
	top: 50%;
	transform: translate(-50%, -50%);
	width: 100%;
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

#brasil {
	background-image: url("../imagens/sprite.png");
	background-position: 0 -600px;
	background-repeat: no-repeat;
	cursor: pointer;
	height: 10px;
	width: 20px;
}

#uk {
	background-image: url("../imagens/sprite.png");
	background-position: 0 -625px;
	background-repeat: no-repeat;
	cursor: pointer;
	height: 10px;
	width: 20px;
}

#espanhol {
	background-image: url("../imagens/sprite.png");
	background-position: 0 -1400px;
	background-repeat: no-repeat;
	cursor: pointer;
	height: 10px;
	width: 20px;
}

#bandeiras img {
	margin-left: 7px;
}

#bandeiras {
	width: 100px;
	text-align: left;
	position: absolute;
	left: 0.2cm;
	z-index: 10;
}

a {
	margin: 0px auto;
	text-decoration: none;
	font-size: 14px;
	color: #26298D;
	outline: doted;
}

A:hover {
	color: #4142ff;
}

.borda {
	background-color: #4682b4;
	padding: 5px 0px 5px 0px;
	text-align: left;
	width: 100%;
}
</style>
</head>
<body class=" yui-skin-sam " style="background-color: rgb(250, 250, 250);">
	<div class="borda">
		<div id="bandeiras"></div>
		<div style="text-align: center">
			<a href="http://www.softwarepublico.gov.br" target="_blank" style="color: white;">
				<b><?php echo $mensagemInicia;?> </b>
			</a>
		</div>
	</div>

	<div id="conteudo" style="position: relative; top: -10px; margin: auto; max-width: 1000px; left: 10px;">
		<div style="margin-top: 5px;">
			<div id="mensagemLogin" style="font-size: 14px; color: red; margin-top: 20px; text-align: left;"></div>
			<br>
			<div id="botoes" style="width: 100%;"></div>
			<script>mostraBotoes();</script>
			<div class="r">
				<div class="ri">
					<script type='text/javascript' src='https://www.openhub.net/p/i3geo/widgets/project_users?format=js&style=blue'></script>
				</div>
			</div>
		</div>
		<div style="float: left;">
			<div class="r" style="width: 230px; height: 380px;">
				<div class="ri">
					<a class="twitter-timeline" href="https://twitter.com/i3geo" data-widget-id="288061915689787392" width="220" height="350">Tweets @i3Geo</a>
					<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
				</div>
			</div>
			<div class="r" style="width: 230px; height: 380px;">
				<div class="ri">
					<a class="twitter-timeline" href="https://twitter.com/hashtag/i3geo" data-widget-id="643417277208133633">i3geo Tweets</a>
					<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
				</div>
			</div>
			<div class="r" style="width: 345px; height: 220px;">
				<div class="ri">
					<script type="text/javascript" src="http://www.openhub.net/p/150688/widgets/project_basic_stats.js"></script>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
