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
			<li class="active">Cadastro</li>
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
				<h3>{{{usuarios}}}</h3>
				<h4>{{{txtAjuda}}}</h4>
				<!-- aqui entra o filtro -->
				<div class="form-group">
					<label class="control-label">{{{filtro}}}</label>
					<select onchange="i3GEOadmin.usuarios.filtra(this)" id="filtro" class="form-control input-lg">
					</select>
				</div>
				<div class="row pull-right">
					<a onclick="i3GEOadmin.usuarios.adicionaUsuarioDialogo();" href="javascript:void(0)" class="btn btn-primary" role="button">{{{adicionar}}}</a>
				</div>
				<div class="clearfix"></div>
				<!--Modal ajuda-->
				<div id="ajudaPrincipal" class="modal fade" tabindex="-1">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-body">
								<p>{{{txtUsuarios}}}</p>
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
<option value="form-{{id_usuario}}">{{{nome_usuario}}}</option>
</script>
<script id="templateUsuarios" type="x-tmpl-mustache">
<div class="panel panel-default" id="form-{{id_usuario}}">
	<div class="panel-body">
		<form style="" onchange="this.style.boxShadow='2px 2px 5px 0 #009688';" class="form" role="form" method="post" action="" >
			<div class="row">
				<div class="col-md-4" >
					<h4> {{{papeisv}}}</h4>
					<div class="form-group form-group-lg" style="padding-left:5px;">{{{inputPapeis}}}</div>
				</div>
				<div class="col-md-8">
					<h4>{{{usuario}}}</h4>
					<div class="form-group form-group-lg">
						<label class="col-md-2 control-label" for="nome_usuario" >{{{nome}}}</label>
						<div class="col-md-10">
							<input type="text" value="{{{nome_usuario}}}" class="form-control" name="nome_usuario" required>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-2 control-label" for="login">Login</label>
						<div class="col-md-10">
							<input type="text" value="{{{login}}}" class="form-control" name="login" required>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-2 control-label" for="novasenha">{{{labelNovaSenha}}}</label>
						<div class="col-md-10">
							<input type="password" value="" class="form-control" name="senha" >
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-2 control-label" for="email">e-mail</label>
						<div class="col-md-10">
							<input type="email" value="{{{email}}}" class="form-control" name="email" required>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-2 control-label" for="data_cadastro">{{{labelDataCadastro}}}</label>
						<div class="col-md-10">
							<input disabled="" type="text" value="{{{data_cadastro}}}" class="form-control" name="data_cadastro">
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-2 control-label" for="ativo">{{{labelAtivo}}}</label>
						<div class="col-md-10">
							<select name="ativo" class="form-control">
								<option value="1" {{selAtivoSim}} >{{sim}}</option>
								<option value="0" {{selAtivoNao}} >{{{nao}}}</option>
							</select>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<div class="col-md-2"></div>
						<div class="checkbox col-md-10">
								<label>
									<input type="checkbox" checked name="enviaSenha" /> {{{enviaSenha}}}
								</label>
						</div>
					</div>
				</div>
			</div>
		</form>
		<div class="pull-right">
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_usuario}}')" class="btn btn-danger" role="button">{{excluir}}</a>
			<a href="javascript:void(0)" onclick="{{onSalvar}}('{{id_usuario}}')" class="btn btn-primary" role="button">{{salvar}}</a>
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
<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../../dicionario/usuarios.js"></script>
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
		i3GEOadmin.usuarios.dicionario.adicionar = i3GEOadmin.core.dicionario.adicionar;
		i3GEOadmin.usuarios.dicionario.filtro = i3GEOadmin.core.dicionario.filtro;
		i3GEOadmin.usuarios.dicionario.excluir = i3GEOadmin.core.dicionario.excluir;
		i3GEOadmin.usuarios.dicionario.salvar = i3GEOadmin.core.dicionario.salva;
		i3GEOadmin.usuarios.dicionario.sim = i3GEOadmin.core.dicionario.sim;
		i3GEOadmin.usuarios.dicionario.nao = i3GEOadmin.core.dicionario.nao;
		i3GEOadmin.usuarios.dicionario.cancelar = i3GEOadmin.core.dicionario.cancelar;
		i3GEOadmin.usuarios.dicionario.confirma = i3GEOadmin.core.dicionario.confirma;

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.usuarios.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.usuarios.dicionario);

		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.usuarios.dicionario
			)
		);
		$.material.init();
		var inicia = function() {
			$(".hidden").removeClass('hidden');
			i3GEOadmin.usuarios.init($("#corpo"));
		};
		i3GEO.login.verificaOperacao("admin/html/usuarios",i3GEO.configura.locaplic, inicia, "sessao");
	});
</script>
</body>
</html>
