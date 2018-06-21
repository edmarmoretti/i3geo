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
<body style="padding-top: 60px;">
	<nav class="navbar navbar-default navbar-fixed-top">
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
                <a class="btn btn-default" style="pointer-events: none">Social</a>
            </div>
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
						            <a height="320" class="twitter-timeline"  href="https://twitter.com/search?q=i3geo" data-widget-id="990311163815710720">Tweets sobre i3geo</a>
            <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>

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
				<script type='text/javascript' src='https://www.openhub.net/p/i3_geo/widgets/project_basic_stats?format=js'></script>
			</div>
		</div>
	</div>
	<script src='../js/compactados/mustache.js'></script>
	<script src='../js/compactados/dicionario_compacto.js'></script>
	<script src='../js/compactados/util_compacto.js'></script>
	<script src='../js/compactados/idioma_compacto.js'></script>
	<script src="https://platform.twitter.com/widgets.js"></script>
	<script>
	$(document).ready(function(){
		i3GEO.configura = {"locaplic" : "..","sid": ""};
		$.material.init();
	});
	</script>

</body>
</html>
<?php
if(extension_loaded('zlib')){
    ob_end_flush();
}
?>