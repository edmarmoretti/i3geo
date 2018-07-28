<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
<script src="<?php echo $configInc["pathjs"];?>/pacotes/ol4/ol.js"></script>
<script src="<?php echo $configInc["pathjs"];?>/js/i3geo<?php echo $configInc["debug"];?>.js"></script>
<!-- lista com os links que serao mostrados na guia ferramentas -->
<script src="<?php echo $configInc["pathjs"];?>/js/listaDeFerramentas.js?time=<?php echo $configInc["nocache"];?>"></script>
<!-- configuracoes default tipo pode ser OL (openLayers) ou GM (googlemaps) -->
<script src="<?php echo $configInc["pathconfig"];?>/config.php?tipo=<?php echo $configInc["tipo"];?>"></script>
<!-- para o tutorial -->
<script src="<?php echo $configInc["pathjs"];?>/pacotes/bootstrap-tour/build/js/bootstrap-tour.js"></script>
<script src="<?php echo $configInc["pathtutorial"];?>/tutorial.js"></script>
<script src="<?php echo $configInc["pathjs"];?>/pacotes/jquery/jquery-typeahead-2.10.4/dist/jquery.typeahead.min.js"></script>