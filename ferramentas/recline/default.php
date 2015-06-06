<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Recline.js Multiview</title>
    <link rel="stylesheet" type="text/css" href="../../admin/html/admin.css">
    <!-- you do not have to use bootstrap but we use it by default -->
    
    <link rel="stylesheet" href="../../pacotes/recline/vendor/bootstrap/3.2.0/css/bootstrap.css">
    <!-- vendor css -->
    <link href="../../pacotes/recline/vendor/leaflet/0.7.3/leaflet.css" rel="stylesheet">
    <link href="../../pacotes/recline/vendor/leaflet.markercluster/MarkerCluster.css" rel="stylesheet">
    <link href="../../pacotes/recline/vendor/leaflet.markercluster/MarkerCluster.Default.css" rel="stylesheet">
    <link rel="stylesheet" href="../../pacotes/recline/vendor/slickgrid/2.2/slick.grid.css">
    
    <!-- recline css -->
    <link href="../../pacotes/recline/css/map.css" rel="stylesheet">

    <link href="../../pacotes/recline/css/multiview.css" rel="stylesheet">
    <link href="../../pacotes/recline/css/slickgrid.css"rel="stylesheet">
    <link href="../../pacotes/recline/css/flot.css" rel="stylesheet">
    
    <!-- Vendor JS - general dependencies -->
    <script src="../../pacotes/recline/vendor/jquery/1.7.1/jquery.js" type="text/javascript"></script>
    <script src="../../pacotes/recline/vendor/underscore/1.4.4/underscore.js" type="text/javascript"></script>
    <!--<script src="vendor/underscore.deferred/0.4.0/underscore.deferred.js" type="text/javascript"></script>-->
    <script src="../../pacotes/recline/vendor/backbone/1.0.0/backbone.js" type="text/javascript"></script>
    <script src="../../pacotes/recline/vendor/mustache/0.5.0-dev/mustache.js" type="text/javascript"></script>
    <script src="../../pacotes/recline/vendor/bootstrap/3.2.0/js/bootstrap.js" type="text/javascript"></script>

    <!-- Vendor JS - view dependencies -->
    <script src="../../pacotes/recline/vendor/leaflet/0.7.3/leaflet.js" type="text/javascript"></script>
    <script src="../../pacotes/recline/vendor/leaflet.markercluster/leaflet.markercluster.js" type="text/javascript"></script>
    <script type="text/javascript" src="../../pacotes/recline/vendor/flot/jquery.flot.js"></script>
    <script type="text/javascript" src="../../pacotes/recline/vendor/flot/jquery.flot.time.js"></script>
    <script type="text/javascript" src="../../pacotes/recline/vendor/moment/2.0.0/moment.js"></script>
    <script src="../../pacotes/recline/vendor/slickgrid/2.2/jquery-ui-1.8.16.custom.min.js"></script>
    <script src="../../pacotes/recline/vendor/slickgrid/2.2/jquery.event.drag-2.2.js"></script>
    <script src="../../pacotes/recline/vendor/slickgrid/2.2/jquery.event.drop-2.2.js"></script>
    <script src="../../pacotes/recline/vendor/slickgrid/2.2/slick.core.js"></script>
    <script src="../../pacotes/recline/vendor/slickgrid/2.2/slick.formatters.js"></script>
    <script src="../../pacotes/recline/vendor/slickgrid/2.2/slick.editors.js"></script>
    <script src="../../pacotes/recline/vendor/slickgrid/2.2/slick.grid.js"></script>
    <script src="../../pacotes/recline/vendor/slickgrid/2.2/plugins/slick.rowselectionmodel.js" type="text/javascript"></script>
    <script src="../../pacotes/recline/vendor/slickgrid/2.2/plugins/slick.rowmovemanager.js" type="text/javascript"></script>

    <!-- Recline JS (combined distribution, all views) -->
    <script src="../../pacotes/recline/dist/recline.js" type="text/javascript"></script>
  </head>
  <body>
	<div class="borda">
		<div style="text-align: center">
			<a href="http://www.softwarepublico.gov.br" target="_blank" style="color: white;">
			<b>ReclineJS</b>
			</a>
		</div>
	</div>
	<br><br>
  <div class="container">
      <style type="text/css">
        .recline-slickgrid {
          height: 300px;
        }

      </style>

      <div class="data-explorer-here"></div>
      <div style="clear: both;"></div>

      <script>
      jQuery(function($) {
  window.multiView = null;
  window.explorerDiv = $('.data-explorer-here');

  // create the demo dataset
  var dataset = createDemoDataset();
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

// create standard demo dataset
function createDemoDataset() {
  var dataset = new recline.Model.Dataset(
	<?php 
		$format = "gdocs";
		include("../../json.php");
		/*
		$curl = curl_init();
		curl_setopt ($curl, CURLOPT_URL, "../../json.php?tema=_lreal&format=recline&");
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		$result = curl_exec($curl);
		curl_close ($curl);
		echo $result;
		*/
	?>
  );
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
      label: 'Gr&aacute;fico',
      view: new recline.View.Graph({
        model: dataset

      })
    },
    {
      id: 'map',
      label: 'Mapa',
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

      
      </script>
    </div>
  </body>
</html>
