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
				<h3>{{{txtTitulo}}}</h3>
				<h3><?php echo $nome_menu; ?></h3>
				<!--<h4>{{{txtDesc}}}</h4>-->
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
				<h3>{{{temasRaizMenu}}}</h3>
				<div id="raiz"></div>
				<div class="row pull-right">
					<a onclick="i3GEOadmin.grupos.adicionaTemaDialogo();" href="javascript:void(0)"
						class="btn btn-primary" role="button">{{{adicionarTema}}}</a>
				</div>
				<div class="clearfix"></div>
			</div>
			<!-- nos -->
			<div class="well hidden">
				<h3>{{{grupos}}}</h3>
				<div id="corpo"></div>
				<div class="row pull-right">
					<a onclick="i3GEOadmin.grupos.adicionaDialogo();" href="javascript:void(0)"
						class="btn btn-primary" role="button">{{{adicionarGrupo}}}</a>
				</div>
				<div class="clearfix"></div>
			</div>
		</div>
	</div>
</div>
<script id="templateFiltro" type="x-tmpl-mustache">
<option value="form-{{id_grupos}}">{{{titulo_grupos}}}</option>
</script>
<script id="templateRaiz" type="x-tmpl-mustache">
<div class="panel panel-default" id="formRaiz-{{id_raiz}}">
	<div class="panel-heading {{escondido}}" role="tab">
		<h3 class="panel-title">
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
						<label class="col-md-4 control-label" for="codigo_tema">{{{tema}}}</label>
						<div class="col-md-8">
							<select class="form-control" name="codigo_tema">
								{{{opcoesTema}}}
							</select>
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
<script id="templateOpcoesTema" type="x-tmpl-mustache">
	<option {{{selected}}} value="{{{codigo_tema}}}">{{{nome_tema}}} - {{{codigo_tema}}}</option>
</script>
<script id="templateOpcoesPerfil" type="x-tmpl-mustache">
	<option value="{{{perfil}}}">{{{perfil}}}</option>
</script>
<script id="templateLista" type="x-tmpl-mustache">
<div class="panel panel-default" id="form-{{id_grupos}}">
	<div class="panel-heading" role="tab">
		<h3 class="panel-title">
			<a class="collapsed in" role="button" data-toggle="collapse" href="#body-form-{{id_grupos}}"
			aria-expanded="false" aria-controls="#body-form-{{id_grupos}}"> {{{titulo_grupos}}} </a>
		</h3>
	</div>
	<div class="panel-body panel-collapse collapse" id="body-form-{{id_grupos}}">
		<form style="" onchange="this.style.boxShadow='2px 2px 5px 0 #009688';" class="form-horizontal" role="form" method="post" action="" >
			<div class="row">
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="titulo_grupos" >{{{titulo}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{titulo_grupos}}}" class="form-control" name="titulo_grupos" required>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="desc_grupos" >{{{descricao}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{desc_grupos}}}" class="form-control" name="desc_grupos" required>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="link_grupos" >{{{linkTxt}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{link_grupos}}}" class="form-control" name="link_grupos" required>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="ordem_grupos" >{{{ordem}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{ordem_grupos}}}" class="form-control" name="ordem_grupos" required>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="h_grupos" >{{{altura}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{h_grupos}}}" class="form-control" name="h_grupos" required>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="w_grupos" >{{{largura}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{w_grupos}}}" class="form-control" name="w_grupos" required>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="icone_grupos" >{{{icone}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{icone_grupos}}}" class="form-control" name="icone_grupos" required>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="mapext_grupos" >{{{extGeo}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{mapext_grupos}}}" class="form-control" name="mapext_grupos" required>
						</div>
					</div>
				</div>

			</div>
		</form>
		<div class="pull-right">
			<a href="javascript:void(0)" onclick="i3GEOadmin.grupos.editarTemas('{{id_menu}}','{{id_grupos}}','{{{titulo_grupos}}}')" class="btn btn-default" role="button">{{{editarTema}}}</a>
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_grupos}}')" class="btn btn-danger" role="button">{{excluir}}</a>
			<a href="javascript:void(0)" onclick="{{onSalvar}}('{{id_grupos}}')" class="btn btn-primary" role="button">{{salvar}}</a>
		</div>
	</div>
</div>
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
		i3GEOadmin.grupos.dicionario.adicionar = i3GEOadmin.core.dicionario.adicionar;
		i3GEOadmin.grupos.dicionario.filtro = i3GEOadmin.core.dicionario.filtro;
		i3GEOadmin.grupos.dicionario.excluir = i3GEOadmin.core.dicionario.excluir;
		i3GEOadmin.grupos.dicionario.salvar = i3GEOadmin.core.dicionario.salva;
		i3GEOadmin.grupos.dicionario.cancelar = i3GEOadmin.core.dicionario.cancelar;
		i3GEOadmin.grupos.dicionario.confirma = i3GEOadmin.core.dicionario.confirma;
		i3GEOadmin.grupos.dicionario.nome = i3GEOadmin.core.dicionario.nome;
		i3GEOadmin.grupos.dicionario.tipo = i3GEOadmin.core.dicionario.tipo;
		i3GEOadmin.grupos.dicionario.descricao = i3GEOadmin.core.dicionario.descricao;
		i3GEOadmin.grupos.dicionario.sim = i3GEOadmin.core.dicionario.sim;
		i3GEOadmin.grupos.dicionario.nao = i3GEOadmin.core.dicionario.nao;
		i3GEOadmin.grupos.dicionario.grupo = i3GEOadmin.core.dicionario.grupo;
		i3GEOadmin.grupos.dicionario.grupos = i3GEOadmin.core.dicionario.grupos;
		i3GEOadmin.grupos.dicionario.adicionarTema = i3GEOadmin.core.dicionario.adicionarTema;
		i3GEOadmin.grupos.dicionario.tema = i3GEOadmin.core.dicionario.tema;

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
		var inicia = function() {
			$(".hidden").removeClass('hidden');
			i3GEOadmin.grupos.init($("#corpo"),$("#raiz"));
		};
		i3GEO.login.verificaOperacao("admin/html/arvore",i3GEO.configura.locaplic, inicia, "sessao");
	});
</script>
</body>
</html>
