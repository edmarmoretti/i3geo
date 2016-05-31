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
<style>
.btn-qrcode {
	background-color: #fff;
	color: #ddd;
	margin: 5px;
	width: 13px;
	position: absolute;
	top: 12px;
	left: 28px;
	text-align: center;
	border-radius: 20%;
}

.list-group .list-group-separator::before{
	width: 100%;
}

#indice .bs-docs-sidebar .nav>.active:focus>a, .bs-docs-sidebar .nav>.active:hover>a,
	.bs-docs-sidebar .nav>.active>a {
	background-color: transparent;
	border-left-color: green;
	border-left-style: solid;
	border-left-width: 2px;
	color: green;
	font-weight: 700;
	padding-left: 18px;
}

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

.thumbnail.hidden-xs {
	float: left;
	height: 78px;
	width: 170px
}
.thumbnail.hidden-xs > a > img {
	height: 67px;
	width: 160px;
}

.thumbnail.visible-xs {
	float: left;
	height: 43px;
	width: 85px
}
.thumbnail.visible-xs > a > img {
	height: 33px;
	width: 80px;
}
</style>
<script id="templateLinks" type="x-tmpl-mustache">
<div class="row">
	<div class="col-xs-12 col-sm-3 hidden-xs row-action-primary">
		<div class="btn-group-sm pull-right" style="height: 60px;">
				<a class="hidden-sm btn btn-primary btn-fab" href="{{{link}}}">
				<i class="material-icons">launch</i>
			</a>
			<button onclick="i3GEO.util.copyToClipboard('{{{link}}}');alerta('{{copiado}}');" class="btn btn-primary btn-fab" >
				<i class="material-icons">content_copy</i>
			</button>
			<button role="button" data-toggle="quadroQrcode" data-url="{{{link}}}" class="btn btn-primary btn-fab btn-fab-max" >
				<span class="glyphicon glyphicon-qrcode" aria-hidden="true"></span>
			</button>
		</div>

	</div>
	<div class="col-sm-9 row-content" >
		<h4 class="list-group-item-heading">
			<a href="{{{link}}}" target="_blank">{{{nome}}}</a>
		</h4>
		<p class="list-group-item-text hidden-xs">
			<a href="{{{link}}}" target="_blank">{{{link}}}</a>
		</p>
		<div class="list-group-separator"></div>
	</div>
</div>

</script>
<script id="templateLinksX" type="x-tmpl-mustache">
<div class="list-group">
	<div class="hidden-xs row-action-primary">
		<div class="bs-component btn-group-sm pull-left">
			<a class="btn btn-primary btn-fab" href="{{{link}}}">
				<i class="material-icons">launch</i>
			</a>
			<button onclick="i3GEO.util.copyToClipboard('{{{link}}}');alerta('{{copiado}}');" class="btn btn-primary btn-fab" >
				<i class="material-icons">content_copy</i>
			</button>
			<button role="button" data-toggle="quadroQrcode" data-url="{{{link}}}" class="btn btn-primary btn-fab btn-fab-max" >
				<span class="glyphicon glyphicon-qrcode" aria-hidden="true"></span>
			</button>
		</div>
	</div>
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<a href="{{{link}}}" target="_blank">{{{nome}}}</a>
		</h4>
		<p class="list-group-item-text hidden-xs hidden-sm">
			<a href="{{{link}}}" target="_blank">{{{link}}}</a>
		</p>
	</div>
</div>
<div class="list-group-separator"></div>
</script>
<script id="indiceTpl" type="x-tmpl-mustache">
<li><a href="#affix-{{ID_MAPA}}">{{{NOME}}}</a></li>
</script>
<body style="padding-top: 55px; position: relative;" id="affix-topo"
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
				<li><a title="RSS" href="../admin/rssmapas.php"><i class="material-icons ">rss_feed</i></a>&nbsp; <a
					title="JSON" href="../admin/rssmapas.php?output=json"><i class="material-icons ">code</i></a>
				</li>
			</ol>
		</div>
	</div>
	<div class="container">
		<!-- Template para criacao dos quadros ver index.js -->
		<div class="escondido hidden">
			<div class="row">
				<div class="col-xs-12 col-sm-9 center-block escondido hidden" id="botoesTpl">
					<div class="row" id="affix-{{ID_MAPA}}">
						<div class="col-md-12 center-block">
							<div id="titulo{{ID_MAPA}}" class="panel-group" role="tablist" aria-multiselectable="true">
								<div class="panel panel-default">
									<div class="panel-heading" role="tab" style="background-color:#80cbc4;">
										<div class="thumbnail visible-xs">
											<a href="{{{LINK}}}"><img class="img-rounded"
												src="{{{IMAGEM}}}" /></a>
										</div>
										<div class="thumbnail hidden-xs">
											<a href="{{{LINK}}}"><img class="img-rounded"
												src="{{{IMAGEM}}}" /></a>
										</div>
										<h3 class="panel-title" >
											&nbsp;<a data-parent="#titulo{{ID_MAPA}}" class="collapsed in pull-right" role="button"
												data-toggle="collapse" href="#corpo{{ID_MAPA}}" aria-expanded="false"
												aria-controls="#corpo{{ID_MAPA}}">{{{NOME}}}&nbsp;</a>
										</h3>
										<div class="bs-component btn-group-sm pull-left hidden-xs">
											&nbsp;<a target="_blank" class="btn btn-primary btn-fab" href="{{{LINK}}}"> <i
												class="material-icons">launch</i>
											</a>
											<button role="button" data-toggle="quadroQrcode" data-url="{{{LINK}}}"
												class="btn btn-primary btn-fab btn-fab-max">
												<span class="glyphicon glyphicon-qrcode" aria-hidden="true"></span>
											</button>
										</div>
									</div>
									<div class="clearfix"></div>
									<div class="panel-body">
										<div id="corpo{{ID_MAPA}}" class="panel-collapse collapse list-group" role="tabpanel"
											aria-multiselectable="true">
											<div class="list-group" >
											{{{subtitulo}}}
											</div>
											</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-sm-3 hidden-xs">
						<nav class="bs-docs-sidebar affix" style="" id="indiceSpy">
							<ul class="nav nav-pills nav-stacked" role="tablist" id="indice">

							</ul>
						</nav>
					</div>
				</div>
			</div>
		</div>
	</div>
	<script>
	</script>
	<script src='../pacotes/cpaint/cpaint2_compacto.inc.js'></script>
	<script src='../classesjs/compactados/dicionario_compacto.js'></script>
	<script src='../classesjs/compactados/classe_util_compacto.js'></script>
	<script src='../classesjs/compactados/classe_idioma_compacto.js'></script>
	<script src='../classesjs/compactados/classe_login_compacto.js'></script>
	<script src='../classesjs/compactados/classe_php_compacto.js'></script>
	<script src='../classesjs/compactados/mustache.js'></script>
	<script src='dicionario.js'></script>
	<script src='index.js'></script>
	<script>
	$(document).ready(function(){
		i3GEO.configura = {"locaplic" : window.location.href.split("/mapas")[0],"sid": ""};
		$(".active").html($trad("mapas",g_traducao_mapas));
		mostraBotoesBT();
		$('.escondido').removeClass('hidden');
		$.material.init();
	});
	</script>
</body>
</html>
