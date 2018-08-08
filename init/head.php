<?php
if(extension_loaded('zlib')){
    ob_start('ob_gzhandler');
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
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
    <link rel='stylesheet' type='text/css' href='" . ONDEI3GEO . "/pacotes/bootstrap-material-design/dist/css/bootstrap-material-design.min.css'>
    <link rel='stylesheet' type='text/css' href='" . ONDEI3GEO . "/pacotes/bootstrap-material-design/dist/css/ripples.min.css'>
    <link href='" . ONDEI3GEO . "/pacotes/bootstrap-accessibility-plugin/plugins/css/bootstrap-accessibility.css' rel='stylesheet'>

    <script src='" . ONDEI3GEO . "/init/headjs.php'></script>";
?>
<style>
#brasil {
	background-image: url("../imagens/sprite.png");
	background-position: 0 -600px;
	background-repeat: no-repeat;
	cursor: pointer;
	height: 13px;
	width: 22px;
}

#uk {
	background-image: url("../imagens/sprite.png");
	background-position: 0 -625px;
	background-repeat: no-repeat;
	cursor: pointer;
	height: 13px;
	width: 22px;
}

#espanhol {
	background-image: url("../imagens/sprite.png");
	background-position: 0 -1400px;
	background-repeat: no-repeat;
	cursor: pointer;
	height: 13px;
	width: 22px;
}

#bandeiras img {
	margin-left: 7px;
}

#bandeiras {
	width: 100px;
	text-align: left;
}

hr {
	border-color: #fff -moz-use-text-color -moz-use-text-color;
}

#menuTpl a:focus, #menuTpl a:hover {

}
#menuTpl ul {

}
#menuTpl li {

}
.navbar-collapse { max-height: 100% !important; }

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
body{
	background-color: rgb(245,245,245);
}

/* conforme regra de acessibilidade */
.navbar, .navbar.navbar-default, .btn.btn-fab.btn-primary {
    background-color: #008579;
}
.alert.alert-danger {
	background-color: #e13023;
}
.alert.alert-warning {
    background-color: #de3601;
}
a, a:focus, a:hover {
    color: #008579;
}

.breadcrumb a, .breadcrumb a:focus, .breadcrumb a:hover {
	color: #007e72;
}

.breadcrumb>.active, .breadcrumb>li+li::before {
	color: #707070;
}

a, a:focus, a:hover {
	color: #008579;
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

.form-group.form-group-lg .checkbox label, .form-group.form-group-lg .radio label, .form-group.form-group-lg label {
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

.material-icons.md-18 { font-size: 18px; }

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

.btn-breadcrumb a:nth-child(1) { z-index:6; }
.btn-breadcrumb a:nth-child(2) { z-index:7; }
.btn-breadcrumb a:nth-child(3) { z-index:4; }
.btn-breadcrumb a:nth-child(4) { z-index:3; }
.btn-breadcrumb a:nth-child(5) { z-index:2; }
.btn-breadcrumb a:nth-child(6) { z-index:1; }


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
.navbar {
    font-size: 1.8rem;
}
#navbar {
    min-height: 60px;
    max-height: 60px;
    height: 60px;
}

.panel {
    border-radius: 2px;
    border: 0;
    -webkit-box-shadow: 0 1px 6px 0 rgba(0,0,0,.12),0 1px 6px 0 rgba(0,0,0,.12);
    box-shadow: 0 1px 1px 0 rgba(0,0,0,.12),0 1px 1px 0 rgba(0,0,0,.2);
}

.thumbnail {
    display: block;
    padding: 0px;
    margin-bottom: 20px;
    line-height: 0;
    background-color: unset;
    border: 0px;
    border-radius: 0px;
    -webkit-transition: border .2s ease-in-out;
    -o-transition: border .2s ease-in-out;
    transition: border .2s ease-in-out;
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
#botoesTpl {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
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

/* === For phones =================================== */
@media (max-width: 767px) {
    .btn-breadcrumb > *:nth-last-child(-n+2) {
        display:block;
    }
    .btn-breadcrumb > * div {
        max-width: 60px;
    }

}

/* === For tablets ================================== */
@media (min-width: 768px) and (max-width:991px) {
    .btn-breadcrumb > *:nth-last-child(-n+4) {
        display:block;
    }
    .btn-breadcrumb > * div {
        max-width: 100px;
    }
}

/* === For desktops ================================== */
@media (min-width: 992px) {
    .btn-breadcrumb > *:nth-last-child(-n+6) {
        display:block;
    }
    .btn-breadcrumb > * div {
        max-width: 170px;
    }

}

</style>

</head>
