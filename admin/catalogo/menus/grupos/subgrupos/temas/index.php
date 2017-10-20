<?php
define ( "ONDEI3GEO", "../../../../../.." );
include ("exec.php");
include "../../../../../head.php";

$id_menu = filter_var ( $_GET ["id_menu"], FILTER_SANITIZE_NUMBER_INT );
$nome_menu = $_SESSION ["nome_menu"];
$id_n1 = filter_var ( $_GET ["id_n1"], FILTER_SANITIZE_NUMBER_INT );
$nome_grupo = $_SESSION ["nome_grupo"];
$id_n2 = filter_var ( $_GET ["id_n2"], FILTER_SANITIZE_NUMBER_INT );
include("../funcoes.php");
$dados = \admin\catalogo\menus\grupos\subgrupos\listar ($dbh, $id_n1, $id_n2);
$nome_subgrupo = $dados ["nome_subgrupo"];
$_SESSION["nome_subgrupo"] = $nome_subgrupo;
?>
<div class="container-fluid migalha">
	<div class="row">
		<div class="btn-group btn-breadcrumb">
			<a class="btn btn-default" href="../../../../../../init/index.php"><span>i3Geo</span></a>
			<a class="btn btn-default" href="../../../../../index.php"><span>Admin</span></a>
			<a class="btn btn-default" style="pointer-events: none"><span>Cat&aacute;logo</span></a>
			<a class="btn btn-default" href="../../../index.php"><span>Menus</span></a>
			<a class="btn btn-default" href="../../index.php?id_menu=<?php echo $id_menu; ?>&nome_menu=<?php echo $nome_menu; ?>"><span>Grupos</span></a>
			<a class="btn btn-default" href="../index.php?id_menu=<?php echo $id_menu; ?>&nome_menu=<?php echo $nome_menu; ?>&id_n1=<?php echo $id_n1; ?>&nome_grupo=<?php echo $nome_grupo; ?>"><span>Subgrupos</span></a>

			<a class="btn btn-default" style="pointer-events: none"><span>Temas</span></a>
		</div>
	</div>
</div>
<div class="container" id="titulo">
	<div class="row center-block">
		<div class="col-md-12">
			<div class="well hidden">
				<span class="pull-right">&nbsp;&nbsp;</span>
				<button data-toggle="modal" data-target="#modalFiltro"
					class="btn btn-primary btn-fab btn-fab-mini pull-right">
					<i class="material-icons">search</i>
				</button>
				<div class="pull-left panel-heading" >
				  <small>Menu</small>
				  <h4 class="text-info"><?php echo $nome_menu; ?></h4>
				</div>
				<div class="pull-left panel-heading">
				  <small>Grupo</small>
				  <h4 class="text-info"><?php echo $nome_grupo; ?></h4>
				</div>
				<div class="panel-heading">
				  <small>Subgrupo</small>
				  <h4 class="text-info"><?php echo $nome_subgrupo; ?></h4>
				</div>
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
		//vem de admin/index.js
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
		i3GEOadmin.temas.id_n1 = <?php echo $id_n1; ?>;
		i3GEOadmin.temas.id_n2 = <?php echo $id_n2; ?>;

			i3GEOadmin.core.loginOn();
			$(".hidden").removeClass('hidden');
			i3GEOadmin.temas.init($("#corpo"));
	});
</script>
</body>
</html>
