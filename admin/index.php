<?php
//
//marca a sessao PHP para evitar forcar o uso da primeira pagina ao navegar pelos outros itens do sistema de administacao
//
session_write_close ();
session_name ( "i3GeoLogin" );
if (! empty ( $_COOKIE ["i3geocodigologin"] )) {
	session_id ( $_COOKIE ["i3geocodigologin"] );
	session_start ();
	if(!isset($_SESSION ["usuario"])){
	    $_SESSION ["usuario"] = "";
	}
	if ($_SESSION ["usuario"] ==  "" || $_SESSION ["usuario"] != $_COOKIE ["i3geousuariologin"]) {
		$_COOKIE = array ();
		$_SESSION = array ();
		session_destroy ();
	}
	else {
		$_SESSION ["initOk"] = true;
	}
}
define ( "ONDEI3GEO", ".." );
//
//inclui na session as variaveis obtidas do ms_configura.php
//
include (dirname ( __FILE__ ) . "/../ms_configura.php");
$_SESSION["locaplic"] = $locaplic;
unset ($locaplic);
//
//define a variavel que armazena o esquema do banco de administracao
//
$_SESSION["esquemaadmin"] = "";
if($esquemaadmin != ""){
	$_SESSION["esquemaadmin"] = str_replace(".","",$esquemaadmin).".";
}
unset ($esquemaadmin);
$_SESSION["conexaoadmin"] = "";
if($conexaoadmin != ""){
	$_SESSION["conexaoadmin"] = $conexaoadmin;
}
unset ($conexaoadmin);
$_SESSION["postgis_mapa"] = $postgis_mapa;
unset($postgis_mapa);
$_SESSION["logTransacoes"] = $logTransacoes;
unset($logTransacoes);
$_SESSION["dir_tmp"] = $dir_tmp;
unset($dir_tmp);
$_SESSION["cachedir"] = $cachedir;
unset($cachedir);
$_SESSION["mensagemInicia"] = $mensagemInicia;
unset($mensagemInicia);
$_SESSION["i3geoPermiteLoginIp"] = $i3geoPermiteLoginIp;
unset($i3geoPermiteLoginIp);
$_SESSION["i3geoPermiteLogin"] = $i3geoPermiteLogin;
unset($i3geoPermiteLogin);
$_SESSION["i3geoUploadDataWL"] = $i3geoUploadDataWL;
unset($i3geoUploadDataWL);
$_SESSION["i3geoEsquemasWL"] = $i3geoEsquemasWL;
unset($i3geoEsquemasWL);
$_SESSION["i3GeoProjDefault"] = $i3GeoProjDefault;
unset($i3GeoProjDefault);
include "head.php";
?>
	<div class="container-fluid migalha" >
		<div class="row">
			<div class="btn-group btn-breadcrumb">
				<a class="btn btn-default" href="../init/index.php?home="><span>i3Geo</span></a>
				<a class="btn btn-default" style="pointer-events: none"><span>Admin</span></a>
			</div>
		</div>
	</div>
	<div class="container">
		<div class="row center-block">
			<div class="col-sm-12 hidden">

						<div class="well">
						<h1>{{{adminI3geo}}}</h1>
						<p>{{{msgBemVindo}}}</p>
						<p>{{{msgLogin}}}</p>
						<p>{{{msgFerramentas}}}</p>
						<p>{{{msgUsr}}}</p>
						<p>{{{msgMetaestat}}}</p>
						<p>{{{msgUpload}}}</p>
						<p>{{{msgCatalogo}}}</p>
						<p>{{{msgCadastro}}}</p>
						<p>{{{msgSqlite}}}</p>
						<p>
							<a href="../documentacao/diagramas/mer_banco_de_dados_de_administracao.png"
								target="_blank">{{merBdAdmin}}</a><br>
							<a href="../documentacao/diagramas/cadastrodeusuarios/dbdocs/index.html"
								target="_blank">{{merBdUsr}}</a><br>
							<a href="../documentacao/diagramas/metaestat/dbdocs/index.html"
			                   target="_blank">{{{merBdMetaestat}}}</a><br>
						</p>
						</div>
						<div class="alert alert-warning">{{{leiaMe}}}</div>
                        <div class="alert alert-warning">{{{leiaMe1}}}</div>

			</div>
		</div>
	</div>
	<script type="text/javascript" src="js/core.js"></script>
	<script src="dicionario/principal.js"></script>
	<script>
	var inicia = function() {
		i3GEOadmin.core.loginOn();
		core_parseMustacheBody(i3GEOadmin.principal.dicionario);
		//vem de admin/index.js
		iniciaMenuPrincipal();
		$('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			$(this).parent().siblings().removeClass('open');
			$(this).parent().toggleClass('open');
		});
		$(".hidden").removeClass('hidden');
		$.material.init();
	};
	if(i3GEO.login.verificaCookieLogin() == true){
		inicia();
	} else {
		i3GEOadmin.core.erroLogin();
	}
	//i3GEO.login.verificaOperacao("admin/html/identifica",i3GEO.configura.locaplic, inicia, "sessao" ,i3GEOadmin.core.erroLogin);
	</script>
</body>
</html>
