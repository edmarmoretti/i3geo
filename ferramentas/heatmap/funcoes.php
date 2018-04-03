<?php
function heatmapDados($map_file){
	global $dir,$layer,$coluna,$valorPonto;
	//pega os dados e formata como uma string no formato
	// [{"lat":"-21.7079984","lng":"-47.4913629","count":"1"}]
	//os dados sao devolvidos como uma variavel javascript
	//obtem os registros
	include_once($dir."/../../classesphp/classe_atributos.php");
	$m = new Atributos($map_file,$layer);
	$registros = $m->listaRegistrosXY($coluna, "brasil", "tudo");
	$n = count($registros);
	$resultado = array();
	if(empty($valorPonto)){
		$valorPonto = 1;
	}
	if(empty($coluna)){
		foreach($registros as $r){
			$resultado[] = '{"lat":"'.$r["y"].'","lng":"'.$r["x"].'","count":"'.$valorPonto.'"}';
		}
	}
	else{
		foreach($registros as $r){
			$resultado[] = '{"lat":"'.$r["y"].'","lng":"'.$r["x"].'","count":"'.$r["valores"][0]["valor"].'"}';
		}
	}
	if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
		restauraCon($map_file,$postgis_mapa);
	}

	return $resultado;
}
function heatmapMapfile(){
	global $dir,$map_file,$layer,$base,$locaplic,$dir_tmp,$postgis_mapa;
	if(empty($map_file) && file_exists($dir."/../../temas/{$layer}.map")){
		$versao = versao();
		$versao = $versao["principal"];
		if(!isset($base) || $base == "")
		{
			if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
			{
				$base = $locaplic."/aplicmap/geral1windowsv".$versao.".map";
			}
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
				{
					$base = $locaplic."/aplicmap/geral1v".$versao.".map";
				}
			}
		}
		$map_file = $dir_tmp."/".nomeRandomico().".map";

		$mapa = ms_newMapObj($base);

		$tempMapa = ms_newMapObj($dir."/../../temas/{$layer}.map");
		$layern = $tempMapa->getlayer(0);
		ms_newLayerObj($mapa, $layern);
		$mapa->save($map_file);
		if(!empty($postgis_mapa)){
			restauraCon($map_file,$postgis_mapa);
		}
	}
	return $map_file;
}
function heatmapGradiente($map_file,$layer,$tipoGradiente){
	if($tipoGradiente == "default"){
		$gradiente = '{"gradient":{"0.1" : "rgb(0,0,255)","0.55" : "rgb(0,255,255)","0.65" : "rgb(0,255,0)","0.95" : "rgb(255,255,0)","1.0" : "rgb(255,0,0)"}}';
		$mapa = ms_newMapObj($map_file);
		$l = $mapa->getlayerbyname($layer);
		$nc = $l->numclasses;
		for ($c = 0;$c < $nc;$c++){
			$classe = $l->getclass($c);
			$classe->set("status",MS_DELETE);
		}
		$classe = ms_newClassObj($l);
		$classe->set("name"," < ");
		$novoestilo = ms_newStyleObj($classe);
		$novoestilo->set("symbolname","ponto");
		$novoestilo->set("size","12");
		$cor = $novoestilo->color;
		$cor->setRGB(0,0,255);

		$classe = ms_newClassObj($l);
		$classe->set("name"," ");
		$novoestilo = ms_newStyleObj($classe);
		$novoestilo->set("symbolname","ponto");
		$novoestilo->set("size","12");
		$cor = $novoestilo->color;
		$cor->setRGB(0,255,255);

		$classe = ms_newClassObj($l);
		$classe->set("name"," ");
		$novoestilo = ms_newStyleObj($classe);
		$novoestilo->set("symbolname","ponto");
		$novoestilo->set("size","12");
		$cor = $novoestilo->color;
		$cor->setRGB(0,255,0);

		$classe = ms_newClassObj($l);
		$classe->set("name"," ");
		$novoestilo = ms_newStyleObj($classe);
		$novoestilo->set("symbolname","ponto");
		$novoestilo->set("size","12");
		$cor = $novoestilo->color;
		$cor->setRGB(255,255,0);

		$classe = ms_newClassObj($l);
		$classe->set("name"," > ");
		$novoestilo = ms_newStyleObj($classe);
		$novoestilo->set("symbolname","ponto");
		$novoestilo->set("size","12");
		$cor = $novoestilo->color;
		$cor->setRGB(255,0,0);

		$mapa->save($map_file);
	}
	else{
		$gradiente = array();
		$mapa = ms_newMapObj($map_file);
		$l = $mapa->getlayerbyname($layer);
		$nc = $l->numclasses;
		for ($c = 0;$c < $nc;$c++){
			$classe = $l->getclass($c);
			$estilo = $classe->getstyle(0);
			$nome = $classe->name;
			$cor = $estilo->color;
			$scor = "rgb(".$cor->red.",".$cor->green.",".$cor->blue.")";
			$gradiente[$nome] = $scor;
		}
		//echo $map_file;exit;
		$gradiente = json_encode(array("gradient"=>$gradiente));
	}
	return $gradiente;
}
?>