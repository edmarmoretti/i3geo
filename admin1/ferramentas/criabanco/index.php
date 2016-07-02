<?php
define ( ONDEI3GEO, "../../.." );
include (dirname ( __FILE__ ) . "/../../../ms_configura.php");
error_reporting ( 0 );
include "../../head.php";
?>
<!--admin1/index.php -->
<div class="container-fluid">
	<div class="row">
		<ol class="breadcrumb">
			<li><a href="../../init/index.php">i3Geo</a></li>
			<li><a href="../../index.php">Admin</a></li>
			<li>Ferramentas</li>
			<li class="active">Cria banco</li>
		</ol>
	</div>
</div>
<div class="container">
	<div class="row center-block">
		<div class="col-sm-12 template hidden">
			<div class="row">
				<div class="col-md-12">
					<div class="well">
						<h3>Cria o banco de dados de administra&ccedil;&atilde;o conforme as
							configura&ccedil;&otilde;es de conex&atilde;o existentes em i3geo/ms_configura.php</h3>
						<h4>O usu&aacute;rio e a senha devem estar cadastrados em i3geo/ms_configura.php</h4>
					</div>
					<div class="well">
						<form class="form" role="form" method="post" action="exec.php">
							<?php include("../../templates/login.php");?>
							<div class="form-group">
								<div class="checkbox">
									<label> <input type="checkbox" name="mostraSoSQL" /> Mostra apenas o SQL, sem criar o banco
									</label>
								</div>
								<button type="submit" class="btn btn-primary">{{{enviar}}}</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
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
		var t = $(".template");
		t.html(
			Mustache.to_html(
				t.html(),
				i3GEO.idioma.objetoIdioma(i3GEOadmin.core.dicionario)
			)
		);
		t.removeClass('hidden');
		$.material.init();
	});
	</script>
</body>
</html>