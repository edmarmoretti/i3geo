<?php
echo "
    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src='" . ONDEI3GEO . "/pacotes/jquery/dist/jquery.min.js'></script>
    <script src='" . ONDEI3GEO . "/pacotes/bootstrap/js/bootstrap.min.js'></script>
    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <script src='" . ONDEI3GEO . "/pacotes/bootstrap/js/ie10-viewport-bug-workaround.js'></script>
    <script>
    $(document).ready(function () {
    	  $('[data-toggle=\'offcanvas\']').click(function () {
    	    $('.row-offcanvas').toggleClass('active')
    	  });
    	});
    </script>
";
?>