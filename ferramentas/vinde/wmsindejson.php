<?php
/*
echo
'[
		"2013 - Agricultura Irrigada",
		"http://www.geoservicos.inde.gov.br/geoserver/wms",
		{
			"layers": "MPOG:Agricultura_Irrigada",
			"format": "image/png",
			"transparent": true
		}
]
';
*/
/*
 * new OpenLayers.Layer.WMS('2013 - Agricultura Irrigada', 'http://www.geoservicos.inde.gov.br/geoserver/wms', {layers: 'MPOG:Agricultura_Irrigada', format: 'image/png', transparent: true}, {isBaseLayer: false, visibility: false, group: 'Planejamento/Planejamento/2013 - Agricultura Irrigada', metadataURL: 'http://www.metadados.inde.gov.br/geonetwork/srv/br/metadata.show.embedded?uuid=045663f7-5691-447a-8d06-ab692522328c', legendURL: 'http://www.geoservicos.inde.gov.br/geoserver/wms?service=WMS&version=1.1.0&request=GetLegendGraphic&layer=MPOG:Agricultura_Irrigada&format=image/png',kmlURL: 'http://www.geoservicos.inde.gov.br/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=MPOG:Agricultura_Irrigada&width=1024&height=768&bbox=-74,-34,-29,6&format=application/vnd.google-earth.kmz+xml',sldtema: '','maxExtent': new OpenLayers.Bounds(-55.389,-22.229,-37.808,-2.922), isBaseGroup: false, displayInLayerSwitcher: false, removable: false, groupOfKeeper: 'MP/2013 - Agricultura Irrigada', groupOfTheme: 'Planejamento/Planejamento/2013 - Agricultura Irrigada'}),
 */

include(dirname(__FILE__)."/../../ms_configura.php");
include($locaplic."/classesphp/funcoes_gerais.php");
$agora = intval(time() / 1000);
$arq = $dir_tmp."/inde$agora.html";
if(!file_exists($arq)){
	$ch = curl_init();
	if(!$ch){
		echo "erro curl_init";
		exit;
	}
	curl_setopt($ch, CURLOPT_URL, "http://www.visualizador.inde.gov.br/");
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	if(isset($i3geo_proxy_server) && $i3geo_proxy_server != ""){
		curl_setopt($ch, CURLOPT_PROXY, $i3geo_proxy_server);
	}
	$resultado = curl_exec($ch);
	curl_close($ch);

	$fp = fopen($arq,"w");
	fwrite($fp,$resultado);
	fclose($fp);
}
else{
	$resultado = file_get_contents($arq);
}
$convert = explode("\n", $resultado);

$n = count($convert);
$layers = array();
//$novalinha[] = "var servicosINDE = [";
//$convert= array(" new OpenLayers.Layer.WMS('2013 - Agricultura Irrigada', 'http://www.geoservicos.inde.gov.br/geoserver/wms',
//{layers: 'MPOG:Agricultura_Irrigada', format: 'image/png', transparent: true},
//{isBaseLayer: false, visibility: false, group: 'Planejamento/Planejamento/2013 - Agricultura Irrigada',
//metadataURL: 'http://www.metadados.inde.gov.br/geonetwork/srv/br/metadata.show.embedded?uuid=045663f7-5691-447a-8d06-ab692522328c',
//legendURL: 'http://www.geoservicos.inde.gov.br/geoserver/wms?service=WMS&version=1.1.0&request=GetLegendGraphic&layer=MPOG:Agricultura_Irrigada&format=image/png',
//kmlURL: 'http://www.geoservicos.inde.gov.br/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=MPOG:Agricultura_Irrigada&width=1024&height=768&bbox=-74,-34,-29,6&format=application/vnd.google-earth.kmz+xml',sldtema: '',
//'maxExtent': new OpenLayers.Bounds(-55.389,-22.229,-37.808,-2.922), isBaseGroup: false, displayInLayerSwitcher: false, removable: false, groupOfKeeper: 'MP/2013 - Agricultura Irrigada', groupOfTheme: 'Planejamento/Planejamento/2013 - Agricultura Irrigada'}),

