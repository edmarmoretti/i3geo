<?php
//TODO verificar login
include_once(dirname(__FILE__)."/../safe.php");
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
	case "METADATA":
		$mapa = ms_newMapObj($map_file);
		$l = $mapa->getlayerbyname($tema);
		if($l != ""){
			$l->setmetadata($_GET["meta"],$_GET["valor"]);
			$mapa->save($map_file);
		}
		$retorno = "ok";
	break;
	case "MUDATRANSP":
	    include_once ($locaplic."/classesphp/classe_temas.php");
	    $m = new Temas($map_file, $tema);
	    $m->mudaTransparencia($_GET["valor"]);
	    $m->salva($map_file);
	    $retorno = "ok";
	    break;
}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>