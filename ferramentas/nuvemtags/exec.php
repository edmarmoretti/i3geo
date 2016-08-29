<?php
include_once(dirname(__FILE__)."/../safe.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Valor: LISTATAGS

Pega a lista de tags registrados nos menus de temas.

<Menutemas->listatags>
*/
	case "LISTATAGS":
		include_once(dirname(__FILE__)."/../../classesphp/classe_menutemas.php");
		$m = new Menutemas($map_file,$perfil,$locaplic,$_GET["urli3geo"]);
		$retorno = $m->listatags($_GET["rss"],$_GET["nrss"]);
	break;

}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>