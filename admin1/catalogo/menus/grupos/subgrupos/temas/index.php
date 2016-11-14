<?php
define ( ONDEI3GEO, "../../../../../.." );
include (dirname ( __FILE__ ) . "/../../../../../../ms_configura.php");
error_reporting ( 0 );
include "../../../../../head.php";
$id_menu = filter_var ( $_GET ["id_menu"], FILTER_SANITIZE_NUMBER_INT );
$nome_menu = filter_var ( $_GET ["nome_menu"], FILTER_SANITIZE_STRING );
$id_n1 = filter_var ( $_GET ["id_n1"], FILTER_SANITIZE_NUMBER_INT );
$nome_grupo = filter_var ( $_GET ["nome_grupo"], FILTER_SANITIZE_STRING );
$id_n2 = filter_var ( $_GET ["id_n2"], FILTER_SANITIZE_NUMBER_INT );
$nome_subgrupo = filter_var ( $_GET ["nome_subgrupo"], FILTER_SANITIZE_STRING );
?>
<div class="container-fluid migalha">
	<div class="row">
		<div class="btn-group btn-breadcrumb">
			<a class="btn btn-default" href="../../../../../../init/index.php"><div>i3Geo</div></a>
			<a class="btn btn-default" href="../../../../../index.php"><div>Admin</div></a>
			<a class="btn btn-default" style="pointer-events: none"><div>Cat&aacute;logo</div></a>
			<a class="btn btn-default" href="../../../index.php"><div>Menus</div></a>
			<a class="btn btn-default" href="../../index.php?id_menu=<?php echo $id_menu; ?>&nome_menu=<?php echo $nome_menu; ?>"><div>Grupos</div></a>
			<a class="btn btn-default" href="../index.php?id_menu=<?php echo $id_menu; ?>&nome_menu=<?php echo $nome_menu; ?>&id_n1=<?php echo $id_n1; ?>&nome_grupo=<?php echo $nome_grupo; ?>"><div>Subgrupos</div></a>

			<a class="btn btn-default" style="pointer-events: none"><div>Temas</div></a>
		</div>
	</div>
</div>
<div class="container" id="titulo">
	<div class="row center-block">
		<div class="col-md-12">
			<div class="well hidden">
				<button data-toggle="modal" data-target="#previewArvore"
					class="btn btn-primary btn-fab btn-fab-mini pull-right" style="left:10px">
					<i class="material-icons">play_circle_outline</i>
				</button>
				<span class="pull-right">&nbsp;&nbsp;</span>
				<button data-toggle="modal" data-target="#modalFiltro"
					class="btn btn-primary btn-fab btn-fab-mini pull-right">
					<i class="material-icons">search</i>
				</button>
				<h4><?php echo "$nome_menu / $nome_grupo / $nome_subgrupo"; ?></h4>
				<blockquote>{{{txtDesc}}}</blockquote>
				<div class="clearfix"></div>
			</div>
			<div class="well hidden">
				<div class="panel-heading">
					<p class="lead" style="margin:0px;">{{txtTitulo}}
						<a title="{{{adicionar}}}" onclick="i3GEOadmin.temas.adicionaTemaDialogo();" href="javascript:void(0)"
							class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button" ><i class="material-icons ">add</i>
						</a>
					</p>
				</div>
				<div class="clearfix"></div>
				<div id="corpo" class="panel-body"></div>
			</div>
		</div>
	</div>
</div>
<?php
include("../../../../../templates/templateOpcoesPublicado.php");
include("templates/templateFiltro.php");
include("templates/templateTemas.php");
include("templates/templateForm.php");
include("templates/templateOpcoesNo.php");
include("templates/templateOpcoesTema.php");
include("templates/templateOpcoesPerfil.php");
?>
<script type="text/javascript" src="../../../../index.js"></script>
<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../../../../../dicionario/temas.js"></script>
<script>
	$(document).ready(function(){
		//vem de admin1/index.js
		iniciaMenuPrincipal();
		$('ul.dropdown-grupo [data-toggle=dropdown]').on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			$(this).parent().siblings().removeClass('open');
			$(this).parent().toggleClass('open');
		});
		//traducao
		var t = $("#titulo");
		//complementa dicionario
		i3GEOadmin.temas.dicionario = $.extend(
			{},
			i3GEOadmin.temas.dicionario,
			i3GEOadmin.core.dicionario
		);

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.temas.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.temas.dicionario);

		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.temas.dicionario
			)
		);
		$.material.init();
		i3GEOadmin.temas.id_menu = <?php echo $id_menu; ?>;
		i3GEOadmin.temas.nome_menu = "<?php echo $nome_menu; ?>";
		i3GEOadmin.temas.id_n1 = <?php echo $id_n1; ?>;
		i3GEOadmin.temas.nome_grupo = "<?php echo $nome_grupo; ?>";
		i3GEOadmin.temas.id_n2 = <?php echo $id_n2; ?>;
		i3GEOadmin.temas.nome_subgrupo = "<?php echo $nome_subgrupo; ?>";

		var inicia = function() {
			$(".hidden").removeClass('hidden');
			i3GEOadmin.temas.init($("#corpo"));
		};
		i3GEO.login.verificaOperacao("admin/html/arvore",i3GEO.configura.locaplic, inicia, "sessao");
	});
</script>
</body>
</html>
