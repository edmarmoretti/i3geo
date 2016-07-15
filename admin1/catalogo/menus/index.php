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
			<li>Cat&aacute;logo</li>
			<li class="active">Menus</li>
		</ol>
	</div>
</div>
<div class="container">
	<div class="row center-block">
		<div class="col-md-12">
			<div class="well hidden" id="titulo">
				<button data-toggle="modal" data-target="#ajudaPrincipal"
					class="btn btn-primary btn-fab btn-fab-mini pull-right">
					<i class="material-icons">help</i>
				</button>
				<h3>{{{txtTitulo}}}</h3>
				<!--<h4>{{{txtDesc}}}</h4>-->
				<!-- aqui entra o filtro -->
				<div class="form-group">
					<label class="control-label">{{{filtro}}}</label>
					<select onchange="i3GEOadmin.core.filtra(this)" id="filtro" class="form-control input-lg">
					</select>
				</div>
				<div class="row pull-right">
					<a onclick="i3GEOadmin.menus.adicionaDialogo();" href="javascript:void(0)" class="btn btn-primary" role="button">{{{adicionar}}}</a>
				</div>
				<div class="clearfix"></div>
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
			<div class="well hidden">
				<div id="corpo">
				</div>
			</div>
		</div>
	</div>
</div>
<script id="templateFiltro" type="x-tmpl-mustache">
<option value="form-{{id_menu}}">{{{nome_menu}}}</option>
</script>
<script id="templateLista" type="x-tmpl-mustache">
<div class="panel panel-default" id="form-{{id_menu}}">
	<div class="panel-heading" role="tab">
		<h3 class="panel-title">
			<a class="collapsed in" role="button" data-toggle="collapse" href="#body-form-{{id_menu}}"
			aria-expanded="false" aria-controls="#body-form-{{id_menu}}"> {{{nome_menu}}} </a>
		</h3>
	</div>
	<div class="panel-body panel-collapse collapse" id="body-form-{{id_menu}}">
		<form style="" onchange="this.style.boxShadow='2px 2px 5px 0 #009688';" class="form-horizontal" role="form" method="post" action="" >
			<div class="row">
				<div class="col-md-12">
					<h4>{{{nome_menu}}}</h4>
					<div class="form-group form-group-lg">
						<label class="col-md-3 control-label" for="nome_menu" >{{{nomeMenu}}}</label>
						<div class="col-md-9">
							<input type="text" value="{{{nome_menu}}}" class="form-control" name="nome_menu" required>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-3 control-label" for="es">{{{nomeEs}}}</label>
						<div class="col-md-9">
							<input type="text" value="{{{es}}}" class="form-control" name="es" >
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-3 control-label" for="en">{{{nomeIn}}}</label>
						<div class="col-md-9">
							<input type="text" value="{{{en}}}" class="form-control" name="en" required>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-3 control-label" for="desc_menu">{{{descricao}}}</label>
						<div class="col-md-9">
							<input type="text" value="{{{desc_menu}}}" class="form-control" name="desc_menu">
						</div>
					</div>

					<div class="form-group form-group-lg">
						<label class="col-md-3 control-label" for="perfil_menu">{{{perfilAjuda}}}</label>
						<div class="col-md-5">
							<input id="perfil-{{id_menu}}" type="text" value="{{{perfil_menu}}}" class="form-control" name="perfil_menu">
						</div>
						<div class="col-md-4">
							<select class="form-control" onchange="i3GEOadmin.menus.addPerfil('perfil-{{id_menu}}',this.value)">
								{{{opcoesPerfil}}}
							</select>
						</div>
					</div>

					<div class="form-group form-group-lg">
						<label class="col-md-3 control-label" for="publicado_menu">{{{publicado}}}</label>
						<div class="col-md-9">
							<select name="publicado_menu" class="form-control">
								{{{opcoesPublicado}}}
							</select>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-3 control-label" for="aberto">{{{iniciaAberto}}}</label>
						<div class="col-md-9">
							<select name="aberto" class="form-control">
								{{{opcoesAberto}}}
							</select>
						</div>
					</div>
				</div>
			</div>
		</form>
		<div class="pull-right">
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_menu}}')" class="btn btn-danger" role="button">{{excluir}}</a>
			<a href="javascript:void(0)" onclick="{{onSalvar}}('{{id_menu}}')" class="btn btn-primary" role="button">{{salvar}}</a>
		</div>
	</div>
</div>
</script>
<script id="templateOpcoesPerfil" type="x-tmpl-mustache">
	<option value="{{{perfil}}}">{{{perfil}}}</option>
</script>
<script id="templateOpcoesPublicado" type="x-tmpl-mustache">
	<option value="">---</option>
	<option {{SIM-sel}} value="SIM">{{{sim}}}</option>
	<option {{NAO-sel}} value="NAO">{{{nao}}}</option>
</script>
<script id="templateOpcoesAberto" type="x-tmpl-mustache">
	<option value="">---</option>
	<option {{SIM-sel}} value="SIM">{{{sim}}}</option>
	<option {{NAO-sel}} value="NAO">{{{nao}}}</option>
</script>
<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../../dicionario/menus.js"></script>
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
		i3GEOadmin.menus.dicionario.adicionar = i3GEOadmin.core.dicionario.adicionar;
		i3GEOadmin.menus.dicionario.filtro = i3GEOadmin.core.dicionario.filtro;
		i3GEOadmin.menus.dicionario.excluir = i3GEOadmin.core.dicionario.excluir;
		i3GEOadmin.menus.dicionario.salvar = i3GEOadmin.core.dicionario.salva;
		i3GEOadmin.menus.dicionario.cancelar = i3GEOadmin.core.dicionario.cancelar;
		i3GEOadmin.menus.dicionario.confirma = i3GEOadmin.core.dicionario.confirma;
		i3GEOadmin.menus.dicionario.nome = i3GEOadmin.core.dicionario.nome;
		i3GEOadmin.menus.dicionario.tipo = i3GEOadmin.core.dicionario.tipo;
		i3GEOadmin.menus.dicionario.descricao = i3GEOadmin.core.dicionario.descricao;
		i3GEOadmin.menus.dicionario.sim = i3GEOadmin.core.dicionario.sim;
		i3GEOadmin.menus.dicionario.nao = i3GEOadmin.core.dicionario.nao;

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.menus.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.menus.dicionario);

		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.menus.dicionario
			)
		);
		$.material.init();
		var inicia = function() {
			$(".hidden").removeClass('hidden');
			i3GEOadmin.menus.init($("#corpo"));
		};
		i3GEO.login.verificaOperacao("admin/html/menus",i3GEO.configura.locaplic, inicia, "sessao");
	});
</script>
</body>
</html>
