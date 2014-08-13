<?php
/**
Obtem os dados para geracao de mapa de markercluster. Envia o codigo javascript necessario se for solicitado.

Parametros:

carregajs sim|nao envia ou nao o codigo javascript

layer codigo da camada que fornecera os dados

coluna coluna que contem os dados

g_sid codigo da secao i3geo

nomevariavel nome da variavel javascript que sera retornada com os valores

 */
$dir = dirname(__FILE__);
//inicializa o programa verificando seguranca e pegando os parametros enviados pela URL e pela secao
include_once($dir."/../inicia.php");

//pega os dados e formata como uma string no formato
// [{"lat":"-21.7079984","lng":"-47.4913629","count":"1"}]
//os dados sao devolvidos como uma variavel javascript
//obtem os registros
include_once($dir."/../../classesphp/classe_atributos.php");
//o plugin pode ser chamado sem um mapfile criado
//usando apenas o mapfile existente em i3geo/temas
//nesse caso e necessario cirar um mapfile temporario

//no caso do SAIKU, o nome do mapfile pode estar na sessao
session_name("i3GeoPHP");
session_start();
if(!empty($_SESSION["map_file"])){
	$mapateste = ms_newMapObj($_SESSION["map_file"]);
	if($mapateste->getlayerbyname($layer) != ""){
		$map_file = $_SESSION["map_file"];
	}
}

$map_file = heatmapMapfile();
$resultado = heatmapDados($map_file);

echo $nomevariavel.' = ['.implode(",",$resultado).'];';
if($carregajs === "sim"){
	include_once($dir."/../../pacotes/markercluster/openlayers/AnimatedCluster.js");
}
?>