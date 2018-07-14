<?php
//http://localhost/i3geo/ferramentas/vinde/wmsindejson.php
include(dirname(__FILE__)."/../../ms_configura.php");
include(dirname(__FILE__)."/../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);

include($locaplic."/classesphp/funcoes_gerais.php");
$agora = intval(time() / 10000);
$arq = $dir_tmp."/inde$agora.html";
if(!file_exists($arq)){
	$ch = curl_init();
	if(!$ch){
		echo "erro curl_init";
		exit;
	}
    set_time_limit(0);
	curl_setopt($ch, CURLOPT_URL, "http://www.visualizador.inde.gov.br/");
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_TIMEOUT, 120);
	if(isset($i3geo_proxy_server) && $i3geo_proxy_server != ""){
		curl_setopt($ch, CURLOPT_PROXY, $i3geo_proxy_server);
	}
	$resultado = curl_exec($ch);
	curl_close($ch);
	if($resultado != ""){
		$fp = fopen($arq,"w");
		fwrite($fp,$resultado);
		fclose($fp);
	}
}
else{
	$resultado = file_get_contents($arq);
}
$resultado = str_replace("<?","",$resultado);
$convert = explode("\n", $resultado);

$n = count($convert);
$layers = array();
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
		$nomeLayer = $matches[2][0];
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

			$linhas = $matches[2][0];

			$parametros[$b[0]] = $linhas;
			if($b[0] == "groupOfKeeper"){
				if(empty($gruposUnicos[$linhas])){
					$gruposUnicos[$linhas] = "a";
					$linhas = $linhas." #$i";
					$grupos[$linhas] = "";
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
	}
}
$chaves = array_keys($grupos);
sort($chaves);
$arvore = array();
foreach($chaves as $chave){
	//remove outras /
    $p1 = explode("/",$chave);
    $chave = $p1[0]."||";
    $p1[0] = "";
    $chave = $chave . implode(" ",$p1);
    $hs = explode("||",$chave);
	$d = $hs;
	array_shift($d);
	if(array_key_exists(0,$hs) && array_key_exists($hs[0],$arvore)){
		$arvore[$hs[0]] = array_merge($arvore[$hs[0]],noi($d,$arvore[$hs[0]]));
	    //$arvore[$hs[0]] = array_merge($arvore[$hs[0]],$d);
	}
	else{
		$arvore[$hs[0]] = noi($d,array());
	    //$arvore[$hs[0]] = $d;
	}
}
$final = array(
		"layers"=>$layers,
		"arvore"=>$arvore
);
//teste
//$final = json_encode($final);
//$final = json_decode($final);

//error_reporting(0);
ob_end_clean();
if(extension_loaded('zlib')){
	ob_start('ob_gzhandler');
}
header("Content-type: application/json");
echo json_encode($final,true);
if(extension_loaded('zlib')){
	ob_end_flush();
}
function noi($n,$l){
	global $layers;
	$d = $n;
	array_shift($d);
	if(count($n) > 1){
		if(array_key_exists(0,$n) && array_key_exists($n[0],$l)){
			if(is_array($n[1])){
				$l[$n[0]] = array_merge($l[$n[0]],$n[1]);
			}
			else{
				$l[$n[0]] = $l[$n[0]];
			}
		}
		else{
			$l[$n[0]] = $n[1];
		}
		$l[$n[0]] = noi($d,$l);
		return $l;
	}
	return $n;
}
function converte($texto)
{
	$texto = mb_convert_encoding($texto,"ISO-8859-1","AUTO");
	return $texto;
}
?>
