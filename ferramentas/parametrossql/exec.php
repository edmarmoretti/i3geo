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
		$chaves = explode(",",$chaves);
		$valores = explode(",",$valores);
		$n = count($chaves);
		for($i = 0; $i < $n; $i++){
			$data = str_replace($chaves[$i],$valores[$i],$data);
		}
		$layer->set("data",$data);
		$layer->set("status",MS_DEFAULT);
		$layer->setmetadata("PLUGINI3GEO","");
		if (connection_aborted()){exit();}
		$salvo = $map->save($map_file);
		$retorno = "ok";
	break;
	case "REMOVER":
		$map = ms_newMapObj($map_file);
		$layer = $map->getlayerbyname($tema);
		$layer->set("status",MS_DELETE);
		$salvo = $map->save($map_file);
		$retorno = "ok";
	break;
}
if (!connection_aborted()){
	cpjson($retorno);
}
else
{exit();}
?>