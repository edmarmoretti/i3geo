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
			<li class="active">Atlas</li>
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
					<a onclick="i3GEOadmin.atlas.adicionaDialogo();" href="javascript:void(0)" class="btn btn-primary" role="button">{{{adicionar}}}</a>
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
<option value="form-{{id_atlas}}">{{{titulo_atlas}}}</option>
</script>
<script id="templateLista" type="x-tmpl-mustache">
<div class="panel panel-default" id="form-{{id_atlas}}">
	<div class="panel-heading" role="tab">
		<h3 class="panel-title">
			<a class="collapsed in" role="button" data-toggle="collapse" href="#body-form-{{id_atlas}}"
			aria-expanded="false" aria-controls="#body-form-{{id_atlas}}"> {{{titulo_atlas}}} </a>
		</h3>
	</div>
	<div class="panel-body panel-collapse collapse" id="body-form-{{id_atlas}}">
		<form style="" onchange="this.style.boxShadow='2px 2px 5px 0 #009688';" class="form-horizontal" role="form" method="post" action="" >
			<div class="row">
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="nome_atlas" >{{{titulo}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{titulo_atlas}}}" class="form-control" name="titulo_atlas" required>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="desc_atlas" >{{{descricao}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{desc_atlas}}}" class="form-control" name="desc_atlas" required>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="link_atlas" >{{{linkTxt}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{link_atlas}}}" class="form-control" name="link_atlas" required>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="publicado_atlas">{{{publicado}}}</label>
						<div class="col-md-8">
							<select name="publicado_atlas" class="form-control">
								{{{opcoesPublicado}}}
							</select>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="ordem_atlas" >{{{ordem}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{ordem_atlas}}}" class="form-control" name="ordem_atlas" required>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="basemapfile_atlas" >{{{mapfileInicia}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{basemapfile_atlas}}}" class="form-control" name="basemapfile_atlas" required>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="h_atlas" >{{{altura}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{h_atlas}}}" class="form-control" name="h_atlas" required>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="w_atlas" >{{{largura}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{w_atlas}}}" class="form-control" name="w_atlas" required>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="icone_atlas" >{{{iconeAtlas}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{icone_atlas}}}" class="form-control" name="icone_atlas" required>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="pranchadefault_atlas" >{{{pranchaInicia}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{pranchadefault_atlas}}}" class="form-control" name="pranchadefault_atlas" required>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="template_atlas" >{{{template}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{template_atlas}}}" class="form-control" name="template_atlas" required>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="tipoguias_atlas" >{{{tipoGuia}}}</label>
						<div class="col-md-8">
							<select name="publicado_atlas" class="form-control">
								{{{opcoesTipoGuia}}}
							</select>
						</div>
					</div>
				</div>
			</div>
		</form>
		<div class="pull-right">
			<a href="javascript:void(0)" onclick="i3GEOadmin.atlas.editarPranchas('{{id_atlas}}','{{{titulo_atlas}}}')" class="btn btn-default" role="button">{{{pranchas}}}</a>
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_atlas}}')" class="btn btn-danger" role="button">{{excluir}}</a>
			<a href="javascript:void(0)" onclick="{{onSalvar}}('{{id_atlas}}')" class="btn btn-primary" role="button">{{salvar}}</a>
		</div>
	</div>
</div>
</script>
<script id="templateOpcoesTipoGuia" type="x-tmpl-mustache">
	<option {{automatica-sel}} value="automatica">automatica</option>
	<option {{combo-sel}} value="combo">combo</option>
	<option {{expandida-sel}} value="expandida">expandida</option>
</script>
<script id="templateOpcoesPublicado" type="x-tmpl-mustache">
	<option value="">---</option>
	<option {{SIM-sel}} value="SIM">{{{sim}}}</option>
	<option {{NAO-sel}} value="NAO">{{{nao}}}</option>
</script>
<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../../dicionario/atlas.js"></script>
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
		i3GEOadmin.atlas.dicionario.adicionar = i3GEOadmin.core.dicionario.adicionar;
		i3GEOadmin.atlas.dicionario.filtro = i3GEOadmin.core.dicionario.filtro;
		i3GEOadmin.atlas.dicionario.excluir = i3GEOadmin.core.dicionario.excluir;
		i3GEOadmin.atlas.dicionario.salvar = i3GEOadmin.core.dicionario.salva;
		i3GEOadmin.atlas.dicionario.cancelar = i3GEOadmin.core.dicionario.cancelar;
		i3GEOadmin.atlas.dicionario.confirma = i3GEOadmin.core.dicionario.confirma;
		i3GEOadmin.atlas.dicionario.nome = i3GEOadmin.core.dicionario.nome;
		i3GEOadmin.atlas.dicionario.tipo = i3GEOadmin.core.dicionario.tipo;
		i3GEOadmin.atlas.dicionario.descricao = i3GEOadmin.core.dicionario.descricao;
		i3GEOadmin.atlas.dicionario.sim = i3GEOadmin.core.dicionario.sim;
		i3GEOadmin.atlas.dicionario.nao = i3GEOadmin.core.dicionario.nao;

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.atlas.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.atlas.dicionario);

		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.atlas.dicionario
			)
		);
		$.material.init();
		var inicia = function() {
			//verifica se foi enviado um parametro de filtro pela url
			var f = "<?php echo filter_var($_GET["id_filtro"], FILTER_SANITIZE_NUMBER_INT); ?>";
			if(f != ""){
				i3GEOadmin.core.initFiltro = "form-" + f;
			}
			$(".hidden").removeClass('hidden');
			i3GEOadmin.atlas.init($("#corpo"));
		};
		i3GEO.login.verificaOperacao("admin/html/atlas",i3GEO.configura.locaplic, inicia, "sessao");
	});
</script>
</body>
</html>
