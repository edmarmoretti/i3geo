<?php
define ( ONDEI3GEO, ".." );
include (dirname ( __FILE__ ) . "/../ms_configura.php");
// pega a extensao geografica
if ($ogcwsmap == "") {
	$ogcwsmap = $locaplic . "/aplicmap/ogcws.map";
}
$map = ms_newMapObj ( $ogcwsmap );
$mapext = $map->extent->minx . "," . $map->extent->miny . "," . $map->extent->maxx . "," . $map->extent->maxy;
error_reporting ( 0 );
include "../init/head.php";
?>
<style>
.panel-heading [data-toggle="collapse"]:after {
	font-family: 'FontAwesome';
	content: "\f054";
	float: right;
	margin-right: 5px;
	color: #fffff;
	font-size: 12px;
	line-height: 16px;
	-webkit-transform: rotate(-90deg);
	-moz-transform: rotate(-90deg);
	-ms-transform: rotate(-90deg);
	-o-transform: rotate(-90deg);
	transform: rotate(-90deg);
}

.panel-heading [data-toggle="collapse"].collapsed:after {
	-webkit-transform: rotate(90deg);
	-moz-transform: rotate(90deg);
	-ms-transform: rotate(90deg);
	-o-transform: rotate(90deg);
	transform: rotate(90deg);
}
</style>
<script id="templateLinksOgc" type="x-tmpl-mustache">
<h3>OGC</h3>
<p>{{{linkpagina}}}: <a href="{{{url}}}?temaOgc={{{tema}}}">{{{url}}}?temaOgc={{{tema}}}</a>
<p>{{{wstodas}}}: <a href="{{{servico}}}" target="_blank" >{{{servico}}}</a>
<p>{{{wscamada}}}: <a href="{{{servico}}}tema={{{tema}}}{{{id_medida_variavel}}}&" target="_blank" >{{{servico}}}tema={{{tema}}}{{{id_medida_variavel}}}&</a>
<p>{{{linkpagina}}}: <a href="{{{url}}}?temaOgc={{{tema}}}">{{{url}}}?temaOgc={{{tema}}}</a>
<p><a href="{{{urli3geo}}}/fontetema.php?tema={{{tema}}}" target="_blank" >Metadata</a></p>
<p><a target=blank href="{{{servico}}}service=wms&version=1.1.1&request=getcapabilities&layers={{{tema}}}{{{id_medida_variavel}}}" >GetCapabilities</a>
<p><a target=blank href="{{{servico}}}SRS=EPSG:4618&WIDTH=500&HEIGHT=500&BBOX=<?php echo $mapext;?>&FORMAT=image/png&service=wms&version=1.1.0&request=getmap&layers={{{tema}}}{{{id_medida_variavel}}}" >{{{getmap}}}</a>
<p><a target=blank href="{{{servico}}}SRS=EPSG:4618&WIDTH=500&HEIGHT=500&BBOX=<?php echo $mapext;?>&FORMAT=image/png&service=wms&version=1.1.0&request=getlegendgraphic&layers={{{tema}}}{{{id_medida_variavel}}}" >{{{legenda}}}</a>
<p><a target=blank href="{{{servico}}}format=application/openlayers&bbox=<?php echo $mapext;?>&layers={{{tema}}}" >{{{vOl}}}</a>
</script>
<script id="templateLinksDownload" type="x-tmpl-mustache">
<h3>Download</h3>
<p>{{{linkpagina}}}: <a href="{{{url}}}?temaDownload={{{tema}}}">{{{url}}}?temaDownload={{{tema}}}</a>
<p>{{{map}}}: <a href="{{{mapfile}}}" target="_blank" >{{{mapfile}}}</a></p>
<p>{{{sld}}}: <a href="{{{sldurl}}}" target="_blank" >{{{sldurl}}}</a>
<p><a href="{{{urli3geo}}}/fontetema.php?tema={{{tema}}}" target="_blank" >Metadata</a></p>
<p><a target=blank href="{{{servico}}}OUTPUTFORMAT=shape-zip&bbox=<?php echo $mapext;?>&service=wfs&version=1.1.0&request=getfeature&layers={{{tema}}}&typeName={{{tema}}}{{{id_medida_variavel}}}" >{{{downwfs}}}</a>
<p><a target=blank href="{{{servico}}}OUTPUTFORMAT=csv&bbox=<?php echo $mapext;?>&service=wfs&version=1.1.0&request=getfeature&layers={{{tema}}}{{{id_medida_variavel}}}&typeName={{{tema}}}&ows_geomtype=AS_WKT" >{{{downCgeo}}}</a>
<p><a target=blank href="{{{servico}}}OUTPUTFORMAT=csv&bbox=<?php echo $mapext;?>&service=wfs&version=1.1.0&request=getfeature&layers={{{tema}}}{{{id_medida_variavel}}}&typeName={{{tema}}}&ows_geomtype=none" >{{{downSgeo}}}</a>
<p><a target=blank href="{{{servico}}}OUTPUTFORMAT=kmz&bbox=<?php echo $mapext;?>&service=wfs&version=1.1.0&request=getfeature&layers={{{tema}}}{{{id_medida_variavel}}}&typeName={{{tema}}}" >{{{kmz}}}</a>
<p><a target=blank href="{{{servico}}}OUTPUTFORMAT=kml&bbox=<?php echo $mapext;?>&service=wfs&version=1.1.0&request=getfeature&layers={{{tema}}}{{{id_medida_variavel}}}&typeName={{{tema}}}" >{{{kml}}}</a>
<p><a target=blank href="{{{servico}}}OUTPUTFORMAT=geojson&bbox=<?php echo $mapext;?>&service=wfs&version=1.1.0&request=getfeature&layers={{{tema}}}{{{id_medida_variavel}}}&typeName={{{tema}}}" >GeoJson</a>
<p><a target=blank href="../ferramentas/recline/default.php?tema={{{tema}}}{{{id_medida_variavel}}}" >{{{explore}}}</a>
<h4>Shape file</h4>
{{{shp}}}
</script>
<script id="templateCamadas" type="x-tmpl-mustache">
<div class="list-group-item">
	<div class="bs-component btn-group-sm pull-left" data-toggle="modal" data-target="#modalCamada" >
		<a onclick="mostraLinksServico('{{codigo_tema}}','{{tipo}}','{{disabledogc}}')" class="btn btn-primary btn-fab {{disabledogc}}" href="#">
			<i class="material-icons">launch</i>
		</a>
		<a onclick="mostraLinksDownload('{{codigo_tema}}','{{tipo}}','{{disableddown}}')" class="btn btn-primary btn-fab {{disableddown}}" href="#">
			<i class="material-icons">file_download</i>
		</a>
	</div>
	<h4>
		&nbsp;{{{nome_tema}}}{{{nome}}}
		<a class="{{hidden}}" href="{{link_tema}}{{link}}" target="_blank"><i class="fa fa-link"></i></a>
	</h4>
