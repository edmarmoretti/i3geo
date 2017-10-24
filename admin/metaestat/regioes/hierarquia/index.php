<?php
define ( "ONDEI3GEO", "../../../.." );
include ("exec.php");

include "../../../head.php";
$codigo_tipo_regiao = filter_var ( $_GET ["codigo_tipo_regiao"], FILTER_SANITIZE_NUMBER_INT );

include("../funcoes.php");
$dados = \admin\metaestat\regioes\listar ($dbh,$codigo_tipo_regiao);
$nome_tipo_regiao = $dados["nome_tipo_regiao"];
?>
<div class="container-fluid migalha">
	<div class="row">
		<div class="btn-group btn-breadcrumb">
			<a class="btn btn-default" href="../../../../init/index.php"><span>i3Geo</span></a>
			<a class="btn btn-default" href="../../../index.php"><span>Admin</span></a>
			<a class="btn btn-default" style="pointer-events: none"><span>Metaestat</span></a>
			<a class="btn btn-default" href="../index.php"><span>Regi&otilde;es</span></a>
			<a class="btn btn-default" style="pointer-events: none"><span>Hierarquia</span></a>
		</div>
	</div>
</div>

<div class="container">
	<div class="row center-block">
		<div class="col-md-12" id="titulo">
			<div class="well hidden" >
				<div class="panel-heading" >
				  <small>Regi&atilde;o</small>
				  <h4><?php echo $nome_tipo_regiao; ?></h4>
				</div>
				<blockquote>{{{txtHierarquiaDesc}}}<br>
                    <a href="#expandeTxt" data-toggle="collapse" class="collapsed">
                        <span class="text-primary readMore">
                            <i class="material-icons">keyboard_arrow_down</i>
                        </span>
                        <span class="text-primary readLess">
                            <i class="material-icons">keyboard_arrow_up</i>
                        </span>
                    </a>
                    <div id="expandeTxt" class="collapse">{{{txtHierarquiaAjuda}}}</div>
                </blockquote>

				<div class="clearfix"></div>
			</div>
			<div class="well hidden">
				<div class="panel-heading">
					<p class="lead" style="margin:0px;">&nbsp;
						<a title="{{{adicionar}}}" onclick="i3GEOadmin.hierarquia.adicionaDialogo();" href="javascript:void(0)"
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
<?php
include("templates/templateLista.php");
include("templates/templateFormLista.php");
include("templates/templateOpcoesRegioes.php");
include("templates/templateOpcoesColunas.php");
?>
<script type="text/javascript" src="../index.js"></script>
<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../../../dicionario/estat_tipo_regiao.js"></script>
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
		i3GEOadmin.regioes.dicionario = $.extend(
			{},
			i3GEOadmin.regioes.dicionario,
			i3GEOadmin.core.dicionario
		);

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.hierarquia.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.regioes.dicionario);

		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.hierarquia.dicionario
			)
		);
		i3GEOadmin.hierarquia.codigo_tipo_regiao = <?php echo (int) $codigo_tipo_regiao; ?>;
		$.material.init();
		i3GEOadmin.core.loginOn();

		$(".hidden").removeClass('hidden');
		i3GEOadmin.hierarquia.init($("#corpo"));
	});
</script>
</body>
</html>
