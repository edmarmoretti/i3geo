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
if(empty($map_file) && file_exists($dir."/../../temas/{$layer}.map")){
	$versao = versao();
	$versao = $versao["principal"];
	if(!isset($base) || $base == "")
	{
		if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
		{$base = $locaplic."/aplicmap/geral1windowsv".$versao.".map";}
		else
		{
			if($base == "" && file_exists('/var/www/i3geo/aplicmap/geral1debianv'.$versao.'.map')){
				$base = "/var/www/i3geo/aplicmap/geral1debianv".$versao.".map";
			}
			if($base == "" && file_exists('/var/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
				$base = "/var/www/html/i3geo/aplicmap/geral1fedorav".$versao.".map";
			}
			if($base == "" && file_exists('/opt/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
				$base = "/opt/www/html/i3geo/aplicmap/geral1v".$versao.".map";
			}
			if($base == "")
			{$base = $locaplic."/aplicmap/geral1v".$versao.".map";}
		}
	}
	$map_file = $dir_tmp."/".nomeRandomico().".map";

	$mapa = ms_newMapObj($base);

	$tempMapa = ms_newMapObj($dir."/../../temas/{$layer}.map");
	$layern = $tempMapa->getlayer(0);
	ms_newLayerObj($mapa, $layern);
	$mapa->save($map_file);
	if(!empty($postgis_mapa)){
		substituiCon($map_file,$postgis_mapa);
	}
}
$m = new Atributos($map_file,$layer);
$registros = $m->listaRegistrosXY($coluna, "brasil", "tudo");
$n = count($registros);
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
	include_once($dir."/../../pacotes/heatmap/src/heatmap-openlayers.js");
}

?>