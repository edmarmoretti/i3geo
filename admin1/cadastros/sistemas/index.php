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
			<a class="btn btn-default" style="pointer-events: none"><div>Cat&aacute;logo</div></a>
			<a class="btn btn-default" style="pointer-events: none"><div>Sistemas</div></a>
		</div>
	</div>
</div>
<div class="container">
	<div class="row center-block">
		<div class="col-md-12" id="titulo">
			<div class="well hidden" >
				<h2><small>{{{txtTitulo}}}</small></h2>
				<blockquote>{{{txtDesc}}}</blockquote>
				<!-- aqui entra o filtro -->
				<div class="form-group">
					<select title="{{{filtro}}}" onchange="i3GEOadmin.core.filtra(this)" id="filtro" class="form-control input-lg">
					</select>
				</div>

				<div class="clearfix"></div>
			</div>
			<div class="well hidden">
				<div class="row pull-right">
					<a onclick="i3GEOadmin.sistemas.adicionaDialogo();" href="javascript:void(0)" class="btn btn-primary" style="color:#008579;" role="button">{{{adicionar}}}</a>
				</div>
				<div class="clearfix"></div>
				<div id="corpo">
				</div>
			</div>
		</div>
	</div>
</div>
<script id="templateFiltro" type="x-tmpl-mustache">
<option value="form-{{id_sistema}}">{{{nome_sistema}}}</option>
</script>
<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{id_sistema}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_sistema}}');return false;" onchange="this.style.boxShadow='2px 2px 5px 0 #009688';" class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="nome_sistema" >{{{sistema}}}</label>
				<div class="col-md-8">
					<input title="{{{nome_sistema}}}" type="text" value="{{{nome_sistema}}}" class="form-control" name="nome_sistema" required>
				</div>
			</div>

			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="publicado_sistema">{{{publicado}}}</label>
				<div class="col-md-8">
					<select title="{{{publicado}}}" name="publicado_sistema" class="form-control">
						{{{opcoesPublicado}}}
					</select>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-3 control-label" for="perfil_sistema">{{{perfilAjuda}}}</label>
				<div class="col-md-5">
					<input title="{{{perfilAjuda}}}" id="perfil-{{id_sistema}}" type="text" value="{{{perfil_sistema}}}" class="form-control"
					name="perfil_sistema">
				</div>
				<div class="col-md-4">
					<select title="{{{perfilAjuda}}}" class="form-control"
						onchange="i3GEOadmin.sistemas.addPerfil('perfil-{{id_sistema}}',this.value)"> {{{opcoesPerfil}}}
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
<div class="list-group-item" id="form-{{id_sistema}}">
	<div class="row-content">
		<h3 class="list-group-item-heading {{escondido}}">
			<div class="pull-right">
			<a role="button" class="btn btn-danger btn-fab btn-fab-mini pull-left" onclick="i3GEOadmin.sistemas.editarFuncoes('{{id_sistema}}','{{{nome_sistema}}}')" href="javascript:void(0)">
				<i class="material-icons md-18">folder_open</i>
			</a>
  			<label class=pull-right><h6 style="margin-top: 5px; margin-bottom: 5px;">&nbsp;{{{funcoes}}}</h6></label>
			</div>
			<span class="pull-right">&nbsp;&nbsp;</span>
			<a href="javascript:void(0)" onclick="{{onEditar}}('{{id_sistema}}')" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
				<i class="material-icons md-18">edit</i>
			</a>
			<span class="pull-right">&nbsp;&nbsp;</span>
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_sistema}}')" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
				<i class="material-icons md-18">delete_forever</i>
			</a>
			{{{nome_sistema}}}
		</h3>
	</div>
	<div class="list-group-separator"></div>
</div>
</script>
<script id="templateOpcoesPerfil" type="x-tmpl-mustache">
	<option value="{{{perfil}}}">{{{perfil}}}</option>
</script>
<script id="templateOpcoesPublicado" type="x-tmpl-mustache">
	<option value="">---</option>
	<option {{SIM-sel}} value="SIM">{{{sim}}}</option>
	<option {{NAO-sel}} value="NAO">{{{nao}}}</option>
</script>
<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../../dicionario/sistemas.js"></script>
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
		i3GEOadmin.sistemas.dicionario = $.extend(
			{},
			i3GEOadmin.sistemas.dicionario,
			i3GEOadmin.core.dicionario
		);

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.sistemas.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.sistemas.dicionario);

		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.sistemas.dicionario
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
			i3GEOadmin.sistemas.init($("#corpo"));
		};
		i3GEO.login.verificaOperacao("admin/html/sistemas",i3GEO.configura.locaplic, inicia, "sessao");
	});
</script>
</body>
</html>
