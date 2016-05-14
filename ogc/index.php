<?php
define ( ONDEI3GEO, ".." );
include (dirname ( __FILE__ ) . "/../ms_configura.php");
error_reporting ( 0 );
include "../init/head.php";
?>
<style>
.panel-heading [data-toggle="collapse"]:after {
	font-family: 'Glyphicons Halflings';
	content: "\e250";
	float: left;
	margin-right: 5px;
	color: #fffff;
	font-size: 8px;
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
<script id="templateCamadas" type="x-tmpl-mustache">
<div class="list-group-item">
	<div class="bs-component btn-group-sm pull-left">
		<a class="btn btn-primary btn-fab" href="{{codigo_tema}}{{tid}}">
			<i class="material-icons">launch</i>
		</a>
	</div>
	<div class="row-content" style="margin-left: 10px;">
		<h4 class="list-group-item-heading">{{nome_tema}}{{nome}}</h4>
			<p class="list-group-item-text">{{ogc_tema}}{{ogc}} {{link_tema}}{{link}}</p>
	</div>
</div>
<div class="list-group-separator"></div>
</script>
<script id="templateMenu" type="x-tmpl-mustache">
<div class="panel-group" id="menu{{idmenu}}" role="tablist" aria-multiselectable="true">
	<div class="panel panel-default">
		<div class="panel-heading" role="tab" id="tituloMenu{{idmenu}}">
			<h4 class="panel-title">
				<a class="collapsed in" role="button" data-toggle="collapse" data-parent="#menu{{idmenu}}" href="#corpoMenu{{idmenu}}" aria-expanded="false" aria-controls="#corpoMenu{{idmenu}}"> {{{nomemenu}}} </a>
			</h4>
		</div>
		<div class="panel-body">
			<div id="corpoMenu{{idmenu}}" class="panel-collapse collapse" role="tabpanel" aria-multiselectable="true">
				<div class="panel-body">
					{{{camadas}}}
					<div id="gruposMenu{{idmenu}}"></div>
				</div>
			</div>
		</div>

	</div>
</div>
</script>
<script id="templateGrupos" type="x-tmpl-mustache">
<div class="panel panel-default">
	<div class="panel-heading" role="tab" id="tituloGrupo{{id_n1}}">
		<h4 class="panel-title">
			<a class="collapsed" role="button" data-toggle="collapse" data-parent="#corpoMenu{{idmenu}}" href="#corpoGrupo{{id_n1}}" aria-expanded="false" aria-controls="corpoGrupo{{id_n1}}"> {{{nome}}} </a>
		</h4>
	</div>
	<div class="panel-body">
		<div id="corpoGrupo{{id_n1}}" class="panel-collapse collapse" role="tabpanel" aria-multiselectable="true">
			<div class="panel-body">
				{{{camadas}}}
				<div id="subGruposGrupo{{id_n1}}">subgrupos</div>
			</div>
		</div>
	</div>
</div>
</script>
<body style="background-color: #eeeeee; padding-top: 55px;">
	<nav class="navbar navbar-fixed-top navbar-inverse" role="navigation">
		<div class="container-fluid">
			<div class="navbar-header">
				<a class="navbar-brand" href="../init/index.php"><?php echo $mensagemInicia;?> <i class="fa fa-home fa-1x"></i></a>
			</div>
		</div>
	</nav>
	<div class="container-fluid">
		<div class="row">
			<ol class="breadcrumb">
				<li><a href="../init/index.php">i3Geo</a></li>
				<li class="active">Servi&ccedil;os OGC</li>
			</ol>
		</div>
	</div>
	<div class="container">
		<div class="row center-block">
			<div class="col-sm-12" id="arvore">
				<!-- Modelo de menu -->
				<!--
				<div class="panel-group" id="menu1" role="tablist" aria-multiselectable="true">
					<div class="panel panel-default">
						<div class="panel-heading" role="tab" id="tituloMenu1">
							<h4 class="panel-title">
								<a class="collapsed in" role="button" data-toggle="collapse" data-parent="#menu1" href="#corpoMenu1" aria-expanded="false" aria-controls="#corpoMenu1"> Collapsible Menu Item #1 </a>
							</h4>
						</div>
						<div class="panel-body">
							<div id="corpoMenu1" class="panel-collapse collapse" role="tabpanel" aria-multiselectable="true">
								<div class="panel-body">
									<div class="checkbox">
										<label> <input type=checkbox name=criaLink /> Camada
										</label>
									</div>
								</div>
								<div class="panel panel-default">
									<div class="panel-heading" role="tab" id="tituloGrupo1">
										<h4 class="panel-title">
											<a class="collapsed" role="button" data-toggle="collapse" data-parent="#corpoMenu1" href="#corpoGrupo1" aria-expanded="false" aria-controls="corpoGrupo1"> Collapsible Group Item #1 </a>
										</h4>
									</div>
									<div class="panel-body">
										<div id="corpoGrupo1" class="panel-collapse collapse" role="tabpanel" aria-labelledby="corpoMenu1">
											<div class="checkbox">
												<label> <input type=checkbox name=criaLink /> Camada
												</label>
											</div>
											<div class="panel panel-default">
												<div class="panel-heading" role="tab" id="tituloSubGrupo1">
													<h4 class="panel-title">
														<a class="collapsed" role="button" data-toggle="collapse" data-parent="#corpoGrupo1" href="#corpoSubGrupo1" aria-expanded="false" aria-controls="subGrupo1"> Collapsible Group Item #2 </a>
													</h4>
												</div>
												<div id="corpoSubGrupo1" class="panel-collapse collapse" role="tabpanel" aria-labelledby="tituloSubGrupo1">
													<div class="panel-body">
														<div class="checkbox">
															<label> <input type=checkbox name=criaLink /> Camada
															</label>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				-->
			</div>
		</div>
	</div>
	<nav class="navbar-fixed-bottom">
		<div class="container-fluid">
			<div class="jumbotron">
				Navegue pela &aacute;rvore ao lado para localizar o tema desejado. Clicando-se em um tema, &eacute; mostrado o endere&ccedil;o do servi&ccedil;o OGC. Os servi&ccedil;os s&atilde;o Web Wervices que possibilitam o acesso aos dados dispon&iacute;veis nessa instala&ccedil;&atilde;o do i3Geo. A lista de temas baseia-se nas configura&ccedil;&otilde;es espec&iacute;ficas de cada servidor onde o i3Geo
				est&aacute; instalado. Voc&ecirc; pode usar um Web Service para acessar os dados configurados nesse servidor por meio de outros softwares de geoprocessamento, como o <a href="http://www.gvsig.gva.es/index.php?id=gvsig&L=0">gvSIG.</a> Para maiores informa&ccedil;&otilde;es sobre o uso de web services, veja <a href='http://www.opengeospatial.org/standards' target=blank>http://www.opengeospatial.org/standards</a>
			</div>
		</div>
	</nav>
	<script type="text/javascript" src="../classesjs/i3geo_tudo_compacto6.js.php"></script>
	<script src='index.js'></script>
	<script>
	$(document).ready(function(){
		i3GEO.configura.locaplic = "../";
		listaDoNivelMenu(
				$("#templateMenu").html(),
				$("#templateGrupos").html(),
				$("#templateCamadas").html()
			);
		$(window).on("scroll click",
				function(){
					$(".jumbotron").fadeOut(300)
				}
			);
	});
	</script>
</body>
</html>
