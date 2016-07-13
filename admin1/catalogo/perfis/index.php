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
			<li class="active">Perfis</li>
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
					<label class="control-label">{{{filtro}}}</label> <select
						onchange="i3GEOadmin.perfis.filtra(this)" id="filtro" class="form-control input-lg">
					</select>
				</div>
				<div class="row pull-right">
					<a onclick="i3GEOadmin.perfis.adicionaDialogo();" href="javascript:void(0)"
						class="btn btn-primary" role="button">{{{adicionar}}}</a>
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
<option value="form-{{id_perfil}}">{{{nome_menu}}}</option>
</script>
<script id="templateLista" type="x-tmpl-mustache">
	<div class="panel panel-default" id="form-{{id_perfil}}">
		<div class="panel-body">
			<div class="row">
				<div class="col-md-7">
					<form style="" onchange="this.style.boxShadow='2px 2px 5px 0 #009688';" class="form" role="form"
						method="post" action="">
						<div class="form-group form-group-lg">
							<label class="col-md-2 control-label" for="perfil">{{{txtPerfil}}}</label>
							<div class="col-md-10">
								<input type="text" value="{{{perfil}}}" class="form-control" name="perfil" required>
							</div>
						</div>
					</form>
				</div>
				<div class="col-md-5">
					<div class="pull-right">
						<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_perfil}}')" class="btn btn-danger"
							role="button">{{excluir}}</a>
						<a href="javascript:void(0)"
							onclick="{{onSalvar}}('{{id_perfil}}')" class="btn btn-primary" role="button">{{salvar}}</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</script>

<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../../dicionario/perfis.js"></script>
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
		i3GEOadmin.perfis.dicionario.adicionar = i3GEOadmin.core.dicionario.adicionar;
		i3GEOadmin.perfis.dicionario.filtro = i3GEOadmin.core.dicionario.filtro;
		i3GEOadmin.perfis.dicionario.excluir = i3GEOadmin.core.dicionario.excluir;
		i3GEOadmin.perfis.dicionario.salvar = i3GEOadmin.core.dicionario.salva;
		i3GEOadmin.perfis.dicionario.cancelar = i3GEOadmin.core.dicionario.cancelar;
		i3GEOadmin.perfis.dicionario.confirma = i3GEOadmin.core.dicionario.confirma;
		i3GEOadmin.perfis.dicionario.txtPerfil = i3GEOadmin.core.dicionario.txtPerfil;
		i3GEOadmin.perfis.dicionario.sim = i3GEOadmin.core.dicionario.sim;
		i3GEOadmin.perfis.dicionario.nao = i3GEOadmin.core.dicionario.nao;

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.perfis.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.perfis.dicionario);

		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.perfis.dicionario
			)
		);
		$.material.init();
		var inicia = function() {
			$(".hidden").removeClass('hidden');
			i3GEOadmin.perfis.init($("#corpo"));
		};
		i3GEO.login.verificaOperacao("admin/html/perfis",i3GEO.configura.locaplic, inicia, "sessao");
	});
</script>
</body>
</html>
