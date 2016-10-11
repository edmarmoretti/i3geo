<?php
define ( ONDEI3GEO, "../../../../.." );
include (dirname ( __FILE__ ) . "/../../../../../ms_configura.php");
error_reporting ( 0 );
include "../../../../head.php";
$id_n1 = filter_var ( $_GET ["id_n1"], FILTER_SANITIZE_NUMBER_INT );
$nome_grupo = filter_var ( $_GET ["nome_grupo"], FILTER_SANITIZE_STRING );
$id_menu = filter_var ( $_GET ["id_menu"], FILTER_SANITIZE_NUMBER_INT );
$nome_menu = filter_var ( $_GET ["nome_menu"], FILTER_SANITIZE_STRING );
?>
<div class="container-fluid migalha">
	<div class="row">
		<div class="btn-group btn-breadcrumb">
			<a class="btn btn-default" href="../../../../../init/index.php"><div>i3Geo</div></a>
			<a class="btn btn-default" href="../../../../index.php"><div>Admin</div></a>
			<a class="btn btn-default" style="pointer-events: none"><div>Cat&aacute;logo</div></a>
			<a class="btn btn-default" href="../../index.php"><div>Menus</div></a>
			<a class="btn btn-default" href="../index.php?id_menu=<?php echo $id_menu; ?>&nome_menu=<?php echo $nome_menu; ?>"><div>Grupos</div></a>
			<a class="btn btn-default" style="pointer-events: none"><div>Subgrupos</div></a>
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

				<button data-toggle="modal" data-target="#ajudaPrincipal"
					class="btn btn-primary btn-fab btn-fab-mini pull-right">
					<i class="material-icons">help</i>
				</button>
				<h2><small>{{{txtTitulo}}}: <?php echo $nome_grupo; ?></small></h2>
				<blockquote>{{{txtDesc}}}</blockquote>
				<!-- aqui entra o filtro -->
				<div class="form-group">
					 <select
						title="{{{filtro}}}" onchange="i3GEOadmin.core.filtra(this)" id="filtro" class="form-control input-lg">
					</select>
				</div>
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
				<!-- painel para mostrar os temas na raiz -->
				<h3 class="panel-heading icon">
					<a class="collapsed in" role="button" data-toggle="collapse" href="#raiz" aria-expanded="false"
						aria-controls="#raiz">{{{temasRaizSubgrupo}}}</a>
				</h3>
				<div class="clearfix"></div>
				<div class="row pull-right">
					<a onclick="i3GEOadmin.subgrupos.adicionaTemaDialogo();" href="javascript:void(0)"
						class="btn btn-primary" role="button" style="color:#008579;">{{{adicionarTema}}}</a>
				</div>
				<div class="clearfix"></div>
				<div id="raiz" class="panel-body panel-collapse collapse"></div>

			</div>
			<!-- nos -->
			<div class="well hidden">
				<h3 class="panel-heading icon">
					<a class="in" role="button" data-toggle="collapse" href="#corpo" aria-expanded="false"
						aria-controls="#raiz">{{{subgrupos}}}</a>
				</h3>
				<div class="clearfix"></div>
				<div class="row pull-right">
					<a onclick="i3GEOadmin.subgrupos.adicionaNoDialogo();" href="javascript:void(0)"
						class="btn btn-primary" role="button" style="color:#008579;">{{{adicionarSubgrupo}}}</a>
				</div>
				<div class="clearfix"></div>
				<div id="corpo" class="panel-body panel-collapse in"></div>

			</div>
		</div>
	</div>
</div>
<script id="templateFiltro" type="x-tmpl-mustache">
<option value="formNo-{{id_n2}}">{{{nome_subgrupo}}}</option>
</script>
<script id="templateRaiz" type="x-tmpl-mustache">
<div class="panel panel-default" data-id="{{id_raiz}}" id="formRaiz-{{id_raiz}}">
	<div class="panel-heading icon" role="tab">
		<h3 class="panel-title" {{escondido}}>
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_raiz}}')" class="btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons">delete_forever</i>
			</a>
			&nbsp;
			<a class="collapsed in" role="button" data-toggle="collapse" href="#body-formRaiz-{{id_raiz}}"
			aria-expanded="false" aria-controls="#body-formRaiz-{{id_raiz}}"> {{{nome_tema}}}
			<i  class="material-icons move" style="color: gray; display:none;">swap_vert</i>
			</a>
		</h3>
	</div>
	<div class="panel-body panel-collapse collapse" id="body-formRaiz-{{id_raiz}}">
		<form style="" action="#" onsubmit="{{onSalvar}}('{{id_raiz}}');return false;" onchange="this.style.boxShadow='2px 2px 5px 0 #009688';" class="form-horizontal" role="form" method="post"   >
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
							<input title="{{{perfis}}}" id="perfil_tema-{{id_raiz}}" type="text" value="{{{perfil}}}" class="form-control" name="perfil">
						</div>
						<div class="col-md-4">
							<select title="{{{perfis}}}" class="form-control" onchange="i3GEOadmin.subgrupos.addInput('perfil_tema-{{id_raiz}}',this.value)">
								{{{opcoesPerfil}}}
							</select>
						</div>
					</div>
				</div>
			</div>
		<div class="pull-right">
				<button type="submit" class="btn btn-primary" role="button" style="color:#008579;">{{salvar}}</button>
		</div>
		</form>

	</div>