</div>
<div class="list-group-separator"></div>
</script>
<script id="templateMenu" type="x-tmpl-mustache">
<div class="panel-group" id="menu{{idmenu}}" role="tablist" aria-multiselectable="true">
	<div class="panel panel-default" >
		<div class="panel-heading" style="background-color:#80cbc4;" role="tab" id="tituloMenu{{idmenu}}">
			<h3 class="panel-title">
				<a class="collapsed in" role="button" data-toggle="collapse" data-parent="#menu{{idmenu}}" href="#corpoMenu{{idmenu}}" aria-expanded="false" aria-controls="#corpoMenu{{idmenu}}"> {{{nomemenu}}} </a>
			</h3>
		</div>
		<div class="panel-body">
			<div id="corpoMenu{{idmenu}}" class="panel-collapse collapse" role="tabpanel" aria-multiselectable="true">
				<div class="panel-body">
					{{{camadas}}}
					<div id="gruposMenu{{idmenu}}">
						<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i><span class="sr-only">Aguarde</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</script>
<script id="templateGrupos" type="x-tmpl-mustache">
<div class="list-group">
<div class="panel panel-default">
	<div class="panel-heading" style="background-color: #b2dfdb;" role="tab" id="tituloGrupo{{id_n1}}">
		<h4 class="panel-title">
			<a class="collapsed" role="button" data-toggle="collapse" data-parent="#corpoMenu{{idmenu}}" href="#corpoGrupo{{id_n1}}" aria-expanded="false" aria-controls="corpoGrupo{{id_n1}}"> {{{nome}}} </a>
		</h4>
	</div>
	<div class="panel-body">
		<div id="corpoGrupo{{id_n1}}" class="panel-collapse collapse" role="tabpanel" aria-multiselectable="true">
			<div class="panel-body">
				{{{camadas}}}
				<div id="subGruposGrupo{{id_n1}}">{{grupos}}</div>
			</div>
		</div>
	</div>
