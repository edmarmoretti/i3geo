<?php
include_once(dirname(__FILE__)."/../safe.php");
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Valor: DISTANCIAPTPT

Calcula a distancia entre um ponto de origem e os pontos em um tema.

S&atilde;o considerados apenas os pontos próximos definidos por um buffer.

<Analise->distanciaptpt>
*/
	case "DISTANCIAPTPT":
		include_once(dirname(__FILE__)."/../../classesphp/classe_analise.php");
		copiaSeguranca($map_file);
		$m = new Analise($map_file,$_GET["temaorigem"],$locaplic,$ext);
		$temaoverlay = $m->criaBuffer($_GET["distancia"],$locaplic);
		$retorno = $m->distanciaptpt($_GET["temaorigem"],$_GET["temadestino"],$temaoverlay,$locaplic,$_GET["itemorigem"],$_GET["itemdestino"]);
		$m->salva();
		$_SESSION["contadorsalva"]++;
	break;
}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>