<?php
define ( ONDEI3GEO, "../../../.." );
include (dirname ( __FILE__ ) . "/../../../../ms_configura.php");
error_reporting ( 0 );
include "../../../head.php";
$id_menu = filter_var ( $_GET ["id_menu"], FILTER_SANITIZE_NUMBER_INT );
$nome_menu = filter_var ( $_GET ["nome_menu"], FILTER_SANITIZE_STRING );
?>
<div class="container-fluid">
	<div class="row">
		<ol class="breadcrumb">
			<li><a href="../../../init/index.php">i3Geo</a></li>
			<li><a href="../../../index.php">Admin</a></li>
			<li>Cat&aacute;logo</li>
			<li><a href="../index.php">Menus</a></li>
			<li><a href="../index.php?id_filtro=<?php echo $id_menu; ?>">Menu - <?php echo $nome_menu; ?></a></li>
			<li class="active">Grupos</li>
		</ol>
	</div>
</div>
<div class="container" id="titulo">
	<div class="row center-block">
		<div class="col-md-12">
			<div class="well hidden">
				<button data-toggle="modal" data-target="#ajudaPrincipal"
					class="btn btn-primary btn-fab btn-fab-mini pull-right">
					<i class="material-icons">help</i>
				</button>
				<h2><small>{{{menu}}}: <?php echo $nome_menu; ?></small></h2>
				<blockquote>{{{txtDesc}}}</blockquote>

				<!-- aqui entra o filtro -->
				<div class="form-group">
					<label class="control-label">{{{filtro}}}</label> <select
						onchange="i3GEOadmin.core.filtra(this)" id="filtro" class="form-control input-lg">
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
				<h3 class="panel-heading">
					<a class="collapsed in" role="button" data-toggle="collapse" href="#raiz" aria-expanded="false"
						aria-controls="#raiz">{{{temasRaizMenu}}}</a>
				</h3>
				<div class="clearfix"></div>
				<div class="row pull-right">
					<a onclick="i3GEOadmin.grupos.adicionaTemaDialogo();" href="javascript:void(0)"
						class="btn btn-primary" role="button">{{{adicionarTema}}}</a>
				</div>
				<div class="clearfix"></div>
				<div id="raiz" class="panel-body panel-collapse collapse"></div>

			</div>
			<!-- nos -->
			<div class="well hidden">
				<h3 class="panel-heading">
					<a class="in" role="button" data-toggle="collapse" href="#corpo" aria-expanded="false"
						aria-controls="#raiz">{{{grupos}}}</a>
				</h3>
				<div class="clearfix"></div>
				<div class="row pull-right">
					<a onclick="i3GEOadmin.grupos.adicionaNoDialogo();" href="javascript:void(0)"
						class="btn btn-primary" role="button">{{{adicionarGrupo}}}</a>
				</div>
				<div class="clearfix"></div>
				<div id="corpo" class="panel-body panel-collapse in"></div>

			</div>
		</div>
	</div>
</div>
<script id="templateFiltro" type="x-tmpl-mustache">
<option value="formNo-{{id_n1}}">{{{nome_grupo}}}</option>
</script>
<script id="templateRaiz" type="x-tmpl-mustache">
<div class="panel panel-default" id="formRaiz-{{id_raiz}}">
	<div class="panel-heading" role="tab">
		<h3 class="panel-title" {{escondido}}>
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_raiz}}')" class="btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons">delete_forever</i>
			</a>
			&nbsp;
			<a class="collapsed in" role="button" data-toggle="collapse" href="#body-formRaiz-{{id_raiz}}"
			aria-expanded="false" aria-controls="#body-formRaiz-{{id_raiz}}"> {{{nome_tema}}} </a>
		</h3>
	</div>
	<div class="panel-body panel-collapse collapse" id="body-formRaiz-{{id_raiz}}">
		<form style="" onchange="this.style.boxShadow='2px 2px 5px 0 #009688';" class="form-horizontal" role="form" method="post" action="" >
			<div class="row">
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="id_tema">{{{tema}}}</label>
						<div class="col-md-8">
							<select class="form-control" name="id_tema">
								{{{opcoesTema}}}
							</select>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="ordem">{{{ordemTxt}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{ordem}}}" class="form-control" name="ordem">
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="perfil">{{{perfis}}}</label>
						<div class="col-md-4">
							<input id="perfil_tema-{{id_raiz}}" type="text" value="{{{perfil}}}" class="form-control" name="perfil">
						</div>
						<div class="col-md-4">
							<select class="form-control" onchange="i3GEOadmin.grupos.addInput('perfil_tema-{{id_raiz}}',this.value)">
								{{{opcoesPerfil}}}
							</select>
						</div>
					</div>
				</div>
			</div>
		</form>
		<div class="pull-right">
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_raiz}}')" class="btn btn-danger" role="button">{{excluir}}</a>
			<a href="javascript:void(0)" onclick="{{onSalvar}}('{{id_raiz}}')" class="btn btn-primary" role="button">{{salvar}}</a>
		</div>
	</div>
