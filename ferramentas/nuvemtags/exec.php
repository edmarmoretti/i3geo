<?php
include_once(__DIR__."/../inicia.php");
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
		include_once(__DIR__."/../../classesphp/classe_menutemas.php");
		$m = new Menutemas($map_file,$perfil,$locaplic,$urli3geo);
		$retorno = $m->listatags($rss,$nrss);
	break;

}
if (!connection_aborted()){
	if(isset($map_file) && isset($postgis_mapa) && $map_file != "")
	restauraCon($map_file,$postgis_mapa);
	cpjson($retorno);
}
else
{exit();}
?>