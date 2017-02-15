<?php
define ( ONDEI3GEO, "../../../.." );
include (dirname ( __FILE__ ) . "/../../../../ms_configura.php");
error_reporting ( 0 );
include "../../../head.php";
$id_menu = filter_var ( $_GET ["id_menu"], FILTER_SANITIZE_NUMBER_INT );
$nome_menu = filter_var ( $_GET ["nome_menu"], FILTER_SANITIZE_STRING );
?>
<div class="container-fluid migalha">
	<div class="row">
		<div class="btn-group btn-breadcrumb">
			<a class="btn btn-default" href="../../../../init/index.php"><span>i3Geo</span></a>
			<a class="btn btn-default" href="../../../index.php"><span>Admin</span></a>
			<a class="btn btn-default" style="pointer-events: none"><span>Cat&aacute;logo</span></a>
			<a class="btn btn-default" href="../index.php"><span>Menus</span></a>
			<a class="btn btn-default" style="pointer-events: none"><span>Grupos</span></a>
		</div>
	</div>
</div>

<div class="container" id="titulo">
	<div class="row center-block">
		<div class="col-md-12">
			<div class="well hidden">
				<button data-toggle="modal" data-target="#previewArvore"
					class="btn btn-primary btn-fab btn-fab-mini pull-right" style="left:10px">
					<i class="material-icons">visibility</i>
				</button>
				<button data-toggle="modal" data-target="#ajudaPrincipal"
					class="btn btn-primary btn-fab btn-fab-mini pull-right">
					<i class="material-icons">help</i>
				</button>
				<span class="pull-right">&nbsp;&nbsp;</span>
				<button data-toggle="modal" data-target="#modalFiltro"
					class="btn btn-primary btn-fab btn-fab-mini pull-right">
					<i class="material-icons">search</i>
				</button>
				<div class="panel-heading" >
				  <small>Menu</small>
				  <h4><?php echo $nome_menu; ?></h4>
				</div>
				<blockquote>{{{txtDesc}}}</blockquote>

				<div id="ajudaPrincipal" class="modal fade" tabindex="-1">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-body">
								<p>{{{txtAjuda}}}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="row center-block">
		<div class="col-md-6">
			<div class="well hidden">
				<div class="panel-heading">
					<p class="lead" style="margin:0px;">{{temasRaizMenu}}
						<a title="{{{adicionar}}}" onclick="i3GEOadmin.grupos.adicionaTemaDialogo();" href="javascript:void(0)"
							class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button" ><i class="material-icons ">add</i>
						</a>
					</p>
				</div>
				<div class="clearfix"></div>
				<div id="raiz" class="panel-body"></div>
			</div>
		</div>
		<div class="col-md-6">
			<!-- nos -->
			<div class="well hidden">
				<div class="panel-heading">
					<p class="lead" style="margin:0px;">{{txtGrupos}}
						<a title="{{{adicionar}}}" onclick="i3GEOadmin.grupos.adicionaNoDialogo();" href="javascript:void(0)"
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
include("../../../templates/templateOpcoesPublicado.php");
include("templates/templateOpcoesPerfil.php");
include("templates/templateFormRaiz.php");
include("templates/templateRaiz.php");
include("templates/templateFiltro.php");
include("templates/templateNos.php");
include("templates/templateFormNos.php");
include("templates/templateOpcoesNo.php");
include("templates/templateOpcoesTema.php");
?>
<script type="text/javascript" src="../../index.js"></script>
<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../../../dicionario/grupos.js"></script>
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
		var t = $("#titulo");
		//complementa dicionario
		i3GEOadmin.grupos.dicionario = $.extend(
			{},
			i3GEOadmin.grupos.dicionario,
			i3GEOadmin.core.dicionario
		);

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.grupos.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.grupos.dicionario);

		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.grupos.dicionario
			)
		);
		$.material.init();
		i3GEOadmin.grupos.id_menu = <?php echo $id_menu; ?>;
		i3GEOadmin.grupos.nome_menu = "<?php echo $nome_menu; ?>";
		var inicia = function() {
			i3GEOadmin.core.loginOn();
			$(".hidden").removeClass('hidden');
			i3GEOadmin.grupos.init($("#corpo"),$("#raiz"));
		};
		i3GEO.login.verificaOperacao("admin/html/arvore",i3GEO.configura.locaplic, inicia, "sessao" ,i3GEOadmin.core.erroLogin);
	});
</script>
</body>
</html>