</div>
</div>
</script>
<script id="templateSubGrupos" type="x-tmpl-mustache">
<div class="list-group">
<div class="panel panel-default">
	<div style="background-color: #e0f2f1;" onclick="listaCamadasSubgrupo('{{idmenu}}','{{id_n1}}','{{id_n2}}')" class="panel-heading" role="tab" id="tituloSubGrupo{{id_n2}}">
		<h4 class="panel-title">
			<a class="collapsed" role="button" data-toggle="collapse" data-parent="#corpoGrupo{{id_n1}}" href="#corpoSubGrupo{{id_n2}}" aria-expanded="false" aria-controls="corpoSubGrupo{{id_n2}}"> {{{nome}}} </a>
		</h4>
	</div>
	<div class="panel-body">
		<div id="corpoSubGrupo{{id_n2}}" class="panel-collapse collapse" role="tabpanel" aria-multiselectable="true">
		</div>
	</div>
</div>
</div>
</script>
<body style="background-color: #eeeeee; padding-top: 55px;" id="topo">
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
			<!-- template para permitir a traducao -->
			<div id="navbar" class="collapse navbar-collapse">
				<div id="menuTpl" class="hidden">
					<ul class="nav navbar-nav">
						<li><a href="../kml.php?tipoxml=kml" target="_blank">Kml Google Earth</a></li>
						<li><a href="">{{{lista}}}</a></li>
					</ul>
				</div>
			</div>
		</div>
	</nav>
	<div class="container-fluid">
		<div class="row">
			<ol class="breadcrumb">
				<li><a href="../init/index.php">i3Geo</a></li>
				<li class="active">OGC</li>
			</ol>
		</div>
	</div>
	<!-- Camadas oriundas do sistema de metadados estatisticos -->
	<div class="container">
		<div class="row center-block hidden">
			<div class="col-sm-6" id="metaestat">
				<div class="panel-group" role="tablist" aria-multiselectable="true">
					<div class="panel panel-default">
						<div class="panel-heading" style="background-color: #00BCD4;" role="tab">
							<h3 class="panel-title">
								<a class="collapsed in" role="button" data-toggle="collapse" href="#corpoMetaestat"
									aria-expanded="false" aria-controls="#corpoMetaestat"> {{{nomemeta}}} </a>
							</h3>
						</div>
						<div class="panel-body">
							<div id="corpoMetaestat" class="panel-collapse collapse" role="tabpanel"
								aria-multiselectable="true">
								<div class="panel-body">{{{camadasmeta}}}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-sm-6 hidden" id="mapasSalvos">
				<div class="panel-group" role="tablist" aria-multiselectable="true">
					<div class="panel panel-default">
						<div class="panel-heading" style="background-color: #00BCD4;" role="tab">
							<h3 class="panel-title">
								<a class="collapsed in" role="button" data-toggle="collapse" href="#corpomapasSalvos"
									aria-expanded="false" aria-controls="#corpomapasSalvos"> {{{nomeMapasSalvos}}} </a>
							</h3>
						</div>
						<div class="panel-body">
							<div id="corpomapasSalvos" class="panel-collapse collapse" role="tabpanel"
								aria-multiselectable="true">
								<div class="panel-body">{{{mapasSalvos}}}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="row center-block">
			<div class="col-sm-12" id="arvore">
				<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i><span class="sr-only">Aguarde</span>
			</div>
		</div>
	</div>
	<nav class="navbar-fixed-bottom">
		<div class="container-fluid">
			<div class="jumbotron"></div>
		</div>
	</nav>
	<div id="modalCamada" class="modal fade" tabindex="-1" role="dialog">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-body"></div>
				<div class="modal-footer" style="padding: 0px;padding-right: 15px; border: 0px; background-color: white;">
					<a class="btn btn-primary" href="#" role="button" data-dismiss="modal" aria-label="Close">
						OK
					</a>
				</div>
			</div>
		</div>
	</div>
	<script src='../pacotes/cpaint/cpaint2_compacto.inc.js'></script>
	<script src='../classesjs/compactados/dicionario_compacto.js'></script>
	<script src='../classesjs/compactados/classe_util_compacto.js'></script>
	<script src='../classesjs/compactados/classe_idioma_compacto.js'></script>
	<script src='../classesjs/compactados/classe_php_compacto.js'></script>
	<script src='../classesjs/compactados/classe_arvoredetemas_compacto.js'></script>
	<script src='../classesjs/compactados/mustache.js'></script>
	<script src='dicionario.js'></script>
	<script src='index.js'></script>
	<script>
	$(document).ready(function(){
		$(".jumbotron").html($trad("jumbotron",g_traducao_ogc));
		i3GEO.configura = {"locaplic" : "..","sid": ""};

		var servico = window.location.href.split("/ogc")[0]+"/ogc.php?";
		//g_traducao_ogc vem de dicionario.js
		tradLinks = i3GEO.idioma.objetoIdioma(g_traducao_ogc);
		tradLinks["servico"] = servico;
		tradLinks["url"] = window.location.href.split("?")[0];
		tradLinks["urli3geo"] = window.location.href.split("/ogc")[0];
		//traducao do menu nav
		html = Mustache.to_html(
			$("#menuTpl").html(),
			tradLinks
		);
		$("#menuTpl").html(html);
		//inicia arvore
		listaDoNivelMenu(
				$("#templateMenu").html(),
				$("#templateGrupos").html(),
				$("#templateSubGrupos").html(),
				$("#templateCamadas").html()
			);
		listaMetaestat($("#metaestat"),$("#templateCamadas").html());
		listaMapasSalvos($("#mapasSalvos"),$("#templateCamadas").html());
		$('.hidden').removeClass('hidden');
		$(window).on("scroll click",
				function(){
					$(".jumbotron").fadeOut(300);
				}
			);

		//$("html").niceScroll({"cursorwidth":"10px"});
		$.material.init();
		//verifica se deve abrir de imediato a janela de links
		var temp = window.location.href.split("temaOgc=");
		if(temp[1]){
			var temaOgc = temp[1];
			temaOgc = temaOgc.split("&");
			temaOgc = temaOgc[0];
			//verifica se eh metaestat
			if(temaOgc.split("_")[0] == "metaestat"){
				mostraLinksServico(temaOgc.split("_")[1],"meta")
			}
			else{
				mostraLinksServico(temaOgc,"tema")
			}
			$("#modalCamada").modal('show');
		}
		var temp = window.location.href.split("temaDownload=");
		if(temp[1]){
			var temaDownload = temp[1];
			temaDownload = temaDownload.split("&");
			temaDownload = temaDownload[0];
			//verifica se eh metaestat
			if(temaDownload.split("_")[0] == "metaestat"){
				mostraLinksDownload(temaDownload.split("_")[1],"meta")
			}
			else{
				mostraLinksDownload(temaDownload,"tema")
			}
			$("#modalCamada").modal('show');
		}
	});
	</script>
</body>
</html>
