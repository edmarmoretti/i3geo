<?php
/**
 * Pagina inicial do i3Geo
 * Voce pode utilizar o parametro customDir para indicar a pasta onde
 * as interfaces de mapa estao. Nesse caso, os links utilizarao esse parametro
 * Exemplo: localhost/i3geo/init/index.php?customDir=minhaPasta
 *
 * minhaPasta deve estar dentor da pasta i3geo.
 *
 * Se dentro da pasta $customDir existir um arquivo chamado index.php sera feito o include
 * na pagina.
 */
/**
 * Cria as pastas temporarias que o i3Geo precisa, caso nao existam
 */
define("ONDEI3GEO", "..");
include (dirname(__FILE__) . "/../ms_configura.php");
if (empty($dir_tmp)) {
    exit();
}
if (! empty($_GET["customDir"])) {
    $customDir = strip_tags($_GET["customDir"]);
} else if (empty($customDir)) {
    $customDir = "interface";
}
include_once (dirname(__FILE__) . "/../classesphp/sani_request.php");
if (! file_exists($dir_tmp)) {
    @mkdir($dir_tmp, 0744);
}
if (file_exists($dir_tmp)) {
    if (! file_exists($dir_tmp . "/comum")) {
        @mkdir($dir_tmp . "/comum", 0744);
        chmod($dir_tmp . "/comum", 0744);
    }
    if (! file_exists($dir_tmp . "/cache")) {
        @mkdir($dir_tmp . "/cache", 0744);
        chmod($dir_tmp . "/cache", 0744);
    }
    if (! file_exists($dir_tmp . "/cache/wmts")) {
        @mkdir($dir_tmp . "/cache/wmts", 0744);
        chmod($dir_tmp . "/cache/wmts", 0744);
    }
    foreach (glob($dir_tmp . '/{,.}*.php', GLOB_BRACE) as $f) {
        unlink($f);
    }
}
// error_reporting ( 0 );
include "head.php";
?>
<body style="padding-top: 90px;" id="topo">
    <a href="#conteudoPrincipal" class="sr-only sr-only-focusable">
        <span class="well" style="background: white; color: #007e72;">Skip to main content</span>
    </a>
    <nav class="navbar navbar-default navbar-fixed-top">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" title="icon-bar" class="navbar-toggle collapsed" data-bs-toggle="collapse"data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" onclick="$('.cartao').fadeIn(600);" href="#">
				<span class="material-icons md-18">home</span> <?php echo $mensagemInicia;?>
                </a>

            </div>
            <div id="navbar" class="navbar-collapse collapse navbar-responsive-collapse">
                <!-- template para permitir a traducao -->
                <div id="menuTpl" class="hidden">
                    <ul class="nav navbar-nav">
                        <li <?php if(isset($i3geoPermiteLogin) && $i3geoPermiteLogin == false) { echo "style=display:none "; }?>><a role="button"
                                onclick="i3GEO.login.recarrega = true; i3GEO.login.dialogo.abreLogin('../');" href="#topo" data-bs-toggle="modal" data-bs-target="#modalLogin">
                                Login <i class="material-icons md-18">input</i>
                            </a></li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
    <nav class="navbar-fixed-bottom">
        <div class="container-fluid hidden">
            <div class="jumbotron hidden-xs" id="jumbotron" style="background: rgb(255, 255, 255); background: rgba(255, 255, 255, 0.8);">
                <!-- Template para mensagem do i3Geo -->
                <ul class="list-inline">
                    <li><img class="pull-left" alt="i3Geo Logo" src='../imagens/i3Geo_bigTransp.png' style='width: 80px; margin: 5px;' />
                        <p>{{{jumbotron}}}</p></li>
                </ul>
                <div id="mensagemLogin"></div>
            </div>
        </div>
    </nav>

    <div class="container-fluid row center-block;" style="width:100%" id="conteudoPrincipal" tabindex="-1">
        <div class="row center-block " style="max-width:1000px">
<?php
include_once ("../classesphp/carrega_ext.php");
if (! function_exists("ms_GetVersion")) {
    echo '<div class="alert alert-danger" role="alert">Verifique se PHP-Mapscript est� instalado</div>';
}
?>
			<!-- Template para criacao dos quadros ver index.js -->
            <div id="botoesTpl" class="hidden">
                <template  id="botoesTpl_template">
                    <div class="cartao {{{fa}}} col-xs-12 center-block" style="width: 30rem; min-width: 30rem; max-width: 30rem;">
                        <div class="panel panel-default">
                            <div class="panel-heading" style="padding:0px;">
                                <h4 style="height: 35px;padding:10px 10px;">{{{titulo}}}</h4>

                                    <a tabindex="-1" target="{{{target}}}" href="{{{href}}}">
                                        <img alt="{{{titulo}}}" tabindex="-1" style="padding:1px;height: 100px; width: 100%; border-radius: 0px;" src="{{{img}}}" />
                                    </a>

                            </div>
                            <div class="panel-body" tabindex="-1" style="background-color: rgb(250, 250, 250)">
                                <h5 tabindex="-1" class="hidden-xs longText" style="height: 10rem; color: #0f0e0e66;">{{{subtitulo}}}</h5>
                            </div>
                            <div class="panel-footer text-right" style="padding: 0px; padding-right: 15px; border: 0px; background-color: rgb(250, 250, 250);">
                                <div class="row right-block">
                                    <div class="col-xs-6">
                                        <a class="btn btn-primary" href="{{{href}}}" role="button" target="{{{target}}}"> {{{abrir}}} </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
    <div tabindex="-1" class="container-fluid" style="background-color: #fff; margin-top: 10px; padding-top: 10px;">
        <div class="row text-center hidden">
            <div class="col-lg-12 center-block">
                <br />O i3Geo est&aacute; licenciado com uma Licen&ccedil;a
                <a tabindex="-1" rel="license" href="http://creativecommons.org/licenses/GPL/2.0/legalcode.pt" target="_blank">Creative Commons - Licen&ccedil;a P&uacute;blica
                    Geral GNU (&#34;GNU General Public License&#34;)</a>
            </div>
        </div>
    </div>
    <?php include (dirname(__FILE__) . "/../interface/inc/modallogin.php");?>

    <script>
	//utilizado em ms_configura.php para customizar o local da pasta de inicializacao
	var customDir = "<?php echo $customDir; ?>";
	</script>
    <script src='indexjs.php'></script>
    <script>
	$(document).ready(function(){
		<?php
		if (!empty ($i3geomaster) && ($i3geomaster [0] ["usuario"] == "admin" && $i3geomaster [0] ["senha"] == "admin")) {
			echo "var men = '<div class=\'alert alert-danger\' style=\'margin-bottom:0px;\' >' + $" . "trad(19,g_traducao_init) + '</div>';";
		} else {
			echo "var men = '';";
		}
		?>
		mostraBotoesBT(men);
		$('.hidden').removeClass('hidden');
		$(window).on("scroll click",
			function(){
				$("#mensagemLogin").fadeOut(300);
				$("#jumbotron").fadeOut(300);
			}
		);
		//verifica se deve ou nao esconder a mensagem de boas vindas verificando o parametro enviado pela url
		if("<?php echo isset($_GET["home"]) ? "ok" : ""; ?>" == "ok"){
			$("#jumbotron").hide();
		}
		//modifica a url para que ao voltar a pagina a mensagem de boas vindas nao seja mostrada
		var u = window.location.origin + window.location.pathname + "?home=";
		window.history.replaceState(null,null,u);

		$.material.init();
	});
	</script>
</body>
</html>
<?php
if(extension_loaded('zlib')){
    ob_end_flush();
}
?>
