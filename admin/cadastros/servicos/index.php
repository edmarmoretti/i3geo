<?php
define ( "ONDEI3GEO", "../../.." );
include ("exec.php");

include "../../head.php";
?>
<div class="container-fluid migalha">
	<div class="row">
		<div class="btn-group btn-breadcrumb">
			<a class="btn btn-default" href="../../../init/index.php"><span>i3Geo</span></a>
			<a class="btn btn-default" href="../../index.php"><span>Admin</span></a>
			<a class="btn btn-default" style="pointer-events: none"><span>Cadastros</span></a>
			<a class="btn btn-default" style="pointer-events: none"><span>Servi&ccedil;os</span></a>
		</div>
	</div>
</div>
<div class="container">
	<div class="row center-block">
		<div class="col-md-12" id="titulo">
			<div class="well hidden" >
				<button data-toggle="modal" data-target="#modalFiltro"
					class="btn btn-primary btn-fab btn-fab-mini pull-right">
					<i class="material-icons">search</i>
				</button>
				<h2><small>{{{txtTitulo}}}</small></h2>
				<blockquote>{{{txtDesc}}}</blockquote>
				<div class="clearfix"></div>
				<!--Modal ajuda
				<div id="ajudaPrincipal" class="modal fade" tabindex="-1">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-body">
								<p>{{{txtWebservices}}}</p>
							</div>
						</div>
					</div>
				</div>
				-->
			</div>
			<div class="well hidden">
				<div class="panel-heading">
					<p class="lead" style="margin:0px;">&nbsp;
						<a title="{{{adicionar}}}" onclick="i3GEOadmin.webservices.adicionaDialogo();" href="javascript:void(0)"
							class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button" ><i class="material-icons ">add</i>
						</a>
					</p>
				</div>
				<div class="clearfix"></div>

				<div id="corpo">
				</div>
			</div>
		</div>
	</div>
</div>
<?php
include("templates/templateLista.php");
include("templates/templateFormLista.php");
include("templates/templateFiltro.php");
include("templates/templateOpcoesTipo.php");
?>
<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../../dicionario/webservices.js"></script>
<script>
	$(document).ready(function(){
		//vem de admin/index.js
		iniciaMenuPrincipal();
		$('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			$(this).parent().siblings().removeClass('open');
			$(this).parent().toggleClass('open');
		});
		//traducao
		var t = $("#titulo");
		//complementa dicionario
		i3GEOadmin.webservices.dicionario = $.extend(
			{},
			i3GEOadmin.webservices.dicionario,
			i3GEOadmin.core.dicionario
		);

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.webservices.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.webservices.dicionario);

		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.webservices.dicionario
			)
		);
		$.material.init();
			i3GEOadmin.core.loginOn();
			$(".hidden").removeClass('hidden');
			i3GEOadmin.webservices.init($("#corpo"));
	});
</script>
</body>
</html>
