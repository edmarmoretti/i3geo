<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" type="text/css" href="../../admin/html/admin.css">

<style>
body {
	padding-top: 0px;
	COLOR: #2F4632;
	text-align: center;
	font-size: 0.6cm;
	font-family: Verdana, Arial, Helvetica, sans-serif;
	background-color: rgb(250, 250, 250);
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
		<div>
			<a href="http://www.softwarepublico.gov.br" target="_blank" style="color: white;">
				<b>i3Geo 6.0</b>
			</a>
		</div>
	</div>

	<div id="conteudo" style="position: relative; top: -10px; margin: auto; max-width: 1000px; left: 10px;">
		<div style="margin-top: 5px;">
			<br>
			<div id="botoes" style=""></div>

		</div>
	</div>

</body>
<script>
botoesIni = [];
botoesIni.push(
	{
		"img":"",
		"href":"rgbcolors.html",
		"titulo": "Lista de cores e conversor RGB/HEX/nome"
	},
	{
		"img":"colorbrewer.png",
		"href":"http://colorbrewer2.com/",
		"titulo": "Escolha de conjunto de cores - Colorbrewer"
	},
	{
		"img":"http://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Wikimedia_labs_logo_with_text.svg/103px-Wikimedia_labs_logo_with_text.svg.png",
		"href":"http://tools.wmflabs.org/geohack/",
		"titulo": "GeoHack"
	},
	{
		"img":"",
		"href":"http://stevemorse.org/jcal/latlon.php",
		"titulo": "Conversor de endere&ccedil;os to/from Latitude/Longitude/Altitude"
	},
	{
		"img":"",
		"href":"https://maptools.info/tools/converter/",
		"titulo": "Conversor de coordenadas"
	}
);
mostraBotoes();

function mostraBotoes(){
	var ins = [],i,n = botoesIni.length,texto, img;
	for(i=0;i<n;i++){
		img = "";
		if(botoesIni[i].img != ""){
			img = '<img src="'+botoesIni[i].img+'" /><br>';
		}
		texto = '<div class="r" ><table ><tr><td><a target=_blank href="'+botoesIni[i].href+'" >'+ img + botoesIni[i].titulo+'</a>';
		if(botoesIni[i].subtitulo){
			texto += botoesIni[i].subtitulo;
		}
		texto += '</td></tr></table></div>';
		ins.push(texto);
	}
	document.getElementById("botoes").innerHTML = ins.join("");
}

</script>
</html>
