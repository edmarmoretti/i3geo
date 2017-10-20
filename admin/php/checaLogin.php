<?php
namespace admin\php\login;
//error_reporting(E_ALL ^E_NOTICE);
error_log("checaLogin OK",0);

// junta get e post
$_GET = array_merge ( $_GET, $_POST );
// black list
$bl = array (
		"exec(",
		"password",
		"_decode",
		"passthru",
		"shell_exec",
		"escapeshellarg",
		"escapeshellcmd",
		"proc_close",
		"proc_open",
		"popen",
		"contents",
		"delete",
		"drop",
		"update",
		"insert",
		"system",
		";"
);
// sanitiza as strings enviadas como parametros
if (isset ( $_GET )) {
	foreach ( array_keys ( $_GET ) as $k ) {
		$k = str_ireplace ( $bl, "", $k );
		$k = filter_var ( $k, FILTER_SANITIZE_STRING );
		if ($_GET [$k] != "''") {
			$v = strip_tags ( $_GET [$k] );
			$v = str_ireplace ( $bl, "", $v );
			$_GET [$k] = trim ( $v );
		}
	}
}
if (isset ( $_POST )) {
	foreach ( array_keys ( $_POST ) as $k ) {
		$k = str_ireplace ( $bl, "", $k );
		$k = filter_var ( $k, FILTER_SANITIZE_STRING );
		if ($_POST [$k] != "''") {
			$v = strip_tags ( $_POST [$k] );
			$v = str_ireplace ( $bl, "", $v );
			$_POST [$k] = trim ( $v );
		}
	}
}
// variaveis mais comuns
$funcao = isset($_GET['funcao']) ? $_GET['funcao'] : '';
$perfil = isset($_GET['perfil']) ? $_GET['perfil'] : '';
$tipo = isset($_GET['tipo']) ? $_GET['tipo'] : '';
$idioma = isset($_GET['idioma']) ? $_GET['idioma'] : '';
$publicado = isset($_GET['publicado']) ? $_GET['publicado'] : '';

$retorno = ""; // string que ser&aacute; retornada ao browser via JSON por default

function checaLogin(){
	session_write_close ();
	session_name ( "i3GeoLogin" );
	if (! empty ( $_COOKIE ["i3geocodigologin"] )) {
		session_id ( $_COOKIE ["i3geocodigologin"] );
		session_start ();
		if(empty($_SESSION["locaplic"])){
			if(defined("ONDEI3GEO")){
				header("Location:" . ONDEI3GEO . "/admin/index.php");
			}
			//header ( "HTTP/1.1 403 Inicie o sistema pela pagina principal" );
			exit;
		}
		//verifica tambem se o usuario entrou pela pagina de administracao principal
		if ($_SESSION ["usuario"] != $_COOKIE ["i3geousuariologin"] || $_SESSION ["initOk"] != true ) {
			$_COOKIE = array ();
			$_SESSION = array ();
			session_destroy ();
			if($_SESSION ["initOk"] != true){
				header ( "HTTP/1.1 403 Inicie pela pagina principal" );
				exit;
			} else {
				header ( "HTTP/1.1 403 Usuario nao logado" );
			}
			exit ();
		}
	} else {
		if(defined("ONDEI3GEO")){
			header("Location:" . ONDEI3GEO . "/admin/index.php");
		} else {
			header ( "HTTP/1.1 403 Usuario nao logado" );
		}
		exit ();
	}
	// verifica se o login pode ser realizado
	if ($_SESSION["i3geoPermiteLogin"] == false) {
		header ( "HTTP/1.1 403 Login desativado" );
		exit ();
	}
	// checa a lista branca de IPs
	if (! empty ( $_SESSION["i3geoPermiteLoginIp"] )) {
		$ipaddress = '';
		if (getenv ( 'HTTP_CLIENT_IP' ))
			$ipaddress = getenv ( 'HTTP_CLIENT_IP' );
			else if (getenv ( 'HTTP_X_FORWARDED_FOR' ))
				$ipaddress = getenv ( 'HTTP_X_FORWARDED_FOR' );
				else if (getenv ( 'HTTP_X_FORWARDED' ))
					$ipaddress = getenv ( 'HTTP_X_FORWARDED' );
					else if (getenv ( 'HTTP_FORWARDED_FOR' ))
						$ipaddress = getenv ( 'HTTP_FORWARDED_FOR' );
						else if (getenv ( 'HTTP_FORWARDED' ))
							$ipaddress = getenv ( 'HTTP_FORWARDED' );
							else if (getenv ( 'REMOTE_ADDR' ))
								$ipaddress = getenv ( 'REMOTE_ADDR' );
								else
									$ipaddress = 'UNKNOWN';
									if (! in_array ( $ipaddress, $_SESSION["i3geoPermiteLoginIp"] )) {
										header ( "HTTP/1.1 403 Login nao permitido para o ip" );
										exit ();
									}
	}
}
?>