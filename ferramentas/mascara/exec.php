<?php
include_once(dirname(__FILE__)."/../safe.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
	//lista os layers que sao mascarados por tema
	case "LISTATEMAS":
		$map = ms_newMapObj($map_file);
		$c = $map->numlayers;
		$retorno = array();
		for ($i=0;$i < $c;++$i)	{
			$l = $map->getlayer($i);
			if($l->mask == $tema){
				$retorno[] = $tema;
			}
		}
	break;
	case "APLICAR":
		$map = ms_newMapObj($map_file);
		$c = $map->numlayers;
		$mascarar = explode(",",$_GET["mascarar"]);
		for ($i=0;$i < $c;++$i)	{
			$l = $map->getlayer($i);
			if($l->mask == $tema){
				$l->mask = "";
			}
			if(in_array($l->name,$mascarar)){
				$l->mask = $tema;
				$l->setmetadata("cache","nao");
			}
		}
		$map->save($map_file);
	break;
}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>