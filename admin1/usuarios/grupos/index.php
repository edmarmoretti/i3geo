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
		<div class="col-md-12">
			<div class="well hidden" id="titulo">
				<!--
				<button data-toggle="modal" data-target="#ajudaPrincipal"
					class="btn btn-primary btn-fab btn-fab-mini pull-right">
					<i class="material-icons">help</i>
				</button>
				-->
				<h3>{{{txtTitulo}}}</h3>
				<h4>{{{txtDesc}}}</h4>
				<!-- aqui entra o filtro -->
				<div class="form-group">
					<label class="control-label">{{{filtro}}}</label>
					<select onchange="i3GEOadmin.gruposusuarios.filtra(this)" id="filtro" class="form-control input-lg">
					</select>
				</div>

				<div class="row pull-right">
					<a onclick="i3GEOadmin.gruposusuarios.adicionaDialogo();" href="javascript:void(0)" class="btn btn-primary" role="button">{{{adicionar}}}</a>
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
				<div id="corpo">
				</div>
			</div>
		</div>
	</div>
</div>
<script id="templateFiltro" type="x-tmpl-mustache">
<option value="form-{{id_grupo}}">{{{nome}}}</option>
</script>
<script id="templateLista" type="x-tmpl-mustache">
<div class="panel panel-default" id="form-{{id_grupo}}">
	<div class="panel-body">
		<form style="" onchange="this.style.boxShadow='2px 2px 5px 0 #009688';" class="form-horizontal" role="form" method="post" action="" >
			<div class="row">
				<div class="col-md-4" style="max-height: 230px; overflow-y: auto;">
					<h4> {{{usuariosv}}}</h4>
					<div class="form-group form-group-lg" style="padding-left:5px;">{{{inputUsuarios}}}</div>
				</div>
				<div class="col-md-8">
					<h4>{{{grupo}}}</h4>
					<div class="form-group form-group-lg">
						<label class="col-md-2 control-label" for="nome" >{{{labelNome}}}</label>
						<div class="col-md-10">
							<input type="text" value="{{{nome}}}" class="form-control" name="nome" required>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-2 control-label" for="login">{{{labelDescricao}}}</label>
						<div class="col-md-10">
							<input type="text" value="{{{descricao}}}" class="form-control" name="descricao">
						</div>
					</div>
				</div>
			</div>
		</form>
		<div class="pull-right">
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_grupo}}')" class="btn btn-danger" role="button">{{excluir}}</a>
			<a href="javascript:void(0)" onclick="{{onSalvar}}('{{id_grupo}}')" class="btn btn-primary" role="button">{{salvar}}</a>
		</div>
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
		i3GEOadmin.gruposusuarios.dicionario.adicionar = i3GEOadmin.core.dicionario.adicionar;
		i3GEOadmin.gruposusuarios.dicionario.filtro = i3GEOadmin.core.dicionario.filtro;
		i3GEOadmin.gruposusuarios.dicionario.excluir = i3GEOadmin.core.dicionario.excluir;
		i3GEOadmin.gruposusuarios.dicionario.salvar = i3GEOadmin.core.dicionario.salva;
		i3GEOadmin.gruposusuarios.dicionario.sim = i3GEOadmin.core.dicionario.sim;
		i3GEOadmin.gruposusuarios.dicionario.nao = i3GEOadmin.core.dicionario.nao;
		i3GEOadmin.gruposusuarios.dicionario.cancelar = i3GEOadmin.core.dicionario.cancelar;
		i3GEOadmin.gruposusuarios.dicionario.confirma = i3GEOadmin.core.dicionario.confirma;
		i3GEOadmin.gruposusuarios.dicionario.labelNome = i3GEOadmin.core.dicionario.nome;
		i3GEOadmin.gruposusuarios.dicionario.labelDescricao = i3GEOadmin.core.dicionario.descricao;

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
