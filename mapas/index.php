<?php
define("ONDEI3GEO", "..");
include (dirname(__FILE__) . "/../ms_configura.php");
if (! empty($_GET["customDir"])) {
    $customDir = strip_tags($_GET["customDir"]);
} else if (empty($customDir)) {
    $customDir = "interface";
}
// error_reporting ( 0 );
include "../init/head.php";
?>
<style>
.btn-qrcode {
	background-color: #fff;
	color: #ddd;
	margin: 5px;
	width: 13px;
	position: absolute;
	top: 12px;
	left: 28px;
	text-align: center;
	border-radius: 20%;
}

.list-group .list-group-separator::before {
	width: 100%;
}

.panel-heading [data-toggle="collapse"]:after {
	font-family: 'FontAwesome';
	content: "\f054";
	float: right;
	margin-right: 5px;
	color: #fffff;
	font-size: 12px;
	line-height: 16px;
	-webkit-transform: rotate(-90deg);
	-moz-transform: rotate(-90deg);
	-ms-transform: rotate(-90deg);
	-o-transform: rotate(-90deg);
	transform: rotate(-90deg);
}

.panel-heading [data-toggle="collapse"].collapsed:after {
	-webkit-transform: rotate(90deg);
	-moz-transform: rotate(90deg);
	-ms-transform: rotate(90deg);
	-o-transform: rotate(90deg);
	transform: rotate(90deg);
}

.thumbnail.hidden-xs {
	float: left;
	height: 78px;
	width: 170px
}

.thumbnail.hidden-xs>a>img {
	height: 67px;
	width: 160px;
}

.thumbnail.visible-xs {
	float: left;
	height: 43px;
	width: 85px
}

.thumbnail.visible-xs>a>img {
	height: 33px;
	width: 80px;
}
</style>

<body style="padding-top: 60px; position: relative;">
    <nav id="navbar" class="navbar navbar-default navbar-fixed-top">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand" href="../init/index.php?home="><?php echo $mensagemInicia;?> <i class="fa fa-home fa-1x"></i>
                </a>
            </div>
            <ul class="nav navbar-nav sr-only">
                <li><a title="RSS" href="../rss/rssmapas.php">
                        <i class="material-icons ">rss_feed</i>
                    </a></li>
                <li><a title="JSON" href="../rss/rssmapas.php?output=json">
                        <i class="material-icons ">code</i>
                    </a></li>
            </ul>
        </div>
    </nav>
    <div class="container-fluid migalha">
        <div class="row">
            <div class="btn-group btn-breadcrumb">
                <a class="btn btn-default" href="../init/index.php?home=">i3Geo</a>
                <a class="btn btn-default" style="pointer-events: none">Mapas de usu&aacute;rios</a>
            </div>
        </div>
    </div>
    <!--para as mensagens de alerta-->
    <div class="navbar-fixed-top alert alert-success text-center" style="padding: 0px;"></div>

    <div class="container">
        <div class="row center-block">
            <div class="col-md-12">
                <div class="well hidden escondido">
                    <blockquote id="titulo"></blockquote>

                    <a title="RSS" href="../rss/rssmapas.php" target="_blank" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
                        <i class="material-icons md-18">rss_feed</i>
                    </a>
                    <span>&nbsp;&nbsp;</span>
                </div>
            </div>

        </div>
        <div class="row center-block">
            <div class="col-md-12">
                <div class="well" id="corpo">
                    <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i> <span class="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    </div>
    <div id="modal" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body"></div>
            </div>
        </div>
    </div>
	<?php
include ("templates/templatelinks.php");
include ("templates/templatelista.php");
?>
    <script src='../pacotes/ol4/ol.js'></script>
    <script src='../js/i3geo_tudo_compacto8.js.php'></script>
    <script src='dicionario.js'></script>
    <script src='index.js'></script>
    <script>
	$(document).ready(function(){
		i3GEO.configura = {"locaplic" : window.location.href.split("/mapas")[0],"sid": ""};
		//traducoes de alguns elementos individualmente
		$(".active").html(
			$trad("mapas",g_traducao_mapas)
		);
		$("#titulo").html(
			$trad("txtDesc",g_traducao_mapas)
		);
		mostraBotoesBT();
		$('.escondido').removeClass('hidden');
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