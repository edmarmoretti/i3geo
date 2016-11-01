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
				<h4><small>{{{menu}}}: </small><?php echo "$nome_menu <small>{{{grupo}}}:</small> $nome_grupo <small>{{{txtTitulo}}}:</small> $nome_subgrupo"; ?></h4>
				<blockquote>{{{txtDesc}}}</blockquote>
				<div class="row pull-right">
					<a onclick="i3GEOadmin.temas.adicionaTemaDialogo();" href="javascript:void(0)"
						class="btn btn-primary" role="button" style="color:#008579;">{{{adicionar}}}</a>
				</div>
				<div class="clearfix"></div>
			</div>
			<div class="well hidden">
				<div id="corpo" class="panel-body panel-collapse in"></div>
			</div>
		</div>
	</div>
</div>
<script id="templateFiltro" type="x-tmpl-mustache">
<option value="form-{{id_n3}}">{{{nome_tema}}}</option>
</script>
<script id="templateTemas" type="x-tmpl-mustache">
<div class="list-group-item" data-id="{{id_n3}}" id="form-{{id_n3}}">
	<div class="row-content">
		<h3 class="list-group-item-heading {{escondido}}">
			<span class="pull-right">&nbsp;&nbsp;</span>
			<a href="javascript:void(0)" onclick="{{onEditar}}('{{id_n3}}')" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
				<i class="material-icons md-18">edit</i>
			</a>
			<span class="pull-right">&nbsp;&nbsp;</span>
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_n3}}')" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
				<i class="material-icons md-18">delete_forever</i>
			</a>
			<span class="nomeitem">
				<i class="material-icons move" style="color: gray; display:none;position:absolute;left:-5px;">swap_vert</i>
				{{{nome_tema}}}
			</span>
		</h3>
	</div>
	<div class="list-group-separator"></div>
</div>
</script>
<script id="templateForm" type="x-tmpl-mustache">
<form id="form-edicao-{{id_n3}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_n3}}');return false;" onchange="this.style.boxShadow='2px 2px 5px 0 #009688';" class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="id_tema">{{{tema}}}</label>
				<div class="col-md-8">
					<select title="{{{tema}}}" class="form-control" name="id_tema">
						{{{opcoesTema}}}
					</select>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="ordem">{{{ordemTxt}}}</label>
				<div class="col-md-8">
					<input title="{{{ordemTxt}}}" type="text" value="{{{ordem}}}" class="form-control" name="ordem">
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="perfil">{{{perfis}}}</label>
				<div class="col-md-4">
					<input title="{{{perfis}}}" id="perfil_tema-{{id_n3}}" type="text" value="{{{perfil}}}" class="form-control" name="perfil">
				</div>
				<div class="col-md-4">
					<select title="{{{perfis}}}" class="form-control" onchange="i3GEOadmin.subgrupos.addInput('perfil_tema-{{id_n3}}',this.value)">
						{{{opcoesPerfil}}}
					</select>
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
<script id="templateOpcoesPublicado" type="x-tmpl-mustache">
	<option value="">---</option>
	<option {{SIM-sel}} value="SIM">{{{sim}}}</option>
	<option {{NAO-sel}} value="NAO">{{{nao}}}</option>
</script>
<script id="templateOpcoesNo" type="x-tmpl-mustache">
	<option {{{selected}}} value="{{{id_subgrupo}}}">{{{nome_subgrupo}}}</option>
</script>
<script id="templateOpcoesTema" type="x-tmpl-mustache">
	<option {{{selected}}} value="{{{id_tema}}}">{{{nome_tema}}} - {{{codigo_tema}}}</option>
</script>
<script id="templateOpcoesPerfil" type="x-tmpl-mustache">
	<option value="{{{perfil}}}">{{{perfil}}}</option>
</script>
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
