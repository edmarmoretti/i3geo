<?php
define ( ONDEI3GEO, "../../../../.." );
include (dirname ( __FILE__ ) . "/../../../../../ms_configura.php");
error_reporting ( 0 );
include "../../../../head.php";
$id_prancha = filter_var($_GET["id_prancha"], FILTER_SANITIZE_NUMBER_INT);
$titulo_prancha = filter_var($_GET["titulo_prancha"], FILTER_SANITIZE_STRING);
$id_atlas = filter_var($_GET["id_atlas"], FILTER_SANITIZE_NUMBER_INT);
?>
<div class="container-fluid migalha">
	<div class="row">
		<div class="btn-group btn-breadcrumb">
			<a class="btn btn-default" href="../../../../../init/index.php"><div>i3Geo</div></a>
			<a class="btn btn-default" href="../../../../index.php"><div>Admin</div></a>
			<a class="btn btn-default" style="pointer-events: none"><div>Cat&aacute;logo</div></a>
			<a class="btn btn-default" href="../../index.php"><div>Atlas</div></a>
			<a class="btn btn-default" href="../index.php?id_atlas=<?php echo $id_atlas; ?>&id_filtro=<?php echo $id_prancha; ?>"><div>Pranchas</div></a>
			<a class="btn btn-default" style="pointer-events: none"><div>Temas</div></a>
		</div>
	</div>
</div>
<div class="container">
	<div class="row center-block">
		<div class="col-md-12" id="titulo">
			<div class="well hidden" >
				<h2>{{{txtTituloTema}}}</h2>
				<h3><small>Prancha: <?php echo $titulo_prancha; ?></small></h3>
				<blockquote>{{{txtDescTema}}}</blockquote>
				<!-- aqui entra o filtro -->
				<div class="form-group">
					<select title="{{{filtro}}}" onchange="i3GEOadmin.core.filtra(this)" id="filtro" class="form-control input-lg">
					</select>
				</div>
				<div class="clearfix"></div>
			</div>
			<div class="well hidden">
				<div class="row pull-right">
					<a onclick="i3GEOadmin.tema.adicionaDialogo();" href="javascript:void(0)" class="btn btn-primary" style="color:#008579;" role="button">{{{adicionar}}}</a>
				</div>
				<div class="clearfix"></div>
				<div id="corpo">
				</div>
			</div>
		</div>
	</div>
</div>
<script id="templateFiltro" type="x-tmpl-mustache">
<option value="form-{{id_tema}}">{{{codigo_tema}}}</option>
</script>
<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{id_tema}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_tema}}','{{{codigo_tema}}}');return false;" onchange="this.style.boxShadow='2px 2px 5px 0 #009688';" class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="codigo_tema" >{{{codigoTema}}}</label>
				<div class="col-md-8">
					<select title="{{{codigoTema}}}" name="codigo_tema" class="form-control">
						{{{opcoesTema}}}
					</select>
				</div>
			</div>
		</div>
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="ordem_tema" >{{{ordem}}}</label>
				<div class="col-md-8">
					<input title="{{{ordem}}}" type="text" value="{{{ordem_tema}}}" class="form-control" name="ordem_tema" >
				</div>
			</div>
		</div>
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="ligado_tema" >{{{temaVisivel}}}</label>
				<div class="col-md-8">
					<select title="{{{temaVisivel}}}" name="ligado_tema" class="form-control">
						{{{opcoesLigado}}}
					</select>
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
<div class="list-group-item" id="form-{{id_tema}}">
	<div class="row-content">
		<h3 class="list-group-item-heading {{escondido}}">
			{{{codigo_tema}}}

			<span class="pull-right">&nbsp;&nbsp;</span>
			<a href="javascript:void(0)" onclick="{{onEditar}}('{{id_tema}}','{{codigo_tema}}')" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
				<i class="material-icons md-18">edit</i>
			</a>
			<span class="pull-right">&nbsp;&nbsp;</span>
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_tema}}')" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
				<i class="material-icons md-18">delete_forever</i>
			</a>
		</h3>
	</div>
	<div class="list-group-separator"></div>
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
		i3GEOadmin.prancha.dicionario = $.extend(
			{},
			i3GEOadmin.prancha.dicionario,
			i3GEOadmin.core.dicionario
		);

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
