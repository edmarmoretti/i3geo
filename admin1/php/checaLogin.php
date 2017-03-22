<?php
error_reporting ( E_ALL );
error_log("checaLogin teste",0);

// para nao ocorrer tentativa de uso direto
if (basename ( __FILE__ ) == basename ( $_SERVER ['SCRIPT_FILENAME'] )) {
	exit ();
}
// verifica se o login pode ser realizado
if (isset ( $i3geoPermiteLogin ) && $i3geoPermiteLogin == false) {
	header ( "HTTP/1.1 403 Login desativado" );
	exit ();
}
// checa a lista branca de IPs
if (isset ( $i3geoPermiteLoginIp ) && ! empty ( $i3geoPermiteLoginIp )) {
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
	if (! in_array ( $ipaddress, $i3geoPermiteLoginIp )) {
		header ( "HTTP/1.1 403 Login nao permitido" );
		exit ();
	}
}
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
if (empty($_GET)){
	exit;
}
// variaveis mais comuns
$funcao = $_GET ["funcao"];
$perfil = $_GET ["perfil"];
$tipo = $_GET ["tipo"];
$idioma = $_GET ["idioma"];
$publicado = $_GET ["publicado"];

session_write_close ();
session_name ( "i3GeoLogin" );
if (! empty ( $_COOKIE ["i3geocodigologin"] )) {
	session_id ( $_COOKIE ["i3geocodigologin"] );
	session_start ();
	if(empty($_SESSION["locaplic"])){
		header ( "HTTP/1.1 403 Locaplic nao definido na sessao" );
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
	header ( "HTTP/1.1 403 Usuario nao logado" );
	exit ();
}
$retorno = ""; // string que ser&aacute; retornada ao browser via JSON por default
?>
