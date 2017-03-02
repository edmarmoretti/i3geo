<?php
// TODO botoes de copiar, colar, limpar
// TODO editor de cores
//
define ( "ONDEI3GEO", "../../../.." );
include (dirname ( __FILE__ ) . "/../../../../ms_configura.php");
error_reporting ( 0 );
include "../../../head.php";
$codigo = filter_var ( $_GET ["codigo"], FILTER_SANITIZE_STRING );
$id_tema = ( int ) $_GET ["id_tema"];
include_once (dirname ( __FILE__ ) . "/../../../../admin/php/login.php");
include_once (dirname ( __FILE__ ) . "/../../../../admin/php/conexao.php");
error_reporting ( 0 );
if (isset ( $_POST ["texto"] )) {
	$gravarTexto = $_POST ["texto"];
	$_POST ["texto"] = "";
}
$versao = versao ();
$versao = $versao ["principal"];

if (verificaOperacaoSessao ( "admin/html/editortexto" ) === false) {
	header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
	exit ();
}
error_reporting ( 0 );
include("funcoes.php");
\admin\catalogo\mapfile\editor\salvaMapfile ();
$textoMapfile = \admin\catalogo\mapfile\editor\textoMapfile ( $codigo );
?>
<div class="container-fluid migalha">
	<div class="row">
		<div class="btn-group btn-breadcrumb">
			<a class="btn btn-default" href="../../../../init/index.php">
				<span>i3Geo</span>
			</a>
			<a class="btn btn-default" href="../../../index.php">
				<span>Admin</span>
			</a>
			<a class="btn btn-default" style="pointer-events: none">
				<span>Cat&aacute;logo</span>
			</a>
			<a class="btn btn-default" href="../index.php">
				<span>Mapfiles</span>
			</a>
			<a class="btn btn-default" href="../opcoes/index.php?codigo=<?php echo $codigo; ?>&id_tema=<?php echo $id_tema; ?>">
				<span>Op&ccedil;&otilde;es</span>
			</a>
			<a class="btn btn-default" style="pointer-events: none">
				<span><?php echo $codigo; ?></span>
			</a>
			<a class="btn btn-default" style="pointer-events: none">
				<span>Editor</span>
			</a>
		</div>
	</div>
</div>
<div class="container-fluid">
	<div class="row center-block">
		<div class="col-md-12 well" id="titulo">

			<blockquote>
				{{{ajudaEditor}}}
				<a href="http://mapserver.org/mapfile/index.html#mapfile" target="_new">Mapserver</a>
			</blockquote>
			<a onclick="i3GEOadmin.editor.salvar()" class="btn btn-primary" style="color: #008579;" href="#" role="button"> {{{salva}}} </a>
			<a onclick="i3GEOadmin.editor.preview('<?php echo $codigo;?>')" class="btn btn-primary" style="color: #008579;" href="#" role="button"> Preview </a>
			<a onclick="i3GEOadmin.editor.testar('<?php echo $codigo;?>')" href="javascript:void(0)" class="btn btn-primary" style="color: #008579;" role="button"> {{{testaLayer}}} </a>
			<a onclick="window.open('../../../../ms_criamapa.php?temasa=<?php echo $codigo;?>&layers=<?php echo $codigo;?>')" class="btn btn-primary" style="color: #008579;" href="javascript:void(0)"
				role="button"> {{{testarI3geo}}} </a>
			<a onclick="i3GEOadmin.editor.testaTabela('<?php echo $codigo;?>')" class="btn btn-primary" style="color: #008579;" href="javascript:void(0)" role="button"> {{{tabela}}} </a>

		</div>
	</div>
	<div class="row center-block">
		<div class="col-md-12 well">
				<form action="index.php?codigo=<?php echo $codigo;?>&id_tema=<?php echo $id_tema;?>" method="post">
					<TEXTAREA id=editor name=texto style='font-size: 16px; width: 100%; float: left; border: 2px dotted lightgray;'>
						<?php echo $textoMapfile; ?>
					</TEXTAREA>
				</form>
				<!-- para calcular a altura do textarea -->
				<pre id="editortemp" style="font-size: 16px; display: block; visibility: hidden;"><?php echo $textoMapfile; ?></pre>
		</div>
	</div>
</div>

<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../teste/index.js"></script>
<script type="text/javascript" src="../../../dicionario/editormapfile.js"></script>
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

		//complementa dicionario
		i3GEOadmin.mapfile.dicionario = $.extend(
			{},
			i3GEOadmin.core.dicionario,
			i3GEOadmin.mapfile.dicionario
		);

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.editor.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.mapfile.dicionario);

		//traducao
		var t = $("#titulo");
		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.editor.dicionario
			)
		);
		t = $("#ajudantes");
		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.editor.dicionario
			)
		);
		var inicia = function() {
			i3GEOadmin.core.loginOn();
			$(".hidden").removeClass('hidden');
		};
		i3GEO.login.verificaOperacao("admin/html/editortexto",i3GEO.configura.locaplic, inicia, "sessao" ,i3GEOadmin.core.erroLogin);

		$.material.init();
		$("#editor").height(parseInt($("#editortemp").height()) + 50 + "px");
		$("#editortemp").html("").hide();
		//
		//servidor utilizado no preview
		//
		var protocolo = window.location.href;
		protocolo = protocolo.split(":")[0];

		i3GEOadmin.editor.servidorPreview = protocolo + "://" + window.location.host + "/<?php echo basename($locaplic); ?>/admin1/catalogo/mapfile/preview/index.php";

	});
</script>
</body>
</html>
