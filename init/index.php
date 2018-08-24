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
    if (! file_exists($dir_tmp . "/saiku-datasources")) {
        @mkdir($dir_tmp . "/saiku-datasources", 0744);
        chmod($dir_tmp . "/saiku-datasources", 0744);
    }
    if (! file_exists($dir_tmp . "/cache")) {
        @mkdir($dir_tmp . "/cache", 0744);
        chmod($dir_tmp . "/cache", 0744);
    }
    if (! file_exists($dir_tmp . "/cache/googlemaps")) {
        @mkdir($dir_tmp . "/cache/googlemaps", 0744);
        chmod($dir_tmp . "/cache/googlemaps", 0744);
    }
    foreach (glob($dir_tmp . '/{,.}*.php', GLOB_BRACE) as $f) {
        unlink($f);
    }
}
// error_reporting ( 0 );
include "head.php";
?>
<style>
.amarelo {
	color: yellow;
}
</style>
<body style="padding-top: 90px;" id="topo">
    <a href="#conteudoPrincipal" class="sr-only sr-only-focusable">
        <span class="well" style="background: white; color: #007e72;">Skip to main content</span>
    </a>
    <nav class="navbar navbar-default navbar-fixed-top">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" title="icon-bar" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" onclick="$('.cartao').fadeIn(600);" href="#">
				<?php echo $mensagemInicia;?> <i class="fa fa-home fa-1x"></i>
                </a>
            </div>
            <div id="navbar" class="navbar-collapse collapse navbar-responsive-collapse">
                <!-- template para permitir a traducao -->
                <div id="menuTpl" class="hidden">
                    <ul class="nav navbar-nav">
                        <li class="fa visible-lg"><a href="#" tabindex='-1'>
                                <span id="bandeiras"></span>
                            </a></li>
                        <li class="visible-lg"><a data-toggle="collapse" data-target=".in" role="button" href="#topo" onclick="$('.cartao').hide();$('.map-o').fadeIn(600);">{{{mapas}}}</a></li>
                        <li><a data-toggle="collapse" data-target=".in" role="button" href="#topo" onclick="$('.cartao').hide();$('.download').fadeIn(600);">OGC/Download</a></li>
                        <li><a data-toggle="collapse" data-target=".in" role="button" href="#topo" onclick="$('.cartao').hide();$('.cogs').fadeIn(600);">{{{admin}}}</a></li>
                        <li class="visible-lg"><a data-toggle="collapse" data-target=".in" role="button" href="#topo" onclick="$('.cartao').hide();$('.book').fadeIn(600);">{{{docs}}}</a></li>
                        <li class="visible-lg"><a data-toggle="collapse" data-target=".in" role="button" href="#topo" onclick="$('.cartao').hide();$('.group').fadeIn(600);">{{{comunidade}}}</a></li>
                        <li><a role="button" href="../social/index.php">Social</a></li>
                        <li><a role="button" href="../rss/index.php">RSS</a></li>
                        <li <?php if(isset($i3geoPermiteLogin) && $i3geoPermiteLogin == false) { echo "style=display:none "; }?>><a role="button"
                                onclick="i3GEO.login.recarrega = true; i3GEO.login.dialogo.abreLogin('../');" href="#topo" data-toggle="modal" data-target="#modalLogin">
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
                    <li><img class="pull-left" alt="i3Geo Logo" src='../imagens/i3Geo_bigTransp.png' style='width: 80px; margin: 5px;' /> <img alt="qrcode site" class="pull-right hidden-xs"
                        src='../pacotes/qrcode/php/qr_img.php?host={{{host}}}&d={{{href}}}' style='width: 80px; margin: 5px;' />
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
    echo '<div class="alert alert-danger" role="alert">Verifique se PHP-Mapscript está instalado</div>';
}
?>
			<!-- Template para criacao dos quadros ver index.js -->
            <div id="botoesTpl" class="hidden">
                <div class="cartao {{{fa}}} col-xs-12 center-block" style="width: 30rem; min-width: 30rem; max-width: 30rem;">
                    <div class="panel panel-default">
                        <div class="panel-heading" style="padding:0px;">
                            <h5 style="height: 35px;padding:10px 10px;">{{{titulo}}}</h5>

                                <a tabindex="-1" target="{{{target}}}" href="{{{href}}}">
                                    <img alt="{{{titulo}}}" tabindex="-1" style="height: 100px; width: 100%; border-radius: 0px;" src="{{{img}}}" />
                                </a>

                        </div>
                        <div class="panel-body" tabindex="-1" style="background-color: rgb(250, 250, 250)">
                            <h5 tabindex="-1" class="hidden-xs" style="height: 10rem; font-size: 1.7rem; color: #0f0e0e66;">{{{subtitulo}}}</h5>
                        </div>
                        <div class="panel-footer text-right" style="padding: 0px; padding-right: 15px; border: 0px; background-color: rgb(250, 250, 250);">
                            <div class="row center-block">
                                <div class="col-xs-6" style="line-height: 3.5; text-align: left;">
                                    <!-- o texto no span e para acessibilidade-->
                                    <button tabindex="-1" role="button" data-toggle="quadroQrcode" data-url="{{{href}}}" class="btn btn-primary btn-fab btn-fab-mini"
                                        style="opacity: 0.2; padding-left: 8px; padding-top: 7px; margin: auto;">
                                        <span class="glyphicon glyphicon-qrcode" aria-hidden="true">&nbsp;&nbsp;qrcode</span>
                                    </button>

                                    <button tabindex="-1" role="button" style="opacity: 0.2;" onclick="favorita(this);return false;" class="btn btn-primary btn-fab btn-fab-mini">
                                        <span data-cookie="{{{img}}}"><i class="material-icons">grade</i></span>
                                    </button>
                                </div>
                                <div class="col-xs-6">
                                    <a class="btn btn-primary" style="color: #5F4B8B;" href="{{{href}}}" role="button" target="{{{target}}}"> {{{abrir}}} </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div tabindex="-1" class="container-fluid" style="background-color: #fff; margin-top: 10px; padding-top: 10px;">
        <div class="row text-center hidden">
            <div class="col-lg-12 center-block">
                <a tabindex="-1" rel="license" href="http://creativecommons.org/licenses/GPL/2.0/legalcode.pt" target="_blank">
                    <img alt="Licen&ccedil;a Creative Commons" style="border-width: 0" src="https://i.creativecommons.org/l/GPL/2.0/88x62.png" />
                </a>
                <br />O i3Geo est&aacute; licenciado com uma Licen&ccedil;a
                <a tabindex="-1" rel="license" href="http://creativecommons.org/licenses/GPL/2.0/legalcode.pt" style="color: #5F4B8B;" target="_blank">Creative Commons - Licen&ccedil;a P&uacute;blica
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

		$('[data-toggle="quadroQrcode"]').popover({
			html: true,
			placement: "auto",
			trigger: "focus",
			content: function(){
				var urlqr = "../pacotes/qrcode/php/qr_img.php?host=" + window.location.host + "&u=" + $(this).attr("data-url");
				return "<img style='width:200px; height: 200px;' src='" + urlqr + "' '></a>";
			}
		});
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
