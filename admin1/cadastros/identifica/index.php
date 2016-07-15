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
			<li>Cadastros</li>
			<li class="active">Identifica</li>
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
					<select onchange="i3GEOadmin.core.filtra(this)" id="filtro" class="form-control input-lg">
					</select>
				</div>
				<div class="row pull-right">
					<a onclick="i3GEOadmin.identifica.adicionaDialogo();" href="javascript:void(0)" class="btn btn-primary" role="button">{{{adicionar}}}</a>
				</div>
				<div class="clearfix"></div>
				<!--Modal ajuda
				<div id="ajudaPrincipal" class="modal fade" tabindex="-1">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-body">
								<p>{{{txtIdentifica}}}</p>
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
<option value="form-{{id_i}}">{{{nome_i}}}</option>
</script>
<script id="templateLista" type="x-tmpl-mustache">
<div class="panel panel-default" id="form-{{id_i}}">
	<div class="panel-heading" role="tab">
		<h3 class="panel-title">
			<a class="collapsed in" role="button" data-toggle="collapse" href="#body-form-{{id_i}}"
			aria-expanded="false" aria-controls="#body-form-{{id_i}}"> {{{nome_i}}} </a>
		</h3>
	</div>
	<div class="panel-body panel-collapse collapse" id="body-form-{{id_i}}">
		<form style="" onchange="this.style.boxShadow='2px 2px 5px 0 #009688';" class="form-horizontal" role="form" method="post" action="" >
			<div class="row">
				<div class="col-md-12">
					<h4>{{{nome_i}}}</h4>
					<div class="form-group form-group-lg">
						<label class="col-md-2 control-label" for="nome_i" >{{{nome}}}</label>
						<div class="col-md-10">
							<input type="text" value="{{{nome_i}}}" class="form-control" name="nome_i" required>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-2 control-label" for="login">{{{programa}}}</label>
						<div class="col-md-10">
							<input type="text" value="{{{abrir_i}}}" class="form-control" name="abrir_i" >
							<p>{{{programaDesc}}}</p>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-2 control-label" for="target_i">{{{abreComo}}}</label>
						<div class="col-md-10">
							<select class="form-control" name="target_i">
								{{{opcoesTarget}}}
							</select>

						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-2 control-label" for="publicado_i">{{{publicado}}}?</label>
						<div class="col-md-10">
							<select class="form-control" name="publicado_i">
								{{{opcoesPublicado}}}
							</select>
						</div>
					</div>
				</div>
			</div>
		</form>
		<div class="pull-right">
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_i}}')" class="btn btn-danger" role="button">{{excluir}}</a>
			<a href="javascript:void(0)" onclick="{{onSalvar}}('{{id_i}}')" class="btn btn-primary" role="button">{{salvar}}</a>
		</div>
	</div>
</div>
</script>

<script id="templateOpcoesPublicado" type="x-tmpl-mustache">
	<option value="">---</option>
	<option value="SIM" {{SIM-sel}} >{{{sim}}}</option>
	<option value="NAO" {{NAO-sel}} >{{{nao}}}</option>
</script>
<script id="templateOpcoesTarget" type="x-tmpl-mustache">
	<option value="">---</option>
	<option value="target" {{target-sel}} >{{{externo}}}</option>
	<option value="self" {{self-sel}} >{{{mapa}}}</option>
</script>
<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../../dicionario/identifica.js"></script>
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
		i3GEOadmin.identifica.dicionario.adicionar = i3GEOadmin.core.dicionario.adicionar;
		i3GEOadmin.identifica.dicionario.filtro = i3GEOadmin.core.dicionario.filtro;
		i3GEOadmin.identifica.dicionario.excluir = i3GEOadmin.core.dicionario.excluir;
		i3GEOadmin.identifica.dicionario.salvar = i3GEOadmin.core.dicionario.salva;
		i3GEOadmin.identifica.dicionario.cancelar = i3GEOadmin.core.dicionario.cancelar;
		i3GEOadmin.identifica.dicionario.confirma = i3GEOadmin.core.dicionario.confirma;
		i3GEOadmin.identifica.dicionario.nome = i3GEOadmin.core.dicionario.nome;
		i3GEOadmin.identifica.dicionario.tipo = i3GEOadmin.core.dicionario.tipo;
		i3GEOadmin.identifica.dicionario.descricao = i3GEOadmin.core.dicionario.descricao;
		i3GEOadmin.identifica.dicionario.sim = i3GEOadmin.core.dicionario.sim;
		i3GEOadmin.identifica.dicionario.nao = i3GEOadmin.core.dicionario.nao;
		i3GEOadmin.identifica.dicionario.publicado = i3GEOadmin.core.dicionario.publicado;

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.identifica.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.identifica.dicionario);

		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.identifica.dicionario
			)
		);
		$.material.init();
		var inicia = function() {
			$(".hidden").removeClass('hidden');
			i3GEOadmin.identifica.init($("#corpo"));
		};
		i3GEO.login.verificaOperacao("admin/html/identifica",i3GEO.configura.locaplic, inicia, "sessao");
	});
</script>
</body>
</html>
