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
    <link rel='stylesheet' type='text/css' href='" . ONDEI3GEO . "/css/font/material-icons.css'>
    <!-- Bootstrap core CSS -->
    <link href='" . ONDEI3GEO . "/pacotes/bootstrap/css/bootstrap.min.css' rel='stylesheet'>
    <!-- Bootstrap Material Design -->
    <link rel='stylesheet' type='text/css' href='" . ONDEI3GEO . "/pacotes/bootstrap-material-design/dist/css/bootstrap-material-design.min.css'>
    <link rel='stylesheet' type='text/css' href='" . ONDEI3GEO . "/pacotes/bootstrap-material-design/dist/css/ripples.min.css'>
    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <link href='" . ONDEI3GEO . "/pacotes/bootstrap/css/ie10-viewport-bug-workaround.css' rel='stylesheet'>
    <!-- Custom styles for this template -->
    <link href='" . ONDEI3GEO . "/pacotes/font-awesome/css/font-awesome.min.css' rel='stylesheet'>

    <link href='" . ONDEI3GEO . "/pacotes/bootstrap-accessibility-plugin/plugins/css/bootstrap-accessibility.css' rel='stylesheet'>

    <script src='" . ONDEI3GEO . "/admin/headjs.php'></script>
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
	height: 28px;
	min-width: 28px;
	padding-bottom: 6px;
	padding-left: 6px;
	padding-right: 6px;
	padding-top: 6px;
	width: 28px;
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

.material-icons.md-18 {
	font-size: 18px;
}

body {
	background-color: background-color: rgb(240, 240, 250);;
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

.navbar .dropdown-menu li>a, .navbar.navbar-default .dropdown-menu li>a
	{
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

.ui-autocomplete {
	z-index: 10000;
}

.panel-heading.icon [data-toggle="collapse"]:after {
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

.panel-heading.icon [data-toggle="collapse"].collapsed:after {
	-webkit-transform: rotate(90deg);
	-moz-transform: rotate(90deg);
	-ms-transform: rotate(90deg);
	-o-transform: rotate(90deg);
	transform: rotate(90deg);
}
/* conforme regra de acessibilidade */
.navbar, .navbar.navbar-default {
	background-color: #FF6F61;
}

.breadcrumb a, .breadcrumb a:focus, .breadcrumb a:hover {
	color: #007e72;
}

.breadcrumb>.active, .breadcrumb>li+li::before {
	color: #707070;
}

a, a:focus, a:hover {
	color: #FF6F61;
}

.alert.alert-warning {
	background-color: #de3601;
}

.form-group.form-group-lg {
	margin-top: 10px;
}

.form-group.form-group-lg label.control-label {
	color: #767676;
}

.form-group.form-group-lg .checkbox label, .form-group.form-group-lg .radio label,
	.form-group.form-group-lg label {
	color: #767676;
}

h2 small {
	color: #767676;
}

.migalha {
	background-color: rgb(255, 255, 255);
	border-bottom-width: 0px;
	margin-bottom: 20px;
	height: 32px;
	margin-top: 0px;"
}

.migalha span{
	text-transform: none;
}
/* snack */
#snackbar-container {
  position: fixed;
  left: 20px;
  bottom: 0;
  z-index: 99999;
}
.snackbar {
  overflow: hidden;
  clear: both;
  min-width: 288px;
  max-width: 568px;
  cursor: pointer;
  opacity: 0;
}
.snackbar.red {
    background-color: red;
}
.snackbar:after {
    font-family: "Glyphicons Halflings";
    content: "\e014";
    float: right;
    color: white;
    font-size: 14px;
    top: 0px;
    position: absolute;
    right: 5px;
}
.snackbar.snackbar-opened {
  height: auto;
  opacity: 1;
}
@media (max-width: 767px) {
  #snackbar-container {
    left: 0px !important;
    right: 0px;
    width: 100%;
  }
  #snackbar-container .snackbar {
    min-width: 100%;
  }
  #snackbar-container [class="snackbar snackbar-opened"] ~ .snackbar.toast {
    margin-top: 20px;
  }
  #snackbar-container [class="snackbar snackbar-opened"] {
    border-radius: 0;
    margin-bottom: 0;
  }
}

/* Breadcrumbs from http://bootsnipp.com/snippets/featured/triangle-breadcrumbs-arrows */
.btn-breadcrumb .btn:not(:last-child):after {
  content: " ";
  display: block;
  width: 0;
  height: 0;
  border-top: 17px solid transparent;
  border-bottom: 17px solid transparent;
  border-left: 10px solid white;
  position: absolute;
  top: 50%;
  margin-top: -17px;
  left: 100%;
  z-index: 3;
}
.btn-breadcrumb .btn:not(:last-child):before {
  content: " ";
  display: block;
  width: 0;
  height: 0;
  border-top: 17px solid transparent;
  border-bottom: 17px solid transparent;
  border-left: 10px solid rgb(173, 173, 173);
  position: absolute;
  top: 50%;
  margin-top: -17px;
  margin-left: 1px;
  left: 100%;
  z-index: 3;
}

.btn-breadcrumb .btn {
  padding:6px 12px 6px 24px;
}

.btn-group.btn-breadcrumb {
  margin-bottom: 0px;
  margin-top: 0px;
}

.btn-breadcrumb .btn:first-child {
  padding:6px 6px 6px 10px;
}
.btn-breadcrumb .btn:last-child {
  padding:6px 18px 6px 24px;
}

