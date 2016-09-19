<?php
define ( ONDEI3GEO, "../../.." );
include (dirname ( __FILE__ ) . "/../../../ms_configura.php");
error_reporting ( 0 );
include "../../head.php";
?>
<div class="container-fluid">
	<div class="row">
		<ol class="breadcrumb">
			<li><a href="../../init/index.php">i3Geo</a></li>
			<li><a href="../../index.php">Admin</a></li>
			<li>Usu&aacute;rios</li>
			<li class="active">Grupos e usu&aacute;rios</li>
		</ol>
	</div>
</div>
<div class="container">
	<div class="row center-block">
		<div class="col-md-12" id="titulo">
			<div class="well hidden" >
				<!--
				<button data-toggle="modal" data-target="#ajudaPrincipal"
					class="btn btn-primary btn-fab btn-fab-mini pull-right">
					<i class="material-icons">help</i>
				</button>
				-->
				<h2><small>{{{txtTitulo}}}</small></h2>
				<blockquote>{{{txtDesc}}}</blockquote>
				<!-- aqui entra o filtro -->
				<div class="form-group">
					<label class="control-label">{{{filtro}}}</label>
					<select title="{{{filtro}}}" onchange="i3GEOadmin.core.filtra(this)" id="filtro" class="form-control input-lg">
					</select>
				</div>
				<div class="clearfix"></div>
				<!--Modal ajuda
				<div id="ajudaPrincipal" class="modal fade" tabindex="-1">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-body">
								<p>{{{txtGrupos}}}</p>
							</div>
						</div>
					</div>
				</div>
				-->
			</div>
			<div class="well hidden">
				<div class="row pull-right">
					<a onclick="i3GEOadmin.gruposusuarios.adicionaDialogo();" href="javascript:void(0)" class="btn btn-primary" style="color:#008579;" role="button">{{{adicionar}}}</a>
				</div>
				<div class="clearfix"></div>
				<div id="corpo">
				</div>
			</div>
		</div>
	</div>
</div>
<script id="templateFiltro" type="x-tmpl-mustache">
<option value="form-{{id_grupo}}">{{{nome}}}</option>
</script>
<script id="templateFormLista" type="x-tmpl-mustache">
<form style="" action="#" onsubmit="{{onSalvar}}('{{id_grupo}}');return false;" onchange="this.style.boxShadow='2px 2px 5px 0 #009688';" class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-4" style="max-height: 230px; overflow-y: auto;">
			<h4> {{{usuariosv}}}</h4>
			<div class="form-group form-group-lg" style="padding-left:5px;">{{{inputUsuarios}}}</div>
		</div>
		<div class="col-md-8">
			<h4>{{{grupo}}}</h4>
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="nome" >{{{nomeTxt}}}</label>
				<div class="col-md-10">
					<input title="{{{nomeTxt}}}" type="text" value="{{{nome}}}" class="form-control" name="nome" required>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="login">{{{descricaoTxt}}}</label>
				<div class="col-md-10">
					<input title="{{{descricaoTxt}}}" type="text" value="{{{descricao}}}" class="form-control" name="descricao">
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
<div class="panel panel-default" id="form-{{id_grupo}}">
	<div class="panel-heading" role="tab">
		<h3 class="panel-title {{escondido}}">
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_grupo}}')" class="btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons">delete_forever</i>
			</a>
			&nbsp;
			<a class="collapsed in" role="button" data-toggle="collapse" href="#body-form-{{id_grupo}}"
			aria-expanded="false" aria-controls="#body-form-{{id_grupo}}"> {{{nome}}} </a>
		</h3>
	</div>
	<div class="panel-body panel-collapse collapse" id="body-form-{{id_grupo}}">
		{{{templateFormLista}}}
	</div>
</div>
</script>
<script id="templateInputUsuarios" type="x-tmpl-mustache">
	<div class="checkbox">
		<label>
			<input type="checkbox" {{checked}} name="id_usuario-{{{id_usuario}}}" /> <abbr title="{{{nome_usuario}}}">{{{login}}}</abbr>
		</label>
	</div>
</script>
<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../../dicionario/gruposusuarios.js"></script>
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
		i3GEOadmin.gruposusuarios.dicionario = $.extend(
			{},
			i3GEOadmin.gruposusuarios.dicionario,
			i3GEOadmin.core.dicionario
		);

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.gruposusuarios.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.gruposusuarios.dicionario);

		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.gruposusuarios.dicionario
			)
		);
		$.material.init();
		var inicia = function() {
			$(".hidden").removeClass('hidden');
			i3GEOadmin.gruposusuarios.init($("#corpo"));
		};
		i3GEO.login.verificaOperacao("admin/html/usuarios",i3GEO.configura.locaplic, inicia, "sessao");
	});
</script>
</body>
</html>
