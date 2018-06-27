<?php
define("ONDEI3GEO", "..");
include (dirname(__FILE__) . "/../ms_configura.php");
include_once (dirname(__FILE__) . "/../classesphp/sani_request.php");
// error_reporting ( 0 );
// pega a extensao geografica
if ($ogcwsmap == "") {
    $ogcwsmap = $locaplic . "/aplicmap/ogcws.map";
}
$map = ms_newMapObj($ogcwsmap);
$mapext = $map->extent->minx . "," . $map->extent->miny . "," . $map->extent->maxx . "," . $map->extent->maxy;
include (ONDEI3GEO . "/init/head.php");
if (! isset($_GET["temaOgc"])) {
    $_GET["temaOgc"] = "";
}
if (! isset($_GET["temaDownload"])) {
    $_GET["temaDownload"] = "";
}
?>
<link rel='stylesheet' type='text/css' href='index.css'>
<body style="padding-top: 60px;" id="topo">
    <nav class="navbar navbar-default navbar-fixed-top">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="../init/index.php?home="><?php echo $mensagemInicia;?> <i class="fa fa-home fa-1x"></i>
                </a>
            </div>
            <!-- template para permitir a traducao -->
            <div id="navbar" class="collapse navbar-collapse">
                <div id="menuTpl" class="escondido hidden">
                    <ul class="nav navbar-nav">
                        <li><a href="../kml.php?tipoxml=kml" target="_blank">Kml Google Earth</a></li>
                        <li><a href="javascript:void(0)" onclick="ogc.menus.listaCompleta()" aria-controls="#listaCompleta">{{{lista}}}</a></li>
                        <li><a href="javascript:void(0)" onclick="ogc.menus.lista()" aria-controls="#listaCompleta">{{{listaGrupos}}}</a></li>

                    </ul>
                </div>
            </div>
        </div>
    </nav>
    <div class="container-fluid migalha">
        <div class="row">
            <div class="btn-group btn-breadcrumb">
                <a class="btn btn-default" href="../init/index.php?home=">i3Geo</a>
                <a class="btn btn-default" style="pointer-events: none">OGC</a>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="row center-block">
            <div class="col-md-12">
                <div class="well hidden escondido">
                    <blockquote id="titulo"></blockquote>
                </div>
            </div>
        </div>
        <div class="row center-block">
            <div class="col-md-12">
                <div class="well" id="corpo">
                    <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    </div>

<?php include(ONDEI3GEO."/ogc/templates/modal.php");?>
<?php include(ONDEI3GEO."/ogc/templates/templatelista.php");?>
<?php include(ONDEI3GEO."/ogc/templates/templatecamadas.php");?>
<?php include(ONDEI3GEO."/ogc/templates/templatelinksogc.php");?>
<?php include(ONDEI3GEO."/ogc/templates/templatelinksdownload.php");?>

<script src='headjs.php'></script>
    <script src='index.js?27062018'></script>
    <script src='dicionario.js'></script>
    <script>
	$(document).ready(function(){
		i3GEO.configura = {"locaplic" : "..","sid": ""};

		var servico = window.location.href.split("/ogc")[0]+"/ogc.php?";
		tradLinks = i3GEO.idioma.objetoIdioma(ogc.dicionario);
		tradLinks["servico"] = servico;
		tradLinks["url"] = window.location.href.split("#")[0];
		tradLinks["url"] = tradLinks["url"].split("?")[0];
		tradLinks["urli3geo"] = window.location.href.split("/ogc")[0];
		tradLinks["mapext"] = "<?php echo $mapext;?>";

		//traducoes de alguns elementos individualmente
		$("#titulo").html(
			$trad("txtDesc",ogc.dicionario)
		);

		var html = Mustache.to_html(
			$("#menuTpl").html(),
			tradLinks
		);
		$("#menuTpl").html(html);
		$('.escondido').removeClass('hidden');
		ogc.menus.init($("#corpo"));

		//verifica se deve abrir de imediato a janela de links
		var temaOgc = "<?php echo $_GET["temaOgc"];?>";
		if(temaOgc != ""){
			$("#modal").modal('show');
			ogc.menus.mostraLinksServico(temaOgc);

		}
		var temp = window.location.href.split("temaDownload=");
		var temaDownload = "<?php echo $_GET["temaDownload"];?>";
		if(temaDownload != ""){
			$("#modal").modal('show');
			ogc.menus.mostraLinksDownload(temaDownload);
		}
	});
</script>
</body>
</html>
<?php
if(extension_loaded('zlib')){
    ob_end_flush();
}
?>