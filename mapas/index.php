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

.list-group .list-group-separator::before {
	width: 100%;
}
</style>
<script id="templateLinks" type="x-tmpl-mustache">
<div class="list-group-item">
	<div class="bs-component btn-group-sm pull-left" >
		<a target="_blank" class="btn btn-primary btn-fab" href="{{{link}}}">
			<i class="material-icons">launch</i>
		</a>
	</div>
	<h4>
		&nbsp;{{{nome}}}
		<a href="{{{link}}}" target="_blank">&nbsp;{{{link}}}</a>
	</h4>
</div>
<div class="list-group-separator"></div>


</script>
<body style="background-color: #eeeeee; padding-top: 55px;" id="topo" data-spy="scroll" data-target="#indiceSpy" data-offset="80">
	<nav class="navbar navbar-fixed-top navbar-inverse" role="navigation">
		<div class="container-fluid">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
					data-target="#navbar" aria-expanded="false" aria-controls="navbar">
					<span class="sr-only"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span
						class="icon-bar"></span>
				</button>
				<a class="navbar-brand" onclick="$('.cartao').fadeIn(600);" href="#"><?php echo $mensagemInicia;?> <i
					class="fa fa-home fa-1x"></i></a>
			</div>
		</div>
	</nav>
	<div class="container-fluid">
		<div class="row">
			<ol class="breadcrumb">
				<li><a href="../init/index.php">i3Geo</a></li>
				<li class="active">Mapas de usuários</li>
			</ol>
		</div>
	</div>
	<div class="container">
		<!-- Template para criacao dos quadros ver index.js -->
		<div class="hidden">
			<div class="row">
				<div class="col-xs-9 center-block main" id="botoesTpl" >
					<div class="row" id="affix-{{ID_MAPA}}" >
						<div class="col-xs-12 center-block">
							<div class="panel panel-default">
								<div class="panel-heading">
									<div class="thumbnail" role="button" style="float: left; height: 78px; width: 170px"
										data-toggle="quadroQrcode" data-url="{{{href}}}">
										<img class="img-rounded" style="height: 67px; width: 160px" src="{{{IMAGEM}}}" />
									</div>
									<h3>&nbsp;{{{NOME}}}</h3>
								</div>
								<div class="clearfix"></div>
								<div class="panel-body">
									<div class="list-group">{{{subtitulo}}}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="row complementary">
					<div class="col-xs-3 center-block" >
						<nav class="bs-docs-sidebar hidden-xs affix" style="" id="indiceSpy">
							<ul class="nav nav-pills nav-stacked" data-spy="affix" data-offset-top="60" id="indice">
								<li><a href="#affix-{{ID_MAPA}}">{{{NOME}}}</a></li>
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
		$('.hidden').removeClass('hidden');
		$.material.init();
	});
	</script>
</body>
</html>