$busca = array(
	array("layers","format:"),
	array("format","transparent:"),
	array("metadataURL","legendURL:"),
	array("groupOfKeeper","groupOfTheme:")
);
$grupos = array();
$gruposUnicos = array();
for ($i=0;$i<$n;$i++){
	if(stristr($convert[$i], 'new OpenLayers.Layer.WMS') != FALSE){
		$layer = array();
		$linha =  $convert[$i];

		$pt = "/(new OpenLayers\.Layer\.WMS\(\')(.*)',\s'(.*)',\s{/";
		preg_match_all($pt, $linha, $matches);
		//echo "<pre>";
		//var_dump($matches);exit;
		$nomeLayer = $matches[2][0];////converte($matches[2][0]);
		$layer[] = $nomeLayer;
		$parametros = array();
		$urlwms = $matches[3][0];
		if(count(explode("?",$urlwms)) == 1){
			$urlwms .= "?";
		}
		else{
			$urlwms = trim($urlwms,"&");
			$urlwms .= "&";
		}
		$parametros["url"] = $urlwms;
		foreach($busca as $b){
			$pt = "/($b[0]:\s\')(.*)(\'\, $b[1])/";
			preg_match_all($pt, $linha, $matches);

			$linhas = ($matches[2][0]);
			$parametros[$b[0]] = $linhas;
			if($b[0] == "groupOfKeeper"){
				if($gruposUnicos[$linhas] == ""){
					$gruposUnicos[$linhas] = "a";

					$linhas = $linhas." #$i";
					$grupos[$linhas] = "";
					//echo "<pre>";
					//var_dump($matches);
					if($grupos[$linhas]){
						$grupos[$linhas] = array_merge($grupos[$linhas],array("l_".$i));
					}
					else {
						$grupos[$linhas] = array("l_".$i);
					}
				}
			}
		}
		$layer[] = $parametros;
		$layers[$i] = $layer;
		//$parametros = "{".implode($novalinha,",")."}";
		//$linha = str_replace('new OpenLayers.Layer.WMS(','',$linha);
		//$linha = str_replace('})','}',$linha);
		//$linha = str_replace("'",'"',$linha);
		//$novalinha[] = "[".trim($linha,",")."]";
	}
}

//separa os grupos
//echo "<pre>";
//var_dump($grupos);exit;
$chaves = array_keys($grupos);
sort($chaves);
//echo count($chaves);exit;
$arvore = array();
foreach($chaves as $chave){
	//echo $chave."\n";
	$hs = explode("/",$chave);
	//echo count($hs);
	$d = $hs;
	array_shift($d);
	if($arvore[$hs[0]]){
		$arvore[$hs[0]] = array_merge($arvore[$hs[0]],noi($d,$arvore[$hs[0]]));
	}
	else{
		$arvore[$hs[0]] = noi($d,array());
	}
}
//var_dump($arvore);
//exit;
$final = array(
		"layers"=>$layers,
		"arvore"=>$arvore
);
error_reporting(0);
ob_end_clean();
if(extension_loaded('zlib'))
{ob_start('ob_gzhandler');}
header("Content-type: text/html");
echo json_encode($final,true);
if(extension_loaded('zlib'))
{ob_end_flush();}

//echo json_encode($novalinha,true);
//echo "{".implode($novalinha,",")."}";
//echo "[".$novalinha[0]."]";
function noi($n,$l){
	global $layers;
	//var_dump($n);
	$d = $n;
	array_shift($d);
	//echo count($n);
	if(count($n) > 1){
		if($l[$n[0]]){
			$l[$n[0]] = array_merge($l[$n[0]],$n[1]);
		}
		else{
			$l[$n[0]] = $n[1];
		}
		$l[$n[0]] = noi($d,$l);
		return $l;
	}
	//$n[1] = $layers[$n[0]];
	return $n;
}
function converte($texto)
{
	//if (!mb_detect_encoding($texto,"UTF-8",false))
	//{
		$texto = mb_convert_encoding($texto,"ISO-8859-1","AUTO");
	//}
	return $texto;
}
?>
