<?php
define ( ONDEI3GEO, "../../../../.." );
include (dirname ( __FILE__ ) . "/../../../../../ms_configura.php");
error_reporting ( 0 );
include "../../../../head.php";
$id_prancha = filter_var($_GET["id_prancha"], FILTER_SANITIZE_NUMBER_INT);
$titulo_prancha = filter_var($_GET["titulo_prancha"], FILTER_SANITIZE_STRING);
$id_atlas = filter_var($_GET["id_atlas"], FILTER_SANITIZE_NUMBER_INT);
?>
<div class="container-fluid">
	<div class="row">
		<ol class="breadcrumb">
			<li><a href="../../../../init/index.php">i3Geo</a></li>
			<li><a href="../../../../index.php">Admin</a></li>
			<li>Cat&aacute;logo</li>
			<li>Atlas</li>
			<li><a href="../index.php?id_atlas=<?php echo $id_atlas; ?>&id_filtro=<?php echo $id_prancha; ?>">Prancha - <?php echo $titulo_prancha; ?></a></li>
			<li class="active">Temas</li>
		</ol>
	</div>
</div>
<div class="container">
	<div class="row center-block">
		<div class="col-md-12">
			<div class="well hidden" id="titulo">
				<h3>{{{txtTituloTema}}}</h3>
				<h4>{{{txtDescTema}}}</h4>
				<!-- aqui entra o filtro -->
				<div class="form-group">
					<label class="control-label">{{{filtro}}}</label>
					<select onchange="i3GEOadmin.core.filtra(this)" id="filtro" class="form-control input-lg">
					</select>
				</div>
				<div class="row pull-right">
					<a onclick="i3GEOadmin.tema.adicionaDialogo();" href="javascript:void(0)" class="btn btn-primary" role="button">{{{adicionar}}}</a>
				</div>
				<div class="clearfix"></div>
			</div>
			<div class="well hidden">
				<div id="corpo">
				</div>
			</div>
		</div>
	</div>
</div>
<script id="templateFiltro" type="x-tmpl-mustache">
<option value="form-{{id_tema}}">{{{codigo_tema}}}</option>
</script>
<script id="templateLista" type="x-tmpl-mustache">
<div class="panel panel-default" id="form-{{id_tema}}">
	<div class="panel-heading" role="tab">
		<h3 class="panel-title">
			<a class="collapsed in" role="button" data-toggle="collapse" href="#body-form-{{id_tema}}"
			aria-expanded="false" aria-controls="#body-form-{{id_tema}}"> {{{codigo_tema}}} </a>
		</h3>
	</div>
	<div class="panel-body panel-collapse collapse" id="body-form-{{id_tema}}">
		<form style="" onchange="this.style.boxShadow='2px 2px 5px 0 #009688';" class="form-horizontal" role="form" method="post" action="" >
			<div class="row">
				<div class="col-md-12 {{esconde}}">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="codigo_tema" >{{{codigoTema}}}</label>
						<div class="col-md-8">
							<select name="codigo_tema" class="form-control">
								{{{opcoesTema}}}
							</select>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="ordem_tema" >{{{ordem}}}</label>
						<div class="col-md-8">
							<input type="text" value="{{{ordem_tema}}}" class="form-control" name="ordem_tema" required>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="ligado_tema" >{{{temaVisivel}}}</label>
						<div class="col-md-8">
							<select name="ligado_tema" class="form-control">
								{{{opcoesLigado}}}
							</select>
						</div>
					</div>
				</div>
			</div>
		</form>
		<div class="pull-right">
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_tema}}')" class="btn btn-danger" role="button">{{excluir}}</a>
			<a href="javascript:void(0)" onclick="{{onSalvar}}('{{id_tema}}','{{{codigo_tema}}}')" class="btn btn-primary" role="button">{{salvar}}</a>
		</div>
	</div>
</div>
</script>
<script id="templateTemas" type="x-tmpl-mustache">
	<option value="{{{codigo_tema}}}">{{{nome_tema}}} - {{{codigo_tema}}}</option>
</script>
<script id="templateOpcoesLigado" type="x-tmpl-mustache">
	<option value="">---</option>
	<option {{SIM-sel}} value="SIM">{{{sim}}}</option>
	<option {{NAO-sel}} value="NAO">{{{nao}}}</option>
</script>
<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../../../../dicionario/prancha.js"></script>
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
		i3GEOadmin.prancha.dicionario.adicionar = i3GEOadmin.core.dicionario.adicionar;
		i3GEOadmin.prancha.dicionario.filtro = i3GEOadmin.core.dicionario.filtro;
		i3GEOadmin.prancha.dicionario.excluir = i3GEOadmin.core.dicionario.excluir;
		i3GEOadmin.prancha.dicionario.salvar = i3GEOadmin.core.dicionario.salva;
		i3GEOadmin.prancha.dicionario.cancelar = i3GEOadmin.core.dicionario.cancelar;
		i3GEOadmin.prancha.dicionario.confirma = i3GEOadmin.core.dicionario.confirma;
		i3GEOadmin.prancha.dicionario.nome = i3GEOadmin.core.dicionario.nome;
		i3GEOadmin.prancha.dicionario.tipo = i3GEOadmin.core.dicionario.tipo;
		i3GEOadmin.prancha.dicionario.descricao = i3GEOadmin.core.dicionario.descricao;
		i3GEOadmin.prancha.dicionario.sim = i3GEOadmin.core.dicionario.sim;
		i3GEOadmin.prancha.dicionario.nao = i3GEOadmin.core.dicionario.nao;

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.prancha.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.prancha.dicionario);

		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.prancha.dicionario
			)
		);
		$.material.init();
		i3GEOadmin.tema.id_prancha = <?php echo $id_prancha; ?>;
		var inicia = function() {
			$(".hidden").removeClass('hidden');
			i3GEOadmin.tema.init($("#corpo"));
		};
		i3GEO.login.verificaOperacao("admin/html/atlas",i3GEO.configura.locaplic, inicia, "sessao");
	});
</script>
</body>
</html>