</div>
</script>
<script id="templateNos" type="x-tmpl-mustache">
<div class="panel panel-default" id="formNo-{{id_n1}}">
	<div class="panel-heading" role="tab">
		<h3 class="panel-title" {{escondido}}>
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_n1}}')" class="btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons">delete_forever</i>
			</a>
			&nbsp;
			<a class="collapsed in" role="button" data-toggle="collapse" href="#body-formNo-{{id_n1}}"
			aria-expanded="false" aria-controls="#body-formNo-{{id_n1}}"> {{{nome_grupo}}} </a>
		</h3>
	</div>
	<div class="panel-body panel-collapse collapse" id="body-formNo-{{id_n1}}">
		<form style="" onchange="this.style.boxShadow='2px 2px 5px 0 #009688';" class="form-horizontal" role="form" method="post" action="" >
			<div class="row">
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="id_grupo">{{{nomeTxt}}}</label>
						<div class="col-md-8">
							<select class="form-control" name="id_grupo">
								{{{opcoesNo}}}
							</select>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="ordem">{{{ordemTxt}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{ordem}}}" class="form-control" name="ordem">
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="publicado">{{{publicadoTxt}}}</label>
						<div class="col-md-8">
							<select name="publicado" class="form-control">
								{{{opcoesPublicado}}}
							</select>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="perfil">{{{perfis}}}</label>
						<div class="col-md-4">
							<input id="perfil_no-{{id_n1}}" type="text" value="{{{perfil}}}" class="form-control" name="perfil">
						</div>
						<div class="col-md-4">
							<select class="form-control" onchange="i3GEOadmin.grupos.addInput('perfil_no-{{id_n1}}',this.value)">
								{{{opcoesPerfil}}}
							</select>
						</div>
					</div>
				</div>
			</div>
		</form>
		<div class="pull-right">
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_n1}}')" class="btn btn-danger" role="button">{{excluir}}</a>
			<a href="javascript:void(0)" onclick="{{onSalvar}}('{{id_n1}}')" class="btn btn-primary" role="button">{{salvar}}</a>
		</div>
	</div>
	<div class="panel-footer {{escondido}}" style="padding-top: 0px; padding-bottom: 0px;">
		<div class="pull-right">
			<button onclick="i3GEOadmin.grupos.editarSubGrupos('{{id_n1}}','{{{nome_grupo}}}')" class="btn btn-primary btn-xs" style="margin-top: 2px; margin-bottom: 2px;">
				<i class="material-icons">folder_open</i> {{{editarSubgrupos}}}
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
	<option {{{selected}}} value="{{{id_grupo}}}">{{{nome_grupo}}}</option>
</script>
<script id="templateOpcoesTema" type="x-tmpl-mustache">
	<option {{{selected}}} value="{{{id_tema}}}">{{{nome_tema}}} - {{{codigo_tema}}}</option>
</script>
<script id="templateOpcoesPerfil" type="x-tmpl-mustache">
	<option value="{{{perfil}}}">{{{perfil}}}</option>
</script>
<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../../../dicionario/grupos.js"></script>
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
		i3GEOadmin.grupos.dicionario = $.extend(
			{},
			i3GEOadmin.grupos.dicionario,
			i3GEOadmin.core.dicionario
		);

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.grupos.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.grupos.dicionario);

		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.grupos.dicionario
			)
		);
		$.material.init();
		i3GEOadmin.grupos.id_menu = <?php echo $id_menu; ?>;
		i3GEOadmin.grupos.nome_menu = "<?php echo $nome_menu; ?>";
		var inicia = function() {
			$(".hidden").removeClass('hidden');
			i3GEOadmin.grupos.init($("#corpo"),$("#raiz"));
		};
		i3GEO.login.verificaOperacao("admin/html/arvore",i3GEO.configura.locaplic, inicia, "sessao");
	});
</script>
</body>
</html>
