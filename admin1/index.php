<?php
define ( ONDEI3GEO, ".." );
include (dirname ( __FILE__ ) . "/../ms_configura.php");
error_reporting ( 0 );
include "head.php";
?>
	<!--admin1/index.php -->
	<div class="container-fluid">
		<div class="row">
			<ol class="breadcrumb">
				<li><a href="../init/index.php">i3Geo</a></li>
				<li class="active">Admin</li>
			</ol>
		</div>
	</div>
	<div class="container">
		<div class="row center-block">
			<div class="col-sm-12 hidden">

						<div class="well">
						<h1>{{adminI3geo}}</h1>
						<p>{{msgVerMapserv}}
						<p>
							{{msgCadastraUsr}}
						</p>
						<p>
							<a href="http://moodle.gvsig-training.com/course/view.php?id=11"
								target="_blank">{{manualAdmin}}</a>
						</p>
						<div id="mensagemIE" style="display: none; position: relative">
							{{{msgIe}}}
						</div>
						<p>
							{{msgSqlite}} <a
								href='../pacotes/phpliteadmin/phpliteadmin.php'>(link)</a>.
							{{veja}}<br><br>
							<a href="../documentacao/diagramas/mer_banco_de_dados_de_administracao.png"
								target="_new">{{merBdAdmin}}</a><br>
							<a href="../documentacao/diagramas/cadastrodeusuarios/dbdocs/index.html"
								target="_new">{{merBdUsr}}</a><br>
							<a href="../documentacao/diagramas/metaestat/dbdocs/index.html"
			                   target="_new">{{{merBdMetaestat}}}</a><br>
						</p>
						</div>
						<div class="well well-danger">{{atencao}}</div>
						<div class="well well-warning">{{{leiaMe}}}</div>

			</div>
		</div>
	</div>
	<script type="text/javascript" src="js/core.js"></script>
	<script src="dicionario/principal.js"></script>
	<script>
	$(document).ready(function(){
		core_parseMustacheBody(i3GEOadmin.principal.dicionario);
		//vem de admin1/index.js
		iniciaMenuPrincipal();
		$('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			$(this).parent().siblings().removeClass('open');
			$(this).parent().toggleClass('open');
		});
		$(".hidden").removeClass('hidden');
		$.material.init();
	});
	</script>
</body>
</html>
