<?php
define ( ONDEI3GEO, "../../../.." );
include (dirname ( __FILE__ ) . "/../../../../ms_configura.php");
error_reporting ( 0 );
include "../../../head.php";
$id_atlas = filter_var($_GET["id_atlas"], FILTER_SANITIZE_NUMBER_INT);
$titulo_atlas = filter_var($_GET["titulo_atlas"], FILTER_SANITIZE_STRING);
?>
<div class="container-fluid">
	<div class="row">
		<ol class="breadcrumb">
			<li><a href="../../../init/index.php">i3Geo</a></li>
			<li><a href="../../../index.php">Admin</a></li>
			<li>Cat&aacute;logo</li>
			<li><a href="../index.php?id_filtro=<?php echo $id_atlas; ?>">Atlas - <?php echo $titulo_atlas; ?></a></li>
			<li class="active">Pranchas</li>
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
				<h2><small>{{{txtTitulo}}}</small></h2>
				<!--<blockquote>{{{txtDesc}}}</blockquote>-->
				<!-- aqui entra o filtro -->
				<div class="form-group">
					<label class="control-label">{{{filtro}}}</label>
					<select title="{{{filtro}}}" onchange="i3GEOadmin.core.filtra(this)" id="filtro" class="form-control input-lg">
					</select>
				</div>
				<div class="row pull-right">
					<a onclick="i3GEOadmin.prancha.adicionaDialogo();" href="javascript:void(0)" class="btn btn-primary" style="color:#008579;" role="button">{{{adicionar}}}</a>
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
<option value="form-{{id_prancha}}">{{{titulo_prancha}}}</option>
</script>
<script id="templateLista" type="x-tmpl-mustache">
<div class="panel panel-default" id="form-{{id_prancha}}">
	<div class="panel-heading" role="tab">
		<h3 class="panel-title {{escondido}}">
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_prancha}}')" class="btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons">delete_forever</i>
			</a>
			&nbsp;
			<a class="collapsed in" role="button" data-toggle="collapse" href="#body-form-{{id_prancha}}"
			aria-expanded="false" aria-controls="#body-form-{{id_prancha}}"> {{{titulo_prancha}}} </a>
		</h3>
	</div>
	<div class="panel-body panel-collapse collapse" id="body-form-{{id_prancha}}">
		<form style="" action="#" onsubmit="{{onSalvar}}('{{id_prancha}}');return false;" onchange="this.style.boxShadow='2px 2px 5px 0 #009688';" class="form-horizontal" role="form" method="post"   >
			<div class="row">
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="titulo_prancha" >{{{titulo}}}</label>
						<div class="col-md-8">
							<input title="{{{titulo}}}" type="text" value="{{{titulo_prancha}}}" class="form-control" name="titulo_prancha" required>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="desc_prancha" >{{{descricao}}}</label>
						<div class="col-md-8">
							<input title="{{{descricao}}}" type="text" value="{{{desc_prancha}}}" class="form-control" name="desc_prancha" required>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="link_prancha" >{{{linkTxt}}}</label>
						<div class="col-md-8">
							<input title="{{{linkTxt}}}" type="text" value="{{{link_prancha}}}" class="form-control" name="link_prancha" required>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="ordem_prancha" >{{{ordem}}}</label>
						<div class="col-md-8">
							<input title="{{{ordem}}}" type="text" value="{{{ordem_prancha}}}" class="form-control" name="ordem_prancha" required>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="h_prancha" >{{{altura}}}</label>
						<div class="col-md-8">
							<input title="{{{altura}}}" type="text" value="{{{h_prancha}}}" class="form-control" name="h_prancha" required>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="w_prancha" >{{{largura}}}</label>
						<div class="col-md-8">
							<input title="{{{largura}}}" type="text" value="{{{w_prancha}}}" class="form-control" name="w_prancha" required>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="icone_prancha" >{{{icone}}}</label>
						<div class="col-md-8">
							<input title="{{{icone}}}" type="text" value="{{{icone_prancha}}}" class="form-control" name="icone_prancha" required>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-4 control-label" for="mapext_prancha" >{{{extGeo}}}</label>
						<div class="col-md-8">
							<input title="{{{extGeo}}}" type="text" value="{{{mapext_prancha}}}" class="form-control" name="mapext_prancha" required>
						</div>
					</div>
				</div>
			</div>
		<div class="pull-right">
			<button type="submit" class="btn btn-primary" role="button" style="color:#008579;">{{salvar}}</button>
		</div>
		</form>
	</div>
	<div class="panel-footer" style="padding-top: 0px; padding-bottom: 0px;">
		<div class="pull-right">
			<button  style="color:#007a6f;" onclick="i3GEOadmin.prancha.editarTemas('{{id_atlas}}','{{id_prancha}}','{{{titulo_prancha}}}')" class="btn btn-primary btn-xs" style="margin-top: 2px; margin-bottom: 2px;">
				<i class="material-icons">folder_open</i> {{{editarTema}}}
			</button>
		</div>
		<div class="clearfix"></div>
	</div>
</div>
</script>
<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../../../dicionario/prancha.js"></script>
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
		i3GEOadmin.prancha.id_atlas = <?php echo $id_atlas; ?>;
		var inicia = function() {
			$(".hidden").removeClass('hidden');
			i3GEOadmin.prancha.init($("#corpo"));
		};
		i3GEO.login.verificaOperacao("admin/html/prancha",i3GEO.configura.locaplic, inicia, "sessao");
	});
</script>
</body>
</html>
