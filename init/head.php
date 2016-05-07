<?php
//utilizado para o cabecalho das paginas que nao sao mapas e que usam bootstrap com material design
echo "
	<meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name='description' content='Interface Integrada para Internet de ferramentas de geoprocessamento'>
    <meta name='author' content='i3Geo'>
    <link rel='icon' href='" . ONDEI3GEO . "/favicon.ico'>
    <title>i3Geo</title>

    <!-- Material Design fonts -->
    <link rel='stylesheet' type='text/css' href='//fonts.googleapis.com/css?family=Roboto:300,400,500,700'>
    <link rel='stylesheet' type='text/css' href='//fonts.googleapis.com/icon?family=Material+Icons'>

    <!-- Bootstrap core CSS -->
    <link href='" . ONDEI3GEO . "/pacotes/bootstrap/css/bootstrap.min.css' rel='stylesheet'>

    <!-- Bootstrap Material Design -->
    <link rel='stylesheet' type='text/css' href='" . ONDEI3GEO . "/pacotes/bootstrap-material-design/dist/css/bootstrap-material-design.css'>
    <link rel='stylesheet' type='text/css' href='" . ONDEI3GEO . "/pacotes/bootstrap-material-design/dist/css/ripples.min.css'>


    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <link href='" . ONDEI3GEO . "/pacotes/bootstrap/css/ie10-viewport-bug-workaround.css' rel='stylesheet'>

    <!-- Custom styles for this template -->

    <link href='" . ONDEI3GEO . "/pacotes/font-awesome/css/font-awesome.min.css' rel='stylesheet'>

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src='https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js'></script>
      <script src='https://oss.maxcdn.com/respond/1.4.2/respond.min.js'></script>
    <![endif]-->
     <script src='" . ONDEI3GEO . "/pacotes/jquery/dist/jquery.min.js'></script>
    <script src='" . ONDEI3GEO . "/pacotes/bootstrap/js/bootstrap.min.js'></script>
    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <script src='" . ONDEI3GEO . "/pacotes/bootstrap/js/ie10-viewport-bug-workaround.js'></script>
";
?>