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
include_once($dir."/../inicia.php");

//pega os dados e formata como uma string no formato
// [{"lat":"-21.7079984","lng":"-47.4913629","count":"1"}]
//os dados sao devolvidos como uma variavel javascript
//obtem os registros
include_once($dir."/../../classesphp/classe_atributos.php");

$m = new Atributos($map_file,$layer);
$registros = $m->listaRegistrosXY($coluna, "brasil", "tudo");
//TODO
$n = 100;//count($registros);
$resultado = array();
if(empty($coluna)){
	foreach($registros as $r){
		$resultado[] = '{"lat":"'.$r["y"].'","lng":"'.$r["x"].'","count":"1"}';
	}
}
else{
	foreach($registros as $r){
		$resultado[] = '{"lat":"'.$r["y"].'","lng":"'.$r["x"].'","count":"'.$r[$coluna].'"}';
	}
}
if (!connection_aborted()){
	if(isset($map_file) && isset($postgis_mapa) && $map_file != "")
		restauraCon($map_file,$postgis_mapa);
}

echo $nomevariavel.' = ['.implode(",",$resultado).'];';
if($carregajs === "sim"){
	include_once($dir."/../../pacotes/heatmap/src/heatmap.js");
	//include_once($dir."/../../pacotes/heatmap/src/heatmap-openlayers-renderer.js");
	include_once($dir."/../../pacotes/heatmap/src/heatmap-gmaps.js");
}

?>