</div>
</script>
<script id="templateNos" type="x-tmpl-mustache">
<div class="panel panel-default" data-id="{{id_n2}}" id="formNo-{{id_n2}}">
	<div class="panel-heading icon" role="tab">
		<h3 class="panel-title" {{escondido}}>
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_n2}}')" class="btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons">delete_forever</i>
			</a>
			&nbsp;
			<a class="collapsed in" role="button" data-toggle="collapse" href="#body-formNo-{{id_n2}}"
			aria-expanded="false" aria-controls="#body-formNo-{{id_n2}}"> {{{nome_subgrupo}}}
			<i  class="material-icons move" style="color: gray; display:none;">swap_vert</i>
			</a>
		</h3>
	</div>
	<div class="panel-body panel-collapse collapse" id="body-formNo-{{id_n2}}">
		<form style="" action="#" onsubmit="{{onSalvar}}('{{id_n2}}');return false;" onchange="this.style.boxShadow='2px 2px 5px 0 #009688';" class="form-horizontal" role="form" method="post"   >
			<div class="row">
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="id_subgrupo">{{{nomeTxt}}}</label>
						<div class="col-md-6">
							<select title="{{{nomeTxt}}}" class="form-control" name="id_subgrupo">
								{{{opcoesNo}}}
							</select>
						</div>
						<div class="col-md-2">
							<a onclick="i3GEOadmin.subgrupos.editarListaDeSubGrupos('{{id_n2}}','{{{nome_subgrupo}}}');" href="javascript:void(0)"
							class="btn btn-primary btn-xs" role="button">{{{editarLista}}}</a>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="ordem">{{{ordemTxt}}}</label>
						<div class="col-md-8">
							<input title="{{{ordemTxt}}}" type="text" value="{{{ordem}}}" class="form-control" name="ordem">
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="publicado">{{{publicadoTxt}}}</label>
						<div class="col-md-8">
							<select title="{{{publicadoTxt}}}" name="publicado" class="form-control">
								{{{opcoesPublicado}}}
							</select>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="perfil">{{{perfis}}}</label>
						<div class="col-md-4">
							<input title="{{{perfis}}}" id="perfil_no-{{id_n2}}" type="text" value="{{{n2_perfil}}}" class="form-control" name="n2_perfil">
						</div>
						<div class="col-md-4">
							<select title="{{{perfis}}}" class="form-control" onchange="i3GEOadmin.subgrupos.addInput('perfil_no-{{id_n2}}',this.value)">
								{{{opcoesPerfil}}}
							</select>
						</div>
					</div>
				</div>
			</div>
		<div class="pull-right">
				<button type="submit" class="btn btn-primary" role="button" style="color:#008579;">{{salvar}}</button>
		</div>
		</form>

	</div>
	<div class="panel-footer {{escondido}}" style="padding-top: 0px; padding-bottom: 0px;">
		<div class="pull-right">
			<button style="color:#007a6f;" onclick="i3GEOadmin.subgrupos.editarTemas('{{id_n2}}','{{{nome_subgrupo}}}')" class="btn btn-primary btn-xs" style="margin-top: 2px; margin-bottom: 2px;">
				<i class="material-icons">folder_open</i> {{{editarSub}}}
			</button>
		</div>
		<div class="clearfix"></div>
	</div>
</div>
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
<script type="text/javascript" src="../../../index.js"></script>
<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../../../../dicionario/subgrupos.js"></script>
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
		i3GEOadmin.subgrupos.dicionario = $.extend(
			{},
			i3GEOadmin.subgrupos.dicionario,
			i3GEOadmin.core.dicionario
		);

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.subgrupos.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.subgrupos.dicionario);

		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.subgrupos.dicionario
			)
		);
		$.material.init();
		i3GEOadmin.subgrupos.id_n1 = <?php echo $id_n1; ?>;
		i3GEOadmin.subgrupos.nome_grupo = "<?php echo $nome_grupo; ?>";
		i3GEOadmin.subgrupos.id_menu = <?php echo $id_menu; ?>;
		i3GEOadmin.subgrupos.nome_menu = "<?php echo $nome_menu; ?>";

		var inicia = function() {
			$(".hidden").removeClass('hidden');
			i3GEOadmin.subgrupos.init($("#corpo"),$("#raiz"));
		};
		i3GEO.login.verificaOperacao("admin/html/arvore",i3GEO.configura.locaplic, inicia, "sessao");
	});
</script>
</body>
</html>
