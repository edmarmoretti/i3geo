<?php
define ( ONDEI3GEO, ".." );
include (dirname ( __FILE__ ) . "/../ms_configura.php");
error_reporting ( 0 );
include "../init/head.php";
?>
<body style="background-color: #eeeeee; padding-top: 55px;">
	<nav class="navbar navbar-fixed-top navbar-inverse" role="navigation">
		<div class="container-fluid">
			<div class="navbar-header">
				<a class="navbar-brand" href="../init/index.php"><?php echo $mensagemInicia;?> <i
					class="fa fa-home fa-1x"></i></a>
			</div>
		</div>
	</nav>
	<div class="container-fluid">
		<div class="row">
			<ol class="breadcrumb">
				<li><a href="../init/index.php">i3Geo</a></li>
				<li class="active"></li>
			</ol>
		</div>
	</div>
	<div class="container-fluid">
		<div class="row center-block">
			<div class="col-sm-12">
				<!-- Template para criacao dos quadros ver index.js -->
				<div id="botoesTpl" class="hidden">
					<div class="{{id}} exemplo col-xs-12 center-block"
						style="width: 260px; min-width: 260px; max-width: 260px;">
						<div class="panel panel-default">
							<div class="panel-body" style="height: 150px; overflow: auto;">
								<h4><a href="{{{link}}}" target="_blank" role="button">{{{corpo}}}</a></h4>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<script src='../classesjs/compactados/mustache.js'></script>
		<script src='../classesjs/compactados/dicionario_compacto.js'></script>
		<script src='../classesjs/compactados/classe_util_compacto.js'></script>
		<script src='../classesjs/compactados/classe_idioma_compacto.js'></script>
		<script src='dicionario.js'></script>
		<script src='index.js'></script>

		<script>
	$(document).ready(function(){
		i3GEO.configura = {"locaplic" : "..","sid": ""};
		$(".active").html($trad("util",g_traducao_util));
		mostraBotoesBT();
		$('.hidden').removeClass('hidden');
		$.material.init();
	});
	</script>

</body>
</html>
