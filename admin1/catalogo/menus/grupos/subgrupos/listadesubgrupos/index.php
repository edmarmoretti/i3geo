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
<div class="container-fluid migalha">
	<div class="row">
		<div class="btn-group btn-breadcrumb">
			<a class="btn btn-default" href="../../../../../../init/index.php"><div>i3Geo</div></a>
			<a class="btn btn-default" href="../../../../../index.php"><div>Admin</div></a>
			<a class="btn btn-default" style="pointer-events: none"><div>Cat&aacute;logo</div></a>
			<a class="btn btn-default" href="../../../index.php"><div>Menus</div></a>
			<a class="btn btn-default" href="../../index.php?id_menu=<?php echo $id_menu; ?>"><div>Grupos</div></a>
			<a class="btn btn-default" href="../index.php?id_n1=<?php echo $id_n1; ?>"><div>Subgrupos</div></a>
			<a class="btn btn-default" style="pointer-events: none"><div>Lista de sub grupos</div></a>
		</div>
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
				<h2><small>{{{txtListaDeSubGrupos}}}</small></h2>
				<blockquote>{{{descListaDeSubGrupos}}}</blockquote>
				<!-- aqui entra o filtro -->
				<div class="form-group">
					 <select
						title="{{{filtro}}}" onchange="i3GEOadmin.core.filtra(this)" id="filtro" class="form-control input-lg">
					</select>
				</div>
				<div class="row pull-right">
					<a onclick="i3GEOadmin.subgrupos.adicionaDialogo();" href="javascript:void(0)"
						class="btn btn-primary" role="button" style="color:#008579;">{{{adicionar}}}</a>
				</div>
				<div class="clearfix"></div>
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
<form id="form-edicao-{{id_subgrupo}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_subgrupo}}');return false;" onchange="this.style.boxShadow='2px 2px 5px 0 #009688';" class="form-horizontal" role="form"
	method="post"  >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="nome">{{{nomeTxt}}} (Pt)</label>
				<div class="col-md-10">
					<input title="{{{nomeTxt}}}" type="text" value="{{{nome_subgrupo}}}" class="form-control" name="nome_subgrupo" required>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="desc_grupo">{{{descricaoTxt}}}</label>
				<div class="col-md-10">
					<input title="{{{descricaoTxt}}}" type="text" value="{{{desc_subgrupo}}}" class="form-control" name="desc_subgrupo" >
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="es">Es</label>
					<div class="col-md-10">
						<input title="Espanhol" type="text" value="{{{es}}}" class="form-control" name="es" >
					</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="en">En</label>
				<div class="col-md-10">
					<input title="Ingles" type="text" value="{{{en}}}" class="form-control" name="en" >
				</div>
			</div>
		</div>
	</div>
	<div class="pull-right">
		<button type="submit" class="btn btn-primary" role="button" style="color:#008579;">{{salvar}}</button>
	</div>
	<div class="clearfix"></div>
</form>
</script>
<script id="templateLista" type="x-tmpl-mustache">
<div class="list-group-item" id="form-{{id_subgrupo}}">
	<div class="row-content">
		<h3 class="list-group-item-heading {{escondido}}">
			<span class="pull-right">&nbsp;&nbsp;</span>
			<a href="javascript:void(0)" onclick="{{onEditar}}('{{id_subgrupo}}')" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
				<i class="material-icons md-18">edit</i>
			</a>
			<span class="pull-right">&nbsp;&nbsp;</span>
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_subgrupo}}')" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
				<i class="material-icons md-18">delete_forever</i>
			</a>
			<span class="nomeitem">
				<i class="material-icons move" style="color: gray; display:none;position:absolute;left:-5px;">swap_vert</i>
				{{{nome_subgrupo}}}
			</span>
		</h3>
	</div>
	<div class="list-group-separator"></div>
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
