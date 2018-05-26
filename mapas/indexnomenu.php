<?php
define ( "ONDEI3GEO", ".." );
include (dirname ( __FILE__ ) . "/../ms_configura.php");
if (! empty ( $_GET ["customDir"] )) {
	$customDir = strip_tags ( $_GET ["customDir"] );
} else if (empty ( $customDir )) {
	$customDir = "interface";
}
//error_reporting ( 0 );
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

.thumbnail.hidden-xs>a>img {
	height: 67px;
	width: 160px;
}

.thumbnail.visible-xs {
	float: left;
	height: 43px;
	width: 85px
}

.thumbnail.visible-xs>a>img {
	height: 33px;
	width: 80px;
}
</style>
<body style="padding-top: 55px; position: relative;" >
	<div class="navbar-fixed-top alert alert-success text-center" style="padding: 0px;"></div>
	<div class="container">
		<div class="row center-block">
			<div class="col-md-12">
				<div class="well hidden escondido" >
					<blockquote id="titulo"></blockquote>
				</div>
			</div>
		</div>
		<div class="row center-block">
			<div class="col-md-12">
				<div class="well" id="corpo">
					<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i> <span class="sr-only">Loading...</span>
				</div>
			</div>
		</div>
	</div>
	<div id="modal" class="modal fade" tabindex="-1" role="dialog">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body"></div>
			</div>
		</div>
	</div>
	<?php
	include("templates/templatelinks.php");
	include("templates/templatelista.php");
	?>
	<script src='../pacotes/cpaint/cpaint2_compacto.inc.js'></script>
	<script src='../js/compactados/dicionario_compacto.js'></script>
	<script src='../js/compactados/util_compacto.js'></script>
	<script src='../js/compactados/idioma_compacto.js'></script>
	<script src='../js/compactados/login_compacto.js'></script>
	<script src='../js/compactados/php_compacto.js'></script>
	<script src='../js/compactados/mustache.js'></script>
	<script src='dicionario.js'></script>
	<script src='index.js'></script>
	<script>
	$(document).ready(function(){
		i3GEO.configura = {"locaplic" : window.location.href.split("/mapas")[0],"sid": ""};
		//traducoes de alguns elementos individualmente
		$(".active").html(
			$trad("mapas",g_traducao_mapas)
		);
		$("#titulo").html(
			$trad("txtDesc",g_traducao_mapas)
		);
		mostraBotoesBT();
		$('.escondido').removeClass('hidden');
		$.material.init();
	});
	</script>
</body>
</html>
