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
			<li class="active">Mapfiles</li>
		</ol>
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
					<label class="control-label">{{{filtro}}}</label>
					<select title="{{{filtro}}}" onchange="i3GEOadmin.core.filtra(this)" id="filtro" class="form-control input-lg">
					</select>
				</div>
				<div class="row pull-right">
					<a onclick="i3GEOadmin.mapfile.adicionaDialogo();" href="javascript:void(0)" class="btn btn-primary" style="color:#008579;" role="button">{{{adicionar}}}</a>
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
				<div class="panel panel-default" id="favoritos">
					<div class="panel-heading" role="tab">
						<h4 class="panel-title">
							<a class="collapsed in" role="button" data-toggle="collapse" href="#body-favoritos"
							aria-expanded="false" > <i class="material-icons">favorite_border</i> {{{favoritos}}} </a>
						</h4>
					</div>
					<div class="panel-body panel-collapse collapse" id="body-favoritos">
					</div>
				</div>
				<div id="corpo">
				</div>
			</div>
		</div>
	</div>
</div>
<script id="templateFiltro" type="x-tmpl-mustache">
<option value="form-{{codigo}}">{{{codigo}}} - {{{nome}}}</option>
</script>
<script id="templateLista" type="x-tmpl-mustache">
<div class="panel panel-default" id="form-{{codigo}}">
	<div class="panel-heading" role="tab">
		<h4 class="panel-title {{escondido}}">
			<a title="{{{favorito}}}" href="javascript:void(0)" onclick="i3GEOadmin.mapfile.registraFavoritos('{{codigo}}')" class="btn btn-primary btn-fab btn-fab-mini" role="button">
				<i class="material-icons">favorite_border</i>
			</a>
			<a class="collapsed in" role="button" data-toggle="collapse" href="#body-form-{{codigo}}" aria-expanded="false" aria-controls="#body-form-{{codigo}}">
				&nbsp;
				<small> {{{arquivoTxt}}}:</small> {{{codigo}}} <small> {{{tituloTxt}}}:</small> {{{nome}}}
			</a>
		</h4>
	</div>
	<div class="panel-body panel-collapse collapse" id="body-form-{{codigo}}">
		<div>
			<a title="{{{excluir}}}" href="javascript:void(0)" onclick="i3GEOadmin.mapfile.excluirDialogo('{{codigo}}')" class="btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons">delete_forever</i>
			</a>
			&nbsp;
			<a title="{{{filtraLista}}}" href="javascript:void(0)" onclick="i3GEOadmin.mapfile.init($('#corpo'),'{{codigo}}');" class="btn btn-primary btn-fab btn-fab-mini" role="button">
				<i class="material-icons">filter_list</i>
			</a>
			&nbsp;

			<a title="{{{criaCopia}}}" href="javascript:void(0)" onclick="i3GEOadmin.mapfile.clonaDialogo('{{codigo}}')" class="btn btn-primary btn-fab btn-fab-mini" role="button">
				<i class="material-icons">content_copy</i>
			</a>
			&nbsp;
			<a title="{{{limpaCache}}}" href="javascript:void(0)" onclick="i3GEOadmin.mapfile.limpaCacheDialogo('{{codigo}}')" class="btn btn-primary btn-fab btn-fab-mini" role="button">
				<i class="material-icons">layers_clear</i>
			</a>
			&nbsp;
			<a title="{{{editorTxt}}}" href="javascript:void(0)" onclick="window.open('../../../admin/php/editortexto.php?mapfile={{codigo}}')" class="btn btn-primary btn-fab btn-fab-mini" role="button">
				<i class="material-icons">mode_edit</i>
			</a>
			&nbsp;
			<a title="{{{testaLayer}}}" href="javascript:void(0)" onclick="window.open('../../../testamapfile.php?map={{codigo}}.map')" class="btn btn-primary btn-fab btn-fab-mini" role="button">
				<i class="material-icons">report</i>
			</a>
			&nbsp;
			<a title="{{{editarI3geo}}}" href="javascript:void(0)" onclick="window.open('../../../interface/black_editor.php?&temaEdicao={{codigo}}')" class="btn btn-primary btn-fab btn-fab-mini" role="button">
				<i class="material-icons">settings</i>
			</a>
			&nbsp;
			<a title="{{{testarI3geo}}}" href="javascript:void(0)" onclick="window.open('../../../ms_criamapa.php?temasa={{codigo}}&layers={{codigo}}')" class="btn btn-primary btn-fab btn-fab-mini" role="button">
				<i class="material-icons">sending</i>
			</a>
		</div>
	</div>
