<?php
define ( ONDEI3GEO, ".." );
include (dirname ( __FILE__ ) . "/../ms_configura.php");
if (! empty ( $_GET ["customDir"] )) {
	$customDir = strip_tags ( $_GET ["customDir"] );
} else if (empty ( $customDir )) {
	$customDir = "interface";
}
if (! file_exists ( $dir_tmp )) {
	@mkdir ( $dir_tmp, 0777 );
}
if (file_exists ( $dir_tmp )) {
	@mkdir ( $dir_tmp . "/comum", 0777 );
	@mkdir ( $dir_tmp . "/saiku-datasources", 0777 );
	chmod ( $dir_tmp . "/saiku-datasources", 0777 );
	@mkdir ( $dir_tmp . "/cache", 0777 );
	chmod ( $dir_tmp . "/cache", 0777 );
	@mkdir ( $dir_tmp . "/cache/googlemaps", 0777 );
	chmod ( $dir_tmp . "/cache/googlemaps", 0777 );
}
error_reporting ( 0 );
include "../init/head.php";
?>
<body style="background-color: #eeeeee; padding-top: 55px; position: relative;" id="affix-topo"
	data-spy="scroll" data-target="#indiceSpy" data-offset="80">
	<nav class="navbar navbar-fixed-top navbar-inverse" role="navigation">
		<div class="container-fluid">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
					data-target="#navbar" aria-expanded="false" aria-controls="navbar">
					<span class="sr-only"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span
						class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="../init/index.php"><?php echo $mensagemInicia;?> <i
					class="fa fa-home fa-1x"></i></a>
			</div>
		</div>
	</nav>
	<!--para as mensagens de alerta-->
	<div class="navbar-fixed-top alert alert-success text-center" style="padding: 0px;"></div>
	<div class="container-fluid">
		<div class="row">
			<ol class="breadcrumb">
				<li><a href="../init/index.php">i3Geo</a></li>
				<li class="active">Mapas de usu&aacute;rios</li>
			</ol>
		</div>
	</div>
	<div class="container">
		<fieldset>
			<legend style="font-size: 14px;"></legend>
			<br>
			<p class=paragrafo>
				Para ver todos os par&acirc;metros de inicializa&ccedil;&atilde;o que podem ser utilizados: <a
					href="ms_criamapa.php?ajuda" target=_blank>ms_criamapa.php?ajuda</a>
			</p>

			<p class=paragrafo>
				Aqui voc&ecirc; pode gerar links para abrir o i3Geo de forma personalizada. Os links podem ser
				inclu&iacute;dos em qualquer p&aacute;gina WEB, sendo poss&iacute;vel definir quais os temas
				ser&atilde;o mostrados e qual a extens&atilde;o geogr&aacute;fica do mapa.<br> <br>
			</p>
		</fieldset>
		<fieldset style="min-height: 100px;">
			<p class=paragrafo>
				Este &eacute; o link para abrir o mapa. Copie e cole em sua p&aacute;gina na internet ou clique
				para testar: <a style="color: blue; font-size: 12px" href="" id=link target=blanck></a>

		</fieldset>
		<fieldset>
			<div style="margin: 10px;">
				<p class=paragrafo>
					<b>Escolha os temas que ser&atilde;o inclu&iacute;dos no mapa (opcional):</b>
				</p>
				<p class=paragrafo>Menu:


				<div id=menus style="text-align: left;">Aguarde...</div>
				<br>
				<p class=paragrafo>Grupo:


				<div id=grupos style="text-align: left;">&nbsp;</div>
				<br>
				<p class=paragrafo>Sub-grupo:


				<div id=subgrupos style="text-align: left;">&nbsp;</div>
				<br>
				<p class=paragrafo>Tema:


				<div id=temas style="text-align: left;">&nbsp;</div>
				<br>
				<div style="left: 0px; text-align: left;">
					Temas j&aacute; escolhidos. Os que estiverem marcados, ficar&atilde;o ligados logo ao abrir o
					mapa:
					<div id=temasa
						style='width: 530px; border: 1px gray solid; height: 90px; top: 10px; left: 0px; text-align: left; overflow: auto'></div>
				</div>
			</div>

		</fieldset>
		<fieldset>
			<div style="margin: 10px;">
				<p class=paragrafo>
					<b>Se vc quiser, o mapa poder&aacute; ser aberto mostrando pontos, digite abaixo as coordenadas
						dos pontos em d&eacute;cimos de grau (exemplo: -54 -12 -54 1 -51 -15) (opcional):</b>
				</p>
				<p class=paragrafo>Coordenadas dos pontos:</p>
				<div style="padding: 5px;" id=paiPontos>
					<input type=text size=60 id=pontos value="" onchange="$i3geo_gl.crialink()" />
				</div>
				<p class=paragrafo>Nome do tema para aparecer na legenda:</p>
				<div style="padding: 5px;" id=paiNometemapontos>
					<input type=text size=60 id=nometemapontos value="" onchange="$i3geo_gl.crialink()" /> &nbsp;
				</div>
			</div>
		</fieldset>
		<fieldset>
			<div style="margin: 10px;">
				<p class=paragrafo>
					<b>Caso existam perfis definidos na configura&ccedil;&atilde;o do menu de temas, vc pode
						restringir a lista de temas do menu de adi&ccedil;&atilde;o de temas do I3Geo (opcional)</b>
				</p>
				<p class=paragrafo>Perfil:</p>
				<input onchange="$i3geo_gl.crialink()" type=text size=60 id=perfili value=""
					style="border: 1px solid black" />
			</div>
		</fieldset>
		<fieldset>
			<div style="margin: 10px; text-align: left;">
				<p class=paragrafo>
					<b>Escolha a interface para o mapa (opcional)</b>
				</p>
				<div id="comboInterfaces" style="text-align: left;">
					<select id=interface onchange="$i3geo_gl.crialink()">
						<option value="">Default</option>
						<option value="black_gm.phtml">Google Maps</option>
						<option value="googleearth.phtml">Google Earth</option>
						<option value="black_ol.htm">Openlayers</option>
						<option value="black_osm.htm">Open Street Map</option>
					</select>
				</div>
			</div>
		</fieldset>
		<fieldset id=buscageo></fieldset>
	</div>

	<script type="text/javascript" src="../classesjs/i3geo_tudo_compacto6.js"></script>
	<script src='dicionario.js'></script>
	<script src='index.js'></script>
	<script>
	//$(document).ready(function(){
		i3GEO.configura = {"locaplic" : window.location.href.split("/permlinks")[0],"sid": ""};
		$(".active").html($trad("mapas",g_traducao_mapas));
		OpenLayers.ImgPath = "../pacotes/openlayers/img/";

		var i3geo_gl_configura =
			new i3geo_gl_configura(i3GEO.configura.locaplic, "", "temasa", "link", "grupos", "subgrupos", "temas", "buscageo", "menus");
		i3geo_gl_inicia(i3geo_gl_configura);

		$.material.init();
	//});
	</script>
</body>
</html>
