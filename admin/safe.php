<?php
include_once (dirname(__FILE__)."/../classesphp/sani_request.php");
$_GET = array_merge($_GET,$_POST);
if(!empty($_GET["g_sid"])){
	$g_sid = $_GET["g_sid"];
	session_name("i3GeoPHP");
	session_id($g_sid);
	session_start();
	$statusFerramentas = $_SESSION["statusFerramentas"];
	$imgurl = $_SESSION["imgurl"];
	$tmpurl = $_SESSION["tmpurl"];
	$map_file = $_SESSION["map_file"];
	$mapext = $_SESSION["mapext"];
	$locaplic = $_SESSION["locaplic"];
	$mapext = $_SESSION["mapext"];
	$ler_extensoes = $_SESSION["ler_extensoes"];
	$perfil = $_SESSION["perfil"];
	$interface = $_SESSION["interface"];
	$kmlurl = $_SESSION["kmlurl"];
	$mapdir = $_SESSION["mapdir"];
	$imgdir = $_SESSION["imgdir"];
	$contadorsalva = $_SESSION["contadorsalva"];
	$fingerprint = $_SESSION['fingerprint'];
	$editores = $_SESSION['editores'];
}
else{
	$g_sid = "";
}
//variaveis mais comuns
$funcao = $_GET["funcao"];
$perfil = $_GET["perfil"];
$tipo = $_GET["tipo"];
$tipoRetorno = $_GET["tipoRetorno"];
$idioma = $_GET["idioma"];
$movimento = $_GET["movimento"];
$tabela = $_GET["tabela"];
$publicado = $_GET["publicado"];

$nivel = $_GET["nivel"];
$id_menu = $_GET["id_menu"];
$id_grupo = $_GET["id_grupo"];
$id_subgrupo = $_GET["id_subgrupo"];

$id_n1 = $_GET["id_n1"];
$id_n2 = $_GET["id_n2"];
$id_n3 = $_GET["id_n3"];
$id_raiz = $_GET["id_raiz"];
$id_tema = $_GET["id_tema"];
$ordem = $_GET["ordem"];

testaSafeNumerico([$id_subgrupo,$id_grupo,$ordem,$nivel,$id_menu,$id_n1,$id_n2,$id_n3,$id_raiz,$id_tema]);

if(isset($fingerprint) && !empty($g_sid))	{
	$f = explode(",",$fingerprint);
	if($f[0] != md5('I3GEOSEC' . $_SERVER['HTTP_USER_AGENT'] . session_id())){
		cpjson(". Tentativa de acesso nao permitida. Inicie um novo mapa.");
		return;
	}
}
function testaSafeNumerico($valores){
	foreach ($valores as $valor) {
		if(!empty($valor) && !is_numeric($valor)) {
			ob_clean();
			header ( "HTTP/1.1 403 valor nao numerico" );
			exit;
		}
	}
}
?>