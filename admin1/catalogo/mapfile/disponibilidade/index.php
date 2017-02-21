<?php
define ( "ONDEI3GEO", "../../../.." );
include (dirname ( __FILE__ ) . "/../../../../ms_configura.php");
error_reporting ( 0 );
include "../../../head.php";
$codigo = filter_var ( $_GET ["codigo"], FILTER_SANITIZE_STRING );
$id_tema = (int) $_GET ["id_tema"];
?>
<div class="container-fluid migalha">
	<div class="row">
		<div class="btn-group btn-breadcrumb">
			<a class="btn btn-default" href="../../../../init/index.php">
				<span>i3Geo</span>
			</a>
			<a class="btn btn-default" href="../../../index.php">
				<span>Admin</span>
			</a>
			<a class="btn btn-default" style="pointer-events: none">
				<span>Cat&aacute;logo</span>
			</a>
			<a class="btn btn-default" href="../index.php">
				<span>Mapfiles</span>
			</a>
			<a class="btn btn-default" href="../opcoes/index.php?codigo=<?php echo $codigo; ?>&id_tema=<?php echo $id_tema; ?>">
				<span>Op&ccedil;&otilde;es</span>
			</a>
			<a class="btn btn-default" style="pointer-events: none">
				<span><?php echo $codigo; ?></span>
			</a>
			<a class="btn btn-default" style="pointer-events: none">
				<span>Disponibilidade</span>
			</a>
		</div>
	</div>
</div>
<div class="container">
	<div class="row center-block">
		<div class="col-md-12" id="titulo">
			<div class="well hidden" >
				<h2><small>{{{disponibilidade}}}</small></h2>
				<blockquote>{{{txtDisponibilidade}}}</blockquote>
				<div class="clearfix"></div>
			</div>
			<div class="well hidden">
				<div id="corpo">
				</div>
			</div>
		</div>
	</div>
</div>
<?php
include("templates/templateFormDisponibilidade.php");
include("../../../templates/templateOpcoesPublicado.php");
?>
<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../../../dicionario/editormapfile.js"></script>
<script>
	$(document).ready(function(){
		//vem de admin1/index.js
		iniciaMenuPrincipal();
		$('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			$(this).parent().siblings().removeClass('open');
			$(this).parent().toggleClass('open');
		});
		//traducao

		//complementa dicionario
		i3GEOadmin.disponibilidade.dicionario = $.extend(
			{},
			i3GEOadmin.mapfile.dicionario,
			i3GEOadmin.core.dicionario
		);

		i3GEOadmin.core.dicionario = null;
		g_traducao = null;

		i3GEOadmin.disponibilidade.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.disponibilidade.dicionario);
		var t = $("#titulo");
		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.disponibilidade.dicionario
			)
		);

		var inicia = function() {
			i3GEOadmin.core.loginOn();
			$(".hidden").removeClass('hidden');
			i3GEOadmin.disponibilidade.inicia("<?php echo $codigo; ?>","<?php echo $id_tema; ?>");
		};
		i3GEO.login.verificaOperacao("admin/html/editormapfile",i3GEO.configura.locaplic, inicia, "sessao" ,i3GEOadmin.core.erroLogin);
	});
</script>
</body>
</html>
