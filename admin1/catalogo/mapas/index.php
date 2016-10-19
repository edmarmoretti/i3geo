<?php
define ( ONDEI3GEO, "../../.." );
include (dirname ( __FILE__ ) . "/../../../ms_configura.php");
error_reporting ( 0 );
include "../../head.php";
?>
<div class="container-fluid migalha">
	<div class="row">
		<div class="btn-group btn-breadcrumb">
			<a class="btn btn-default" href="../../../init/index.php"><div>i3Geo</div></a>
			<a class="btn btn-default" href="../../index.php"><div>Admin</div></a>
			<a class="btn btn-default" style="pointer-events: none"><div>Cat&aacute;logo</div></a>
			<a class="btn btn-default" style="pointer-events: none"><div>Mapas</div></a>
		</div>
	</div>
</div>
<div class="container">
	<div class="row center-block">
		<div class="col-md-12" id="titulo">
			<div class="well hidden" >
				<button data-toggle="modal" data-target="#ajudaPrincipal"
					class="btn btn-primary btn-fab btn-fab-mini pull-right">
					<i class="material-icons">help</i>
				</button>
				<h2><small>{{{txtTitulo}}}</small></h2>
				<blockquote>{{{txtDesc}}}</blockquote>
				<!-- aqui entra o filtro -->
				<div class="form-group">

					<select title="{{{filtro}}}" onchange="i3GEOadmin.core.filtra(this)" id="filtro" class="form-control input-lg">
					</select>
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
				<div class="row pull-right">
					<a onclick="i3GEOadmin.mapas.adicionaDialogo();" href="javascript:void(0)" class="btn btn-primary" style="color:#008579;" role="button">{{{adicionar}}}</a>
				</div>
				<div class="clearfix"></div>
				<div id="corpo">
				</div>
			</div>
		</div>
	</div>
</div>
<script id="templateFiltro" type="x-tmpl-mustache">
<option value="form-{{id_mapa}}">{{{nome_mapa}}}</option>
</script>
<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{id_mapa}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_mapa}}');return false;" onchange="this.style.boxShadow='2px 2px 5px 0 #009688';" class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="nome_mapa" >{{{nomeMapa}}}</label>
				<div class="col-md-8">
					<input title="{{{nomeMapa}}}" type="text" value="{{{nome_mapa}}}" class="form-control" name="nome_mapa" required>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="desc_mapa">{{{descricao}}}</label>
				<div class="col-md-8">
					<input title="{{{descricao}}}" type="text" value="{{{desc_mapa}}}" class="form-control" name="desc_mapa" >
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="contemmapfile" >{{{contemMapfile}}}</label>
				<div class="col-md-8">
					<input title="{{{contemMapfile}}}" type="text" value="{{{contemmapfile}}}" disabled="" class="form-control" name="contemmapfile" >
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="ordem_mapa">{{{ordemMapa}}}</label>
				<div class="col-md-8">
					<input title="{{{ordemMapa}}}" type="text" value="{{{ordem_mapa}}}" class="form-control" name="ordem_mapa">
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="temas_mapa">{{{temas}}}</label>
				<div class="col-md-4">
					<input title="{{{temas}}}" type="text" value="{{{temas_mapa}}}" class="form-control" name="temas_mapa" id="temas_mapa-{{id_mapa}}">
				</div>
				<div class="col-md-4">
					<select title="{{{temas}}}" class="form-control" onchange="i3GEOadmin.mapas.addInput('temas_mapa-{{id_mapa}}',this.value)">
						{{{opcoesTema}}}
					</select>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="ligados_mapa">{{{temasLigados}}}</label>
				<div class="col-md-4">
					<input title="{{{temasLigados}}}" type="text" value="{{{ligados_mapa}}}" class="form-control" name="ligados_mapa" id="ligados_mapa-{{id_mapa}}">
				</div>
				<div class="col-md-4">
					<select title="{{{temasLigados}}}" class="form-control" onchange="i3GEOadmin.mapas.addInput('ligados_mapa-{{id_mapa}}',this.value)">
						{{{opcoesTema}}}
					</select>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="perfil_mapa">{{{perfis}}}</label>
				<div class="col-md-4">
					<input title="{{{perfis}}}" id="perfil_mapa-{{id_mapa}}" type="text" value="{{{perfil_mapa}}}" class="form-control" name="perfil_mapa">
				</div>
				<div class="col-md-4">
					<select title="{{{perfis}}}" class="form-control" onchange="i3GEOadmin.mapas.addInput('perfil_mapa-{{id_mapa}}',this.value)">
						{{{opcoesPerfil}}}
					</select>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="publicado_mapa">{{{publicado}}}</label>
				<div class="col-md-8">
					<select title="{{{publicado}}}" name="publicado_mapa" class="form-control">
						{{{opcoesPublicado}}}
					</select>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="ext_mapa">{{{extensao}}}</label>
				<div class="col-md-8">
					<input title="{{{extensao}}}" type="text" value="{{{ext_mapa}}}" class="form-control" name="ext_mapa">
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="imagem_mapa">{{{img}}}</label>
				<div class="col-md-4">
					<input title="{{{img}}}" type="text" value="{{{imagem_mapa}}}" class="form-control" name="imagem_mapa">
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
					<input title="{{{linkDireto}}}" type="text" value="{{{linkdireto_mapa}}}" class="form-control" name="linkdireto_mapa">
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="outros_mapa">{{{parametros}}}</label>
				<div class="col-md-8">
					<input title="{{{parametros}}}" type="text" value="{{{outros_mapa}}}" class="form-control" name="outros_mapa">
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
<div class="list-group-item" id="form-{{id_mapa}}">
	<div class="row-content">
		<h3 class="list-group-item-heading {{escondido}}">
			<a href="javascript:void(0)" onclick="{{onEditar}}('{{id_mapa}}')" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
				<i class="material-icons md-18">edit</i>
			</a>
			<span class="pull-right">&nbsp;&nbsp;</span>
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_mapa}}')" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
				<i class="material-icons md-18">delete_forever</i>
			</a>
			{{{nome_mapa}}}
		</h3>
	</div>
	<div class="list-group-separator"></div>
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
		i3GEOadmin.mapas.dicionario = $.extend(
			{},
			i3GEOadmin.mapas.dicionario,
			i3GEOadmin.core.dicionario
		);

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
