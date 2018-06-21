<?php
define ( "ONDEI3GEO", ".." );
include (dirname ( __FILE__ ) . "/../ms_configura.php");
include_once (dirname(__FILE__)."/../classesphp/sani_request.php");
if (! empty ( $_GET ["customDir"] )) {
	$customDir = strip_tags ( $_GET ["customDir"] );
} else if (empty ( $customDir )) {
	$customDir = "interface";
}
if (! file_exists ( $dir_tmp )) {
	@mkdir ( $dir_tmp, 0744 );
}
if (file_exists ( $dir_tmp )) {
	if (! file_exists ( $dir_tmp . "/comum" )) {
		@mkdir ( $dir_tmp . "/comum", 0744 );
	}
	if (! file_exists ( $dir_tmp . "/saiku-datasources" )) {
		@mkdir ( $dir_tmp . "/saiku-datasources", 0744 );
		chmod ( $dir_tmp . "/saiku-datasources", 0744 );
	}
	if (! file_exists ( $dir_tmp . "/cache" )) {
		@mkdir ( $dir_tmp . "/cache", 0744 );
		chmod ( $dir_tmp . "/cache", 0744 );
	}
	if (! file_exists ( $dir_tmp . "/cache/googlemaps" )) {
		@mkdir ( $dir_tmp . "/cache/googlemaps", 0744 );
		chmod ( $dir_tmp . "/cache/googlemaps", 0744 );
	}
}
//error_reporting ( 0 );
include "../init/head.php";

?>
<script src="../pacotes/ol3/ol.js"></script>
<style>
.checkbox, .radio {
	margin-bottom: 5px;
	margin-top: 0;
	position: relative;
	top: 1px;
}
</style>
<script id="templateCamada" type="x-tmpl-mustache">
<ul class="list-inline" id="linha_{{{idtema}}}">
	<li>
		<button onclick="$i3geo_gl.excluir('linha_{{{idtema}}}');return false;" role="button" class="btn btn-primary btn-fab btn-fab-mini">
			<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
		</button>
		<button onclick="$i3geo_gl.subir('linha_{{{idtema}}}');return false;" role="button" class="btn btn-primary btn-fab btn-fab-mini">
			<span class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span>
		</button>
		<button onclick="$i3geo_gl.descer('linha_{{{idtema}}}');return false;" role="button" class="btn btn-primary btn-fab btn-fab-mini">
			<span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>
		</button>
	</li>
	<li class="checkbox">
		<label>
			<input onclick="$i3geo_gl.crialink();" type="checkbox" value="{{{idtema}}}"><span class="checkbox-material"><span class="check"></span></span> {{{idtema}}}
		</label>
	</li>
</ul>
</script>

