<?php
define ( ONDEI3GEO, "../../../.." );
include (dirname ( __FILE__ ) . "/../../../../ms_configura.php");
error_reporting ( 0 );
include "../../../head.php";
$id_sistema = filter_var($_GET["id_sistema"], FILTER_SANITIZE_NUMBER_INT);
$nome_sistema = filter_var($_GET["nome_sistema"], FILTER_SANITIZE_STRING);
?>
<div class="container-fluid migalha">
	<div class="row">
		<div class="btn-group btn-breadcrumb">
			<a class="btn btn-default" href="../../../../init/index.php"><div>i3Geo</div></a>
			<a class="btn btn-default" href="../../../index.php"><div>Admin</div></a>
			<a class="btn btn-default" style="pointer-events: none"><div>Cat&aacute;logo</div></a>
			<a class="btn btn-default" href="../index.php"><div>Sistemas</div></a>
			<a class="btn btn-default" style="pointer-events: none"><div>Fun&ccedil;&otilde;es</div></a>
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
				<span class="pull-right">&nbsp;&nbsp;</span>
				<button data-toggle="modal" data-target="#modalFiltro"
					class="btn btn-primary btn-fab btn-fab-mini pull-right">
					<i class="material-icons">search</i>
				</button>
				<h2><small>{{{txtTituloFuncao}}}</small></h2>
				<h3><small>{{{sistema}}}: <?php echo $nome_sistema; ?></small></h3>
				<blockquote>{{{txtDescFuncao}}}</blockquote>
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
					<a onclick="i3GEOadmin.funcao.adicionaDialogo();" href="javascript:void(0)" class="btn btn-primary" style="color:#008579;" role="button" >{{{adicionar}}}</a>
				</div>
				<div class="clearfix"></div>
				<div id="corpo">
				</div>
			</div>
		</div>
	</div>
</div>
<script id="templateFiltro" type="x-tmpl-mustache">
<option value="form-{{id_funcao}}">{{{nome_funcao}}}</option>
</script>
<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{id_funcao}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_funcao}}');return false;" onchange="this.style.boxShadow='2px 2px 5px 0 #009688';" class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="nome_funcao" >{{{funcao}}}</label>
				<div class="col-md-8">
					<input title="{{{titulo}}}" type="text" value="{{{nome_funcao}}}" class="form-control" name="nome_funcao" required>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="abrir_funcao" >{{{programa}}}</label>
				<div class="col-md-8">
					<input title="{{{programa}}}" type="text" value="{{{abrir_funcao}}}" class="form-control" name="abrir_funcao" >
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="w_funcao" >{{{largura}}}</label>
				<div class="col-md-8">
					<input title="{{{largura}}}" type="text" value="{{{w_funcao}}}" class="form-control" name="w_funcao" >
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="h_funcao" >{{{altura}}}</label>
				<div class="col-md-8">
					<input title="{{{altura}}}" type="text" value="{{{h_funcao}}}" class="form-control" name="h_funcao" >
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-3 control-label" for="perfil_funcao">{{{perfilAjuda}}}</label>
				<div class="col-md-5">
					<input title="{{{perfilAjuda}}}" id="perfil-{{id_funcao}}" type="text" value="{{{perfil_funcao}}}" class="form-control"
					name="perfil_funcao">
				</div>
				<div class="col-md-4">
					<select title="{{{perfilAjuda}}}" class="form-control"
						onchange="i3GEOadmin.funcao.addPerfil('perfil-{{id_funcao}}',this.value)"> {{{opcoesPerfil}}}
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
<div class="list-group-item" id="form-{{id_funcao}}">
	<div class="row-content">
		<h3 class="list-group-item-heading {{escondido}}">
			<span class="pull-right">&nbsp;&nbsp;</span>
			<a href="javascript:void(0)" onclick="{{onEditar}}('{{id_funcao}}')" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
				<i class="material-icons md-18">edit</i>
			</a>
			<span class="pull-right">&nbsp;&nbsp;</span>
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_funcao}}')" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
				<i class="material-icons md-18">delete_forever</i>
			</a>
			&nbsp;{{{nome_funcao}}}
		</h3>
	</div>
	<div class="list-group-separator"></div>
</div>
</script>
<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../../../dicionario/sistemas.js"></script>
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
		i3GEOadmin.funcao.dicionario = $.extend(
			{},
			i3GEOadmin.sistemas.dicionario,
			i3GEOadmin.core.dicionario
		);

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.funcao.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.funcao.dicionario);

		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.funcao.dicionario
			)
		);
		$.material.init();
		i3GEOadmin.funcao.id_sistema = <?php echo $id_sistema; ?>;
		var inicia = function() {
			$(".hidden").removeClass('hidden');
			i3GEOadmin.funcao.init($("#corpo"));
		};
		i3GEO.login.verificaOperacao("admin/html/sistemas",i3GEO.configura.locaplic, inicia, "sessao");
	});
</script>
</body>
</html>
