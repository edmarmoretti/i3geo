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
			<a class="btn btn-default" style="pointer-events: none"><div>Cadastros</div></a>
			<a class="btn btn-default" style="pointer-events: none"><div>Identifica</div></a>
		</div>
	</div>
</div>

<div class="container">
	<div class="row center-block">
		<div class="col-md-12" id="titulo">
			<div class="well hidden" >
				<button data-toggle="modal" data-target="#modalFiltro"
					class="btn btn-primary btn-fab btn-fab-mini pull-right">
					<i class="material-icons">search</i>
				</button>
				<h2><small>{{{txtTitulo}}}</small></h2>
				<blockquote>{{{txtDesc}}}</blockquote>
				<div class="clearfix"></div>
			</div>
			<div class="well hidden">
				<div class="panel-heading">
					<p class="lead" style="margin:0px;">&nbsp;
						<a title="{{{adicionar}}}" onclick="i3GEOadmin.identifica.adicionaDialogo();" href="javascript:void(0)"
							class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button" ><i class="material-icons ">add</i>
						</a>
					</p>
				</div>
				<div class="clearfix"></div>
				<div id="corpo">
				</div>
			</div>
		</div>
	</div>
</div>
<script id="templateFiltro" type="x-tmpl-mustache">
<option value="form-{{id_i}}">{{{nome_i}}}</option>
</script>
<script id="templateFormLista" type="x-tmpl-mustache">
		<form id="form-edicao-{{id_i}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_i}}');return false;" onchange="this.style.boxShadow='2px 2px 5px 0 #009688';" class="form-horizontal" role="form" method="post"   >
			<div class="row">
				<div class="col-md-12">
					<h4>{{{nome_i}}}</h4>
					<div class="form-group form-group-lg">
						<label class="col-md-2 control-label" for="nome_i" >{{{nome}}}</label>
						<div class="col-md-10">
							<input title="{{{nome}}}" type="text" value="{{{nome_i}}}" class="form-control" name="nome_i" required>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-2 control-label" for="login">{{{programa}}}</label>
						<div class="col-md-10">
							<input title="{{{programa}}}" type="text" value="{{{abrir_i}}}" class="form-control" name="abrir_i" >
							<p>{{{programaDesc}}}</p>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-2 control-label" for="target_i">{{{abreComo}}}</label>
						<div class="col-md-10">
							<select title="{{{abreComo}}}" class="form-control" name="target_i">
								{{{opcoesTarget}}}
							</select>

						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-2 control-label" for="publicado_i">{{{publicado}}}?</label>
						<div class="col-md-10">
							<select title="{{{publicado}}}" class="form-control" name="publicado_i" required >
								{{{opcoesPublicado}}}
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
<div class="list-group-item" id="form-{{id_i}}">
	<div class="row-content">
		<h4 class="list-group-item-heading {{escondido}}">
			<a href="javascript:void(0)" onclick="{{onEditar}}('{{id_i}}')" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
				<i class="material-icons md-18">edit</i>
			</a>
			<span class="pull-right">&nbsp;&nbsp;</span>
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_i}}')" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
				<i class="material-icons md-18">delete_forever</i>
			</a>
			&nbsp;{{{nome_i}}}
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
</script>

<script id="templateOpcoesPublicado" type="x-tmpl-mustache">
	<option value="">---</option>
	<option value="SIM" {{SIM-sel}} >{{{sim}}}</option>
	<option value="NAO" {{NAO-sel}} >{{{nao}}}</option>
</script>
<script id="templateOpcoesTarget" type="x-tmpl-mustache">
	<option value="">---</option>
	<option value="target" {{target-sel}} >{{{externo}}}</option>
	<option value="self" {{self-sel}} >{{{mapa}}}</option>
</script>
<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../../dicionario/identifica.js"></script>
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
		i3GEOadmin.identifica.dicionario = $.extend(
			{},
			i3GEOadmin.identifica.dicionario,
			i3GEOadmin.core.dicionario
		);

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.identifica.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.identifica.dicionario);

		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.identifica.dicionario
			)
		);
		$.material.init();
		var inicia = function() {
			$(".hidden").removeClass('hidden');
			i3GEOadmin.identifica.init($("#corpo"));
		};
		i3GEO.login.verificaOperacao("admin/html/identifica",i3GEO.configura.locaplic, inicia, "sessao");
	});
</script>
</body>
</html>