/** Default button **/
.btn-breadcrumb .btn.btn-default:not(:last-child):after {
  border-left: 10px solid rgb(255, 255, 255);
}
.btn-breadcrumb .btn.btn-default:not(:last-child):before {
  border-left: 10px solid #ccc;
}
.btn-breadcrumb .btn.btn-default:hover:not(:last-child):after {
  border-left: 10px solid #ebebeb;
}
.btn-breadcrumb .btn.btn-default:hover:not(:last-child):before {
  border-left: 10px solid #adadad;
}

.btn-breadcrumb a:nth-child(1) { z-index:7; }
.btn-breadcrumb a:nth-child(2) { z-index:6; }
.btn-breadcrumb a:nth-child(3) { z-index:5; }
.btn-breadcrumb a:nth-child(4) { z-index:4; }
.btn-breadcrumb a:nth-child(5) { z-index:3; }
.btn-breadcrumb a:nth-child(6) { z-index:2; }
.btn-breadcrumb a:nth-child(7) { z-index:1; }

/* The responsive part */

.btn-breadcrumb > * > div {
    /* With less: .text-overflow(); */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: none;
}

.btn-breadcrumb > *:nth-child(n+2) {
  display:none;
}

/* botoes de expandir textos do tipo leia-mais */
a .readMore {
    display: none;
}

a .readLess {
    display: inline;
}

a.collapsed .readMore {
    display: inline;
}

a.collapsed .readLess {
    display: none;
}
.leiaMais:not(.in) {
    min-height: 2.25em;
    height: 2.25em;
    display: block;
    overflow: hidden;

}
.navbar {
    font-size: 1.8rem;
}
#navbar {
    min-height: 60px;
    max-height: 60px;
    height: 60px;
}
/* === For phones =================================== */
@media ( max-width : 767px) {
	.btn-breadcrumb>*:nth-last-child(-n+2) {
		display: block;
	}
	.btn-breadcrumb>* div {
		max-width: 60px;
	}
}

/* === For tablets ================================== */
@media ( min-width : 768px) and (max-width:991px) {
	.btn-breadcrumb>*:nth-last-child(-n+4) {
		display: block;
	}
	.btn-breadcrumb>* div {
		max-width: 100px;
	}
}

/* === For desktops ================================== */
@media ( min-width : 992px) {
	.btn-breadcrumb>*:nth-last-child(-n+6) {
		display: block;
	}
	.btn-breadcrumb>* div {
		max-width: 170px;
	}
}

.btn-breadcrumb a:not ([style*="pointer-events: none"] ) >span {
	text-decoration: underline;
}
</style>
</head>
<script id="iconeAguardeTpl" type="x-tmpl-mustache">
<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i> <span class="sr-only">Loading...</span>
</script>
<!-- Template para o Modal de confirmacao -->
<script id="modalConfirmaTpl" type="x-tmpl-mustache">
	<h4 class="pull-right">{{{mensagem}}}</h4>
	<div class="clearfix"></div>
	<div class="pull-right">
		<button onclick="{{{onBotao1}}}" class="btn btn-primary" role="button" style="color:#FF6F61;">{{{botao1}}}</button>
		<button onclick="{{{onBotao2}}}" class="btn btn-primary" role="button" style="color:#FF6F61;">{{{botao2}}}</button>
	</div>
	<div class="clearfix"></div>
</script>

<body style="padding-top: 55px;" id="topo">
	<nav class="navbar navbar-default navbar-fixed-top" style="margin-bottom: 0px; max-height: 55px; height: 55px;">
		<div class="container-fluid">
			<div class="navbar-header">
				<button title="icon bar" type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
					<span class="sr-only"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="<?php echo ONDEI3GEO; ?>/init/index.php"><?php echo $_SESSION["mensagemInicia"];?> <i class="fa fa-home fa-1x"></i>
				</a>
			</div>
			<div id="navbar" class="navbar-collapse collapse navbar-responsive-collapse">
				<ul class="nav navbar-nav" id="menuPrincipalTpl">
				</ul>
				<ul class="nav navbar-nav">
					<li class="dropdown">
						<a role="button" onclick="i3GEO.login.recarrega = true; i3GEO.login.dialogo.abreLogin('<?php echo ONDEI3GEO; ?>');" href="#topo" data-toggle="modal"
							data-target="#modalLogin">
							Login <i id="loginOff" style="display: none;" class="material-icons md-18">lock</i><i id="loginOn" style="display: none;" class="material-icons md-18">lock_open</i>
						</a>
					</li>
				</ul>
			</div>
		</div>
	</nav>
	<!-- Modal para o filtro -->
	<div id="modalFiltro" class="modal fade" tabindex="-1">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body modal-lg" style="height: 200px">
					<!-- aqui entra o filtro -->
					<div class="form-group">
						<select title="{{{filtroTxt}}}" title="{{{filtroTxt}}}" onchange="i3GEOadmin.core.filtra(this)" id="filtro" class="form-control input-lg">
						</select>
					</div>
					<div class="clearfix"></div>
				</div>
			</div>
		</div>
	</div>

	<!--Modal de uso geral Varia apenas o body -->
	<div id="modalGeral" class="modal fade" tabindex="-1">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body modal-lg"></div>
			</div>
		</div>
	</div>
	<!--Modal usado para preview da arvore do catalogo -->
	<div id="previewArvore" class="modal fade" tabindex="-1">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body" style="overflow: auto; height: 400px;"></div>
			</div>
		</div>
	</div>
    <?php include (dirname(__FILE__) . "/../interface/inc/modallogin.php");?>

	<nav class="navbar-fixed-bottom">
		<div class="container"></div>
	</nav>
	<!-- ate aqui veio de admin/head.php -->