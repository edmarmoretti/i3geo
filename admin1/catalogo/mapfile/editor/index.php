<?php
// TODO botoes de copiar, colar, limpar
// TODO editor de cores
//

/****************************************************************/
//include ("exec.php");
//
//checa login
//valida _GET e _POST, juntando em _GET
//pega algumas variaveis de uso mais comum
//session_start
//
include ("../../../php/checaLogin.php");
\admin\php\login\checaLogin();
//funcoes de administracao
include ($_SESSION["locaplic"]."/admin1/php/funcoesAdmin.php");
//
//carrega outras funcoes e extensoes do PHP
//
include ($_SESSION["locaplic"]."/classesphp/carrega_ext.php");
//
//carrega as funcoes locais
//depende de funcoesAdmin.php
//
include ("funcoes.php");
//
//conexao com o banco de administracao
//cria as variaveis $dbh e $dbhw alem de conexaoadmin
//
include ($_SESSION["locaplic"]."/admin1/php/conexao.php");
/***************************************************************/
define ( "ONDEI3GEO", "../../../.." );
include "../../../head.php";
$codigo = filter_var ( $_GET ["codigo"], FILTER_SANITIZE_STRING );
$id_tema = ( int ) $_GET ["id_tema"];
if (isset ( $_POST ["texto"] )) {
	$gravarTexto = $_POST ["texto"];
	$_POST ["texto"] = "";
}

if (\admin\php\funcoesAdmin\verificaOperacaoSessao ( "admin/html/editortexto" ) === false) {
	header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
	exit ();
}
$versao = \admin\php\funcoesAdmin\versao ();
$versao = $versao ["principal"];
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
			i3GEOadmin.core.loginOn();
			$(".hidden").removeClass('hidden');

		$.material.init();
		$("#editor").height(parseInt($("#editortemp").height()) + 50 + "px");
		$("#editortemp").html("").hide();
		//
		//servidor utilizado no preview
		//
		var protocolo = window.location.href;
		protocolo = protocolo.split(":")[0];

		i3GEOadmin.editor.servidorPreview = protocolo + "://" + window.location.host + "/<?php echo basename($_SESSION["locaplic"]); ?>/admin1/catalogo/mapfile/preview/index.php";

	});
</script>
</body>
</html>
