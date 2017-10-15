<?php
define ( "ONDEI3GEO", ".." );
include (dirname ( __FILE__ ) . "/../ms_configura.php");
//error_reporting ( 0 );
include "../init/head.php";
?>
<body style="padding-top: 60px;">
	<nav id="navbar" class="navbar navbar-default navbar-fixed-top">
		<div class="container-fluid">
			<div class="navbar-header">
				<a class="navbar-brand" href="../init/index.php"><?php echo $mensagemInicia;?> <i
					class="fa fa-home fa-1x"></i></a>
			</div>
		</div>
	</nav>
    <div class="container-fluid migalha">
        <div class="row">
            <div class="btn-group btn-breadcrumb">
                <a class="btn btn-default" href="../init/index.php?home=">i3Geo</a>
                <a class="btn btn-default" style="pointer-events: none">Mashups</a>
            </div>
        </div>
    </div>
	<div class="container">
		<div class="row center-block">
			<div class="col-sm-12">
				<div class="panel panel-default">
					<div class="panel-body">
						<fieldset>
							<p>Mashups s&atilde;o pequenos programas que podem ser facilmente inseridos em p&aacute;ginas
								HTML e que mostram determinados conte&uacute;dos.</p>
							<p>No caso do i3Geo, os mashups mostram mapas tendo como base o conjunto de temas existentes
								no diret&oacute;rio <samp>i3geo/temas</samp>.</p>
						</fieldset>
						<fieldset>
							<legend>OpenLayers</legend>
							<p>
								O <a href="http://openlayers.org" target=_blank>OpenLayers</a> &eacute; uma biblioteca em
								javascript bastante popular. Possui uma interface simples mas que pode conter um
								grande n&uacute;mero de funcionalidades.
							</p>
							<p>
								Para ver todos os par&acirc;metros: <a target=_blank href="openlayers.php">i3geo/mashups/openlayers.php</a>
							</p>
							<p>
								Para usar o Open Street Map (OSM) utilize o endere&ccedil;o <a target=_blank href="osm.php">i3geo/mashups/osm.php</a>
							</p>
							<p>Nos exemplos, basta substituir <samp>openlayers.php</samp> por <samp>osm.php</samp>:</p>
							<p class="m">
								Windows: <a target=_blank href="osm.php?temas=_wbiomashp&largura=800&altura=500">osm.php?temas=_wbiomashp&amp;largura=800&amp;altura=500</a>
							</p>
							<p class="m">
								Linux: <a target=_blank href="osm.php?temas=_lbiomashp&largura=800&altura=500">osm.php?temas=_lbiomashp&amp;largura=800&amp;altura=500</a>
							</p>
							<p>O gerador de Web Services do i3Geo pode ser utilizado para abrir o mashup.</p>
							<p class="m">
								Windows: <a target=_blank
									href="../ogc.php?temas=_wbiomashp&format=application/openlayers&bbox=-54,-14,-50,-10">ogc.php?temas=_wbiomashp&amp;format=application/openlayers&amp;bbox=-54,-14,-50,-10</a>
							</p>
							<p class="m">
								Linux: <a target=_blank
									href="../ogc.php?temas=_lbiomashp&format=application/openlayers&bbox=-54,-14,-50,-10">ogc.php?temas=_lbiomashp&amp;format=application/openlayers&amp;bbox=-54,-14,-50,-10</a>
							</p>
						</fieldset>
						<fieldset>
							<legend>Filtro</legend>
							<p>
								Cada tema pode receber filtros seguindo-se a sintaxe <code>&amp;map_layer_{codigo do tema}_filter=</code><br>
								Em camadas com origem em arquivos shapefile o valor do filtro segue o padr&atilde;o
								<code>(('[nome_da_coluna]'='valor_do_registro'))</code><br> Camadas baseadas em Postgis seguem o
								padr&atilde;o <code>nome_da_coluna=valor_do_registro</code>.
							</p>
							<p class="m">
								Windows: <a target=_blank
									href="http://localhost/i3geo/mashups/openlayers.php?map_layer__wbiomashp_filter=(('[CD_LEGENDA]'='CAATINGA'))&amp;temas=_wbiomashp&amp;layers=_wbiomashp">openlayers.php?map_layer__lbiomashp_filter=(('[CD_LEGENDA]'='CAATINGA'))&amp;temas=_wbiomashp&amp;layers=_wbiomashp</a>
							</p>
							<p class="m">
								Linux: <a target=_blank
									href="http://localhost/i3geo/mashups/openlayers.php?map_layer__lbiomashp_filter=(('[CD_LEGENDA]'='CAATINGA'))&amp;temas=_lbiomashp&amp;layers=_lbiomashp">openlayers.php?map_layer__lbiomashp_filter=(('[CD_LEGENDA]'='CAATINGA'))&amp;temas=_lbiomashp&amp;layers=_lbiomashp</a>
							</p>
						</fieldset>
						<fieldset>
							<legend>Todas as op&ccedil;&otilde;es e um tema adicionado</legend>
							<p class="m">
								Windows: <a target=_blank href="openlayers.php?temas=_wbiomashp&largura=800&altura=500">openlayers.php?temas=_wbiomashp&amp;largura=800&amp;altura=500</a>
							</p>
							<p class="m">
								Linux: <a target=_blank href="openlayers.php?temas=_lbiomashp&largura=800&altura=500">openlayers.php?temas=_lbiomashp&amp;largura=800&amp;altura=500</a>
							</p>
						</fieldset>
						<fieldset>
							<legend>Duas camadas mas com apenas uma vis&iacute;vel na inicializa&ccedil;&atilde;o do mapa</legend>
							<p class="m">
								Windows: <a target=_blank
									href="openlayers.php?temas=_wbiomashp,_wlocali&largura=800&altura=500&visiveis=_wbiomashp">openlayers.php?temas=_wbiomashp,_wlocali&amp;largura=800&amp;altura=500&amp;visiveis=_wbiomashp</a>
							</p>
							<p class="m">
								Linux: <a target=_blank
									href="openlayers.php?temas=_lbiomashp,_llocali&largura=800&altura=500&visiveis=_lbiomashp">openlayers.php?temas=_lbiomashp,_llocali&amp;largura=800&amp;altura=500&amp;visiveis=_lbiomashp</a>
							</p>
						</fieldset>
						<fieldset>
							<legend>Zoom para uma regi&atilde;o</legend>
							<p class="m">
								Windows: <a target=_blank
									href="openlayers.php?temas=_wbiomashp&largura=800&mapext=-68.39967%20-12.16172%20-62.67402%20-5.366808">openlayers.php?temas=_wbiomashp&amp;largura=800&amp;mapext=-68.39967
									-12.16172 -62.67402 -5.366808</a>
							</p>
							<p class="m">
								Linux: <a target=_blank
									href="openlayers.php?temas=_lbiomashp&largura=800&mapext=-68.39967%20-12.16172%20-62.67402%20-5.366808">openlayers.php?temas=_lbiomashp&amp;largura=800&amp;mapext=-68.39967
									-12.16172 -62.67402 -5.366808</a>
							</p>
						</fieldset>
						<fieldset>
							<legend>Bot&otilde;es principais e barra de zoom maior</legend>
							<p class="m">
								Windows: <a target=_blank
									href="openlayers.php?temas=_wbiomashp&largura=800&botoes=pan,zoombox,zoomtot,distancia,area,identifica&numzoomlevels=10">openlayers.php?temas=_wbiomashp&amp;largura=800&amp;botoes=pan,zoombox,zoomtot,distancia,area,identifica&amp;numzoomlevels=10</a>
							</p>
							<p class="m">
								Linux: <a target=_blank
									href="openlayers.php?temas=_lbiomashp&largura=800&botoes=pan,zoombox,zoomtot,distancia,area,identifica&numzoomlevels=10">openlayers.php?temas=_lbiomashp&amp;largura=800&amp;botoes=pan,zoombox,zoomtot,distancia,area,identifica&amp;numzoomlevels=10</a>
							</p>
						</fieldset>
						<fieldset>
							<legend>Inclus&atilde;o de pontos</legend>
							<p class="m">
								Windows: <a target=_blank
									href="openlayers.php?temas=_wbiomashp&largura=800&pontos=-54%20-12%20-56%20-15">openlayers.php?temas=_wbiomashp&amp;largura=800&amp;pontos=-54
									-12 -56 -15</a>
							</p>
							<p class="m">
								Linux: <a target=_blank
									href="openlayers.php?temas=_lbiomashp&largura=800&pontos=-54%20-12%20-56%20-15">openlayers.php?temas=_lbiomashp&amp;largura=800&amp;pontos=-54
									-12 -56 -15</a>
							</p>
						</fieldset>
						<fieldset>
							<legend>Camada adicional como fundo</legend>
							<p class="m">
								Windows: <a target=_blank
									href="openlayers.php?temas=_wbiomashp&largura=800&fundo=_wbiomashp">openlayers.php?temas=_wbiomashp&amp;largura=800&amp;fundo=_wbiomashp</a>
							</p>
							<p class="m">
								Linux: <a target=_blank
									href="openlayers.php?temas=_lbiomashp&largura=800&fundo=_lbiomashp&amp;largura=800&amp;fundo=_lbiomashp">openlayers.php?temas=_lbiomashp&amp;largura=800&amp;fundo=_lbiomashp</a>
							</p>
						</fieldset>
						<fieldset>
							<legend>KML</legend>
							<p class="m">
								Windows: <a target=_blank
									href="openlayers.php?temas=_wbiomashp&largura=700&kml=http://localhost/i3geo/aplicmap/dados/sundials.kml">openlayers.php?temas=_wbiomashp&amp;largura=700&amp;kml=http://localhost/i3geo/aplicmap/dados/sundials.kml</a>
							</p>
							<p class="m">
								Linux: <a target=_blank
									href="openlayers.php?temas=_lbiomashp&largura=700&kml=http://localhost/i3geo/aplicmap/dados/sundials.kml">openlayers.php?temas=_lbiomashp&amp;largura=700&amp;kml=http://localhost/i3geo/aplicmap/dados/sundials.kml</a>
							</p>

						</fieldset>

					</div>
				</div>
			</div>
		</div>
	</div>
	<script src='../classesjs/compactados/mustache.js'></script>
	<script src='../classesjs/compactados/dicionario_compacto.js'></script>
	<script src='../classesjs/compactados/classe_util_compacto.js'></script>
	<script src='../classesjs/compactados/classe_idioma_compacto.js'></script>
	<script>
	$(document).ready(function(){
		i3GEO.configura = {"locaplic" : "..","sid": ""};
		//$(".active").html($trad("util",g_traducao_util));
		//mostraBotoesBT();
		//$('.hidden').removeClass('hidden');
		$.material.init();
	});
	</script>

</body>
</html>