</div>
</script>
<script id="templateAdicionarTema" type="x-tmpl-mustache">
		<h4>{{{criaMapfile}}}</h4>
		<blockquote>{{{criaMapfileDesc}}}</blockquote>
		<form id="form-modal-adiciona" style="" action="#" onsubmit="i3GEOadmin.mapfile.adiciona();return false;" onchange="this.style.boxShadow='2px 2px 5px 0 #009688';" class="form-horizontal" role="form" method="post"   >
			<div class="row">
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-6 control-label" for="codigo" >{{{nomeMap}}}</label>
						<div class="col-md-6">
							<input title="{{{nomeMap}}}" type="text" value="" class="form-control" name="codigo" required>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-6 control-label" for="titulo" >{{{tituloTema}}}. {{{tituloPt}}}</label>
						<div class="col-md-6">
							<input title="{{{tituloTema}}}" type="text" value="" class="form-control" name="titulo" >
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-6 control-label" for="tituloES" >{{{tituloEs}}}</label>
						<div class="col-md-6">
							<input title="{{{tituloEs}}}" type="text" value="" class="form-control" name="tituloES" >
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-6 control-label" for="tituloEN" >{{{tituloEn}}}</label>
						<div class="col-md-6">
							<input title="{{{tituloEn}}}" type="text" value="" class="form-control" name="tituloEN" >
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-6 control-label" for="desc_tema" >{{{descricaoTxt}}}</label>
						<div class="col-md-6">
							<input title="{{{descricaoTxt}}}" type="text" value="" class="form-control" name="desc_tema" >
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-6 control-label" for="link_tema" >{{{fonteTema}}}</label>
						<div class="col-md-6">
							<input title="{{{fonteTema}}}" type="text" value="" class="form-control" name="link_tema" >
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-6 control-label" for="metaestat">{{{metaestat}}}</label>
						<div class="col-md-6">
							<select title="{{{metaestat}}}" class="form-control" name="metaestat">
								<option value="SIM" >{{{sim}}}</option>
								<option value="NAO" selected >{{{nao}}}</option>
							</select>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<div class="checkbox col-md-12">
							<label>
								<input title="{{{permiteOgc}}}" type="checkbox" checked name="acessopublico" /> {{{permiteOgc}}}
							</label>
						</div>
					</div>
				</div>
			<div class="pull-right">
				<button type="submit" class="btn btn-primary" role="button" style="color:#008579;">{{salva}}</button>
			</div>
			</div>
		</form>
</script>
<script id="templateClonarTema" type="x-tmpl-mustache">
		<h4>{{{clonaMapfile}}}</h4>
		<form id="form-modal-adiciona" style="" action="#" onsubmit="i3GEOadmin.mapfile.clona();return false;" onchange="this.style.boxShadow='2px 2px 5px 0 #009688';" class="form-horizontal" role="form" method="post"   >
			<div class="row">
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-6 control-label" for="novocodigo" >{{{nomeMap}}}</label>
						<div class="col-md-6">
							<input title="{{{nomeArquivo}}}" type="text" value="" class="form-control" name="novocodigo" required>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-6 control-label" for="titulo" >{{{tituloTema}}}</label>
						<div class="col-md-6">
							<input title="{{{tituloTema}}}" type="text" value="" class="form-control" name="titulo" >
						</div>
					</div>
				</div>
				<input type="hidden" value="{{codigoAtual}}" class="form-control" name="codigo" >
			<div class="pull-right">
				<button type="submit" class="btn btn-primary" role="button" style="color:#008579;">{{criaCopia}}</button>
			</div>
			</div>
		</form>
</script>

<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../../dicionario/editormapfile.js"></script>
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
		i3GEOadmin.mapfile.dicionario = $.extend(
			{},
			i3GEOadmin.mapfile.dicionario,
			i3GEOadmin.core.dicionario
		);

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.mapfile.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.mapfile.dicionario);

		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.mapfile.dicionario
			)
		);
		$.material.init();
		var inicia = function() {
			$(".hidden").removeClass('hidden');
			i3GEOadmin.mapfile.init($("#corpo"),"");
		};
		i3GEO.login.verificaOperacao("admin/html/editormapfile",i3GEO.configura.locaplic, inicia, "sessao");
	});
</script>
</body>
</html>
