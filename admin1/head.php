<!DOCTYPE html>
<html lang="pt-br">
<head>
<META HTTP-EQUIV="Content-Type">
<meta charset='utf-8'>
<meta http-equiv='X-UA-Compatible' content='IE=edge'>
<meta name='viewport' content='width=device-width, initial-scale=1'>
<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
<meta name='description' content='Interface Integrada para Internet de ferramentas de geoprocessamento'>
<meta name='author' content='i3Geo'>
<title>i3Geo</title>
<?php
// utilizado para o cabecalho das paginas que nao sao mapas e que usam bootstrap com material design
echo "
    <link rel='icon' href='" . ONDEI3GEO . "/favicon.ico'>
	<link rel='stylesheet' type='text/css' href='" . ONDEI3GEO . "/pacotes/jquery/jquery-ui/jquery-ui.min.css'>
    <!-- Material Design fonts -->
    <link rel='stylesheet' type='text/css' href='//fonts.googleapis.com/css?family=Roboto:300,400,500,700'>
    <link rel='stylesheet' type='text/css' href='//fonts.googleapis.com/icon?family=Material+Icons'>
    <!-- Bootstrap core CSS -->
    <link href='" . ONDEI3GEO . "/pacotes/bootstrap/css/bootstrap.min.css' rel='stylesheet'>
    <!-- Bootstrap Material Design -->
    <link rel='stylesheet' type='text/css' href='" . ONDEI3GEO . "/pacotes/bootstrap-material-design/dist/css/bootstrap-material-design.min.css'>
    <link rel='stylesheet' type='text/css' href='" . ONDEI3GEO . "/pacotes/bootstrap-material-design/dist/css/ripples.min.css'>
    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <link href='" . ONDEI3GEO . "/pacotes/bootstrap/css/ie10-viewport-bug-workaround.css' rel='stylesheet'>
    <!-- Custom styles for this template -->
    <link href='" . ONDEI3GEO . "/pacotes/font-awesome/css/font-awesome.min.css' rel='stylesheet'>

    <script src='". ONDEI3GEO . "/admin1/headjs.php'></script>
";
?>
<script>
	i3GEO.configura = { "locaplic": "<?php echo ONDEI3GEO;?>"};
</script>
<style>
hr {
	border-color: #fff -moz-use-text-color -moz-use-text-color;
}

#menuTpl a:focus, #menuTpl a:hover {

}

#menuTpl ul {

}

#menuTpl li {

}

.navbar-collapse {
	max-height: 100% !important;
}

.btn.btn-fab.btn-fab-mini {
	font-size: 12px;
	height: 24px;
	min-width: 24px;
	padding-bottom: 5px;
	padding-left: 5px;
	padding-right: 5px;
	padding-top: 5px;
	width: 24px;
}

.btn.btn-fab.btn-fab-max {
	font-size: 1.6em;
	height: 40px;
	min-width: 40px;
	padding-bottom: 5px;
	padding-left: 5px;
	padding-right: 5px;
	padding-top: 7px;
	width: 40px;
}

body {
	background-color: background-color: rgb(240,240,250);;
}

.marginBottom-0 {
	margin-bottom: 0;
}

.dropdown-submenu {
	position: relative;
}

.dropdown-submenu>.dropdown-menu {
	top: 0;
	left: 100%;
	margin-top: -6px;
	margin-left: -1px;
	-webkit-border-radius: 0 6px 6px 6px;
	-moz-border-radius: 0 6px 6px 6px;
	border-radius: 0 6px 6px 6px;
}

.dropdown-submenu>a:after {
	display: block;
	content: " ";
	float: right;
	width: 0;
	height: 0;
	border-color: transparent;
	border-style: solid;
	border-width: 5px 0 5px 5px;
	border-left-color: #cccccc;
	margin-top: 5px;
	margin-right: -10px;
}

.dropdown-submenu:hover>a:after {
	border-left-color: #555;
}

.dropdown-submenu.pull-left {
	float: none;
}

.dropdown-submenu.pull-left>.dropdown-menu {
	left: -100%;
	margin-left: 10px;
	-webkit-border-radius: 6px 0 6px 6px;
	-moz-border-radius: 6px 0 6px 6px;
	border-radius: 6px 0 6px 6px;
}

.dropdown-menu li {
	overflow-x: hidden;
	overflow-y: hidden;
	position: unset;
}

.navbar .dropdown-menu li>a, .navbar.navbar-default .dropdown-menu li>a {
	font-size: 1em;
}

#indice .bs-docs-sidebar .nav>.active:focus>a, .bs-docs-sidebar .nav>.active:hover>a,
	.bs-docs-sidebar .nav>.active>a {
	background-color: transparent;
	border-left-color: green;
	border-left-style: solid;
	border-left-width: 2px;
	color: green;
	font-weight: 700;
	padding-left: 18px;
}

.ui-menu {
	overflow-y: auto;
	max-height: 100px;
}

.ui-menu-item {
	width: 95%;
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
</style>
</head>
<script id="iconeAguardeTpl" type="x-tmpl-mustache">
<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i> <span class="sr-only">Loading...</span>
</script>
<!-- Template para o Modal de confirmacao -->
<script  id="modalConfirmaTpl" type="x-tmpl-mustache">
	<button class="btn btn-primary btn-fab btn-fab-mini pull-left">
		<i class="material-icons">help</i>
	</button>
	<h4 class="pull-right">{{{mensagem}}}</h4>
	<div class="clearfix"></div>
	<div class="pull-right">
		<button onclick="{{{onBotao1}}}" class="btn btn-primary" role="button">{{{botao1}}}</button>
		<button onclick="{{{onBotao2}}}" class="btn btn-primary" role="button">{{{botao2}}}</button>
	</div>
	<div class="clearfix"></div>
</script>

<body style="padding-top: 55px;" id="topo">
	<nav class="navbar navbar-default navbar-fixed-top">
		<div class="container-fluid">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
					data-target="#navbar" aria-expanded="false" aria-controls="navbar">
					<span class="sr-only"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span
						class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="<?php echo ONDEI3GEO; ?>/init/index.php"><?php echo $mensagemInicia;?> <i
					class="fa fa-home fa-1x"></i></a>
			</div>
			<div id="navbar" class="navbar-collapse collapse navbar-responsive-collapse">
				<ul class="nav navbar-nav navbar-right">
					<li class="dropdown"><a
						onclick="i3GEO.login.recarrega = true; i3GEO.login.dialogo.abreLogin('<?php echo ONDEI3GEO; ?>/','template_mst_bt.html');"
						href="#" class="dropdown-toggle" data-toggle="dropdown">Login <span class="caret"></span></a>
						<ul id="i3GEOF_loginusuario" class="dropdown-menu"
							style="min-width: 280px; padding: 10px; background-color: white;">
						</ul></li>
				</ul>
				<ul class="nav navbar-nav" id="menuPrincipalTpl">
				</ul>
			</div>
		</div>
	</nav>
	<!--Modal de uso geral Varia apenas o body -->
	<div id="modalGeral" class="modal fade" tabindex="-1">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-body modal-lg"></div>
			</div>
		</div>
	</div>
	<nav class="navbar-fixed-bottom">
		<div class="container">

		</div>
	</nav>
	<!-- ate aqui veio de admin1/head.php -->