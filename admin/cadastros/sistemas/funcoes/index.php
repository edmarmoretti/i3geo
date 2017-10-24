<?php
define ( "ONDEI3GEO", "../../../.." );
include ("exec.php");

include "../../../head.php";
$id_sistema = filter_var($_GET["id_sistema"], FILTER_SANITIZE_NUMBER_INT);
$nome_sistema = filter_var($_GET["nome_sistema"], FILTER_SANITIZE_STRING);
?>
<div class="container-fluid migalha">
	<div class="row">
		<div class="btn-group btn-breadcrumb">
			<a class="btn btn-default" href="../../../../init/index.php"><span>i3Geo</span></a>
			<a class="btn btn-default" href="../../../index.php"><span>Admin</span></a>
			<a class="btn btn-default" style="pointer-events: none"><span>Cat&aacute;logo</span></a>
			<a class="btn btn-default" href="../index.php"><span>Sistemas</span></a>
			<a class="btn btn-default" style="pointer-events: none"><span>Fun&ccedil;&otilde;es</span></a>
		</div>
	</div>
</div>
<div class="container">
	<div class="row center-block">
		<div class="col-md-12" id="titulo">
			<div class="well hidden" >
				<span class="pull-right">&nbsp;&nbsp;</span>
				<button data-toggle="modal" data-target="#modalFiltro"
					class="btn btn-primary btn-fab btn-fab-mini pull-right">
					<i class="material-icons">search</i>
				</button>
				<h2><small>{{{txtTituloFuncao}}}</small></h2>
				<h3><small>{{{sistema}}}: <?php echo $nome_sistema; ?></small></h3>
				<blockquote>{{{txtDescFuncao}}}

                </blockquote>
				<div class="clearfix"></div>
			</div>
			<div class="well hidden">
				<div class="panel-heading">
					<p class="lead" style="margin:0px;">&nbsp;
						<a title="{{{adicionar}}}" onclick="i3GEOadmin.funcao.adicionaDialogo();" href="javascript:void(0)"
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
include("templates/templateOpcoesPerfil.php");
include("templates/templateLista.php");
include("templates/templateFormLista.php");
include("templates/templateFiltro.php");
?>
<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../../../dicionario/sistemas.js"></script>
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
		i3GEOadmin.funcao.dicionario = $.extend(
			{},
			i3GEOadmin.sistemas.dicionario,
			i3GEOadmin.core.dicionario
		);

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.funcao.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.funcao.dicionario);

		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.funcao.dicionario
			)
		);
		$.material.init();
		i3GEOadmin.funcao.id_sistema = <?php echo $id_sistema; ?>;
			i3GEOadmin.core.loginOn();
			$(".hidden").removeClass('hidden');
			i3GEOadmin.funcao.init($("#corpo"));
	});
</script>
</body>
</html>
