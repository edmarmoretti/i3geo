<?php
define ( ONDEI3GEO, "../../../../../../" );
include (dirname ( __FILE__ ) . "/../../../../../../ms_configura.php");
error_reporting ( 0 );
include "../../../../../head.php";
$id_n1 = filter_var ( $_GET ["id_n1"], FILTER_SANITIZE_NUMBER_INT );
$nome_grupo = filter_var ( $_GET ["nome_grupo"], FILTER_SANITIZE_STRING );
$id_n2 = filter_var ( $_GET ["id_n2"], FILTER_SANITIZE_NUMBER_INT );
$nome_subgrupo = filter_var ( $_GET ["nome_subgrupo"], FILTER_SANITIZE_STRING );
$id_menu = filter_var ( $_GET ["id_menu"], FILTER_SANITIZE_NUMBER_INT );
$nome_menu = filter_var ( $_GET ["nome_menu"], FILTER_SANITIZE_STRING );
?>
<div class="container-fluid">
	<div class="row">
		<ol class="breadcrumb">
			<li><a href="../../../../../init/index.php">i3Geo</a></li>
			<li><a href="../../../../../index.php">Admin</a></li>
			<li>Cat&aacute;logo</li>
			<li><a href="../../../index.php">menus</a></li>
			<li><a href="../../../index.php?id_filtro=<?php echo $id_menu; ?>"> <?php echo $nome_menu; ?></a></li>
			<li><a href="../../index.php?id_menu=<?php echo $id_menu; ?>&nome_menu=<?php echo $nome_menu; ?>">grupos</a></li>
			<li><a href="../../index.php?id_filtro=<?php echo $id_n1; ?>&id_menu=<?php echo $id_menu; ?>&nome_menu=<?php echo $nome_menu; ?>"> <?php echo $nome_grupo; ?></a></li>
			<li><a
				href="../index.php?id_filtro=<?php echo $id_n1; ?>&id_menu=<?php echo $id_menu; ?>&nome_menu=<?php echo $nome_menu; ?>"> <?php echo $nome_grupo; ?></a></li>
			<li><a
				href="../index.php?id_menu=<?php echo $id_menu; ?>&nome_menu=<?php echo $nome_menu; ?>&id_grupo=<?php echo $id_grupo; ?>&nome_grupo=<?php echo $nome_grupo; ?>">subgrupos</a></li>
			<li><a
				href="../index.php?id_filtro=<?php echo $id_n2; ?>&id_menu=<?php echo $id_menu; ?>&nome_menu=<?php echo $nome_menu; ?>&id_grupo=<?php echo $id_grupo; ?>&nome_grupo=<?php echo $nome_grupo; ?>"> <?php echo $nome_subgrupo; ?></a></li>

			<li class="active">lista de subgrupos</li>
		</ol>
	</div>
</div>
<div class="container">
	<div class="row center-block">
		<div class="col-md-12">
			<div class="well hidden" id="titulo">
				<!--
				<button data-toggle="modal" data-target="#ajudaPrincipal"
					class="btn btn-primary btn-fab btn-fab-mini pull-right">
					<i class="material-icons">help</i>
				</button>
				-->
				<h3>{{{txtTituloGrupos}}}</h3>
				<h4>{{{txtDescGrupos}}}</h4>
				<!-- aqui entra o filtro -->
				<div class="form-group">
					<label class="control-label">{{{filtro}}}</label> <select
						title="{{{filtro}}}" onchange="i3GEOadmin.core.filtra(this)" id="filtro" class="form-control input-lg">
					</select>
				</div>
				<div class="row pull-right">
					<a onclick="i3GEOadmin.subgrupos.adicionaDialogo();" href="javascript:void(0)"
						class="btn btn-primary" role="button" style="color:#008579;">{{{adicionar}}}</a>
				</div>
				<div class="clearfix"></div>
				<!--
				<div id="ajudaPrincipal" class="modal fade" tabindex="-1">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-body">
								<p>{{{txtAjuda}}}</p>
							</div>
						</div>
					</div>
				</div>
				-->
			</div>
			<div class="well hidden">
				<div id="corpo"></div>
			</div>
		</div>
	</div>
</div>
<script id="templateFiltro" type="x-tmpl-mustache">
<option value="form-{{id_subgrupo}}">{{{nome_subgrupo}}}</option>
</script>
<script id="templateFormLista" type="x-tmpl-mustache">
<form style="" onchange="this.style.boxShadow='2px 2px 5px 0 #009688';" class="form-horizontal" role="form"
	method="post"  >
	<div class="form-group form-group-lg">
		<label class="col-md-2 control-label" for="nome">{{{nomeTxt}}} (Pt)</label>
		<div class="col-md-10">
			<input type="text" value="{{{nome_subgrupo}}}" class="form-control" name="nome_subgrupo" required>
		</div>
	</div>
	<div class="form-group form-group-lg">
		<label class="col-md-2 control-label" for="desc_subgrupo">{{{descricaoTxt}}}</label>
		<div class="col-md-10">
			<input type="text" value="{{{desc_subgrupo}}}" class="form-control" name="desc_subgrupo" required>
		</div>
	</div>
	<div class="form-group form-group-lg">
		<label class="col-md-2 control-label" for="es">Es</label>
		<div class="col-md-10">
			<input type="text" value="{{{es}}}" class="form-control" name="es" required>
		</div>
	</div>
	<div class="form-group form-group-lg">
		<label class="col-md-2 control-label" for="en">En</label>
		<div class="col-md-10">
			<input type="text" value="{{{en}}}" class="form-control" name="en" required>
		</div>
	</div>
	<div class="clearfix"></div>
</form>
</script>
<script id="templateLista" type="x-tmpl-mustache">
	<div class="panel panel-default" id="form-{{id_subgrupo}}">
		<div class="panel-body">
			<div class="row">
				<div class="col-md-12">
					{{{templateFormLista}}}
				</div>
			</div>
			<div class="row">
				<div class="col-md-12">
					<div class="pull-right">
						<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_subgrupo}}')" class="btn btn-danger"
							style="color:#e13023;" role="button">{{excluir}}</a>
						<a href="javascript:void(0)"
							onclick="{{onSalvar}}('{{id_subgrupo}}')" class="btn btn-primary" role="button" style="color:#008579;">{{salvar}}</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</script>
<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../../../../../dicionario/subgrupos.js"></script>
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
		var inicia = function() {
			$(".hidden").removeClass('hidden');
			i3GEOadmin.subgrupos.init($("#corpo"));
		};
		i3GEO.login.verificaOperacao("admin/html/arvore",i3GEO.configura.locaplic, inicia, "sessao");
	});
</script>
</body>
</html>
