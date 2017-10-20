<?php
define ( "ONDEI3GEO", "../../../../.." );
include ("exec.php");

include "../../../../head.php";
$id_medida_variavel = ( int ) $_GET ["id_medida_variavel"];
$codigo_variavel = ( int ) $_GET ["codigo_variavel"];
// pega o nome da medida
include ("../funcoes.php");
$dados = \admin\metaestat\variaveis\medidas\listar ( $dbh, "", $id_medida_variavel );
$nomemedida = $dados ["nomemedida"];
$_SESSION ["nomemedida"] = $nomemedida;
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
			<a class="btn btn-default" href="../opcoes/index.php?codigo_variavel=<?php echo $codigo_variavel; ?>&id_medida_variavel=<?php echo $id_medida_variavel; ?>">
				<span>Op&ccedil;&otilde;es</span>
			</a>
			<a class="btn btn-default" style="pointer-events: none">
				<span>Par&acirc;metros</span>
			</a>
		</div>
	</div>
</div>
<div class="container">
	<div class="row center-block">
		<div class="col-md-12" id="titulo">
			<div class="well hidden">
				<h2>
					<small>{{{linksDesc}}}</small>
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
				<div class="panel-heading">
					<p class="lead" style="margin: 0px;">
						&nbsp;
						<a title="{{{adicionar}}}" onclick="i3GEOadmin.parametros.adicionaDialogo();" href="javascript:void(0)" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
							<i class="material-icons ">add</i>
						</a>
					</p>
				</div>
				<div class="clearfix"></div>
				<div id="corpo"></div>
			</div>
		</div>
	</div>
</div>
<?php
include ("templates/templateLista.php");
include ("templates/templateFormLista.php");
include ("templates/templateOpcoesColunas.php");
include ("templates/templateOpcoesParametrosPai.php");
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
		i3GEOadmin.parametros.dicionario = $.extend(
			{},
			i3GEOadmin.variaveis.dicionario,
			i3GEOadmin.core.dicionario
		);

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.parametros.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.parametros.dicionario);

		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.parametros.dicionario
			)
		);
		$("#corpo").html(
			Mustache.to_html(
				$("#templateMaisOpcoes").html(),
				i3GEOadmin.parametros.dicionario
			)
		);
		i3GEOadmin.parametros.id_medida_variavel = <?php echo $id_medida_variavel; ?>;
		i3GEOadmin.parametros.codigo_variavel = <?php echo $codigo_variavel; ?>;
		$.material.init();
		i3GEOadmin.core.loginOn();
		$(".hidden").removeClass('hidden');
		i3GEOadmin.parametros.init($("#corpo"));
	});
</script>
</body>
</html>
