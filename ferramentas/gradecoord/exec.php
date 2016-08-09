<?php
include_once(dirname(__FILE__)."/../safe.php");
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
	case "GRADECOORD":
		include_once("../../classesphp/classe_mapa.php");
		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
		$m->gradeCoord($_GET["intervalo"],$_GET["corlinha"],$_GET["larguralinha"],$_GET["tipolinha"],$_GET["tamanhotexto"],$_GET["fonte"],$_GET["cortexto"],$_GET["incluitexto"],$_GET["mascara"],$_GET["shadowcolor"],$_GET["shadowsizex"],$_GET["shadowsizey"]);
		$m->salva();
		$retorno = "ok";
	break;
}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>