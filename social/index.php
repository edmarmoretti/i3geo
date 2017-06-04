<?php
define ( "ONDEI3GEO", ".." );
include (dirname ( __FILE__ ) . "/../ms_configura.php");
//error_reporting ( 0 );
include "../init/head.php";
?>
<style>
.list-group .list-group-separator::before {
	width: calc(100% - 45px);
}

.list-group-item-heading {
	line-height: 2;
	left: 5px;
	margin-left: 45px;
}

.list-group {
	margin: auto;
}
</style>
<body style="padding-top: 55px;">
	<nav class="navbar navbar-default navbar-fixed-top">
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
				<li><a href="../init/index.php?home=">i3Geo</a></li>
				<li class="active">Social</li>
			</ol>
		</div>
	</div>
	<div class="container">
		<div class="row center-block">
			<div class="center-block col-xs-12 col-md-6">
				<div class="panel panel-default">
					<div class="panel-body">
						<a class="twitter-timeline tline" href="https://twitter.com/i3geo"
							data-widget-id="288061915689787392" height="320">Tweets @i3Geo</a>
					</div>
				</div>
			</div>
			<div class="center-block col-xs-12 col-md-6">
				<div class="panel panel-default">
					<div class="panel-body">
						<a class="twitter-timeline htag" href="https://twitter.com/hashtag/i3geo"
							data-widget-id="643417277208133633" height="320">i3geo Tweets</a>
					</div>
				</div>
			</div>
		</div>
		<div class="row center-block">
			<div tabindex="-1" class="col-xs-12 text-center">
				<script type='text/javascript'
					src='https://www.openhub.net/p/i3geo/widgets/project_users?format=js&style=blue'></script>
			</div>
			<div tabindex="-1" class="col-xs-12 text-center">
				<script type="text/javascript"
					src="http://www.openhub.net/p/150688/widgets/project_basic_stats.js"></script>
			</div>
		</div>
	</div>
	<script src='../classesjs/compactados/mustache.js'></script>
	<script src='../classesjs/compactados/dicionario_compacto.js'></script>
	<script src='../classesjs/compactados/classe_util_compacto.js'></script>
	<script src='../classesjs/compactados/classe_idioma_compacto.js'></script>
	<script src="https://platform.twitter.com/widgets.js"></script>
	<script>
	$(document).ready(function(){
		i3GEO.configura = {"locaplic" : "..","sid": ""};
		$.material.init();
	});
	</script>

</body>
</html>
