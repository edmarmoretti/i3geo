<?php
define ( "ONDEI3GEO", "../../../../.." );
include ("exec.php");

include "../../../../head.php";
$id_n1 = filter_var ( $_GET ["id_n1"], FILTER_SANITIZE_NUMBER_INT );
$id_menu = filter_var ( $_GET ["id_menu"], FILTER_SANITIZE_NUMBER_INT );
include("../funcoes.php");
$dados = \admin\catalogo\menus\grupos\listar ($dbh,$id_menu,$id_n1);
$nome_grupo = $dados["nome_grupo"];
$_SESSION["nome_grupo"] = $nome_grupo;
$nome_menu = $_SESSION["nome_menu"];
?>
<div class="container-fluid migalha">
	<div class="row">
		<div class="btn-group btn-breadcrumb">
			<a class="btn btn-default" href="../../../../../init/index.php"><span>i3Geo</span></a>
			<a class="btn btn-default" href="../../../../index.php"><span>Admin</span></a>
			<a class="btn btn-default" style="pointer-events: none"><span>Cat&aacute;logo</span></a>
			<a class="btn btn-default" href="../../index.php"><span>Menus</span></a>
			<a class="btn btn-default" href="../index.php?id_menu=<?php echo $id_menu; ?>&nome_menu=<?php echo $nome_menu; ?>"><span>Grupos</span></a>
			<a class="btn btn-default" style="pointer-events: none"><span>Subgrupos</span></a>
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
				<div class="panel-heading">
				  <small>Grupo</small>
				  <h4 class="text-info"><?php echo $nome_grupo; ?></h4>
				</div>
				<blockquote>{{{txtDesc}}}<br>
                    <a href="#expandeTxt" data-toggle="collapse" class="collapsed">
                        <span class="text-primary readMore">
                            <i class="material-icons">keyboard_arrow_down</i>
                        </span>
                        <span class="text-primary readLess">
                            <i class="material-icons">keyboard_arrow_up</i>
                        </span>
                    </a>
                    <div id="expandeTxt" class="collapse">{{{txtAjuda}}}</div>
                </blockquote>
			</div>
		</div>
	</div>
	<div class="row center-block">
		<div class="col-md-6">
			<div class="well hidden">
				<div class="panel-heading">
					<p class="lead" style="margin:0px;">{{temasRaizSubgrupo}}
						<a title="{{{adicionar}}}" onclick="i3GEOadmin.subgrupos.adicionaTemaDialogo();" href="javascript:void(0)"
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
					<p class="lead" style="margin:0px;">{{subgrupos}}
						<a title="{{{adicionar}}}" onclick="i3GEOadmin.subgrupos.adicionaNoDialogo();" href="javascript:void(0)"
							class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button" ><i class="material-icons ">add</i>
						</a>
					</p>
				</div>
				<div class="clearfix"></div>
				<div id="corpo" class="panel-body panel-collapse in"></div>
			</div>
		</div>
	</div>
</div>
<?php
include("../../../../templates/templateOpcoesPublicado.php");
include("templates/templateOpcoesPerfil.php");
include("templates/templateFormRaiz.php");
include("templates/templateRaiz.php");
include("templates/templateFiltro.php");
include("templates/templateNos.php");
include("templates/templateFormNos.php");
include("templates/templateOpcoesNo.php");
include("templates/templateOpcoesTema.php");
?>
<script type="text/javascript" src="../../../index.js"></script>
<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../../../../dicionario/subgrupos.js"></script>
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
		i3GEOadmin.subgrupos.dicionario = $.extend(
			{},
			i3GEOadmin.subgrupos.dicionario,
			i3GEOadmin.core.dicionario
		);

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.subgrupos.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.subgrupos.dicionario);

		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.subgrupos.dicionario
			)
		);
		$.material.init();
		i3GEOadmin.subgrupos.id_n1 = <?php echo $id_n1; ?>;
		i3GEOadmin.subgrupos.id_menu = <?php echo $id_menu; ?>;

			i3GEOadmin.core.loginOn();
			$(".hidden").removeClass('hidden');
			i3GEOadmin.subgrupos.init($("#corpo"),$("#raiz"));
	});
</script>
</body>
</html>
