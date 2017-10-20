<?php
define ( "ONDEI3GEO", "../../../../.." );
include ("exec.php");

include "../../../../head.php";
$id_medida_variavel = ( int ) $_GET ["id_medida_variavel"];
$codigo_variavel = ( int ) $_GET ["codigo_variavel"];
//pega o nome da medida
include("../funcoes.php");
$dados = \admin\metaestat\variaveis\medidas\listar ($dbh,"",$id_medida_variavel);
$nomemedida = $dados["nomemedida"];
$_SESSION["nomemedida"] = $nomemedida;
?>
<div class="container-fluid migalha">
	<div class="row">
		<div class="btn-group btn-breadcrumb">
			<a class="btn btn-default" href="../../../../../init/index.php">
				<span>i3Geo</span>
			</a>
			<a class="btn btn-default" href="../../../../index.php">
				<span>Admin</span>
			</a>
			<a class="btn btn-default" style="pointer-events: none">
				<span>Metaestat</span>
			</a>
			<a class="btn btn-default" href="../../index.php">
				<span>Vari&aacute;veis</span>
			</a>
			<a class="btn btn-default" href="../index.php?codigo_variavel=<?php echo $codigo_variavel; ?>">
				<span>Medidas</span>
			</a>
			<a class="btn btn-default" style="pointer-events: none">
				<span>Op&ccedil;&otilde;es</span>
			</a>
		</div>
	</div>
</div>
<div class="container">
	<div class="row center-block">
		<div class="col-md-12" id="titulo">
			<div class="well hidden">
				<h2>
					<small>{{{opcoesMedidas}}}</small>
				</h2>
				<div class="pull-left panel-heading">
					<small>Vari&aacute;vel</small>
					<h4><?php echo $_SESSION["nome_variavel"]; ?></h4>
				</div>
				<div class="panel-heading">
					<small>Medida</small>
					<h4><?php echo $nomemedida; ?></h4>
				</div>
				<div class="clearfix"></div>
			</div>
			<div class="well hidden">
				<div id="corpo"></div>
			</div>
		</div>
	</div>
</div>
<?php
include ("templates/templateMaisOpcoes.php");
?>
<script type="text/javascript" src="../../../../dicionario/estat_variavel.js"></script>
<script type="text/javascript" src="index.js"></script>
<script>
	$(document).ready(function(){
		//vem de admin/index.js
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
		i3GEOadmin.opcoesmedida.dicionario = $.extend(
			{},
			i3GEOadmin.variaveis.dicionario,
			i3GEOadmin.core.dicionario
		);

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.opcoesmedida.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.opcoesmedida.dicionario);

		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.opcoesmedida.dicionario
			)
		);
		$("#corpo").html(
			Mustache.to_html(
				$("#templateMaisOpcoes").html(),
				$.extend(
						{},
						i3GEOadmin.opcoesmedida.dicionario,
						{
							"id_medida_variavel": "<?php echo $id_medida_variavel; ?>",
							"codigo_variavel": "<?php echo $codigo_variavel; ?>"
						}
				)
			)
		);

		$.material.init();
			i3GEOadmin.core.loginOn();
			$(".hidden").removeClass('hidden');
	});
</script>
</body>
</html>
