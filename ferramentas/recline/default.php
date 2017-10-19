<?php
//pega a extensao geografica da camada
include_once (dirname(__FILE__)."/../../classesphp/sani_request.php");
$_GET = array_merge($_GET,$_POST);
include("../../ms_configura.php");
include("../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
include("../../classesphp/funcoes_gerais.php");
$versao = versao();
$versao = $versao["principal"];
if(isset($base) && $base != ""){
	if(file_exists($base)){
		$f = $base;
	}
	else{
		$f = $locaplic."/aplicmap/".$base.".map";
	}
}
else
{
	$f = "";
	if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')){
		$f = $locaplic."/aplicmap/geral1windowsv".$versao.".map";
	}
	else{
		if($f == "" && file_exists('/var/www/i3geo/aplicmap/geral1debianv'.$versao.'.map')){
			$f = "/var/www/i3geo/aplicmap/geral1debianv".$versao.".map";
		}
		if($f == "" && file_exists('/var/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
			$f = "/var/www/html/i3geo/aplicmap/geral1fedorav".$versao.".map";
		}
		if($f == "" && file_exists('/opt/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
			$f = "/opt/www/html/i3geo/aplicmap/geral1v".$versao.".map";
		}
		if($f == "")
		{
			$f = $locaplic."/aplicmap/geral1v".$versao.".map";
		}
	}
}
$mapext = "-180,-90,180,90";
if(@ms_newMapObj($f)){
	$mapa = ms_newMapObj($f);
	$c = $mapa->extent;
	$mapext = $c->minx.",".$c->miny.",".$c->maxx.",".$c->maxy;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Recline.js Multiview</title>

<!-- you do not have to use bootstrap but we use it by default -->

<link rel="stylesheet" href="../../pacotes/knightlab/recline/vendor/bootstrap/3.2.0/css/bootstrap.css">
<!-- vendor css -->
<link href="../../pacotes/knightlab/recline/vendor/leaflet/0.7.3/leaflet.css" rel="stylesheet">
<link href="../../pacotes/knightlab/recline/vendor/leaflet.markercluster/MarkerCluster.css" rel="stylesheet">
<link href="../../pacotes/knightlab/recline/vendor/leaflet.markercluster/MarkerCluster.Default.css" rel="stylesheet">
<link rel="stylesheet" href="../../pacotes/knightlab/recline/vendor/slickgrid/2.2/slick.grid.css">
<link rel="stylesheet" href="../../pacotes/knightlab/recline/vendor/timeline/css/timeline.css">

<!-- recline css -->
<link href="../../pacotes/knightlab/recline/css/map.css" rel="stylesheet">
<link href="../../pacotes/knightlab/recline/css/multiview.css" rel="stylesheet">
<link href="../../pacotes/knightlab/recline/css/slickgrid.css" rel="stylesheet">
<link href="../../pacotes/knightlab/recline/css/flot.css" rel="stylesheet">
<link rel="stylesheet" href="../../pacotes/knightlab/recline/css/timeline.css">

<!-- Vendor JS - general dependencies -->
<script src="../../pacotes/knightlab/recline/vendor/jquery/1.7.1/jquery.js" type="text/javascript"></script>
<script src="../../pacotes/knightlab/recline/vendor/underscore/1.4.4/underscore.js" type="text/javascript"></script>
<!--<script src="vendor/underscore.deferred/0.4.0/underscore.deferred.js" type="text/javascript"></script>-->
<script src="../../pacotes/knightlab/recline/vendor/backbone/1.0.0/backbone.js" type="text/javascript"></script>
<script src="../../pacotes/knightlab/recline/vendor/mustache/0.5.0-dev/mustache.js" type="text/javascript"></script>
<script src="../../pacotes/knightlab/recline/vendor/bootstrap/3.2.0/js/bootstrap.js" type="text/javascript"></script>

<!-- Vendor JS - view dependencies -->
<script src="../../pacotes/knightlab/recline/vendor/leaflet/0.7.3/leaflet.js" type="text/javascript"></script>
<script src="../../pacotes/knightlab/recline/vendor/leaflet.markercluster/leaflet.markercluster.js" type="text/javascript"></script>
<script type="text/javascript" src="../../pacotes/knightlab/recline/vendor/flot/jquery.flot.js"></script>
<script type="text/javascript" src="../../pacotes/knightlab/recline/vendor/flot/jquery.flot.time.js"></script>
<script type="text/javascript" src="../../pacotes/knightlab/recline/vendor/moment/2.0.0/moment.js"></script>
<script type="text/javascript" src="../../pacotes/knightlab/recline/vendor/timeline/js/timeline.js"></script>

<script src="../../pacotes/knightlab/recline/vendor/slickgrid/2.2/jquery-ui-1.8.16.custom.min.js"></script>
<script src="../../pacotes/knightlab/recline/vendor/slickgrid/2.2/jquery.event.drag-2.2.js"></script>
<script src="../../pacotes/knightlab/recline/vendor/slickgrid/2.2/jquery.event.drop-2.2.js"></script>
<script src="../../pacotes/knightlab/recline/vendor/slickgrid/2.2/slick.core.js"></script>
<script src="../../pacotes/knightlab/recline/vendor/slickgrid/2.2/slick.formatters.js"></script>
<script src="../../pacotes/knightlab/recline/vendor/slickgrid/2.2/slick.editors.js"></script>
<script src="../../pacotes/knightlab/recline/vendor/slickgrid/2.2/slick.grid.js"></script>
<script src="../../pacotes/knightlab/recline/vendor/slickgrid/2.2/plugins/slick.rowselectionmodel.js" type="text/javascript"></script>
<script src="../../pacotes/knightlab/recline/vendor/slickgrid/2.2/plugins/slick.rowmovemanager.js" type="text/javascript"></script>

<!-- Recline JS (combined distribution, all views) -->
<script src="../../pacotes/knightlab/recline/dist/recline.js" type="text/javascript"></script>
<!-- Openlayers -->
<script type="text/javascript" src="../../mashups/openlayers_compacto.js.php"></script>
<link rel="stylesheet" href="../../mashups/openlayers_compacto.css" type="text/css" />
<style>
.yui-skin-sam .container-minimiza {
	background: transparent
		url(../../pacotes/yui290/build/assets/skins/sam/sprite.png) no-repeat
		scroll 0 -450px;
	cursor: pointer;
	height: 15px;
	position: absolute;
	right: 30px;
	top: 1px;
	width: 25px;
	z-index: 2001;
	opacity: .8;
	filter: alpha(opacity = 80);
}

.pluginParametrossql {
	background-image: url("../../imagens/gisicons/settings.png");
	background-size: 14px auto;
	cursor: pointer;
	position: relative;
	top: 3px;
	width: 14px;
}

.i3GEOiconeTme, .i3GEOiconeStorymap {
	background-size: 14px auto;
	cursor: pointer;
	position: relative;
	top: 2px;
	width: 14px;
	margin-right: 2px;
}

.ajuda_usuario {
	background-image: url(../../imagens/external.png);
	background-position: 0px 0px;
	background-repeat: no-repeat;
	margin-left: 0;
	text-decoration: none;
	cursor: help;
	position: relative;
	top: 2px;
	font-size: 13px;
}
</style>
</head>
<body class=" yui-skin-sam">
	<div class="borda">
		<div style="text-align: center">
			<a href="http://www.softwarepublico.gov.br" target="_blank" style="color: white;">
				<b>ReclineJS</b>
			</a>
		</div>
	</div>
	<div id=i3geoSelTemaAtivo style="height: 15em; z-index: 3000; display: none" class=" yui-skin-sam"></div>
	<br>
	<br>
	<div class="container-fluid" style="height: 100%">
<style>
.recline-slickgrid {
	height: 300px;
}
</style>
		<div class="row">
			<div class="col-sm-8">
				<div class="data-explorer-here"></div>
				<div style="clear: both;"></div>
			</div>
			<div class="col-sm-8">
				<div id=i3geoMapa style="width: 100%;height:450px;margin-top:5px;"></div>
			</div>
		</div>

		<script>
//define como variavel global
var dadosJ;
returnData = function(dataFromJsonp){
	dadosJ = dataFromJsonp;
	jQuery(function($) {
		  window.multiView = null;
		  window.explorerDiv = $('.data-explorer-here');

		  // create the demo dataset
		  var dataset = createDataset(dadosJ);
		  // now create the multiview
		  // this is rather more elaborate than the minimum as we configure the
		  // MultiView in various ways (see function below)
		  window.multiview = createMultiView(dataset);

		  // last, we'll demonstrate binding to changes in the dataset
		  // this will print out a summary of each change onto the page in the
		  // changelog section
		  dataset.records.bind('all', function(name, obj) {
		    var $info = $('<div />');
		    $info.html(name + ': ' + JSON.stringify(obj.toJSON()));
		    $('.changelog').append($info);
		    $('.changelog').show();
		  });
		});
};

// create standard demo dataset
function createDataset(data) {
  var dataset = new recline.Model.Dataset(data);
  return dataset;
}

// make MultivView
//
// creation / initialization in a function so we can call it again and again
var createMultiView = function(dataset, state) {
  // remove existing multiview if present
  var reload = false;
  if (window.multiView) {
    window.multiView.remove();
    window.multiView = null;
    reload = true;
  }

  var $el = $('<div />');
  $el.appendTo(window.explorerDiv);

  // customize the subviews for the MultiView
  var views = [
    {
      id: 'grid',
      label: 'Tabela',
      view: new recline.View.SlickGrid({
        model: dataset,
        state: {
          gridOptions: {
            editable: true,
            // Enable support for row add
            enabledAddRow: true,
            // Enable support for row delete
            enabledDelRow: true,
            // Enable support for row ReOrder
            enableReOrderRow:true,
            autoEdit: false,
            enableCellNavigation: true
          },
          columnsEditor: [
            { column: 'date', editor: Slick.Editors.Date },
            { column: 'sometext', editor: Slick.Editors.Text }
          ]
        }
      })
    },
    {
      id: 'graph',
      label: 'Grafico',
      view: new recline.View.Graph({
        model: dataset

      })
    },
    {
      id: 'map',
      label: 'Mapa (baseado na tabela)',
      view: new recline.View.Map({
        model: dataset
      })
    }
  ];

  var multiView = new recline.View.MultiView({
    model: dataset,
    el: $el,
    state: state,
    views: views
  });
  return multiView;
}
//Mapa i3Geo
OpenLayers.ImgPath = "../../pacotes/openlayers/img/";
OpenLayers.Lang.setCode("pt-BR");
var m = document.getElementById("i3geoMapa");
if(parseInt(m.style.width,10) === 0){
	var t = i3GEO.util.tamanhoBrowser();
	m.style.width = (t[0]-10)+"px";
	m.style.height = (t[1]-20)+"px";
}
var camada = "<?php echo strip_tags($_GET["tema"]);?>";
i3GEO.editorOL.layersIniciais = [new OpenLayers.Layer.WMS( camada, "../../ogc.php?tema="+camada+"&DESLIGACACHE=&",{opacity:1,layers:camada,transparent: "true", format: "image/png"},{transitionEffect: "resize", singleTile:true,visibility:true,isBaseLayer:false, ferramentas :{}})];
i3GEO.editorOL.botoes = {'pan':true,'zoombox':true,'zoomtot':true,'identifica':true} ;i3GEO.editorOL.pontos = [];
i3GEO.editorOL.kml = [];
i3GEO.editorOL.marca = "../../pacotes/openlayers/img/marker-gold.png";
i3GEO.editorOL.tiles = "true";
i3GEO.editorOL.incluilayergrafico = "true";
i3GEO.editorOL.ativalayerswitcher = "false";
i3GEO.editorOL.ativarodadomouse = "false";

i3GEO.editorOL.legendahtml = "true";

i3GEO.editorOL.maxext = new OpenLayers.Bounds(<?php echo $mapext;?>);
i3GEO.editorOL.mapext = new OpenLayers.Bounds(<?php echo $mapext;?>);
i3GEO.Interface = {openlayers:{googleLike:false}};
//evita que seja mostrada a opcao de salvar figura
i3GEO.editorOL.nomeFuncaoSalvar = "";
var temp = i3GEO.editorOL.minresolution,
	r = [ i3GEO.editorOL.minresolution ];
for (var j = 0; j < (i3GEO.editorOL.numzoom - 1); j++) {
	temp = temp / 2;
	r.push(temp);
}
i3GEO.editorOL.incluilayergrafico = true;
i3GEO.editorOL.mapa = new OpenLayers.Map(
	'i3geoMapa',
	{
		autoUpdateSize: false,
		controls:[],
		resolutions: r,
		minResolution: i3GEO.editorOL.minresolution
	}
);
if(i3GEO.configura.locaplic === ""){
	i3GEO.configura.locaplic = "../../";
}
	i3GEO.editorOL.inicia();

	function adicionaPluginI3geo(camada,visivel){
		if(!camada.cache){
			camada["cache"] = "NAO";
		}
		var l = i3GEO.pluginI3geo.layerMashup("openlayers",camada,"4326"),
			n,
			i;
			n = l.length;
		for(i = 0; i < n; i++){
			if(l[i].displayInLayerSwitcher === true){
				l[i].setVisibility(visivel);
			}
			if(l[i] != true){
				i3GEO.editorOL.layersIniciais.push(l[i]);
			}
		}
	}
</script>
		<?php
		//inclui os dados via jsonp
		$url = "../../json.php?tema=".strip_tags($_GET["tema"])."&format=gdocs&jsonp=returnData";
		echo "<script src='$url' ></script>";
		?>
	</div>
</body>
</html>
