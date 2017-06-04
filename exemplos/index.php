<?php
define ( "ONDEI3GEO", ".." );
include (dirname ( __FILE__ ) . "/../ms_configura.php");
//error_reporting ( 0 );
include "../init/head.php";
?>
<style>
.mega-dropdown {
	position: static !important;
}

.mega-dropdown-menu {
	padding: 20px 0px;
	width: 100%;
	box-shadow: none;
	-webkit-box-shadow: none;
}

.mega-dropdown-menu>li>ul {
	padding: 0;
	margin: 0;
}

.mega-dropdown-menu>li>ul>li {
	list-style: none;
}

.mega-dropdown-menu>li>ul>li>a {
	display: block;
	color: #222;
	padding: 3px 5px;
}

.mega-dropdown-menu>li ul>li>a:hover, .mega-dropdown-menu>li ul>li>a:focus {
	text-decoration: none;
}

.mega-dropdown-menu .dropdown-header {
	font-size: 18px;
	color: #ff3546;
	padding: 5px 60px 5px 5px;
	line-height: 30px;
}
</style>
<body style="padding-top: 55px;">
	<nav class="navbar navbar-default navbar-fixed-top">
		<div class="container-fluid">
			<div class="navbar-header">
				<a class="navbar-brand" href="../init/index.php"><?php echo $mensagemInicia;?> <i
					class="fa fa-home fa-1x"></i></a>


			</div>
							<ul class="nav navbar-nav">
					<li class="dropdown mega-dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown">Tags
							<span class="caret"></span>
					</a>
						<!-- template para os tags -->
						<div id="tplLista" style="background:#3f51b5" class="col-sm-12 dropdown-menu mega-dropdown-menu">
							<a class="btn btn-info" href="#" onclick="$('.exemplo').hide();$('.{{id}}').fadeIn(600);">{{tag}}</a>
						</div></li>
				</ul>
		</div>
	</nav>
	<div class="container-fluid">
		<div class="row">
			<ol class="breadcrumb">
				<li><a href="../init/index.php?home=">i3Geo</a></li>
				<li class="active">Exemplos</li>
			</ol>
		</div>
	</div>
	<div class="container-fluid">
		<div class="row center-block">
			<div class="col-sm-12">
				<!-- Template para criacao dos quadros ver index.js -->
				<div id="botoesTpl" class="hidden">
					<div class="{{id}} exemplo col-xs-12 center-block"
						style="width: 260px; min-width: 350px; max-width: 300px;">
						<div class="panel panel-default">
							<div class="panel-body" style="height: 200px; overflow: auto;">
								<span class="label label-info">{{{tag}}}</span>
								<h4>{{{corpo}}}</h4>
							</div>

							<div class="panel-footer"
								style="padding: 0px; padding-right: 15px; border: 0px; background-color: white;">
								<div class="row">
									<div class="col-sm-12">
										<a class="btn btn-primary pull-right" href="{{{link}}}" target="_blank" role="button">Abrir</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
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
