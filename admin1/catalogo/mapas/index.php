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
			<li class="active">Mapas</li>
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
					<a onclick="i3GEOadmin.mapas.adicionaDialogo();" href="javascript:void(0)" class="btn btn-primary" role="button">{{{adicionar}}}</a>
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
<option value="form-{{id_mapa}}">{{{nome_mapa}}}</option>
</script>
<script id="templateLista" type="x-tmpl-mustache">
<div class="panel panel-default" id="form-{{id_mapa}}">
	<div class="panel-heading" role="tab">
		<h3 class="panel-title">
			<a class="collapsed in" role="button" data-toggle="collapse" href="#body-form-{{id_mapa}}"
			aria-expanded="false" aria-controls="#body-form-{{id_mapa}}"> {{{nome_mapa}}} </a>
		</h3>
	</div>
	<div class="panel-body panel-collapse collapse" id="body-form-{{id_mapa}}">
		<form style="" onchange="this.style.boxShadow='2px 2px 5px 0 #009688';" class="form-horizontal" role="form" method="post" action="" >
			<div class="row">
				<div class="col-md-12">
					<h4>{{{nome_mapa}}}</h4>
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="nome_mapa" >{{{nomeMapa}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{nome_mapa}}}" class="form-control" name="nome_mapa" required>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="desc_mapa">{{{descricao}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{desc_mapa}}}" class="form-control" name="desc_mapa" >
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="contemmapfile" >{{{contemMapfile}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{contemmapfile}}}" disabled="" class="form-control" name="contemmapfile" required>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="ordem_mapa">{{{ordemMapa}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{ordem_mapa}}}" class="form-control" name="ordem_mapa">
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="temas_mapa">{{{temas}}}</label>
						<div class="col-md-4">
							<input type="text" value="{{{temas_mapa}}}" class="form-control" name="temas_mapa" id="temas_mapa-{{id_mapa}}">
						</div>
						<div class="col-md-4">
							<select class="form-control" onchange="i3GEOadmin.mapas.addInput('temas_mapa-{{id_mapa}}',this.value)">
								{{{opcoesTema}}}
							</select>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="ligados_mapa">{{{temasLigados}}}</label>
						<div class="col-md-4">
							<input type="text" value="{{{ligados_mapa}}}" class="form-control" name="ligados_mapa" id="ligados_mapa-{{id_mapa}}">
						</div>
						<div class="col-md-4">
							<select class="form-control" onchange="i3GEOadmin.mapas.addInput('ligados_mapa-{{id_mapa}}',this.value)">
								{{{opcoesTema}}}
							</select>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="perfil_mapa">{{{perfis}}}</label>
						<div class="col-md-4">
							<input id="perfil_mapa-{{id_mapa}}" type="text" value="{{{perfil_mapa}}}" class="form-control" name="perfil_mapa">
						</div>
						<div class="col-md-4">
							<select class="form-control" onchange="i3GEOadmin.mapas.addInput('perfil_mapa-{{id_mapa}}',this.value)">
								{{{opcoesPerfil}}}
							</select>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="publicado_mapa">{{{publicado}}}</label>
						<div class="col-md-8">
							<select name="publicado_mapa" class="form-control">
								{{{opcoesPublicado}}}
							</select>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="ext_mapa">{{{extensao}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{ext_mapa}}}" class="form-control" name="ext_mapa">
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="imagem_mapa">{{{img}}}</label>
						<div class="col-md-4">
							<input type="text" value="{{{imagem_mapa}}}" class="form-control" name="imagem_mapa">
						</div>
						<div class="col-md-4">
							<a href="#" class="thumbnail">
      							<img src="{{{imagem_mapa}}}">
    						</a>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="linkdireto_mapa">{{{linkDireto}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{linkdireto_mapa}}}" class="form-control" name="linkdireto_mapa">
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="outros_mapa">{{{parametros}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{outros_mapa}}}" class="form-control" name="outros_mapa">
						</div>
					</div>
				</div>
			</div>
		</form>
		<div class="pull-right">
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_mapa}}')" class="btn btn-danger" role="button">{{excluir}}</a>
			<a href="javascript:void(0)" onclick="{{onSalvar}}('{{id_mapa}}')" class="btn btn-primary" role="button">{{salvar}}</a>
		</div>
	</div>
</div>
</script>
<script id="templateTemas" type="x-tmpl-mustache">
	<option value="{{{codigo_tema}}}">{{{nome_tema}}} - {{{codigo_tema}}}</option>
</script>
<script id="templateOpcoesPerfil" type="x-tmpl-mustache">
	<option value="{{{perfil}}}">{{{perfil}}}</option>
</script>
<script id="templateOpcoesPublicado" type="x-tmpl-mustache">
	<option value="">---</option>
	<option {{SIM-sel}} value="SIM">{{{sim}}}</option>
	<option {{NAO-sel}} value="NAO">{{{nao}}}</option>
</script>
<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../../dicionario/mapas.js"></script>
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
		i3GEOadmin.mapas.dicionario.adicionar = i3GEOadmin.core.dicionario.adicionar;
		i3GEOadmin.mapas.dicionario.filtro = i3GEOadmin.core.dicionario.filtro;
		i3GEOadmin.mapas.dicionario.excluir = i3GEOadmin.core.dicionario.excluir;
		i3GEOadmin.mapas.dicionario.salvar = i3GEOadmin.core.dicionario.salva;
		i3GEOadmin.mapas.dicionario.cancelar = i3GEOadmin.core.dicionario.cancelar;
		i3GEOadmin.mapas.dicionario.confirma = i3GEOadmin.core.dicionario.confirma;
		i3GEOadmin.mapas.dicionario.nome = i3GEOadmin.core.dicionario.nome;
		i3GEOadmin.mapas.dicionario.tipo = i3GEOadmin.core.dicionario.tipo;
		i3GEOadmin.mapas.dicionario.descricao = i3GEOadmin.core.dicionario.descricao;
		i3GEOadmin.mapas.dicionario.sim = i3GEOadmin.core.dicionario.sim;
		i3GEOadmin.mapas.dicionario.nao = i3GEOadmin.core.dicionario.nao;

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.mapas.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.mapas.dicionario);

		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.mapas.dicionario
			)
		);
		$.material.init();
		var inicia = function() {
			$(".hidden").removeClass('hidden');
			i3GEOadmin.mapas.init($("#corpo"));
		};
		i3GEO.login.verificaOperacao("admin/html/mapas",i3GEO.configura.locaplic, inicia, "sessao");
	});
</script>
</body>
</html>