<body style="padding-top: 60px; position: relative;">
	<nav id="navbar" class="navbar navbar-default navbar-fixed-top">
		<div class="container-fluid">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
					data-target="#navbar" aria-expanded="false" aria-controls="navbar">
					<span class="sr-only"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span
						class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="../init/index.php"><?php echo $mensagemInicia;?> <i
					class="fa fa-home fa-1x"></i></a>
			</div>
		</div>
	</nav>
    <nav class="navbar-fixed-bottom">
        <div class="container-fluid">
            <div class="jumbotron" id="jumbotron"
                style="background: rgb(255, 255, 255); background: rgb(255, 255, 255);">

				<button onclick="i3GEO.util.copyToClipboard($('#link').html());alerta('Copiado');"
					class="btn btn-primary btn-fab btn-fab-mini">
					<i class="fa fa-files-o" aria-hidden="true"></i>
				</button>
				&nbsp; <a class="navbar-link" href="" id="link" target="_blank">http://</a>

            </div>
        </div>
    </nav>

	<!--para as mensagens de alerta-->
	<div class="navbar-fixed-top alert alert-success text-center" style="padding: 0px;"></div>
	    <div class="container-fluid migalha">
        <div class="row">
            <div class="btn-group btn-breadcrumb">
                <a class="btn btn-default" href="../init/index.php?home=">i3Geo</a>
                <a class="btn btn-default" style="pointer-events: none">Perm links</a>
            </div>
        </div>
    </div>
	<div class="container">
		<div class="jumbotron">
			<h1>Construtor de links</h1>
			<p>Aqui voc&ecirc; pode gerar links para abrir o i3Geo de forma personalizada. Os links podem
				ser inclu&iacute;dos em qualquer p&aacute;gina WEB, sendo poss&iacute;vel definir quais os temas
				ser&atilde;o mostrados e qual a extens&atilde;o geogr&aacute;fica do mapa.</p>
			<p>
				Para ver todos os par&acirc;metros de inicializa&ccedil;&atilde;o que podem ser utilizados
				acesse esse link: <a href="../ms_criamapa.php?ajuda" target=_blank>ms_criamapa.php?ajuda</a>
			</p>
		</div>
		<div class="well bs-component">
			<form class="form-vertical">
				<fieldset>
					<legend>Escolha das camadas</legend>
					<h4>Escolha as camadas que ser&atilde;o inclu&iacute;das no mapa. As camadas são
						organizadas em uma hierarquia começando em menu.</h4>

					<div class="form-group">
						<label for="menus">Menu</label> <select onchange="$i3geo_gl.combogrupos(this.value)"
							class="form-control" id="menus">
						</select> <span class="material-input"></span>
					</div>
					<div class="form-group">
						<label for="grupos">Grupo</label> <select onchange="$i3geo_gl.combosubgrupos(this.value)"
							class="form-control" id="grupos">
						</select> <span class="material-input"></span>
					</div>
					<div class="form-group">
						<label for="subgrupos">Subgrupo</label> <select onchange="$i3geo_gl.combotemas('',this.value)"
							class="form-control" id="subgrupos">
						</select> <span class="material-input"></span>
					</div>
					<div class="form-group">
						<label for="temas">Temas</label> <select style="font-size: 15px;"
							onchange="$i3geo_gl.preseltema('','',this.value)" class="form-control" id="temas">
						</select> <span class="help-block">Na lista abaixo voc&ecirc; pode remover temas j&aacute;
							escolhidos. Clique em v&aacute;rios temas para escolher mais de um</span> <span
							class="material-input"></span>
					</div>
					<div class="form-group">
						<label for="temasa">Temas j&aacute; escolhidos. Os que estiverem marcados,
							ficar&atilde;o ligados logo ao abrir o mapa</label>
						<div id="temasa" class="form-control" style='height: 120px; overflow: auto'></div>
					</div>
				</fieldset>
			</form>
		</div>
		<div class="well bs-component">
			<form class="form-vertical">
				<fieldset>
					<legend>Coordenadas</legend>
					<p>Se vc quiser, o mapa poder&aacute; ser aberto mostrando pontos, digite abaixo as
						coordenadas dos pontos em d&eacute;cimos de grau (exemplo: -54 -12 -54 1 -51 -15)</p>
					<div class="form-group label-floating">
						<label class="control-label" for="pontos">Coordenadas dos pontos</label> <input
							class="form-control" id="pontos" type="text" onchange="$i3geo_gl.crialink()" />
					</div>
					<div class="form-group label-floating">
						<label class="control-label" for="nometemapontos">Nome do tema para aparecer na
							legenda</label> <input class="form-control" id="nometemapontos" type="text"
							onchange="$i3geo_gl.crialink()" />
					</div>
				</fieldset>
			</form>
		</div>
		<div class="well bs-component">
			<form class="form-vertical">
				<fieldset>
					<legend>Perfis</legend>
					<p>Caso existam perfis definidos na configura&ccedil;&atilde;o do menu de temas, vc pode
						restringir a lista de temas do menu de adi&ccedil;&atilde;o de temas do i3Geo</p>
					<div class="form-group label-floating">
						<label class="control-label" for="perfili">Perfil</label> <input class="form-control"
							id="perfili" type="text" onchange="$i3geo_gl.crialink()" />
					</div>
				</fieldset>
			</form>
		</div>
		<div class="well bs-component">
			<form class="form-vertical">
				<fieldset>
					<legend>Mapa</legend>
					<div class="form-group">
						<label for="temas">Escolha a interface que ser&aacute; utilizada para construir o mapa</label>
						<div id="comboInterfaces"></div>
						<span class="material-input"></span>
					</div>
				</fieldset>
			</form>
		</div>
		<div class="well bs-component">
			<form class="form-vertical">
				<fieldset>
					<legend>Extens&atilde;o geogr&aacute;fica</legend>

					<div class="row">
						<div class="col-sm-6 text-left">
							<label> Utilize o navegador abaixo para definir as coordenadas geogr&aacute;ficas do
								seu mapa. Ap&oacute;s escolher a regi&atilde;o, clique no botão de captura.</label>
							<div class="row">
								<div class="col-sm-12 text-center">
									<div id="i3geo_gl_mapa1" style="width: 100%; height: 256px; border: 1px solid gray;"></div>
								</div>
							</div>
							<div class="row">
								<div class="col-sm-12 text-center">
									<button onclick="$i3geo_gl.OL.capturageo();return false;" class="btn btn-primary">Capturar</button>
								</div>
							</div>
						</div>
						<div class="col-sm-6 text-left">
							<label>Coordenadas geogr&aacute;ficas escolhidas (em d&eacute;cimos de grau). Digite
								os valores ou capture as coordenadas</label>

							<div class="coord form-group label-floating">
								<label class="control-label">X mínimo (longitude oeste -)</label> <input
									class="form-control" id="i3geo_gl_xmin" type="text" onchange="$i3geo_gl.crialink()" />
							</div>
							<div class="coord form-group label-floating">
								<label class="control-label" for="i3geo_gl_xmax">X m&aacute;ximo (longitude leste +)</label>
								<input class="form-control" id="i3geo_gl_xmax" type="text" onchange="$i3geo_gl.crialink()" />
							</div>
							<div class="coord form-group label-floating">
								<label class="control-label" for="i3geo_gl_ymin">Y m&iacute;nimo (latitude sul -)</label> <input
									class="form-control" id="i3geo_gl_ymin" type="text" onchange="$i3geo_gl.crialink()" />
							</div>

							<div class="coord form-group label-floating">
								<label class="control-label" for="i3geo_gl_ymax">Y m&aacute;ximo (latitude norte +)</label>
								<input class="form-control" id="i3geo_gl_ymax" type="text" onchange="$i3geo_gl.crialink()" />
							</div>
						</div>
					</div>

				</fieldset>
			</form>
		</div>

	</div>
    <div style="height:400px;">&nbsp;</div>
	<script type="text/javascript" src="../js/i3geo_tudo_compacto8.js"></script>
	<script src='dicionario.js'></script>
	<script src='index.js'></script>
	<script>
		i3GEO.configura = {
			"locaplic" : window.location.href.split("/permlinks")[0],
			"sid" : ""
		};
		$(".active").html($trad("migalha", g_traducao_permlinks));

		var i3geo_gl_configura = new i3geo_gl_configura(
				i3GEO.configura.locaplic, "", "temasa", "link", "grupos",
				"subgrupos", "temas", "buscageo", "menus");
		i3geo_gl_inicia(i3geo_gl_configura);
		$i3geo_gl.buscageo_init();
		$.material.init();
	</script>
</body>
</html>
<?php
if(extension_loaded('zlib')){
    ob_end_flush();
}
?>