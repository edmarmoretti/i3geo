<?php
exit;
/**
 * Utilize proxy.php para acessar URLs por intermedio do servidor, via CURL
 * Voce pode usar o parametro proxy?url=
 * ou entao, enviar a URL e seus parametros apos o sinal "?"
 * http://localhost/i3geo/classesphp/proxy.php?http://localhost/i3geo/classesphp/mapa_openlayers.php?g_sid=e7oi2d2645gt712e4cjmt93pf5&TIPOIMAGEM=nenhum&DESLIGACACHE=sim&layer=mundo&REQUEST=getfeature&service=wfs&version=1.0.0&OUTPUTFORMAT=gml2
 *
 * Para controlar o retorno dos dados, utilize o arametro &tipoRetornoProxy, que pode ter os seguintes valores:
 * (se nao for definido retorna no formato nativo)
 *
 * string - retorna o resultado nativo entre aspas simples
 * gml2json - converte um formato GML2 em geoJson (util em chamadas getfeatureinfo)
 */
if(!isset($i3geo_proxy_server)){
	include(dirname(__FILE__)."/../ms_configura.php");
}

//echo $_SERVER ["SERVER_NAME"].":".$_SERVER ["SERVER_PORT"]."/".basename($locaplic)."/i3geo/ogc.php";
//exit;

$ch = curl_init();
if(!$ch){
	echo "erro curl_init";
	exit;
}

if($_GET["url"]){
	curl_setopt($ch, CURLOPT_URL, $_GET["url"]);
}
else{
	curl_setopt($ch, CURLOPT_URL, $_SERVER["QUERY_STRING"]);
}
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
if(isset($i3geo_proxy_server) && $i3geo_proxy_server != ""){
	curl_setopt($ch, CURLOPT_PROXY, $i3geo_proxy_server);
}
$resultado = curl_exec($ch);

if($_GET["tipoRetornoProxy"] == "string"){
	echo '"'.$resultado.'"';
	exit;
}

if($_GET["tipoRetornoProxy"] == "gml2wkt"){
	echo gml2wkt($resultado);
	exit;
}

echo $resultado;

function gml2wkt($gml){
	// Parse GML file
	include("funcoes_gerais.php");
	$k = array_keys($_GET);
	session_name("i3GeoPHP");
	session_id($_GET[$k[0]]);
	session_start();
	//var_dump($_SESSION);exit;
	$nome = $_SESSION["dir_tmp"]."/gml_".nomeRandomico();
	$nomegml = $nome.".gml";
	$nomemap = $_SESSION["map_file"];
	$gml = str_replace("xsi:schemaLocation","erro",$gml);
	gravaDados(array($gml),$nomegml);
	$map = new mapObj($nomemap);
	$layer = ms_newLayerObj($map);
	$layer->setConnectionType(MS_OGR);
	$layer->set("connection",$nomegml);
	$layer->set("template","none.html");
	$layer->set("type",MS_LAYER_POLYGON);
	$layer->set("name",$nome);
	$layer->set("status",MS_DEFAULT);
	$layer->setmetadata("tema",$nome);
	$classe = ms_newClassObj($layer);
	$novoestilo = ms_newStyleObj($classe);
	$ncor = $novoestilo->color;
	$ncor->setrgb(255,255,255);
	//$map->save($nomemap);
	//exit;
	$layer->queryByrect($map->extent);
	$sopen = $layer->open();
	$shape = $layer->getShape($layer->getResult(0));
	$wkt = $shape->towkt();
	return json_encode(array($wkt));
}
?>