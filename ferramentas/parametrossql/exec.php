<?php
include_once(dirname(__FILE__)."/../inicia.php");
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Valor: APLICAR

Aplica a substituicao de chaves pelos valores enviados
*/
	case "APLICAR":
		$map = ms_newMapObj($map_file);
		$layer = $map->getlayerbyname($tema);
		$data = $layer->data;
		//verifica se o layer ja teve os parametros substituidos anteriormente
		//nesse caso, o data he obtido do metadata que guarda o valor original
		if($layer->getmetadata("DATAORIGINAL") != ""){
			$data = $layer->getmetadata("DATAORIGINAL");
		}
		else{
			$layer->setmetadata("DATAORIGINAL",$data);
		}
		$filtro = $layer->getFilterString();
		if($layer->getmetadata("FILTROORIGINAL") != ""){
			$filtro = $layer->getmetadata("FILTROORIGINAL");
		}
		else{
			$layer->setmetadata("FILTROORIGINAL",$filtro);
		}
		$chaves = explode(",",$chaves);
		$valores = explode(",",$valores);
		$n = count($chaves);
		for($i = 0; $i < $n; $i++){
			$data = str_replace($chaves[$i],$valores[$i],$data);
			if($filtro != ""){
				$filtro = str_replace($chaves[$i],$valores[$i],$filtro);
			}
		}
		if($filtro != ""){
			$layer->setfilter($filtro);
		}
		$data = str_replace("--","",$data);
		$layer->set("data",$data);
		$layer->set("status",MS_DEFAULT);
		$layer->setmetadata("PLUGINI3GEO","");
		$layer->setmetadata("TEMA",$layer->getmetadata("TEMA")." - ".implode(",",$valores));
		$layer->set("name","plugin".nomeRandomico());
		if (connection_aborted()){
			exit();
		}
		$salvo = $map->save($map_file);
		$retorno = "ok";
	break;
	case "REMOVER":
		$map = ms_newMapObj($map_file);
		$layer = $map->getlayerbyname($tema);
		if($layer != ""){
			$layer->set("status",MS_DELETE);
			$salvo = $map->save($map_file);
		}
		$retorno = "ok";
	break;
	case "INCLUDEPROG":
		if(file_exists($locaplic."/".$prog)){
			include($locaplic."/".$prog);
		}
	break;
}
if (!connection_aborted()){
	cpjson($retorno);
}
else
{exit();}
?>