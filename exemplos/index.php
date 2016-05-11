<?php
define ( ONDEI3GEO, ".." );
include (dirname ( __FILE__ ) . "/../ms_configura.php");
error_reporting ( 0 );
include "../init/head.php";
?>

<body style="background-color: #eeeeee; padding-top: 90px;">
	<nav class="navbar navbar-fixed-top navbar-inverse" role="navigation">
		<div class="container-fluid">
			<div class="navbar-header">
				<a class="navbar-brand" href="../init/index.php"><?php echo $mensagemInicia;?> <i
					class="fa fa-home fa-1x"></i></a>
			</div>
		</div>
	</nav>
	<div class="container-fluid">
		<div class="row center-block">
			<div class="col-sm-10">
				<!-- Template para criacao dos quadros ver index.js -->
				<div id="botoesTpl" class="hidden">
					<div id="{{id}}" class="col-xs-12 center-block"
						style="width: 260px; min-width: 260px; max-width: 260px;">
						<div class="panel panel-default">
							<div class="panel-body" style="height: 100px; overflow: auto;">
								<h4>{{{corpo}}}</h4>
							</div>
							<div class="panel-footer">
								<span class="label label-info">{{{tag}}}</span> <a
									class="pull-right" href="{{{link}}}" target="_blank"
									role="button">Link</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			<nav class="col-sm-2" id="listaTags">
				<ul id="tplLista" class="nav nav-pills nav-stacked hidden">
					<li><a href="#{{id}}">{{tag}}</a></li>
				</ul>
			</nav>
		</div>
	</div>
	<script src='../classesjs/compactados/mustache.js'></script>
	<script src='../classesjs/compactados/classe_util_compacto.js'></script>
	<script src='index.js'></script>
	<script>
	$(document).ready(function(){
		mostraBotoesBT();
		$('.hidden').removeClass('hidden');
		$.material.init();
	});
	</script>
</body>
</html>
