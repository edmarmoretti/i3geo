<?php
/**
Obtem os dados para geracao de mapa de calor. Envia o codigo javascript necessario se for solicitado.

Parametros:

carregajs sim|nao envia ou nao o codigo javascript

layer codigo da camada que fornecera os dados

coluna coluna que contem os dados

g_sid codigo da secao i3geo

nomevariavel nome da variavel javascript que sera retornada com os valores
 */
$dir = dirname(__FILE__);

//inicializa o programa verificando seguranca e pegando os parametros enviados pela URL e pela secao
include_once($dir."/../safe.php");
include_once($dir."/funcoes.php");
error_reporting(0);
$layer = $_GET["layer"];
$tipoGradiente = $_GET["tipoGradiente"];
$coluna = $_GET["coluna"];
$valorPonto = $_GET["valorPonto"];

//o plugin pode ser chamado sem um mapfile criado
//usando apenas o mapfile existente em i3geo/temas
//nesse caso e necessario criar um mapfile temporario
if($g_sid != ""){
	session_name("i3GeoPHP");
	session_id($g_sid);
	session_start();
	if(!empty($_SESSION["map_file"])){
		$mapateste = ms_newMapObj($_SESSION["map_file"]);
		if($mapateste->getlayerbyname($layer) != ""){
			$map_file = $_SESSION["map_file"];
		}
	}
}
$map_file = heatmapMapfile();
//no caso do SAIKU, o nome do mapfile pode estar na sessao
if($map_file == ""){
	session_name("i3GeoPHP");
	session_start();
	if(!empty($_SESSION["map_file"])){
		$mapateste = ms_newMapObj($_SESSION["map_file"]);
		if($mapateste->getlayerbyname($layer) != ""){
			$map_file = $_SESSION["map_file"];
		}
	}
}
$resultado = heatmapDados($map_file);
$gradiente = heatmapGradiente($map_file,$layer,$tipoGradiente);

if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
echo 'heatmap_dados = ['.implode(",",$resultado).'];';
echo 'heatmap_config = '.$gradiente.';';
?>