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
			<li>Usu&aacute;rios</li>
			<li class="active">Opera&ccedil;&otilde;es</li>
		</ol>
	</div>
</div>
<div class="container">
	<div class="row center-block">
		<div class="col-xs-12 col-sm-10">
			<div class="well hidden" id="titulo">
				<button data-toggle="modal" data-target="#ajudaPrincipal"
					class="btn btn-primary btn-fab btn-fab-mini pull-right">
					<i class="material-icons">help</i>
				</button>
				<h3>{{{operacoes}}}</h3>
				<h4>{{{txtAjuda}}}</h4>
				<div class="row pull-right">
					<a data-toggle="modal" data-target="#adicionaOperacao" href="javascript:void(0)" class="btn btn-primary" role="button">{{{adicionar}}}</a>
				</div>
				<div class="clearfix"></div>
				<!--Modal ajuda-->
				<div id="ajudaPrincipal" class="modal fade" tabindex="-1">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-body">
								<p>{{{txtOperacoes}}}</p>
							</div>
						</div>
					</div>
				</div>
				<!--Modal adicao de nova operacao e preenchido na inicializacao-->
				<div id="adicionaOperacao" class="modal fade" tabindex="-1">
					<div class="modal-dialog modal-lg">
						<div class="modal-content">
							<div class="modal-body modal-lg"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="well hidden">
				<div id="corpo">
					<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i> <span class="sr-only">Loading...</span>
				</div>
			</div>
		</div>
		<!-- lateral-->
		<div class="col-sm-2 hidden-xs">
			<nav class="bs-docs-sidebar affix-top" style="" id="indiceSpy">
				<ul class="nav nav-pills nav-stacked" role="tablist">

					<li><a onclick="$('.panel').show();" href="#">Links <i class="material-icons">visibility</i></a></li>
				</ul>
				<ul class="nav nav-pills nav-stacked" role="tablist" id="indice">
				</ul>
			</nav>
		</div>

	</div>
</div>
<script id="indiceTpl" type="x-tmpl-mustache">
<li><a onclick="$('.panel').hide();$('#form-{{id_operacao}}').show();" href="#">{{{codigo}}}</a></li>
</script>
<script id="templateOperacoes" type="x-tmpl-mustache">
<div class="panel panel-default" id="form-{{id_operacao}}">
	<div class="panel-body">
		<form class="form" role="form" method="post" action="" >
			<div class="row">
				<div class="col-md-8">
					<h4>{{{operacao}}}</h4>
					<div class="form-group form-group-lg">
						<label class="col-md-2 control-label" for="codigo">{{{labelCodigo}}}</label>
						<div class="col-md-10">
							<input type="text" value="{{{codigo}}}" class="form-control" name="codigo" required>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-2 control-label" for="descricao">{{{labelDescricao}}}</label>
						<div class="col-md-10">
							<input type="text" value="{{{descricao}}}" class="form-control" name="descricao" required>
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<h4>{{{papeisv}}}</h4>
					<div class="form-group form-group-lg">{{{inputPapeis}}}</div>
				</div>
			</div>
		</form>
		<div class="pull-right">
			<a href="javascript:void(0)" class="btn btn-danger" role="button">Excluir</a>
			<a href="javascript:void(0)" class="btn btn-primary" role="button">salvar</a>
		</div>
	</div>

</div>
</script>
<script id="templateInputPapeis" type="x-tmpl-mustache">
	<div class="checkbox">
		<label>
			<input type="checkbox" {{checked}} name="id_papel-{{{id_papel}}}" /> <abbr title="{{{descricao}}}">{{{nome}}}</abbr>
		</label>
	</div>
</script>
<script type="text/javascript" src="../../dicionario/operacoes.js"></script>
<script type="text/javascript" src="index.js"></script>
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
		i3GEOadmin.operacoes.dicionario.adicionar = i3GEOadmin.core.dicionario.adicionar;
		t.html(
			Mustache.to_html(
				t.html(),
				i3GEO.idioma.objetoIdioma(i3GEOadmin.operacoes.dicionario)
			)
		);
		$.material.init();
		var inicia = function() {
			$(".hidden").removeClass('hidden');
			init();
		};
		i3GEO.login.verificaOperacao("admin/html/operacoes",i3GEO.configura.locaplic, inicia, "sessao");
	});
	</script>
</body>
</html>
